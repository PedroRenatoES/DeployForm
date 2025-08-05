// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
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
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en la petición');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
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
    return this.request('/brigadas', {
      method: 'POST',
      body: JSON.stringify(brigadaData),
    });
  }

  async updateBrigada(id, brigadaData) {
    return this.request(`/brigadas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(brigadaData),
    });
  }

  async deleteBrigada(id) {
    return this.request(`/brigadas/${id}`, {
      method: 'DELETE',
    });
  }

  // Catálogos
  async getCatalogo(tipo) {
    return this.request(`/catalogos/${tipo}`);
  }

  async createCatalogoItem(tipo, itemData) {
    return this.request(`/catalogos/${tipo}`, {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  }

  async updateCatalogoItem(tipo, id, itemData) {
    return this.request(`/catalogos/${tipo}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  }

  async deleteCatalogoItem(tipo, id) {
    return this.request(`/catalogos/${tipo}/${id}`, {
      method: 'DELETE',
    });
  }

  // Equipamiento
  async getEquipamiento(brigadaId, tipo) {
    return this.request(`/equipamiento/${brigadaId}/${tipo}`);
  }

  async createEquipamiento(brigadaId, tipo, equipamientoData) {
    return this.request(`/equipamiento/${brigadaId}/${tipo}`, {
      method: 'POST',
      body: JSON.stringify(equipamientoData),
    });
  }

  async updateEquipamiento(brigadaId, tipo, id, equipamientoData) {
    return this.request(`/equipamiento/${brigadaId}/${tipo}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(equipamientoData),
    });
  }

  async deleteEquipamiento(brigadaId, tipo, id) {
    return this.request(`/equipamiento/${brigadaId}/${tipo}/${id}`, {
      method: 'DELETE',
    });
  }

  // Métodos específicos para cada tipo de equipamiento
  async getEquipamientoRopa(brigadaId) {
    return this.getEquipamiento(brigadaId, 'ropa');
  }

  async getEquipamientoBotas(brigadaId) {
    return this.getEquipamiento(brigadaId, 'botas');
  }

  async getEquipamientoGuantes(brigadaId) {
    return this.getEquipamiento(brigadaId, 'guantes');
  }

  async getEquipamientoEPP(brigadaId) {
    return this.getEquipamiento(brigadaId, 'epp');
  }

  async getHerramientas(brigadaId) {
    return this.getEquipamiento(brigadaId, 'herramientas');
  }

  async getLogisticaVehiculos(brigadaId) {
    return this.getEquipamiento(brigadaId, 'logistica-vehiculos');
  }

  async getAlimentacion(brigadaId) {
    return this.getEquipamiento(brigadaId, 'alimentacion');
  }

  async getEquipoCampo(brigadaId) {
    return this.getEquipamiento(brigadaId, 'equipo-campo');
  }

  async getLimpiezaPersonal(brigadaId) {
    return this.getEquipamiento(brigadaId, 'limpieza-personal');
  }

  async getLimpiezaGeneral(brigadaId) {
    return this.getEquipamiento(brigadaId, 'limpieza-general');
  }

  async getMedicamentos(brigadaId) {
    return this.getEquipamiento(brigadaId, 'medicamentos');
  }

  async getRescateAnimal(brigadaId) {
    return this.getEquipamiento(brigadaId, 'rescate-animal');
  }

  // Métodos para crear equipamiento específico
  async createEquipamientoRopa(brigadaId, ropaData) {
    return this.createEquipamiento(brigadaId, 'ropa', ropaData);
  }

  async createEquipamientoBotas(brigadaId, botasData) {
    return this.createEquipamiento(brigadaId, 'botas', botasData);
  }

  async createEquipamientoGuantes(brigadaId, guantesData) {
    return this.createEquipamiento(brigadaId, 'guantes', guantesData);
  }

  async createEquipamientoEPP(brigadaId, eppData) {
    return this.createEquipamiento(brigadaId, 'epp', eppData);
  }

  async createHerramientas(brigadaId, herramientasData) {
    return this.createEquipamiento(brigadaId, 'herramientas', herramientasData);
  }

  async createLogisticaVehiculos(brigadaId, vehiculosData) {
    return this.createEquipamiento(brigadaId, 'logistica-vehiculos', vehiculosData);
  }

  async createAlimentacion(brigadaId, alimentacionData) {
    return this.createEquipamiento(brigadaId, 'alimentacion', alimentacionData);
  }

  async createEquipoCampo(brigadaId, equipoCampoData) {
    return this.createEquipamiento(brigadaId, 'equipo-campo', equipoCampoData);
  }

  async createLimpiezaPersonal(brigadaId, limpiezaPersonalData) {
    return this.createEquipamiento(brigadaId, 'limpieza-personal', limpiezaPersonalData);
  }

  async createLimpiezaGeneral(brigadaId, limpiezaGeneralData) {
    return this.createEquipamiento(brigadaId, 'limpieza-general', limpiezaGeneralData);
  }

  async createMedicamentos(brigadaId, medicamentosData) {
    return this.createEquipamiento(brigadaId, 'medicamentos', medicamentosData);
  }

  async createRescateAnimal(brigadaId, rescateAnimalData) {
    return this.createEquipamiento(brigadaId, 'rescate-animal', rescateAnimalData);
  }

  // Método para obtener formulario completo de una brigada
  async getFormularioCompleto(brigadaId) {
    try {
      const [
        brigada,
        ropa,
        botas,
        guantes,
        epp,
        herramientas,
        vehiculos,
        alimentacion,
        equipoCampo,
        limpiezaPersonal,
        limpiezaGeneral,
        medicamentos,
        rescateAnimal
      ] = await Promise.all([
        this.getBrigadaById(brigadaId),
        this.getEquipamientoRopa(brigadaId),
        this.getEquipamientoBotas(brigadaId),
        this.getEquipamientoGuantes(brigadaId),
        this.getEquipamientoEPP(brigadaId),
        this.getHerramientas(brigadaId),
        this.getLogisticaVehiculos(brigadaId),
        this.getAlimentacion(brigadaId),
        this.getEquipoCampo(brigadaId),
        this.getLimpiezaPersonal(brigadaId),
        this.getLimpiezaGeneral(brigadaId),
        this.getMedicamentos(brigadaId),
        this.getRescateAnimal(brigadaId)
      ]);

      return {
        brigada: brigada.data,
        equipamiento: {
          ropa: ropa.data,
          botas: botas.data,
          guantes: guantes.data,
          epp: epp.data,
          herramientas: herramientas.data,
          vehiculos: vehiculos.data,
          alimentacion: alimentacion.data,
          equipo_campo: equipoCampo.data,
          limpieza_personal: limpiezaPersonal.data,
          limpieza_general: limpiezaGeneral.data,
          medicamentos: medicamentos.data,
          rescate_animal: rescateAnimal.data
        }
      };
    } catch (error) {
      console.error('Error obteniendo formulario completo:', error);
      throw error;
    }
  }

  // Método para cargar todos los catálogos
  async getAllCatalogos() {
    try {
      const catalogTypes = [
        'tipos-ropa',
        'equipamiento-epp',
        'herramientas',
        'servicios-vehiculos',
        'alimentos-bebidas',
        'equipo-campo',
        'limpieza-personal',
        'limpieza-general',
        'medicamentos',
        'alimentos-animales'
      ];

      const results = await Promise.all(
        catalogTypes.map(type => this.getCatalogo(type))
      );

      const catalogos = {};
      catalogTypes.forEach((type, index) => {
        const key = type.replace('-', '_');
        catalogos[key] = results[index].success ? results[index].data : [];
      });

      return catalogos;
    } catch (error) {
      console.error('Error cargando catálogos:', error);
      throw error;
    }
  }
}

// Crear instancia única del servicio
const apiService = new ApiService();

export default apiService;