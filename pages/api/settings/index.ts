import type { NextApiRequest, NextApiResponse } from 'next';
import { DB as db } from '../../../services/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        switch (req.method) {
            case 'GET':
                const settings = await db.getStoreSettings();
                res.status(200).json(settings);
                break;

            case 'PUT':
                const { storeName, logoUrl, faviconUrl } = req.body;
                const updatedSettings = await db.updateStoreSettings({ storeName, logoUrl, faviconUrl });
                res.status(200).json(updatedSettings);
                break;

            default:
                res.setHeader('Allow', ['GET', 'PUT']);
                res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('Store Settings API Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
