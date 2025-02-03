// Definición de PGNs para coincidir con el simulador Python
export const PGN = {
  ENGINE_SPEED: 0xF004,
  ENGINE_TEMPERATURE: 0xFEEE,
  FUEL_RATE: 0xFEFC,
  OIL_PRESSURE: 0xFEF5,
  BATTERY_VOLTAGE: 0xFEDF,
  ENGINE_TORQUE: 0xF003,
  INTAKE_PRESSURE: 0xFEF6,
  INTAKE_TEMPERATURE: 0xFEF7,
  EXHAUST_PRESSURE: 0xF002,
  PYROMETER_TEMPERATURE: 0xFEF8,
  ENGINE_HOURS: 0xFF01,
  TOTAL_FUEL_CONSUMED: 0xFF02,
  FUEL_LEVEL: 0xFEF9,
  ENGINE_STATUS: 0xFEFA,
  ENGINE_LOAD: 0xF005
};

// Función para convertir valores a formato CAN
export function formatJ1939Data(parameters: EngineParameters) {
  const data: Record<number, number> = {
    [PGN.ENGINE_SPEED]: Math.round(parameters.engineSpeed),
    [PGN.ENGINE_TEMPERATURE]: Math.round(parameters.coolantTemp),
    [PGN.FUEL_RATE]: Math.round(parameters.fuelRate),
    [PGN.OIL_PRESSURE]: Math.round(parameters.oilPressure),
    [PGN.BATTERY_VOLTAGE]: Math.round(parameters.batteryVoltage),
    [PGN.ENGINE_TORQUE]: Math.round((parameters.engineLoad / 100) * 13000), // Convertir carga a torque
    [PGN.INTAKE_TEMPERATURE]: Math.round(parameters.intakeManifoldTemp),
    [PGN.PYROMETER_TEMPERATURE]: Math.round(parameters.exhaustTemp),
    [PGN.ENGINE_HOURS]: Math.round(parameters.engineHours),
    [PGN.FUEL_LEVEL]: Math.round(parameters.fuelLevel),
    [PGN.ENGINE_STATUS]: parameters.running ? 2 : 0, // 0=Apagado, 1=Iniciando, 2=En Marcha, 3=Falla
    [PGN.ENGINE_LOAD]: Math.round(parameters.engineLoad)
  };

  // Convertir cada valor a un mensaje CAN
  const messages: Record<number, Uint8Array> = {};
  for (const [pgn, value] of Object.entries(data)) {
    const valueBytes = new Uint8Array(8);
    valueBytes[0] = value & 0xFF;
    valueBytes[1] = (value >> 8) & 0xFF;
    messages[Number(pgn)] = valueBytes;
  }

  return messages;
}