// Sistema de configuración de layouts para SIGN787 TV

export interface LayoutZone {
  id: string;
  x: number; // posición X en porcentaje
  y: number; // posición Y en porcentaje
  w: number; // ancho en porcentaje
  h: number; // alto en porcentaje
  color: string; // color de la zona
  label: string; // etiqueta descriptiva
  type?: 'main' | 'secondary' | 'ticker' | 'side'; // tipo de zona
  contentType?: 'image' | 'video' | 'mixed'; // tipo de contenido permitido
  maxContentItems?: number; // máximo de elementos de contenido
  autoRotate?: boolean; // rotación automática de contenido
  rotationInterval?: number; // intervalo de rotación en ms
}

export interface LayoutConfig {
  id: string;
  name: string;
  description: string;
  zones: LayoutZone[];
  aspectRatio: '16:9' | '9:16' | '4:3' | '1:1' | 'custom';
  category: 'standard' | 'retail' | 'restaurant' | 'corporate' | 'custom';
  tags: string[];
  thumbnail?: string; // URL de imagen de vista previa
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Layouts estándar de SIGN787
export const standardLayouts: LayoutConfig[] = [
  {
    id: 'full-screen',
    name: 'Pantalla Completa',
    description: 'Una sola zona que ocupa toda la pantalla - ideal para mensajes impactantes',
    zones: [
      {
        id: 'main',
        x: 0,
        y: 0,
        w: 100,
        h: 100,
        color: '#3b82f6',
        label: 'Contenido Principal',
        type: 'main',
        contentType: 'mixed',
        maxContentItems: 10,
        autoRotate: true,
        rotationInterval: 5000
      }
    ],
    aspectRatio: '16:9',
    category: 'standard',
    tags: ['simple', 'impactante', 'básico'],
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'split-vertical',
    name: 'División Vertical',
    description: 'Dos zonas verticales iguales - perfecto para comparaciones o menús',
    zones: [
      {
        id: 'left',
        x: 0,
        y: 0,
        w: 50,
        h: 100,
        color: '#3b82f6',
        label: 'Zona Izquierda',
        type: 'main',
        contentType: 'mixed',
        maxContentItems: 5,
        autoRotate: true,
        rotationInterval: 6000
      },
      {
        id: 'right',
        x: 50,
        y: 0,
        w: 50,
        h: 100,
        color: '#10b981',
        label: 'Zona Derecha',
        type: 'secondary',
        contentType: 'mixed',
        maxContentItems: 5,
        autoRotate: true,
        rotationInterval: 6000
      }
    ],
    aspectRatio: '16:9',
    category: 'standard',
    tags: ['dividido', 'comparación', 'menú'],
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'four-zones',
    name: 'Cuatro Zonas',
    description: 'Cuatro zonas iguales - ideal para mostrar múltiples productos o servicios',
    zones: [
      {
        id: 'top-left',
        x: 0,
        y: 0,
        w: 50,
        h: 50,
        color: '#3b82f6',
        label: 'Arriba Izquierda',
        type: 'secondary',
        contentType: 'image',
        maxContentItems: 3,
        autoRotate: true,
        rotationInterval: 4000
      },
      {
        id: 'top-right',
        x: 50,
        y: 0,
        w: 50,
        h: 50,
        color: '#10b981',
        label: 'Arriba Derecha',
        type: 'secondary',
        contentType: 'image',
        maxContentItems: 3,
        autoRotate: true,
        rotationInterval: 4000
      },
      {
        id: 'bottom-left',
        x: 0,
        y: 50,
        w: 50,
        h: 50,
        color: '#f59e0b',
        label: 'Abajo Izquierda',
        type: 'secondary',
        contentType: 'image',
        maxContentItems: 3,
        autoRotate: true,
        rotationInterval: 4000
      },
      {
        id: 'bottom-right',
        x: 50,
        y: 50,
        w: 50,
        h: 50,
        color: '#ef4444',
        label: 'Abajo Derecha',
        type: 'secondary',
        contentType: 'image',
        maxContentItems: 3,
        autoRotate: true,
        rotationInterval: 4000
      }
    ],
    aspectRatio: '16:9',
    category: 'standard',
    tags: ['múltiple', 'productos', 'cuadrícula'],
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'l-shape',
    name: 'Forma L',
    description: 'Zona principal grande con dos zonas laterales - perfecto para destacar un producto principal',
    zones: [
      {
        id: 'main',
        x: 0,
        y: 0,
        w: 70,
        h: 70,
        color: '#3b82f6',
        label: 'Producto Principal',
        type: 'main',
        contentType: 'mixed',
        maxContentItems: 5,
        autoRotate: true,
        rotationInterval: 8000
      },
      {
        id: 'side-top',
        x: 70,
        y: 0,
        w: 30,
        h: 35,
        color: '#10b981',
        label: 'Lateral Arriba',
        type: 'side',
        contentType: 'image',
        maxContentItems: 2,
        autoRotate: true,
        rotationInterval: 5000
      },
      {
        id: 'side-bottom',
        x: 70,
        y: 35,
        w: 30,
        h: 35,
        color: '#f59e0b',
        label: 'Lateral Abajo',
        type: 'side',
        contentType: 'image',
        maxContentItems: 2,
        autoRotate: true,
        rotationInterval: 5000
      }
    ],
    aspectRatio: '16:9',
    category: 'retail',
    tags: ['principal', 'destacado', 'L-shape'],
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'main-ticker',
    name: 'Principal + Ticker',
    description: 'Pantalla principal con banner inferior - ideal para noticias o información continua',
    zones: [
      {
        id: 'main',
        x: 0,
        y: 0,
        w: 100,
        h: 80,
        color: '#3b82f6',
        label: 'Contenido Principal',
        type: 'main',
        contentType: 'mixed',
        maxContentItems: 8,
        autoRotate: true,
        rotationInterval: 6000
      },
      {
        id: 'ticker',
        x: 0,
        y: 80,
        w: 100,
        h: 20,
        color: '#10b981',
        label: 'Ticker/Banner',
        type: 'ticker',
        contentType: 'mixed',
        maxContentItems: 1,
        autoRotate: true,
        rotationInterval: 3000
      }
    ],
    aspectRatio: '16:9',
    category: 'corporate',
    tags: ['noticias', 'ticker', 'información'],
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

// Layouts específicos por industria
export const restaurantLayouts: LayoutConfig[] = [
  {
    id: 'menu-board',
    name: 'Tablero de Menú',
    description: 'Diseño optimizado para menús de restaurantes - categorías y productos destacados',
    zones: [
      {
        id: 'header',
        x: 0,
        y: 0,
        w: 100,
        h: 15,
        color: '#dc2626',
        label: 'Encabezado',
        type: 'main',
        contentType: 'image',
        maxContentItems: 1,
        autoRotate: false
      },
      {
        id: 'categories',
        x: 0,
        y: 15,
        w: 30,
        h: 85,
        color: '#059669',
        label: 'Categorías',
        type: 'side',
        contentType: 'image',
        maxContentItems: 6,
        autoRotate: false
      },
      {
        id: 'items',
        x: 30,
        y: 15,
        w: 70,
        h: 85,
        color: '#3b82f6',
        label: 'Items del Menú',
        type: 'main',
        contentType: 'mixed',
        maxContentItems: 12,
        autoRotate: true,
        rotationInterval: 8000
      }
    ],
    aspectRatio: '16:9',
    category: 'restaurant',
    tags: ['menú', 'restaurante', 'categorías'],
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

// Funciones de utilidad para gestionar layouts
export function getAllLayouts(): LayoutConfig[] {
  return [...standardLayouts, ...restaurantLayouts];
}

export function getLayoutsByCategory(category: string): LayoutConfig[] {
  return getAllLayouts().filter(layout => layout.category === category);
}

export function getLayoutById(id: string): LayoutConfig | undefined {
  return getAllLayouts().find(layout => layout.id === id);
}

export function getActiveLayouts(): LayoutConfig[] {
  return getAllLayouts().filter(layout => layout.isActive);
}

export function createCustomLayout(config: Partial<LayoutConfig>): LayoutConfig {
  const now = new Date().toISOString();
  return {
    id: `custom-${Date.now()}`,
    name: config.name || 'Layout Personalizado',
    description: config.description || 'Layout personalizado',
    zones: config.zones || [],
    aspectRatio: config.aspectRatio || '16:9',
    category: 'custom',
    tags: config.tags || [],
    isActive: true,
    createdAt: now,
    updatedAt: now
  };
}