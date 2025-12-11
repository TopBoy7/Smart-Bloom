require('dotenv').config();


const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Missing MONGODB_URI environment variable");
}

let cached = (global).mongoose;

if (!cached) {
  cached = (global).mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, {
        bufferCommands: false,
      })
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
