// Sistema de control administrativo para SIGN787 TV
// El administrador controla todos los layouts y contenido que los clientes ven

export interface AdminLayoutAssignment {
  id: string;
  clientId: string;
  deviceId: string;
  layoutId: string;
  assignedAt: string;
  assignedBy: string; // admin user ID
  isActive: boolean;
  schedule?: {
    startTime?: string;
    endTime?: string;
    daysOfWeek?: number[]; // 0-6 (Sunday to Saturday)
  };
}

export interface AdminContentAssignment {
  id: string;
  clientId: string;
  deviceId?: string; // optional - if null, applies to all devices
  contentId: string;
  layoutZoneId?: string; // specific zone in layout
  assignedAt: string;
  assignedBy: string;
  isActive: boolean;
  displayOrder: number;
  duration?: number; // milliseconds to display
  schedule?: {
    startTime?: string;
    endTime?: string;
    daysOfWeek?: number[];
  };
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video' | 'text';
  url: string;
  thumbnailUrl?: string;
  duration: number; // milliseconds
  size: number; // bytes
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
  };
}

// Base de datos simulada para el sistema administrativo
const adminLayoutAssignments: AdminLayoutAssignment[] = [
  {
    id: 'ASSIGN-001',
    clientId: 'CLIENT-001',
    deviceId: 'DEVICE-001',
    layoutId: 'full-screen',
    assignedAt: '2024-03-15T10:00:00Z',
    assignedBy: 'ADMIN-001',
    isActive: true
  },
  {
    id: 'ASSIGN-002',
    clientId: 'CLIENT-002',
    deviceId: 'DEVICE-002',
    layoutId: 'menu-board',
    assignedAt: '2024-03-15T11:00:00Z',
    assignedBy: 'ADMIN-001',
    isActive: true,
    schedule: {
      startTime: '06:00',
      endTime: '22:00',
      daysOfWeek: [1, 2, 3, 4, 5, 6, 0] // all days
    }
  },
  {
    id: 'ASSIGN-003',
    clientId: 'CLIENT-002',
    deviceId: 'DEVICE-003',
    layoutId: 'four-zones',
    assignedAt: '2024-03-15T12:00:00Z',
    assignedBy: 'ADMIN-001',
    isActive: true
  }
];

const adminContentAssignments: AdminContentAssignment[] = [
  {
    id: 'CONTENT-ASSIGN-001',
    clientId: 'CLIENT-001',
    deviceId: 'DEVICE-001',
    contentId: 'CONTENT-001',
    assignedAt: '2024-03-15T10:00:00Z',
    assignedBy: 'ADMIN-001',
    isActive: true,
    displayOrder: 1,
    duration: 5000
  },
  {
    id: 'CONTENT-ASSIGN-002',
    clientId: 'CLIENT-002',
    deviceId: 'DEVICE-002',
    contentId: 'CONTENT-002',
    layoutZoneId: 'items',
    assignedAt: '2024-03-15T11:00:00Z',
    assignedBy: 'ADMIN-001',
    isActive: true,
    displayOrder: 1,
    duration: 8000,
    schedule: {
      startTime: '12:00',
      endTime: '14:00',
      daysOfWeek: [1, 2, 3, 4, 5] // weekdays only
    }
  }
];

const adminContentLibrary: ContentItem[] = [
  {
    id: 'CONTENT-001',
    title: 'Promoción Especial Hamburguesas',
    description: 'Oferta 2x1 en hamburguesas todos los martes',
    type: 'image',
    url: 'https://pub-096ae7504db44ad2ab3a6358a6e180c4.r2.dev/uploads/sample-1.jpg',
    duration: 5000,
    size: 1024000,
    uploadedBy: 'ADMIN-001',
    uploadedAt: '2024-03-14T15:00:00Z',
    tags: ['promoción', 'hamburguesas', '2x1']
  },
  {
    id: 'CONTENT-002',
    title: 'Menú del Día',
    description: 'Especial del día: Sandwich + Bebida + Papas',
    type: 'image',
    url: 'https://pub-096ae7504db44ad2ab3a6358a6e180c4.r2.dev/uploads/sample-2.jpg',
    duration: 8000,
    size: 1536000,
    uploadedBy: 'ADMIN-001',
    uploadedAt: '2024-03-14T16:00:00Z',
    tags: ['menú', 'especial', 'completo']
  },
  {
    id: 'CONTENT-003',
    title: 'Video Promocional Subway',
    description: 'Comercial de 10 segundos para Subway',
    type: 'video',
    url: 'https://pub-096ae7504db44ad2ab3a6358a6e180c4.r2.dev/uploads/sample-video.mp4',
    duration: 10000,
    size: 5242880,
    uploadedBy: 'ADMIN-001',
    uploadedAt: '2024-03-14T17:00:00Z',
    tags: ['promocional', 'video', 'subway'],
    metadata: {
      width: 1920,
      height: 1080,
      format: 'mp4'
    }
  }
];

