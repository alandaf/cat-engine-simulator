import React from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import type { EngineAlarms } from '../types/engine';

interface AlarmPanelProps {
  alarms: EngineAlarms;
  engineHours: number;
}

export const AlarmPanel: React.FC<AlarmPanelProps> = ({ alarms, engineHours }) => {
  const activeAlarms = Object.entries(alarms).filter(([_, active]) => active);

  const getAlarmText = (alarm: string): string => {
    switch (alarm) {
      case 'highCoolantTemp': return 'Alta Temperatura del Motor';
      case 'lowOilPressure': return 'Baja Presión de Aceite';
      case 'overspeed': return 'Sobrevelocidad';
      case 'lowFuelLevel': return 'Nivel Bajo de Combustible';
      case 'batteryWarning': return 'Advertencia de Batería';
      case 'engineDamage': return 'Daño en el Motor';
      case 'maintenanceRequired': return 'Mantenimiento Requerido';
      default: return alarm;
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-red-400" />
          Active Alarms
        </h3>
        <div className="flex items-center gap-2 text-gray-300">
          <Clock className="w-4 h-4" />
          <span className="font-mono">{engineHours.toFixed(1)} hours</span>
        </div>
      </div>

      {activeAlarms.length === 0 ? (
        <p className="text-green-400 flex items-center gap-2 bg-green-500/10 p-3 rounded-lg">
          <span className="w-2 h-2 bg-green-400 rounded-full" />
          No hay alarmas activas
        </p>
      ) : (
        <div className="grid gap-2">
          {activeAlarms.map(([alarm]) => (
            <div
              key={alarm}
              className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg"
            >
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">
                {getAlarmText(alarm)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};