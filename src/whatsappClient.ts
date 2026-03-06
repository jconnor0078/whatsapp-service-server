import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";

let whatsappClient: InstanceType<typeof Client> | null = null;
let ready = false;

let readyResolver!: () => void;
const readyPromise = new Promise<void>(res => (readyResolver = res));

export async function initWhatsApp() {
  if (whatsappClient) return whatsappClient;

  whatsappClient = new Client({
    authStrategy: new LocalAuth({ clientId: "whatsapp-session" }),
    puppeteer: { args: ['--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'] }
  });

  whatsappClient.on("qr", qr => {
    console.log("📌 Escanea este QR (solo 1 vez):");
    qrcode.generate(qr, { small: true });
  });

  whatsappClient.on("ready", () => {
    console.log("✅ WhatsApp autenticado y listo!");
    ready = true;
    readyResolver();
  });

  await whatsappClient.initialize();
  await readyPromise;
  return whatsappClient;
}

export function getWhatsAppClient() {
  if (!whatsappClient || !ready) throw new Error("❌ WhatsApp no está listo aún");
  return whatsappClient;
}
