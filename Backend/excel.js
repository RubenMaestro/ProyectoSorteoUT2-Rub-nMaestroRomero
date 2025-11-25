const ExcelJS = require("exceljs");
const path = require("path");
const Participante = require("./models/Participante");

module.exports = async function generarExcel() {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Participantes");
  sheet.columns = [
    { header: "Nombre", key: "nombre", width: 20 },
    { header: "Apellidos", key: "apellidos", width: 25 },
    { header: "Email", key: "email", width: 30 },
    { header: "Teléfono", key: "telefono", width: 15 },
    { header: "Fecha Nacimiento", key: "fechaNacimiento", width: 18 },
    { header: "Fecha Registro", key: "fechaRegistro", width: 22 }
  ];

  const participantes = await Participante.find().sort({ fechaRegistro: -1 });

  participantes.forEach(p => {
    sheet.addRow({
      nombre: p.nombre,
      apellidos: p.apellidos,
      email: p.email,
      telefono: p.telefono || "",
      fechaNacimiento: p.fechaNacimiento ? new Date(p.fechaNacimiento).toLocaleDateString() : "",
      fechaRegistro: p.fechaRegistro ? new Date(p.fechaRegistro).toLocaleString() : ""
    });
  });

  const filePath = path.join(__dirname, "..", "participantes.xlsx");
  await workbook.xlsx.writeFile(filePath);
  console.log("Excel generado:", filePath);
  return filePath;
};