// Funciones del sistema administrativo
export function getClientAssignedLayouts(clientId: string): AdminLayoutAssignment[] {
  return adminLayoutAssignments.filter(assignment => 
    assignment.clientId === clientId && assignment.isActive
  );
}

export function getDeviceAssignedLayout(clientId: string, deviceId: string): AdminLayoutAssignment | undefined {
  return adminLayoutAssignments.find(assignment => 
    assignment.clientId === clientId && 
    assignment.deviceId === deviceId && 
    assignment.isActive
  );
}

export function getClientAssignedContent(clientId: string): AdminContentAssignment[] {
  return adminContentAssignments.filter(assignment => 
    assignment.clientId === clientId && assignment.isActive
  );

}

export function getDeviceAssignedContent(clientId: string, deviceId: string): AdminContentAssignment[] {
  return adminContentAssignments.filter(assignment => 
    assignment.clientId === clientId && 
    (assignment.deviceId === deviceId || assignment.deviceId === undefined) && 
    assignment.isActive
  );
}

export function getContentById(contentId: string): ContentItem | undefined {
  return adminContentLibrary.find(content => content.id === contentId);
}

export function getAllAdminContent(): ContentItem[] {
  return [...adminContentLibrary];
}

export function assignLayoutToClient(
  clientId: string, 
  deviceId: string, 
  layoutId: string, 
  adminId: string,
  schedule?: AdminLayoutAssignment['schedule']
): AdminLayoutAssignment {
  // En producción, esto se guardaría en la base de datos
  const newAssignment: AdminLayoutAssignment = {
    id: `ASSIGN-${Date.now()}`,
    clientId,
    deviceId,
    layoutId,
    assignedAt: new Date().toISOString(),
    assignedBy: adminId,
    isActive: true,
    schedule
  };
  
  // Desactivar asignaciones anteriores para este dispositivo
  const existingAssignments = adminLayoutAssignments.filter(
    a => a.clientId === clientId && a.deviceId === deviceId && a.isActive
  );
  
  existingAssignments.forEach(assignment => {
    assignment.isActive = false;
  });
  
  adminLayoutAssignments.push(newAssignment);
  return newAssignment;
}

export function assignContentToClient(
  clientId: string,
  contentId: string,
  adminId: string,
  deviceId?: string,
  layoutZoneId?: string,
  options?: {
    displayOrder?: number;
    duration?: number;
    schedule?: AdminContentAssignment['schedule'];
  }
): AdminContentAssignment {
  const newAssignment: AdminContentAssignment = {
    id: `CONTENT-ASSIGN-${Date.now()}`,
    clientId,
    deviceId,
    contentId,
    layoutZoneId,
    assignedAt: new Date().toISOString(),
    assignedBy: adminId,
    isActive: true,
    displayOrder: options?.displayOrder || 1,
    duration: options?.duration,
    schedule: options?.schedule
  };
  
  adminContentAssignments.push(newAssignment);
  return newAssignment;
}

export function removeContentAssignment(assignmentId: string): boolean {
  const assignment = adminContentAssignments.find(a => a.id === assignmentId);
  if (assignment) {
    assignment.isActive = false;
    return true;
  }
  return false;
}

export function removeLayoutAssignment(assignmentId: string): boolean {
  const assignment = adminLayoutAssignments.find(a => a.id === assignmentId);
  if (assignment) {
    assignment.isActive = false;
    return true;
  }
  return false;
}

// Función para verificar si el contenido debe mostrarse ahora
export function shouldDisplayContent(assignment: AdminContentAssignment): boolean {
  if (!assignment.isActive) return false;
  
  if (!assignment.schedule) return true;
  
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // minutos desde medianoche
  const currentDay = now.getDay();
  
  if (assignment.schedule.startTime) {
    const [startHour, startMinute] = assignment.schedule.startTime.split(':').map(Number);
    const startTime = startHour * 60 + startMinute;
    if (currentTime < startTime) return false;
  }
  
  if (assignment.schedule.endTime) {
    const [endHour, endMinute] = assignment.schedule.endTime.split(':').map(Number);
    const endTime = endHour * 60 + endMinute;
    if (currentTime > endTime) return false;
  }
  
  if (assignment.schedule.daysOfWeek && assignment.schedule.daysOfWeek.length > 0) {
    if (!assignment.schedule.daysOfWeek.includes(currentDay)) return false;
  }
  
  return true;
}

// Función para obtener el contenido activo de un cliente
export function getClientActiveContent(clientId: string): ContentItem[] {
  const assignments = getClientAssignedContent(clientId);
  const activeAssignments = assignments.filter(shouldDisplayContent);
  
  return activeAssignments
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(assignment => getContentById(assignment.contentId))
    .filter(Boolean) as ContentItem[];
}

// Función para obtener el contenido activo de un dispositivo específico
export function getDeviceActiveContent(clientId: string, deviceId: string): ContentItem[] {
  const assignments = getDeviceAssignedContent(clientId, deviceId);
  const activeAssignments = assignments.filter(shouldDisplayContent);
  
  return activeAssignments
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(assignment => getContentById(assignment.contentId))
    .filter(Boolean) as ContentItem[];
}