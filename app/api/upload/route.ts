import { randomUUID } from 'crypto'
import type { NextRequest } from 'next/server'
import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'

const max_MB_size = 10;
const MAX_SIZE = max_MB_size * 1024 * 1024 // 10MB in bytes
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const s3 = new S3Client({ region: process.env.AWS_REGION })

export async function POST(request: NextRequest) {
    const formData = await request.formData()
    const file = formData.get('photo') as File | null

    if (!file)
        return Response.json({ error: 'No file' }, { status: 400 })
    if (!ALLOWED_TYPES.includes(file.type))
        return Response.json({ error: 'Invalid type' }, { status: 400 })
    if (file.size > MAX_SIZE)
        return Response.json({ error: `Too large (max ${max_MB_size}MB)` }, { status: 400 })

    try {
        // delete everything in the bucket before uploading. Am assuming it will be one user at a time + rarely used
        const listed = await s3.send(new ListObjectsV2Command({ Bucket: process.env.AWS_BUCKET_NAME }))
        if (listed.Contents) {
            await Promise.all(listed.Contents.map(obj =>
                s3.send(new DeleteObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: obj.Key! }))
            ))
        }

        const ext = file.type.split('/')[1]                    // 'image/webp' → 'webp'
        const filename = `${randomUUID()}.${ext}`              // e.g. 'a1b2c3.webp'
        const buffer = Buffer.from(await file.arrayBuffer())   // convert File to bytes

        await s3.send(new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: filename,
            Body: buffer,
            ContentType: file.type,
        }))

        const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`
        return Response.json({ url, filename })
    } catch (e) {
        console.error('S3 error:', e)
        return Response.json({ error: 'Failed to upload image' }, { status: 500 })
    }
}
