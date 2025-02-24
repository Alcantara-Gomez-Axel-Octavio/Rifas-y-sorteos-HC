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
                Whatsapp (614) 362 2916</p></h2>
            </div>

            

                <div className="ContenedorMetodo">
                    <img src={metodosDePago} alt="Metodos de pago" className="Imagen_Pago"/>
                    <button className="BotonDescargar">Pregunta En el whatsApp (614) 362 2916</button>
                </div>
                

            

        </div>
    )

}
export default MetodosDePago;