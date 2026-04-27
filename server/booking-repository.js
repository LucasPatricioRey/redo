import { ObjectId } from "mongodb";
import { getDatabase } from "./db.js";

const collectionName = "booking_inquiries";

export async function createBooking(payload) {
  const db = await getDatabase();
  const document = {
    ...payload,
    status: "pendiente",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection(collectionName).insertOne(document);
  return { ...document, _id: result.insertedId };
}

export async function getBookingsByDate(date) {
  const db = await getDatabase();
  return db.collection(collectionName).find({ date }).sort({ time: 1 }).toArray();
}

export async function getBookings({ status, search }) {
  const db = await getDatabase();
  const query = {};

  if (status && status !== "todos") {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { customerName: { $regex: search, $options: "i" } },
      { customerPhone: { $regex: search, $options: "i" } },
      { serviceName: { $regex: search, $options: "i" } },
      { barberName: { $regex: search, $options: "i" } },
    ];
  }

  return db.collection(collectionName).find(query).sort({ createdAt: -1 }).toArray();
}

export async function getBookingSummary() {
  const db = await getDatabase();
  const bookings = await db.collection(collectionName).find({}).toArray();

  return bookings.reduce(
    (accumulator, booking) => {
      accumulator.total += 1;
      accumulator[booking.status] += 1;
      return accumulator;
    },
    {
      total: 0,
      pendiente: 0,
      confirmado: 0,
      cancelado: 0,
    }
  );
}

export async function updateBookingStatus(id, status) {
  const db = await getDatabase();
  const result = await db
    .collection(collectionName)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

  return result;
}
