import type { NextApiRequest, NextApiResponse } from 'next';
import { DB } from '../../../services/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const categories = await DB.getCategories();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch categories' });
        }
    } else if (req.method === 'POST') {
        try {
            const category = await DB.saveCategory(req.body);
            res.status(201).json(category);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create category' });
        }
    } else if (req.method === 'PUT') {
        try {
            const category = await DB.saveCategory(req.body);
            res.status(200).json(category);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update category' });
        }
    } else if (req.method === 'DELETE') {
        const { id } = req.query;
        if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid ID' });
        try {
            await DB.deleteCategory(id);
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete category' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
