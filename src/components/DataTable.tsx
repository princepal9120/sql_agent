'use client';

import { Table as TableIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface DataTableProps {
    data: any[];
    columns: string[];
    pageSize?: number;
}

export function DataTable({ data, columns, pageSize = 10 }: DataTableProps) {
    const [currentPage, setCurrentPage] = useState(1);

    if (!data || data.length === 0) {
        return (
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-12">
                <div className="flex flex-col items-center justify-center text-center">
                    <TableIcon className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mb-3" />
                    <h3 className="font-medium text-zinc-900 dark:text-white mb-1">
                        No data to display
                    </h3>
                    <p className="text-sm text-zinc-500">
                        Run a query to see results here
                    </p>
                </div>
            </div>
        );
    }

    const totalPages = Math.ceil(data.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentData = data.slice(startIndex, endIndex);

    const formatValue = (value: any): string => {
        if (value === null || value === undefined) return '-';
        if (typeof value === 'number') {
            return value.toLocaleString();
        }
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        return String(value);
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                <div className="flex items-center gap-2">
                    <TableIcon className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-zinc-900 dark:text-white">
                        Query Results
                    </h3>
                    <span className="text-sm text-zinc-500">
                        ({data.length} row{data.length !== 1 ? 's' : ''})
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column}
                                    className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider"
                                >
                                    {column.replace(/_/g, ' ')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {currentData.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column}
                                        className="px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 whitespace-nowrap"
                                    >
                                        {formatValue(row[column])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of{' '}
                        {data.length} results
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
