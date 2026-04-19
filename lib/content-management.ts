// Sistema de contenido administrado para asignación por cliente

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video';
  url: string;
  duration: number; // en milisegundos
  category: string;
  tags: string[];
  approved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  uploadedAt: string;
  clientId?: string; // Si está asignado a un cliente específico
  deviceIds?: string[]; // Si está asignado a dispositivos específicos
}

export interface ContentAssignment {
  id: string;
  contentId: string;
  clientId: string;
  deviceIds?: string[];
  playlistId?: string;
  assignedBy: string;
  assignedAt: string;
  validFrom?: string;
  validUntil?: string;
  priority: number; // 1-10, mayor número = mayor prioridad
  notes?: string;
}

// Contenido de prueba administrado
export const managedContent: ContentItem[] = [
  {
    id: 'CONTENT-ADMIN-001',
    title: 'Promoción Hamburguesas 2x1',
    description: 'Oferta especial de hamburguesas 2x1 por tiempo limitado',
    type: 'image',
    url: 'https://pub-096ae7504db44ad2ab3a6358a6e180c4.r2.dev/uploads/promo-burgers.jpg',
    duration: 8000,
    category: 'promociones',
    tags: ['comida', 'oferta', '2x1', 'hamburguesas'],
    approved: true,
    approvedBy: 'ADMIN-001',
    approvedAt: '2024-03-15T10:00:00Z',
    uploadedAt: '2024-03-15T09:30:00Z',
    clientId: 'CLIENT-002', // Burger King
    deviceIds: ['DEVICE-002', 'DEVICE-003']
  },
  {
    id: 'CONTENT-ADMIN-002',
    title: 'Menú del Día Subway',
    description: 'Sub del día con bebida y galletas por $8.99',
    type: 'image',
    url: 'https://pub-096ae7504db44ad2ab3a6358a6e180c4.r2.dev/uploads/subway-menu.jpg',
    duration: 10000,
    category: 'menu',
    tags: ['subway', 'menu', 'comida', 'oferta'],
    approved: true,
    approvedBy: 'ADMIN-001',
    approvedAt: '2024-03-15T10:15:00Z',
    uploadedAt: '2024-03-15T09:45:00Z',
    clientId: 'CLIENT-003' // Subway
  },
  {
    id: 'CONTENT-ADMIN-003',
    title: 'Video Promocional General',
    description: 'Video de 15 segundos mostrando la experiencia SIGN787',
    type: 'video',
    url: 'https://pub-096ae7504db44ad2ab3a6358a6e180c4.r2.dev/uploads/promo-video.mp4',
    duration: 15000,
    category: 'promocional',
    tags: ['general', 'promocion', 'video'],
    approved: true,
    approvedBy: 'ADMIN-001',
    approvedAt: '2024-03-15T10:30:00Z',
    uploadedAt: '2024-03-15T10:00:00Z'
  },
  {
    id: 'CONTENT-ADMIN-004',
    title: 'Oferta Especial Bebidas',
    description: '2 litros de bebida por $1.99 - Solo hoy',
    type: 'image',
    url: 'https://pub-096ae7504db44ad2ab3a6358a6e180c4.r2.dev/uploads/drinks-promo.jpg',
    duration: 6000,
    category: 'promociones',
    tags: ['bebidas', 'oferta', 'limitado', 'hoy'],
    approved: true,
    approvedBy: 'ADMIN-001',
    approvedAt: '2024-03-15T11:00:00Z',
    uploadedAt: '2024-03-15T10:30:00Z',
    clientId: 'CLIENT-002' // Burger King
  }
];

// Asignaciones de contenido
export const contentAssignments: ContentAssignment[] = [
  {
    id: 'ASSIGN-CONTENT-001',
    contentId: 'CONTENT-ADMIN-001',
    clientId: 'CLIENT-002',
    deviceIds: ['DEVICE-002', 'DEVICE-003'],
    playlistId: 'PLAYLIST-BK-001',
    assignedBy: 'ADMIN-001',
    assignedAt: '2024-03-15T10:30:00Z',
    priority: 8,
    notes: 'Promoción principal para Burger King Bayamón'
  },
  {
    id: 'ASSIGN-CONTENT-002',
    contentId: 'CONTENT-ADMIN-002',
    clientId: 'CLIENT-003',
    deviceIds: ['DEVICE-004'],
    playlistId: 'PLAYLIST-SW-001',
    assignedBy: 'ADMIN-001',
    assignedAt: '2024-03-15T10:45:00Z',
    priority: 9,
    validFrom: '2024-03-15T00:00:00Z',
    validUntil: '2024-03-20T23:59:59Z',
    notes: 'Menú del día para Subway Plaza'
  }
];

