import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeaderArea from "../HeaderArea/HeaderArea";
import "./HomePage.css";

import IconoFacebook from "../assets/IconoFacebook.png";
import IconoWhatsapp from "../assets/IconoWhatsapp.png";
import IconoInstagram from "../assets/IconoInstagram.png";

function HomePage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      // Agregamos un pequeño retardo para asegurar que el elemento ya esté renderizado
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100); // Puedes ajustar el retardo según necesites
    }
  }, [hash]);

  return (
    <div className="contenedor__todo_Home">
      <div className="Header">
        <HeaderArea />
      </div>


    <div className="CuadroBlanco1" id="faq-section">
      <h1>Preguntas frecuentes.</h1>
            <p>
              Parte de lo recaudado en esta rifa servirá para mejorar la calidad de
              vida de perros y gatos en diferentes albergues.
            </p>
            <h2>¿CÓMO SE ELIGE A LOS GANADORES?</h2>
            <p>
              Todos nuestros sorteos se realizan en base a la Lotería Nacional para
              la Asistencia Pública mexicana.
            </p>
            <p>
              El ganador de nuestro Sorteo será el participante cuyo boleto coincida
              con las cifras del primer premio ganador de la Lotería Nacional (las
              fechas serán publicadas en nuestra página oficial).
            </p>

            <h2>¿DÓNDE SE ANUNCIA A LOS GANADORES?</h2>
            <p>
              En nuestra página oficial de Facebook puedes encontrar la publicación
              de todos nuestros sorteos, así como también todas las transmisiones en
              vivo con Lotería Nacional y la entrega de premios a los ganadores.
            </p>

            <h2>¿QUÉ SUCEDE CUANDO EL NÚMERO GANADOR ES UN BOLETO NO VENDIDO?</h2>
            <p>
              Se elige un nuevo ganador realizando la misma dinámica en otra fecha
              cercana (se anunciará la nueva fecha).
            </p>

            <h2>¿QUÉ PASA SI NO SE VENDEN TODOS LOS BOLETOS?</h2>
            <p>
              Para realizar nuestro sorteo en la fecha indicada es necesario que se
              vendan al menos el 80% de nuestros boletos. De no ser así, se cambiará
              el día de nuestra rifa.
            </p>

            <p>
              Encuentra la transmisión en vivo de todos nuestros sorteos en nuestra
              página de Facebook en las fecha y hora indicadas. ¡No te lo pierdas!
            </p>

    </div>
    <div className="CuadroBlanco2" id="contacto-section">
      <h1>Contacto</h1>
      <p>Si tienes alguna duda o sugerencia, no dudes en contactarnos.</p>

      <div className="Contacto__redes_Imagenes">
        <a
                href="https://www.instagram.com/rifa.sysorteoshc/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={IconoInstagram} alt="Instagram" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100071301430779 "
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={IconoFacebook} alt="Facebook" />
              </a>
              <a
                href="https://wa.me/6141846333"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={IconoWhatsapp} alt="WhatsApp" />
              </a>

      </div>
      <p>
              <strong>Teléfono/WhatsApp:</strong> 332118-3188
            </p>
            <p>
              <strong>Email:</strong> HCsorteos@gmail.com
            </p>





</div>



</div>


      





  
  );
}

export default HomePage;
