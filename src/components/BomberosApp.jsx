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
import '../components/BomberosApp.css';
import apiService from '../../services/api'; 

// Componente principal
const BomberosApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const [brigadas, setBrigadas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBrigada, setSelectedBrigada] = useState(null);
  const [modalType, setModalType] = useState('create');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados para el formulario
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    brigada: {
      nombre: '',
      descripcion: '',
      activo: true
    },
    equipamiento: {
      ropa: [],
      botas: [],
      guantes: []
    }
  });

  // Catálogos
  const [catalogos, setCatalogos] = useState({
    tipos_ropa: []
  });

  const steps = [
    { id: 0, title: 'Información General', icon: FileText, color: 'bg-blue-500' },
    { id: 1, title: 'Equipamiento de Ropa', icon: Shirt, color: 'bg-green-500' },
    { id: 2, title: 'Calzado (Botas)', icon: ShieldCheck, color: 'bg-yellow-500' },
    { id: 3, title: 'Guantes', icon: Wrench, color: 'bg-purple-500' }
  ];

  // Cargar datos iniciales
  useEffect(() => {
    loadBrigadas();
    loadCatalogos();
  }, []);

  const loadBrigadas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getBrigadas();
      if (response.success) {
        setBrigadas(response.data);
      }
    } catch (error) {
      console.error('Error loading brigadas:', error);
      setError('Error al cargar las brigadas');
    } finally {
      setLoading(false);
    }
  };

  const loadCatalogos = async () => {
    try {
      const catalogos = await apiService.getAllCatalogos();
      setCatalogos(catalogos);
    } catch (error) {
      console.error('Error loading catalogos:', error);
    }
  };

  const handleCreateForm = () => {
    setCurrentStep(0);
    setFormData({
      brigada: {
        nombre: '',
        descripcion: '',
        activo: true
      },
      equipamiento: {
        ropa: [],
        botas: [],
        guantes: []
      }
    });
    setCurrentView('form');
  };

  const handleSubmitForm = async () => {
    try {
      setLoading(true);
      
      // Crear brigada primero
      const brigadaData = {
        nombre: formData.brigada.nombre,
        descripcion: formData.brigada.descripcion,
        activo: formData.brigada.activo
      };

      const response = await apiService.createBrigada(brigadaData);
      
      if (response.success) {
        setShowSuccessAnimation(true);
        setTimeout(() => {
          setShowSuccessAnimation(false);
          setCurrentView('board');
          loadBrigadas();
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Error al guardar la brigada');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBrigada = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta brigada?')) {
      try {
        const response = await apiService.deleteBrigada(id);
        if (response.success) {
          loadBrigadas();
        }
      } catch (error) {
        console.error('Error deleting brigada:', error);
        setError('Error al eliminar la brigada');
      }
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
      
      {loading && <p>Cargando brigadas...</p>}
      {error && <p className="error-message">{error}</p>}
      
      <div className="cards-grid">
        {brigadas.map((brigada) => (
          <div key={brigada.id} className="brigada-card">
            <div className="card-header">
              <h3>{brigada.nombre}</h3>
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
                <span className="label">Descripción:</span>
                <span className="value">{brigada.descripcion || 'Sin descripción'}</span>
              </div>
              <div className="info-row">
                <span className="label">Estado:</span>
                <span className={`status ${brigada.activo ? 'active' : 'inactive'}`}>
                  {brigada.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
            
            <div className="card-footer">
              <span className="date">
                {brigada.createdAt ? new Date(brigada.createdAt).toLocaleDateString() : 'Sin fecha'}
              </span>
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
            value={formData.brigada.nombre}
            onChange={(e) => updateFormData('brigada', 'nombre', e.target.value)}
            placeholder="Ej: Brigada Forestal Central"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Descripción</label>
          <textarea
            className="form-textarea"
            value={formData.brigada.descripcion}
            onChange={(e) => updateFormData('brigada', 'descripcion', e.target.value)}
            placeholder="Descripción de la brigada"
            rows="3"
          />
        </div>
        
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={formData.brigada.activo}
              onChange={(e) => updateFormData('brigada', 'activo', e.target.checked)}
            />
            Brigada Activa
          </label>
        </div>
      </div>
    </div>
  );

  // Componente de Form View
  const FormView = () => (
    <div className="form-container">
      <ProgressBar />
      
      <div className="form-content">
        {currentStep === 0 && <InformacionGeneralStep />}
        {currentStep === 1 && (
          <div className="form-step">
            <h2>Equipamiento de Ropa</h2>
            <p>Próximamente...</p>
          </div>
        )}
        {currentStep === 2 && (
          <div className="form-step">
            <h2>Equipamiento de Botas</h2>
            <p>Próximamente...</p>
          </div>
        )}
        {currentStep === 3 && (
          <div className="form-step">
            <h2>Equipamiento de Guantes</h2>
            <p>Próximamente...</p>
          </div>
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
          <button 
            className="nav-btn primary" 
            onClick={nextStep}
            disabled={currentStep === 0 && !formData.brigada.nombre}
          >
            Siguiente
            <ChevronRight size={20} />
          </button>
        ) : (
          <button 
            className="nav-btn success" 
            onClick={handleSubmitForm}
            disabled={loading || !formData.brigada.nombre}
          >
            <Save size={20} />
            {loading ? 'Guardando...' : 'Guardar Formulario'}
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