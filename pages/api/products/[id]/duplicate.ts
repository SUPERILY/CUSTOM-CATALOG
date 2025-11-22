import type { NextApiRequest, NextApiResponse } from 'next';
import { DB } from '../../../../services/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const duplicatedProduct = await DB.duplicateProduct(id);
        res.status(200).json(duplicatedProduct);
    } catch (error) {
        console.error('Duplicate error:', error);
        res.status(500).json({ error: 'Failed to duplicate product' });
    }
}
