import type { NextApiRequest, NextApiResponse } from 'next';
import { DB } from '../../../services/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const banners = await DB.getBanners();
            res.status(200).json(banners);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch banners' });
        }
    } else if (req.method === 'POST') {
        try {
            const banner = await DB.createBanner(req.body);
            res.status(201).json(banner);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create banner' });
        }
    } else if (req.method === 'PUT') {
        try {
            const { id, ...data } = req.body;
            const banner = await DB.updateBanner(id, data);
            res.status(200).json(banner);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update banner' });
        }
    } else if (req.method === 'DELETE') {
        try {
            const { id } = req.query;
            if (typeof id !== 'string') {
                return res.status(400).json({ error: 'Invalid ID' });
            }
            await DB.deleteBanner(id);
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete banner' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
