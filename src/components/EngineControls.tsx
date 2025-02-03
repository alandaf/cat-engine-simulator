import React from 'react';
import { Power, AlertTriangle } from 'lucide-react';

interface EngineControlsProps {
  running: boolean;
  onToggle: () => void;
  emergencyStop: () => void;
}

export const EngineControls: React.FC<EngineControlsProps> = ({
  running,
  onToggle,
  emergencyStop,
}) => {
  return (
    <div className="flex gap-4">
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
          running
            ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20'
            : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20'
        }`}
      >
        <Power className="w-5 h-5" />
        {running ? 'Detener Motor' : 'Arrancar Motor'}
      </button>
      <button
        onClick={emergencyStop}
        className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg shadow-yellow-900/20"
      >
        <AlertTriangle className="w-5 h-5" />
        Parada de Emergencia
      </button>
    </div>
  );
};