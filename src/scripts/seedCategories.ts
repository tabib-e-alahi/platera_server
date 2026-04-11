// src/scripts/seedCategories.ts

import { prisma } from "../lib/prisma";

const categories = [
  { name: "Fast Food", slug: "fast-food", displayOrder: 1, imageURL: "https://images.unsplash.com/photo-1550547660-d9450f859349" },

  { name: "Fried Chicken", slug: "fried-chicken", displayOrder: 4, imageURL: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58" },

  { name: "Rice & Curry", slug: "rice-curry", displayOrder: 5, imageURL: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d" },

  { name: "Biriyani", slug: "biriyani", displayOrder: 6, imageURL: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0" },

  { name: "Chinese", slug: "chinese", displayOrder: 7, imageURL: "https://images.unsplash.com/photo-1563245372-f21724e3856d" },

  { name: "Indian", slug: "indian", displayOrder: 8, imageURL: "https://images.unsplash.com/photo-1589302168068-964664d93dc0" },

  { name: "BBQ & Grill", slug: "bbq-grill", displayOrder: 9, imageURL: "https://images.unsplash.com/photo-1558030006-450675393462" },

  { name: "Seafood", slug: "seafood", displayOrder: 10, imageURL: "https://images.unsplash.com/photo-1565557623262-b51c2513a641" },

  { name: "Snacks", slug: "snacks", displayOrder: 11, imageURL: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087" },

  { name: "Street Food", slug: "street-food", displayOrder: 12, imageURL: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092" },

  { name: "Breakfast", slug: "breakfast", displayOrder: 13, imageURL: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666" },

  { name: "Desserts", slug: "desserts", displayOrder: 14, imageURL: "https://images.unsplash.com/photo-1551024601-bec78aea704b" },

  { name: "Cakes & Bakery", slug: "cakes-bakery", displayOrder: 15, imageURL: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec" },

  { name: "Ice Cream", slug: "ice-cream", displayOrder: 16, imageURL: "https://images.unsplash.com/photo-1563805042-7684c019e1cb" },

  { name: "Beverages", slug: "beverages", displayOrder: 17, imageURL: "https://images.unsplash.com/photo-1551029506-0807df4e2031" },

  { name: "Coffee & Tea", slug: "coffee-tea", displayOrder: 18, imageURL: "https://images.unsplash.com/photo-1509042239860-f550ce710b93" },

  { name: "Healthy Food", slug: "healthy-food", displayOrder: 19, imageURL: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd" },

  { name: "Salads", slug: "salads", displayOrder: 20, imageURL: "https://images.unsplash.com/photo-1551248429-40975aa4de74" },

  { name: "Vegetarian", slug: "vegetarian", displayOrder: 21, imageURL: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c" },

  { name: "Halal Food", slug: "halal-food", displayOrder: 22, imageURL: "https://images.unsplash.com/photo-1604908177522-429e6cfcf91e" },

  { name: "Combo Meals", slug: "combo-meals", displayOrder: 23, imageURL: "https://images.unsplash.com/photo-1594007654729-407eedc4be65" },

  { name: "Family Packs", slug: "family-packs", displayOrder: 24, imageURL: "https://images.unsplash.com/photo-1600891964092-4316c288032e" },

  { name: "Deals & Offers", slug: "deals-offers", displayOrder: 25, imageURL: "https://images.unsplash.com/photo-1607082349566-187342175e2f" },
];

const seedCategories = async () => {
  console.log("Seeding categories...");

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    console.log(`Upserted: ${category.name}`);
  }

  console.log("Categories seeded.");
  await prisma.$disconnect();
};

seedCategories().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});