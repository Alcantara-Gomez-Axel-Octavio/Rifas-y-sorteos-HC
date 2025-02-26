
import HeaderArea from '../HeaderArea/HeaderArea';



function AdministradorPage() {
  

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
              width: "auto", // Cambia esto por el ancho real de la imagen
              height: "80vh", // Cambia esto por la altura real de la imagen
            }}>
        

        <div className="Presentacion-contenedor-2">
          <h1>Preguntas frecuentes.</h1>
          <p>
            Gracias por visitar nuestro sitio. Aquí encontrarás información relevante sobre nuestros productos y
            servicios. Si tienes alguna pregunta o necesitas más detalles, no dudes en contactarnos.
          </p>
          <a href="#contacto" className="boton-contacto">Contactar</a>

          {/* Sección FAQ / Preguntas Frecuentes */}
          <div className="faq-section">
            <h2>¿CÓMO SE ELIGE A LOS GANADORES?</h2>
            <p>
              Todos nuestros sorteos se realizan en base a la Lotería Nacional para la Asistencia Pública mexicana.
            </p>
            <p>
              El ganador de Sorteos Chiwas será el participante cuyo número coincida con las últimas cifras del primer
              premio ganador de la Lotería Nacional (las fechas serán publicadas en nuestras redes sociales).
            </p>

            <h2>¿QUÉ SUCEDE CUANDO EL NÚMERO GANADOR ES UN BOLETO NO VENDIDO?</h2>
            <p>
              Se elige un nuevo ganador realizando la misma dinámica en otra fecha cercana (se anulará la fecha anterior).
            </p>
            <p>
              Esto significa que, ¡tendrás el doble de oportunidades de ganar con tu mismo boleto!
            </p>

            <h2>¿DÓNDE SE PUBLICA A LOS GANADORES?</h2>
            <p>
              En nuestra página oficial de Facebook Sorteos Chiwas podrás encontrar todas y cada una de nuestras 
              transmisiones en vivo donde se realiza el sorteo de la Lotería Nacional y las fechas en las que se 
              publican los ganadores.
            </p>
          </div>
        </div>
      </div>


      
      

      


    </div>
  );
}

export default AdministradorPage;
