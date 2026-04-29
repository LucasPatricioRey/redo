import { MongoClient } from "mongodb";
import { env } from "./env.js";

const client = new MongoClient(env.mongodbUri);
let clientPromise;

export async function getDatabase() {
  if (!clientPromise) {
    clientPromise = client.connect();
  }

  const connection = await clientPromise;
  return connection.db(env.mongodbDbName);
}
