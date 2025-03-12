import React, { useState, useEffect } from 'react';
import "./AdministradorPage.css";

const API_URL = import.meta.env.VITE_API_URL;


function AdministradorPage() {

  const [currentSorteoId, setCurrentSorteoId] = useState(null);
  


  
  useEffect(() => {
    const fetchSorteoActivo = () => {
      fetch(`${API_URL}/api/sorteos`)
        .then(response => response.json())
        .then(data => {
          if (data.sorteo_id) {
            setCurrentSorteoId(data.sorteo_id);
            // Opcional: Actualizar la fecha en el estado del sorteo
            setSorteo(prev => ({
              ...prev,
              fechaFinalizacion: data.fecha_finalizacion.split("T")[0]  // Ajusta según el formato que recibas
            }));
          }
        })
        .catch(err => console.error("Error al obtener sorteo activo:", err));
    };

    const fetchTickets = () => {
      fetch(`${API_URL}/api/tickets`)
        .then(response => response.json())
        .then(data => {
          console.log("🎟️ Tickets recibidos desde API:", data); // 🔍 Verifica qué datos llegan
          setTickets(data);
        })
        .catch(err => console.error("❌ Error al obtener tickets:", err));
    };
    
  
    fetchSorteoActivo();
  }, []);

  // Estado para el sorteo, ahora incluye título y 4 imágenes
  const [sorteo, setSorteo] = useState({
    titulo: "",
    imagen1: null,
    imagen2: null,
    imagen3: null,
    imagen4: null,
    fechaFinalizacion: "",
    descripcion: "",
    precioBoleto: "",
    cantidadBoletos: ""
  });

  // Estados para métodos de pago
  const [metodoTransferencias, setMetodoTransferencias] = useState({
    banco: "",
    nombre: "",
    clabe: ""
  });
  const [metodoOxxo, setMetodoOxxo] = useState({
    banco: "",
    numeroTarjeta: ""
  });
  const [metodoPagosUSA, setMetodoPagosUSA] = useState({
    banco: "",
    nombre: "",
    numeroTarjeta: ""
  });

  // Estado para los tickets (datos extraídos de la BD)
  const [tickets, setTickets] = useState([]);

  // Se consulta el endpoint de tickets al cargar el componente
  const fetchTickets = () => {
    fetch(`${API_URL}/api/tickets`)
      .then(response => response.json())
      .then(data => setTickets(data))
      .catch(err => console.error("Error al obtener tickets:", err));
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 5000); // Actualiza cada 5 segundos
    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
  }, []);

  const handleUpdateFechaSorteo = async (sorteoId, nuevaFecha) => {
    try {
      const response = await fetch(`${API_URL}/api/sorteos/${sorteoId}/updateFecha`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fecha_finalizacion: nuevaFecha })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Error al actualizar la fecha del sorteo.");
      }
  
      alert(data.message);
      // Actualizar el estado local si es necesario
      setSorteo((prevSorteo) => ({
        ...prevSorteo,
        fechaFinalizacion: nuevaFecha
      }));
  
    } catch (error) {
      console.error("Error al actualizar la fecha:", { sorteoId }, error);
      alert("Hubo un problema al actualizar la fecha del sorteo.");
    }
  };

  // Función para aceptar la compra de un ticket
  const handleAcceptTicket = (ticketId) => {
    fetch(`${API_URL}/api/tickets/${ticketId}/accept`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(updatedTicket => {
        // Actualizar estado local de tickets
        setTickets(prevTickets =>
          prevTickets.map(ticket =>
            ticket.ticket_id === updatedTicket.ticket_id ? updatedTicket : ticket
          )
        );
      })
      .catch(err => console.error("Error al aceptar el ticket:", err));
  };

  // Función para rechazar un ticket
  const handleRejectTicket = (ticketId) => {
    fetch(`${API_URL}/api/tickets/${ticketId}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(updatedTicket => {
        setTickets(prevTickets =>
          prevTickets.map(ticket =>
            ticket.ticket_id === updatedTicket.ticket_id ? updatedTicket : ticket
          )
        );
      })
      .catch(err => console.error("Error al rechazar el ticket:", err));
  };

  // Función para crear un sorteo usando FormData para subir archivos
  const handleSorteoSubmit = async (e) => {
    e.preventDefault();

    // Crear el objeto FormData y agregar los campos requeridos
    const formData = new FormData();
    formData.append('admin_id', 1); // Se debe obtener este id de la sesión o contexto
    
    // Agregar las 4 imágenes (la primera es obligatoria)
    formData.append('imagen1', sorteo.imagen1);
    if (sorteo.imagen2) formData.append('imagen2', sorteo.imagen2);
    if (sorteo.imagen3) formData.append('imagen3', sorteo.imagen3);
    if (sorteo.imagen4) formData.append('imagen4', sorteo.imagen4);

    // Agregar el título y demás campos
    formData.append('titulo', sorteo.titulo);
    formData.append('fecha_finalizacion', sorteo.fechaFinalizacion);
    formData.append('descripcion', sorteo.descripcion);
    formData.append('precio_boleto', sorteo.precioBoleto);
    formData.append('total_tickets', sorteo.cantidadBoletos);

    // Enviar solicitud inicial
    let response = await fetch(`${API_URL}/api/sorteo`, {
      method: 'POST',
      body: formData
    });

    let data = await response.json();

    // Si hay advertencia por sorteo activo, solicitar confirmación al usuario
    if (response.status === 400 && data.warning) {
      const confirmed = window.confirm(data.warning);
      if (!confirmed) return;

      // Reenviar la solicitud con confirmación
      const formDataConfirm = new FormData();
      formDataConfirm.append('admin_id', 1);
      formDataConfirm.append('imagen1', sorteo.imagen1);
      if (sorteo.imagen2) formDataConfirm.append('imagen2', sorteo.imagen2);
      if (sorteo.imagen3) formDataConfirm.append('imagen3', sorteo.imagen3);
      if (sorteo.imagen4) formDataConfirm.append('imagen4', sorteo.imagen4);
      formDataConfirm.append('titulo', sorteo.titulo);
      formDataConfirm.append('fecha_finalizacion', sorteo.fechaFinalizacion);
      formDataConfirm.append('descripcion', sorteo.descripcion);
      formDataConfirm.append('precio_boleto', sorteo.precioBoleto);
      formDataConfirm.append('total_tickets', sorteo.cantidadBoletos);
      formDataConfirm.append('confirm', 'true');

      response = await fetch(`${API_URL}/api/sorteo`, {
        method: 'POST',
        body: formDataConfirm
      });
      data = await response.json();
    }

    alert(data.message);
  };

  // Handlers para métodos de pago
  const handleMetodoTransferencias = (e) => {
    e.preventDefault();
    alert("Método Transferencias y Cajero actualizado");
  };

  const handleMetodoOxxo = (e) => {
    e.preventDefault();
    alert("Método Oxxo / 7eleven / Farmacias actualizado");
  };

  const handleMetodoPagosUSA = (e) => {
    e.preventDefault();
    alert("Método Pagos USA actualizado");
  };

  return (
    <div className="admin-panel">
      <h2>Panel de Administrador</h2>
 
      {/* Sección para crear un sorteo */}
      <section className="sorteo-section">
        <h3>Crear Sorteo</h3>
        <form onSubmit={handleSorteoSubmit} encType="multipart/form-data">
          <label>Título del sorteo:</label>
          <input 
            type="text" 
            value={sorteo.titulo}
            onChange={(e) => setSorteo({ ...sorteo, titulo: e.target.value })}
            required
          />
          <label>Imagen 1:</label>
          <input 
            type="file" 
            onChange={(e) => setSorteo({ ...sorteo, imagen1: e.target.files[0] })}
            required
          />
          <label>Imagen 2:</label>
          <input 
            type="file" 
            onChange={(e) => setSorteo({ ...sorteo, imagen2: e.target.files[0] })}
          />
          <label>Imagen 3:</label>
          <input 
            type="file" 
            onChange={(e) => setSorteo({ ...sorteo, imagen3: e.target.files[0] })}
          />
          <label>Imagen 4:</label>
          <input 
            type="file" 
            onChange={(e) => setSorteo({ ...sorteo, imagen4: e.target.files[0] })}
          />
          <label>Fecha de finalización:</label>
          <input 
            type="date" 
            value={sorteo.fechaFinalizacion} 
            onChange={(e) => setSorteo({ ...sorteo, fechaFinalizacion: e.target.value })}
            required 
          />
          {currentSorteoId && (
            <div className='BotonActualizar'>
              <button 
                type="button" 
                onClick={() => handleUpdateFechaSorteo(currentSorteoId, sorteo.fechaFinalizacion)}
              >
                Actualizar Fecha
              </button>
            </div>
          )}
          <label>Descripción:</label>
          <textarea 
            value={sorteo.descripcion} 
            onChange={(e) => setSorteo({ ...sorteo, descripcion: e.target.value })}
            required
          ></textarea>
          <label>Precio del boleto:</label>
          <input 
            type="number" 
            value={sorteo.precioBoleto} 
            onWheelCapture={(e) => e.target.blur()}
            onChange={(e) => setSorteo({ ...sorteo, precioBoleto: e.target.value })}
            required 
          />

          <label>Cantidad de boletos:</label>
          <input 
            type="number" 
            value={sorteo.cantidadBoletos} 
            onWheelCapture={(e) => e.target.blur()}
            onChange={(e) => setSorteo({ ...sorteo, cantidadBoletos: e.target.value })}
            required 
          />
          <button type="submit">Crear Sorteo</button>
        </form>
      </section>

      {/* Sección para gestionar solicitudes de tickets apartados */}
      <section className="tickets-matriz">
        <h3>Solicitudes de Tickets Apartados</h3>
        <div className="matrix">
          {tickets.filter(ticket => ticket.estado === "apartado").length > 0 ? (
            tickets
              .filter(ticket => ticket.estado === "apartado")
              .map((ticket, index) => (
                <div key={ticket.ticket_id || index} className="ticket ticket-pendiente">
                  <span>Ticket #{ticket.numero_ticket}</span>
                  <p>Usuario: {ticket.nombre || "Sin asignar"}</p>
                  <p>Teléfono: {ticket.telefono || "Sin asignar"}</p>
                  <div className="botones-accion">
                    <button className= "BotonAceptar" onClick={() => handleAcceptTicket(ticket.ticket_id)}>Aceptar</button>
                    <button className= "BotonRechazar" onClick={() => handleRejectTicket(ticket.ticket_id)}>Rechazar</button>
                  </div>
                </div>
              ))
          ) : (
            <p>No hay solicitudes de tickets apartados.</p>
          )}
        </div>
      </section>


      <section className="tickets-matriz">
        <h3>Lista de vendidos</h3>
        <div className="matrix">
          {tickets.filter(ticket => ticket.estado === "vendido").length > 0 ? (
            tickets
              .filter(ticket => ticket.estado === "vendido")
              .map((ticket, index) => (
                <div key={ticket.ticket_id || index} className="ticket ticket-apartado">
                  <span>Ticket #{ticket.numero_ticket}</span>
                  <p>Usuario: {ticket.nombre || "Sin asignar"}</p>
                  <p>Teléfono: {ticket.telefono || "Sin asignar"}</p>
                  <div className="botones-accion">
                    {/* Acciones si es necesario */}
                  </div>
                </div>
              ))
          ) : (
            <p>No hay tickets apartados.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default AdministradorPage;
