import { DBSource } from "./config/database";
import express from "express";
import cors from "cors";
import router from "./routes";

let port = process.env.PORT || 5000;

const app = express();

app.listen({ port: port, host: "0.0.0.0" }, () => {
  console.log(`App is running on port ${port}`);
});

DBSource.initialize()
  .then(() => {
    console.log("Banco inicializado com sucesso!");
  })
  .catch((err: any) => {
    console.error("Erro durante a inicialização do banco: ", err);
  });

app.use(cors());
app.use(express.json());
app.use(router);