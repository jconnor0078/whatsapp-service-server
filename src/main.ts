import express from "express";
import router, { whatsappQueue } from "./router";
import { WhatsAppWorker } from "./worker";
import Redis from "ioredis";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

const app = express();
app.use(express.json());
app.use(router);

// Worker integrado
const whatsappWorker = new WhatsAppWorker();
whatsappWorker.start();

// Dashboard de administración de colas
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(whatsappQueue)],
  serverAdapter
});

app.use("/admin/queues", serverAdapter.getRouter());

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
  console.log("Bull Board en http://localhost:3000/admin/queues");
});
