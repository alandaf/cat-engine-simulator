export interface EngineParameters {
  engineSpeed: number;          // RPM
  engineLoad: number;          // %
  coolantTemp: number;         // °C
  oilPressure: number;        // kPa
  fuelRate: number;           // L/h
  intakeManifoldTemp: number; // °C
  exhaustTemp: number;        // °C
  batteryVoltage: number;     // V
  engineHours: number;        // h
  fuelLevel: number;          // L
}

export interface EngineDamage {
  oilSystem: number;          // 0-100%, 0 = destroyed
  pistons: number;           // 0-100%
  bearings: number;          // 0-100%
  valves: number;            // 0-100%
}

export interface MaintenanceStatus {
  oilChangeNeeded: boolean;
  filterChangeNeeded: boolean;
  overallHealth: number;      // 0-100%
  lastOilChange: number;      // Engine hours
  lastFilterChange: number;   // Engine hours
}

export interface EngineAlarms {
  highCoolantTemp: boolean;
  lowOilPressure: boolean;
  overspeed: boolean;
  lowFuelLevel: boolean;
  batteryWarning: boolean;
  engineDamage: boolean;
  maintenanceRequired: boolean;
}

export interface EngineState {
  running: boolean;
  parameters: EngineParameters;
  alarms: EngineAlarms;
  damage: EngineDamage;
  maintenance: MaintenanceStatus;
  fuelTankCapacity: number;   // L
  damaged: boolean;
}