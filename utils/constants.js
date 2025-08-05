// src/utils/constants.js

// Configuración de la API
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

// Tipos de equipamiento
export const EQUIPAMIENTO_TYPES = {
  ROPA: 'ropa',
  BOTAS: 'botas',
  GUANTES: 'guantes',
  EPP: 'epp',
  HERRAMIENTAS: 'herramientas',
  VEHICULOS: 'logistica-vehiculos',
  ALIMENTACION: 'alimentacion',
  EQUIPO_CAMPO: 'equipo-campo',
  LIMPIEZA_PERSONAL: 'limpieza-personal',
  LIMPIEZA_GENERAL: 'limpieza-general',
  MEDICAMENTOS: 'medicamentos',
  RESCATE_ANIMAL: 'rescate-animal'
};

// Tipos de catálogos
export const CATALOG_TYPES = {
  TIPOS_ROPA: 'tipos-ropa',
  EQUIPAMIENTO_EPP: 'equipamiento-epp',
  HERRAMIENTAS: 'herramientas',
  SERVICIOS_VEHICULOS: 'servicios-vehiculos',
  ALIMENTOS_BEBIDAS: 'alimentos-bebidas',
  EQUIPO_CAMPO: 'equipo-campo',
  LIMPIEZA_PERSONAL: 'limpieza-personal',
  LIMPIEZA_GENERAL: 'limpieza-general',
  MEDICAMENTOS: 'medicamentos',
  ALIMENTOS_ANIMALES: 'alimentos-animales'
};

// Estados de la aplicación
export const APP_STATES = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  IDLE: 'idle'
};

// Vistas de la aplicación
export const VIEWS = {
  HOME: 'home',
  BOARD: 'board',
  FORM: 'form',
  TRASH: 'trash',
  DETAIL: 'detail'
};

// Pasos del formulario
export const FORM_STEPS = [
  {
    id: 0,
    key: 'informacion_general',
    title: 'Información General',
    description: 'Datos básicos de la brigada'
  },
  {
    id: 1,
    key: 'equipamiento_ropa',
    title: 'Equipamiento de Ropa',
    description: 'Ropa y uniformes forestales'
  },
  {
    id: 2,
    key: 'equipamiento_epp',
    title: 'Equipamiento EPP',
    description: 'Elementos de protección personal'
  },
  {
    id: 3,
    key: 'herramientas',
    title: 'Herramientas',
    description: 'Herramientas para operaciones forestales'
  },
  {
    id: 4,
    key: 'logistica_vehiculos',
    title: 'Logística de Vehículos',
    description: 'Servicios y mantenimiento vehicular'
  },
  {
    id: 5,
    key: 'alimentacion',
    title: 'Alimentación y Bebidas',
    description: 'Alimentos y bebidas para las operaciones'
  },
  {
    id: 6,
    key: 'equipo_campo',
    title: 'Equipo de Campo',
    description: 'Equipamiento para operaciones en campo'
  },
  {
    id: 7,
    key: 'limpieza_personal',
    title: 'Limpieza Personal',
    description: 'Productos de higiene personal'
  },
  {
    id: 8,
    key: 'limpieza_general',
    title: 'Limpieza General',
    description: 'Productos de limpieza general'
  },
  {
    id: 9,
    key: 'medicamentos',
    title: 'Medicamentos',
    description: 'Medicamentos y suministros médicos'
  },
  {
    id: 10,
    key: 'rescate_animal',
    title: 'Rescate Animal',
    description: 'Alimentos para rescate de animales'
  }
];

// Validaciones
export const VALIDATION_RULES = {
  BRIGADA: {
    NOMBRE_MIN_LENGTH: 3,
    NOMBRE_MAX_LENGTH: 255,
    CONTACTO_MAX_LENGTH: 20,
    ENCARGADO_MAX_LENGTH: 255,
    BOMBEROS_MIN: 0,
    BOMBEROS_MAX: 1000
  },
  EQUIPAMIENTO: {
    CANTIDAD_MIN: 0,
    CANTIDAD_MAX: 99999,
    OBSERVACIONES_MAX_LENGTH: 500,
    MONTO_MIN: 0,
    MONTO_MAX: 999999.99
  }
};

// Mensajes de error
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu conexión a internet.',
  SERVER_ERROR: 'Error del servidor. Intenta nuevamente más tarde.',
  VALIDATION_ERROR: 'Por favor verifica los datos ingresados.',
  NOT_FOUND: 'Recurso no encontrado.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  TIMEOUT: 'La operación ha tomado demasiado tiempo.',
  GENERIC_ERROR: 'Ha ocurrido un error inesperado.'
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  BRIGADA_CREATED: 'Brigada creada exitosamente',
  BRIGADA_UPDATED: 'Brigada actualizada exitosamente',
  BRIGADA_DELETED: 'Brigada eliminada exitosamente',
  EQUIPAMIENTO_SAVED: 'Equipamiento guardado exitosamente',
  FORM_SUBMITTED: 'Formulario enviado exitosamente'
};

// Configuración de tallas
export const TALLAS = {
  ROPA: ['XS', 'S', 'M', 'L', 'XL'],
  BOTAS: ['37', '38', '39', '40', '41', '42', '43'],
  GUANTES: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
};

// Colores del tema
export const THEME_COLORS = {
  PRIMARY: '#2563eb',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
  SECONDARY: '#64748b'
};

// Configuración de animaciones
export const ANIMATION_CONFIG = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
  },
  EASING: {
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out'
  }
};

// Configuración de localStorage
export const STORAGE_KEYS = {
  FORM_DATA: 'bomberos_form_data',
  USER_PREFERENCES: 'bomberos_user_preferences',
  LAST_BRIGADE: 'bomberos_last_brigade'
};

// Formatos de fecha
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  TIMESTAMP: 'YYYY-MM-DD HH:mm:ss'
};

// Configuración de paginación
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MAX_VISIBLE_PAGES: 5
};

// Expresiones regulares
export const REGEX_PATTERNS = {
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NAME: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/,
  NUMBER: /^\d+$/,
  DECIMAL: /^\d+(\.\d{1,2})?$/
};

// Configuración de archivos
export const FILE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
};

// URLs de documentación y ayuda
export const HELP_URLS = {
  USER_MANUAL: '/docs/manual-usuario.pdf',
  API_DOCS: '/docs/api',
  SUPPORT: '/support',
  FAQ: '/faq'
};

export default {
  API_CONFIG,
  EQUIPAMIENTO_TYPES,
  CATALOG_TYPES,
  APP_STATES,
  VIEWS,
  FORM_STEPS,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  TALLAS,
  THEME_COLORS,
  ANIMATION_CONFIG,
  STORAGE_KEYS,
  DATE_FORMATS,
  PAGINATION_CONFIG,
  REGEX_PATTERNS,
  FILE_CONFIG,
  HELP_URLS
};