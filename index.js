import express from "express";
import cors from "cors";

import db from "./db.js";
import { generarToken } from "./utils.js";

const app = express();

//  Middlewares
app.use(cors());
app.use(express.json());

//  Routes
app.get("/listadoInvitados", async (req, res) => {
  const data = await db("invitados").select(
    "id",
    "name",
    "adicional",
    db.raw(`CASE(token)
      WHEN '' THEN 'No'
      ELSE 'Sí'
    END AS token_generado`),
    db.raw(`CASE(ingreso)
      WHEN true THEN 'Ingresó'
      ELSE 'Pendiente'
    END AS ingreso`)
  );
  res.json(data);
});

app.get("/invitados", async (req, res) => {
  const data = await db("invitados").select(
    "id",
    "name",
    "adicional",
    db.raw(`CASE(ingreso)
      WHEN true THEN 'Ingresó'
      ELSE 'Pendiente'
    END AS ingreso`)
  );
  res.json(data);
});

app.post("/generarToken", async (req, res) => {
  const { invitadoId } = req.body;

  //  Generación del token
  const token = generarToken(String(invitadoId));

  await db("invitados").where("id", "=", invitadoId).update({
    token: token,
  });

  const data = await db("invitados")
    .select("name", "adicional")
    .where("id", "=", invitadoId)
    .first();

  res.json({
    token: token,
    data: data,
  });
});

app.post("/verificarQr", async (req, res) => {
  const { qrInfo } = req.body;

  const data = await db("invitados")
    .select("id", "name", "adicional", "ingreso")
    .where("token", "=", qrInfo)
    .first();

  res.json({
    status: data ? true : false,
    qrData: data,
  });
});

app.post("/registrarEntrada", async (req, res) => {
  const { invitadoId } = req.body;
  await db("invitados").where("id", "=", invitadoId).update({
    ingreso: true,
  });
  res.json({
    status: "success",
    detail: "Se registró el ingreso del usuario",
  });
});

app.get("/", (req, res) => {
  res.send("Hi mom");
});

app.listen(3000, () => "serving");
