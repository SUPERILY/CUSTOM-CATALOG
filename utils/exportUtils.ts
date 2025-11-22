import { Product } from '../types';

/**
 * Converts an array of products to CSV format
 */
export const exportProductsToCSV = (products: Product[]): string => {
    // Define CSV headers
    const headers = [
        'SKU',
        'Name',
        'Description',
        'Price',
        'Category',
        'Stock Status',
        'Hide Price',
        'Features',
        'Image URLs',
        'Created At',
    ];

    // Helper function to escape CSV values
    const escapeCSV = (value: any): string => {
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
    };

    // Build CSV rows
    const rows = products.map(product => {
        const features = product.features.map(f => f.text).join('; ');
        const imageUrls = product.images.map(i => i.url).join('; ');

        return [
            escapeCSV(product.sku),
            escapeCSV(product.name),
            escapeCSV(product.description),
            escapeCSV(product.price.toFixed(2)),
            escapeCSV(product.category?.name || ''),
            escapeCSV(product.stockStatus.replace(/_/g, ' ')),
            escapeCSV(product.hidePrice ? 'Yes' : 'No'),
            escapeCSV(features),
            escapeCSV(imageUrls),
            escapeCSV(new Date(product.createdAt).toISOString()),
        ].join(',');
    });

    // Combine headers and rows
    return [headers.join(','), ...rows].join('\n');
};

/**
 * Triggers a browser download of CSV data
 */
export const downloadCSV = (csvContent: string, filename: string = 'products.csv'): void => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};
