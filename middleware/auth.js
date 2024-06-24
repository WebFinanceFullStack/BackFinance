const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Obtener el token del encabezado
  const token = req.header('Authorization').split(' ')[1];

  // Verificar si no hay token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verificar el token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
