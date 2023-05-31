import express from "express";
import userRouter from "./user/user.route";
import imageRouter from "./image/image.route";
import swaggerSetup from "../swagger";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/user", userRouter);
app.use("/image", imageRouter);

swaggerSetup(app);

app.listen(3002, "192.168.0.21", () => {
  console.log("Servidor rodando em localhost:3002");
});


export default app;
