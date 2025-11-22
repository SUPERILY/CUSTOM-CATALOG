import type { NextApiRequest, NextApiResponse } from 'next';
import { DB } from '../../../services/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    if (req.method === 'GET') {
        try {
            const product = await DB.getProductById(id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.status(200).json(product);
        } catch (error) {
            console.error('GET product error:', error);
            res.status(500).json({ error: 'Failed to fetch product' });
        }
    } else if (req.method === 'POST') {
        // Create new product (id should be 'new')
        try {
            console.log('POST /api/products/new - Creating new product');
            console.log('Request body:', JSON.stringify(req.body, null, 2));

            // Don't pass id to saveProduct for new products
            const { id: _, ...productData } = req.body;

            const product = await DB.saveProduct(productData);
            console.log('Product created successfully:', product.id);
            res.status(201).json(product);
        } catch (error) {
            console.error('POST product error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
            res.status(500).json({ error: errorMessage });
        }
    } else if (req.method === 'PUT') {
        // Update existing product
        try {
            console.log(`PUT /api/products/${id} - Updating product`);
            const product = await DB.saveProduct({ ...req.body, id });
            console.log('Product updated successfully:', product.id);
            res.status(200).json(product);
        } catch (error) {
            console.error('PUT product error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
            res.status(500).json({ error: errorMessage });
        }
    } else if (req.method === 'DELETE') {
        try {
            await DB.deleteProduct(id);
            res.status(204).end();
        } catch (error) {
            console.error('DELETE product error:', error);
            res.status(500).json({ error: 'Failed to delete product' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
