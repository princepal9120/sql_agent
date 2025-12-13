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
import {
    BarChart3,
    TrendingUp,
    Info,
    PieChart as PieIcon,
    LineChart as LineIcon,
    AreaChart as AreaIcon,
    Table as TableIcon
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { DataTable } from './DataTable';

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

type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'table';

export function ChartView({ data, columns, chartType = 'bar', recommendation }: ChartViewProps) {
    const [activeType, setActiveType] = useState<ChartType>(recommendation?.type || chartType);

    useEffect(() => {
        if (recommendation?.type) {
            setActiveType(recommendation.type);
        }
    }, [recommendation]);

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
        switch (activeType) {
            case 'table':
                return (
                    <div className="h-full overflow-auto">
                        <DataTable data={data} columns={columns} />
                    </div>
                );

            case 'line':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-700" />
                            <XAxis
                                dataKey={xKey}
                                className="text-xs fill-zinc-600 dark:fill-zinc-400"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis className="text-xs fill-zinc-600 dark:fill-zinc-400" tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                }}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px' }} />
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
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-700" />
                            <XAxis
                                dataKey={xKey}
                                className="text-xs fill-zinc-600 dark:fill-zinc-400"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis className="text-xs fill-zinc-600 dark:fill-zinc-400" tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                }}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px' }} />
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
                                outerRadius={80}
                                label={(entry: any) => `${entry[xKey]}: ${entry[yKey]}`}
                                labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                            >
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                }}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                );

            case 'bar':
            default:
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-700" />
                            <XAxis
                                dataKey={xKey}
                                className="text-xs fill-zinc-600 dark:fill-zinc-400"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis className="text-xs fill-zinc-600 dark:fill-zinc-400" tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                }}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px' }} />
                            <Bar dataKey={yKey} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                );
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        <h3 className="font-semibold text-zinc-900 dark:text-white">
                            Visualization
                        </h3>
                    </div>
                    {recommendation && (
                        <div className="flex items-start gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                            <span>{recommendation.reason}</span>
                        </div>
                    )}
                </div>

                {/* Chart Type Selector */}
                <div className="flex items-center gap-1 p-1 bg-zinc-200 dark:bg-zinc-700 rounded-lg self-start sm:self-auto">
                    {[
                        { type: 'bar', icon: BarChart3, label: 'Bar' },
                        { type: 'line', icon: LineIcon, label: 'Line' },
                        { type: 'area', icon: AreaIcon, label: 'Area' },
                        { type: 'pie', icon: PieIcon, label: 'Pie' },
                        { type: 'table', icon: TableIcon, label: 'Table' },
                    ].map((item) => (
                        <button
                            key={item.type}
                            onClick={() => setActiveType(item.type as ChartType)}
                            className={`
                                p-1.5 rounded-md transition-all
                                ${activeType === item.type
                                    ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-300/50 dark:hover:bg-zinc-600/50'
                                }
                            `}
                            title={item.label}
                        >
                            <item.icon className="w-4 h-4" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart */}
            <div className={`p-4 ${activeType === 'table' ? '' : 'h-[400px]'}`}>
                {renderChart()}
            </div>
        </div>
    );
}
