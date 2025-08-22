import React, { useState, useEffect, useCallback, memo } from 'react';
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
  FileText,
  Phone,
  User,
  Package,
  Calendar,
  MapPin,
  AlertTriangle

} from 'lucide-react';
import '../components/BomberosApp.css';
import apiService from '../../services/api'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



// 1. CREAR NUEVO COMPONENTE - Agregar después de los imports existentes
const ModalDetallesBrigada = memo(({ detalleBrigada, equipamiento, onClose, mostrar }) => {
  // Cerrar modal con tecla Esc
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (mostrar) {
      document.addEventListener('keydown', handleEsc);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [mostrar, onClose]);

  // No renderizar si no debe mostrarse
  if (!mostrar || !detalleBrigada) return null;

  // Función para cerrar al hacer clic fuera del modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Función para contar total de items por categoría
  const contarItems = (categoria) => {
    if (!equipamiento[categoria]) return 0;
    return equipamiento[categoria].reduce((total, item) => {
      // Para ropa, botas y guantes sumar todas las tallas
      if (categoria === 'ropa') {
        return total + (item.cantidad_xs || 0) + (item.cantidad_s || 0) + (item.cantidad_m || 0) + (item.cantidad_l || 0) + (item.cantidad_xl || 0);
      }
      if (categoria === 'botas') {
        return total + (item.talla_37 || 0) + (item.talla_38 || 0) + (item.talla_39 || 0) + (item.talla_40 || 0) + (item.talla_41 || 0) + (item.talla_42 || 0) + (item.talla_43 || 0) + (item.cantidad_otra_talla || 0);
      }
      if (categoria === 'guantes') {
        return total + (item.talla_xs || 0) + (item.talla_s || 0) + (item.talla_m || 0) + (item.talla_l || 0) + (item.talla_xl || 0) + (item.talla_xxl || 0) + (item.cantidad_otra_talla || 0);
      }
      return total + (item.cantidad || 0);
    }, 0);
  };

  // Configuración de secciones del equipamiento
  const seccionesEquipamiento = [
    { key: 'ropa', titulo: '👕 Equipamiento EPP (ROPA)', icon: Shirt, color: '#10b981' },
    { key: 'botas', titulo: '🥾 Botas', icon: ShieldCheck, color: '#f59e0b' },
    { key: 'guantes', titulo: '🧤 Guantes', icon: ShieldCheck, color: '#8b5cf6' },
    { key: 'epp', titulo: '🦺 Equipos EPP', icon: ShieldCheck, color: '#ec4899' },
    { key: 'herramientas', titulo: '🛠️ Herramientas', icon: Wrench, color: '#f97316' },
    { key: 'logistica-vehiculos', titulo: '🚚 Logística - Vehículos', icon: Car, color: '#ef4444' },
    { key: 'alimentacion', titulo: '🍱 Alimentación y Bebidas', icon: Coffee, color: '#06b6d4' },
    { key: 'equipo-campo', titulo: '🎒 Equipos de Campo', icon: Tent, color: '#6366f1' },
    { key: 'limpieza-personal', titulo: '🧼 Limpieza Personal', icon: Droplets, color: '#14b8a6' },
    { key: 'limpieza-general', titulo: '🧽 Limpieza General', icon: Droplets, color: '#3b82f6' },
    { key: 'medicamentos', titulo: '💊 Medicamentos', icon: Pill, color: '#10b981' },
    { key: 'rescate-animal', titulo: '🐾 Rescate Animal', icon: Heart, color: '#f43f5e' }
  ];

  return (
    <div className="modal-overlay-enhanced" onClick={handleOverlayClick}>
      <div className="modal-content-enhanced">
        {/* Header del Modal */}
        <div className="modal-header-enhanced">
          <div className="modal-title-section">
            <div className="modal-icon-container">
              <Users size={28} />
            </div>
            <div>
              <h2 className="modal-title">Detalles de la Brigada</h2>
              <p className="modal-subtitle">{detalleBrigada.nombre_brigada}</p>
            </div>
          </div>
          <button 
            className="modal-close-btn-enhanced" 
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido del Modal con Scroll */}
        <div className="modal-body-enhanced">
          {/* Información General de la Brigada */}
          <div className="info-section-enhanced">
            <h3 className="section-title-enhanced">
              <FileText size={20} />
              Información General
            </h3>
            <div className="info-grid-enhanced">
              <div className="info-card-enhanced">
                <div className="info-icon">
                  <User size={18} />
                </div>
                <div className="info-content">
                  <span className="info-label">Comandante</span>
                  <span className="info-value">{detalleBrigada.contacto_celular_comandante || 'No especificado'}</span>
                </div>
              </div>

              <div className="info-card-enhanced">
                <div className="info-icon">
                  <Package size={18} />
                </div>
                <div className="info-content">
                  <span className="info-label">Encargado Logística</span>
                  <span className="info-value">{detalleBrigada.encargado_logistica || 'No asignado'}</span>
                </div>
              </div>

              <div className="info-card-enhanced">
                <div className="info-icon">
                  <Phone size={18} />
                </div>
                <div className="info-content">
                  <span className="info-label">Cel. Logística</span>
                  <span className="info-value">{detalleBrigada.contacto_celular_logistica || 'No especificado'}</span>
                </div>
              </div>

              <div className="info-card-enhanced">
                <div className="info-icon">
                  <AlertTriangle size={18} />
                </div>
                <div className="info-content">
                  <span className="info-label">Tel. Emergencia</span>
                  <span className="info-value">{detalleBrigada.numero_emergencia_publico || 'No definido'}</span>
                </div>
              </div>

              <div className="info-card-enhanced">
                <div className="info-icon">
                  <Calendar size={18} />
                </div>
                <div className="info-content">
                  <span className="info-label">Fecha Registro</span>
                  <span className="info-value">
                    {detalleBrigada.fecha_registro 
                      ? new Date(detalleBrigada.fecha_registro).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Sin fecha'
                    }
                  </span>
                </div>
              </div>

              <div className="info-card-enhanced">
                <div className="info-icon">
                  <Users size={18} />
                </div>
                <div className="info-content">
                  <span className="info-label">Bomberos Activos</span>
                  <span className="info-value">{detalleBrigada.cantidad_bomberos_activos || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen de Equipamiento */}
          <div className="info-section-enhanced">
            <h3 className="section-title-enhanced">
              <Package size={20} />
              Resumen de Equipamiento
            </h3>
            <div className="equipment-summary-grid">
              {seccionesEquipamiento.map((seccion) => {
                const cantidad = contarItems(seccion.key);
                const tieneItems = equipamiento[seccion.key]?.length > 0;
                
                return (
                  <div 
                    key={seccion.key} 
                    className={`equipment-summary-card ${tieneItems ? 'has-items' : 'no-items'}`}
                  >
                    <div className="equipment-icon" style={{ backgroundColor: seccion.color }}>
                      <seccion.icon size={20} />
                    </div>
                    <div className="equipment-info">
                      <span className="equipment-name">{seccion.titulo.split(' ').slice(1).join(' ')}</span>
                      <span className="equipment-count">
                        {tieneItems ? `${cantidad} items` : 'Sin items'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Secciones Detalladas de Equipamiento */}
          <div className="info-section-enhanced">
            <h3 className="section-title-enhanced">
              <Wrench size={20} />
              Equipamiento Detallado
            </h3>
            
            <div className="equipment-detailed-sections">
              {seccionesEquipamiento.map((seccion) => {
                const items = equipamiento[seccion.key];
                if (!items || items.length === 0) return null;

                return (
                  <div key={seccion.key} className="equipment-detailed-section">
                    <div className="equipment-section-header">
                      <div className="equipment-section-icon" style={{ backgroundColor: seccion.color }}>
                        <seccion.icon size={18} />
                      </div>
                      <h4 className="equipment-section-title">{seccion.titulo}</h4>
                      <span className="equipment-section-count">{items.length} registros</span>
                    </div>

                    <div className="equipment-items-grid">
                      {items.map((item, index) => (
                        <div key={index} className="equipment-item-card">
                          {/* Renderizado específico según el tipo */}
                          {seccion.key === 'ropa' && (
                            <>
                              <div className="equipment-item-header">
                                <strong>{item.tipo}</strong>
                              </div>
                              <div className="equipment-tallas">
                                <span>XS: {item.cantidad_xs || 0}</span>
                                <span>S: {item.cantidad_s || 0}</span>
                                <span>M: {item.cantidad_m || 0}</span>
                                <span>L: {item.cantidad_l || 0}</span>
                                <span>XL: {item.cantidad_xl || 0}</span>
                              </div>
                              {item.observaciones && (
                                <div className="equipment-obs">
                                  <small>{item.observaciones}</small>
                                </div>
                              )}
                            </>
                          )}

                          {seccion.key === 'botas' && (
                            <>
                              <div className="equipment-item-header">
                                <strong>Botas</strong>
                              </div>
                              <div className="equipment-tallas">
                                <span>37: {item.talla_37 || 0}</span>
                                <span>38: {item.talla_38 || 0}</span>
                                <span>39: {item.talla_39 || 0}</span>
                                <span>40: {item.talla_40 || 0}</span>
                                <span>41: {item.talla_41 || 0}</span>
                                <span>42: {item.talla_42 || 0}</span>
                                <span>43: {item.talla_43 || 0}</span>
                              </div>
                              {item.otra_talla && (
                                <div className="equipment-extra">
                                  <span>Talla {item.otra_talla}: {item.cantidad_otra_talla}</span>
                                </div>
                              )}
                            </>
                          )}

                          {seccion.key === 'guantes' && (
                            <>
                              <div className="equipment-item-header">
                                <strong>Guantes</strong>
                              </div>
                              <div className="equipment-tallas">
                                <span>XS: {item.talla_xs || 0}</span>
                                <span>S: {item.talla_s || 0}</span>
                                <span>M: {item.talla_m || 0}</span>
                                <span>L: {item.talla_l || 0}</span>
                                <span>XL: {item.talla_xl || 0}</span>
                                <span>XXL: {item.talla_xxl || 0}</span>
                              </div>
                              {item.otra_talla && (
                                <div className="equipment-extra">
                                  <span>Talla {item.otra_talla}: {item.cantidad_otra_talla}</span>
                                </div>
                              )}
                            </>
                          )}

                          {seccion.key === 'logistica-vehiculos' && (
                            <>
                              <div className="equipment-item-header">
                                <strong>{item.tipo || item.nombre}</strong>
                              </div>
                              <div className="equipment-quantity">
                                <span>Cantidad: {item.cantidad}</span>
                              </div>
                              {item.monto_aproximado && (
                                <div className="equipment-price">
                                  <span>Monto: Bs. {item.monto_aproximado}</span>
                                </div>
                              )}
                            </>
                          )}

                          {/* Para el resto de categorías */}
                          {!['ropa', 'botas', 'guantes', 'logistica-vehiculos'].includes(seccion.key) && (
                            <>
                              <div className="equipment-item-header">
                                <strong>{item.nombre || item.tipo}</strong>
                              </div>
                              <div className="equipment-quantity">
                                <span>Cantidad: {item.cantidad}</span>
                              </div>
                              {item.observaciones && (
                                <div className="equipment-obs">
                                  <small>{item.observaciones}</small>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer del Modal */}
        <div className="modal-footer-enhanced">
          <div className="modal-footer-info">
            <span className="modal-footer-text">
              Presiona <kbd>Esc</kbd> para cerrar o haz clic fuera del modal
            </span>
          </div>
          <button 
            className="btn-modal-close" 
            onClick={onClose}
          >
            <X size={16} />
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
});



// Crear el componente Toast
const Toast = {
  success: (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  },
  error: (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  },
  warning: (message) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  },
  info: (message) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  },
  promise: (promise, { pending, success, error }) => {
    return toast.promise(promise, {
      pending: pending || "Procesando...",
      success: success || "¡Completado con éxito!",
      error: error || "Ocurrió un error",
    });
  }
};



// Componente de navegación - Modificado para sidebar colapsable
const Sidebar = memo(({ currentView, setCurrentView, isExpanded, setIsExpanded }) => (
  <div 
    className={`sidebar ${isExpanded ? 'expanded' : ''}`}
    onMouseEnter={() => setIsExpanded(true)}
    onMouseLeave={() => setIsExpanded(false)}
  >
    <div className="sidebar-header">
      <div className="logo-container">
        <Users className="sidebar-icon" />
        {isExpanded && <span className="sidebar-title">Bomberos 2025</span>}
      </div>
    </div>
    
    <nav className="sidebar-nav">
      <button 
        className={`nav-item ${currentView === 'home' ? 'active' : ''}`}
        onClick={() => setCurrentView('home')}
      >
        <Home size={20} />
        {isExpanded && <span>Inicio</span>}
      </button>
      
      <button 
        className={`nav-item ${currentView === 'board' ? 'active' : ''}`}
        onClick={() => setCurrentView('board')}
      >
        <FileText size={20} />
        {isExpanded && <span>Formularios</span>}
      </button>
    </nav>
  </div>
));

// Componente de Home
const HomeView = memo(({ brigadas, handleCreateForm }) => (
  <div className="home-container">
    <div className="home-content">
      <div className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Sistema de Gestión de Suministros para Brigadas de Bomberos
          </h1>
          <p className="hero-description">
            Gestiona de manera eficiente el equipamiento y recursos de las brigadas de bomberos forestales
          </p>
          <button className="cta-button" onClick={handleCreateForm}>
            <Plus size={24} />
            Haz Click Aqui para Nuevo Registro
          </button>
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={32} />
          </div>
          <div className="stat-info">
            <h3>{brigadas.length}</h3>
            <p>Brigadas Registradas</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
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
));

const BoardView = memo(({ 
  loading, 
  error, 
  brigadas, 
  handleCreateForm, 
  loadBrigadas, 
  handleEditBrigada, 
  handleDeleteBrigada,
  setDetalleBrigada,
  setMostrarModal,
  obtenerEquipamientoCompleto
}) => (
  <div className="board-container">
    <div className="board-header">
      <h1>Formularios de Brigadas</h1>
      <button className="create-button" onClick={handleCreateForm}>
        <Plus size={20} />
        Nuevo Registro
      </button>
    </div>
    
    {loading && (
      <div className="loading-container">
        <p>Cargando brigadas...</p>
      </div>
    )}
    
    {error && (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={loadBrigadas} className="retry-button">
          Reintentar
        </button>
      </div>
    )}
    
    <div className="cards-grid">
      {!loading && brigadas.length === 0 && !error && (
        <div className="empty-state">
          <FileText size={48} />
          <h3>No hay brigadas registradas</h3>
          <p>Crea tu primera brigada para comenzar</p>
          <button className="create-button" onClick={handleCreateForm}>
            <Plus size={20} />
            Crear Primera Brigada
          </button>
        </div>
      )}
      
      {brigadas.map((brigada) => (
        <div key={brigada.id} className="brigada-card">
          <div className="card-header">
            <h3>{brigada.nombre_brigada}</h3>
            <div className="card-actions">
              <button 
                className="action-btn view" 
                title="Ver detalles"
                aria-label="Ver detalles de la brigada"
                onClick={() => {
                  if (!brigada?.id) {
                    console.warn("❗ brigada.id no está definido");
                    return;
                  }

                  fetch(`https://deployback-9ukf.onrender.com/api/brigadas/${brigada.id}`)
                    .then(async res => {
                      const contentType = res.headers.get("content-type");
                      if (!contentType || !contentType.includes("application/json")) {
                        const text = await res.text();
                        console.error("⚠️ Respuesta no JSON:", text);
                        throw new Error("Respuesta no es JSON");
                      }
                      return res.json();
                    })
                    .then(async data => {
                      console.log("📦 Detalles recibidos:", data);
                      if (data.success && data.data) {
                        setDetalleBrigada(data.data);
                        await obtenerEquipamientoCompleto(data.data.id);
                        setMostrarModal(true);
                      }
                    })
                    .catch(err => {
                      console.error("❌ Error al obtener detalles:", err);
                    });
                }}
              >
                <Eye size={16} />
                <span className="tooltip">Ver detalles</span>
              </button>

              <button 
                className="action-btn edit" 
                title="Editar brigada"
                aria-label="Editar información de la brigada"
                onClick={() => handleEditBrigada(brigada)}
              >
                <Edit3 size={16} />
                <span className="tooltip">Editar</span>
              </button>
              <button 
                className="action-btn delete" 
                title="Eliminar brigada"
                    aria-label="Eliminar brigada"

                onClick={() => handleDeleteBrigada(brigada.id)}
              >
                <Trash size={16} />
                    <span className="tooltip">Eliminar</span>

              </button>
            </div>
          </div>

          <div className="card-content">
            <div className="info-row">
              <span className="label">Cel. Comandante:</span>
              <span className="value">{brigada.contacto_celular_comandante || 'No especificado'}</span>
            </div>
            <div className="info-row">
              <span className="label">Encargado Logística:</span>
              <span className="value">{brigada.encargado_logistica || 'No asignado'}</span>
            </div>
            <div className="info-row">
              <span className="label">Cel. Logística:</span>
              <span className="value">{brigada.contacto_celular_logistica || 'No especificado'}</span>
            </div>
            <div className="info-row">
              <span className="label">Nro. Emergencia:</span>
              <span className="value">{brigada.numero_emergencia_publico || 'No definido'}</span>
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
              {brigada.fecha_registro ? new Date(brigada.fecha_registro).toLocaleDateString() : 'Sin fecha'}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
));


// Componente de Progress Bar
const ProgressBar = memo(({ currentStep, steps }) => {
  // Configuración del carrusel
  const visibleSteps = 5; // Cantidad de pasos visibles a la vez
  const [startIndex, setStartIndex] = useState(0);

  // Calcular el índice de inicio para centrar el paso actual
  useEffect(() => {
    const halfVisible = Math.floor(visibleSteps / 2);
    let newStartIndex = currentStep - halfVisible;
    
    // Ajustar los límites
    if (newStartIndex < 0) {
      newStartIndex = 0;
    } else if (newStartIndex + visibleSteps > steps.length) {
      newStartIndex = Math.max(0, steps.length - visibleSteps);
    }
    
    setStartIndex(newStartIndex);
  }, [currentStep, steps.length]);

  // Pasos visibles para el carrusel
  const visibleStepsData = steps.slice(startIndex, startIndex + visibleSteps);
  const totalSteps = steps.length;

  return (
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

      <div className="carousel-container">
        {/* Indicador de más elementos a la izquierda */}
        {startIndex > 0 && (
          <div className="carousel-indicator left">
            <ChevronLeft size={16} />
            <span className="indicator-count">+{startIndex}</span>
          </div>
        )}

        {/* Pasos visibles */}
        <div className="steps-carousel">
          {visibleStepsData.map((step, index) => {
            const actualIndex = startIndex + index;
            return (
              <div 
                key={step.id}
                className={`step-indicator ${actualIndex <= currentStep ? 'completed' : ''} ${actualIndex === currentStep ? 'current' : ''}`}
              >
                <div className={`step-circle ${step.color}`}>
                  <step.icon size={16} />
                </div>
                <span className="step-title">{step.title}</span>
              </div>
            );
          })}
        </div>

        {/* Indicador de más elementos a la derecha */}
        {startIndex + visibleSteps < totalSteps && (
          <div className="carousel-indicator right">
            <span className="indicator-count">+{totalSteps - (startIndex + visibleSteps)}</span>
            <ChevronRight size={16} />
          </div>
        )}
      </div>

      {/* Mini indicadores de posición */}
      <div className="position-indicators">
        {Array.from({ length: Math.ceil(totalSteps / visibleSteps) }).map((_, index) => (
          <div 
            key={index} 
            className={`position-dot ${Math.floor(currentStep / visibleSteps) === index ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
});






// Componente de Step 0 - Información General CORREGIDO
const InformacionGeneralStep = memo(({ formData, selectedBrigada, updateFormData, brigadas, onSelectBrigada, isEditMode }) => {
  
  // Determinar si los campos deben estar deshabilitados
  // Solo se deshabilitan si hay una brigada seleccionada Y NO estamos en modo edición
  const fieldsDisabled = selectedBrigada && !isEditMode;
  
  return (
    <div className="form-step">
      {/* Solo mostrar el selector si NO estamos en modo edición */}
      {!isEditMode && (
        <div className="form-group">
          <label>Elegir Brigada Existente</label>
          <select
            className="form-select"
            value={selectedBrigada ? selectedBrigada.id : ''}
            onChange={e => {
              const brigadaId = e.target.value;
              const brigada = brigadas.find(b => b.id === parseInt(brigadaId));
              if (brigada) {
                onSelectBrigada(brigada);
              } else {
                onSelectBrigada(null);
                updateFormData('brigada', 'NombreBrigada', '');
                updateFormData('brigada', 'CantidadBomberosActivos', '');
                updateFormData('brigada', 'ContactoCelularComandante', '');
                updateFormData('brigada', 'EncargadoLogistica', '');
                updateFormData('brigada', 'ContactoCelularLogistica', '');
                updateFormData('brigada', 'NumeroEmergenciaPublico', '');
              }
            }}
          >
            <option value="">-- Haz Click Aqui para Seleccionar Brigada Existente --</option>
            {brigadas.map(b => (
              <option key={b.id} value={b.id}>{b.nombre_brigada}</option>
            ))}
          </select>
        </div>
      )}
      
      <div className="step-header">
        <h2>
          {isEditMode 
            ? 'Editar Datos de la Brigada' 
            : selectedBrigada 
              ? 'Asignar Recursos a Brigada Existente' 
              : 'Datos de la Brigada'
          }
        </h2>
        <p>
          {isEditMode
            ? 'Modifica los datos de la brigada existente'
            : selectedBrigada
              ? 'Los datos de la brigada no pueden ser modificados. Solo puedes asignar recursos.'
              : 'Proporciona los datos básicos de la brigada de bomberos forestales'
          }
        </p>
      </div>
      
      <div className="form-grid">
        <div className="form-group">
          <label>Nombre de la Brigada *</label>
          <input
            type="text"
            className={`form-input${fieldsDisabled ? ' input-disabled' : ''}`}
            value={formData.brigada.NombreBrigada}
            onChange={(e) => updateFormData('brigada', 'NombreBrigada', e.target.value)}
            placeholder="Ej: Brigada Forestal Central"
            maxLength={80}
            required
            disabled={fieldsDisabled}
          />
        </div>
        
        <div className="form-group">
          <label>Cantidad de Bomberos Activos</label>
          <div className="number-input-wrapper">
            <input
              type="number"
              className={`form-input${fieldsDisabled ? ' input-disabled' : ''}`}
              value={formData.brigada.CantidadBomberosActivos}
              onChange={(e) => updateFormData('brigada', 'CantidadBomberosActivos', e.target.value)}
              placeholder="Ej: 25"
              min="0"
              disabled={fieldsDisabled}
            />
            <button 
              type="button" 
              className="number-btn number-btn-increment"
              onClick={() => {
                const newValue = parseInt(formData.brigada.CantidadBomberosActivos || 0) + 1;
                updateFormData('brigada', 'CantidadBomberosActivos', newValue.toString());
              }}
              disabled={fieldsDisabled}
            >
              +
            </button>
            <button 
              type="button" 
              className="number-btn number-btn-decrement"
              onClick={() => {
                const currentValue = parseInt(formData.brigada.CantidadBomberosActivos || 0);
                const newValue = Math.max(0, currentValue - 1);
                updateFormData('brigada', 'CantidadBomberosActivos', newValue.toString());
              }}
              disabled={fieldsDisabled}
            >
              -
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Contacto Celular del Comandante</label>
          <input
            type="tel"
            className={`form-input${fieldsDisabled ? ' input-disabled' : ''}`}
            value={formData.brigada.ContactoCelularComandante}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, '');
              if (onlyNumbers.length <= 15) {
                updateFormData('brigada', 'ContactoCelularComandante', onlyNumbers);
              }
            }}
            placeholder="Ej: 59171234567"
            maxLength={15}
            inputMode="numeric"
            pattern="\d*"
            disabled={fieldsDisabled}
          />
        </div>
        
        <div className="form-group">
          <label>Encargado de Logística</label>
          <input
            type="text"
            className={`form-input${fieldsDisabled ? ' input-disabled' : ''}`}
            value={formData.brigada.EncargadoLogistica}
            onChange={(e) => updateFormData('brigada', 'EncargadoLogistica', e.target.value)}
            placeholder="Nombre del encargado de logística"
            maxLength={60}
            disabled={fieldsDisabled}
          />
        </div>
        
        <div className="form-group">
          <label>Contacto Celular de Logística</label>
          <input
            type="tel"
            className={`form-input${fieldsDisabled ? ' input-disabled' : ''}`}
            value={formData.brigada.ContactoCelularLogistica}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, '');
              if (onlyNumbers.length <= 15) {
                updateFormData('brigada', 'ContactoCelularLogistica', onlyNumbers);
              }
            }}
            placeholder="Ej: 59176543210"
            inputMode="numeric"
            pattern="\d*"
            maxLength={15}
            disabled={fieldsDisabled}
          />
        </div>
        
        <div className="form-group">
          <label>Número de Emergencia Público</label>
          <input
            type="tel"
            className={`form-input${fieldsDisabled ? ' input-disabled' : ''}`}
            value={formData.brigada.NumeroEmergenciaPublico}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, '');
              if (onlyNumbers.length <= 6) {
                updateFormData('brigada', 'NumeroEmergenciaPublico', onlyNumbers);
              }
            }}
            placeholder="Ej: 132"
            inputMode="numeric"
            pattern="\d*"
            maxLength={6}
            disabled={fieldsDisabled}
          />
        </div>
      </div>
    </div>
  );
});


// Componente de Step 1 - Equipamiento EPP (ROPA)
const EquipamientoRopaStep = memo(({ formData, updateFormData, catalogos }) => {
  const [selectedTipoRopa, setSelectedTipoRopa] = useState('');
  const [ropaCantidades, setRopaCantidades] = useState({
    CantidadXS: 0,
    CantidadS: 0,
    CantidadM: 0,
    CantidadL: 0,
    CantidadXL: 0,
    Observaciones: ''
  });

  const agregarRopa = useCallback(() => {
    if (!selectedTipoRopa) return;
    
    const nuevaRopa = {
      TipoRopaID: parseInt(selectedTipoRopa),
      ...ropaCantidades
    };
    
    const nuevasRopas = [...formData.equipamiento.ropa, nuevaRopa];
    updateFormData('equipamiento', 'ropa', nuevasRopas);
    
    // Reset form
    setSelectedTipoRopa('');
    setRopaCantidades({
      CantidadXS: 0,
      CantidadS: 0,
      CantidadM: 0,
      CantidadL: 0,
      CantidadXL: 0,
      Observaciones: ''
    });
  }, [selectedTipoRopa, ropaCantidades, formData.equipamiento.ropa, updateFormData]);

  return (
    <div className="form-step">
      <div className="step-header">
        <h2>Equipamiento EPP (ROPA)</h2>
        <p>Registra el equipamiento de ropa por tallas</p>
      </div>
      
      <div className="form-grid">
        <div className="form-group">
          <label>Tipo de Ropa *</label>
          <select
            className="form-select"
            value={selectedTipoRopa}
            onChange={(e) => setSelectedTipoRopa(e.target.value)}
          >
            <option value="">Seleccionar tipo de ropa</option>
            {catalogos.tipos_ropa.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-row-custom ">
  <div className="form-group">
    <label>Cantidad XS</label>
    <div className="number-input-wrapper">
      <input
        type="number"
        className="form-input"
        value={ropaCantidades.CantidadXS}
        onChange={(e) => setRopaCantidades({...ropaCantidades, CantidadXS: parseInt(e.target.value) || 0})}
        min="0"
      />
      <button 
        type="button" 
        className="number-btn number-btn-increment"
        onClick={() => setRopaCantidades({...ropaCantidades, CantidadXS: ropaCantidades.CantidadXS + 1})}
      >
        +
      </button>
      <button 
        type="button" 
        className="number-btn number-btn-decrement"
        onClick={() => setRopaCantidades({...ropaCantidades, CantidadXS: Math.max(0, ropaCantidades.CantidadXS - 1)})}
      >
        -
      </button>
    </div>
  </div>
  
  <div className="form-group">
    <label>Cantidad S</label>
    <div className="number-input-wrapper">
      <input
        type="number"
        className="form-input"
        value={ropaCantidades.CantidadS}
        onChange={(e) => setRopaCantidades({...ropaCantidades, CantidadS: parseInt(e.target.value) || 0})}
        min="0"
      />
      <button 
        type="button" 
        className="number-btn number-btn-increment"
        onClick={() => setRopaCantidades({...ropaCantidades, CantidadS: ropaCantidades.CantidadS + 1})}
      >
        +
      </button>
      <button 
        type="button" 
        className="number-btn number-btn-decrement"
        onClick={() => setRopaCantidades({...ropaCantidades, CantidadS: Math.max(0, ropaCantidades.CantidadS - 1)})}
      >
        -
      </button>
    </div>
  </div>
  
  <div className="form-group">
    <label>Cantidad M</label>
    <div className="number-input-wrapper">
      <input
        type="number"
        className="form-input"
        value={ropaCantidades.CantidadM}
        onChange={(e) => setRopaCantidades({...ropaCantidades, CantidadM: parseInt(e.target.value) || 0})}
        min="0"
      />
      <button 
        type="button" 
        className="number-btn number-btn-increment"
        onClick={() => setRopaCantidades({...ropaCantidades, CantidadM: ropaCantidades.CantidadM + 1})}
      >
        +
      </button>
      <button 
        type="button" 
        className="number-btn number-btn-decrement"
        onClick={() => setRopaCantidades({...ropaCantidades, CantidadM: Math.max(0, ropaCantidades.CantidadM - 1)})}
      >
        -
      </button>
    </div>
  </div>
  
  <div className="form-group">
    <label>Cantidad L</label>
    <div className="number-input-wrapper">
      <input
        type="number"
        className="form-input"
        value={ropaCantidades.CantidadL}
        onChange={(e) => setRopaCantidades({...ropaCantidades, CantidadL: parseInt(e.target.value) || 0})}
        min="0"
      />
      <button 
        type="button" 
        className="number-btn number-btn-increment"
        onClick={() => setRopaCantidades({...ropaCantidades, CantidadL: ropaCantidades.CantidadL + 1})}
      >
        +
      </button>
      <button 
        type="button" 
        className="number-btn number-btn-decrement"
        onClick={() => setRopaCantidades({...ropaCantidades, CantidadL: Math.max(0, ropaCantidades.CantidadL - 1)})}
      >
        -
      </button>
    </div>
  </div>
  
  <div className="form-group">
    <label>Cantidad XL</label>
    <div className="number-input-wrapper">
      <input
        type="number"
        className="form-input"
        value={ropaCantidades.CantidadXL}
        onChange={(e) => setRopaCantidades({...ropaCantidades, CantidadXL: parseInt(e.target.value) || 0})}
        min="0"
      />
      <button 
        type="button" 
        className="number-btn number-btn-increment"
        onClick={() => setRopaCantidades({...ropaCantidades, CantidadXL: ropaCantidades.CantidadXL + 1})}
      >
        +
      </button>
      <button 
        type="button" 
        className="number-btn number-btn-decrement"
        onClick={() => setRopaCantidades({...ropaCantidades, CantidadXL: Math.max(0, ropaCantidades.CantidadXL - 1)})}
      >
        -
      </button>
    </div>
  </div>
</div>
        
        <div className="form-group">
          <label>Observaciones</label>
          <textarea
            className="form-textarea"
            value={ropaCantidades.Observaciones}
            onChange={(e) => setRopaCantidades({...ropaCantidades, Observaciones: e.target.value})}
            placeholder="Observaciones adicionales"
            rows="2"
          />
        </div>
        
        <button type="button" className="add-button" onClick={agregarRopa} disabled={!selectedTipoRopa}>
          <Plus size={16} />
          Agregar Ropa
        </button>
      </div>
      
      {formData.equipamiento.ropa.length > 0 && (
        <div className="items-list">
          <h3>Ropa Agregada:</h3>
          {formData.equipamiento.ropa.map((item, index) => (
            <div key={index} className="item-card">
              <p><strong>Tipo:</strong> {catalogos.tipos_ropa.find(t => t.id === item.TipoRopaID)?.nombre || 'N/A'}</p>
              <p><strong>Cantidades:</strong> XS: {item.CantidadXS}, S: {item.CantidadS}, M: {item.CantidadM}, L: {item.CantidadL}, XL: {item.CantidadXL}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

const BotasGuantesStep = memo(({ formData, updateFormData }) => {
    const [botasCantidades, setBotasCantidades] = useState({
      Talla37: 0, Talla38: 0, Talla39: 0, Talla40: 0, Talla41: 0, Talla42: 0, Talla43: 0,
      OtraTalla: '', CantidadOtraTalla: 0, Observaciones: ''
    });
    
    const [guantesCantidades, setGuantesCantidades] = useState({
      TallaXS: 0, TallaS: 0, TallaM: 0, TallaL: 0, TallaXL: 0, TallaXXL: 0,
      OtraTalla: '', CantidadOtraTalla: 0, Observaciones: ''
    });

    const agregarBotas = () => {
      const nuevasBotas = [...formData.equipamiento.botas, botasCantidades];
      updateFormData('equipamiento', 'botas', nuevasBotas);
      setBotasCantidades({
        Talla37: 0, Talla38: 0, Talla39: 0, Talla40: 0, Talla41: 0, Talla42: 0, Talla43: 0,
        OtraTalla: '', CantidadOtraTalla: 0, Observaciones: ''
      });
    };

    const agregarGuantes = () => {
      const nuevosGuantes = [...formData.equipamiento.guantes, guantesCantidades];
      updateFormData('equipamiento', 'guantes', nuevosGuantes);
      setGuantesCantidades({
        TallaXS: 0, TallaS: 0, TallaM: 0, TallaL: 0, TallaXL: 0, TallaXXL: 0,
        OtraTalla: '', CantidadOtraTalla: 0, Observaciones: ''
      });
    };

    const tieneCantidades = () => {
      const cantidades = [
        botasCantidades.Talla37,
        botasCantidades.Talla38,
        botasCantidades.Talla39,
        botasCantidades.Talla40,
        botasCantidades.Talla41,
        botasCantidades.Talla42,
        botasCantidades.Talla43,
        botasCantidades.CantidadOtraTalla
      ];
      
      return cantidades.some(cantidad => cantidad > 0);
    };

    const tieneGuantesCantidades = () => {
      const cantidades = [
        guantesCantidades.TallaXS,
        guantesCantidades.TallaS,
        guantesCantidades.TallaM,
        guantesCantidades.TallaL,
        guantesCantidades.TallaXL,
        guantesCantidades.TallaXXL,
        guantesCantidades.CantidadOtraTalla
      ];
      
      return cantidades.some(cantidad => cantidad > 0);
    };

    return (
      <div className="form-step">
        <div className="step-header">
          <h2>BOTAS Y GUANTES</h2>
          <p>Registra las cantidades de botas y guantes por tallas</p>
        </div>
        
        {/* Sección Botas */}
        <div className="section">
          <h3>Botas</h3>
          <div className="form-row botas-row">
            {['37', '38', '39', '40', '41', '42', '43'].map(talla => (
              <div key={talla} className="form-group">
                <label>Talla {talla}</label>
                <div className="number-input-wrapper">
                  <button 
                    type="button" 
                    className="number-btn number-btn-decrement"
                    onClick={() => {
                      const currentValue = botasCantidades[`Talla${talla}`] || 0;
                      setBotasCantidades({...botasCantidades, [`Talla${talla}`]: Math.max(0, currentValue - 1)});
                    }}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="form-input"
                    value={botasCantidades[`Talla${talla}`]}
                    onChange={(e) => setBotasCantidades({...botasCantidades, [`Talla${talla}`]: parseInt(e.target.value) || 0})}
                    min="0"
                  />
                  <button 
                    type="button" 
                    className="number-btn number-btn-increment"
                    onClick={() => {
                      const currentValue = botasCantidades[`Talla${talla}`] || 0;
                      setBotasCantidades({...botasCantidades, [`Talla${talla}`]: currentValue + 1});
                    }}
                  >
                    +
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Otra Talla</label>
              <input
                type="text"
                className="form-input"
                value={botasCantidades.OtraTalla}
                onChange={(e) => {
                  const soloNumeros = e.target.value.replace(/\D/g, '').slice(0, 2); // solo dígitos, máx 2
                  setBotasCantidades({ 
                    ...botasCantidades, 
                    OtraTalla: soloNumeros,
                    // Si se borra la talla, resetear la cantidad también
                    CantidadOtraTalla: soloNumeros === '' ? 0 : botasCantidades.CantidadOtraTalla=1
                  });
                }}
                placeholder="Ej: 44"
                inputMode="numeric"
                maxLength={2}
              />
            </div>



            <div className="form-group">
              <label>Cantidad Otra Talla</label>
              <div className="number-input-wrapper">
                <input
                  type="number"
                  className="form-input"
                  value={botasCantidades.CantidadOtraTalla}
                  onChange={(e) => {
                    const valor = parseInt(e.target.value) || 0;
                    
                    if (botasCantidades.OtraTalla && botasCantidades.OtraTalla !== '') {
                      setBotasCantidades({
                        ...botasCantidades, 
                        CantidadOtraTalla: valor === 0 ? 1 : valor
                      });
                    } else {
                      setBotasCantidades({
                        ...botasCantidades, 
                        CantidadOtraTalla: valor
                      });
                    }
                  }}
                  min={botasCantidades.OtraTalla && botasCantidades.OtraTalla !== '' ? "1" : "0"}
                  disabled={!botasCantidades.OtraTalla || botasCantidades.OtraTalla === ''}
                />
                <button 
                  type="button" 
                  className="number-btn number-btn-decrement"
                  onClick={() => {
                    const currentValue = botasCantidades.CantidadOtraTalla || 0;
                    const minValue = (botasCantidades.OtraTalla && botasCantidades.OtraTalla !== '') ? 1 : 0;
                    setBotasCantidades({...botasCantidades, CantidadOtraTalla: Math.max(minValue, currentValue - 1)});
                  }}
                  disabled={!botasCantidades.OtraTalla || botasCantidades.OtraTalla === ''}
                >
                  -
                </button>
                <button 
                  type="button" 
                  className="number-btn number-btn-increment"
                  onClick={() => {
                    const currentValue = botasCantidades.CantidadOtraTalla || 0;
                    setBotasCantidades({...botasCantidades, CantidadOtraTalla: currentValue + 1});
                  }}
                  disabled={!botasCantidades.OtraTalla || botasCantidades.OtraTalla === ''}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Observaciones Botas</label>
            <textarea
              className="form-textarea"
              value={botasCantidades.Observaciones}
              onChange={(e) => setBotasCantidades({...botasCantidades, Observaciones: e.target.value})}
              placeholder="Observaciones adicionales"
              rows="2"
            />
          </div>
          <button 
            type="button" 
            className={`add-button ${!tieneCantidades() ? 'disabled' : ''}`}
            onClick={agregarBotas}
            disabled={!tieneCantidades()}
            title={!tieneCantidades() ? "Debe ingresar al menos una cantidad mayor a 0" : ""}
          >
            <Plus size={16} />
            Agregar Botas
          </button>

          {formData.equipamiento.botas.length > 0 && (
            <div className="items-list">
              <h3>Botas Agregadas:</h3>
              {formData.equipamiento.botas.map((item, index) => (
                <div key={index} className="item-card">
                  <p><strong>Cantidades:</strong> 37: {item.Talla37}, 38: {item.Talla38}, 39: {item.Talla39}, 40: {item.Talla40}, 41: {item.Talla41}, 42: {item.Talla42}, 43: {item.Talla43}</p>
                  {item.OtraTalla && (
                    <p><strong>Otra talla ({item.OtraTalla}):</strong> {item.CantidadOtraTalla}</p>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>


        {/* Sección Guantes */}
        <div className="section">
          <h3>Guantes</h3>
          
          {/* Filas para tallas estándar */}
          <div className="form-row guantes-row">
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(talla => (
              <div key={talla} className="form-group">
                <label>Talla {talla}</label>
                <div className="number-input-wrapper">
                  <button 
                    type="button" 
                    className="number-btn number-btn-decrement"
                    onClick={() => {
                      const currentValue = guantesCantidades[`Talla${talla}`] || 0;
                      setGuantesCantidades({...guantesCantidades, [`Talla${talla}`]: Math.max(0, currentValue - 1)});
                    }}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="form-input"
                    value={guantesCantidades[`Talla${talla}`]}
                    onChange={(e) => setGuantesCantidades({...guantesCantidades, [`Talla${talla}`]: parseInt(e.target.value) || 0})}
                    min="0"
                  />
                  <button 
                    type="button" 
                    className="number-btn number-btn-increment"
                    onClick={() => {
                      const currentValue = guantesCantidades[`Talla${talla}`] || 0;
                      setGuantesCantidades({...guantesCantidades, [`Talla${talla}`]: currentValue + 1});
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Campos para otra talla */}
          <div className="form-row">
            <div className="form-group">
              <label>Otra Talla</label>
              <input
                type="text"
                className="form-input"
                value={guantesCantidades.OtraTalla}
                onChange={(e) => {
                  const soloLetras = e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 5);
                  setGuantesCantidades({ 
                    ...guantesCantidades, 
                    OtraTalla: soloLetras.toUpperCase(),
                    CantidadOtraTalla: soloLetras === '' ? 0 : guantesCantidades.CantidadOtraTalla = 1
                  });
                }}
                placeholder="Ej: XXL"
                maxLength={5}
              />
            </div>

            <div className="form-group">
              <label>Cantidad Otra Talla</label>
              <div className="number-input-wrapper">
                <input
                  type="number"
                  className="form-input"
                  value={guantesCantidades.CantidadOtraTalla}
                  onChange={(e) => {
                    const valor = parseInt(e.target.value) || 0;
                    if (guantesCantidades.OtraTalla && guantesCantidades.OtraTalla !== '') {
                      setGuantesCantidades({
                        ...guantesCantidades, 
                        CantidadOtraTalla: valor === 0 ? 1 : valor
                      });
                    } else {
                      setGuantesCantidades({
                        ...guantesCantidades, 
                        CantidadOtraTalla: valor
                      });
                    }
                  }}
                  min={guantesCantidades.OtraTalla && guantesCantidades.OtraTalla !== '' ? "1" : "0"}
                  disabled={!guantesCantidades.OtraTalla || guantesCantidades.OtraTalla === ''}
                />
                <button 
                  type="button" 
                  className="number-btn number-btn-decrement"
                  onClick={() => {
                    const currentValue = guantesCantidades.CantidadOtraTalla || 0;
                    const minValue = (guantesCantidades.OtraTalla && guantesCantidades.OtraTalla !== '') ? 1 : 0;
                    setGuantesCantidades({...guantesCantidades, CantidadOtraTalla: Math.max(minValue, currentValue - 1)});
                  }}
                  disabled={!guantesCantidades.OtraTalla || guantesCantidades.OtraTalla === ''}
                >
                  -
                </button>
                <button 
                  type="button" 
                  className="number-btn number-btn-increment"
                  onClick={() => {
                    const currentValue = guantesCantidades.CantidadOtraTalla || 0;
                    setGuantesCantidades({...guantesCantidades, CantidadOtraTalla: currentValue + 1});
                  }}
                  disabled={!guantesCantidades.OtraTalla || guantesCantidades.OtraTalla === ''}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          
          {/* Observaciones */}
          <div className="form-group">
            <label>Observaciones Guantes</label>
            <textarea
              className="form-textarea"
              value={guantesCantidades.Observaciones}
              onChange={(e) => setGuantesCantidades({...guantesCantidades, Observaciones: e.target.value})}
              placeholder="Observaciones adicionales"
              rows="2"
            />
          </div>
          
          {/* Botón para agregar */}
          <button 
            type="button" 
            className={`add-button ${!tieneGuantesCantidades() ? 'disabled' : ''}`}
            onClick={agregarGuantes}
            disabled={!tieneGuantesCantidades()}
            title={!tieneGuantesCantidades() ? "Debe ingresar al menos una cantidad mayor a 0" : ""}
          >
            <Plus size={16} />
            Agregar Guantes
          </button>

          {/* Lista de guantes agregados */}
          {formData.equipamiento.guantes.length > 0 && (
            <div className="items-list">
              <h3>Guantes Agregados:</h3>
              {formData.equipamiento.guantes.map((item, index) => (
                <div key={index} className="item-card">
                  <p><strong>Cantidades:</strong> XS: {item.TallaXS}, S: {item.TallaS}, M: {item.TallaM}, L: {item.TallaL}, XL: {item.TallaXL}, XXL: {item.TallaXXL}</p>
                  {item.OtraTalla && (
                    <p><strong>Otra talla ({item.OtraTalla}):</strong> {item.CantidadOtraTalla}</p>
                  )}
                  {item.Observaciones && (
                    <p><strong>Observaciones:</strong> {item.Observaciones}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  });

// Componente genérico para equipamiento con catálogo
const EquipamientoGenericoStep = memo(({ title, description, catalogKey, equipamientoKey, idField, showMonto = false, formData, updateFormData, catalogos }) => {
  const [selectedItem, setSelectedItem] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [monto, setMonto] = useState(0);
  const [observaciones, setObservaciones] = useState('');

  const catalogo = catalogos[catalogKey] || [];
  const equipamientoItems = formData.equipamiento[equipamientoKey] || [];

const agregarItem = useCallback(() => {
  if (!selectedItem) {
    Toast.warning('Debe seleccionar un item');
    return;
  }
  
  if (cantidad <= 0) {
    Toast.warning('La cantidad debe ser mayor a 0');
    return;
  }
  
  const nuevoItem = {
    [idField]: parseInt(selectedItem),
    Cantidad: cantidad,
    ...(showMonto && { MontoAproximado: monto }),
    Observaciones: observaciones
  };
  
  const nuevosItems = [...equipamientoItems, nuevoItem];
  updateFormData('equipamiento', equipamientoKey, nuevosItems);
  
  // Toast de éxito con información específica
  const itemNombre = catalogo.find(c => c.id === parseInt(selectedItem))?.nombre || 'Item';
  Toast.success(`${itemNombre} agregado correctamente (Cantidad: ${cantidad}${showMonto ? `, Monto: $${monto}` : ''})`);
  
  // Reset form
  setSelectedItem('');
  setCantidad(0);
  setMonto(0);
  setObservaciones('');
}, [selectedItem, cantidad, monto, observaciones, equipamientoItems, updateFormData, equipamientoKey, idField, showMonto, catalogo]);


  return (
    <div className="form-step">
      <div className="step-header">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      
      <div className="form-grid">
        <div className="form-group">
          <label>Seleccionar Item *</label>
          <select
            className="form-select"
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
          >
            <option value="">Seleccionar...</option>
            {catalogo.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nombre}
              </option>
            ))}
          </select>
        </div>
        



        <div className="form-group">
  <label>Cantidad</label>
  <div className="number-input-wrapper">
    <button 
      type="button" 
      className="number-btn number-btn-decrement"
      onClick={() => setCantidad(Math.max(0, cantidad - 1))}
    >
      -
    </button>
    <input
      type="number"
      className="form-input"
      value={cantidad}
      onChange={(e) => setCantidad(parseInt(e.target.value) || 0)}
      min="0"
    />
    <button 
      type="button" 
      className="number-btn number-btn-increment"
      onClick={() => setCantidad(cantidad + 1)}
    >
      +
    </button>
  </div>
</div>


        
        {showMonto && (
          <div className="form-group">
            <label>Monto Aproximado</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              value={monto}
              onChange={(e) => setMonto(parseFloat(e.target.value) || 0)}
              min="0"
            />
          </div>
        )}
        
        <div className="form-group">
          <label>Observaciones</label>
          <textarea
            className="form-textarea"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Observaciones adicionales"
            rows="2"
          />
        </div>
        
        <button type="button" className="add-button" onClick={agregarItem} disabled={!selectedItem}>
          <Plus size={16} />
          Agregar Item
        </button>
      </div>
      
      {equipamientoItems.length > 0 && (
        <div className="items-list">
          <h3>Items Agregados:</h3>
          {equipamientoItems.map((item, index) => (
            <div key={index} className="item-card">
              <p><strong>Item:</strong> {catalogo.find(c => c.id === item[idField])?.nombre || 'N/A'}</p>
              <p><strong>Cantidad:</strong> {item.Cantidad}</p>
              {showMonto && <p><strong>Monto:</strong> ${item.MontoAproximado}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

// Componente de Form View
const FormView = memo(({ 
  currentStep, 
  steps, 
  formData, 
  selectedBrigada, 
  updateFormData, 
  catalogos,
  setCurrentView, 
  prevStep, 
  nextStep, 
  handleSubmitForm, 
  loading,
  brigadas,
  onSelectBrigada,
  isEditMode
}) => (
  <div className="form-container">
    <ProgressBar currentStep={currentStep} steps={steps} />
    
    <div className="form-content">
      {currentStep === 0 && (
  <InformacionGeneralStep 
    formData={formData}
    selectedBrigada={selectedBrigada}
    updateFormData={updateFormData}
    brigadas={brigadas}
    onSelectBrigada={onSelectBrigada}
    isEditMode={isEditMode}  // ← Agregar esta línea
  />
)}
      {currentStep === 1 && (
        <EquipamientoRopaStep 
          formData={formData}
          updateFormData={updateFormData}
          catalogos={catalogos}
        />
      )}
      {currentStep === 2 && (
        <BotasGuantesStep 
          formData={formData}
          updateFormData={updateFormData}
          catalogos={catalogos}
        />
      )}
        {currentStep === 3 && (
          <EquipamientoGenericoStep 
            title="Equipamiento EPP (ESCLAVA, LINTERNA, etc)"
            description="Registra equipamiento de protección personal adicional"
            catalogKey="equipamiento_epp"
            equipamientoKey="epp"
            idField="EquipoEPPID"
            formData={formData}
            updateFormData={updateFormData}
            catalogos={catalogos}
          />
        )}
        {currentStep === 4 && (
          <EquipamientoGenericoStep 
            title="HERRAMIENTAS (Linternas, pilas, azadón, etc)"
            description="Registra herramientas para operaciones forestales"
            catalogKey="herramientas"
            equipamientoKey="herramientas"
            idField="HerramientaID"
            formData={formData}
            updateFormData={updateFormData}
            catalogos={catalogos}
          />
        )}
        {currentStep === 5 && (
          <EquipamientoGenericoStep 
            title="Logística (Gasolina, diesel, amortiguadores)"
            description="Registra servicios y gastos de vehículos"
            catalogKey="servicios_vehiculos"
            equipamientoKey="logistica_vehiculos"
            idField="ServicioVehiculoID"
            showMonto={true}
            formData={formData}
            updateFormData={updateFormData}
            catalogos={catalogos}
          />
        )}
        {currentStep === 6 && (
          <EquipamientoGenericoStep 
            title="Alimentación y bebidas"
            description="Registra alimentos y bebidas para las operaciones"
            catalogKey="alimentos_bebidas"
            equipamientoKey="alimentacion"
            idField="AlimentoBebidaID"
            formData={formData}
            updateFormData={updateFormData}
            catalogos={catalogos}
          />
        )}
        {currentStep === 7 && (
          <EquipamientoGenericoStep 
            title="Logística y equipo de campo (colchonetas, etc)"
            description="Registra equipamiento para operaciones en campo"
            catalogKey="equipo_campo"
            equipamientoKey="equipo_campo"
            idField="EquipoCampoID"
            formData={formData}
            updateFormData={updateFormData}
            catalogos={catalogos}
          />
        )}
        {currentStep === 8 && (
          <EquipamientoGenericoStep 
            title="Limpieza personal (shampoo, etc)"
            description="Registra productos de higiene personal"
            catalogKey="limpieza_personal"
            equipamientoKey="limpieza_personal"
            idField="ProductoLimpiezaPersonalID"
            formData={formData}
            updateFormData={updateFormData}
            catalogos={catalogos}
          />
        )}
        {currentStep === 9 && (
          <EquipamientoGenericoStep 
            title="Limpieza general (ACE, LAVANDINA, etc)"
            description="Registra productos de limpieza general"
            catalogKey="limpieza_general"
            equipamientoKey="limpieza_general"
            idField="ProductoLimpiezaGeneralID"
            formData={formData}
            updateFormData={updateFormData}
            catalogos={catalogos}
          />
        )}
        {currentStep === 10 && (
          <EquipamientoGenericoStep 
            title="Medicamentos"
            description="Registra medicamentos y suministros médicos"
            catalogKey="medicamentos"
            equipamientoKey="medicamentos"
            idField="MedicamentoID"
            formData={formData}
            updateFormData={updateFormData}
            catalogos={catalogos}
          />
        )}
        {currentStep === 11 && (
          <EquipamientoGenericoStep 
            title="Rescate animal"
            description="Registra alimentos para rescate de animales"
            catalogKey="alimentos_animales"
            equipamientoKey="rescate_animal"
            idField="AlimentoAnimalID"
            formData={formData}
            updateFormData={updateFormData}
            catalogos={catalogos}
          />
        )}
    </div>
    
    <div className="form-navigation">
        <button 
          className="nav-btn secondary" 
          onClick={() => setCurrentView('board')}
        >
          <X size={20} />
          Cancelar
        </button>
        
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
            disabled={currentStep === 0 && !formData.brigada.NombreBrigada}
          >
            Siguiente
            <ChevronRight size={20} />
          </button>
        ) : (
          <button 
            className="nav-btn success" 
            onClick={handleSubmitForm}
            disabled={loading || !formData.brigada.NombreBrigada}
          >
            <Save size={20} />
            {loading
              ? 'Guardando...'
              : isEditMode
                ? 'Actualizar Brigada'
                : 'Guardar Formulario'}
          </button>
        )}
      </div>
  </div>
));

// Componente de Success Animation
const SuccessAnimation = memo(({ selectedBrigada }) => (
  <div className="success-overlay">
    <div className="success-animation">
      <div className="check-circle">
        <Check size={48} />
      </div>
      <h2>¡Formulario Enviado!</h2>
      <p>La brigada ha sido {selectedBrigada ? 'actualizada' : 'registrada'} exitosamente</p>
    </div>
  </div>
));

// ✅ COMPONENTE PRINCIPAL - SOLO LÓGICA, SIN COMPONENTES ANIDADOS
const BomberosApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const [brigadas, setBrigadas] = useState([]);
  const [selectedBrigada, setSelectedBrigada] = useState(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detalleBrigada, setDetalleBrigada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false); // Nuevo estado para sidebar

  

  // Estados para el formulario
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    brigada: {
      NombreBrigada: '',
      CantidadBomberosActivos: '',
      ContactoCelularComandante: '',
      EncargadoLogistica: '',
      ContactoCelularLogistica: '',
      NumeroEmergenciaPublico: ''
    },
    equipamiento: {
      ropa: [],
      botas: [],
      guantes: [],
      epp: [],
      herramientas: [],
      logistica_vehiculos: [],
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
  { id: 0, title: 'Datos de la Brigada', icon: FileText, color: 'bg-blue-500' },
  { id: 1, title: 'Equipamiento EPP (ROPA)', icon: Shirt, color: 'bg-green-500' },
  { id: 2, title: 'BOTAS Y GUANTES', icon: ShieldCheck, color: 'bg-yellow-500' },
  { id: 3, title: 'Equipamiento EPP (ESCLAVA, LINTERNA)', icon: ShieldCheck, color: 'bg-purple-500' },
  { id: 4, title: 'HERRAMIENTAS', icon: Wrench, color: 'bg-orange-500' },
  { id: 5, title: 'Logística (Gasolina, diesel)', icon: Car, color: 'bg-red-500' },
  { id: 6, title: 'Alimentación y bebidas', icon: Coffee, color: 'bg-pink-500' },
  { id: 7, title: 'Logística y equipo de campo', icon: Tent, color: 'bg-indigo-500' },
  { id: 8, title: 'Limpieza personal', icon: Droplets, color: 'bg-cyan-500' },
  { id: 9, title: 'Limpieza general', icon: Droplets, color: 'bg-blue-500' },
  { id: 10, title: 'Medicamentos', icon: Pill, color: 'bg-emerald-500' },
  { id: 11, title: 'Rescate animal', icon: Heart, color: 'bg-rose-500' }
];

  const [equipamiento, setEquipamiento] = useState({});
  
  const obtenerEquipamientoCompleto = useCallback(async (brigadaId) => {
  const toastId = toast.loading("Cargando detalles del equipamiento...", {
    position: "top-right"
  });

  const categorias = [
    'ropa',
    'botas',
    'guantes',
    'epp',
    'herramientas',
    'logistica-vehiculos',
    'alimentacion',
    'equipo-campo',
    'limpieza-personal',
    'limpieza-general',
    'medicamentos',
    'rescate-animal'
  ];

  const resultados = {};
  let categoriasExitosas = 0;
  let categoriasFallidas = 0;

  await Promise.all(
    categorias.map(async (categoria) => {
      try {
        const res = await fetch(`https://deployback-9ukf.onrender.com/api/equipamiento/${brigadaId}/${categoria}`);
        if (!res.ok) throw new Error(`Error en ${categoria}`);

        const data = await res.json();
        resultados[categoria] = data?.data || [];
        categoriasExitosas++;
      } catch (error) {
        console.warn(`❌ Fallo al cargar ${categoria}:`, error);
        resultados[categoria] = [];
        categoriasFallidas++;
      }
    })
  );

  setEquipamiento(resultados);

  if (categoriasFallidas === 0) {
    toast.update(toastId, {
      render: `Equipamiento cargado exitosamente (${categoriasExitosas} categorías)`,
      type: "success",
      isLoading: false,
      autoClose: 2000
    });
  } else if (categoriasExitosas > 0) {
    toast.update(toastId, {
      render: `Equipamiento cargado parcialmente (${categoriasExitosas}/${categorias.length} categorías)`,
      type: "warning",
      isLoading: false,
      autoClose: 3000
    });
  } else {
    toast.update(toastId, {
      render: "Error al cargar el equipamiento",
      type: "error",
      isLoading: false,
      autoClose: 4000
    });
  }
}, []);


  // Cargar datos iniciales
  useEffect(() => {
    loadBrigadas();
    loadCatalogos();
  }, []);

  const loadBrigadas = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);
    
    console.log('🔄 Cargando brigadas...');
    const response = await apiService.getBrigadas();
    console.log('📦 Respuesta completa:', response);
    
    if (response && response.data) {
      setBrigadas(response.data);
      console.log('✅ Brigadas cargadas:', response.data);
      // Toast de éxito solo si hay brigadas
      if (response.data.length > 0) {
        Toast.success(`${response.data.length} brigadas cargadas correctamente`);
      }
    } else if (Array.isArray(response)) {
      setBrigadas(response);
      console.log('✅ Brigadas cargadas (array directo):', response);
      if (response.length > 0) {
        Toast.success(`${response.length} brigadas cargadas correctamente`);
      }
    } else {
      console.warn('⚠️ Estructura de respuesta inesperada:', response);
      setBrigadas([]);
      Toast.warning('No se encontraron brigadas');
    }
  } catch (error) {
    console.error('❌ Error loading brigadas:', error);
    const errorMessage = `Error al cargar las brigadas: ${error.message}`;
    setError(errorMessage);
    setBrigadas([]);
    Toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
}, []);


  const loadCatalogos = useCallback(async () => {
  try {
    console.log('🔄 Cargando catálogos...');
    const catalogos = await apiService.getAllCatalogos();
    console.log('📦 Catálogos cargados:', catalogos);
    setCatalogos(catalogos);
    Toast.success('Catálogos cargados correctamente');
  } catch (error) {
    console.error('❌ Error loading catalogos:', error);
    Toast.error(`Error al cargar catálogos: ${error.message}`);
  }
}, []);



  const handleCreateForm = useCallback(() => {
    setCurrentStep(0);
    setFormData({
      brigada: {
        NombreBrigada: '',
        CantidadBomberosActivos: '',
        ContactoCelularComandante: '',
        EncargadoLogistica: '',
        ContactoCelularLogistica: '',
        NumeroEmergenciaPublico: ''
      },
      equipamiento: {
        ropa: [],
        botas: [],
        guantes: [],
        epp: [],
        herramientas: [],
        logistica_vehiculos: [],
        alimentacion: [],
        equipo_campo: [],
        limpieza_personal: [],
        limpieza_general: [],
        medicamentos: [],
        rescate_animal: []
      }
    });
    setSelectedBrigada(null);
    setIsEditMode(false);
    setCurrentView('form');
  }, []);

  const handleSubmitForm = useCallback(async () => {
  const toastId = toast.loading("Guardando formulario...", {
    position: "top-right"
  });

  try {
    setLoading(true);
    setError(null);
    let brigadaId;

    if (selectedBrigada && isEditMode) {
      // Modo edición: actualiza la brigada
      toast.update(toastId, {
        render: "Actualizando información de la brigada...",
        type: "info",
        isLoading: true
      });

      const brigadaData = {
        NombreBrigada: formData.brigada.NombreBrigada,
        CantidadBomberosActivos: parseInt(formData.brigada.CantidadBomberosActivos) || 0,
        ContactoCelularComandante: formData.brigada.ContactoCelularComandante,
        EncargadoLogistica: formData.brigada.EncargadoLogistica,
        ContactoCelularLogistica: formData.brigada.ContactoCelularLogistica,
        NumeroEmergenciaPublico: formData.brigada.NumeroEmergenciaPublico
      };
      await apiService.updateBrigada(selectedBrigada.id, brigadaData);
      brigadaId = selectedBrigada.id;
      
      toast.update(toastId, {
        render: "Brigada actualizada correctamente",
        type: "success",
        isLoading: false,
        autoClose: 2000
      });
    } else {
      // Modo duplicar o nueva: crea una nueva brigada
      toast.update(toastId, {
        render: "Creando nueva brigada...",
        type: "info",
        isLoading: true
      });

      const brigadaData = {
        NombreBrigada: formData.brigada.NombreBrigada,
        CantidadBomberosActivos: parseInt(formData.brigada.CantidadBomberosActivos) || 0,
        ContactoCelularComandante: formData.brigada.ContactoCelularComandante,
        EncargadoLogistica: formData.brigada.EncargadoLogistica,
        ContactoCelularLogistica: formData.brigada.ContactoCelularLogistica,
        NumeroEmergenciaPublico: formData.brigada.NumeroEmergenciaPublico
      };
      const brigadaResponse = await apiService.createBrigada(brigadaData);
      brigadaId = brigadaResponse.data?.id;
      
      toast.update(toastId, {
        render: "Brigada creada exitosamente",
        type: "success",
        isLoading: false,
        autoClose: 2000
      });
    }

    // Guardar equipamiento si existe brigadaId
    if (brigadaId) {
      console.log('💾 Guardando equipamiento para brigada:', brigadaId);
      
      toast.update(toastId, {
        render: "Guardando equipamiento...",
        type: "info",
        isLoading: true
      });

      let equipamientoGuardado = 0;
      const totalItems = Object.values(formData.equipamiento).reduce((acc, arr) => acc + arr.length, 0);

      // Guardar cada tipo de equipamiento con feedback
      const equipamientoPromises = [];

      // Ropa
      if (formData.equipamiento.ropa.length > 0) {
        equipamientoPromises.push(
          ...formData.equipamiento.ropa.map(async (ropa) => {
            await apiService.createEquipamientoRopa(brigadaId, ropa);
            equipamientoGuardado++;
            toast.update(toastId, {
              render: `Guardando equipamiento... (${equipamientoGuardado}/${totalItems})`,
              type: "info",
              isLoading: true
            });
          })
        );
      }

      // Botas
      if (formData.equipamiento.botas.length > 0) {
        equipamientoPromises.push(
          ...formData.equipamiento.botas.map(async (botas) => {
            await apiService.createEquipamientoBotas(brigadaId, botas);
            equipamientoGuardado++;
            toast.update(toastId, {
              render: `Guardando equipamiento... (${equipamientoGuardado}/${totalItems})`,
              type: "info",
              isLoading: true
            });
          })
        );
      }

      // Guantes
      if (formData.equipamiento.guantes.length > 0) {
        equipamientoPromises.push(
          ...formData.equipamiento.guantes.map(async (guantes) => {
            await apiService.createEquipamientoGuantes(brigadaId, guantes);
            equipamientoGuardado++;
            toast.update(toastId, {
              render: `Guardando equipamiento... (${equipamientoGuardado}/${totalItems})`,
              type: "info",
              isLoading: true
            });
          })
        );
      }

      // EPP
      if (formData.equipamiento.epp.length > 0) {
        equipamientoPromises.push(
          ...formData.equipamiento.epp.map(async (epp) => {
            await apiService.createEquipamientoEPPData(brigadaId, epp);
            equipamientoGuardado++;
            toast.update(toastId, {
              render: `Guardando equipamiento... (${equipamientoGuardado}/${totalItems})`,
              type: "info",
              isLoading: true
            });
          })
        );
      }

      // Herramientas
      if (formData.equipamiento.herramientas.length > 0) {
        equipamientoPromises.push(
          ...formData.equipamiento.herramientas.map(async (herramienta) => {
            await apiService.createHerramientasData(brigadaId, herramienta);
            equipamientoGuardado++;
            toast.update(toastId, {
              render: `Guardando equipamiento... (${equipamientoGuardado}/${totalItems})`,
              type: "info",
              isLoading: true
            });
          })
        );
      }

      // Logística vehículos
      if (formData.equipamiento.logistica_vehiculos.length > 0) {
        equipamientoPromises.push(
          ...formData.equipamiento.logistica_vehiculos.map(async (logistica) => {
            await apiService.createLogisticaVehiculos(brigadaId, logistica);
            equipamientoGuardado++;
            toast.update(toastId, {
              render: `Guardando equipamiento... (${equipamientoGuardado}/${totalItems})`,
              type: "info",
              isLoading: true
            });
          })
        );
      }

      // Alimentación
      if (formData.equipamiento.alimentacion.length > 0) {
        equipamientoPromises.push(
          ...formData.equipamiento.alimentacion.map(async (alimentacion) => {
            await apiService.createAlimentacionData(brigadaId, alimentacion);
            equipamientoGuardado++;
            toast.update(toastId, {
              render: `Guardando equipamiento... (${equipamientoGuardado}/${totalItems})`,
              type: "info",
              isLoading: true
            });
          })
        );
      }

      // Equipo campo
      if (formData.equipamiento.equipo_campo.length > 0) {
        equipamientoPromises.push(
          ...formData.equipamiento.equipo_campo.map(async (equipoCampo) => {
            await apiService.createEquipoCampoData(brigadaId, equipoCampo);
            equipamientoGuardado++;
            toast.update(toastId, {
              render: `Guardando equipamiento... (${equipamientoGuardado}/${totalItems})`,
              type: "info",
              isLoading: true
            });
          })
        );
      }

      // Limpieza personal
      if (formData.equipamiento.limpieza_personal.length > 0) {
        equipamientoPromises.push(
          ...formData.equipamiento.limpieza_personal.map(async (limpiezaPersonal) => {
            await apiService.createLimpiezaPersonalData(brigadaId, limpiezaPersonal);
            equipamientoGuardado++;
            toast.update(toastId, {
              render: `Guardando equipamiento... (${equipamientoGuardado}/${totalItems})`,
              type: "info",
              isLoading: true
            });
          })
        );
      }

      // Limpieza general
      if (formData.equipamiento.limpieza_general.length > 0) {
        equipamientoPromises.push(
          ...formData.equipamiento.limpieza_general.map(async (limpiezaGeneral) => {
            await apiService.createLimpiezaGeneralData(brigadaId, limpiezaGeneral);
            equipamientoGuardado++;
            toast.update(toastId, {
              render: `Guardando equipamiento... (${equipamientoGuardado}/${totalItems})`,
              type: "info",
              isLoading: true
            });
          })
        );
      }

      // Medicamentos
      if (formData.equipamiento.medicamentos.length > 0) {
        equipamientoPromises.push(
          ...formData.equipamiento.medicamentos.map(async (medicamento) => {
            await apiService.createMedicamentosData(brigadaId, medicamento);
            equipamientoGuardado++;
            toast.update(toastId, {
              render: `Guardando equipamiento... (${equipamientoGuardado}/${totalItems})`,
              type: "info",
              isLoading: true
            });
          })
        );
      }

      // Rescate animal
      if (formData.equipamiento.rescate_animal.length > 0) {
        equipamientoPromises.push(
          ...formData.equipamiento.rescate_animal.map(async (rescateAnimal) => {
            await apiService.createRescateAnimalData(brigadaId, rescateAnimal);
            equipamientoGuardado++;
            toast.update(toastId, {
              render: `Guardando equipamiento... (${equipamientoGuardado}/${totalItems})`,
              type: "info",
              isLoading: true
            });
          })
        );
      }

      // Ejecutar todas las promesas
      await Promise.all(equipamientoPromises);

      console.log('✅ Todo el equipamiento guardado exitosamente');
      
      toast.update(toastId, {
        render: `¡Formulario guardado exitosamente! ${totalItems} items de equipamiento registrados.`,
        type: "success",
        isLoading: false,
        autoClose: 3000
      });
    }
    
    setShowSuccessAnimation(true);
    setTimeout(() => {
      setShowSuccessAnimation(false);
      setCurrentView('board');
      loadBrigadas();
    }, 2000);

  } catch (error) {
    console.error('❌ Error submitting form:', error);
    const errorMessage = `Error al guardar el formulario: ${error.message}`;
    setError(errorMessage);
    
    toast.update(toastId, {
      render: errorMessage,
      type: "error",
      isLoading: false,
      autoClose: 5000
    });
  } finally {
    setLoading(false);
  }
}, [formData, selectedBrigada, isEditMode, loadBrigadas]);



  const handleDeleteBrigada = useCallback(async (id) => {
  if (window.confirm('¿Estás seguro de que deseas eliminar esta brigada?')) {
    const toastId = toast.loading("Eliminando brigada...", {
      position: "top-right"
    });

    try {
      console.log('🗑️ Eliminando brigada:', id);
      const response = await apiService.deleteBrigada(id);
      console.log('✅ Brigada eliminada:', response);
      
      toast.update(toastId, {
        render: "Brigada eliminada exitosamente",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });
      
      await loadBrigadas();
    } catch (error) {
      console.error('❌ Error deleting brigada:', error);
      const errorMessage = `Error al eliminar la brigada: ${error.message}`;
      setError(errorMessage);
      
      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 5000
      });
    }
  }
}, [loadBrigadas]);

  const handleEditBrigada = useCallback((brigada) => {
  setSelectedBrigada(brigada);
  setFormData({
    brigada: {
      NombreBrigada: brigada.nombre_brigada || '',
      CantidadBomberosActivos: brigada.cantidad_bomberos_activos || '',
      ContactoCelularComandante: brigada.contacto_celular_comandante || '',
      EncargadoLogistica: brigada.encargado_logistica || '',
      ContactoCelularLogistica: brigada.contacto_celular_logistica || '',
      NumeroEmergenciaPublico: brigada.numero_emergencia_publico || ''
    },
    equipamiento: {
      ropa: [],
      botas: [],
      guantes: [],
      epp: [],
      herramientas: [],
      logistica_vehiculos: [],
      alimentacion: [],
      equipo_campo: [],
      limpieza_personal: [],
      limpieza_general: [],
      medicamentos: [],
      rescate_animal: []
    }
  });
  setCurrentStep(0);
  setIsEditMode(true);
  setCurrentView('form');
  console.log('✏️ Editando brigada:', brigada);
  
  // Toast de información
  Toast.info(`Editando brigada: ${brigada.nombre_brigada}`);
}, []);


  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const updateFormData = useCallback((section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  }, []);

  const onSelectBrigada = useCallback((brigada) => {
    setSelectedBrigada(brigada);
    if (brigada) {
      setFormData({
        brigada: {
          NombreBrigada: brigada.nombre_brigada || '',
          CantidadBomberosActivos: brigada.cantidad_bomberos_activos || '',
          ContactoCelularComandante: brigada.contacto_celular_comandante || '',
          EncargadoLogistica: brigada.encargado_logistica || '',
          ContactoCelularLogistica: brigada.contacto_celular_logistica || '',
          NumeroEmergenciaPublico: brigada.numero_emergencia_publico || ''
        },
        equipamiento: {
          ropa: [],
          botas: [],
          guantes: [],
          epp: [],
          herramientas: [],
          logistica_vehiculos: [],
          alimentacion: [],
          equipo_campo: [],
          limpieza_personal: [],
          limpieza_general: [],
          medicamentos: [],
          rescate_animal: []
        }
      });
    } else {
      // Limpiar los campos si es nueva brigada
      setFormData({
        brigada: {
          NombreBrigada: '',
          CantidadBomberosActivos: '',
          ContactoCelularComandante: '',
          EncargadoLogistica: '',
          ContactoCelularLogistica: '',
          NumeroEmergenciaPublico: ''
        },
        equipamiento: {
          ropa: [],
          botas: [],
          guantes: [],
          epp: [],
          herramientas: [],
          logistica_vehiculos: [],
          alimentacion: [],
          equipo_campo: [],
          limpieza_personal: [],
          limpieza_general: [],
          medicamentos: [],
          rescate_animal: []
        }
      });
    }
  }, []);

  // Render principal - SOLO RENDERIZA COMPONENTES, NO LOS DEFINE
  return (
    <div className="app">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        isExpanded={sidebarExpanded}
        setIsExpanded={setSidebarExpanded}
      />
      
      <main className={`main-content ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        {currentView === 'home' && (
          <HomeView 
            brigadas={brigadas} 
            handleCreateForm={handleCreateForm} 
          />
        )}
        
        {currentView === 'board' && (
          <BoardView 
            loading={loading}
            error={error}
            brigadas={brigadas}
            handleCreateForm={handleCreateForm}
            loadBrigadas={loadBrigadas}
            handleEditBrigada={handleEditBrigada}
            handleDeleteBrigada={handleDeleteBrigada}
            setDetalleBrigada={setDetalleBrigada}
            setMostrarModal={setMostrarModal}
            obtenerEquipamientoCompleto={obtenerEquipamientoCompleto}
          />
        )}
        
        {currentView === 'form' && (
          <FormView 
            currentStep={currentStep}
            steps={steps}
            formData={formData}
            selectedBrigada={selectedBrigada}
            updateFormData={updateFormData}
            catalogos={catalogos}
            setCurrentView={setCurrentView}
            prevStep={prevStep}
            nextStep={nextStep}
            handleSubmitForm={handleSubmitForm}
            loading={loading}
            brigadas={brigadas}
            onSelectBrigada={onSelectBrigada}
            isEditMode={isEditMode}
          />
        )}
        
        {currentView === 'trash' && (
          <div className="trash-container">
            <h1>Papelera</h1>
            <p>Elementos eliminados aparecerán aquí</p>
          </div>
        )}
      </main>
      
      {showSuccessAnimation && (
        <SuccessAnimation selectedBrigada={selectedBrigada} />
      )}

      {mostrarModal && detalleBrigada && (
  <ModalDetallesBrigada
    detalleBrigada={detalleBrigada}
    equipamiento={equipamiento}
    mostrar={mostrarModal}
    onClose={() => setMostrarModal(false)}
  />
)}



      <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      toastStyle={{
        fontSize: '14px',
        borderRadius: '8px'
      }}
    />
    </div>
  );




  
};

export default BomberosApp;



