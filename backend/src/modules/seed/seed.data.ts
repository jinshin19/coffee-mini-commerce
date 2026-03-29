import { SYSTEM_ID } from "src/common/utils/id.utils";

const orderAItems = [
  {
    _id: SYSTEM_ID(),
    productId: "coffee-001",
    name: "Signature Spanish Latte",
    image: "/images/coffee-1.svg",
    price: 195,
    quantity: 2,
  },
  {
    _id: SYSTEM_ID(),
    productId: "coffee-002",
    name: "Sea Salt Caramel Cold Brew",
    image: "/images/coffee-2.svg",
    price: 210,
    quantity: 1,
  },
];

const orderBItems = [
  {
    _id: SYSTEM_ID(),
    productId: "coffee-004",
    name: "Vanilla Oat Latte",
    image: "/images/coffee-4.svg",
    price: 205,
    quantity: 3,
  },
];

const orderCItems = [
  {
    _id: SYSTEM_ID(),
    productId: "coffee-003",
    name: "Toasted Hazelnut Mocha",
    image: "/images/coffee-3.svg",
    price: 225,
    quantity: 1,
  },
  {
    _id: SYSTEM_ID(),
    productId: "coffee-006",
    name: "Maple Cinnamon Flat White",
    image: "/images/coffee-6.svg",
    price: 220,
    quantity: 2,
  },
];

const orderDItems = [
  {
    _id: SYSTEM_ID(),
    productId: "coffee-005",
    name: "Brown Sugar Iced Shaken",
    image: "/images/coffee-5.svg",
    price: 215,
    quantity: 2,
  },
];

const orderEItems = [
  {
    _id: SYSTEM_ID(),
    productId: "coffee-002",
    name: "Sea Salt Caramel Cold Brew",
    image: "/images/coffee-2.svg",
    price: 210,
    quantity: 2,
  },
  {
    _id: SYSTEM_ID(),
    productId: "coffee-004",
    name: "Vanilla Oat Latte",
    image: "/images/coffee-4.svg",
    price: 205,
    quantity: 1,
  },
];

function totals(items: Array<{ price: number; quantity: number }>) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  return {
    subtotal,
    total: subtotal,
  };
}

export const seedProducts = [
  {
    _id: SYSTEM_ID(),
    slug: "signature-spanish-latte",
    name: "Signature Spanish Latte",
    category: "Creamy Espresso Blend",
    shortDescription:
      "Velvety espresso layered with milk and caramel sweetness.",
    description:
      "A smooth café favorite built with double espresso, steamed milk, and a gentle caramel finish. It is comforting, aromatic, and crafted for slow mornings and late-night resets.",
    price: 195,
    image: "/images/coffee-1.svg",
    roastLevel: "Medium Roast",
    origin: "Benguet + Brazil Blend",
    bestSeller: true,
    featured: true,
    stock: 26,
    createdAt: "2026-03-18T09:00:00.000Z",
    updatedAt: "2026-03-27T09:20:00.000Z",
  },
  {
    _id: SYSTEM_ID(),
    slug: "sea-salt-caramel-cold-brew",
    name: "Sea Salt Caramel Cold Brew",
    category: "Cold Brew Specialty",
    shortDescription:
      "Bold cold brew with silky sea salt cream and caramel notes.",
    description:
      "Slow-steeped beans, chilled for depth, then finished with airy sea salt foam. A refreshing, balanced choice for those who want sweetness without losing the coffee punch.",
    price: 210,
    image: "/images/coffee-2.svg",
    roastLevel: "Dark Roast",
    origin: "Bukidnon Single Origin",
    bestSeller: true,
    featured: true,
    stock: 14,
    createdAt: "2026-03-18T09:30:00.000Z",
    updatedAt: "2026-03-27T08:10:00.000Z",
  },
  {
    _id: SYSTEM_ID(),
    slug: "toasted-hazelnut-mocha",
    name: "Toasted Hazelnut Mocha",
    category: "Chocolate Espresso",
    shortDescription: "Rich cocoa, roasted hazelnut, and espresso in one cup.",
    description:
      "This drink pairs chocolate depth with toasted nuttiness and a warm espresso backbone. Designed for coffee lovers who want a dessert-like finish with a premium café feel.",
    price: 225,
    image: "/images/coffee-3.svg",
    roastLevel: "Medium-Dark Roast",
    origin: "Sagada + Colombia Blend",
    bestSeller: false,
    featured: true,
    stock: 9,
    createdAt: "2026-03-18T10:00:00.000Z",
    updatedAt: "2026-03-25T11:45:00.000Z",
  },
  {
    _id: SYSTEM_ID(),
    slug: "vanilla-oat-latte",
    name: "Vanilla Oat Latte",
    category: "Plant-Based Favorite",
    shortDescription:
      "Soft vanilla fragrance with oat milk and smooth espresso.",
    description:
      "A modern café staple using creamy oat milk and a clean espresso shot. Lightly sweet, silky in texture, and easy to drink any time of day.",
    price: 205,
    image: "/images/coffee-4.svg",
    roastLevel: "Medium Roast",
    origin: "Atok Arabica",
    bestSeller: true,
    featured: false,
    stock: 32,
    createdAt: "2026-03-19T08:15:00.000Z",
    updatedAt: "2026-03-26T09:15:00.000Z",
  },
  {
    _id: SYSTEM_ID(),
    slug: "brown-sugar-iced-shaken",
    name: "Brown Sugar Iced Shaken",
    category: "Iced Espresso",
    shortDescription: "Shaken espresso with dark syrup and cloud-like finish.",
    description:
      "Made for energy and texture, this drink is chilled, shaken, and finished with a brown sugar profile that tastes premium instead of overly sweet.",
    price: 215,
    image: "/images/coffee-5.svg",
    roastLevel: "Dark Roast",
    origin: "Kalinga",
    bestSeller: false,
    featured: false,
    stock: 7,
    createdAt: "2026-03-19T10:15:00.000Z",
    updatedAt: "2026-03-27T06:15:00.000Z",
  },
  {
    _id: SYSTEM_ID(),
    slug: "maple-cinnamon-flat-white",
    name: "Maple Cinnamon Flat White",
    category: "Warm Seasonal Pick",
    shortDescription: "Silky microfoam with maple warmth and subtle spice.",
    description:
      "A refined flat white elevated with maple sweetness and cinnamon aroma. Ideal for customers who want a soft, elegant cup with a cozy profile.",
    price: 220,
    image: "/images/coffee-6.svg",
    roastLevel: "Medium Roast",
    origin: "Mt. Apo Arabica",
    bestSeller: false,
    featured: false,
    stock: 18,
    createdAt: "2026-03-20T10:15:00.000Z",
    updatedAt: "2026-03-26T16:15:00.000Z",
  },
];

