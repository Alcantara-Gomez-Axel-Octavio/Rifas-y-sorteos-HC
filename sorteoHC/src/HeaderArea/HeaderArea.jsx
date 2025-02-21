import React from "react";
import { Link } from "react-router-dom";
import "./HeaderArea.css";

function HeaderArea() {
  return (
    <header className="header-container">
      {/* Barra azul superior */}
      <div className="top-bar">
        
    
        

        {/* Barra negra de navegación */}
      <nav className="nav-bar">
        <ul>
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/Preguntas-frecuentes">Preguntas frecuentes</Link>
          </li>
          <li>
            <Link to="/contacto">Contacto</Link>
          </li>
          <li>
            <Link to="/MetodosDePago">Métodos de Pago</Link>
          </li>
          <li>
            <Link to="/ComprarBoletos">Comprar boletos</Link>
          </li>
        </ul>
      </nav>
        
      </div>
      
      
    </header>
  );
}

export default HeaderArea;
