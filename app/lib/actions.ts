'use server'
import { fal } from "@fal-ai/client";
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

const GENERATION_PERIOD = 60 // over how many minutes from now in the past to cap the number of images generated 
const GENERATION_LIMIT = 3 // how many images can be generated each GENERATION_PERIOD


// Don't allow more that GENERATION_LIMIT requests per GENERATION_PERIOD
export async function validateCount(): Promise<boolean> {
    await sql`DELETE FROM generation_log WHERE created_at < NOW() - INTERVAL '30 days'` // keep a record incase need to review the past

    const result = await sql`
        SELECT COUNT(*) as count
        FROM generation_log
        WHERE created_at > NOW() - (${GENERATION_PERIOD} * INTERVAL '1 minute')`

    return parseInt(result[0].count) < GENERATION_LIMIT
}



async function editImage(prompt: string, image_url: string): Promise<string | null> {
    const result = await fal.subscribe("fal-ai/flux-pro/kontext", {
        input: { prompt, image_url: image_url },
        logs: true
    });
    return result.data.images?.[0]?.url ?? null
}

export async function verifyCaptcha(token: string): Promise<boolean> {

    if (process.env.NEXT_PUBLIC_DEVELOPER_MODE === 'true')  return true

    const res = await fetch('https://api.hcaptcha.com/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret: process.env.HCAPTCHA_SECRET_KEY!, response: token }),
    })
    const data = await res.json()
    return data.success === true
}

async function validatePlantNames(names: string[]): Promise<boolean> {
    if (names.length === 0) return false
    const rows = await sql`SELECT name FROM plant WHERE name = ANY(${names})`
    const validNames = new Set(rows.map(row => row.name))
    return names.every(name => validNames.has(name))
}

export async function getGardenPlannerImage(plants: string[], img_url: string, captchaToken: string): Promise<{ url: string | null, error?: string }> {
    const captchaOk = await verifyCaptcha(captchaToken)
    if (!captchaOk) return { url: null, error: 'CAPTCHA_FAILED' }

    const plantsOk = await validatePlantNames(plants)
    if (!plantsOk) return { url: null, error: 'Error' }

    const allowed = await validateCount()
    if (!allowed) return { url: null, error: 'TOO_MANY_REQUESTS' }

    await sql`INSERT INTO generation_log DEFAULT VALUES`

    const plantNames = plants.join(', ')
    const prompt = `You are editing a garden photo. Add each of the following plants exactly once, all must be clearly visible and
  not obscured: ${plantNames}. Place them in the most natural vacant spots in the garden as though they have just
  been transplanted from their pots — still small and freshly planted. Do not hide any plant behind fences, walls,
  or other features. The plants should look healthy with intact leaves and roots settled into the soil. Do not alter
   any existing structures, lawn, paths, or background features.`

    return { url: await editImage(prompt, img_url) }
}

export async function getGardenFutureImage(firstImageUrl: string): Promise<{ url: string | null}> {
    const prompt = `Generate what this exact garden looks like 3 years later.
    All plants should be visibly larger and fully mature — with
  significantly more foliage, spread, and height than when first planted. Each plant must
  still be clearly identifiable and in the same position. The lawn and grass must remain
  neatly mowed and well-maintained. All existing structures, paths, fences, walls, and
  background features must remain completely unchanged. Do not add any new plants,
  decorations, or objects. Do not remove anything that was there originally.`

    return { url: await editImage(prompt, firstImageUrl) }
}

