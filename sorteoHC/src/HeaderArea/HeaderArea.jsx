import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./HeaderArea.css";
import Logo from "../assets/Logo.png"; // Ruta del logo

function HeaderArea() {
  const [menuOpen, setMenuOpen] = useState(false);  // Estado para controlar el menú desplegable
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollTo = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);  // Función para alternar el estado del menú

  // Función para navegar al home
  const goToHome = () => {
    navigate("/"); // Redirige al home
  };

  return (
    <header className="header-container">
      <div className="top-bar">
        <nav className="nav-bar">
          <div className="logo-container">
            {/* Imagen como botón para redirigir al home */}
            <button className="logo-button" onClick={goToHome}>
              <img src={Logo} alt="Logo" className="logo" />
            </button>
          </div>
          <button className="menu-toggle" onClick={toggleMenu}>
            &#9776; {/* Icono del menú */}
          </button>
          <ul className={`nav-list ${menuOpen ? "open" : ""}`}>
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
            <li>
              <Link to="/EstatusDeBoleto">Estatus de boletos</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default HeaderArea;
