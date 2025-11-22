import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // CSV template with headers and example row
    const csvContent = `name,sku,price,hidePrice,description,category,stockStatus,features,images
"Example Product","EX-001",29.99,false,"This is a sample product description","Electronics","IN_STOCK","Feature 1, Feature 2, Feature 3","https://example.com/image1.jpg, https://example.com/image2.jpg"

# Instructions:
# - name: Product name (required)
# - sku: Unique product identifier (required)
# - price: Product price as number (required)
# - hidePrice: true/false to hide price display (optional, default: false)
# - description: Full product description (required)
# - category: Category name - must match existing category (required)
# - stockStatus: IN_STOCK, LOW_STOCK, OUT_OF_STOCK, or BACKORDER (optional, default: IN_STOCK)
# - features: Comma-separated list of features (optional)
# - images: Comma-separated list of image URLs (optional)
#
# Notes:
# - If SKU already exists, the product will be UPDATED with new data
# - Use quotes around fields containing commas
# - Delete these instruction lines before importing
`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=product-import-template.csv');
    res.status(200).send(csvContent);
}
