import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Home, 
  Trash2, 
  Users, 
  Edit3, 
  Save, 
  X, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Shirt,
  ShieldCheck,
  Wrench,
  Car,
  Coffee,
  Tent,
  Droplets,
  Pill,
  Heart,
  Trash,
  Eye,
  FileText
} from 'lucide-react';
import './BomberosApp.css';

// Configuración de la API
const API_BASE_URL = 'http://localhost:3000/api';

// Componente principal
const BomberosApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const [brigadas, setBrigadas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBrigada, setSelectedBrigada] = useState(null);
  const [modalType, setModalType] = useState('create');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Estados para el formulario
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    brigada: {
      nombre_brigada: '',
      cantidad_bomberos_activos: 0,
      contacto_celular_comandante: '',
      encargado_logistica: '',
      contacto_celular_logistica: '',
      numero_emergencia_publico: ''
    },
    equipamiento: {
      ropa: [],
      botas: {},
      guantes: {},
      epp: [],
      herramientas: [],
      vehiculos: [],
      alimentacion: [],
      equipo_campo: [],
      limpieza_personal: [],
      limpieza_general: [],
      medicamentos: [],
      rescate_animal: []
    }
  });

  // Catálogos
  const [catalogos, setCatalogos] = useState({
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
  });

  const steps = [
    { id: 0, title: 'Información General', icon: FileText, color: 'bg-blue-500' },
    { id: 1, title: 'Equipamiento de Ropa', icon: Shirt, color: 'bg-green-500' },
    { id: 2, title: 'Equipamiento EPP', icon: ShieldCheck, color: 'bg-yellow-500' },
    { id: 3, title: 'Herramientas', icon: Wrench, color: 'bg-purple-500' },
    { id: 4, title: 'Logística Vehículos', icon: Car, color: 'bg-red-500' },
    { id: 5, title: 'Alimentación', icon: Coffee, color: 'bg-orange-500' },
    { id: 6, title: 'Equipo de Campo', icon: Tent, color: 'bg-indigo-500' },
    { id: 7, title: 'Limpieza Personal', icon: Droplets, color: 'bg-pink-500' },
    { id: 8, title: 'Limpieza General', icon: Droplets, color: 'bg-cyan-500' },
    { id: 9, title: 'Medicamentos', icon: Pill, color: 'bg-emerald-500' },
    { id: 10, title: 'Rescate Animal', icon: Heart, color: 'bg-rose-500' }
  ];

  // Cargar datos iniciales
  useEffect(() => {
    loadBrigadas();
    loadCatalogos();
  }, []);

  const loadBrigadas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/brigadas`);
      const data = await response.json();
      if (data.success) {
        setBrigadas(data.data);
      }
    } catch (error) {
      console.error('Error loading brigadas:', error);
    }
  };

  const loadCatalogos = async () => {
    try {
      const endpoints = [
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

      const promises = endpoints.map(endpoint =>
        fetch(`${API_BASE_URL}/catalogos/${endpoint}`).then(res => res.json())
      );

      const results = await Promise.all(promises);
      const newCatalogos = {};

      endpoints.forEach((endpoint, index) => {
        const key = endpoint.replace('-', '_');
        newCatalogos[key] = results[index].success ? results[index].data : [];
      });

      setCatalogos(newCatalogos);
    } catch (error) {
      console.error('Error loading catalogos:', error);
    }
  };

  const handleCreateForm = () => {
    setCurrentStep(0);
    setFormData({
      brigada: {
        nombre_brigada: '',
        cantidad_bomberos_activos: 0,
        contacto_celular_comandante: '',
        encargado_logistica: '',
        contacto_celular_logistica: '',
        numero_emergencia_publico: ''
      },
      equipamiento: {
        ropa: [],
        botas: {},
        guantes: {},
        epp: [],
        herramientas: [],
        vehiculos: [],
        alimentacion: [],
        equipo_campo: [],
        limpieza_personal: [],
        limpieza_general: [],
        medicamentos: [],
        rescate_animal: []
      }
    });
    setCurrentView('form');
  };

  const handleSubmitForm = async () => {
    try {
      // Crear brigada primero
      const brigadaResponse = await fetch(`${API_BASE_URL}/brigadas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          NombreBrigada: formData.brigada.nombre_brigada,
          CantidadBomberosActivos: formData.brigada.cantidad_bomberos_activos,
          ContactoCelularComandante: formData.brigada.contacto_celular_comandante,
          EncargadoLogistica: formData.brigada.encargado_logistica,
          ContactoCelularLogistica: formData.brigada.contacto_celular_logistica,
          NumeroEmergenciaPublico: formData.brigada.numero_emergencia_publico
        }),
      });

      const brigadaData = await brigadaResponse.json();
      
      if (brigadaData.success) {
        setShowSuccessAnimation(true);
        setTimeout(() => {
          setShowSuccessAnimation(false);
          setCurrentView('board');
          loadBrigadas();
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDeleteBrigada = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/brigadas/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        loadBrigadas();
      }
    } catch (error) {
      console.error('Error deleting brigada:', error);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addEquipamientoItem = (section, item) => {
    setFormData(prev => ({
      ...prev,
      equipamiento: {
        ...prev.equipamiento,
        [section]: [...prev.equipamiento[section], item]
      }
    }));
  };

  const removeEquipamientoItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      equipamiento: {
        ...prev.equipamiento,
        [section]: prev.equipamiento[section].filter((_, i) => i !== index)
      }
    }));
  };

  // Componente de navegación
  const Sidebar = () => (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">
          <Users className="sidebar-icon" />
          Bomberos 2025
        </h2>
      </div>
      
      <nav className="sidebar-nav">
        <button 
          className={`nav-item ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentView('home')}
        >
          <Home size={20} />
          Inicio
        </button>
        
        <button 
          className={`nav-item ${currentView === 'board' ? 'active' : ''}`}
          onClick={() => setCurrentView('board')}
        >
          <FileText size={20} />
          Formularios
        </button>
        
        <button 
          className={`nav-item ${currentView === 'trash' ? 'active' : ''}`}
          onClick={() => setCurrentView('trash')}
        >
          <Trash2 size={20} />
          Papelera
        </button>
      </nav>
    </div>
  );

  // Componente de Home
  const HomeView = () => (
    <div className="home-container">
      <div className="home-content">
        <div className="home-hero">
          <div className="hero-background"></div>
          <div className="hero-content">
            <h1 className="hero-title">
              Sistema de Formularios
              <span className="hero-subtitle">Bomberos Forestales 2025</span>
            </h1>
            <p className="hero-description">
              Gestiona de manera eficiente el equipamiento y recursos de las brigadas de bomberos forestales
            </p>
            <button className="cta-button" onClick={handleCreateForm}>
              <Plus size={24} />
              Crear Nuevo Formulario
            </button>
          </div>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <Users size={32} />
            </div>
            <div className="stat-info">
              <h3>{brigadas.length}</h3>
              <p>Brigadas Registradas</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon green">
              <FileText size={32} />
            </div>
            <div className="stat-info">
              <h3>{brigadas.length}</h3>
              <p>Formularios Completados</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon orange">
              <ShieldCheck size={32} />
            </div>
            <div className="stat-info">
              <h3>100%</h3>
              <p>Equipamiento Registrado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Componente de Board
  const BoardView = () => (
    <div className="board-container">
      <div className="board-header">
        <h1>Formularios de Brigadas</h1>
        <button className="create-button" onClick={handleCreateForm}>
          <Plus size={20} />
          Nuevo Formulario
        </button>
      </div>
      
      <div className="cards-grid">
        {brigadas.map((brigada) => (
          <div key={brigada.id} className="brigada-card">
            <div className="card-header">
              <h3>{brigada.nombre_brigada}</h3>
              <div className="card-actions">
                <button className="action-btn view" title="Ver detalles">
                  <Eye size={16} />
                </button>
                <button className="action-btn edit" title="Editar">
                  <Edit3 size={16} />
                </button>
                <button 
                  className="action-btn delete" 
                  title="Eliminar"
                  onClick={() => handleDeleteBrigada(brigada.id)}
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
            
            <div className="card-content">
              <div className="info-row">
                <span className="label">Bomberos Activos:</span>
                <span className="value">{brigada.cantidad_bomberos_activos}</span>
              </div>
              <div className="info-row">
                <span className="label">Comandante:</span>
                <span className="value">{brigada.contacto_celular_comandante}</span>
              </div>
              <div className="info-row">
                <span className="label">Logística:</span>
                <span className="value">{brigada.encargado_logistica}</span>
              </div>
              <div className="info-row">
                <span className="label">Emergencia:</span>
                <span className="value">{brigada.numero_emergencia_publico}</span>
              </div>
            </div>
            
            <div className="card-footer">
              <span className="date">
                {new Date(brigada.fecha_registro).toLocaleDateString()}
              </span>
              <span className="status active">Activo</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Componente de Progress Bar
  const ProgressBar = () => (
    <div className="progress-container">
      <div className="progress-header">
        <h2>Progreso del Formulario</h2>
        <span className="progress-text">
          Paso {currentStep + 1} de {steps.length}
        </span>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        ></div>
      </div>
      
      <div className="steps-indicators">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={`step-indicator ${index <= currentStep ? 'completed' : ''} ${index === currentStep ? 'current' : ''}`}
          >
            <div className={`step-circle ${step.color}`}>
              <step.icon size={16} />
            </div>
            <span className="step-title">{step.title}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Componente de Step 0 - Información General
  const InformacionGeneralStep = () => (
    <div className="form-step">
      <div className="step-header">
        <h2>Información General de la Brigada</h2>
        <p>Proporciona los datos básicos de la brigada de bomberos</p>
      </div>
      
      <div className="form-grid">
        <div className="form-group">
          <label>Nombre de la Brigada *</label>
          <input
            type="text"
            className="form-input"
            value={formData.brigada.nombre_brigada}
            onChange={(e) => updateFormData('brigada', 'nombre_brigada', e.target.value)}
            placeholder="Ej: Brigada Forestal Central"
          />
        </div>
        
        <div className="form-group">
          <label>Cantidad de Bomberos Activos</label>
          <input
            type="number"
            className="form-input"
            value={formData.brigada.cantidad_bomberos_activos}
            onChange={(e) => updateFormData('brigada', 'cantidad_bomberos_activos', parseInt(e.target.value) || 0)}
            placeholder="0"
          />
        </div>
        
        <div className="form-group">
          <label>Contacto Celular del Comandante</label>
          <input
            type="tel"
            className="form-input"
            value={formData.brigada.contacto_celular_comandante}
            onChange={(e) => updateFormData('brigada', 'contacto_celular_comandante', e.target.value)}
            placeholder="Ej: +591 70123456"
          />
        </div>
        
        <div className="form-group">
          <label>Encargado de Logística</label>
          <input
            type="text"
            className="form-input"
            value={formData.brigada.encargado_logistica}
            onChange={(e) => updateFormData('brigada', 'encargado_logistica', e.target.value)}
            placeholder="Nombre completo"
          />
        </div>
        
        <div className="form-group">
          <label>Contacto Celular de Logística</label>
          <input
            type="tel"
            className="form-input"
            value={formData.brigada.contacto_celular_logistica}
            onChange={(e) => updateFormData('brigada', 'contacto_celular_logistica', e.target.value)}
            placeholder="Ej: +591 70123456"
          />
        </div>
        
        <div className="form-group">
          <label>Número de Emergencia Público</label>
          <input
            type="tel"
            className="form-input"
            value={formData.brigada.numero_emergencia_publico}
            onChange={(e) => updateFormData('brigada', 'numero_emergencia_publico', e.target.value)}
            placeholder="Ej: 911"
          />
        </div>
      </div>
    </div>
  );

  // Componente genérico para equipamiento
  const EquipamientoGenericoStep = ({ title, description, catalogKey, section }) => {
    const catalog = catalogos[catalogKey] || [];
    
    return (
      <div className="form-step">
        <div className="step-header">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        
        <div className="equipamiento-grid">
          {catalog.map((item) => (
            <div key={item.id} className="equipamiento-card">
              <div className="card-content">
                <h4>{item.nombre}</h4>
                <p>{item.descripcion}</p>
                
                <div className="quantity-controls">
                  <label>Cantidad</label>
                  <input
                    type="number"
                    className="quantity-input"
                    min="0"
                    placeholder="0"
                  />
                </div>
                
                <div className="form-group">
                  <label>Observaciones</label>
                  <textarea
                    className="form-textarea"
                    rows="2"
                    placeholder="Observaciones adicionales..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Componente de Form View
  const FormView = () => (
    <div className="form-container">
      <ProgressBar />
      
      <div className="form-content">
        {currentStep === 0 && <InformacionGeneralStep />}
        {currentStep === 1 && (
          <EquipamientoGenericoStep 
            title="Equipamiento de Ropa"
            description="Selecciona y especifica las cantidades de ropa forestal necesaria"
            catalogKey="tipos_ropa"
            section="ropa"
          />
        )}
        {currentStep === 2 && (
          <EquipamientoGenericoStep 
            title="Equipamiento EPP"
            description="Especifica los elementos de protección personal requeridos"
            catalogKey="equipamiento_epp"
            section="epp"
          />
        )}
        {currentStep === 3 && (
          <EquipamientoGenericoStep 
            title="Herramientas"
            description="Detalla las herramientas necesarias para las operaciones"
            catalogKey="herramientas"
            section="herramientas"
          />
        )}
        {currentStep === 4 && (
          <EquipamientoGenericoStep 
            title="Logística de Vehículos"
            description="Especifica los servicios y mantenimiento de vehículos"
            catalogKey="servicios_vehiculos"
            section="vehiculos"
          />
        )}
        {currentStep === 5 && (
          <EquipamientoGenericoStep 
            title="Alimentación y Bebidas"
            description="Detalla los alimentos y bebidas necesarios"
            catalogKey="alimentos_bebidas"
            section="alimentacion"
          />
        )}
        {currentStep === 6 && (
          <EquipamientoGenericoStep 
            title="Equipo de Campo"
            description="Especifica el equipo necesario para operaciones en campo"
            catalogKey="equipo_campo"
            section="equipo_campo"
          />
        )}
        {currentStep === 7 && (
          <EquipamientoGenericoStep 
            title="Limpieza Personal"
            description="Detalla los productos de higiene personal requeridos"
            catalogKey="limpieza_personal"
            section="limpieza_personal"
          />
        )}
        {currentStep === 8 && (
          <EquipamientoGenericoStep 
            title="Limpieza General"
            description="Especifica los productos de limpieza general"
            catalogKey="limpieza_general"
            section="limpieza_general"
          />
        )}
        {currentStep === 9 && (
          <EquipamientoGenericoStep 
            title="Medicamentos"
            description="Detalla los medicamentos y suministros médicos necesarios"
            catalogKey="medicamentos"
            section="medicamentos"
          />
        )}
        {currentStep === 10 && (
          <EquipamientoGenericoStep 
            title="Rescate Animal"
            description="Especifica los alimentos para animales en operaciones de rescate"
            catalogKey="alimentos_animales"
            section="rescate_animal"
          />
        )}
      </div>
      
      <div className="form-navigation">
        <button 
          className="nav-btn secondary" 
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ChevronLeft size={20} />
          Anterior
        </button>
        
        {currentStep < steps.length - 1 ? (
          <button className="nav-btn primary" onClick={nextStep}>
            Siguiente
            <ChevronRight size={20} />
          </button>
        ) : (
          <button className="nav-btn success" onClick={handleSubmitForm}>
            <Save size={20} />
            Guardar Formulario
          </button>
        )}
      </div>
    </div>
  );

  // Componente de Success Animation
  const SuccessAnimation = () => (
    <div className="success-overlay">
      <div className="success-animation">
        <div className="check-circle">
          <Check size={48} />
        </div>
        <h2>¡Formulario Enviado!</h2>
        <p>La brigada ha sido registrada exitosamente</p>
      </div>
    </div>
  );

  // Render principal
  return (
    <div className="app">
      <Sidebar />
      
      <main className="main-content">
        {currentView === 'home' && <HomeView />}
        {currentView === 'board' && <BoardView />}
        {currentView === 'form' && <FormView />}
        {currentView === 'trash' && (
          <div className="trash-container">
            <h1>Papelera</h1>
            <p>Elementos eliminados aparecerán aquí</p>
          </div>
        )}
      </main>
      
      {showSuccessAnimation && <SuccessAnimation />}
    </div>
  );
};

export default BomberosApp;