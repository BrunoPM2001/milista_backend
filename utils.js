import crypto from "crypto";

// Función para generar token
function generarToken(data) {
  return crypto
    .createHmac("sha256", process.env.SECRET_KEY)
    .update(data)
    .digest("hex");
}

export { generarToken };
