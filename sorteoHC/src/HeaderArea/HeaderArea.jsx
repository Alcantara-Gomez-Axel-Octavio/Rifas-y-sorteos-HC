import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./HeaderArea.css";

function HeaderArea() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollTo = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      // Si no estás en la home, navega a "/" y agrega el hash deseado
      navigate(`/#${sectionId}`);
    } else {
      // Si ya estás en la home, realiza el scroll de forma suave
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="header-container">
      <div className="top-bar">
        <nav className="nav-bar">
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <a
                href="#faq-section"
                onClick={(e) => handleScrollTo(e, "faq-section")}
              >
                Preguntas frecuentes
              </a>
            </li>
            <li>
              <a
                href="#contacto-section"
                onClick={(e) => handleScrollTo(e, "contacto-section")}
              >
                Contacto
              </a>
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
