// Sistema de asignación de layouts para administrador central

import { getAllLayouts, type LayoutConfig } from '@/lib/layouts';
import { allClients, type Client } from '@/types';

export interface LayoutAssignment {
  id: string;
  layoutId: string;
  clientId: string;
  deviceIds?: string[]; // Si no se especifica, se aplica a todos los dispositivos del cliente
  isActive: boolean;
  assignedBy: string; // ID del administrador que asignó
  assignedAt: string;
  validFrom?: string;
  validUntil?: string;
  notes?: string;
}

export interface ClientLayout {
  clientId: string;
  clientName: string;
  assignedLayouts: {
    layout: LayoutConfig;
    assignment: LayoutAssignment;
    applicableDevices: string[];
  }[];
  defaultLayout?: LayoutConfig;
}

// Base de datos simulada de asignaciones (en producción esto iría en Supabase)
let layoutAssignments: LayoutAssignment[] = [
  {
    id: 'ASSIGN-001',
    layoutId: 'full-screen',
    clientId: 'CLIENT-001',
    deviceIds: ['DEVICE-001'],
    isActive: true,
    assignedBy: 'ADMIN-001',
    assignedAt: '2024-03-15T10:00:00Z',
    notes: 'Layout principal para Demo Client'
  },
  {
    id: 'ASSIGN-002',
    layoutId: 'split-vertical',
    clientId: 'CLIENT-002',
    deviceIds: ['DEVICE-002', 'DEVICE-003'],
    isActive: true,
    assignedBy: 'ADMIN-001',
    assignedAt: '2024-03-15T10:30:00Z',
    validFrom: '2024-03-15T00:00:00Z',
    validUntil: '2024-04-15T23:59:59Z',
    notes: 'Layout para promociones de Burger King'
  },
  {
    id: 'ASSIGN-003',
    layoutId: 'menu-board',
    clientId: 'CLIENT-003',
    deviceIds: ['DEVICE-004'],
    isActive: true,
    assignedBy: 'ADMIN-001',
    assignedAt: '2024-03-15T11:00:00Z',
    notes: 'Layout especial para menú de Subway'
  }
];

// Funciones para administrador central
export function getAllLayoutAssignments(): LayoutAssignment[] {
  return layoutAssignments;
}

export function getClientLayoutAssignments(clientId: string): LayoutAssignment[] {
  return layoutAssignments.filter(assignment => 
    assignment.clientId === clientId && assignment.isActive
  );
}

export function getClientLayouts(clientId: string): ClientLayout {
  const client = allClients.find((c: Client) => c.id === clientId);
  if (!client) {
    throw new Error(`Cliente ${clientId} no encontrado`);
  }

  const assignments = getClientLayoutAssignments(clientId);
  const allLayouts = getAllLayouts();

  const assignedLayouts = assignments.map(assignment => {
    const layout = allLayouts.find((l: LayoutConfig) => l.id === assignment.layoutId);
    if (!layout) {
      console.warn(`Layout ${assignment.layoutId} no encontrado para asignación ${assignment.id}`);
      return null;
    }

    return {
      layout,
      assignment,
      applicableDevices: assignment.deviceIds || [] // Aquí irían los IDs de dispositivos reales
    };
  }).filter(Boolean) as ClientLayout['assignedLayouts'];

  return {
    clientId: client.id,
    clientName: client.name,
    assignedLayouts,
    defaultLayout: allLayouts.find((l: LayoutConfig) => l.id === 'full-screen') || allLayouts[0]
  };
}

