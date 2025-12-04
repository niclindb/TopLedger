import { NextRequest, NextResponse } from 'next/server'

type Bet = { label: string; odds: string, point?: string }
type Game = {
  id: string
  sport: string
  home: string
  away: string
  startsAt: string
  bets: Bet[]
}


export async function GET(request: NextRequest) {
  const sport = request.nextUrl.searchParams.get('sport')
  if (!sport) {
    return NextResponse.json({ error: 'Missing sport query param', games: [] }, { status: 400 })
  }

  const apiKey = process.env.ODDS_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing ODDS_KEY environment variable', games: [] }, { status: 500 })
  }
  const url = new URL(`https://api.the-odds-api.com/v4/sports/upcoming/odds`)
  url.searchParams.set('regions', 'us')
  url.searchParams.set('sport', sport)
  url.searchParams.set('oddsFormat', 'american')
  url.searchParams.set('markets', 'h2h,spreads,totals')
  url.searchParams.set('apiKey', apiKey)

  try {
    const res = await fetch(url.toString())
    if (!res.ok) {
      const body = await res.text()
      return NextResponse.json(
        { error: `Odds provider error: ${res.status} - ${body}`, games: [] },
        { status: res.status }
      )
    }

    const data = await res.json()

    const games: Game[] = data.map((game: any) => ({
        id: game.id,
        sport: game.sport_key,
        home: game.home_team,
        away: game.away_team,
        startsAt: game.commence_time,
        bets: game.bookmakers[0]?.markets.flatMap((market: any) =>
            market.outcomes.map((outcome: any) => ({
                label: outcome.name,
                odds: outcome.price.toString(),
                point: market.key !== 'h2h' ? outcome.point.toString() : undefined,
            }))
        ) || [],
    }));

    return NextResponse.json({ error: null, games }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Unexpected fetch error', games: [] },
      { status: 500 }
    )
  }
}