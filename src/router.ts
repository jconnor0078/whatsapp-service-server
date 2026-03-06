import express from "express";
import { Queue } from "bullmq";
import Redis from "ioredis";


const redisConnection = new Redis({
  host: "redis-server",
  port: 6379,
  maxRetriesPerRequest: null
});

export const whatsappQueue = new Queue("whatsapp-queue", {
  connection: redisConnection.options
});

const router = express.Router();

router.post("/queue/whatsapp", async (req, res) => {
  try {
    const { number, message } = req.body;
    const job = await whatsappQueue.add("send-whatsapp", { number, message });
    res.json({ ok: true, jobId: job.id });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Error al agregar job" });
  }
});

export default router;
