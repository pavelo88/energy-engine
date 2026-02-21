export const CHECKLIST_SECTIONS = {
    "INSPECCION EN EL MOTOR": ["Nivel de lubricante", "Indicador nivel refrigerante", "Correa del ventilador", "Filtro de combustible y prefiltro", "Filtro de aire", "Filtro de aceite y prefiltro de aceite", "Tubo de escape", "Circuito de refrigeración", "Circuito de lubricación", "Baterías", "Motor de arranque"],
    "INSPECCION EN EL ALTERNADOR": ["Placas de los bornes", "Regulador eléctrico", "Colector", "Rodamiento", "Ventilación", "Escobillas", "Maniobra"],
    "INSPECCION EQUIPO ELECTRICO": ["Aparatos de medida", "Pilotos", "Mantenedor de baterías", "Interruptor general", "Resistencia de caldeo", "Contactores", "Reles auxiliares", "Apriete bornes", "Cableado"],
    "RECAMBIOS": ["Filtro de combustible", "Filtro de aceite", "Filtro de aire", "Correa motor", "Aceite", "Anticongelante"]
  };
  
  export const ALL_CHECKLIST_ITEMS = Object.values(CHECKLIST_SECTIONS).flat();