// Funciones para administrador
export function getAllManagedContent(): ContentItem[] {
  return managedContent;
}

export function getApprovedContent(): ContentItem[] {
  return managedContent.filter(content => content.approved);
}

export function getClientContent(clientId: string): ContentItem[] {
  return managedContent.filter(content => 
    content.approved && 
    (!content.clientId || content.clientId === clientId)
  );
}

export function getDeviceContent(clientId: string, deviceId: string): ContentItem[] {
  return managedContent.filter(content => {
    if (!content.approved) return false;
    
    // Verificar si el contenido está asignado al cliente
    const clientMatch = !content.clientId || content.clientId === clientId;
    if (!clientMatch) return false;
    
    // Verificar si está asignado a dispositivos específicos
    if (content.deviceIds && content.deviceIds.length > 0) {
      return content.deviceIds.includes(deviceId);
    }
    
    return true; // Si no hay restricción de dispositivos, mostrar todo el contenido del cliente
  });
}

export function approveContent(contentId: string, adminId: string): boolean {
  const content = managedContent.find(c => c.id === contentId);
  if (content) {
    content.approved = true;
    content.approvedBy = adminId;
    content.approvedAt = new Date().toISOString();
    return true;
  }
  return false;
}

export function rejectContent(contentId: string): boolean {
  const content = managedContent.find(c => c.id === contentId);
  if (content) {
    content.approved = false;
    content.approvedBy = undefined;
    content.approvedAt = undefined;
    return true;
  }
  return false;
}

export function assignContentToClient(
  contentId: string,
  clientId: string,
  deviceIds: string[] = [],
  playlistId?: string,
  adminId: string = 'ADMIN-001',
  priority: number = 5,
  notes?: string,
  validFrom?: string,
  validUntil?: string
): ContentAssignment {
  // Verificar que el contenido exista
  const content = managedContent.find(c => c.id === contentId);
  if (!content) {
    throw new Error(`Contenido ${contentId} no encontrado`);
  }

  // Desactivar asignaciones previas del mismo contenido al mismo cliente
  contentAssignments.forEach(assignment => {
    if (assignment.contentId === contentId && assignment.clientId === clientId) {
      // En producción, marcaría como inactiva en lugar de eliminar
      const index = contentAssignments.indexOf(assignment);
      if (index > -1) {
        contentAssignments.splice(index, 1);
      }
    }
  });

  // Crear nueva asignación
  const newAssignment: ContentAssignment = {
    id: `ASSIGN-CONTENT-${Date.now()}`,
    contentId,
    clientId,
    deviceIds: deviceIds.length > 0 ? deviceIds : undefined,
    playlistId,
    assignedBy: adminId,
    assignedAt: new Date().toISOString(),
    priority,
    notes,
    validFrom,
    validUntil
  };

  contentAssignments.push(newAssignment);
  
  // Actualizar el contenido con la asignación
  content.clientId = clientId;
  content.deviceIds = deviceIds.length > 0 ? deviceIds : undefined;
  
  return newAssignment;
}

export function removeContentAssignment(assignmentId: string): boolean {
  const index = contentAssignments.findIndex(a => a.id === assignmentId);
  if (index !== -1) {
    contentAssignments.splice(index, 1);
    return true;
  }
  return false;
}

export function getContentAssignmentsByClient(clientId: string): ContentAssignment[] {
  return contentAssignments.filter(assignment => assignment.clientId === clientId);
}

export function getContentAssignmentsByContent(contentId: string): ContentAssignment[] {
  return contentAssignments.filter(assignment => assignment.contentId === contentId);
}

// Función para obtener resumen de contenido administrado
export function getManagedContentSummary() {
  const approved = managedContent.filter(c => c.approved);
  const pending = managedContent.filter(c => !c.approved);
  const assigned = managedContent.filter(c => c.clientId);
  const unassigned = managedContent.filter(c => !c.clientId);

  return {
    total: managedContent.length,
    approved: approved.length,
    pending: pending.length,
    assigned: assigned.length,
    unassigned: unassigned.length,
    byCategory: approved.reduce((acc, content) => {
      acc[content.category] = (acc[content.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
}