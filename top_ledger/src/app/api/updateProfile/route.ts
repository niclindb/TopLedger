import { NextRequest, NextResponse } from 'next/server'
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE! // Use the service key since this is server-side
);

export async function POST(request: NextRequest) {
  try {
    const { betId } = await request.json();
    
    if (!betId) {
      return NextResponse.json({ error: "Missing betId" }, { status: 400 });
    }

    const { data: betRow } = await supabase
    .from("Bets")
    .select("user_id")
    .eq("id", betId)
    .single();

    await supabase.rpc('get_user_stats', { user_id_input: betRow?.user_id });
    
    return NextResponse.json({ ok: true, betId });
  } catch (error) {
    console.error("Error in POST /api route:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
