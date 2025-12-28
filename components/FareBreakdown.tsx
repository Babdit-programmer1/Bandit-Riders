
import React from 'react';
import { FareBreakdownData } from '../types';
import { formatNaira } from '../utils/fareCalculator';

interface Props {
  data: FareBreakdownData;
}

const FareBreakdown: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-3">
      <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
        <span>Base Fare</span>
        <span>{formatNaira(data.base)}</span>
      </div>
      <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
        <span>Distance Cost</span>
        <span>{formatNaira(data.distanceCost)}</span>
      </div>
      <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
        <span>Estimated Time</span>
        <span>{formatNaira(data.timeCost)}</span>
      </div>
      {data.multiplier > 1 && (
        <div className="flex justify-between text-xs font-black text-amber-600 uppercase tracking-widest">
          <span>Busy Area Multiplier</span>
          <span>x{data.multiplier}</span>
        </div>
      )}
      <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
        <span className="text-sm font-black text-slate-900 uppercase">Total Estimate</span>
        <span className="text-2xl font-black text-indigo-600">{formatNaira(data.total)}</span>
      </div>
    </div>
  );
};

export default FareBreakdown;
