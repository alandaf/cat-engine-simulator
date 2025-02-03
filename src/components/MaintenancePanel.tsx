import React from 'react';
import { Wrench, AlertTriangle } from 'lucide-react';
import type { MaintenanceStatus, EngineDamage } from '../types/engine';

interface MaintenancePanelProps {
  maintenance: MaintenanceStatus;
  damage: EngineDamage;
  onMaintenance: (type: 'oil' | 'filter' | 'repair') => void;
  engineHours: number;
}

export const MaintenancePanel: React.FC<MaintenancePanelProps> = ({
  maintenance,
  damage,
  onMaintenance,
  engineHours,
}) => {
  const getDamageColor = (value: number) => {
    if (value > 80) return 'text-green-400';
    if (value > 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <Wrench className="w-5 h-5" />
        Maintenance & Damage Status
      </h3>

      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold mb-3 text-gray-200">Engine Health</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gray-300 font-medium mb-1">Oil System</div>
              <div className={`text-lg font-bold ${getDamageColor(damage.oilSystem)}`}>
                {damage.oilSystem.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-gray-300 font-medium mb-1">Pistons</div>
              <div className={`text-lg font-bold ${getDamageColor(damage.pistons)}`}>
                {damage.pistons.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-gray-300 font-medium mb-1">Bearings</div>
              <div className={`text-lg font-bold ${getDamageColor(damage.bearings)}`}>
                {damage.bearings.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-gray-300 font-medium mb-1">Valves</div>
              <div className={`text-lg font-bold ${getDamageColor(damage.valves)}`}>
                {damage.valves.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3 text-gray-200">Maintenance Status</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-gray-300">
              <span className="font-medium">Last Oil Change:</span>
              <span className="font-mono">{maintenance.lastOilChange.toFixed(1)} hours</span>
            </div>
            <div className="flex items-center justify-between text-gray-300">
              <span className="font-medium">Last Filter Change:</span>
              <span className="font-mono">{maintenance.lastFilterChange.toFixed(1)} hours</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-300">Overall Health:</span>
              <span className={`font-mono font-bold ${getDamageColor(maintenance.overallHealth)}`}>
                {maintenance.overallHealth.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onMaintenance('oil')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              maintenance.oilChangeNeeded
                ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Change Oil
          </button>
          <button
            onClick={() => onMaintenance('filter')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              maintenance.filterChangeNeeded
                ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Change Filters
          </button>
          {Object.values(damage).some(value => value < 100) && (
            <button
              onClick={() => onMaintenance('repair')}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Repair Engine
            </button>
          )}
        </div>
      </div>
    </div>
  );
};