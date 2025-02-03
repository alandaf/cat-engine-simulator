import React, { useState } from 'react';
import { Fuel } from 'lucide-react';

interface FuelPanelProps {
  fuelLevel: number;
  fuelCapacity: number;
  onRefuel: (amount: number) => void;
}

export const FuelPanel: React.FC<FuelPanelProps> = ({
  fuelLevel,
  fuelCapacity,
  onRefuel,
}) => {
  const [refuelAmount, setRefuelAmount] = useState(100);
  const fuelPercentage = (fuelLevel / fuelCapacity) * 100;

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <Fuel className="w-6 h-6 text-blue-400" />
        Fuel System
      </h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-gray-300 mb-2">
            <span className="font-medium">Fuel Level</span>
            <span className="font-mono">{fuelLevel.toFixed(1)}L / {fuelCapacity}L</span>
          </div>
          <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                fuelPercentage > 20 ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${fuelPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="number"
            min="0"
            max={fuelCapacity - fuelLevel}
            value={refuelAmount}
            onChange={(e) => setRefuelAmount(Number(e.target.value))}
            className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => onRefuel(refuelAmount)}
            disabled={fuelLevel >= fuelCapacity}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed font-medium transition-colors"
          >
            Refuel
          </button>
        </div>
      </div>
    </div>
  );
};