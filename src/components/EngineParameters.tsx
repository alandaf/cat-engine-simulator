import React from 'react';
import { EngineParameters } from '../types/engine';

interface EngineParametersPanelProps {
  parameters: EngineParameters;
}

export const EngineParametersPanel: React.FC<EngineParametersPanelProps> = ({ parameters }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-gray-400 text-sm mb-1">RPM Motor</h3>
        <p className="text-3xl font-mono text-green-400">{parameters.engineSpeed}</p>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-gray-400 text-sm mb-1">Temp Motor</h3>
        <p className="text-3xl font-mono text-green-400">{parameters.coolantTemp.toFixed(1)}°C</p>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-gray-400 text-sm mb-1">Presión Aceite</h3>
        <p className="text-3xl font-mono text-green-400">{parameters.oilPressure.toFixed(1)} psi</p>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-gray-400 text-sm mb-1">Consumo Combustible</h3>
        <p className="text-3xl font-mono text-green-400">{parameters.fuelRate.toFixed(1)} L/h</p>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-gray-400 text-sm mb-1">Temp Admisión</h3>
        <p className="text-3xl font-mono text-green-400">{parameters.intakeManifoldTemp.toFixed(1)}°C</p>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-gray-400 text-sm mb-1">Voltaje Batería</h3>
        <p className="text-3xl font-mono text-green-400">{parameters.batteryVoltage.toFixed(1)}V</p>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-gray-400 text-sm mb-1">Carga Motor</h3>
        <p className="text-3xl font-mono text-green-400">{parameters.engineLoad.toFixed(0)}%</p>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-gray-400 text-sm mb-1">Nivel Combustible</h3>
        <p className="text-3xl font-mono text-green-400">{parameters.fuelLevel.toFixed(1)}L</p>
      </div>
    </div>
  );
};