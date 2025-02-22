const bcrypt = require('bcrypt');

const password = '12345'; // Cambia esto por la contraseña deseada

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error al generar el hash:', err);
    return;
  }
  console.log('Hash generado:', hash);
});
