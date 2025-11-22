import type { NextApiRequest, NextApiResponse } from 'next';
import { DB } from '../../../services/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { productIds } = req.body;

        if (!Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({ error: 'Invalid product IDs' });
        }

        let successCount = 0;
        let failureCount = 0;

        // Delete products one by one (could be optimized with a batch delete)
        for (const id of productIds) {
            try {
                await DB.deleteProduct(id);
                successCount++;
            } catch (error) {
                console.error(`Failed to delete product ${id}:`, error);
                failureCount++;
            }
        }

        res.status(200).json({
            success: true,
            successCount,
            failureCount,
            message: `Deleted ${successCount} product(s)${failureCount > 0 ? `, ${failureCount} failed` : ''}`,
        });
    } catch (error) {
        console.error('Bulk delete error:', error);
        res.status(500).json({ error: 'Failed to delete products' });
    }
}
