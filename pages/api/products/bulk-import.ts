import type { NextApiRequest, NextApiResponse } from 'next';
import { DB } from '../../../services/db';
import { ImportRow, ImportValidator } from '../../../utils/importValidator';
import { StockStatus } from '../../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { rows, updateExisting = true } = req.body as { rows: ImportRow[]; updateExisting?: boolean };

        if (!rows || !Array.isArray(rows)) {
            return res.status(400).json({ error: 'Invalid request body. Expected array of rows.' });
        }

        // Fetch existing data for validation
        const [categories, existingProducts] = await Promise.all([
            DB.getCategories(),
            DB.getProducts()
        ]);

        // Validate all rows
        const validator = new ImportValidator(categories, existingProducts);
        const validationResult = validator.validateAll(rows);

        if (!validationResult.valid) {
            return res.status(400).json({
                success: false,
                errors: validationResult.errors,
                warnings: validationResult.warnings
            });
        }

        // Process imports
        const results = {
            created: 0,
            updated: 0,
            failed: 0,
            errors: [] as { row: number; message: string }[]
        };

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            try {
                // Find category
                const category = categories.find(c => c.name.toLowerCase() === row.category.toLowerCase());
                if (!category) continue;

                // Check if product exists
                const existingProduct = existingProducts.find(p => p.sku === row.sku);

                // Parse features (comma-separated or newline-separated)
                const features = row.features
                    ? row.features.split(/[,\n]/).map(f => f.trim()).filter(f => f.length > 0)
                    : [];

                // Parse images (comma-separated URLs)
                const images = row.images
                    ? row.images.split(',').map(url => url.trim()).filter(url => url.length > 0)
                    : [];

                // Normalize stock status
                const stockStatus = (row.stockStatus?.toUpperCase().replace(/\s+/g, '_') || 'IN_STOCK') as StockStatus;

                // Parse hidePrice
                const hidePrice = typeof row.hidePrice === 'string'
                    ? row.hidePrice.toLowerCase() === 'true' || row.hidePrice === '1'
                    : Boolean(row.hidePrice);

                const productData = {
                    id: existingProduct?.id,
                    name: row.name.trim(),
                    sku: row.sku.trim(),
                    price: typeof row.price === 'string' ? parseFloat(row.price) : row.price,
                    hidePrice,
                    description: row.description.trim(),
                    categoryId: category.id,
                    features,
                    images,
                    stockStatus
                };

                if (existingProduct && updateExisting) {
                    // Update existing product
                    await DB.saveProduct(productData);
                    results.updated++;
                } else if (!existingProduct) {
                    // Create new product
                    await DB.saveProduct(productData);
                    results.created++;
                } else {
                    // Skip (exists but updateExisting is false)
                    results.failed++;
                    results.errors.push({
                        row: i + 1,
                        message: `SKU ${row.sku} already exists (update mode disabled)`
                    });
                }
            } catch (error) {
                results.failed++;
                results.errors.push({
                    row: i + 1,
                    message: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }

        return res.status(200).json({
            success: true,
            results,
            warnings: validationResult.warnings
        });

    } catch (error) {
        console.error('Bulk import error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
