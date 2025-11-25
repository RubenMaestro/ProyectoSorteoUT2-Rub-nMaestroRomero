const express = require("express");
const router = express.Router();
const Participante = require("../models/Participante");
const Ganador = require("../models/Ganador");

// Obtener ganador guardado (último)
router.get("/", async (req, res) => {
  try {
    const ganador = await Ganador.findOne().sort({ fechaGanador: -1 });
    if (!ganador) return res.json({ ok: false, message: "No hay ganador" });
    res.json({ ok: true, ganador });
  } catch (error) {
    console.error("Error obteniendo ganador:", error);
    res.status(500).json({ ok: false, error: "Error interno" });
  }
});

// Sortear ganador (genera uno nuevo, borra anterior)
router.get("/sortear", async (req, res) => {
  try {
    // Borrar ganador anterior 
    await Ganador.deleteMany({});

    const participantes = await Participante.find();
    if (!participantes.length) {
      return res.status(400).json({ ok: false, message: "No hay participantes" });
    }

    const elegido = participantes[Math.floor(Math.random() * participantes.length)];

    const ganadorGuardado = new Ganador({
      nombre: elegido.nombre,
      apellidos: elegido.apellidos,
      email: elegido.email,
      telefono: elegido.telefono
    });

    await ganadorGuardado.save();

    res.json({ ok: true, ganador: ganadorGuardado });
  } catch (error) {
    console.error("Error sorteando ganador:", error);
    res.status(500).json({ ok: false, message: "Error en el sorteo" });
  }
});

// Resolver sorteo 
router.get("/resolver", async (req, res) => {
  try {
    // Si ya hay ganador, usarlo; si no, sortear y guardar
    let ganador = await Ganador.findOne().sort({ fechaGanador: -1 });

    if (!ganador) {
      const participantes = await Participante.find();
      if (!participantes.length) return res.send("<h2>No hay participantes para generar ganador.</h2>");

      const elegido = participantes[Math.floor(Math.random() * participantes.length)];
      ganador = new Ganador({
        nombre: elegido.nombre,
        apellidos: elegido.apellidos,
        email: elegido.email,
        telefono: elegido.telefono
      });
      await ganador.save();
    }

    const nombre = encodeURIComponent(ganador.nombre);
    const apellidos = encodeURIComponent(ganador.apellidos);

    res.redirect(`/ganador.html?nombre=${nombre}&apellidos=${apellidos}`);
  } catch (error) {
    console.error("Error resolviendo sorteo:", error);
    res.status(500).send("Error al resolver el sorteo.");
  }
});

// Reiniciar todo (participantes + ganadores)
router.delete("/reiniciarTodo", async (req, res) => {
  try {
    await Participante.deleteMany({});
    await Ganador.deleteMany({});
    res.json({ ok: true, mensaje: "Sorteo reiniciado (participantes y ganadores borrados)" });
  } catch (error) {
    console.error("Error reiniciando todo:", error);
    res.status(500).json({ ok: false, error: "Error reiniciando datos" });
  }
});

module.exports = router;
