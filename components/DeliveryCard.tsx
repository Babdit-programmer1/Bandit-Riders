
import React from 'react';
import { Delivery, DeliveryStatus } from '../types';
import StatusBadge from './StatusBadge';
import Button from './Button';
import { formatNaira } from '../utils/fareCalculator';

interface DeliveryCardProps {
  delivery: Delivery;
  onUpdateStatus: (id: string, newStatus: DeliveryStatus) => void;
  onViewDetails: (delivery: Delivery) => void;
}

const DeliveryCard: React.FC<DeliveryCardProps> = ({ delivery, onUpdateStatus, onViewDetails }) => {
  const isPending = delivery.status === DeliveryStatus.PENDING;
  const isInProgress = delivery.status === DeliveryStatus.IN_PROGRESS;

  return (
    <div className="bg-white rounded-3xl shadow-premium hover:shadow-2xl transition-all duration-300 border border-slate-100 overflow-hidden group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{delivery.id}</span>
            <h4 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{delivery.customerName}</h4>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge type="status" value={delivery.status} />
          </div>
        </div>

        <div className="space-y-3 mb-8 text-sm text-slate-500 font-medium">
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-location-dot text-indigo-500"></i>
            <span className="truncate">{delivery.address}</span>
          </div>
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-clock text-indigo-500"></i>
            <span>{delivery.estTime} • {delivery.distance}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
          <span className="text-xl font-black text-slate-900">{formatNaira(delivery.price)}</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="rounded-xl font-bold" onClick={() => onViewDetails(delivery)}>
              Details
            </Button>
            {isPending && (
              <Button size="sm" className="rounded-xl font-bold bg-indigo-600" onClick={() => onUpdateStatus(delivery.id, DeliveryStatus.IN_PROGRESS)}>
                Start
              </Button>
            )}
            {isInProgress && (
              <Button size="sm" className="rounded-xl font-bold bg-emerald-600 text-white" onClick={() => onUpdateStatus(delivery.id, DeliveryStatus.DELIVERED)}>
                Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryCard;
