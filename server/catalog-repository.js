import { ObjectId } from "mongodb";
import { getDatabase } from "./db.js";
import { barbers as defaultBarbers, services as defaultServices, studioInfo } from "../shared/site.js";

const collections = {
  services: "services",
  barbers: "barbers",
  settings: "settings",
  blocks: "schedule_blocks",
};

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function serialize(document) {
  if (!document) {
    return document;
  }

  return {
    ...document,
    _id: document._id?.toString?.() || document._id,
  };
}

async function seedDefaults() {
  const db = await getDatabase();

  if ((await db.collection(collections.services).countDocuments()) === 0) {
    await db.collection(collections.services).insertMany(defaultServices);
  }

  if ((await db.collection(collections.barbers).countDocuments()) === 0) {
    await db.collection(collections.barbers).insertMany(defaultBarbers);
  }

  if ((await db.collection(collections.settings).countDocuments({ key: "schedule" })) === 0) {
    await db.collection(collections.settings).insertOne({
      key: "schedule",
      value: studioInfo.schedule,
      updatedAt: new Date(),
    });
  }
}

export async function getCatalog() {
  await seedDefaults();
  const db = await getDatabase();
  const [services, barbers, scheduleDoc] = await Promise.all([
    db.collection(collections.services).find({}).sort({ name: 1 }).toArray(),
    db.collection(collections.barbers).find({}).sort({ name: 1 }).toArray(),
    db.collection(collections.settings).findOne({ key: "schedule" }),
  ]);

  return {
    services: services.map(serialize),
    barbers: barbers.map(serialize),
    schedule: scheduleDoc?.value || studioInfo.schedule,
  };
}

export async function saveService(payload) {
  await seedDefaults();
  const db = await getDatabase();
  const document = {
    name: String(payload.name || "").trim(),
    slug: slugify(payload.slug || payload.name),
    description: String(payload.description || "").trim(),
    duration: Number(payload.duration || 0),
    price: Number(payload.price || 0),
    updatedAt: new Date(),
  };

  if (payload.id) {
    const result = await db
      .collection(collections.services)
      .findOneAndUpdate(
        { _id: new ObjectId(payload.id) },
        { $set: document },
        { returnDocument: "after" }
      );

    return serialize(result);
  }

  const result = await db.collection(collections.services).insertOne({
    ...document,
    createdAt: new Date(),
  });

  return serialize({ ...document, createdAt: new Date(), _id: result.insertedId });
}

export async function deleteService(id) {
  const db = await getDatabase();
  await db.collection(collections.services).deleteOne({ _id: new ObjectId(id) });
}

export async function saveBarber(payload) {
  await seedDefaults();
  const db = await getDatabase();
  const document = {
    name: String(payload.name || "").trim(),
    slug: slugify(payload.slug || payload.name),
    role: String(payload.role || "").trim(),
    specialties: Array.isArray(payload.specialties)
      ? payload.specialties.map((item) => String(item).trim()).filter(Boolean)
      : String(payload.specialties || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
    updatedAt: new Date(),
  };

  if (payload.id) {
    const result = await db
      .collection(collections.barbers)
      .findOneAndUpdate(
        { _id: new ObjectId(payload.id) },
        { $set: document },
        { returnDocument: "after" }
      );

    return serialize(result);
  }

  const result = await db.collection(collections.barbers).insertOne({
    ...document,
    createdAt: new Date(),
  });

  return serialize({ ...document, createdAt: new Date(), _id: result.insertedId });
}

export async function deleteBarber(id) {
  const db = await getDatabase();
  await db.collection(collections.barbers).deleteOne({ _id: new ObjectId(id) });
}

export async function saveSchedule(schedule) {
  await seedDefaults();
  const db = await getDatabase();
  await db.collection(collections.settings).updateOne(
    { key: "schedule" },
    { $set: { value: schedule, updatedAt: new Date() } },
    { upsert: true }
  );

  return schedule;
}

export async function getBlocks(date) {
  const db = await getDatabase();
  const query = date ? { date } : {};
  const blocks = await db.collection(collections.blocks).find(query).sort({ date: 1, startTime: 1 }).toArray();
  return blocks.map(serialize);
}

export async function saveBlock(payload) {
  const db = await getDatabase();
  const document = {
    date: String(payload.date || "").trim(),
    barberSlug: String(payload.barberSlug || "all").trim(),
    startTime: String(payload.startTime || "").trim(),
    endTime: String(payload.endTime || "").trim(),
    reason: String(payload.reason || "").trim(),
    updatedAt: new Date(),
  };

  const result = await db.collection(collections.blocks).insertOne({
    ...document,
    createdAt: new Date(),
  });

  return serialize({ ...document, createdAt: new Date(), _id: result.insertedId });
}

export async function deleteBlock(id) {
  const db = await getDatabase();
  await db.collection(collections.blocks).deleteOne({ _id: new ObjectId(id) });
}
