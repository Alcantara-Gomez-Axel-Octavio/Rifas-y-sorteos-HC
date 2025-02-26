
import React from "react";
import { Link } from "react-router-dom";
import "./HeaderArea.css";

function HeaderArea() {
  return (
    <header className="header-container">
      <div className="top-bar">
        {/* Barra azul superior o lo que necesites */}
        
        <nav className="nav-bar">
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            
            <li>
              <a href="#faq-section">Preguntas frecuentes</a>
            </li>
            
            <li>
            <a href="#contacto-section">Contacto</a>
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