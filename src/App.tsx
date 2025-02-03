import React, { useState, useEffect, useCallback } from 'react';
import { Power, AlertTriangle } from 'lucide-react';
import { EngineState } from './types/engine';
import { EngineControls } from './components/EngineControls';
import { ParameterControl } from './components/ParameterControl';
import { AlarmPanel } from './components/AlarmPanel';
import { MaintenancePanel } from './components/MaintenancePanel';
import { FuelPanel } from './components/FuelPanel';
import { DebugPanel } from './components/DebugPanel';
import { EngineParametersPanel } from './components/EngineParameters';
import { rpiConnection } from './services/rpiConnection';

function App() {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [engineState, setEngineState] = useState<EngineState>({
    running: false,
    damaged: false,
    parameters: {
      engineSpeed: 0,
      engineLoad: 0,
      coolantTemp: 25,
      oilPressure: 0,
      fuelRate: 0,
      intakeManifoldTemp: 25,
      exhaustTemp: 25,
      batteryVoltage: 24,
      engineHours: 0,
      fuelLevel: 500,
    },
    alarms: {
      highCoolantTemp: false,
      lowOilPressure: false,
      overspeed: false,
      lowFuelLevel: false,
      batteryWarning: false,
      engineDamage: false,
      maintenanceRequired: false,
    },
    damage: {
      oilSystem: 100,
      pistons: 100,
      bearings: 100,
      valves: 100,
    },
    maintenance: {
      oilChangeNeeded: false,
      filterChangeNeeded: false,
      overallHealth: 100,
      lastOilChange: 0,
      lastFilterChange: 0,
    },
    fuelTankCapacity: 1000,
  });

  // Conectar al WebSocket
  useEffect(() => {
    rpiConnection.connect();
    const unsubscribe = rpiConnection.onStatusChange(setConnectionStatus);
    return () => {
      unsubscribe();
      rpiConnection.disconnect();
    };
  }, []);

  // Actualizar parámetros del motor cuando está en funcionamiento
  useEffect(() => {
    if (!engineState.running) return;

    const interval = setInterval(() => {
      setEngineState(prev => {
        // Calcular temperatura del motor (aumenta gradualmente)
        const targetTemp = prev.parameters.engineLoad * 0.6 + 40; // Temperatura objetivo basada en carga
        const currentTemp = prev.parameters.coolantTemp;
        const newTemp = currentTemp + (targetTemp - currentTemp) * 0.1;

        // Calcular carga del motor basada en RPM
        const rpmRange = 1700 - 500;
        const currentRpm = prev.parameters.engineSpeed - 500;
        const newLoad = (currentRpm / rpmRange) * 100;

        // Calcular consumo de combustible basado en RPM y carga
        const maxFuelRate = 200; // L/h a máxima potencia
        const rpmFactor = currentRpm / rpmRange;
        const loadFactor = newLoad / 100;
        const newFuelRate = maxFuelRate * rpmFactor * loadFactor;

        // Actualizar nivel de combustible
        const fuelConsumed = (newFuelRate / 3600); // Consumo por segundo
        const newFuelLevel = Math.max(0, prev.parameters.fuelLevel - fuelConsumed);

        // Actualizar horas de operación
        const newHours = prev.parameters.engineHours + 1/3600;

        // Calcular presión de aceite basada en RPM
        const baseOilPressure = 40;
        const maxOilPressure = 80;
        const oilPressure = baseOilPressure + 
          ((maxOilPressure - baseOilPressure) * rpmFactor);

        // Actualizar temperatura de admisión
        const newIntakeTemp = 25 + (newLoad * 0.3);

        // Actualizar temperatura de escape
        const newExhaustTemp = 100 + (newLoad * 5);

        // Actualizar voltaje de batería (simular pequeñas fluctuaciones)
        const newVoltage = 24 + (Math.random() * 0.4 - 0.2);

        return {
          ...prev,
          parameters: {
            ...prev.parameters,
            coolantTemp: newTemp,
            fuelRate: newFuelRate,
            engineLoad: newLoad,
            fuelLevel: newFuelLevel,
            engineHours: newHours,
            oilPressure: oilPressure,
            intakeManifoldTemp: newIntakeTemp,
            exhaustTemp: newExhaustTemp,
            batteryVoltage: newVoltage
          },
          alarms: {
            ...prev.alarms,
            highCoolantTemp: newTemp > 95,
            lowOilPressure: oilPressure < 30,
            lowFuelLevel: newFuelLevel < 100,
            overspeed: prev.parameters.engineSpeed > 1650,
            batteryWarning: newVoltage < 23.5
          }
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [engineState.running]);

  // Enviar datos al servidor
  useEffect(() => {
    if (engineState.running) {
      rpiConnection.sendData(engineState.parameters);
    }
  }, [engineState.parameters, engineState.running]);

  const toggleEngine = () => {
    setEngineState(prev => {
      if (prev.damaged) return prev;
      
      const newRunning = !prev.running;
      return {
        ...prev,
        running: newRunning,
        parameters: {
          ...prev.parameters,
          engineSpeed: newRunning ? 500 : 0,
          oilPressure: newRunning ? 40 : 0,
          engineLoad: 0,
        }
      };
    });
  };

  const emergencyStop = () => {
    setEngineState(prev => ({
      ...prev,
      running: false,
      parameters: {
        ...prev.parameters,
        engineSpeed: 0,
        engineLoad: 0,
        oilPressure: 0,
      }
    }));
  };

  const handleSpeedChange = (newSpeed: number) => {
    if (!engineState.running) return;
    
    setEngineState(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        engineSpeed: newSpeed,
      }
    }));
  };

  const handleRefuel = (amount: number) => {
    setEngineState(prev => {
      const newFuelLevel = Math.min(
        prev.parameters.fuelLevel + amount,
        prev.fuelTankCapacity
      );
      return {
        ...prev,
        parameters: {
          ...prev.parameters,
          fuelLevel: newFuelLevel,
        },
        alarms: {
          ...prev.alarms,
          lowFuelLevel: newFuelLevel < 100,
        }
      };
    });
  };

  const handleMaintenance = (type: 'oil' | 'filter' | 'repair') => {
    setEngineState(prev => {
      if (type === 'repair') {
        return {
          ...prev,
          damaged: false,
          damage: {
            oilSystem: 100,
            pistons: 100,
            bearings: 100,
            valves: 100,
          }
        };
      }

      const currentHours = prev.parameters.engineHours;
      return {
        ...prev,
        maintenance: {
          ...prev.maintenance,
          lastOilChange: type === 'oil' ? currentHours : prev.maintenance.lastOilChange,
          lastFilterChange: type === 'filter' ? currentHours : prev.maintenance.lastFilterChange,
          oilChangeNeeded: type === 'oil' ? false : prev.maintenance.oilChangeNeeded,
          filterChangeNeeded: type === 'filter' ? false : prev.maintenance.filterChangeNeeded,
        }
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">CAT 3516B Engine Simulator</h1>
            <div className={`px-3 py-1 rounded-full text-sm ${
              connectionStatus === 'connected' 
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
            </div>
          </div>

          <div className="space-y-6">
            <EngineControls
              running={engineState.running}
              onToggle={toggleEngine}
              emergencyStop={emergencyStop}
            />
            
            <div className="space-y-4">
              <ParameterControl
                label="Engine Speed"
                value={engineState.parameters.engineSpeed}
                min={500}
                max={1700}
                step={10}
                unit="RPM"
                onChange={handleSpeedChange}
                disabled={!engineState.running}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Engine Parameters</h2>
          <EngineParametersPanel parameters={engineState.parameters} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AlarmPanel
            alarms={engineState.alarms}
            engineHours={engineState.parameters.engineHours}
          />
          <FuelPanel
            fuelLevel={engineState.parameters.fuelLevel}
            fuelCapacity={engineState.fuelTankCapacity}
            onRefuel={handleRefuel}
          />
        </div>

        <MaintenancePanel
          maintenance={engineState.maintenance}
          damage={engineState.damage}
          onMaintenance={handleMaintenance}
          engineHours={engineState.parameters.engineHours}
        />

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Debug Information</h2>
          <DebugPanel parameters={engineState.parameters} />
        </div>
      </div>
    </div>
  );
}

export default App;