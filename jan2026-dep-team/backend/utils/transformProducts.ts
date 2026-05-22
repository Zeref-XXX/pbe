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

interface RawBrand {
  name?: string;
}

interface RawAnalytics {
  brand?: string;
}

interface RawProduct {
  name?: string;
  productDetails?: RawProductDetail[];
  media?: RawMedia;
  baseColour?: string;
  colours?: RawColour[];
  price?: RawPrice;
  mrp?: number;
  brand?: RawBrand;
  analytics?: RawAnalytics;
  ratings?: RawRatings;
}

export interface RawItem {
  rawResponse?: {
    product_results?: RawProduct;
  };
  categoryPage?: string;
}

export interface TransformedColor {
  color: string;
  images: string[];
}

export interface TransformedProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  colors: TransformedColor[];
}

const cleanHTML = (str?: string): string => {
  if (!str) return "No description available";
  return str.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
};

const extractDescription = (product: RawProduct): string => {
  const descObj = (product.productDetails || []).find(
    (d) => d.title === "Product Details"
  );
  return cleanHTML(descObj?.description);
};

const extractCategory = (categoryPage?: string): string => {
  const match = (categoryPage || "").match(/myntra\.com\/([^/?]+)/);
  return match ? match[1] : "uncategorized";
};

const buildColors = (product: RawProduct): TransformedColor[] => {
  const colors: TransformedColor[] = [];

  const baseColorName = (product.baseColour || "default").toLowerCase();
  const albumImages = (product.media?.albums?.[0]?.images || [])
    .map((img) => img.imageURL)
    .filter((url): url is string => Boolean(url))
    .slice(0, 5);

  if (albumImages.length > 0) {
    colors.push({ color: baseColorName, images: albumImages });
  }

  (product.colours || []).forEach((c) => {
    const colorName = (c.label || baseColorName).toLowerCase();
    if (c.image && colorName !== baseColorName) {
      colors.push({ color: colorName, images: [c.image] });
    }
  });

  if (colors.length === 0) {
    colors.push({ color: baseColorName, images: [] });
  }

  return colors;
};

export const transformProduct = (item: RawItem, index: number): TransformedProduct | null => {
  const product = item.rawResponse?.product_results;
  if (!product) return null;

  const colors = buildColors(product);

  return {
    id: index + 1,
    title: product.name || "Unnamed Product",
    description: extractDescription(product),
    price: product.price?.discounted || product.mrp || 0,
    brand: product.brand?.name || product.analytics?.brand || "Unknown Brand",
    category: extractCategory(item.categoryPage),
    image: colors[0]?.images[0] || "",
    rating: {
      rate: Number((product.ratings?.averageRating || 0).toFixed(1)),
      count: product.ratings?.totalCount || 0,
    },
    colors,
  };
};
