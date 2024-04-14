const express = require('express');
const usersTable = require('./models').User;
const EmailService = require('./emailService');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/add-user', async (req, res) => {
  console.log(req.body);
  try {
    const data = await usersTable.findOne({
      where: {
        Email: req.body.Email,
      },
    });

    if (data) {
      return res
        .status(400)
        .json({ status: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(req.body.Password, 10);
    const success = await usersTable.create({
      ...req.body,
      Password: hashedPassword,
    });
    await EmailService.sendEmail(
      req.body.Email,
      'Please change your password',
      `Credential to login only for the first time Email:${req.body.Email} password:${req.body.Password}`
    );

    return res
      .status(200)
      .json({ status: true, message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: 'Failed to create user' });
  }
});

router.get('/', (req, res) => {
  res.json({
    status: true,
    message: 'Welcome to nodejs API',
  });
});

module.exports = router;
