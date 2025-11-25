// =======================================================
// ============= CONFIGURAR FECHA DEL SORTEO ============
// =======================================================

const fechaSorteo = new Date("2025-12-30T10:10:00").getTime();

// COOKIES AUTOMÁTICAS 
// Cookie origen (30 días)
document.cookie = "origen=landing; path=/; max-age=2592000";

// Cookie de primera entrada
if (!document.cookie.includes("entrada")) {
    document.cookie = `entrada=${Date.now()}; path=/; max-age=2592000`;
}

// SISTEMA PARA IMPEDIR DOBLE REGISTRO
function getCookie(nombre) {
    const cookies = document.cookie.split("; ");
    for (let c of cookies) {
        const [key, value] = c.split("=");
        if (key === nombre) return value;
    }
    return null;
}

function setCookie(nombre, valor, horas) {
    const d = new Date();
    d.setTime(d.getTime() + horas * 60 * 60 * 1000);
    document.cookie = `${nombre}=${valor}; expires=${d.toUTCString()}; path=/`;
}

// Si ya está registrado → desactivar formulario
if (getCookie("registrado") === "1") {
    const msg = document.getElementById("mensaje");
    msg.textContent = "Ya estás registrado. Solo puedes participar una vez.";
    msg.style.color = "red";
    document.querySelector("button[type='submit']").disabled = true;
}

// =============== OBTENER TODAS LAS COOKIES =============
function obtenerCookies() {
    const obj = {};
    document.cookie.split(";").forEach(c => {
        const [k, v] = c.trim().split("=");
        obj[k] = v;
    });
    return obj;
}

// CONTADOR REGRESIVO
function actualizarCuentaAtras() {
    const ahora = Date.now();
    const distancia = fechaSorteo - ahora;

    if (distancia <= 0) {
        document.getElementById("countdown").textContent = "Procesando sorteo...";
        window.location.href = "/api/ganadores/resolver";
        return;
    }

    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distancia / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((distancia / (1000 * 60)) % 60);
    const segundos = Math.floor((distancia / 1000) % 60);

    document.getElementById("countdown").textContent =
        `${dias}d ${horas}h ${minutos}m ${segundos}s`;
}

setInterval(actualizarCuentaAtras, 1000);
actualizarCuentaAtras();

// ENVÍO DEL FORMULARIO
document.getElementById("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const mensajeEl = document.getElementById("mensaje");
    mensajeEl.textContent = "";

    if (getCookie("registrado") === "1") {
        mensajeEl.style.color = "red";
        mensajeEl.textContent = "Ya has participado anteriormente.";
        return;
    }

    const data = {
        nombre: e.target.nombre.value.trim(),
        apellidos: e.target.apellidos.value.trim(),
        email: e.target.email.value.trim(),
        telefono: e.target.telefono.value.trim(),
        fechaNacimiento: e.target.fechaNacimiento.value,
        acepta: document.getElementById("acepto").checked,
        cookies: obtenerCookies()
    };

    if (!data.acepta) {
        mensajeEl.style.color = "red";
        mensajeEl.textContent = "Debes aceptar la Política de Privacidad.";
        return;
    }

    try {
        const res = await fetch("/api/participantes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const json = await res.json();

        if (!res.ok) {
            mensajeEl.style.color = "red";
            mensajeEl.textContent = json.message || "Error al enviar datos";
            return;
        }

        mensajeEl.style.color = "green";
        mensajeEl.textContent = "Participación registrada correctamente.";

        // 30 días de duracción
        setCookie("registrado", "1", 720);

        document.querySelector("button[type='submit']").disabled = true;

        e.target.reset();

    } catch (err) {
        console.error(err);
        mensajeEl.style.color = "red";
        mensajeEl.textContent = "Error de conexión con el servidor.";
    }
});
