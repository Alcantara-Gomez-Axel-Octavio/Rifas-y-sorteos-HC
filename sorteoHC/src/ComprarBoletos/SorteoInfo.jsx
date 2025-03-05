import React, { useState, useEffect } from 'react';
import "./ComprarBoletosPage.css";

function SorteoInfo() {
  const [sorteo, setSorteo] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetch('http://localhost:3001/api/sorteos')
      .then(response => response.json())
      .then(data => setSorteo(data))
      .catch(error => console.error("Error al obtener sorteo:", error));
  }, []);

  if (!sorteo) return <p>Cargando sorteo...</p>;

  // Arreglo con las imágenes disponibles (filtramos las que no sean null o vacías)
  const images = [sorteo.imagen1, sorteo.imagen2, sorteo.imagen3, sorteo.imagen4].filter(Boolean);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="sorteo-info">
      {/* Mostrar el título del sorteo */}
      <h1>{sorteo.titulo}</h1>
      
      {/* Carrusel de imágenes */}
      {images.length > 0 && (
        <div className="carousel">
          <button onClick={prevImage} className="carousel-button prev">{"<"}</button>
          <img 
            src={images[currentImageIndex]} 
            alt={`Imagen ${currentImageIndex + 1} del sorteo`} 
            className="sorteo-imagen" 
          />
          <button onClick={nextImage} className="carousel-button next">{">"}</button>
        </div>
      )}

      {/* Detalles del sorteo */}
      <div className="sorteo-detalles">
         <h2>{sorteo.descripcion}</h2>
         <p><strong>Fecha finalización:</strong> {new Date(sorteo.fecha_finalizacion).toLocaleString()}</p>
         <p><strong>Precio del boleto:</strong> ${sorteo.precio_boleto}</p>
      </div>
    </div>
  );
}

export default SorteoInfo;
