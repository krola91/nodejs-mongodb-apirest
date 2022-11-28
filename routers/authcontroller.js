const { Router } = require("express");
const router = Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../config");
const nodemailer = require("nodemailer");

// Sign up
router.post("/signup", async (req, res) => {
  const { username, email, password, valid } = req.body;
  const user = new User({
    username,
    email,
    password,
    valid,
  });
  user.password = await user.encryptPassword(user.password);
  await user.save();
  const token = jwt.sign({ id: user._id }, config.secret, {
    expiresIn: 60 * 60 * 24,
  });
  res.json({ auth: true, token });
});

// Access to data
router.get("/me", async (req, res) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).json({
      auth: false,
      message: "No token provided",
    });
  }

  const decoded = jwt.verify(token, config.secret);
  const user = await User.findById(decoded.id, { password: 0 });
  if (!user) {
    return res.status(404).send("No user found");
  }
  res.json(user);
});

// Validate user with token
router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });
  if (!user) {
    return res.status(404).send("User does not exist");
  }

  const validPassword = await user.validatePassword(password);
  if (!validPassword) {
    return res.status(401).json({ auth: false, token: null });
  }

  const token = jwt.sign({ id: user._id }, config.secret, {
    expiresIn: 60 * 60 * 24,
  });
  res.json({ auth: true, token });
});

// // Validates with a url to send a email
// router.get("/:id/validate", async (req, res) => {
//   const { username, password, email, id } = req.body;
//   const user = await User.findOne({ username: username });
//   if (!user) {
//     return res.status(404).send("User does not exist");
//   }

//   const validPassword = await user.validatePassword(password);
//   if (!validPassword) {
//     return res.status(401).json({ auth: false, token: null });
//   }

//   const token = jwt.sign({ id: user._id }, config.secret, {
//     expiresIn: 60 * 60 * 24,
//   });

//   res.json({ auth: true, valid: true, token });

//   let testAccount = await nodemailer.createTestAccount();
//   const transporter = nodemailer.createTransport({
//     host: "pop.hostinger.com",
//     port: 995,
//     secure: false,
//     auth: {
//       user: "test@ihackedgringotts.com",
//       pass: "Testprueba1@",
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   });
//   const info = await transporter.sendMail({
//     from: "'krolaServer' <test@ihackedgringotts.com>",
//     to: "vallejotrabajocaro@gmail.com",
//     subjet: "Prueba de envios de correo",
//     text: "http://localhost:3000/entertheid/validate",
//     html: `<h1>User information</h1>
//     <ul>
//     <li>Username: ${username}</li>
//     <li>User email: ${email}</li>
//     <li>User password: ${id}</li>
//     </ul>`,
//   });
//   console.log("Message sent: %s", info.messageId);
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
// });

module.exports = router;
