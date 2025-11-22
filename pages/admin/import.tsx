import React, { ReactElement, useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { NextPageWithLayout } from '../_app';
import Papa from 'papaparse';
import { ImportRow, ValidationError } from '../../utils/importValidator';
import { Upload, FileText, AlertCircle, CheckCircle, Download, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type ImportStep = 'upload' | 'validate' | 'preview' | 'import' | 'complete';

interface ImportResult {
    created: number;
    updated: number;
    failed: number;
    errors: { row: number; message: string }[];
}

const ImportWizardPage: NextPageWithLayout = () => {
    const [step, setStep] = useState<ImportStep>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [rows, setRows] = useState<ImportRow[]>([]);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [warnings, setWarnings] = useState<ValidationError[]>([]);
    const [importing, setImporting] = useState(false);
    const [result, setResult] = useState<ImportResult | null>(null);
    const [updateExisting, setUpdateExisting] = useState(true);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            parseCSV(selectedFile);
        }
    };

    const parseCSV = (file: File) => {
        Papa.parse<ImportRow>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                // Filter out comment lines (starting with #)
                const validRows = results.data.filter(row => {
                    return row.name && !row.name.startsWith('#');
                });
                setRows(validRows);
                setStep('validate');
                validateRows(validRows);
            },
            error: (error) => {
                alert(`Error parsing CSV: ${error.message}`);
            }
        });
    };

    const validateRows = async (rowsToValidate: ImportRow[]) => {
        try {
            const response = await fetch('/api/products/bulk-import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rows: rowsToValidate, updateExisting: false, validateOnly: true })
            });

            const data = await response.json();

            if (data.errors) {
                setErrors(data.errors);
            }
            if (data.warnings) {
                setWarnings(data.warnings);
            }

            if (data.errors && data.errors.length > 0) {
                setStep('validate');
            } else {
                setStep('preview');
            }
        } catch (error) {
            console.error('Validation error:', error);
            alert('Failed to validate import data');
        }
    };

    const handleImport = async () => {
        setImporting(true);
        try {
            const response = await fetch('/api/products/bulk-import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rows, updateExisting })
            });

            const data = await response.json();

            if (data.success) {
                setResult(data.results);
                setStep('complete');
            } else {
                setErrors(data.errors || []);
                setStep('validate');
            }
        } catch (error) {
            console.error('Import error:', error);
            alert('Failed to import products');
        } finally {
            setImporting(false);
        }
    };

    const reset = () => {
        setStep('upload');
        setFile(null);
        setRows([]);
        setErrors([]);
        setWarnings([]);
        setResult(null);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Bulk Product Import</h1>
                    <p className="text-sm text-gray-500 mt-1">Import multiple products from CSV file</p>
                </div>
                <a
                    href="/api/products/template"
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                    <Download className="w-4 h-4" />
                    Download Template
                </a>
            </div>

            {/* Progress Steps */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                    {['Upload', 'Validate', 'Preview', 'Import', 'Complete'].map((label, index) => {
                        const stepNames: ImportStep[] = ['upload', 'validate', 'preview', 'import', 'complete'];
                        const currentIndex = stepNames.indexOf(step);
                        const isActive = index === currentIndex;
                        const isComplete = index < currentIndex;

                        return (
                            <React.Fragment key={label}>
                                <div className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${isComplete ? 'bg-green-500 text-white' :
                                            isActive ? 'bg-indigo-600 text-white' :
                                                'bg-gray-200 text-gray-500'
                                        }`}>
                                        {isComplete ? <CheckCircle className="w-5 h-5" /> : index + 1}
                                    </div>
                                    <span className={`text-xs mt-2 ${isActive ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                                        {label}
                                    </span>
                                </div>
                                {index < 4 && (
                                    <div className={`flex-1 h-1 mx-2 ${isComplete ? 'bg-green-500' : 'bg-gray-200'}`} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                {step === 'upload' && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload CSV File</h2>
                            <p className="text-gray-600 mb-6">Select a CSV file containing your product data</p>
                        </div>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-indigo-500 transition-colors">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="csv-upload"
                            />
                            <label htmlFor="csv-upload" className="cursor-pointer">
                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-sm text-gray-600 mb-2">
                                    Click to select CSV file or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">CSV files only</p>
                            </label>
                        </div>

                        {file && (
                            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-indigo-600" />
                                    <div>
                                        <p className="font-medium text-gray-900">{file.name}</p>
                                        <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {step === 'validate' && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Validation Results</h2>
                            <p className="text-gray-600">Found {rows.length} products in CSV file</p>
                        </div>

                        {errors.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-red-900 mb-2">{errors.length} Errors Found</h3>
                                        <div className="space-y-1 max-h-64 overflow-y-auto">
                                            {errors.slice(0, 20).map((error, index) => (
                                                <p key={index} className="text-sm text-red-800">
                                                    Row {error.row}, {error.field}: {error.message}
                                                </p>
                                            ))}
                                            {errors.length > 20 && (
                                                <p className="text-sm text-red-700 font-medium">
                                                    ... and {errors.length - 20} more errors
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {warnings.length > 0 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-yellow-900 mb-2">{warnings.length} Warnings</h3>
                                        <div className="space-y-1 max-h-48 overflow-y-auto">
                                            {warnings.map((warning, index) => (
                                                <p key={index} className="text-sm text-yellow-800">
                                                    Row {warning.row}: {warning.message}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {errors.length === 0 && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <p className="text-green-900 font-medium">All rows validated successfully!</p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 justify-end pt-4 border-t">
                            <button
                                onClick={reset}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                            >
                                <ArrowLeft className="w-4 h-4 inline mr-2" />
                                Start Over
                            </button>
                            {errors.length === 0 && (
                                <button
                                    onClick={() => setStep('preview')}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                                >
                                    Continue to Preview
                                    <ArrowRight className="w-4 h-4 inline ml-2" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {step === 'preview' && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Preview Import</h2>
                            <p className="text-gray-600">Review products before importing</p>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                            <input
                                type="checkbox"
                                id="update-existing"
                                checked={updateExisting}
                                onChange={(e) => setUpdateExisting(e.target.checked)}
                                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="update-existing" className="text-sm font-medium text-gray-700">
                                Update existing products (match by SKU)
                            </label>
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                            <div className="overflow-x-auto max-h-96">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {rows.slice(0, 50).map((row, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900">{row.name}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{row.sku}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900">${row.price}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{row.category}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                                                        {row.stockStatus || 'IN_STOCK'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {rows.length > 50 && (
                                <div className="bg-gray-50 px-4 py-3 text-sm text-gray-600 border-t">
                                    Showing first 50 of {rows.length} products
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 justify-end pt-4 border-t">
                            <button
                                onClick={() => setStep('validate')}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                            >
                                <ArrowLeft className="w-4 h-4 inline mr-2" />
                                Back
                            </button>
                            <button
                                onClick={handleImport}
                                disabled={importing}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50 flex items-center gap-2"
                            >
                                {importing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Importing...
                                    </>
                                ) : (
                                    <>
                                        Import {rows.length} Products
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {step === 'complete' && result && (
                    <div className="space-y-6 text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Import Complete!</h2>
                            <p className="text-gray-600">Your products have been imported successfully</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="text-3xl font-bold text-green-600">{result.created}</div>
                                <div className="text-sm text-green-800">Created</div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="text-3xl font-bold text-blue-600">{result.updated}</div>
                                <div className="text-sm text-blue-800">Updated</div>
                            </div>
                            <div className="bg-red-50 rounded-lg p-4">
                                <div className="text-3xl font-bold text-red-600">{result.failed}</div>
                                <div className="text-sm text-red-800">Failed</div>
                            </div>
                        </div>

                        {result.errors.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left max-w-2xl mx-auto">
                                <h3 className="font-semibold text-red-900 mb-2">Errors:</h3>
                                <div className="space-y-1 max-h-48 overflow-y-auto">
                                    {result.errors.map((error, index) => (
                                        <p key={index} className="text-sm text-red-800">
                                            Row {error.row}: {error.message}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 justify-center pt-4">
                            <button
                                onClick={reset}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                            >
                                Import More Products
                            </button>
                            <Link
                                href="/admin/products"
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                            >
                                View Products
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

ImportWizardPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default ImportWizardPage;
