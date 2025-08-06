// src/services/api.js
// SOLUCIÓN RÁPIDA: Hardcodear la URL
const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('🔧 API Service initialized with base URL:', this.baseURL);
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('🚀 API Request:', url, config);
      
      const response = await fetch(url, config);
      
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.warn('⚠️ Response is not JSON:', text);
        throw new Error(`Server returned non-JSON response: ${response.status} ${response.statusText}`);
      }

      console.log('📦 API Response:', response.status, data);

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('❌ API Error:', {
        url,
        error: error.message,
        config
      });
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('No se puede conectar con el servidor. Verifica que el backend esté funcionando en el puerto 3000.');
      }
      
      throw error;
    }
  }

  // CRUD para Brigadas
  async getBrigadas() {
    return this.request('/brigadas');
  }

  async getBrigadaById(id) {
    return this.request(`/brigadas/${id}`);
  }

  async createBrigada(brigadaData) {
    const backendData = {
      nombre: brigadaData.nombre,
      descripcion: brigadaData.descripcion || '',
      activo: brigadaData.activo !== undefined ? brigadaData.activo : true
    };

    console.log('📝 Creating brigada:', backendData);
    
    return this.request('/brigadas', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  }

  async updateBrigada(id, brigadaData) {
    const backendData = {
      nombre: brigadaData.nombre,
      descripcion: brigadaData.descripcion || '',
      activo: brigadaData.activo !== undefined ? brigadaData.activo : true
    };

    return this.request(`/brigadas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendData),
    });
  }

  async deleteBrigada(id) {
    return this.request(`/brigadas/${id}`, {
      method: 'DELETE',
    });
  }

  // Catálogos
  async getTiposRopa() {
    return this.request('/catalogos/tipos-ropa');
  }

  async createTipoRopa(itemData) {
    return this.request('/catalogos/tipos-ropa', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  }

  async updateTipoRopa(id, itemData) {
    return this.request(`/catalogos/tipos-ropa/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  }

  async deleteTipoRopa(id) {
    return this.request(`/catalogos/tipos-ropa/${id}`, {
      method: 'DELETE',
    });
  }

  // Equipamiento
  async getEquipamientoRopa(brigadaId) {
    return this.request(`/equipamiento/${brigadaId}/ropa`);
  }

  async createEquipamientoRopa(brigadaId, ropaData) {
    return this.request(`/equipamiento/${brigadaId}/ropa`, {
      method: 'POST',
      body: JSON.stringify(ropaData),
    });
  }

  async getEquipamientoBotas(brigadaId) {
    return this.request(`/equipamiento/${brigadaId}/botas`);
  }

  async createEquipamientoBotas(brigadaId, botasData) {
    return this.request(`/equipamiento/${brigadaId}/botas`, {
      method: 'POST',
      body: JSON.stringify(botasData),
    });
  }

  async getEquipamientoGuantes(brigadaId) {
    return this.request(`/equipamiento/${brigadaId}/guantes`);
  }

  async createEquipamientoGuantes(brigadaId, guantesData) {
    return this.request(`/equipamiento/${brigadaId}/guantes`, {
      method: 'POST',
      body: JSON.stringify(guantesData),
    });
  }

  // Método para obtener formulario completo de una brigada
  async getFormularioCompleto(brigadaId) {
    try {
      const [brigada, ropa, botas, guantes] = await Promise.all([
        this.getBrigadaById(brigadaId),
        this.getEquipamientoRopa(brigadaId).catch(() => ({ data: [] })),
        this.getEquipamientoBotas(brigadaId).catch(() => ({ data: [] })),
        this.getEquipamientoGuantes(brigadaId).catch(() => ({ data: [] }))
      ]);

      return {
        brigada: brigada.data,
        equipamiento: {
          ropa: ropa.data || [],
          botas: botas.data || [],
          guantes: guantes.data || []
        }
      };
    } catch (error) {
      console.error('Error obteniendo formulario completo:', error);
      throw error;
    }
  }

  // Método simplificado para cargar catálogos existentes
  async getAllCatalogos() {
    try {
      const tiposRopa = await this.getTiposRopa().catch(() => ({ success: false, data: [] }));
      
      return {
        tipos_ropa: tiposRopa.success ? tiposRopa.data : []
      };
    } catch (error) {
      console.error('Error cargando catálogos:', error);
      return {
        tipos_ropa: []
      };
    }
  }

  // Método para probar la conexión
  async testConnection() {
    try {
      console.log('🧪 Testing connection to:', `${this.baseURL}/brigadas`);
      const response = await fetch(`${this.baseURL}/brigadas`);
      
      console.log('🧪 Test response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      return {
        success: response.ok,
        status: response.status,
        message: response.ok ? 'Conexión exitosa' : `Error ${response.status}: ${response.statusText}`
      };
    } catch (error) {
      console.error('🧪 Connection test failed:', error);
      return {
        success: false,
        status: 0,
        message: error.message
      };
    }
  }
}

// Crear instancia única del servicio
const apiService = new ApiService();

export default apiService;