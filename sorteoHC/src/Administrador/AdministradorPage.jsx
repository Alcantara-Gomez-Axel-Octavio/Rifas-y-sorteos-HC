import React, { useState, useEffect } from 'react';
import HeaderArea from '../HeaderArea/HeaderArea';
import "./AdministradorPage.css";

function AdministradorPage() {
  // Estado para el sorteo (se mantiene la lógica para crear un sorteo)
  const [sorteo, setSorteo] = useState({
    imagen: null,
    fechaFinalizacion: "",
    descripcion: "",
    precioBoleto: "",
    cantidadBoletos: ""
  });

  // Estados para métodos de pago (se mantienen)
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

  // Estado para los tickets (los datos se extraen de la BD)
  const [tickets, setTickets] = useState([]);

  // Se consulta el endpoint de tickets al cargar el componente
  useEffect(() => {
    fetch('/api/tickets')
      .then(response => response.json())
      .then(data => {
        // Se asume que 'data' es un arreglo de objetos ticket
        setTickets(data);
      })
      .catch(err => console.error("Error al obtener tickets:", err));
  }, []);

  // Función para aceptar la compra de un ticket
  const handleAcceptTicket = (ticketId) => {
    fetch(`/api/tickets/${ticketId}/accept`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(updatedTicket => {
      // Actualiza el estado de los tickets localmente
      setTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket.id === updatedTicket.id ? updatedTicket : ticket
        )
      );
    })
    .catch(err => console.error("Error al aceptar el ticket:", err));
  };

  const handleRejectTicket = (ticketId) => {
    fetch(`http://localhost:3001/api/tickets/${ticketId}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(updatedTicket => {
        // Actualiza el estado local de los tickets
        setTickets(prevTickets =>
          prevTickets.map(ticket =>
            ticket.ticket_id === updatedTicket.ticket_id ? updatedTicket : ticket
          )
        );
      })
      .catch(err => console.error("Error al rechazar el ticket:", err));
  };


  // Función para crear un sorteo
  const handleSorteoSubmit = async (e) => {
    e.preventDefault();
  
    // Construir el objeto del nuevo sorteo.
    // Nota: Se debe obtener el id del administrador (por ejemplo, desde el contexto o la sesión).
    const newSorteo = {
      admin_id: 1, 
      // Para simplificar, se usa el nombre del archivo; en producción se puede usar FormData y un manejador de carga.
      imagen: sorteo.imagen.name,  
      fecha_finalizacion: sorteo.fechaFinalizacion,
      descripcion: sorteo.descripcion,
      precio_boleto: sorteo.precioBoleto,
      total_tickets: sorteo.cantidadBoletos,
    };
  
    // Enviar solicitud inicial
    let response = await fetch('/api/sorteo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newSorteo)
    });
  
    let data = await response.json();
  
    // Si la respuesta es 400 y hay advertencia, solicitar confirmación al usuario
    if (response.status === 400 && data.warning) {
      const confirmed = window.confirm(data.warning);
      if (!confirmed) return;
  
      // Si el usuario confirma, se reenvía la solicitud con confirmación
      newSorteo.confirm = true;
      response = await fetch('/api/sorteo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSorteo)
      });
      data = await response.json();
    }
  
    alert(data.message);
  };



  // Handlers para actualizar métodos de pago
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
      <nav className="admin-nav">
        <button>Crear Sorteo</button>
        <button>Ver Tickets</button>
        <button>Métodos de Pago</button>
      </nav>

      {/* Sección para crear un sorteo */}
      <section className="sorteo-section">
        <h3>Crear Sorteo</h3>
        <form onSubmit={handleSorteoSubmit}>
          <label>Imagen del sorteo:</label>
          <input 
            type="file" 
            onChange={(e) => setSorteo({ ...sorteo, imagen: e.target.files[0] })}
            required
          />
          <label>Fecha de finalización:</label>
          <input 
            type="date" 
            value={sorteo.fechaFinalizacion} 
            onChange={(e)=> setSorteo({ ...sorteo, fechaFinalizacion: e.target.value })}
            required 
          />
          <label>Descripción:</label>
          <textarea 
            value={sorteo.descripcion} 
            onChange={(e)=> setSorteo({ ...sorteo, descripcion: e.target.value })}
            required
          ></textarea>
          <label>Precio del boleto:</label>
          <input 
            type="number" 
            value={sorteo.precioBoleto} 
            onChange={(e)=> setSorteo({ ...sorteo, precioBoleto: e.target.value })}
            required 
          />
          <label>Cantidad de boletos:</label>
          <input 
            type="number" 
            value={sorteo.cantidadBoletos} 
            onChange={(e)=> setSorteo({ ...sorteo, cantidadBoletos: e.target.value })}
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
                <div 
                  key={ticket.ticket_id || index} 
                  className="ticket ticket-apartado"
                >
                  <span>Ticket #{ticket.numero_ticket}</span>
                  <div className="botones-accion">
                    <button 
                      className="btn-aceptar" 
                      onClick={() => handleAcceptTicket(ticket.ticket_id)}
                    >
                      Aceptar
                    </button>
                    <button 
                      className="btn-rechazar" 
                      onClick={() => handleRejectTicket(ticket.ticket_id)}
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <p>No hay tickets apartados.</p>
          )}
        </div>
        <p>*Revise las solicitudes y actúe en consecuencia.</p>
      </section>


      {/* Sección para métodos de pago */}
      <section className="metodos-pago">
        <h3>Métodos de Pago</h3>

        <div className="metodo-transferencias">
          <h4>Exclusivo Transferencias y Cajero</h4>
          <form onSubmit={handleMetodoTransferencias}>
            <label>Banco:</label>
            <input 
              type="text" 
              value={metodoTransferencias.banco} 
              onChange={(e)=> setMetodoTransferencias({ ...metodoTransferencias, banco: e.target.value })}
              required
            />
            <label>Nombre:</label>
            <input 
              type="text" 
              value={metodoTransferencias.nombre} 
              onChange={(e)=> setMetodoTransferencias({ ...metodoTransferencias, nombre: e.target.value })}
              required
            />
            <label>CLABE:</label>
            <input 
              type="text" 
              value={metodoTransferencias.clabe} 
              onChange={(e)=> setMetodoTransferencias({ ...metodoTransferencias, clabe: e.target.value })}
              required
            />
            <button type="submit">Actualizar</button>
          </form>
        </div>

        <div className="metodo-oxxo">
          <h4>Pago en Oxxo, 7eleven, Farmacias</h4>
          <form onSubmit={handleMetodoOxxo}>
            <label>Banco:</label>
            <input 
              type="text" 
              value={metodoOxxo.banco} 
              onChange={(e)=> setMetodoOxxo({ ...metodoOxxo, banco: e.target.value })}
              required
            />
            <label>Número de tarjeta:</label>
            <input 
              type="text" 
              value={metodoOxxo.numeroTarjeta} 
              onChange={(e)=> setMetodoOxxo({ ...metodoOxxo, numeroTarjeta: e.target.value })}
              required
            />
            <button type="submit">Actualizar</button>
          </form>
        </div>

        <div className="metodo-pagos-usa">
          <h4>Exclusivo Pagos USA</h4>
          <form onSubmit={handleMetodoPagosUSA}>
            <label>Banco:</label>
            <input 
              type="text" 
              value={metodoPagosUSA.banco} 
              onChange={(e)=> setMetodoPagosUSA({ ...metodoPagosUSA, banco: e.target.value })}
              required
            />
            <label>Nombre:</label>
            <input 
              type="text" 
              value={metodoPagosUSA.nombre} 
              onChange={(e)=> setMetodoPagosUSA({ ...metodoPagosUSA, nombre: e.target.value })}
              required
            />
            <label>Número de tarjeta:</label>
            <input 
              type="text" 
              value={metodoPagosUSA.numeroTarjeta} 
              onChange={(e)=> setMetodoPagosUSA({ ...metodoPagosUSA, numeroTarjeta: e.target.value })}
              required
            />
            <button type="submit">Actualizar</button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default AdministradorPage;