export const seedOrders = [
  {
    _id: SYSTEM_ID(),
    name: "Alyssa Cruz",
    contactNumber: "09171234567",
    address: "Unit 4, 12th Avenue, Bonifacio Global City, Taguig",
    paymentMethod: "gcash",
    proofOfPayment: "/proofs/gcash-proof-1.svg",
    status: "pending",
    items: orderAItems,
    ...totals(orderAItems),
    createdAt: "2026-03-28T02:12:00.000Z",
  },
  {
    _id: SYSTEM_ID(),
    name: "Marco Dela Rosa",
    contactNumber: "09987654321",
    address: "Blk 12 Lot 6, Molino, Bacoor, Cavite",
    paymentMethod: "cod",
    proofOfPayment: null,
    status: "pending",
    items: orderBItems,
    ...totals(orderBItems),
    createdAt: "2026-03-28T03:30:00.000Z",
  },
  {
    _id: SYSTEM_ID(),
    name: "Denise Flores",
    contactNumber: "09190001122",
    address: "22 Malingap Street, Teachers Village, Quezon City",
    paymentMethod: "gcash",
    proofOfPayment: "/proofs/gcash-proof-2.svg",
    status: "confirmed",
    items: orderCItems,
    ...totals(orderCItems),
    createdAt: "2026-03-27T11:40:00.000Z",
  },
  {
    _id: SYSTEM_ID(),
    name: "Karl Mendoza",
    contactNumber: "09223334444",
    address: "84 Lopez Jaena Street, Mandaue City, Cebu",
    paymentMethod: "cod",
    proofOfPayment: null,
    status: "rejected",
    items: orderDItems,
    ...totals(orderDItems),
    createdAt: "2026-03-26T08:20:00.000Z",
  },
  {
    _id: SYSTEM_ID(),
    name: "Sofia Reyes",
    contactNumber: "09335556677",
    address: "37 Scout Borromeo, South Triangle, Quezon City",
    paymentMethod: "gcash",
    proofOfPayment: "/proofs/gcash-proof-1.svg",
    status: "pending",
    items: orderEItems,
    ...totals(orderEItems),
    createdAt: "2026-03-28T01:05:00.000Z",
  },
];
