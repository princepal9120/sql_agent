'use client';

import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { BarChart3, TrendingUp, Info } from 'lucide-react';

interface ChartViewProps {
    data: any[];
    columns: string[];
    chartType?: 'bar' | 'line' | 'pie' | 'area' | 'table';
    recommendation?: {
        type: 'bar' | 'line' | 'pie' | 'area' | 'table';
        reason: string;
        xAxis?: string;
        yAxis?: string;
    };
}

const COLORS = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
];

export function ChartView({ data, columns, chartType = 'bar', recommendation }: ChartViewProps) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-12">
                <div className="flex flex-col items-center justify-center text-center">
                    <BarChart3 className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mb-3" />
                    <h3 className="font-medium text-zinc-900 dark:text-white mb-1">
                        No data to visualize
                    </h3>
                    <p className="text-sm text-zinc-500">
                        Run a query to see charts here
                    </p>
                </div>
            </div>
        );
    }

    const xKey = recommendation?.xAxis || columns[0];
    const yKey = recommendation?.yAxis || columns[1];

    const renderChart = () => {
        const effectiveChartType = recommendation?.type || chartType;

        switch (effectiveChartType) {
            case 'line':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-700" />
                            <XAxis
                                dataKey={xKey}
                                className="text-xs fill-zinc-600 dark:fill-zinc-400"
                            />
                            <YAxis className="text-xs fill-zinc-600 dark:fill-zinc-400" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey={yKey}
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ fill: '#3b82f6', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                );

            case 'area':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-700" />
                            <XAxis
                                dataKey={xKey}
                                className="text-xs fill-zinc-600 dark:fill-zinc-400"
                            />
                            <YAxis className="text-xs fill-zinc-600 dark:fill-zinc-400" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                }}
                            />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey={yKey}
                                stroke="#3b82f6"
                                fill="#3b82f6"
                                fillOpacity={0.6}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                );

            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey={yKey}
                                nameKey={xKey}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={(entry: any) => `${entry[xKey]}: ${entry[yKey]}`}
                            >
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                );

            case 'bar':
            default:
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-700" />
                            <XAxis
                                dataKey={xKey}
                                className="text-xs fill-zinc-600 dark:fill-zinc-400"
                            />
                            <YAxis className="text-xs fill-zinc-600 dark:fill-zinc-400" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                }}
                            />
                            <Legend />
                            <Bar dataKey={yKey} fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                );
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-zinc-900 dark:text-white">
                        Visualization
                    </h3>
                </div>
                {recommendation && (
                    <div className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-500" />
                        <span>{recommendation.reason}</span>
                    </div>
                )}
            </div>

            {/* Chart */}
            <div className="p-6" style={{ height: '400px' }}>
                {renderChart()}
            </div>
        </div>
    );
}
