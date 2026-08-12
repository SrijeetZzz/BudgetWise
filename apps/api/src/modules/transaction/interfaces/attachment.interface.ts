import { Types } from "mongoose";

export interface IAttachment {
  _id?: Types.ObjectId;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
}
