import HeaderArea from '../HeaderArea/HeaderArea.jsx';
import "./MetodosDePagoPage.css";
import metodosDePago from "../assets/MetododePago.png";








function MetodosDePago(){
    
    return(
        <div className='FullScreeen'>
            <div className='ContenedorHeader'>
                <HeaderArea/>
            </div>


            

            <div className="ContenedorInformacion">
                <h2>Debes realizar el pago por alguna de éstas opciones y enviar tu comprobante de pago <p>al
                Whatsapp (614) 184 6333</p></h2>
            </div>

            

            <div className="ContenedorMetodo">
                <img src={metodosDePago} alt="Metodos de pago" className="Imagen_Pago"/>
                <a 
                    href="https://wa.me/6141846333" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="BotonDescargar"
                >
                    Pregunta en el WhatsApp (614) 184 6333
                </a>
            </div>
                

            

        </div>
    )

}
export default MetodosDePago;