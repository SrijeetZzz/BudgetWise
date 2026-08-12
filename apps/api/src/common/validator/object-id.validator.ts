import mongoose from "mongoose";
import { z } from "zod";

export const objectIdSchema = z.string().trim().refine(
  (id) => mongoose.Types.ObjectId.isValid(id),
  {
    message: "Invalid ObjectId",
  }
);