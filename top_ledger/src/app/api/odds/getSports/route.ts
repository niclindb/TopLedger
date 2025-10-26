import { NextResponse } from 'next/server'

type Sport = { id: string; name: string }

export async function GET() {
  const apiKey = process.env.ODDS_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing ODDS_KEY environment variable', sports: [] },
      { status: 500 }
    )
  }

  const url = `https://api.the-odds-api.com/v4/sports?apiKey=${encodeURIComponent(apiKey)}`

  try {
    const res = await fetch(url)
    if (!res.ok) {
      const body = await res.text()
      return NextResponse.json(
        { error: `Odds provider error: ${res.status} - ${body}`, sports: [] },
        { status: res.status }
      )
    }

    const data = await res.json()
    // The Odds API returns an array of sport objects. Map to simple {id,name}
    const sports: Sport[] = data
      .filter((sport: any) => sport.active && !sport.has_outrights)
      .map((sport: any) => ({
          id: sport.key,
          name: sport.title,
      }));

    return NextResponse.json({ error: null, sports }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Unexpected fetch error', sports: [] },
      { status: 500 }
    )
  }
}
