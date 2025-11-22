import type { NextApiRequest, NextApiResponse } from 'next';
import { DB as db } from '../../../services/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        switch (req.method) {
            case 'GET':
                const statuses = await db.getStockStatuses();
                res.status(200).json(statuses);
                break;

            case 'POST':
                const { label, value, color } = req.body;
                if (!label || !value || !color) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }
                const newStatus = await db.createStockStatus({ label, value, color });
                res.status(201).json(newStatus);
                break;

            case 'PUT':
                const { id, ...updateData } = req.body;
                if (!id) {
                    return res.status(400).json({ error: 'Missing ID' });
                }
                const updatedStatus = await db.updateStockStatus(id, updateData);
                res.status(200).json(updatedStatus);
                break;

            case 'DELETE':
                const { id: deleteId } = req.query;
                if (!deleteId || Array.isArray(deleteId)) {
                    return res.status(400).json({ error: 'Invalid ID' });
                }
                await db.deleteStockStatus(deleteId);
                res.status(200).json({ success: true });
                break;

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('Stock Status API Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
