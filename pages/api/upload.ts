import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import { supabase } from '../../services/supabase';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const form = formidable({
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Form parsing error:', err);
            return res.status(500).json({ error: 'Failed to parse form data' });
        }

        const file = Array.isArray(files.file) ? files.file[0] : files.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        try {
            const fileContent = fs.readFileSync(file.filepath);
            const filename = `img_${Date.now()}_${file.originalFilename || 'upload'}`;

            const { data, error } = await supabase.storage
                .from('uploads')
                .upload(filename, fileContent, {
                    contentType: file.mimetype || 'application/octet-stream',
                    upsert: false
                });

            if (error) {
                throw error;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('uploads')
                .getPublicUrl(filename);

            // Clean up temp file
            fs.unlinkSync(file.filepath);

            res.status(200).json({ url: publicUrl });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ error: 'Failed to upload image to storage' });
        }
    });
}
