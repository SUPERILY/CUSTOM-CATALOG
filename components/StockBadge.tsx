import React from 'react';
import { StockStatus } from '../types';
import { CheckCircle, AlertTriangle, XCircle, Clock, Info } from 'lucide-react';
import { useStockStatus } from '../contexts/StockStatusContext';

interface StockBadgeProps {
  status: StockStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StockBadge: React.FC<StockBadgeProps> = ({ status, size = 'md' }) => {
  const { statuses } = useStockStatus();

  const statusConfig = statuses.find(s => s.value === status);

  // Fallback or default mapping for icons if we want to keep them, 
  // or we can just use a generic icon or try to map based on color/value heuristics.
  // For now, let's map common ones and default to Info.
  const getIcon = (val: string) => {
    if (val === 'IN_STOCK') return CheckCircle;
    if (val === 'LOW_STOCK') return AlertTriangle;
    if (val === 'OUT_OF_STOCK') return XCircle;
    if (val === 'BACKORDER') return Clock;
    return Info;
  };

  const Icon = getIcon(status);
  const color = statusConfig ? statusConfig.color : 'gray';
  const label = statusConfig ? statusConfig.label : status.replace(/_/g, ' ');

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  };

  // Handle tailwind colors vs hex
  const isHex = color.startsWith('#');
  const style = isHex ? {
    backgroundColor: `${color}20`, // 20% opacity
    color: color,
    borderColor: `${color}40` // 40% opacity
  } : undefined;

  const className = `inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClasses[size]} ${!isHex ? `bg-${color}-100 text-${color}-800 border-${color}-200` : ''
    }`;

  return (
    <span className={className} style={style}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {label}
    </span>
  );
};