import { Worker } from "bullmq";
import Redis from "ioredis";
import { initWhatsApp, getWhatsAppClient } from "./whatsappClient";

const redisConnection = new Redis({
  host: "redis-server",
  port: 6379,
  maxRetriesPerRequest: null
});

export class WhatsAppWorker {
  private worker!: Worker;

  async start() {
    console.log("🚀 Iniciando Worker...");
    await initWhatsApp(); // solo espera a que la sesión única esté lista

    this.worker = new Worker(
      "whatsapp-queue",
      async job => {
        console.log("📩 Job recibido en worker!", job.data);

        const { number, message } = job.data;
        const client = getWhatsAppClient();
        const chatId = number + "@c.us";

        await client.sendMessage(chatId, message);
        console.log(`✅ Mensaje enviado a ${number}`);
      },
      { connection: redisConnection.options }
    );

    console.log("🟢 Worker escuchando cola whatsapp-queue");
  }
}
