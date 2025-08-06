import React from 'react';

const InformacionGeneralStep = ({ formData, updateFormData }) => (
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

export default InformacionGeneralStep;
