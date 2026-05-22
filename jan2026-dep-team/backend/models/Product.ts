import mongoose, { Schema, Document } from "mongoose";

export interface IColor {
  color: string;
  images: string[];
}

export interface IProduct extends Document {
  id: number;
  title: string;
  description?: string;
  price?: number;
  brand?: string;
  category?: string;
  image?: string;
  rating?: {
    rate: number;
    count: number;
  };
  colors?: IColor[];
}

const colorSchema = new Schema<IColor>(
  {
    color: String,
    images: [String],
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  price: Number,
  brand: String,
  category: String,
  image: String,
  rating: {
    rate: Number,
    count: Number,
  },
  colors: [colorSchema],
});

export default mongoose.model<IProduct>("Product", productSchema);
