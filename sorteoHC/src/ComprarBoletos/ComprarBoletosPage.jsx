
import HeaderArea from '../HeaderArea/HeaderArea';
import "./ComprarBoletosPage.css";


function ComprarBoletosPage() {
  

  return (
    <div className="contenedor__todo_Home">
        
        <div className="Header">
            <HeaderArea />  
        </div>

        <div className="Presentacion-contenedor-1">
            

            <div className="Presentacion-contenedor-2">
                <h1>Empresa comprometida y dedicada.</h1>
                <p>
                    Gracias por visitar nuestro sitio. Aquí encontrarás información relevante sobre nuestros productos y
                    servicios. Si tienes alguna pregunta o necesitas más detalles, no dudes en contactarnos.
                </p>
                <a href="#contacto" className="boton-contacto">Contactar</a>
            </div>
        
        </div>


      <div className="Acerca-de-nosotros-contenedor-1">
        <div className="Acerca-de-nosotros-contenedor-2">
            <div className="Acerca-de-nosotros-contenedor-mapa">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.651643003516!2d-103.41862568507355!3d20.656564205158806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428b17f7dc88185%3A0x70525ba6adbb0045!2sPerif%C3%A9rico%20Sur%20314%2C%20Santa%20Ana%20Tepetitl%C3%A1n%2C%20Zapopan%2C%20Jal.%2045077%2C%20M%C3%A9xico!5e0!3m2!1ses-419!2sus!4v1697381212123!5m2!1ses-419!2sus"
                    allowFullScreen=""
                    loading="lazy"
                    title="Ubicación del taller"
                ></iframe>
            </div>
            <div className="Acerca-de-nosotros-contenedor-informacion">
                <h2 className="Acerca-de-nosotros-Titulo1">Acerca de nosotros.</h2>
                    <p></p>
                    <h3>RAZON SOCIAL: SERVICIO ELECTROMECANICO Y AUTOMATIZACION INDUSTRIAL S.A.S.</h3>
                    <h3>DIRECCION FISCAL: CALLE COLIBRI #11 COL. VICENTE GUERRERO C.P. 45134 ZAPOPAN JAL.</h3>
                    <h3>RFC: SEA190207FY1</h3>
                    <h3>DOMICILIO TALLER: LATERAL PERIFERICO SUR #314 COL. PIRAMIDES DEL SOL. ZAPOAN JAL.</h3>
                    <h3>TEL. OFICINA (33)2301-4906 CEL (044)3319-6064-75/ 332118-3188.</h3>
                    <h3>EMAIL: seya_030187@hotmail.com</h3>
            </div>
        </div>
      </div>
      

      


    </div>
  );
}

export default ComprarBoletosPage;
