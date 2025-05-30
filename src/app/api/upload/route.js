import { writeFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('image');

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filename = `${Date.now()}-${file.name}`;
        const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

        await writeFile(filePath, buffer);
        const fileUrl = `/uploads/${filename}`;

        return NextResponse.json({ url: fileUrl });
    } catch (err) {
        console.error('Upload error:', err);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}