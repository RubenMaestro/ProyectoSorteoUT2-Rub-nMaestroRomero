const mongoose = require("mongoose");

const ParticipanteSchema = new mongoose.Schema({
  nombre: String,
  apellidos: String,
  email: String,
  telefono: String,
  fechaNacimiento: String,
  acepta: Boolean,
  fechaRegistro: { type: Date, default: Date.now },
  cookies: { type: Object, default: {} }   // *** AQUI GUARDAMOS COOKIES ***
});

module.exports = mongoose.model("Participante", ParticipanteSchema);
