import React, { useState, useEffect } from 'react';
import "./ComprarBoletosPage.css";


function SorteoInfo() {
  const [sorteo, setSorteo] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/sorteos')
      .then(response => response.json())
      .then(data => setSorteo(data))
      .catch(error => console.error("Error al obtener sorteo:", error));
  }, []);

  if (!sorteo) return <p>Cargando sorteo...</p>;

  return (
    <div className="sorteo-info">
      <img 
        src={sorteo.imagen} 
        alt="Imagen del sorteo" 
        className="sorteo-imagen" 
      />
      <div className="sorteo-detalles">
         <h2>{sorteo.descripcion}</h2>
         <p><strong>Fecha finalización:</strong> {new Date(sorteo.fecha_finalizacion).toLocaleString()}</p>
         <p><strong>Precio del boleto:</strong> ${sorteo.precio_boleto}</p>
      </div>
    </div>
  );
}

export default SorteoInfo;
