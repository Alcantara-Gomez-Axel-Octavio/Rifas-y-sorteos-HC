
import HeaderArea from '../HeaderArea/HeaderArea';
import "./HomePage.css";

import IconoFacebook from "../assets/IconoFacebook.png";
import IconoWhatsapp from "../assets/IconoWhatsapp.png";
import IconoInstagram from "../assets/IconoInstagram.png";


function HomePage() {
  

  return (


    <div className="contenedor__todo_Home">
      <div className="Header">
        <HeaderArea />  
      </div>


      <div
        className="Presentacion-contenedor-1"
        style={{
          backgroundImage: "url('/iconos/banner.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center right",
          backgroundSize: "contain",
          height: "80vh",
        }}
        >
        {/* Agregamos el id aquí */}
        <div id="faq-section" className="Presentacion-contenedor-2">
          <h1>Preguntas frecuentes.</h1>
          <p>
            Parte de lo recaudado en esta rifa servirá para mejorar la calidad de vida 
            de perros y gatos en diferentes albergues.
            </p>

            <div className="faq-section">

              <h2>¿CÓMO SE ELIGE A LOS GANADORES?</h2>
              <p>
                Todos nuestros sorteos se realizan en base a la Lotería Nacional 
                para la Asistencia Pública mexicana.
              </p>
              <p>
                El ganador de nuestro Sorteo será el participante cuyo boleto coincida 
                con las cifras del primer premio ganador de la Lotería Nacional 
                (las fechas serán publicadas en nuestra página oficial).
              </p>

              <h2>¿DÓNDE SE ANUNCIA A LOS GANADORES?</h2>
              <p>
                En nuestra página oficial de Facebook puedes encontrar la publicación 
                de todos nuestros sorteos, así como también todas las transmisiones en vivo 
                con Lotería Nacional y la entrega de premios a los ganadores.
              </p>

              <h2>¿QUÉ SUCEDE CUANDO EL NÚMERO GANADOR ES UN BOLETO NO VENDIDO?</h2>
              <p>
                Se elige un nuevo ganador realizando la misma dinámica en otra fecha cercana 
                (se anunciará la nueva fecha).
              </p>

              <h2>¿QUÉ PASA SI NO SE VENDEN TODOS LOS BOLETOS?</h2>
              <p>
                Para realizar nuestro sorteo en la fecha indicada es necesario que se vendan 
                al menos el 80% de nuestros boletos. De no ser así, se cambiará el día de nuestra rifa.
              </p>

              <p>
                Encuentra la transmisión en vivo de todos nuestros sorteos en nuestra página 
                de Facebook en las fecha y hora indicadas. ¡No te lo pierdas!
              </p>
          </div>
        </div>
      </div>


      <div id="contacto-section" className="Acerca-de-nosotros-contenedor">
        <div className="Acerca-de-nosotros-info">
          <h2 className="Acerca-de-nosotros-titulo">Contáctanos</h2>
          <p className="Acerca-de-nosotros-desc">
            Si tienes dudas o comentarios, no dudes en contactarnos. Estamos aquí para ayudarte.
          </p>
          <div className="Acerca-de-nosotros-redes">
            <a
              href="https://www.instagram.com/axel._.alc/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={IconoInstagram} alt="Instagram" />
            </a>
            <a
              href="https://www.facebook.com/axelalcanatara"  
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={IconoFacebook} alt="Facebook" />
            </a>
            <a
              href="https://wa.me/3321183188"  
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={IconoWhatsapp} alt="WhatsApp" />
            </a>
          </div>
          <div className="Acerca-de-nosotros-contacto">
            <p>
              <strong>Teléfono/WhatsApp:</strong> 332118-3188
            </p>
            <p>
              <strong>Email:</strong> HCsorteos@gmail.com
            </p>
          </div>
        </div>
      </div>


    </div>
  );
}

export default HomePage;
