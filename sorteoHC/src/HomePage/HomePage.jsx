
import HeaderArea from '../HeaderArea/HeaderArea';
import "./HomePage.css";


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
              width: "auto", // Cambia esto por el ancho real de la imagen
              height: "80vh", // Cambia esto por la altura real de la imagen
            }}>
        

        <div className="Presentacion-contenedor-2">
          <h1>Easlkdhas asdjhasdkj  lasdkh.</h1>
          <p>
            Gracias por visitar nuestro sitio. Aquí encontrarás información relevante sobre nuestros productos y
            servicios. Si tienes alguna pregunta o necesitas más detalles, no dudes en contactarnos.
          </p>
          <a href="#contacto" className="boton-contacto">Contactar</a>
        </div>
        <div className="Presentacion-contenedor-3">
          <img src="/iconos/logo.png" alt="Logo de Servicios " />
        </div>
      </div>


      <div className="Acerca-de-nosotros-contenedor-1">
        <div className="Acerca-de-nosotros-contenedor-2">
          
            <div className="Acerca-de-nosotros-contenedor-informacion">
                <h2 className="Acerca-de-nosotros-Titulo1">Acerca de nosotros.</h2>
                    <p></p>
                    <h3>Rasdkn askdj as askdjli aaklsdj kwqe aiqwej alkqwje a qkasn qwe .</h3>
                    <h3>Rasdkn askdj as askdjli aaklsdj kwqe aiqwej alkqwje a qkasn qwe.</h3>
                    <h3>instagram: SEA190207FY1</h3>
                    <h3>facebook: Rasdkn askdj as askdjli aaklsdj kwqe aiqwej alkqwje a qkasn qwe.</h3>
                    <h3>Numero telefonico :332118-3188.</h3>
                    <h3>EMAIL: HCsorteos@gmail.com</h3>
            </div>
        </div>
      </div>
      

      


    </div>
  );
}

export default HomePage;
