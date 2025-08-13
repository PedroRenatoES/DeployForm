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
  FileText
} from 'lucide-react';
import '../components/BomberosApp.css';
import apiService from '../../services/api'; 

// ✅ TODOS LOS COMPONENTES FUERA DEL COMPONENTE PRINCIPAL

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
        Nuevo Formulario
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
                onClick={() => {
                  if (!brigada?.id) {
                    console.warn("❗ brigada.id no está definido");
                    return;
                  }

                  fetch(`/api/brigadas/${brigada.id}`)
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
              </button>

              <button 
                className="action-btn edit" 
                title="Editar"
                onClick={() => handleEditBrigada(brigada)}
              >
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






// Componente de Step 0 - Información General
const InformacionGeneralStep = memo(({ formData, selectedBrigada, updateFormData }) => (
  <div className="form-step">
    <div className="step-header">
      <h2>{selectedBrigada ? 'Editar Brigada' : 'Datos de la Brigada'}</h2>
      <p>Proporciona los datos básicos de la brigada de bomberos forestales</p>
    </div>
    
    <div className="form-grid">
      <div className="form-group">
        <label>Nombre de la Brigada *</label>
        <input
          type="text"
          className="form-input"
          value={formData.brigada.NombreBrigada}
          onChange={(e) => updateFormData('brigada', 'NombreBrigada', e.target.value)}
          placeholder="Ej: Brigada Forestal Central"
          maxLength={80}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Cantidad de Bomberos Activos</label>
        <input
          type="number"
          className="form-input"
          value={formData.brigada.CantidadBomberosActivos}
          onChange={(e) => updateFormData('brigada', 'CantidadBomberosActivos', e.target.value)}
          placeholder="Ej: 25"
          min="0"
        />
      </div>
      
      <div className="form-group">
        <label>Contacto Celular del Comandante</label>
        <input
          type="tel"
          className="form-input"
          value={formData.brigada.ContactoCelularComandante}
          onChange={(e) => {
            const onlyNumbers = e.target.value.replace(/\D/g, ''); // Elimina todo lo que no sea número
            if (onlyNumbers.length <= 15) {
              updateFormData('brigada', 'ContactoCelularComandante', onlyNumbers);
            }
          }}
          placeholder="Ej: 59171234567"
          maxLength={15}
          inputMode="numeric"
          pattern="\d*"
        />
      </div>

      
      <div className="form-group">
        <label>Encargado de Logística</label>
        <input
          type="text"
          className="form-input"
          value={formData.brigada.EncargadoLogistica}
          onChange={(e) => updateFormData('brigada', 'EncargadoLogistica', e.target.value)}
          placeholder="Nombre del encargado de logística"
          maxLength={60}
        />
      </div>
      
      <div className="form-group">
        <label>Contacto Celular de Logística</label>
        <input
          type="tel"
          className="form-input"
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
        />
      </div>

      
      <div className="form-group">
        <label>Número de Emergencia Público</label>
        <input
          type="tel"
          className="form-input"
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
        />
      </div>

    </div>
  </div>
));

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
        
        <div className="form-row">
          <div className="form-group">
            <label>Cantidad XS</label>
            <input
              type="number"
              className="form-input"
              value={ropaCantidades.CantidadXS}
              onChange={(e) => setRopaCantidades({...ropaCantidades, CantidadXS: parseInt(e.target.value) || 0})}
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Cantidad S</label>
            <input
              type="number"
              className="form-input"
              value={ropaCantidades.CantidadS}
              onChange={(e) => setRopaCantidades({...ropaCantidades, CantidadS: parseInt(e.target.value) || 0})}
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Cantidad M</label>
            <input
              type="number"
              className="form-input"
              value={ropaCantidades.CantidadM}
              onChange={(e) => setRopaCantidades({...ropaCantidades, CantidadM: parseInt(e.target.value) || 0})}
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Cantidad L</label>
            <input
              type="number"
              className="form-input"
              value={ropaCantidades.CantidadL}
              onChange={(e) => setRopaCantidades({...ropaCantidades, CantidadL: parseInt(e.target.value) || 0})}
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Cantidad XL</label>
            <input
              type="number"
              className="form-input"
              value={ropaCantidades.CantidadXL}
              onChange={(e) => setRopaCantidades({...ropaCantidades, CantidadXL: parseInt(e.target.value) || 0})}
              min="0"
            />
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
          <div className="form-row">
            {['37', '38', '39', '40', '41', '42', '43'].map(talla => (
              <div key={talla} className="form-group">
                <label>Talla {talla}</label>
                <input
                  type="number"
                  className="form-input"
                  value={botasCantidades[`Talla${talla}`]}
                  onChange={(e) => setBotasCantidades({...botasCantidades, [`Talla${talla}`]: parseInt(e.target.value) || 0})}
                  min="0"
                />
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
              <input
                type="number"
                className="form-input"
                value={botasCantidades.CantidadOtraTalla}
                onChange={(e) => {
                  const valor = parseInt(e.target.value) || 0;
                  
                  // Si hay una talla especificada, la cantidad mínima es 1
                  if (botasCantidades.OtraTalla && botasCantidades.OtraTalla !== '') {
                    setBotasCantidades({
                      ...botasCantidades, 
                      CantidadOtraTalla: valor === 0 ? 1 : valor
                    });
                  } else {
                    // Si no hay talla, permitir 0
                    setBotasCantidades({
                      ...botasCantidades, 
                      CantidadOtraTalla: valor
                    });
                  }
                }}
                min={botasCantidades.OtraTalla && botasCantidades.OtraTalla !== '' ? "1" : "0"}
                disabled={!botasCantidades.OtraTalla || botasCantidades.OtraTalla === ''}
              />
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
  <div className="form-row">
    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(talla => (
      <div key={talla} className="form-group">
        <label>Talla {talla}</label>
        <input
          type="number"
          className="form-input"
          value={guantesCantidades[`Talla${talla}`]}
          onChange={(e) => setGuantesCantidades({...guantesCantidades, [`Talla${talla}`]: parseInt(e.target.value) || 0})}
          min="0"
        />
      </div>
    ))}
  </div>
  
  <div className="form-row">
    <div className="form-group">
      <label>Otra Talla</label>
      <input
        type="text"
        className="form-input"
        value={guantesCantidades.OtraTalla}
        onChange={(e) => {
          const soloLetras = e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 5); // solo letras, máx 3
          setGuantesCantidades({ 
            ...guantesCantidades, 
            OtraTalla: soloLetras.toUpperCase(),
            // Si se borra la talla, resetear la cantidad también
            CantidadOtraTalla: soloLetras === '' ? 0 : guantesCantidades.CantidadOtraTalla = 1
          });
        }}
        placeholder="Ej: XXL"
        maxLength={5}
      />
    </div>

    <div className="form-group">
      <label>Cantidad Otra Talla</label>
      <input
        type="number"
        className="form-input"
        value={guantesCantidades.CantidadOtraTalla}
        onChange={(e) => {
          const valor = parseInt(e.target.value) || 0;
          
          // Si hay una talla especificada, la cantidad mínima es 1
          if (guantesCantidades.OtraTalla && guantesCantidades.OtraTalla !== '') {
            setGuantesCantidades({
              ...guantesCantidades, 
              CantidadOtraTalla: valor === 0 ? 1 : valor
            });
          } else {
            // Si no hay talla, permitir 0
            setGuantesCantidades({
              ...guantesCantidades, 
              CantidadOtraTalla: valor
            });
          }
        }}
        min={guantesCantidades.OtraTalla && guantesCantidades.OtraTalla !== '' ? "1" : "0"}
        disabled={!guantesCantidades.OtraTalla || guantesCantidades.OtraTalla === ''}
      />
    </div>
  </div>
  
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
    if (!selectedItem) return;
    
    const nuevoItem = {
      [idField]: parseInt(selectedItem),
      Cantidad: cantidad,
      ...(showMonto && { MontoAproximado: monto }),
      Observaciones: observaciones
    };
    
    const nuevosItems = [...equipamientoItems, nuevoItem];
    updateFormData('equipamiento', equipamientoKey, nuevosItems);
    
    // Reset form
    setSelectedItem('');
    setCantidad(0);
    setMonto(0);
    setObservaciones('');
  }, [selectedItem, cantidad, monto, observaciones, equipamientoItems, updateFormData, equipamientoKey, idField, showMonto]);

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
          <input
            type="number"
            className="form-input"
            value={cantidad}
            onChange={(e) => setCantidad(parseInt(e.target.value) || 0)}
            min="0"
          />
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
  loading 
}) => (
  <div className="form-container">
    <ProgressBar currentStep={currentStep} steps={steps} />
    
    <div className="form-content">
      {currentStep === 0 && (
        <InformacionGeneralStep 
          formData={formData}
          selectedBrigada={selectedBrigada}
          updateFormData={updateFormData}
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
            {loading ? 'Guardando...' : (selectedBrigada ? 'Actualizar' : 'Guardar Formulario')}
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

    await Promise.all(
      categorias.map(async (categoria) => {
        try {
          const res = await fetch(`/api/equipamiento/${brigadaId}/${categoria}`);
          if (!res.ok) throw new Error(`Error en ${categoria}`);

          const data = await res.json();
          resultados[categoria] = data?.data || [];
        } catch (error) {
          console.warn(`❌ Fallo al cargar ${categoria}:`, error);
          resultados[categoria] = [];
        }
      })
    );

    setEquipamiento(resultados);
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
      } else if (Array.isArray(response)) {
        setBrigadas(response);
        console.log('✅ Brigadas cargadas (array directo):', response);
      } else {
        console.warn('⚠️ Estructura de respuesta inesperada:', response);
        setBrigadas([]);
      }
    } catch (error) {
      console.error('❌ Error loading brigadas:', error);
      setError(`Error al cargar las brigadas: ${error.message}`);
      setBrigadas([]);
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
    } catch (error) {
      console.error('❌ Error loading catalogos:', error);
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
    setCurrentView('form');
  }, []);

  const handleSubmitForm = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const brigadaData = {
        NombreBrigada: formData.brigada.NombreBrigada,
        CantidadBomberosActivos: parseInt(formData.brigada.CantidadBomberosActivos) || 0,
        ContactoCelularComandante: formData.brigada.ContactoCelularComandante,
        EncargadoLogistica: formData.brigada.EncargadoLogistica,
        ContactoCelularLogistica: formData.brigada.ContactoCelularLogistica,
        NumeroEmergenciaPublico: formData.brigada.NumeroEmergenciaPublico
      };

      console.log('💾 Guardando brigada:', brigadaData);
      let brigadaResponse;
      let brigadaId;

      if (selectedBrigada) {
        brigadaResponse = await apiService.updateBrigada(selectedBrigada.id, brigadaData);
        brigadaId = selectedBrigada.id;
      } else {
        brigadaResponse = await apiService.createBrigada(brigadaData);
        brigadaId = brigadaResponse.data?.id;
      }

      console.log('✅ Brigada guardada:', brigadaResponse);

      // Guardar equipamiento si existe brigadaId
      if (brigadaId) {
        console.log('💾 Guardando equipamiento para brigada:', brigadaId);
        
        // Guardar ropa
        for (const ropa of formData.equipamiento.ropa) {
          await apiService.createEquipamientoRopa(brigadaId, ropa);
        }

        // Guardar botas
        for (const botas of formData.equipamiento.botas) {
          await apiService.createEquipamientoBotas(brigadaId, botas);
        }

        // Guardar guantes
        for (const guantes of formData.equipamiento.guantes) {
          await apiService.createEquipamientoGuantes(brigadaId, guantes);
        }

        // Guardar EPP
        for (const epp of formData.equipamiento.epp) {
          await apiService.createEquipamientoEPPData(brigadaId, epp);
        }

        // Guardar herramientas
        for (const herramienta of formData.equipamiento.herramientas) {
          await apiService.createHerramientasData(brigadaId, herramienta);
        }

        // Guardar logística vehículos
        for (const logistica of formData.equipamiento.logistica_vehiculos) {
          await apiService.createLogisticaVehiculos(brigadaId, logistica);
        }

        // Guardar alimentación
        for (const alimentacion of formData.equipamiento.alimentacion) {
          await apiService.createAlimentacionData(brigadaId, alimentacion);
        }

        // Guardar equipo campo
        for (const equipoCampo of formData.equipamiento.equipo_campo) {
          await apiService.createEquipoCampoData(brigadaId, equipoCampo);
        }

        // Guardar limpieza personal
        for (const limpiezaPersonal of formData.equipamiento.limpieza_personal) {
          await apiService.createLimpiezaPersonalData(brigadaId, limpiezaPersonal);
        }

        // Guardar limpieza general
        for (const limpiezaGeneral of formData.equipamiento.limpieza_general) {
          await apiService.createLimpiezaGeneralData(brigadaId, limpiezaGeneral);
        }

        // Guardar medicamentos
        for (const medicamento of formData.equipamiento.medicamentos) {
          await apiService.createMedicamentosData(brigadaId, medicamento);
        }

        // Guardar rescate animal
        for (const rescateAnimal of formData.equipamiento.rescate_animal) {
          await apiService.createRescateAnimalData(brigadaId, rescateAnimal);
        }

        console.log('✅ Todo el equipamiento guardado exitosamente');
      }
      
      setShowSuccessAnimation(true);
      setTimeout(() => {
        setShowSuccessAnimation(false);
        setCurrentView('board');
        loadBrigadas();
      }, 2000);

    } catch (error) {
      console.error('❌ Error submitting form:', error);
      setError(`Error al guardar el formulario: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [formData, selectedBrigada, loadBrigadas]);

  const handleDeleteBrigada = useCallback(async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta brigada?')) {
      try {
        console.log('🗑️ Eliminando brigada:', id);
        const response = await apiService.deleteBrigada(id);
        console.log('✅ Brigada eliminada:', response);
        
        await loadBrigadas();
      } catch (error) {
        console.error('❌ Error deleting brigada:', error);
        setError(`Error al eliminar la brigada: ${error.message}`);
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
    setCurrentView('form');
    console.log('✏️ Editando brigada:', brigada);
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
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>🧾 Detalles de la Brigada</h2>

            <div className="brigada-info">
              <p><strong>📛 Nombre:</strong> {detalleBrigada.nombre_brigada}</p>
              <p><strong>🧑‍✈️ Comandante:</strong> {detalleBrigada.contacto_celular_comandante}</p>
              <p><strong>📦 Encargado de Logística:</strong> {detalleBrigada.encargado_logistica}</p>
              <p><strong>📞 Cel. Logística:</strong> {detalleBrigada.contacto_celular_logistica}</p>
              <p><strong>🚨 Tel. Emergencia:</strong> {detalleBrigada.numero_emergencia_publico}</p>
            </div>

            <hr />

            {/* Secciones de equipamiento */}
            {equipamiento?.ropa?.length > 0 && (
              <div className="cuadrilla">
                <h3>👕 Ropa</h3>
                {equipamiento.ropa.map((item, i) => (
                  <div key={i} className="cuadrilla-item">
                    <p><strong>Tipo:</strong> {item.tipo}</p>
                    <p>XS: {item.cantidad_xs}, S: {item.cantidad_s}, M: {item.cantidad_m}, L: {item.cantidad_l}, XL: {item.cantidad_xl}</p>
                  </div>
                ))}
              </div>
            )}

            {equipamiento?.botas?.length > 0 && (
              <div className="cuadrilla">
                <h3>🥾 Botas</h3>
                {equipamiento.botas.map((item, i) => (
                  <div key={i} className="cuadrilla-item">
                    <p>37: {item.talla_37}, 38: {item.talla_38}, 39: {item.talla_39}, 40: {item.talla_40}, 41: {item.talla_41}, 42: {item.talla_42}, 43: {item.talla_43}</p>
                    {item.otra_talla && (
                      <p>Otra talla ({item.otra_talla}): {item.cantidad_otra_talla}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {equipamiento?.guantes?.length > 0 && (
              <div className="cuadrilla">
                <h3>🧤 Guantes</h3>
                {equipamiento.guantes.map((item, i) => (
                  <div key={i} className="cuadrilla-item">
                    <p>XS: {item.talla_xs}, S: {item.talla_s}, M: {item.talla_m}, L: {item.talla_l}, XL: {item.talla_xl}, XXL: {item.talla_xxl}</p>
                    {item.otra_talla && (
                      <p>Otra talla ({item.otra_talla}): {item.cantidad_otra_talla}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {equipamiento?.epp?.length > 0 && (
              <div className="cuadrilla">
                <h3>🦺 Equipos EPP</h3>
                {equipamiento.epp.map((item, i) => (
                  <div key={i} className="cuadrilla-item">
                    <p><strong>Equipo:</strong> {item.tipo}</p>
                    <p>Cantidad: {item.cantidad}</p>
                  </div>
                ))}
              </div>
            )}

            {equipamiento?.herramientas?.length > 0 && (
              <div className="cuadrilla">
                <h3>🛠️ Herramientas</h3>
                {equipamiento.herramientas.map((item, i) => (
                  <div key={i} className="cuadrilla-item">
                    <p><strong>Herramienta:</strong> {item.nombre}</p>
                    <p>Cantidad: {item.cantidad}</p>
                  </div>
                ))}
              </div>
            )}

            {equipamiento?.['logistica-vehiculos']?.length > 0 && (
              <div className="cuadrilla">
                <h3>🚚 Logística - Vehículos</h3>
                {equipamiento['logistica-vehiculos'].map((item, i) => (
                  <div key={i} className="cuadrilla-item">
                    <p><strong>Servicio:</strong> {item.tipo}</p>
                    <p>Monto aproximado: Bs. {item.monto_aproximado}</p>
                  </div>
                ))}
              </div>
            )}

            {equipamiento?.alimentacion?.length > 0 && (
              <div className="cuadrilla">
                <h3>🍱 Alimentación y Bebidas</h3>
                {equipamiento.alimentacion.map((item, i) => (
                  <div key={i} className="cuadrilla-item">
                    <p><strong>Producto:</strong> {item.nombre}</p>
                    <p>Cantidad: {item.cantidad}</p>
                  </div>
                ))}
              </div>
            )}

            {equipamiento?.['equipo-campo']?.length > 0 && (
              <div className="cuadrilla">
                <h3>🎒 Equipos de Campo</h3>
                {equipamiento['equipo-campo'].map((item, i) => (
                  <div key={i} className="cuadrilla-item">
                    <p><strong>Equipo:</strong> {item.nombre}</p>
                    <p>Cantidad: {item.cantidad}</p>
                  </div>
                ))}
              </div>
            )}

            {equipamiento?.['limpieza-personal']?.length > 0 && (
              <div className="cuadrilla">
                <h3>🧼 Limpieza Personal</h3>
                {equipamiento['limpieza-personal'].map((item, i) => (
                  <div key={i} className="cuadrilla-item">
                    <p><strong>Producto:</strong> {item.nombre}</p>
                    <p>Cantidad: {item.cantidad}</p>
                  </div>
                ))}
              </div>
            )}

            {equipamiento?.['limpieza-general']?.length > 0 && (
              <div className="cuadrilla">
                <h3>🧽 Limpieza General</h3>
                {equipamiento['limpieza-general'].map((item, i) => (
                  <div key={i} className="cuadrilla-item">
                    <p><strong>Producto:</strong> {item.nombre}</p>
                    <p>Cantidad: {item.cantidad}</p>
                  </div>
                ))}
              </div>
            )}

            {equipamiento?.medicamentos?.length > 0 && (
              <div className="cuadrilla">
                <h3>💊 Medicamentos</h3>
                {equipamiento.medicamentos.map((item, i) => (
                  <div key={i} className="cuadrilla-item">
                    <p><strong>Medicamento:</strong> {item.nombre}</p>
                    <p>Cantidad: {item.cantidad}</p>
                  </div>
                ))}
              </div>
            )}

            {equipamiento?.['rescate-animal']?.length > 0 && (
              <div className="cuadrilla">
                <h3>🐾 Rescate Animal</h3>
                {equipamiento['rescate-animal'].map((item, i) => (
                  <div key={i} className="cuadrilla-item">
                    <p><strong>Producto:</strong> {item.nombre}</p>
                    <p>Cantidad: {item.cantidad}</p>
                  </div>
                ))}
              </div>
            )}

            <button className="modal-close" onClick={() => setMostrarModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BomberosApp;