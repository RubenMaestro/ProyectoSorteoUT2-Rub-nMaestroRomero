require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const participantesRoutes = require('./routes/participantes');
const ganadoresRoutes = require('./routes/ganadores');

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(cookieParser());

// Conexión MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("ERROR: Debes definir MONGODB_URI en .env");
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Error conectando a MongoDB:", err));

// Rutas API
app.use('/api/participantes', participantesRoutes);
app.use('/api/ganadores', ganadoresRoutes);

// Servir frontend
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
