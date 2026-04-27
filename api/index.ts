import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";
import connectDB from "../src/config/db";

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    await connectDB();                        // ← this was missing
    return app(req as any, res as any);
  } catch (err) {
    console.error("DB connection failed:", err);
    return res.status(500).json({ message: "Database connection failed" });
  }
};