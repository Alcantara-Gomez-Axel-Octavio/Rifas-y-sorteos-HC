const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static('uploads'));

// Configuración de Multer para la subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Asegúrate de que la carpeta "uploads" exista en el proyecto
  },
  filename: (req, file, cb) => {
    // Agrega la fecha para evitar duplicados
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Configuración del pool de conexiones MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,      
  user: process.env.DB_USER,      
  password: process.env.DB_PASS,  
  database: process.env.DB_NAME,  
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
      // Opcional: generar un token JWT para el usuario
      // const token = jwt.sign({ id: admin.admin_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
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

app.get('/api/sorteos', (req, res) => {
  pool.query('SELECT * FROM sorteos ORDER BY created_at DESC LIMIT 1', (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error en el servidor", error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "No hay sorteo activo" });
    }
    const sorteo = results[0];

    // Construir las URLs absolutas para cada imagen, si existen
    const imagen1 = sorteo.imagen1 ? `${req.protocol}://${req.get('host')}/${sorteo.imagen1.replace(/\\/g, '/')}` : null;
    const imagen2 = sorteo.imagen2 ? `${req.protocol}://${req.get('host')}/${sorteo.imagen2.replace(/\\/g, '/')}` : null;
    const imagen3 = sorteo.imagen3 ? `${req.protocol}://${req.get('host')}/${sorteo.imagen3.replace(/\\/g, '/')}` : null;
    const imagen4 = sorteo.imagen4 ? `${req.protocol}://${req.get('host')}/${sorteo.imagen4.replace(/\\/g, '/')}` : null;

    res.json({
      ...sorteo,
      imagen1,
      imagen2,
      imagen3,
      imagen4,
    });
  });
});



