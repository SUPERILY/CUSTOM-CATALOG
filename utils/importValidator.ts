import { Product, Category, StockStatus } from '../types';

export interface ImportRow {
    name: string;
    sku: string;
    price: string | number;
    hidePrice?: string | boolean;
    description: string;
    category: string;
    stockStatus: string;
    features?: string;
    images?: string;
}

export interface ValidationError {
    row: number;
    field: string;
    message: string;
}

export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
    warnings: ValidationError[];
}

const VALID_STOCK_STATUSES: StockStatus[] = ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'BACKORDER'];

export class ImportValidator {
    private categories: Category[];
    private existingSkus: Set<string>;

    constructor(categories: Category[], existingProducts: Product[]) {
        this.categories = categories;
        this.existingSkus = new Set(existingProducts.map(p => p.sku));
    }

    validateRow(row: ImportRow, rowIndex: number): ValidationError[] {
        const errors: ValidationError[] = [];

        // Required fields
        if (!row.name || row.name.trim() === '') {
            errors.push({ row: rowIndex, field: 'name', message: 'Product name is required' });
        }

        if (!row.sku || row.sku.trim() === '') {
            errors.push({ row: rowIndex, field: 'sku', message: 'SKU is required' });
        }

        if (!row.description || row.description.trim() === '') {
            errors.push({ row: rowIndex, field: 'description', message: 'Description is required' });
        }

        if (!row.category || row.category.trim() === '') {
            errors.push({ row: rowIndex, field: 'category', message: 'Category is required' });
        } else {
            // Check if category exists
            const categoryExists = this.categories.some(c => c.name.toLowerCase() === row.category.toLowerCase());
            if (!categoryExists) {
                errors.push({
                    row: rowIndex,
                    field: 'category',
                    message: `Category "${row.category}" does not exist. Available: ${this.categories.map(c => c.name).join(', ')}`
                });
            }
        }

        // Price validation
        const price = typeof row.price === 'string' ? parseFloat(row.price) : row.price;
        if (isNaN(price) || price < 0) {
            errors.push({ row: rowIndex, field: 'price', message: 'Price must be a valid positive number' });
        }

        // Stock status validation
        if (row.stockStatus) {
            const normalizedStatus = row.stockStatus.toUpperCase().replace(/\s+/g, '_');
            if (!VALID_STOCK_STATUSES.includes(normalizedStatus as StockStatus)) {
                errors.push({
                    row: rowIndex,
                    field: 'stockStatus',
                    message: `Invalid stock status. Must be one of: ${VALID_STOCK_STATUSES.join(', ')}`
                });
            }
        }

        return errors;
    }

    validateAll(rows: ImportRow[]): ValidationResult {
        const errors: ValidationError[] = [];
        const warnings: ValidationError[] = [];
        const skusInImport = new Set<string>();

        rows.forEach((row, index) => {
            // Validate individual row
            const rowErrors = this.validateRow(row, index + 1);
            errors.push(...rowErrors);

            // Check for duplicate SKUs within import
            if (row.sku) {
                if (skusInImport.has(row.sku)) {
                    errors.push({
                        row: index + 1,
                        field: 'sku',
                        message: `Duplicate SKU "${row.sku}" found in import file`
                    });
                }
                skusInImport.add(row.sku);

                // Warn if SKU already exists in database
                if (this.existingSkus.has(row.sku)) {
                    warnings.push({
                        row: index + 1,
                        field: 'sku',
                        message: `SKU "${row.sku}" already exists and will be updated`
                    });
                }
            }
        });

        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }
}
