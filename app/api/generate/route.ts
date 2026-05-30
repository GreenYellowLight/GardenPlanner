import type { NextRequest } from 'next/server'
import OpenAI from 'openai'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: NextRequest) {
  const { plants, photo, photoType } = await request.json()

  const plantNames = plants.map((s: { plant: { name: string }; qty: number }) =>
    s.qty > 1 ? `${s.qty}x ${s.plant.name}` : s.plant.name
  ).join(', ')

  let gardenDescription = 'a typical backyard garden'

  if (photo) {
    const vision = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:${photoType};base64,${photo}` } },
          { type: 'text', text: 'Describe this garden space in 2-3 sentences: its layout, size, existing features, lighting conditions, and any structures. Be specific so an artist can recreate it.' },
        ],
      }],
    })
    gardenDescription = vision.choices[0]?.message?.content ?? gardenDescription
  }

  const prompt = `A beautiful realistic garden: ${gardenDescription}. The garden has been planted with ${plantNames} in optimal locations. Professional garden photography, lush and well-maintained, natural lighting.`

  const imageResponse = await client.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: '1024x1024',
  })

  const imageUrl = imageResponse.data?.[0]?.url
  if (!imageUrl) return Response.json({ error: 'No image returned' }, { status: 500 })
  return Response.json({ image: imageUrl })
}
