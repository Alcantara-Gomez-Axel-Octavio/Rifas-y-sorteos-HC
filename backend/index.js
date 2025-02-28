const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Usando un pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST,      // ej: 'localhost'
  user: process.env.DB_USER,      // ej: 'root'
  password: process.env.DB_PASS,  // tu contraseña
  database: process.env.DB_NAME,  // ej: 'u938863753_sorteoHC'
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Prueba de conexión
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar a la BD:', err);
  } else {
    console.log('Conexión exitosa con el pool de conexiones.');
    connection.release();
  }
});

// Ruta para manejar el login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  pool.query('SELECT * FROM administradores WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error en la consulta de login:', err);
      return res.status(500).json({ message: 'Error en el servidor', error: err.message });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const admin = results[0];

    bcrypt.compare(password, admin.password, (err, match) => {
      if (err) {
        console.error('Error al verificar la contraseña:', err);
        return res.status(500).json({ message: 'Error al verificar la contraseña', error: err.message });
      }

      if (!match) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      // Es recomendable no enviar el hash de la contraseña al cliente
      const { password, ...adminWithoutPassword } = admin;
      res.json({ message: '✅ Inicio de sesión exitoso', admin: adminWithoutPassword });
    });
  });
});


// Middleware para verificar el token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No autorizado" });

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token inválido" });
    req.user = decoded;
    next();
  });
};

// Ruta protegida de administrador
app.get("/api/admin", verifyToken, (req, res) => {
  res.json({ message: "Acceso autorizado a administrador", user: req.user });
});




// Función para insertar tickets en lotes
function insertTicketsInBatches(sorteoId, numTickets, batchSize = 1000) {
  let currentTicket = 1;
  function insertBatch() {
    const ticketsData = [];
    // Prepara el lote actual
    for (let i = currentTicket; i < currentTicket + batchSize && i <= numTickets; i++) {
      ticketsData.push([sorteoId, i, 'disponible']);
    }
    if (ticketsData.length === 0) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const queryTickets = 'INSERT INTO tickets (sorteo_id, numero_ticket, estado) VALUES ?';
      pool.query(queryTickets, [ticketsData], (err, result) => {
        if (err) return reject(err);
        currentTicket += ticketsData.length;
        resolve();
      });
    }).then(() => {
      if (currentTicket <= numTickets) {
        return insertBatch();
      }
    });
  }
  return insertBatch();
}

// Endpoint para crear sorteo y generar tickets
app.post('/api/sorteo', (req, res) => {
  const { admin_id, imagen, fecha_finalizacion, descripcion, precio_boleto, total_tickets, confirm } = req.body;

  // Consulta si ya existe un sorteo activo
  pool.query('SELECT * FROM sorteos ORDER BY created_at DESC LIMIT 1', (err, results) => {
    if (err) {
      console.error('Error consultando sorteo:', err);
      return res.status(500).json({ message: "Error en el servidor", error: err.message });
    }

    // Si existe un sorteo y no se ha enviado confirmación
    if (results.length > 0 && !confirm) {
      return res.status(400).json({ warning: "Ya existe un sorteo activo. Al crear uno nuevo, se eliminará el sorteo anterior. ¿Desea continuar?" });
    }

    // Función interna para insertar el nuevo sorteo y generar tickets
    function insertNewSorteo() {
      const query = 'INSERT INTO sorteos (admin_id, imagen, fecha_finalizacion, descripcion, precio_boleto, total_tickets) VALUES (?, ?, ?, ?, ?, ?)';
      pool.query(query, [admin_id, imagen, fecha_finalizacion, descripcion, precio_boleto, total_tickets || 60000], (err3, insertResult) => {
        if (err3) {
          console.error('Error al crear sorteo:', err3);
          return res.status(500).json({ message: "Error al crear sorteo", error: err3.message });
        }

        const sorteoId = insertResult.insertId;
        const numTickets = total_tickets || 60000;

        // Insertar los tickets en lotes
        insertTicketsInBatches(sorteoId, numTickets)
          .then(() => {
            res.json({ message: "Sorteo y tickets creados exitosamente", sorteo_id: sorteoId });
          })
          .catch(errTickets => {
            console.error('Error al generar tickets en lotes:', errTickets);
            res.status(500).json({ message: "Error al generar tickets", error: errTickets.message });
          });
      });
    }

    // Si ya existe sorteo y se confirmó, se borra el anterior y luego se inserta el nuevo
    if (results.length > 0 && confirm) {
      pool.query('DELETE FROM sorteos', (err2, deleteResult) => {
        if (err2) {
          console.error('Error al borrar sorteo anterior:', err2);
          return res.status(500).json({ message: "Error al borrar sorteo anterior", error: err2.message });
        }
        insertNewSorteo();
      });
    } else {
      // Si no existe sorteo previo, simplemente crea uno nuevo
      insertNewSorteo();
    }
  });
});

