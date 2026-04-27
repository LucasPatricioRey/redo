import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ quiet: true });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "redo";

if (!uri) {
  throw new Error("Falta la variable MONGODB_URI");
}

const client = new MongoClient(uri);
let clientPromise;

export async function getDatabase() {
  if (!clientPromise) {
    clientPromise = client.connect();
  }

  const connection = await clientPromise;
  return connection.db(dbName);
}
