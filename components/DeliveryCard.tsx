
import React from 'react';
import { Delivery, DeliveryStatus } from '../types';
import StatusBadge from './StatusBadge';
import Button from './Button';

interface DeliveryCardProps {
  delivery: Delivery;
  onUpdateStatus: (id: string, newStatus: DeliveryStatus) => void;
  onViewDetails: (delivery: Delivery) => void;
}

const DeliveryCard: React.FC<DeliveryCardProps> = ({ delivery, onUpdateStatus, onViewDetails }) => {
  const isPending = delivery.status === DeliveryStatus.PENDING;
  const isInProgress = delivery.status === DeliveryStatus.IN_PROGRESS;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 overflow-hidden group">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{delivery.id}</span>
            <h4 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{delivery.customerName}</h4>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge type="status" value={delivery.status} />
            <StatusBadge type="priority" value={delivery.priority} />
          </div>
        </div>

        <div className="space-y-2 mb-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-location-dot text-indigo-500 w-4"></i>
            <span className="truncate">{delivery.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-clock text-indigo-500 w-4"></i>
            <span>Est. {delivery.estTime} • {delivery.distance}</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-basket-shopping text-indigo-500 w-4"></i>
            <span className="truncate">{delivery.items.join(', ')}</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <span className="text-lg font-bold text-gray-900">${delivery.price.toFixed(2)}</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onViewDetails(delivery)}>
              Details
            </Button>
            {isPending && (
              <Button size="sm" onClick={() => onUpdateStatus(delivery.id, DeliveryStatus.IN_PROGRESS)}>
                Start
              </Button>
            )}
            {isInProgress && (
              <Button variant="primary" size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => onUpdateStatus(delivery.id, DeliveryStatus.DELIVERED)}>
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
