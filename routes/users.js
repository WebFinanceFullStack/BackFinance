const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const User = require('../models/User');
const auth = require('../middleware/auth'); 


router.get('/all', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });


// Ruta para obtener los detalles del usuario
router.get('/:id', auth, async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password'); // Excluir la contraseña
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

router.post('/register', async (req, res) => {
  const { dni, fullName, birthDate, email, username, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      dni,
      fullName,
      birthDate,
      email,
      username,
      password
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
        name: user.fullName // Asegúrate de incluir el nombre del usuario en el payload
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
