import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()

    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      )
    }

    // Check if username or email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('Users')
      .select('username, email')
      .or(`username.eq.${username},email.eq.${email}`)
      .maybeSingle()

    if (checkError) {
      console.error('Error checking username:', checkError)
      return NextResponse.json(
        { error: 'Database error occurred' },
        { status: 500 }
      )
    }

    if (existingUser) {
      if (existingUser.username === username) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
      }
      if (existingUser.email === email) {
        return NextResponse.json({ error: 'Email already taken' }, { status: 409 })
      }
    }


    // Create the user account
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      return NextResponse.json(
        { error: signUpError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      )
    }

    // Create user profile in database
    const { error: insertError } = await supabase
      .from('Users')
      .insert({
        id: authData.user.id,
        username: username,
        email: email,
        total_profit: 0,
        profit_last_month: 0,
        profit_last_year: 0,
        overall_win_percent: 0
      })

    if (insertError) {
      console.error('Error creating user profile:', insertError)
      return NextResponse.json(
        { error: 'Account created but profile setup failed' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Success' },
      { status: 201 }
    )

  } catch (error) {
    console.error('Signup API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}