import React, { useState, useEffect } from 'react';
import HeaderArea from '../HeaderArea/HeaderArea';
import SorteoInfo from './SorteoInfo.jsx';
import "./ComprarBoletosPage.css";
import Suerte from "../assets/Suerte.gif";

function ComprarBoletosPage() {
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [mostrarGif, setMostrarGif] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([]); // estado para los tickets seleccionados
  const [loading, setLoading] = useState(true);



  const [nombre, setNombre] = useState(""); 
  const [email, setEmail] = useState("");
  const [numero, setNumero] = useState("");

  // Abrir y cerrar modales
  const openModal = () => setShowModal(!showModal);
  const openModal2 = () => setShowModal2(!showModal2);

  const [cantidad, setCantidad] = useState(1);




  // Función para generar boletos aleatorios
const generarBoletosAleatorios = () => {
  const boletosDisponibles = tickets.filter(ticket => ticket.estado === "disponible");
  if (boletosDisponibles.length === 0) return;

  // Seleccionar boletos aleatorios sin repetir
  const cantidadGenerar = Math.min(cantidad, boletosDisponibles.length);
  const boletosAleatorios = [];
  while (boletosAleatorios.length < cantidadGenerar) {
    const randomIndex = Math.floor(Math.random() * boletosDisponibles.length);
    const boletoSeleccionado = boletosDisponibles[randomIndex];

    if (!boletosAleatorios.includes(boletoSeleccionado)) {
      boletosAleatorios.push(boletoSeleccionado);
    }
  }

  setSelectedTickets(boletosAleatorios);
  mostrarGifTemporalmente();
};

  // Función para seleccionar/deseleccionar tickets
  const toggleTicketSelection = (ticket) => {
    if (ticket.estado !== "disponible") return; // solo se pueden seleccionar los disponibles
    const alreadySelected = selectedTickets.find(t => t.ticket_id === ticket.ticket_id);
    if (alreadySelected) {
      // Si ya está seleccionado, se quita de la lista
      setSelectedTickets(selectedTickets.filter(t => t.ticket_id !== ticket.ticket_id));
    } else {
      // Si no está, se agrega a la lista
      setSelectedTickets([...selectedTickets, ticket]);
    }
  };



  // Función para mostrar el GIF temporalmente
  const mostrarGifTemporalmente = () => {
    setMostrarGif(true);
    setTimeout(() => setMostrarGif(false), 3000);
  };

  // Obtener tickets de la API
  useEffect(() => {
    setLoading(true); // Activa el estado de carga antes de la petición
    fetch('http://localhost:3001/api/tickets')
      .then(response => response.json())
      .then(data => {
        setTickets(data);
        setLoading(false); // Desactiva el estado de carga cuando los datos están listos
      })
      .catch(error => {
        console.error("Error al obtener tickets:", error);
        setLoading(false); // Asegurar que la carga se detiene incluso si hay un error
      });
  }, []);
  

  // Función para actualizar los tickets (marcarlos como "apartado")
  const updateTickets = async (usuario_id) => {
    try {
      const response = await fetch("http://localhost:3001/api/apartarTickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id,
          ticket_ids: selectedTickets.map(ticket => ticket.ticket_id)
        })
      });
      if (response.ok) {
        console.log("Tickets actualizados a 'apartado'");
      } else {
        console.error("Error al actualizar tickets:", response.statusText);
      }
    } catch (error) {
      console.error("Error al actualizar tickets:", error);
    }
  };

  // Función para registrar usuario y luego actualizar tickets
  const apartarUsuarioYTickets = async () => {
    try {
      // Obtener título del sorteo desde la API
      const sorteoResponse = await fetch("http://localhost:3001/api/sorteos");
      if (!sorteoResponse.ok) throw new Error("Error al obtener el sorteo");
      const sorteoData = await sorteoResponse.json();
      const titulo = sorteoData.titulo; // Extraer el título
  
      // Registrar usuario
      const response = await fetch("http://localhost:3001/api/registroUsuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, numero })
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Usuario registrado exitosamente", data);
  
        // Actualizar tickets con el usuario_id recibido
        await updateTickets(data.usuario_id);
  
        // Generar mensaje para WhatsApp
        const ticketNumbers = selectedTickets.map(ticket => ticket.numero_ticket).join(", ");
        const cantidad = selectedTickets.length;
        const ticketPrice = 100;
        const totalPrice = cantidad * ticketPrice;
  
        const mensaje = `${titulo} 🚗
  
  Me interesa participar por el auto!
  
  Nombre: ${nombre}
  
  ⚠ *FOLIO: ${data.usuario_id}*
  Boletos: ${ticketNumbers}
  
  *Costo: $${totalPrice}*
  
📌El siguiente paso es realizar tu pago y enviarnos tu comprobante de pago por aquí`;
  
        // Crear URL para WhatsApp
        const whatsappUrl = `https://api.whatsapp.com/send?phone=6141846333&text=${encodeURIComponent(mensaje)}`;
        window.open(whatsappUrl, "_blank");
  
        // Opcional: limpiar selección de boletos
        setSelectedTickets([]);
      } else {
        console.error("Error al registrar usuario:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    openModal2(); // Cerrar modal
  };
  


  return (
    <div className="contenedor__todo_Home">
      <div className="Header">
        <HeaderArea />
      </div>
  
      

      <div className="Texto-Principal">
              <h1>Compra de boletos</h1>
              <p>
                En esta sección podrás comprar boletos para participar en el sorteo de la rifa de la fábrica de la suerte.
              </p>
             
            </div>
            <div className="CuadroBlancoInfo">
            <SorteoInfo />
            </ div>
        
            <div className="CuadroBlanco">
        <div className="DentrodeBlancoBoton">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p className="loading-text">Cargando boletos...</p>
            </div>
          ) : tickets.length > 0 ? (
            tickets.map((ticket) => {
              const estadoClase =
                ticket.estado === "disponible"
                  ? "estado-disponible"
                  : ticket.estado === "apartado"
                  ? "estado-apartado"
                  : ticket.estado === "vendido"
                  ? "estado-vendido"
                  : "";
              const isSelected = selectedTickets.find(t => t.ticket_id === ticket.ticket_id);
              return (
                <button 
                  key={ticket.ticket_id} 
                  className={`BotonNumero ${estadoClase} ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleTicketSelection(ticket)}
                >
                  {ticket.numero_ticket} 
                </button>
              );
            })
          ) : (
            <p>No se encontraron boletos.</p>
          )}
        </div>
      </div>


      <div className="ContenedorBoton">
        <div className='BotonGenerar' onClick={openModal}>
          Generar aleatorio
        </div>
      </div>

      <div className='ContenedorMisboletos'>  
        
        {selectedTickets.length > 0 ? (
          selectedTickets.map(ticket => (
            <div key={ticket.ticket_id} className="ticket-seleccionado"onClick={() => toggleTicketSelection(ticket)}>
              Ticket #{ticket.numero_ticket}
            </div>
          ))
        ) : (
          <p>No has seleccionado boletos.</p>
        )}
      </div>

      <div className="ContenedorBoton">
        <div className='BotonGenerar' onClick={openModal2}>
          Confirmar
        </div>
      </div>


      {showModal && (
  <div className="modal">
    <div className="ModalContenido">
      <span className="CerrarModal" onClick={openModal}>X</span>
      <div className='contenedorSeleccion'>
        <div className='contenedorTextoGenerar'>
          BOLETOS A GENERAR:
        </div>
        <div className='ContenedorSelect'>
          <select 
            className='SelectGenerar' 
            value={cantidad} 
            onChange={e => setCantidad(parseInt(e.target.value, 10))}
          >
            <option value="" disabled>Selecciona número de boletos</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
            <option value="60">60</option>
            <option value="70">70</option>
            <option value="80">80</option>
            <option value="90">90</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      <div className='Botonaleatorio' onClick={generarBoletosAleatorios}>
        Generar aleatorio
      </div>

      <div className='ContenedorMisboletosAleatorios'>
        {mostrarGif && <img src={Suerte} alt="Suerte" />}
        

        {!mostrarGif && selectedTickets.length > 0 ? (
          selectedTickets.map(ticket => (
            <div key={ticket.ticket_id} className="ticket-seleccionado" onClick={() => toggleTicketSelection(ticket)} >
              Ticket #{ticket.numero_ticket}
            </div>
          ))
        ) : (
          null
        )}
      </div>


      
    </div>
  </div>
)}


      {showModal2 && (
        <div className="modal2">
          <div className="ModalContenido2">
            <span className="CerrarModal" onClick={openModal2}>X</span>
            
            <div className='ContenedorMisboletos'>  
              {selectedTickets.length > 0 ? (
                selectedTickets.map(ticket => (
                  <div key={ticket.ticket_id} className="ticket-seleccionado">
                    Ticket #{ticket.numero_ticket}
                  </div>
                ))
              ) : (
                <p>No has seleccionado boletos.</p>
              )}
            </div>
            <p>
              Aviso: Si modificas el mensaje preestablecido de WhatsApp, tu registro no será válido y se tomará únicamente la información que aparece en la página. Si deseas cancelar el proceso, envía un mensaje a través de WhatsApp.
            </p>

            <input type="number" placeholder="Número telefonico" className="InputNumero" onWheelCapture={(e) => e.target.blur()} onChange={e => setNumero(e.target.value)} />
            <input type="text" placeholder="Nombre completo" className="InputNombre" onChange={e => setNombre(e.target.value)}/>
            <input type="email" placeholder="Correo electronico" className="InputCorreo" onChange={e => setEmail(e.target.value)} />
            <button
              className="BotonApartar"
              onClick={apartarUsuarioYTickets}
              disabled={!numero || !nombre || !email || selectedTickets.length === 0}
            >
              Apartar
            </button>
          </div> 
        </div>
      )}
    </div>
  );
}

export default ComprarBoletosPage;