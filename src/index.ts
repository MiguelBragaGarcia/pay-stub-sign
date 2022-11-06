import express from "express";
import uploadRouter from "./routes/upload.routes";

const server = express();

server.use(express.json());
server.use(uploadRouter);

server.listen(3000, () => {
  console.log("Server statarted on: http://localhost:3000");
});
