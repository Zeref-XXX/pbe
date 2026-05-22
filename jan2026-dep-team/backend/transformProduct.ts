import fs from "fs";

// 👉 change file paths as needed
const INPUT_FILE = "./base-data.rawproducts.json";
const OUTPUT_FILE = "./clean-products.json";

// 👉 dummy category (replace with real ObjectId later)
const DEFAULT_CATEGORY = "662f00000000000000000001";

interface RawImage {
  imageURL?: string;
}

interface RawAlbum {
  images?: RawImage[];
}

interface RawMedia {
  albums?: RawAlbum[];
}

interface RawProductDetail {
  title?: string;
  description?: string;
}

interface RawColour {
  label?: string;
  image?: string;
}

interface RawRatings {
  averageRating?: number;
  totalCount?: number;
}

interface RawPrice {
  discounted?: number;
}

interface RawProduct {
  name?: string;
  productDetails?: RawProductDetail[];
  media?: RawMedia;
  baseColour?: string;
  colours?: RawColour[];
  price?: RawPrice;
  mrp?: number;
  ratings?: RawRatings;
}

interface RawItem {
  rawResponse?: {
    product_results?: RawProduct;
  };
}

interface TransformedImage {
  url: string | undefined;
  color: string;
}

interface TransformedProduct {
  name: string;
  description: string;
  price: number;
  images: TransformedImage[];
  category: string;
  stock: number;
  avgRating: number;
  numReviews: number;
  isActive: boolean;
}

const cleanHTML = (str?: string): string => {
  if (!str) return "No description available";
  return str.replace(/<[^>]*>/g, "").trim();
};

const extractDescription = (product: RawProduct): string => {
  const details = product.productDetails || [];
  const descObj = details.find((d) => d.title === "Product Details");
  return cleanHTML(descObj?.description);
};

const extractImages = (product: RawProduct): TransformedImage[] => {
  let images: TransformedImage[] = [];

  // ✅ Priority 1: colours (best source)
  if (product.colours && product.colours.length > 0) {
    images = product.colours.map((c) => ({
      url: c.image,
      color: c.label?.toLowerCase() || product.baseColour?.toLowerCase() || "unknown",
    }));
  }

  // ✅ Priority 2: fallback to album images
  else if (product.media?.albums && product.media.albums.length > 0) {
    const albumImages = product.media.albums[0].images || [];
    images = albumImages.slice(0, 5).map((img) => ({
      url: img.imageURL,
      color: product.baseColour?.toLowerCase() || "unknown",
    }));
  }

  return images;
};

const transformProduct = (item: RawItem): TransformedProduct | null => {
  const product = item.rawResponse?.product_results;

  if (!product) return null;

  return {
    name: product.name || "Unnamed Product",

    description: extractDescription(product),

    price: product.price?.discounted || product.mrp || 0,

    images: extractImages(product),

    category: DEFAULT_CATEGORY,

    stock: 0,

    avgRating: Number(product.ratings?.averageRating?.toFixed(2)) || 0,

    numReviews: product.ratings?.totalCount || 0,

    isActive: true,
  };
};

// 🚀 MAIN
const rawData: RawItem[] = JSON.parse(fs.readFileSync(INPUT_FILE, "utf-8"));

const transformed = rawData.map(transformProduct).filter(Boolean);

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(transformed, null, 2));

console.log(`✅ Done! Converted ${transformed.length} products`);
console.log(`📁 Output saved to: ${OUTPUT_FILE}`);
