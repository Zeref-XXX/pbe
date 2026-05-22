export const filters = [
  {
    id: "category",
    name: "Category",
    options: [
      { value: "backpacks", label: "Backpacks" },
      { value: "men-shirts", label: "Men Shirts" },
      { value: "men-sports-shoes", label: "Men Sports Shoes" },
      { value: "men-tshirts", label: "Men Tshirts" },
      { value: "watches", label: "Watches" },
      { value: "women-heels", label: "Women Heels" },
      { value: "women-kurtas", label: "Women Kurtas" },
      { value: "women-tops", label: "Women Tops" },
    ],
  },
]

export const sortOptions = [
  { label: "Best Rating", name: "rating", current: false },
  { label: "Price: Low to High", name: "price_low_high", current: false },
  { label: "Price: High to Low", name: "price_high_low", current: false },
]