// Función para insertar tickets en lotes
function insertTicketsInBatches(sorteoId, numTickets, batchSize = 1000) {
  let currentTicket = 1;
  function insertBatch() {
    const ticketsData = [];
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


//Crear sorteos
app.post('/api/sorteo', 
  upload.fields([
    { name: 'imagen1', maxCount: 1 },
    { name: 'imagen2', maxCount: 1 },
    { name: 'imagen3', maxCount: 1 },
    { name: 'imagen4', maxCount: 1 }
  ]), 
  (req, res) => {
    const { admin_id, titulo, fecha_finalizacion, descripcion, precio_boleto, total_tickets, confirm } = req.body;
    
    // Extraer las rutas de las imágenes subidas
    const imagen1 = req.files['imagen1'] ? req.files['imagen1'][0].path : '';
    const imagen2 = req.files['imagen2'] ? req.files['imagen2'][0].path : null;
    const imagen3 = req.files['imagen3'] ? req.files['imagen3'][0].path : null;
    const imagen4 = req.files['imagen4'] ? req.files['imagen4'][0].path : null;
    
    // Primero se consulta si hay un sorteo activo.
    pool.query('SELECT * FROM sorteos ORDER BY created_at DESC LIMIT 1', (err, results) => {
      if (err) {
        console.error('Error consultando sorteo:', err);
        return res.status(500).json({ message: "Error en el servidor", error: err.message });
      }
      if (results.length > 0 && !confirm) {
        return res.status(400).json({ warning: "Ya existe un sorteo activo. Al crear uno nuevo se eliminarán el sorteo anterior, todos los usuarios y los tickets. ¿Desea continuar?" });
      }

      // Obtener una conexión del pool para ejecutar todas las queries en la misma sesión.
      pool.getConnection((err, connection) => {
        if (err) {
          console.error("Error al obtener conexión:", err);
          return res.status(500).json({ message: "Error al obtener conexión", error: err.message });
        }
        // Iniciar transacción
        connection.beginTransaction(err => {
          if (err) {
            connection.release();
            console.error("Error al iniciar la transacción:", err);
            return res.status(500).json({ message: "Error al iniciar la transacción", error: err.message });
          }

          // Desactivar verificaciones de claves foráneas
          connection.query('SET FOREIGN_KEY_CHECKS = 0', err => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                console.error("Error al desactivar claves foráneas:", err);
                res.status(500).json({ message: "Error al desactivar claves foráneas", error: err.message });
              });
            }

            // Eliminar registros de tickets
            connection.query('DELETE FROM tickets', err => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  console.error("Error eliminando tickets:", err);
                  res.status(500).json({ message: "Error eliminando tickets", error: err.message });
                });
              }
              // Reiniciar AUTO_INCREMENT de tickets
              connection.query('ALTER TABLE tickets AUTO_INCREMENT = 1', err => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    console.error("Error reiniciando AUTO_INCREMENT en tickets:", err);
                    res.status(500).json({ message: "Error reiniciando AUTO_INCREMENT en tickets", error: err.message });
                  });
                }
                // Eliminar registros de sorteos
                connection.query('DELETE FROM sorteos', err => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      console.error("Error eliminando sorteos:", err);
                      res.status(500).json({ message: "Error eliminando sorteos", error: err.message });
                    });
                  }
                  // Reiniciar AUTO_INCREMENT de sorteos
                  connection.query('ALTER TABLE sorteos AUTO_INCREMENT = 1', err => {
                    if (err) {
                      return connection.rollback(() => {
                        connection.release();
                        console.error("Error reiniciando AUTO_INCREMENT en sorteos:", err);
                        res.status(500).json({ message: "Error reiniciando AUTO_INCREMENT en sorteos", error: err.message });
                      });
                    }
                    // Eliminar registros de usuarios
                    connection.query('DELETE FROM usuarios', err => {
                      if (err) {
                        return connection.rollback(() => {
                          connection.release();
                          console.error("Error eliminando usuarios:", err);
                          res.status(500).json({ message: "Error eliminando usuarios", error: err.message });
                        });
                      }
                      // Reiniciar AUTO_INCREMENT de usuarios
                      connection.query('ALTER TABLE usuarios AUTO_INCREMENT = 1', err => {
                        if (err) {
                          return connection.rollback(() => {
                            connection.release();
                            console.error("Error reiniciando AUTO_INCREMENT en usuarios:", err);
                            res.status(500).json({ message: "Error reiniciando AUTO_INCREMENT en usuarios", error: err.message });
                          });
                        }
                        // Reactivar verificaciones de claves foráneas
                        connection.query('SET FOREIGN_KEY_CHECKS = 1', err => {
                          if (err) {
                            return connection.rollback(() => {
                              connection.release();
                              console.error("Error al reactivar claves foráneas:", err);
                              res.status(500).json({ message: "Error al reactivar claves foráneas", error: err.message });
                            });
                          }

                          // Insertar el nuevo sorteo con los nuevos campos
                          const query = `
                            INSERT INTO sorteos 
                            (admin_id, titulo, imagen1, imagen2, imagen3, imagen4, fecha_finalizacion, descripcion, precio_boleto, total_tickets) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                          `;
                          connection.query(query, [admin_id, titulo, imagen1, imagen2, imagen3, imagen4, fecha_finalizacion, descripcion, precio_boleto, total_tickets || 60000], (errInsert, insertResult) => {
                            if (errInsert) {
                              return connection.rollback(() => {
                                connection.release();
                                console.error("Error al crear sorteo:", errInsert);
                                res.status(500).json({ message: "Error al crear sorteo", error: errInsert.message });
                              });
                            }

                            const sorteoId = insertResult.insertId;
                            const numTickets = total_tickets || 60000;

                            // Hacer commit de la transacción
                            connection.commit(err => {
                              if (err) {
                                return connection.rollback(() => {
                                  connection.release();
                                  console.error("Error al hacer commit:", err);
                                  res.status(500).json({ message: "Error al hacer commit", error: err.message });
                                });
                              }
                              connection.release();
                              // Insertar tickets en lotes
                              insertTicketsInBatches(sorteoId, numTickets)
                                .then(() => {
                                  res.json({ message: "Sorteo y tickets creados exitosamente", sorteo_id: sorteoId });
                                })
                                .catch(errTickets => {
                                  console.error("Error al generar tickets en lotes:", errTickets);
                                  res.status(500).json({ message: "Error al generar tickets", error: errTickets.message });
                                });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
});




// Endpoint para obtener todos los tickets
app.get('/api/tickets', (req, res) => {
  const query = `
    SELECT t.*, u.nombre, u.telefono
    FROM tickets t
    LEFT JOIN usuarios u ON t.usuario_id = u.usuario_id
  `;
  pool.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.json(results);
  });
});

// Endpoint para registrar nuevos usuarios
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


// Endpoint para actualizar la fecha de finalización de un sorteo
app.put('/api/sorteos/:sorteoId/updateFecha', (req, res) => {
  const { sorteoId } = req.params;
  const { fecha_finalizacion } = req.body; // Se espera recibir la nueva fecha en el body

  if (!fecha_finalizacion) {
    return res.status(400).json({ message: "La fecha de finalización es requerida." });
  }

  const query = `
    UPDATE sorteos 
    SET fecha_finalizacion = ? 
    WHERE sorteo_id = ?
  `;

  pool.query(query, [fecha_finalizacion, sorteoId], (err, result) => {
    if (err) {
      console.error("Error al actualizar la fecha de finalización:", err);
      return res.status(500).json({ message: "Error al actualizar la fecha de finalización", error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Sorteo no encontrado." });
    }

    res.json({ sorteo_id: sorteoId, fecha_finalizacion, message: "Fecha de finalización actualizada correctamente." });
  });
});




// Servidor corriendo en el puerto 3001
app.listen(3001, () => console.log('Servidor en puerto 3001'));
