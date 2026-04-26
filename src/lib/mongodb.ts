import { MongoClient, ServerApiVersion } from "mongodb";

const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient;
};

function getMongoEnv() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;

  if (!uri) {
    throw new Error("Falta la variable de entorno MONGODB_URI.");
  }

  if (!dbName) {
    throw new Error("Falta la variable de entorno MONGODB_DB_NAME.");
  }

  return { uri, dbName };
}

function createMongoClient() {
  const { uri } = getMongoEnv();

  return new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
}

export async function getMongoDb() {
  const { dbName } = getMongoEnv();

  if (!globalForMongo.mongoClient) {
    globalForMongo.mongoClient = createMongoClient();
  }

  const client = globalForMongo.mongoClient;

  await client.connect();

  return client.db(dbName);
}
