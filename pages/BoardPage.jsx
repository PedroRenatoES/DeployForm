import React, { useState, useEffect } from 'react';
import { getBrigades, deleteBrigade } from '../services/brigadeService';

const BoardPage = () => {
  const [brigades, setBrigades] = useState([]);
  const [selectedBrigade, setSelectedBrigade] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrigades = async () => {
      try {
        const data = await getBrigades();
        setBrigades(data);
      } catch (error) {
        console.error('Error fetching brigades:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBrigades();
  }, []);

  const handleViewDetails = (brigade) => {
    setSelectedBrigade(brigade);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta brigada?')) {
      try {
        await deleteBrigade(id);
        setBrigades(prev => prev.filter(b => b.id !== id));
      } catch (error) {
        console.error('Error deleting brigade:', error);
      }
    }
  };

  if (loading) return <div>Cargando brigadas...</div>;

  return (
    <div className="board-page">
      <h1>Tablero de Brigadas</h1>
      
      <div className="brigade-grid">
        {brigades.map(brigade => (
          <BrigadeCard 
            key={brigade.id}
            brigade={brigade}
            onView={() => handleViewDetails(brigade)}
            onDelete={() => handleDelete(brigade.id)}
          />
        ))}
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedBrigade && (
          <div className="brigade-detail">
            <h2>{selectedBrigade.nombre_brigada}</h2>
            <p><strong>Bomberos activos:</strong> {selectedBrigade.cantidad_bomberos_activos}</p>
            <p><strong>Comandante:</strong> {selectedBrigade.contacto_celular_comandante}</p>
            {/* Más detalles */}
            
            <div className="detail-sections">
              <div className="section">
                <h3>Equipamiento</h3>
                {/* Lista de equipamiento */}
              </div>
              
              <div className="section">
                <h3>Herramientas</h3>
                {/* Lista de herramientas */}
              </div>
              
              {/* Otras secciones */}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BoardPage;

