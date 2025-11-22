import type { NextApiRequest, NextApiResponse } from 'next';
import { DB } from '../../../services/db';
import { StockStatus } from '../../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { productIds, stockStatus } = req.body;

        if (!Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({ error: 'Invalid product IDs' });
        }

        if (!stockStatus || !['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'BACKORDER'].includes(stockStatus)) {
            return res.status(400).json({ error: 'Invalid stock status' });
        }

        let successCount = 0;

        // Update products one by one
        for (const id of productIds) {
            try {
                const product = await DB.getProductById(id);
                if (product) {
                    await DB.saveProduct({
                        ...product,
                        stockStatus: stockStatus as StockStatus,
                        categoryId: product.category.id,
                        features: product.features.map(f => f.text),
                        images: product.images.map(i => i.url),
                    });
                    successCount++;
                }
            } catch (error) {
                console.error(`Failed to update product ${id}:`, error);
            }
        }

        res.status(200).json({
            success: true,
            successCount,
            message: `Updated ${successCount} product(s) to ${stockStatus.replace(/_/g, ' ')}`,
        });
    } catch (error) {
        console.error('Bulk update error:', error);
        res.status(500).json({ error: 'Failed to update products' });
    }
}
