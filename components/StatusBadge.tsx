
import React from 'react';
import { DeliveryStatus, Priority } from '../types';

interface StatusBadgeProps {
  type: 'status' | 'priority';
  value: DeliveryStatus | Priority;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value }) => {
  const getStyles = () => {
    if (type === 'status') {
      switch (value) {
        case DeliveryStatus.PENDING: 
          return 'bg-amber-50 text-amber-600 border-amber-100 shadow-sm shadow-amber-100';
        case DeliveryStatus.ACCEPTED:
          return 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-sm shadow-indigo-100';
        case DeliveryStatus.PICKED_UP:
          return 'bg-purple-50 text-purple-600 border-purple-100 shadow-sm shadow-purple-100';
        case DeliveryStatus.IN_TRANSIT:
          return 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm shadow-blue-100 animate-pulse';
        case DeliveryStatus.DELIVERED:
          return 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-100';
        case DeliveryStatus.CANCELLED:
          return 'bg-red-50 text-red-600 border-red-100 shadow-sm shadow-red-100';
        default:
          return 'bg-slate-50 text-slate-600 border-slate-100';
      }
    } else {
      switch (value) {
        case Priority.HIGH: return 'bg-rose-50 text-rose-600 border-rose-100';
        case Priority.MEDIUM: return 'bg-indigo-50 text-indigo-600 border-indigo-100';
        case Priority.LOW: return 'bg-slate-50 text-slate-600 border-slate-100';
        default: return 'bg-slate-50 text-slate-600 border-slate-100';
      }
    }
  };

  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStyles()} transition-all`}>
      {value}
    </span>
  );
};

export default StatusBadge;
