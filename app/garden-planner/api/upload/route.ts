import { randomUUID } from 'crypto'
import type { NextRequest } from 'next/server'
import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { MAX_PHOTO_MB, MAX_PHOTO_BYTES } from '@/app/lib/constants'
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const s3 = new S3Client({ region: process.env.AWS_REGION })

export async function POST(request: NextRequest) {
    const formData = await request.formData()
    const file = formData.get('photo') as File | null

    if (!file)
        return Response.json({ error: 'No file' }, { status: 400 })
    if (!ALLOWED_TYPES.includes(file.type))
        return Response.json({ error: 'Invalid type' }, { status: 400 })
    if (file.size > MAX_PHOTO_BYTES)
        return Response.json({ error: `Too large (max ${MAX_PHOTO_MB}MB)` }, { status: 400 })

    try {
        // delete everything in generated-images/ before uploading. Am assuming it will be one user at a time + rarely used
        const listed = await s3.send(new ListObjectsV2Command({ Bucket: process.env.AWS_BUCKET_NAME, Prefix: 'generated-images/' }))
        if (listed.Contents) {
            await Promise.all(listed.Contents.map(obj =>
                s3.send(new DeleteObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: obj.Key! }))
            ))
        }

        const ext = file.type.split('/')[1]                    // 'image/webp' → 'webp'
        const key = `generated-images/${randomUUID()}.${ext}`  // e.g. 'generated-images/a1b2c3.webp'
        const buffer = Buffer.from(await file.arrayBuffer())   // convert File to bytes

        await s3.send(new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: file.type,
        }))

        const url = `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${key}`
        return Response.json({ url, filename: key })
    } catch (e) {
        console.error('S3 error:', e)
        return Response.json({ error: 'Failed to upload image' }, { status: 500 })
    }
}
