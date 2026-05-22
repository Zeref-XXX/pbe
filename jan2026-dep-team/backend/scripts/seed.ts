// Import required modules
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import { transformProduct, RawItem } from "../utils/transformProducts.js";

// Get the current directory name
const currentDir = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env file
dotenv.config({ path: path.join(currentDir, "../.env") });

/**
 * Seeds the MongoDB database with product data.
 * Reads raw product data, transforms it, and inserts it into the database.
 */
const seedDatabase = async (): Promise<void> => {
  try {
    // Connect to MongoDB using the URI from environment variables
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Connected to MongoDB");

    // Read and parse the raw product data file
    const rawDataPath = path.join(currentDir, "../base-data.rawproducts.json");
    const rawData: RawItem[] = JSON.parse(fs.readFileSync(rawDataPath, "utf-8"));

    // Transform raw data into product documents, filtering out any invalid entries
    const transformedProducts = rawData.map(transformProduct).filter(Boolean);

    // Remove all existing products from the collection
    await Product.deleteMany({});

    // Insert the new products into the collection
    await Product.insertMany(transformedProducts);

    // Log the number of products seeded
    console.log(`Seeded ${transformedProducts.length} products`);
    process.exit(0); // Exit successfully
  } catch (error) {
    // Log any errors that occur during seeding
    console.error("Seed failed:", (error as Error).message);
    process.exit(1); // Exit with error
  }
};

// Run the seed function
seedDatabase();