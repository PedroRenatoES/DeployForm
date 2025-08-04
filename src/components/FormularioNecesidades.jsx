import React, { useState } from 'react';
import './FormularioNecesidades.css';

const FormularioNecesidades = () => {
  const [formData, setFormData] = useState({
    // Información básica
    nombreBrigada: '',
    cantidadBomberosActivos: '',
    contactoCelularComandante: '',
    encargadoLogistica: '',
    contactoCelularLogistica: '',
    numeroEmergenciaPublico: '',
    
    // EPP - Ropa
    camisaForestal: { xs: '', s: '', m: '', l: '', xl: '', observaciones: '' },
    pantalonForestal: { xs: '', s: '', m: '', l: '', xl: '', observaciones: '' },
    overolFr: { xs: '', s: '', m: '', l: '', xl: '', observaciones: '' },
    
    // Calzado y guantes
    botasBomberos: { t37: '', t38: '', t39: '', t40: '', t41: '', t42: '', t43: '', otraTalla: '', observaciones: '' },
    guantesCuero: { xs: '', s: '', m: '', l: '', xl: '', xxl: '', otraTalla: '', observaciones: '' },
    
    // Equipamiento EPP
    esclavina: { cantidad: '', observaciones: '' },
    linterna: { cantidad: '', observaciones: '' },
    antiparra: { cantidad: '', observaciones: '' },
    cascoForestal: { cantidad: '', observaciones: '' },
    mascaraPolvo: { cantidad: '', observaciones: '' },
    mascaraMediaCara: { cantidad: '', observaciones: '' },
    
    // Herramientas
    linternasCabeza: { cantidad: '', observaciones: '' },
    pilasAA: { cantidad: '', observaciones: '' },
    pilasAAA: { cantidad: '', observaciones: '' },
    azadon: { cantidad: '', observaciones: '' },
    palaMangoFibra: { cantidad: '', observaciones: '' },
    rastrilloMangoFibra: { cantidad: '', observaciones: '' },
    mcleodMangoFibra: { cantidad: '', observaciones: '' },
    batefuego: { cantidad: '', observaciones: '' },
    gorgui: { cantidad: '', observaciones: '' },
    pulaskyMangoFibra: { cantidad: '', observaciones: '' },
    quemadorGoteo: { cantidad: '', observaciones: '' },
    mochilaForestal: { cantidad: '', observaciones: '' },
    escobetaAlambre: { cantidad: '', observaciones: '' },
    
    // Logística - Repuestos vehículos
    gasolina: { cantidad: '', observaciones: '' },
    diesel: { cantidad: '', observaciones: '' },
    amortiguadores: { cantidad: '', observaciones: '' },
    prensaDisco: { cantidad: '', observaciones: '' },
    rectificacionFreno: { cantidad: '', observaciones: '' },
    llantas: { cantidad: '', observaciones: '' },
    aceiteMotor: { cantidad: '', observaciones: '' },
    grasa: { cantidad: '', observaciones: '' },
    cambioAceite: { cantidad: '', observaciones: '' },
    otroArreglo: { cantidad: '', observaciones: '' },
    
    // Alimentación y bebidas
    alimentosBebidas: { cantidad: '', observaciones: '' },
    agua: { cantidad: '', observaciones: '' },
    rehidratantes: { cantidad: '', observaciones: '' },
    barrasEnergizantes: { cantidad: '', observaciones: '' },
    lataAtun: { cantidad: '', observaciones: '' },
    lataFrejol: { cantidad: '', observaciones: '' },
    lataViandada: { cantidad: '', observaciones: '' },
    lataChorizo: { cantidad: '', observaciones: '' },
    refrescoSobres: { cantidad: '', observaciones: '' },
    lechePolvo: { cantidad: '', observaciones: '' },
    frutosSecos: { cantidad: '', observaciones: '' },
    pastillasMenta: { cantidad: '', observaciones: '' },
    alimentosNoPerecibles: { cantidad: '', observaciones: '' },
    
    // Logística y equipo de campo
    colchoneta: { cantidad: '', observaciones: '' },
    sleeping: { cantidad: '', observaciones: '' },
    camping: { cantidad: '', observaciones: '' },
    
    // Limpieza personal
    shampoo: { cantidad: '', observaciones: '' },
    jaboncillos: { cantidad: '', observaciones: '' },
    pastaDental: { cantidad: '', observaciones: '' },
    cepilloDientes: { cantidad: '', observaciones: '' },
    toallasHumedas: { cantidad: '', observaciones: '' },
    toallasHigienicas: { cantidad: '', observaciones: '' },
    papelHigienico: { cantidad: '', observaciones: '' },
    
    // Limpieza general
    ace: { cantidad: '', observaciones: '' },
    lavandina: { cantidad: '', observaciones: '' },
    
    // Medicamentos
    aguaDestilada: { cantidad: '', observaciones: '' },
    aguaOxigenada: { cantidad: '', observaciones: '' },
    alcohol: { cantidad: '', observaciones: '' },
    algodon: { cantidad: '', observaciones: '' },
    amoxicilina: { cantidad: '', observaciones: '' },
    bacitracina: { cantidad: '', observaciones: '' },
    branula18: { cantidad: '', observaciones: '' },
    
    // Rescate animal
    alimentosAnimales: { cantidad: '', observaciones: '' }
  });

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' && prev[section] !== null
        ? { ...prev[section], [field]: value }
        : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
    // Aquí puedes agregar la lógica para enviar los datos
    alert('Formulario enviado correctamente');
  };

  const renderBasicInput = (label, key, placeholder = '') => (
    <div className="form-group">
      <label>{label}</label>
      <input
        type="text"
        value={formData[key] || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
        placeholder={placeholder}
      />
    </div>
  );

  const renderSizeInputs = (itemKey, sizes = ['xs', 's', 'm', 'l', 'xl']) => (
    <div className="size-inputs">
      {sizes.map(size => (
        <div key={size} className="size-input">
          <label>{size.toUpperCase()}</label>
          <input
            type="number"
            value={formData[itemKey]?.[size] || ''}
            onChange={(e) => handleInputChange(itemKey, size, e.target.value)}
          />
        </div>
      ))}
      <div className="observations-input">
        <label>Observaciones</label>
        <input
          type="text"
          value={formData[itemKey]?.observaciones || ''}
          onChange={(e) => handleInputChange(itemKey, 'observaciones', e.target.value)}
        />
      </div>
    </div>
  );

  const renderQuantityInput = (itemKey, label) => (
    <div className="quantity-input-row">
      <label>{label}</label>
      <div className="quantity-obs-group">
        <input
          type="number"
          value={formData[itemKey]?.cantidad || ''}
          onChange={(e) => handleInputChange(itemKey, 'cantidad', e.target.value)}
          placeholder="Cantidad"
        />
        <input
          type="text"
          value={formData[itemKey]?.observaciones || ''}
          onChange={(e) => handleInputChange(itemKey, 'observaciones', e.target.value)}
          placeholder="Observaciones"
        />
      </div>
    </div>
  );

  return (
    <div className="formulario-container">
      <h1>Formulario de Recopilación de Necesidades - Bomberos Forestales</h1>
      
      <div className="form-container" onSubmit={handleSubmit}>
        {/* Información Básica */}
        <section className="form-section">
          <h2>Información Básica de la Brigada</h2>
          {renderBasicInput('Nombre de la Brigada', 'nombreBrigada')}
          {renderBasicInput('Cantidad de Bomberos Activos', 'cantidadBomberosActivos')}
          {renderBasicInput('Contacto Celular Comandante', 'contactoCelularComandante')}
          {renderBasicInput('Encargado de Logística', 'encargadoLogistica')}
          {renderBasicInput('Contacto Celular Logística', 'contactoCelularLogistica')}
          {renderBasicInput('Número de Emergencia Público', 'numeroEmergenciaPublico')}
        </section>

        {/* EPP - Ropa */}
        <section className="form-section">
          <h2>Equipamiento EPP - Ropa</h2>
          <div className="epp-item">
            <h3>Camisa Forestal</h3>
            {renderSizeInputs('camisaForestal')}
          </div>
          <div className="epp-item">
            <h3>Pantalón Forestal</h3>
            {renderSizeInputs('pantalonForestal')}
          </div>
          <div className="epp-item">
            <h3>Overol FR</h3>
            {renderSizeInputs('overolFr')}
          </div>
        </section>

        {/* Calzado */}
        <section className="form-section">
          <h2>Calzado y Guantes</h2>
          <div className="epp-item">
            <h3>Botas para Bomberos Forestales</h3>
            {renderSizeInputs('botasBomberos', ['t37', 't38', 't39', 't40', 't41', 't42', 't43', 'otraTalla'])}
          </div>
          <div className="epp-item">
            <h3>Guantes de Cuero</h3>
            {renderSizeInputs('guantesCuero', ['xs', 's', 'm', 'l', 'xl', 'xxl', 'otraTalla'])}
          </div>
        </section>

        {/* Equipamiento EPP */}
        <section className="form-section">
          <h2>Equipamiento EPP</h2>
          {renderQuantityInput('esclavina', 'Esclavina')}
          {renderQuantityInput('linterna', 'Linterna')}
          {renderQuantityInput('antiparra', 'Antiparra')}
          {renderQuantityInput('cascoForestal', 'Casco Forestal Ala Ancha')}
          {renderQuantityInput('mascaraPolvo', 'Máscara para Polvo y Partículas')}
          {renderQuantityInput('mascaraMediaCara', 'Máscara Media Cara')}
        </section>

        {/* Herramientas */}
        <section className="form-section">
          <h2>Herramientas</h2>
          {renderQuantityInput('linternasCabeza', 'Linternas de Cabeza')}
          {renderQuantityInput('pilasAA', 'Pilas AA')}
          {renderQuantityInput('pilasAAA', 'Pilas AAA')}
          {renderQuantityInput('azadon', 'Azadón')}
          {renderQuantityInput('palaMangoFibra', 'Pala con Mango de Fibra')}
          {renderQuantityInput('rastrilloMangoFibra', 'Rastrillo Mango de Fibra')}
          {renderQuantityInput('mcleodMangoFibra', 'McLeod Mango de Fibra')}
          {renderQuantityInput('batefuego', 'Batefuego')}
          {renderQuantityInput('gorgui', 'Gorgui')}
          {renderQuantityInput('pulaskyMangoFibra', 'Pulasky con Mango de Fibra')}
          {renderQuantityInput('quemadorGoteo', 'Quemador de Goteo')}
          {renderQuantityInput('mochilaForestal', 'Mochila Forestal')}
          {renderQuantityInput('escobetaAlambre', 'Escobeta de Alambre')}
        </section>

        {/* Logística - Repuestos */}
        <section className="form-section">
          <h2>Logística - Repuestos Vehículos y Combustible</h2>
          {renderQuantityInput('gasolina', 'Gasolina')}
          {renderQuantityInput('diesel', 'Diésel')}
          {renderQuantityInput('amortiguadores', 'Amortiguadores')}
          {renderQuantityInput('prensaDisco', 'Prensa Disco')}
          {renderQuantityInput('rectificacionFreno', 'Rectificación de Frenos')}
          {renderQuantityInput('llantas', 'Llantas')}
          {renderQuantityInput('aceiteMotor', 'Aceite de Motor')}
          {renderQuantityInput('grasa', 'Grasa')}
          {renderQuantityInput('cambioAceite', 'Cambio de Aceite')}
          {renderQuantityInput('otroArreglo', 'Otro Tipo de Arreglo')}
        </section>

        {/* Alimentación */}
        <section className="form-section">
          <h2>Alimentación y Bebidas</h2>
          {renderQuantityInput('alimentosBebidas', 'Alimentos y Bebidas')}
          {renderQuantityInput('agua', 'Agua')}
          {renderQuantityInput('rehidratantes', 'Rehidratantes')}
          {renderQuantityInput('barrasEnergizantes', 'Barras Energizantes')}
          {renderQuantityInput('lataAtun', 'Lata de Atún')}
          {renderQuantityInput('lataFrejol', 'Lata de Frejol')}
          {renderQuantityInput('lataViandada', 'Lata de Viandada')}
          {renderQuantityInput('lataChorizo', 'Lata de Chorizo')}
          {renderQuantityInput('refrescoSobres', 'Refresco en Sobres')}
          {renderQuantityInput('lechePolvo', 'Leche Polvo')}
          {renderQuantityInput('frutosSecos', 'Frutos Secos')}
          {renderQuantityInput('pastillasMenta', 'Pastillas de Menta o Dulces')}
          {renderQuantityInput('alimentosNoPerecibles', 'Alimentos No Perecederos')}
        </section>

        {/* Logística y Equipo de Campo */}
        <section className="form-section">
          <h2>Logística y Equipo de Campo</h2>
          {renderQuantityInput('colchoneta', 'Colchoneta')}
          {renderQuantityInput('sleeping', 'Sleeping')}
          {renderQuantityInput('camping', 'Camping')}
        </section>

        {/* Limpieza Personal */}
        <section className="form-section">
          <h2>Limpieza Personal</h2>
          {renderQuantityInput('shampoo', 'Shampoo Envase Pequeños o Sachet')}
          {renderQuantityInput('jaboncillos', 'Jaboncillos')}
          {renderQuantityInput('pastaDental', 'Pasta Dental')}
          {renderQuantityInput('cepilloDientes', 'Cepillo de Dientes')}
          {renderQuantityInput('toallasHumedas', 'Toallas Húmedas')}
          {renderQuantityInput('toallasHigienicas', 'Toallas Higiénicas')}
          {renderQuantityInput('papelHigienico', 'Papel Higiénico')}
        </section>

        {/* Limpieza General */}
        <section className="form-section">
          <h2>Limpieza General</h2>
          {renderQuantityInput('ace', 'Ace')}
          {renderQuantityInput('lavandina', 'Lavandina')}
        </section>

        {/* Medicamentos */}
        <section className="form-section">
          <h2>Medicamentos</h2>
          {renderQuantityInput('aguaDestilada', 'Agua Destilada 5 ML')}
          {renderQuantityInput('aguaOxigenada', 'Agua Oxigenada')}
          {renderQuantityInput('alcohol', 'Alcohol')}
          {renderQuantityInput('algodon', 'Algodón')}
          {renderQuantityInput('amoxicilina', 'Amoxicilina 1 Gramo')}
          {renderQuantityInput('bacitracina', 'Bacitracina Neomicina Pomada')}
          {renderQuantityInput('branula18', 'Bránula 18')}
        </section>

        {/* Rescate Animal */}
        <section className="form-section">
          <h2>Rescate Animal</h2>
          {renderQuantityInput('alimentosAnimales', 'Alimentos para Animales')}
        </section>

        <button type="submit" className="submit-button">
          Enviar Formulario de Necesidades
        </button>
              </div>
    </div>
  );
};

export default FormularioNecesidades;