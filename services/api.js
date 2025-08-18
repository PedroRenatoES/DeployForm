// src/services/api.js
// SOLUCIÓN RÁPIDA: Hardcodear la URL
const API_BASE_URL = 'https://deployback-9ukf.onrender.com/api';

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
      NombreBrigada: brigadaData.NombreBrigada,
      CantidadBomberosActivos: brigadaData.CantidadBomberosActivos,
      ContactoCelularComandante: brigadaData.ContactoCelularComandante,
      EncargadoLogistica: brigadaData.EncargadoLogistica,
      ContactoCelularLogistica: brigadaData.ContactoCelularLogistica,
      NumeroEmergenciaPublico: brigadaData.NumeroEmergenciaPublico
    };

    console.log('📝 Creating brigada:', backendData);
    
    return this.request('/brigadas', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  }

  async updateBrigada(id, brigadaData) {
    const backendData = {
      NombreBrigada: brigadaData.NombreBrigada,
      CantidadBomberosActivos: brigadaData.CantidadBomberosActivos,
      ContactoCelularComandante: brigadaData.ContactoCelularComandante,
      EncargadoLogistica: brigadaData.EncargadoLogistica,
      ContactoCelularLogistica: brigadaData.ContactoCelularLogistica,
      NumeroEmergenciaPublico: brigadaData.NumeroEmergenciaPublico
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

  async getEquipamientoEPP() {
    return this.request('/catalogos/equipamiento-epp');
  }

  async getHerramientas() {
    return this.request('/catalogos/herramientas');
  }

  async getServiciosVehiculos() {
    return this.request('/catalogos/servicios-vehiculos');
  }

  async getAlimentosBebidas() {
    return this.request('/catalogos/alimentos-bebidas');
  }

  async getEquipoCampo() {
    return this.request('/catalogos/equipo-campo');
  }

  async getLimpiezaPersonal() {
    return this.request('/catalogos/limpieza-personal');
  }

  async getLimpiezaGeneral() {
    return this.request('/catalogos/limpieza-general');
  }

  async getMedicamentos() {
    return this.request('/catalogos/medicamentos');
  }

  async getAlimentosAnimales() {
    return this.request('/catalogos/alimentos-animales');
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

  // Equipamiento EPP
  async getEquipamientoEPPData(brigadaId) {
    return this.request(`/equipamiento/${brigadaId}/epp`);
  }

  async createEquipamientoEPPData(brigadaId, eppData) {
    return this.request(`/equipamiento/${brigadaId}/epp`, {
      method: 'POST',
      body: JSON.stringify(eppData),
    });
  }

  // Herramientas
  async getHerramientasData(brigadaId) {
    return this.request(`/equipamiento/${brigadaId}/herramientas`);
  }

  async createHerramientasData(brigadaId, herramientasData) {
    return this.request(`/equipamiento/${brigadaId}/herramientas`, {
      method: 'POST',
      body: JSON.stringify(herramientasData),
    });
  }

  // Logística Vehículos
  async getLogisticaVehiculos(brigadaId) {
    return this.request(`/equipamiento/${brigadaId}/logistica-vehiculos`);
  }

  async createLogisticaVehiculos(brigadaId, logisticaData) {
    return this.request(`/equipamiento/${brigadaId}/logistica-vehiculos`, {
      method: 'POST',
      body: JSON.stringify(logisticaData),
    });
  }

  // Alimentación
  async getAlimentacionData(brigadaId) {
    return this.request(`/equipamiento/${brigadaId}/alimentacion`);
  }

  async createAlimentacionData(brigadaId, alimentacionData) {
    return this.request(`/equipamiento/${brigadaId}/alimentacion`, {
      method: 'POST',
      body: JSON.stringify(alimentacionData),
    });
  }

  // Equipo Campo
  async getEquipoCampoData(brigadaId) {
    return this.request(`/equipamiento/${brigadaId}/equipo-campo`);
  }

  async createEquipoCampoData(brigadaId, equipoCampoData) {
    return this.request(`/equipamiento/${brigadaId}/equipo-campo`, {
      method: 'POST',
      body: JSON.stringify(equipoCampoData),
    });
  }

  // Limpieza Personal
  async getLimpiezaPersonalData(brigadaId) {
    return this.request(`/equipamiento/${brigadaId}/limpieza-personal`);
  }

  async createLimpiezaPersonalData(brigadaId, limpiezaPersonalData) {
    return this.request(`/equipamiento/${brigadaId}/limpieza-personal`, {
      method: 'POST',
      body: JSON.stringify(limpiezaPersonalData),
    });
  }

  // Limpieza General
  async getLimpiezaGeneralData(brigadaId) {
    return this.request(`/equipamiento/${brigadaId}/limpieza-general`);
  }

  async createLimpiezaGeneralData(brigadaId, limpiezaGeneralData) {
    return this.request(`/equipamiento/${brigadaId}/limpieza-general`, {
      method: 'POST',
      body: JSON.stringify(limpiezaGeneralData),
    });
  }

  // Medicamentos
  async getMedicamentosData(brigadaId) {
    return this.request(`/equipamiento/${brigadaId}/medicamentos`);
  }

  async createMedicamentosData(brigadaId, medicamentosData) {
    return this.request(`/equipamiento/${brigadaId}/medicamentos`, {
      method: 'POST',
      body: JSON.stringify(medicamentosData),
    });
  }

  // Rescate Animal
  async getRescateAnimalData(brigadaId) {
    return this.request(`/equipamiento/${brigadaId}/rescate-animal`);
  }

  async createRescateAnimalData(brigadaId, rescateAnimalData) {
    return this.request(`/equipamiento/${brigadaId}/rescate-animal`, {
      method: 'POST',
      body: JSON.stringify(rescateAnimalData),
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
      const [
        tiposRopa,
        equipamientoEPP,
        herramientas,
        serviciosVehiculos,
        alimentosBebidas,
        equipoCampo,
        limpiezaPersonal,
        limpiezaGeneral,
        medicamentos,
        alimentosAnimales
      ] = await Promise.all([
        this.getTiposRopa().catch(() => ({ success: false, data: [] })),
        this.getEquipamientoEPP().catch(() => ({ success: false, data: [] })),
        this.getHerramientas().catch(() => ({ success: false, data: [] })),
        this.getServiciosVehiculos().catch(() => ({ success: false, data: [] })),
        this.getAlimentosBebidas().catch(() => ({ success: false, data: [] })),
        this.getEquipoCampo().catch(() => ({ success: false, data: [] })),
        this.getLimpiezaPersonal().catch(() => ({ success: false, data: [] })),
        this.getLimpiezaGeneral().catch(() => ({ success: false, data: [] })),
        this.getMedicamentos().catch(() => ({ success: false, data: [] })),
        this.getAlimentosAnimales().catch(() => ({ success: false, data: [] }))
      ]);
      
      return {
        tipos_ropa: tiposRopa.success ? tiposRopa.data : (tiposRopa.data || []),
        equipamiento_epp: equipamientoEPP.success ? equipamientoEPP.data : (equipamientoEPP.data || []),
        herramientas: herramientas.success ? herramientas.data : (herramientas.data || []),
        servicios_vehiculos: serviciosVehiculos.success ? serviciosVehiculos.data : (serviciosVehiculos.data || []),
        alimentos_bebidas: alimentosBebidas.success ? alimentosBebidas.data : (alimentosBebidas.data || []),
        equipo_campo: equipoCampo.success ? equipoCampo.data : (equipoCampo.data || []),
        limpieza_personal: limpiezaPersonal.success ? limpiezaPersonal.data : (limpiezaPersonal.data || []),
        limpieza_general: limpiezaGeneral.success ? limpiezaGeneral.data : (limpiezaGeneral.data || []),
        medicamentos: medicamentos.success ? medicamentos.data : (medicamentos.data || []),
        alimentos_animales: alimentosAnimales.success ? alimentosAnimales.data : (alimentosAnimales.data || [])
      };
    } catch (error) {
      console.error('Error cargando catálogos:', error);
      return {
        tipos_ropa: [],
        equipamiento_epp: [],
        herramientas: [],
        servicios_vehiculos: [],
        alimentos_bebidas: [],
        equipo_campo: [],
        limpieza_personal: [],
        limpieza_general: [],
        medicamentos: [],
        alimentos_animales: []
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
