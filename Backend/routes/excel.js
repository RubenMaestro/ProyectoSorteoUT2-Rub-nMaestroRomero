const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const generarExcel = require("../excel");

router.get("/descargar", async (req, res) => {
  try {
    // Regenera/genera el excel antes de descargar
    const filePath = await generarExcel();
    if (!fs.existsSync(filePath)) return res.status(404).send("Archivo no encontrado");
    res.download(filePath, "participantes.xlsx");
  } catch (error) {
    console.error("Error descargando excel:", error);
    res.status(500).send("Error generando o descargando Excel");
  }
});

module.exports = router;