export function assignLayoutToClient(
  layoutId: string,
  clientId: string,
  deviceIds: string[] = [],
  adminId: string,
  notes?: string,
  validFrom?: string,
  validUntil?: string
): LayoutAssignment {
  // Validar que el layout exista
  const layout = getAllLayouts().find((l: LayoutConfig) => l.id === layoutId);
  if (!layout) {
    throw new Error(`Layout ${layoutId} no encontrado`);
  }

  // Validar que el cliente exista
  const client = allClients.find((c: Client) => c.id === clientId);
  if (!client) {
    throw new Error(`Cliente ${clientId} no encontrado`);
  }

  // Desactivar asignaciones previas del mismo layout al mismo cliente
  layoutAssignments = layoutAssignments.map(assignment => {
    if (assignment.clientId === clientId && assignment.layoutId === layoutId) {
      return { ...assignment, isActive: false };
    }
    return assignment;
  });

  // Crear nueva asignación
  const newAssignment: LayoutAssignment = {
    id: `ASSIGN-${Date.now()}`,
    layoutId,
    clientId,
    deviceIds: deviceIds.length > 0 ? deviceIds : undefined,
    isActive: true,
    assignedBy: adminId,
    assignedAt: new Date().toISOString(),
    validFrom,
    validUntil,
    notes
  };

  layoutAssignments.push(newAssignment);
  return newAssignment;
}

export function removeLayoutAssignment(assignmentId: string): boolean {
  const index = layoutAssignments.findIndex(a => a.id === assignmentId);
  if (index !== -1) {
    layoutAssignments[index].isActive = false;
    return true;
  }
  return false;
}

export function updateLayoutAssignment(
  assignmentId: string,
  updates: Partial<LayoutAssignment>
): LayoutAssignment | null {
  const index = layoutAssignments.findIndex(a => a.id === assignmentId);
  if (index !== -1) {
    layoutAssignments[index] = {
      ...layoutAssignments[index],
      ...updates,
      id: assignmentId // Mantener el ID original
    };
    return layoutAssignments[index];
  }
  return null;
}

// Función para obtener el layout activo de un dispositivo específico
export function getDeviceLayout(clientId: string, deviceId: string): LayoutConfig | null {
  const clientAssignments = getClientLayoutAssignments(clientId);
  const now = new Date().toISOString();

  // Buscar asignaciones específicas para este dispositivo
  const deviceSpecificAssignments = clientAssignments.filter(assignment => 
    assignment.deviceIds && assignment.deviceIds.includes(deviceId)
  );

  if (deviceSpecificAssignments.length > 0) {
    // Tomar la asignación más reciente
    const latestAssignment = deviceSpecificAssignments.sort((a, b) => 
      new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime()
    )[0];

    const layout = getAllLayouts().find((l: LayoutConfig) => l.id === latestAssignment.layoutId);
    return layout || null;
  }

  // Si no hay asignación específica para este dispositivo, 
  // buscar asignaciones generales del cliente (sin deviceIds específicos)
  const generalAssignments = clientAssignments.filter(assignment => 
    !assignment.deviceIds || assignment.deviceIds.length === 0
  );

  if (generalAssignments.length > 0) {
    const latestGeneralAssignment = generalAssignments.sort((a, b) => 
      new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime()
    )[0];

    const layout = getAllLayouts().find((l: LayoutConfig) => l.id === latestGeneralAssignment.layoutId);
    return layout || null;
  }

  return null;
}

// Función para obtener todos los clientes con sus layouts asignados
export function getAllClientsWithLayouts(): ClientLayout[] {
  return allClients.map((client: Client) => getClientLayouts(client.id));
}

// Función para administrador: obtener resumen de asignaciones
export function getLayoutAssignmentsSummary() {
  const allAssignments = getAllLayoutAssignments();
  const activeAssignments = allAssignments.filter(a => a.isActive);

  return {
    totalAssignments: allAssignments.length,
    activeAssignments: activeAssignments.length,
    assignmentsByClient: allClients.map((client: Client) => ({
      clientId: client.id,
      clientName: client.name,
      activeAssignments: activeAssignments.filter(a => a.clientId === client.id).length,
      totalAssignments: allAssignments.filter(a => a.clientId === client.id).length
    })),
    recentAssignments: activeAssignments
      .sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime())
      .slice(0, 10)
  };
}