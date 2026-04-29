import dotenv from "dotenv";

dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ quiet: true });

const requiredKeys = ["MONGODB_URI", "ADMIN_USERNAME", "ADMIN_PASSWORD", "ADMIN_SESSION_SECRET"];
const missingKeys = requiredKeys.filter((key) => !process.env[key]);

if (missingKeys.length) {
  throw new Error(`Faltan variables de entorno requeridas: ${missingKeys.join(", ")}`);
}

export const env = {
  mongodbUri: process.env.MONGODB_URI,
  mongodbDbName: process.env.MONGODB_DB_NAME || "redo",
  adminUsername: process.env.ADMIN_USERNAME,
  adminPassword: process.env.ADMIN_PASSWORD,
  adminSessionSecret: process.env.ADMIN_SESSION_SECRET,
  isProduction: process.env.NODE_ENV === "production",
};
