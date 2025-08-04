import React, { useState } from 'react';
import { Plus, Minus, Eye, Edit, Save, X, Check } from 'lucide-react';

const FormularioNecesidades = () => {
  const [formData, setFormData] = useState({
    // Información básica
    nombreBrigada: '',
    cantidadBomberosActivos: '',
    contactoCelularComandante: '',
    encargadoLogistica: '',
    contactoCelularLogistica: '',
    numeroEmergenciaPublico: '',
    
    // EPP - Ropa (convertido a arrays)
    camisasForestales: [{ id: 1, xs: '', s: '', m: '', l: '', xl: '', observaciones: '' }],
    pantalonesForestales: [{ id: 1, xs: '', s: '', m: '', l: '', xl: '', observaciones: '' }],
    overolesFr: [{ id: 1, xs: '', s: '', m: '', l: '', xl: '', observaciones: '' }],
    
    // Calzado y guantes (convertido a arrays)
    botasBomberos: [{ id: 1, t37: '', t38: '', t39: '', t40: '', t41: '', t42: '', t43: '', otraTalla: '', observaciones: '' }],
    guantesCuero: [{ id: 1, xs: '', s: '', m: '', l: '', xl: '', xxl: '', otraTalla: '', observaciones: '' }],
    
    // Equipamiento EPP (convertido a arrays)
    esclavinas: [{ id: 1, cantidad: '', observaciones: '' }],
    linternas: [{ id: 1, cantidad: '', observaciones: '' }],
    antiparras: [{ id: 1, cantidad: '', observaciones: '' }],
    cascosForestales: [{ id: 1, cantidad: '', observaciones: '' }],
    mascarasPolvo: [{ id: 1, cantidad: '', observaciones: '' }],
    mascarasMediaCara: [{ id: 1, cantidad: '', observaciones: '' }],
    
    // Herramientas dinámicas (sin cambios)
    herramientas: [
      { id: 1, nombre: 'Linternas de Cabeza', cantidad: '', observaciones: '' },
      { id: 2, nombre: 'Pilas AA', cantidad: '', observaciones: '' },
      { id: 3, nombre: 'Pilas AAA', cantidad: '', observaciones: '' },
      { id: 4, nombre: 'Azadón', cantidad: '', observaciones: '' },
      { id: 5, nombre: 'Pala con Mango de Fibra', cantidad: '', observaciones: '' }
    ],
    
    // Logística dinámica (sin cambios)
    logistica: [
      { id: 1, nombre: 'Gasolina', cantidad: '', observaciones: '' },
      { id: 2, nombre: 'Diésel', cantidad: '', observaciones: '' },
      { id: 3, nombre: 'Amortiguadores', cantidad: '', observaciones: '' }
    ],
    
    // Alimentación dinámica (sin cambios)
    alimentacion: [
      { id: 1, nombre: 'Agua', cantidad: '', observaciones: '' },
      { id: 2, nombre: 'Rehidratantes', cantidad: '', observaciones: '' },
      { id: 3, nombre: 'Barras Energizantes', cantidad: '', observaciones: '' }
    ],
    
    // Limpieza dinámica (sin cambios)
    limpieza: [
      { id: 1, nombre: 'Shampoo', cantidad: '', observaciones: '' },
      { id: 2, nombre: 'Jaboncillos', cantidad: '', observaciones: '' }
    ],
    
    // Medicamentos dinámicos (sin cambios)
    medicamentos: [
      { id: 1, nombre: 'Agua Destilada 5 ML', cantidad: '', observaciones: '' },
      { id: 2, nombre: 'Alcohol', cantidad: '', observaciones: '' }
    ]
  });

  const [showPreview, setShowPreview] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Nuevo estado para la carga de envío

  // Funciones CRUD para listas dinámicas
  const addItem = (listName, initialData) => {
    const newId = formData[listName].length > 0 
      ? Math.max(...formData[listName].map(item => item.id)) + 1 
      : 1;
    
    setFormData(prev => ({
      ...prev,
      [listName]: [...prev[listName], { 
        id: newId, 
        ...initialData 
      }]
    }));
  };

  const removeItem = (listName, id) => {
    if (formData[listName].length <= 1) {
      alert(`Debe mantener al menos un elemento en ${listName}`);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].filter(item => item.id !== id)
    }));
  };

  const updateItem = (listName, id, field, value) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' && prev[section] !== null
        ? { ...prev[section], [field]: value }
        : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombreBrigada) newErrors.nombreBrigada = 'Nombre de brigada es requerido';
    if (!formData.cantidadBomberosActivos) newErrors.cantidadBomberosActivos = 'Cantidad de bomberos es requerida';
    if (!formData.contactoCelularComandante) newErrors.contactoCelularComandante = 'Contacto del comandante es requerido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setIsSubmitting(true); // Activar el estado de carga
      
      // Simulamos el envío a la API con un setTimeout
      setTimeout(() => {
        console.log('Datos del formulario:', formData);
        setIsSubmitting(false);
        alert('Formulario enviado correctamente');
        setShowPreview(false);
      }, 2000);
    }
  };

  const renderBasicInput = (label, key, placeholder = '', required = false) => (
    <div className="form-group">
      <label>{label} {required && <span className="required">*</span>}</label>
      <input
        type="text"
        value={formData[key] || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
        placeholder={placeholder}
        className={errors[key] ? 'error' : ''}
      />
      {errors[key] && <span className="error-message">{errors[key]}</span>}
    </div>
  );

  // Renderiza una sección de tallas con CRUD
  const renderSizeInputsWithCRUD = (listName, title, sizes) => (
    <div className="epp-item">
      <div className="section-header">
        <h3>{title}</h3>
        <button 
          type="button" 
          className="add-button"
          onClick={() => addItem(listName, Object.fromEntries(
  sizes.map(size => [size, '']).concat([['observaciones', '']])
))}
>
          <Plus size={16} /> Agregar
        </button>
      </div>
      
      {formData[listName].map((item, index) => (
        <div key={item.id} className="size-item-with-crud">
          <div className="item-number">{index + 1}</div>
          <div className="size-inputs">
            {sizes.map(size => (
              <div key={size} className="size-input">
                <label>{size.toUpperCase()}</label>
                <input
                  type="number"
                  value={item[size]}
                  onChange={(e) => updateItem(listName, item.id, size, e.target.value)}
                />
              </div>
            ))}
            <div className="observations-input">
              <label>Observaciones</label>
              <input
                type="text"
                value={item.observaciones}
                onChange={(e) => updateItem(listName, item.id, 'observaciones', e.target.value)}
              />
            </div>
          </div>
          <button 
            type="button" 
            className="remove-button"
            onClick={() => removeItem(listName, item.id)}
          >
            <Minus size={16} />
          </button>
        </div>
      ))}
    </div>
  );

  // Renderiza una sección de cantidad con CRUD
  const renderQuantityInputWithCRUD = (listName, title) => (
    <div className="epp-item">
      <div className="section-header">
        <h3>{title}</h3>
        <button 
          type="button" 
          className="add-button"
          onClick={() => addItem(listName, { cantidad: '', observaciones: '' })}
        >
          <Plus size={16} /> Agregar
        </button>
      </div>
      
      {formData[listName].map((item, index) => (
        <div key={item.id} className="quantity-item-with-crud">
          <div className="item-number">{index + 1}</div>
          <div className="quantity-obs-group">
            <input
              type="number"
              value={item.cantidad}
              onChange={(e) => updateItem(listName, item.id, 'cantidad', e.target.value)}
              placeholder="Cantidad"
            />
            <input
              type="text"
              value={item.observaciones}
              onChange={(e) => updateItem(listName, item.id, 'observaciones', e.target.value)}
              placeholder="Observaciones"
            />
          </div>
          <button 
            type="button" 
            className="remove-button"
            onClick={() => removeItem(listName, item.id)}
          >
            <Minus size={16} />
          </button>
        </div>
      ))}
    </div>
  );

  const renderDynamicList = (listName, title) => (
    <div className="dynamic-section">
      <div className="section-header">
        <h3>{title}</h3>
        <button 
          type="button" 
          className="add-button"
          onClick={() => addItem(listName, { nombre: '', cantidad: '', observaciones: '' })}
        >
          <Plus size={16} /> Agregar {title.slice(0, -1)}
        </button>
      </div>
      
      {formData[listName].map((item, index) => (
        <div key={item.id} className="dynamic-item">
          <div className="item-number">{index + 1}</div>
          <input
            type="text"
            value={item.nombre}
            onChange={(e) => updateItem(listName, item.id, 'nombre', e.target.value)}
            placeholder="Nombre del item"
            className="item-name"
          />
          <input
            type="number"
            value={item.cantidad}
            onChange={(e) => updateItem(listName, item.id, 'cantidad', e.target.value)}
            placeholder="Cantidad"
            className="item-quantity"
          />
          <input
            type="text"
            value={item.observaciones}
            onChange={(e) => updateItem(listName, item.id, 'observaciones', e.target.value)}
            placeholder="Observaciones"
            className="item-observations"
          />
          <button 
            type="button" 
            className="remove-button"
            onClick={() => removeItem(listName, item.id)}
          >
            <Minus size={16} />
          </button>
        </div>
      ))}
    </div>
  );

  const renderPreview = () => (
    <div className="preview-container">
      <div className="preview-header">
        <h2>Vista Previa del Formulario</h2>
        <div className="preview-actions">
          <button 
            className="edit-button"
            onClick={() => setShowPreview(false)}
          >
            <Edit size={16} /> Editar
          </button>
          <button 
            className="submit-button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="spinner"></div> Enviando...
              </>
            ) : (
              <>
                <Check size={16} /> Confirmar y Enviar
              </>
            )}
          </button>
        </div>
      </div>

      <div className="preview-content">
        <div className="preview-section">
          <h3>Información Básica</h3>
          <p><strong>Brigada:</strong> {formData.nombreBrigada}</p>
          <p><strong>Bomberos Activos:</strong> {formData.cantidadBomberosActivos}</p>
          <p><strong>Comandante:</strong> {formData.contactoCelularComandante}</p>
          <p><strong>Logística:</strong> {formData.encargadoLogistica}</p>
        </div>

        <div className="preview-section">
          <h3>Resumen de Necesidades</h3>
          <div className="preview-lists">
            {['herramientas', 'logistica', 'alimentacion', 'limpieza', 'medicamentos'].map(listName => (
              <div key={listName} className="preview-list">
                <h4>{listName.charAt(0).toUpperCase() + listName.slice(1)}</h4>
                {formData[listName].filter(item => item.nombre || item.cantidad).map(item => (
                  <div key={item.id} className="preview-item">
                    <span>{item.nombre}</span>
                    <span>Cantidad: {item.cantidad}</span>
                    {item.observaciones && <span>Obs: {item.observaciones}</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (showPreview) {
    return renderPreview();
  }

  return (
    <div className="formulario-container">
      <div className="form-header">
        <h1>Formulario de Recopilación de Necesidades - Bomberos Forestales</h1>
        <div className="form-actions">
          <button 
            type="button" 
            className="preview-button"
            onClick={() => setShowPreview(true)}
          >
            <Eye size={16} /> Vista Previa
          </button>
        </div>
      </div>
      
      <div className="form-container">
        {/* Información Básica */}
        <section className="form-section">
          <h2>Información Básica de la Brigada</h2>
          {renderBasicInput('Nombre de la Brigada', 'nombreBrigada', '', true)}
          {renderBasicInput('Cantidad de Bomberos Activos', 'cantidadBomberosActivos', '', true)}
          {renderBasicInput('Contacto Celular Comandante', 'contactoCelularComandante', '', true)}
          {renderBasicInput('Encargado de Logística', 'encargadoLogistica')}
          {renderBasicInput('Contacto Celular Logística', 'contactoCelularLogistica')}
          {renderBasicInput('Número de Emergencia Público', 'numeroEmergenciaPublico')}
        </section>

        {/* EPP - Ropa */}
        <section className="form-section">
          <h2>Equipamiento EPP - Ropa</h2>
          {renderSizeInputsWithCRUD('camisasForestales', 'Camisa Forestal', ['xs', 's', 'm', 'l', 'xl'])}
          {renderSizeInputsWithCRUD('pantalonesForestales', 'Pantalón Forestal', ['xs', 's', 'm', 'l', 'xl'])}
          {renderSizeInputsWithCRUD('overolesFr', 'Overol FR', ['xs', 's', 'm', 'l', 'xl'])}
        </section>

        {/* Calzado */}
        <section className="form-section">
          <h2>Calzado y Guantes</h2>
          {renderSizeInputsWithCRUD('botasBomberos', 'Botas para Bomberos Forestales', ['t37', 't38', 't39', 't40', 't41', 't42', 't43', 'otraTalla'])}
          {renderSizeInputsWithCRUD('guantesCuero', 'Guantes de Cuero', ['xs', 's', 'm', 'l', 'xl', 'xxl', 'otraTalla'])}
        </section>

        {/* Equipamiento EPP */}
        <section className="form-section">
          <h2>Equipamiento EPP</h2>
          {renderQuantityInputWithCRUD('esclavinas', 'Esclavina')}
          {renderQuantityInputWithCRUD('linternas', 'Linterna')}
          {renderQuantityInputWithCRUD('antiparras', 'Antiparra')}
          {renderQuantityInputWithCRUD('cascosForestales', 'Casco Forestal Ala Ancha')}
          {renderQuantityInputWithCRUD('mascarasPolvo', 'Máscara para Polvo y Partículas')}
          {renderQuantityInputWithCRUD('mascarasMediaCara', 'Máscara Media Cara')}
        </section>

        {/* Secciones Dinámicas */}
        <section className="form-section">
          <h2>Herramientas</h2>
          {renderDynamicList('herramientas', 'Herramientas')}
        </section>

        <section className="form-section">
          <h2>Logística - Repuestos y Combustible</h2>
          {renderDynamicList('logistica', 'Logística')}
        </section>

        <section className="form-section">
          <h2>Alimentación y Bebidas</h2>
          {renderDynamicList('alimentacion', 'Alimentación')}
        </section>

        <section className="form-section">
          <h2>Limpieza</h2>
          {renderDynamicList('limpieza', 'Limpieza')}
        </section>

        <section className="form-section">
          <h2>Medicamentos</h2>
          {renderDynamicList('medicamentos', 'Medicamentos')}
        </section>

        <div className="form-footer">
          <button 
            type="button" 
            className="preview-button"
            onClick={() => setShowPreview(true)}
          >
            <Eye size={16} /> Vista Previa
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormularioNecesidades;