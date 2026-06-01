import { writeFileSync, unlinkSync } from 'fs'
import { join } from 'path'
import { randomUUID } from 'crypto'
import type { NextRequest } from 'next/server'

const max_MB_size = 10;
const MAX_SIZE = max_MB_size * 1024 * 1024 // 10MB in bytes
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function POST(request: NextRequest) {
    const formData = await request.formData()
    const file = formData.get('photo') as File | null

    if (!file)
        return Response.json({ error: 'No file' }, { status: 400 })
    if (!ALLOWED_TYPES.includes(file.type))
        return Response.json({ error: 'Invalid type' }, { status: 400 })
    if (file.size > MAX_SIZE)
        return Response.json({ error: `Too large (max ${max_MB_size}MB)` }, { status: 400 })

    const ext = file.type.split('/')[1]                    // 'image/webp' → 'webp'
    const filename = `${randomUUID()}.${ext}`              // e.g. 'a1b2c3.webp'
    const buffer = Buffer.from(await file.arrayBuffer())   // convert File to bytes
    writeFileSync(join(process.cwd(), 'public', 'uploads', filename), buffer)

    setTimeout(() => {
      try { unlinkSync(join(process.cwd(), 'public', 'uploads', filename)) } catch {}
  }, 2 * 60 * 1000)  //don't want files clogging up limited space 


    const host = request.headers.get('host')
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    return Response.json({ url: `${protocol}://${host}/uploads/${filename}`, filename })
}