import express from "express";
import cors from "cors";

const app = express();

//  Middlewares
app.use(cors());
app.use(express.json());

//  Routes
app.get("admin/verificar_qr", (req, res) => {
  console.log(req.query.qrToken);
  res.json({
    status: true,
    qrData: {
      name: "Bruno Porras",
      adicionales: 1,
    },
  });
});

app.get("/", (req, res) => {
  res.send("Hi mom");
});

app.listen(3000, () => "serving");
