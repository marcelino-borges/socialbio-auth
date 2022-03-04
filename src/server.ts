import helmet from "helmet";
import cors from "cors";
import express from "express";
import connectMongo from "./mongo/config";
import routes from "./routes";
import dotenvSafe from "dotenv-safe";
import swaggerFile from "../swagger_output.json";
import swaggerUi from "swagger-ui-express";

dotenvSafe.config({
  allowEmptyValues: true,
});

const PORT = parseInt(process.env.PORT as string, 10);

console.log("PORT on env: ", PORT);

const app = express();
connectMongo();

app.use(cors());

app.use(helmet());
app.use(express.urlencoded({ extended: false }));
//app.use(express.text());
app.use(express.json());

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/api/v1", routes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