app.get('/api/tickets', (req, res) => {
  pool.query('SELECT * FROM tickets', (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.json(results);
  });
});






app.post('/api/registroUsuarios', (req, res) => {
  const { nombre, email, numero } = req.body;

  pool.query('INSERT INTO usuarios (nombre, correo, telefono) VALUES (?, ?, ?)', [nombre, email, numero], (err, result) => {
    if (err) {
      console.error('Error al registrar usuario:', err);
      return res.status(500).json({ message: 'Error al registrar usuario', error: err.message });
    }

    res.json({ message: 'Usuario registrado exitosamente', usuario_id: result.insertId });
  });
});


// Endpoint para actualizar el estado de los tickets y vincularlos al usuario
app.post('/api/apartarTickets', (req, res) => {
  const { usuario_id, ticket_ids } = req.body;

  if (!usuario_id || !ticket_ids || !ticket_ids.length) {
    return res.status(400).json({ message: 'Parametros incompletos' });
  }

  const query = `
    UPDATE tickets 
    SET estado = 'apartado', 
        usuario_id = ?, 
        reserved_at = NOW() 
    WHERE ticket_id IN (?)
  `;

  pool.query(query, [usuario_id, ticket_ids], (err, result) => {
    if (err) {
      console.error('Error al actualizar tickets:', err);
      return res.status(500).json({ message: 'Error al actualizar tickets', error: err.message });
    }
    res.json({ message: 'Tickets apartados exitosamente' });
  });
});





// Función para aceptar un ticket (cambia el estado a "vendido")
// Función para obtener tickets (útil para refrescar la lista)
const fetchTickets = () => {
  fetch("http://localhost:3001/api/tickets")
    .then(response => response.json())
    .then(data => setTickets(data))
    .catch(err => console.error("Error al obtener tickets:", err));
};

// Función para aceptar un ticket (cambia estado a "vendido")
const handleAcceptTicket = (ticketId) => {
  fetch(`http://localhost:3001/api/tickets/${ticketId}/accept`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json())
    .then(updatedTicket => {
      console.log("Ticket aceptado:", updatedTicket);
      // Puedes actualizar el estado local o volver a obtener los tickets
      fetchTickets();
    })
    .catch(err => console.error("Error al aceptar el ticket:", err));
};

// Función para rechazar un ticket (vuelve a "disponible" y elimina info del usuario)
const handleRejectTicket = (ticketId) => {
  fetch(`http://localhost:3001/api/tickets/${ticketId}/reject`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json())
    .then(updatedTicket => {
      console.log("Ticket rechazado:", updatedTicket);
      // Refrescar la lista sin recargar la página
      fetchTickets();
    })
    .catch(err => console.error("Error al rechazar el ticket:", err));
};


// Endpoint para aceptar un ticket (cambiar estado a "vendido")
app.put('/api/tickets/:ticketId/accept', (req, res) => {
  const { ticketId } = req.params;
  const query = `
    UPDATE tickets 
    SET estado = 'vendido', confirmed_at = NOW() 
    WHERE ticket_id = ?
  `;
  pool.query(query, [ticketId], (err, result) => {
    if (err) {
      console.error("Error al actualizar ticket:", err);
      return res.status(500).json({ message: "Error al actualizar ticket", error: err.message });
    }
    // Puedes devolver el ticket actualizado (aquí solo devolvemos el id y el nuevo estado)
    res.json({ ticket_id: ticketId, estado: 'vendido', message: "Ticket aceptado correctamente" });
  });
});

// Endpoint para rechazar un ticket (volver a "disponible" y eliminar info del usuario)
app.put('/api/tickets/:ticketId/reject', (req, res) => {
  const { ticketId } = req.params;
  const query = `
    UPDATE tickets 
    SET estado = 'disponible', usuario_id = NULL, reserved_at = NULL, confirmed_at = NULL 
    WHERE ticket_id = ?
  `;
  pool.query(query, [ticketId], (err, result) => {
    if (err) {
      console.error("Error al actualizar ticket:", err);
      return res.status(500).json({ message: "Error al actualizar ticket", error: err.message });
    }
    res.json({ ticket_id: ticketId, estado: 'disponible', message: "Ticket rechazado correctamente" });
  });
});










// Servidor corriendo en el puerto 3001
app.listen(3001, () => console.log('Servidor en puerto 3001'));
