 import type { NextRequest } from 'next/server'
  import postgres from 'postgres'

  const sql = postgres(process.env.POSTGRES_URL!)

// Get the plants
  export async function GET(request: NextRequest) {
    const pageLength = 10 //how many items per page
    
    const page = parseInt(request.nextUrl.searchParams.get('page') ?? '1')
    const pageOffset = (page - 1) * pageLength

    const search = request.nextUrl.searchParams.get('search') ?? ''
    const continent = request.nextUrl.searchParams.get('continent') ?? ''
    const shade = request.nextUrl.searchParams.get('shade') ?? ''
    
    const searchFilter = search ? sql`AND name ILIKE ${'%' + search + '%'}` : sql``;
    const continentFilter = continent ? sql`AND origin_continent::text = ${continent}` : sql``;
    

    const rows =  await sql`SELECT *, COUNT(*) OVER() as TOTAL FROM Plant WHERE TRUE ${searchFilter} 
    ${continentFilter} ORDER BY name LIMIT 10 OFFSET ${pageOffset}`; 

    const total = rows.length > 0 ? parseInt(rows[0].total) : 0

    return Response.json({
        plants: rows.map(({ total: _, ...p }) => p),   
        pages: Math.ceil(total / pageLength)
    })


  }
    // read query params from the URL e.g. /api/plants?s