const mongoose = require("mongoose");

const GanadorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  email: String,
  telefono: String,
  fechaGanador: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Ganador", GanadorSchema);
