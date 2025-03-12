import React, { useState, useEffect } from 'react';
import HeaderArea from '../HeaderArea/HeaderArea.jsx';
import "./EstatusDeBoletoPage.css";

const API_URL = import.meta.env.VITE_API_URL;


function EstatusDeBoletoPage() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredTicket, setFilteredTicket] = useState(null);

  useEffect(() => {
    const fetchTickets = () => {
      fetch(`${API_URL}/api/tickets`)
        .then(response => response.json())
        .then(data => {
          console.log("Tickets recibidos:", data);
          setTickets(data);
        })
        .catch(err => console.error("Error al obtener tickets:", err));
    };

    fetchTickets();
    const interval = setInterval(fetchTickets, 5000); // Actualiza cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    const normalizedSearch = search.trim(); // Eliminar espacios extra
    const foundTicket = tickets.find(ticket => String(ticket.numero_ticket) === normalizedSearch); // Comparar como strings

    if (foundTicket) {
      setFilteredTicket(foundTicket);
    } else {
      setFilteredTicket(null);
    }
  };

  return (
    <div className='FullScreeen'>
      <div className='ContenedorHeader'>
        <HeaderArea />
      </div>

      <div className="ContenedorInformacion">
        <h2>Consulta el estatus de tu boleto</h2>
      </div>

      <div className="search-container">
        <input className='IngresarNumeroTicket'
          type="text" 
          placeholder="Ingrese el número de ticket" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch} className="BotonBuscar">Buscar</button>
      </div>

      {filteredTicket ? (
        <div className="ticket-info">
          <h3>Información del Ticket</h3>
          <p><strong>Número de Ticket:</strong> {filteredTicket.numero_ticket}</p>
          <p><strong>Estado:</strong> {filteredTicket.estado}</p>
          {filteredTicket.estado === "apartado" && (
            <p><strong>Nombre del comprador:</strong> {filteredTicket.nombre || "No disponible"}</p>
          )}
          {filteredTicket.estado === "vendido" && (
            <p><strong>Nombre del comprador:</strong> {filteredTicket.nombre || "Desconocido"}</p>
          )}
        </div>
      ) : search !== "" ? (
        <div className='ticket-info'> 
          <p>Pulse "buscar" para mostrar la informacion del boleto: {search}.</p>
        </div>
      ) : null}
    </div>
  );
}

export default EstatusDeBoletoPage;
