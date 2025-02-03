import React from 'react';
import { formatJ1939Data } from '../types/j1939';
import { EngineParameters } from '../types/engine';

interface DebugPanelProps {
  parameters: EngineParameters;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ parameters }) => {
  const j1939Data = formatJ1939Data(parameters);
  
  return (
    <div className="space-y-4">
      {/* Parámetros del motor en formato legible */}
      <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm">
        <h3 className="text-gray-300 font-semibold mb-3">Engine Data</h3>
        <div className="text-green-400 whitespace-pre-wrap">
          RPM={parameters.engineSpeed}, 
          Temp={parameters.coolantTemp.toFixed(1)}°C, 
          Fuel={parameters.fuelRate.toFixed(1)} L/h, 
          Oil={parameters.oilPressure.toFixed(1)} PSI, 
          Voltage={parameters.batteryVoltage.toFixed(1)} V, 
          Load={parameters.engineLoad.toFixed(1)}%, 
          Hours={parameters.engineHours.toFixed(2)} h,
          Fuel Level={parameters.fuelLevel.toFixed(1)} L
        </div>
      </div>

      {/* Mensajes J1939 */}
      <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm">
        <h3 className="text-gray-300 font-semibold mb-3">J1939 Messages</h3>
        <div className="space-y-1">
          {Object.entries(j1939Data).map(([pgn, data]) => (
            <div key={pgn} className="flex gap-2 items-center">
              <span className="text-yellow-400 min-w-[100px]">PGN: {pgn}</span>
              <span className="text-gray-400">|</span>
              <span className="text-green-400 font-mono">
                Data: {Array.from(data).map(b => b.toString(16).padStart(2, '0')).join(' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Estado del Motor */}
      <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm">
        <h3 className="text-gray-300 font-semibold mb-3">Engine Status</h3>
        <div className="text-green-400">
          Estado del Motor: {parameters.engineSpeed > 0 ? '1 (Running)' : '0 (Stopped)'}
        </div>
      </div>
    </div>
  );
};