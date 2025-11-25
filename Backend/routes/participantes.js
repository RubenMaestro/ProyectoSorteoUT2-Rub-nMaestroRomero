const express = require("express");
const router = express.Router();
const Participante = require("../models/Participante");
const generarExcel = require("../excel");

// Añadir participante
router.post("/", async (req, res) => {
  try {
    const body = req.body;

    if (!body.nombre || !body.apellidos || !body.email) {
      return res.status(400).json({ ok: false, message: "Faltan campos obligatorios" });
    }

    // Comprobación correcta (que tengan un email no repetido)
    const repetido = await Participante.findOne({ email: body.email });
    if (repetido) {
      return res.status(400).json({
        ok: false,
        message: "Ya estás registrado. Solo puedes participar una vez."
      });
    }

    const nuevo = new Participante({
      nombre: body.nombre,
      apellidos: body.apellidos,
      email: body.email,
      telefono: body.telefono,
      fechaNacimiento: body.fechaNacimiento,
      acepta: body.acepta,
      cookies: body.cookies || {}
    });

    await nuevo.save();
    await generarExcel(); // generar excel automático

    res.json({ ok: true, message: "Participante guardado", participante: nuevo });

  } catch (err) {
    console.error("Error guardando participante:", err);
    res.status(500).json({ ok: false, message: err.message || "Error interno" });
  }
});

// Obtener participantes
router.get("/", async (req, res) => {
  try {
    const lista = await Participante.find().sort({ fechaRegistro: -1 });
    res.json(lista);
  } catch (err) {
    console.error("Error obteniendo participantes:", err);
    res.status(500).json({ error: err.message || "Error interno" });
  }
});

// Reiniciar participantes
router.delete("/reiniciar", async (req, res) => {
  try {
    await Participante.deleteMany({});
    await generarExcel();
    res.json({ ok: true, mensaje: "Participantes reiniciados correctamente" });
  } catch (error) {
    console.error("Error al reiniciar:", error);
    res.status(500).json({ ok: false, error: "Error reiniciando participantes" });
  }
});

module.exports = router;
