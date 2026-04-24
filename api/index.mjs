var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// src/middlewares/globalErrorHandler.ts
import { ZodError } from "zod";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.6.0",
  "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Address {\n  id          String    @id @default(uuid(7))\n  city        String\n  street      String\n  houseNumber String\n  apartment   String?\n  postalCode  String\n  label       HouseType @default(HOME)\n  isDefault   Boolean   @default(false)\n  createdAt   DateTime  @default(now())\n  updatedAt   DateTime  @updatedAt\n\n  @@index([city])\n  @@index([postalCode])\n}\n\nmodel User {\n  id                 String            @id\n  name               String\n  email              String            @unique\n  emailVerified      Boolean           @default(false)\n  image              String?\n  role               UserRole          @default(CUSTOMER)\n  status             userAccountStatus @default(ACTIVE)\n  phone              String?\n  needPasswordChange Boolean           @default(false)\n  isDeleted          Boolean           @default(false)\n  deletedAt          DateTime?\n  createdAt          DateTime          @default(now())\n  updatedAt          DateTime          @updatedAt\n  accounts           Account[]\n  customerProfile    CustomerProfile?\n  orders             Order[]\n  payments           Payment[]\n  providerProfile    ProviderProfile?\n  reviews            Review[]\n  sessions           Session[]\n\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String   @unique\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Cart {\n  id             String          @id @default(uuid())\n  customerId     String          @unique\n  providerId     String\n  subtotal       Decimal         @default(0) @db.Decimal(12, 2)\n  deliveryFee    Decimal         @default(0) @db.Decimal(12, 2)\n  discountAmount Decimal         @default(0) @db.Decimal(12, 2)\n  totalAmount    Decimal         @default(0) @db.Decimal(12, 2)\n  createdAt      DateTime        @default(now())\n  updatedAt      DateTime        @updatedAt\n  customer       CustomerProfile @relation(fields: [customerId], references: [id], onDelete: Cascade)\n  provider       ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Cascade)\n  cartItems      CartItem[]\n\n  @@index([providerId])\n  @@map("carts")\n}\n\nmodel CartItem {\n  id            String   @id @default(uuid())\n  cartId        String\n  mealId        String\n  quantity      Int      @default(1)\n  baseUnitPrice Decimal  @db.Decimal(12, 2)\n  unitPrice     Decimal  @db.Decimal(12, 2)\n  totalPrice    Decimal  @db.Decimal(12, 2)\n  createdAt     DateTime @default(now())\n  updatedAt     DateTime @updatedAt\n\n  cart Cart @relation(fields: [cartId], references: [id], onDelete: Cascade)\n  meal Meal @relation(fields: [mealId], references: [id], onDelete: Cascade)\n\n  @@unique([cartId, mealId])\n  @@index([mealId])\n  @@map("cart_item")\n}\n\nmodel Category {\n  id           String   @id @default(uuid())\n  name         String   @unique\n  slug         String   @unique\n  imageURL     String\n  displayOrder Int      @default(0)\n  isActive     Boolean  @default(true)\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n  meals        Meal[]\n\n  @@index([slug])\n  @@map("category")\n}\n\nmodel CustomerProfile {\n  id            String   @id @default(uuid())\n  userId        String   @unique\n  phone         String\n  city          String\n  streetAddress String\n  houseNumber   String\n  apartment     String?\n  postalCode    String\n  latitude      Decimal? @db.Decimal(10, 7)\n  longitude     Decimal? @db.Decimal(10, 7)\n  createdAt     DateTime @default(now())\n  updatedAt     DateTime @updatedAt\n  cart          Cart?\n  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([city])\n  @@map("customer_profiles")\n}\n\nenum UserRole {\n  CUSTOMER\n  PROVIDER\n  ADMIN\n  SUPER_ADMIN\n}\n\nenum userAccountStatus {\n  ACTIVE\n  SUSPENDED\n}\n\nenum HouseType {\n  HOME\n  OFFICE\n}\n\nenum BusinessCategory {\n  RESTAURANT\n  SHOP\n  HOME_KITCHEN\n  STREET_FOOD\n}\n\nenum ApprovalStatus {\n  PENDING\n  APPROVED\n  REJECTED\n  DRAFT\n}\n\nenum PaymentMethod {\n  COD\n  ONLINE\n}\n\nenum PaymentStatus {\n  PENDING\n  SUCCESS\n  FAILED\n  CANCELLED\n  REFUNDED\n}\n\nenum OrderStatus {\n  PENDING_PAYMENT\n  PLACED\n  ACCEPTED\n  PREPARING\n  OUT_FOR_DELIVERY\n  DELIVERED\n  CANCELLED\n  REFUNDED\n}\n\nenum ProviderSettlementStatus {\n  PENDING\n  PAID\n}\n\nmodel Meal {\n  id         String @id @default(uuid())\n  providerId String\n  categoryId String\n\n  name String\n\n  subcategory      String?\n  shortDescription String\n  fullDescription  String?\n\n  portionSize String?\n\n  mainImageURL     String\n  galleryImageURLs String[]\n\n  basePrice     Int\n  discountPrice Int?\n\n  dietaryPreferences DietaryPreference[]\n  allergens          String[]\n  calories           Int?\n  protein            Float?\n  fat                Float?\n  carbohydrates      Float?\n\n  isAvailable Boolean @default(true)\n  isActive    Boolean @default(true)\n\n  preparationTimeMinutes Int @default(15)\n\n  isBestseller      Boolean            @default(false)\n  isFeatured        Boolean            @default(false)\n  tags              String[]\n  deliveryFee       Int                @default(0)\n  createdAt         DateTime           @default(now())\n  updatedAt         DateTime           @updatedAt\n  discountEndDate   DateTime?\n  discountStartDate DateTime?\n  cartItems         CartItem[]\n  category          Category           @relation(fields: [categoryId], references: [id])\n  provider          ProviderProfile    @relation(fields: [providerId], references: [id], onDelete: Cascade)\n  addOns            MealAddOn[]\n  ingredients       MealIngredient[]\n  removeOptions     MealRemoveOption[]\n  sizes             MealSize[]\n  spiceLevels       MealSpiceLevel[]\n  reviews           Review[]\n  orderItems        OrderItem[]\n\n  @@index([providerId])\n  @@index([categoryId])\n  @@index([isAvailable, isActive])\n  @@map("meal")\n}\n\nenum DietaryPreference {\n  VEGAN\n  VEGETARIAN\n  HALAL\n  GLUTEN_FREE\n  DAIRY_FREE\n  NUT_FREE\n  ORGANIC\n  LOW_CARB\n  KETO\n  PALEO\n  LOW_FAT\n  HIGH_PROTEIN\n  LOW_SUGAR\n  SUGAR_FREE\n  FODMAP_FREE\n}\n\nmodel MealSize {\n  id         String  @id @default(uuid())\n  mealId     String\n  name       String\n  extraPrice Int     @default(0)\n  isDefault  Boolean @default(false)\n  meal       Meal    @relation(fields: [mealId], references: [id], onDelete: Cascade)\n\n  @@index([mealId])\n  @@map("meal_size")\n}\n\nmodel MealSpiceLevel {\n  id        String  @id @default(uuid())\n  mealId    String\n  level     String\n  isDefault Boolean @default(false)\n  meal      Meal    @relation(fields: [mealId], references: [id], onDelete: Cascade)\n\n  @@index([mealId])\n  @@map("meal_spice_level")\n}\n\nmodel MealAddOn {\n  id     String @id @default(uuid())\n  mealId String\n  name   String\n  price  Int\n  meal   Meal   @relation(fields: [mealId], references: [id], onDelete: Cascade)\n\n  @@index([mealId])\n  @@map("meal_add_on")\n}\n\nmodel MealRemoveOption {\n  id     String @id @default(uuid())\n  mealId String\n  name   String\n  meal   Meal   @relation(fields: [mealId], references: [id], onDelete: Cascade)\n\n  @@index([mealId])\n  @@map("meal_remove_option")\n}\n\nmodel MealIngredient {\n  id     String @id @default(uuid())\n  mealId String\n  name   String\n  meal   Meal   @relation(fields: [mealId], references: [id], onDelete: Cascade)\n\n  @@index([mealId])\n  @@map("meal_ingredient")\n}\n\nmodel Order {\n  id String @id @default(uuid())\n\n  orderNumber String @unique\n\n  customerId String\n  providerId String\n\n  paymentMethod PaymentMethod\n  status        OrderStatus   @default(PENDING_PAYMENT)\n\n  customerName  String?\n  customerPhone String?\n\n  deliveryCity          String\n  deliveryStreetAddress String?\n  deliveryPostalCode    String?\n  deliveryApartment     String?\n  deliveryHouseNumber   String?\n  deliveryNote          String?\n\n  subtotal       Decimal @db.Decimal(12, 2)\n  deliveryFee    Decimal @default(0) @db.Decimal(12, 2)\n  discountAmount Decimal @default(0) @db.Decimal(12, 2)\n  totalAmount    Decimal @db.Decimal(12, 2)\n\n  placedAt    DateTime?\n  acceptedAt  DateTime?\n  deliveredAt DateTime?\n  cancelledAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  customer User            @relation(fields: [customerId], references: [id])\n  provider ProviderProfile @relation(fields: [providerId], references: [id])\n\n  payments             Payment[]\n  orderItems           OrderItem[]\n  orderStatusHistories OrderStatusHistory[]\n\n  @@index([customerId])\n  @@index([providerId])\n  @@index([status])\n  @@map("orders")\n}\n\nmodel OrderItem {\n  id String @id @default(uuid())\n\n  orderId String\n  mealId  String\n\n  // Snapshot fields (DO NOT depend on Meal later)\n  mealName     String\n  mealSlug     String?\n  mealImageUrl String?\n\n  quantity Int\n\n  unitPrice  Decimal @db.Decimal(12, 2)\n  totalPrice Decimal @db.Decimal(12, 2)\n\n  createdAt DateTime @default(now())\n\n  // Relations\n  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  meal  Meal  @relation(fields: [mealId], references: [id])\n\n  @@index([orderId])\n  @@index([mealId])\n  @@map("order_items")\n}\n\nmodel OrderStatusHistory {\n  id              String      @id @default(uuid())\n  orderId         String\n  status          OrderStatus\n  note            String?\n  changedByUserId String?\n  changedByRole   UserRole?\n  createdAt       DateTime    @default(now())\n\n  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)\n\n  @@index([orderId, createdAt])\n  @@index([status])\n  @@map("order_status_history")\n}\n\nmodel Payment {\n  id                       String                   @id @default(uuid())\n  orderId                  String\n  customerId               String\n  providerId               String\n  amount                   Decimal                  @db.Decimal(12, 2)\n  platformFeePercent       Decimal                  @default(25) @db.Decimal(5, 2)\n  platformFeeAmount        Decimal                  @db.Decimal(12, 2)\n  providerShareAmount      Decimal                  @db.Decimal(12, 2)\n  transactionId            String                   @unique\n  stripeEventId            String?                  @unique\n  gatewayName              String?\n  status                   PaymentStatus            @default(PENDING)\n  paymentGatewayData       Json?\n  paidAt                   DateTime?\n  failedAt                 DateTime?\n  refundedAt               DateTime?\n  createdAt                DateTime                 @default(now())\n  updatedAt                DateTime                 @updatedAt\n  providerSettledAt        DateTime?\n  providerSettledBy        String?\n  providerSettlementNote   String?\n  providerSettlementStatus ProviderSettlementStatus @default(PENDING)\n  customer                 User                     @relation(fields: [customerId], references: [id])\n  order                    Order                    @relation(fields: [orderId], references: [id])\n  provider                 ProviderProfile          @relation(fields: [providerId], references: [id])\n\n  @@index([orderId])\n  @@index([customerId])\n  @@index([providerId])\n  @@index([status])\n  @@index([providerSettlementStatus])\n  @@index([transactionId])\n  @@map("payments")\n}\n\nmodel ProviderProfile {\n  id                        String           @id @default(uuid())\n  userId                    String           @unique\n  businessName              String\n  businessCategory          BusinessCategory\n  phone                     String\n  bio                       String?\n  imageURL                  String?\n  binNumber                 String?\n  binVerified               Boolean          @default(false)\n  city                      String\n  street                    String\n  houseNumber               String\n  apartment                 String?\n  postalCode                String\n  approvalStatus            ApprovalStatus   @default(DRAFT)\n  rejectionReason           String?\n  reviewedBy                String?\n  reviewedAt                DateTime?\n  isActive                  Boolean          @default(true)\n  createdAt                 DateTime         @default(now())\n  updatedAt                 DateTime         @updatedAt\n  businessKitchenURL        String?\n  businessMainGateURL       String?\n  nidImageFront_and_BackURL String?\n  businessEmail             String           @unique\n  currentPayableAmount      Decimal          @default(0) @db.Decimal(12, 2)\n  lastPaymentAt             DateTime?\n  totalGrossRevenue         Decimal          @default(0) @db.Decimal(12, 2)\n  totalOrdersCompleted      Int              @default(0)\n  totalPlatformFee          Decimal          @default(0) @db.Decimal(12, 2)\n  totalProviderEarning      Decimal          @default(0) @db.Decimal(12, 2)\n  carts                     Cart[]\n  meals                     Meal[]\n  orders                    Order[]\n  payments                  Payment[]\n  user                      User             @relation(fields: [userId], references: [id], onDelete: Cascade)\n  reviews                   Review[]\n\n  @@index([userId])\n  @@index([city])\n  @@index([approvalStatus])\n  @@map("provider_profile")\n}\n\nmodel Review {\n  id         String          @id @default(uuid())\n  rating     Float\n  feedback   String?\n  images     String[]\n  createdAt  DateTime        @default(now())\n  updatedAt  DateTime        @updatedAt\n  mealId     String\n  userId     String\n  providerId String\n  meal       Meal            @relation(fields: [mealId], references: [id], onDelete: Cascade)\n  provider   ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Cascade)\n  user       User            @relation(fields: [userId], references: [id])\n\n  @@map("reviews")\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Address":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"street","kind":"scalar","type":"String"},{"name":"houseNumber","kind":"scalar","type":"String"},{"name":"apartment","kind":"scalar","type":"String"},{"name":"postalCode","kind":"scalar","type":"String"},{"name":"label","kind":"enum","type":"HouseType"},{"name":"isDefault","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"userAccountStatus"},{"name":"phone","kind":"scalar","type":"String"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"customerProfile","kind":"object","type":"CustomerProfile","relationName":"CustomerProfileToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"providerProfile","kind":"object","type":"ProviderProfile","relationName":"ProviderProfileToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"subtotal","kind":"scalar","type":"Decimal"},{"name":"deliveryFee","kind":"scalar","type":"Decimal"},{"name":"discountAmount","kind":"scalar","type":"Decimal"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"customer","kind":"object","type":"CustomerProfile","relationName":"CartToCustomerProfile"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"CartToProviderProfile"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartToCartItem"}],"dbName":"carts"},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cartId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"baseUnitPrice","kind":"scalar","type":"Decimal"},{"name":"unitPrice","kind":"scalar","type":"Decimal"},{"name":"totalPrice","kind":"scalar","type":"Decimal"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCartItem"},{"name":"meal","kind":"object","type":"Meal","relationName":"CartItemToMeal"}],"dbName":"cart_item"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"imageURL","kind":"scalar","type":"String"},{"name":"displayOrder","kind":"scalar","type":"Int"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"meals","kind":"object","type":"Meal","relationName":"CategoryToMeal"}],"dbName":"category"},"CustomerProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"streetAddress","kind":"scalar","type":"String"},{"name":"houseNumber","kind":"scalar","type":"String"},{"name":"apartment","kind":"scalar","type":"String"},{"name":"postalCode","kind":"scalar","type":"String"},{"name":"latitude","kind":"scalar","type":"Decimal"},{"name":"longitude","kind":"scalar","type":"Decimal"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCustomerProfile"},{"name":"user","kind":"object","type":"User","relationName":"CustomerProfileToUser"}],"dbName":"customer_profiles"},"Meal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"subcategory","kind":"scalar","type":"String"},{"name":"shortDescription","kind":"scalar","type":"String"},{"name":"fullDescription","kind":"scalar","type":"String"},{"name":"portionSize","kind":"scalar","type":"String"},{"name":"mainImageURL","kind":"scalar","type":"String"},{"name":"galleryImageURLs","kind":"scalar","type":"String"},{"name":"basePrice","kind":"scalar","type":"Int"},{"name":"discountPrice","kind":"scalar","type":"Int"},{"name":"dietaryPreferences","kind":"enum","type":"DietaryPreference"},{"name":"allergens","kind":"scalar","type":"String"},{"name":"calories","kind":"scalar","type":"Int"},{"name":"protein","kind":"scalar","type":"Float"},{"name":"fat","kind":"scalar","type":"Float"},{"name":"carbohydrates","kind":"scalar","type":"Float"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"preparationTimeMinutes","kind":"scalar","type":"Int"},{"name":"isBestseller","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"tags","kind":"scalar","type":"String"},{"name":"deliveryFee","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"discountEndDate","kind":"scalar","type":"DateTime"},{"name":"discountStartDate","kind":"scalar","type":"DateTime"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToMeal"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMeal"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"MealToProviderProfile"},{"name":"addOns","kind":"object","type":"MealAddOn","relationName":"MealToMealAddOn"},{"name":"ingredients","kind":"object","type":"MealIngredient","relationName":"MealToMealIngredient"},{"name":"removeOptions","kind":"object","type":"MealRemoveOption","relationName":"MealToMealRemoveOption"},{"name":"sizes","kind":"object","type":"MealSize","relationName":"MealToMealSize"},{"name":"spiceLevels","kind":"object","type":"MealSpiceLevel","relationName":"MealToMealSpiceLevel"},{"name":"reviews","kind":"object","type":"Review","relationName":"MealToReview"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MealToOrderItem"}],"dbName":"meal"},"MealSize":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"extraPrice","kind":"scalar","type":"Int"},{"name":"isDefault","kind":"scalar","type":"Boolean"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToMealSize"}],"dbName":"meal_size"},"MealSpiceLevel":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"level","kind":"scalar","type":"String"},{"name":"isDefault","kind":"scalar","type":"Boolean"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToMealSpiceLevel"}],"dbName":"meal_spice_level"},"MealAddOn":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Int"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToMealAddOn"}],"dbName":"meal_add_on"},"MealRemoveOption":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToMealRemoveOption"}],"dbName":"meal_remove_option"},"MealIngredient":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToMealIngredient"}],"dbName":"meal_ingredient"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderNumber","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"paymentMethod","kind":"enum","type":"PaymentMethod"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"customerName","kind":"scalar","type":"String"},{"name":"customerPhone","kind":"scalar","type":"String"},{"name":"deliveryCity","kind":"scalar","type":"String"},{"name":"deliveryStreetAddress","kind":"scalar","type":"String"},{"name":"deliveryPostalCode","kind":"scalar","type":"String"},{"name":"deliveryApartment","kind":"scalar","type":"String"},{"name":"deliveryHouseNumber","kind":"scalar","type":"String"},{"name":"deliveryNote","kind":"scalar","type":"String"},{"name":"subtotal","kind":"scalar","type":"Decimal"},{"name":"deliveryFee","kind":"scalar","type":"Decimal"},{"name":"discountAmount","kind":"scalar","type":"Decimal"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"placedAt","kind":"scalar","type":"DateTime"},{"name":"acceptedAt","kind":"scalar","type":"DateTime"},{"name":"deliveredAt","kind":"scalar","type":"DateTime"},{"name":"cancelledAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"customer","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"OrderToProviderProfile"},{"name":"payments","kind":"object","type":"Payment","relationName":"OrderToPayment"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"orderStatusHistories","kind":"object","type":"OrderStatusHistory","relationName":"OrderToOrderStatusHistory"}],"dbName":"orders"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"mealName","kind":"scalar","type":"String"},{"name":"mealSlug","kind":"scalar","type":"String"},{"name":"mealImageUrl","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"unitPrice","kind":"scalar","type":"Decimal"},{"name":"totalPrice","kind":"scalar","type":"Decimal"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToOrderItem"}],"dbName":"order_items"},"OrderStatusHistory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"note","kind":"scalar","type":"String"},{"name":"changedByUserId","kind":"scalar","type":"String"},{"name":"changedByRole","kind":"enum","type":"UserRole"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderStatusHistory"}],"dbName":"order_status_history"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"platformFeePercent","kind":"scalar","type":"Decimal"},{"name":"platformFeeAmount","kind":"scalar","type":"Decimal"},{"name":"providerShareAmount","kind":"scalar","type":"Decimal"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"stripeEventId","kind":"scalar","type":"String"},{"name":"gatewayName","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"paymentGatewayData","kind":"scalar","type":"Json"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"failedAt","kind":"scalar","type":"DateTime"},{"name":"refundedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"providerSettledAt","kind":"scalar","type":"DateTime"},{"name":"providerSettledBy","kind":"scalar","type":"String"},{"name":"providerSettlementNote","kind":"scalar","type":"String"},{"name":"providerSettlementStatus","kind":"enum","type":"ProviderSettlementStatus"},{"name":"customer","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToPayment"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"PaymentToProviderProfile"}],"dbName":"payments"},"ProviderProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"businessName","kind":"scalar","type":"String"},{"name":"businessCategory","kind":"enum","type":"BusinessCategory"},{"name":"phone","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"imageURL","kind":"scalar","type":"String"},{"name":"binNumber","kind":"scalar","type":"String"},{"name":"binVerified","kind":"scalar","type":"Boolean"},{"name":"city","kind":"scalar","type":"String"},{"name":"street","kind":"scalar","type":"String"},{"name":"houseNumber","kind":"scalar","type":"String"},{"name":"apartment","kind":"scalar","type":"String"},{"name":"postalCode","kind":"scalar","type":"String"},{"name":"approvalStatus","kind":"enum","type":"ApprovalStatus"},{"name":"rejectionReason","kind":"scalar","type":"String"},{"name":"reviewedBy","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"businessKitchenURL","kind":"scalar","type":"String"},{"name":"businessMainGateURL","kind":"scalar","type":"String"},{"name":"nidImageFront_and_BackURL","kind":"scalar","type":"String"},{"name":"businessEmail","kind":"scalar","type":"String"},{"name":"currentPayableAmount","kind":"scalar","type":"Decimal"},{"name":"lastPaymentAt","kind":"scalar","type":"DateTime"},{"name":"totalGrossRevenue","kind":"scalar","type":"Decimal"},{"name":"totalOrdersCompleted","kind":"scalar","type":"Int"},{"name":"totalPlatformFee","kind":"scalar","type":"Decimal"},{"name":"totalProviderEarning","kind":"scalar","type":"Decimal"},{"name":"carts","kind":"object","type":"Cart","relationName":"CartToProviderProfile"},{"name":"meals","kind":"object","type":"Meal","relationName":"MealToProviderProfile"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToProviderProfile"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToProviderProfile"},{"name":"user","kind":"object","type":"User","relationName":"ProviderProfileToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ProviderProfileToReview"}],"dbName":"provider_profile"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Float"},{"name":"feedback","kind":"scalar","type":"String"},{"name":"images","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToReview"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"ProviderProfileToReview"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"}],"dbName":"reviews"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","Address.findUnique","Address.findUniqueOrThrow","orderBy","cursor","Address.findFirst","Address.findFirstOrThrow","Address.findMany","data","Address.createOne","Address.createMany","Address.createManyAndReturn","Address.updateOne","Address.updateMany","Address.updateManyAndReturn","create","update","Address.upsertOne","Address.deleteOne","Address.deleteMany","having","_count","_min","_max","Address.groupBy","Address.aggregate","user","accounts","customer","carts","cart","meal","cartItems","meals","category","provider","addOns","ingredients","removeOptions","sizes","spiceLevels","reviews","order","payments","orderItems","orderStatusHistories","orders","customerProfile","providerProfile","sessions","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Cart.findUnique","Cart.findUniqueOrThrow","Cart.findFirst","Cart.findFirstOrThrow","Cart.findMany","Cart.createOne","Cart.createMany","Cart.createManyAndReturn","Cart.updateOne","Cart.updateMany","Cart.updateManyAndReturn","Cart.upsertOne","Cart.deleteOne","Cart.deleteMany","_avg","_sum","Cart.groupBy","Cart.aggregate","CartItem.findUnique","CartItem.findUniqueOrThrow","CartItem.findFirst","CartItem.findFirstOrThrow","CartItem.findMany","CartItem.createOne","CartItem.createMany","CartItem.createManyAndReturn","CartItem.updateOne","CartItem.updateMany","CartItem.updateManyAndReturn","CartItem.upsertOne","CartItem.deleteOne","CartItem.deleteMany","CartItem.groupBy","CartItem.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","CustomerProfile.findUnique","CustomerProfile.findUniqueOrThrow","CustomerProfile.findFirst","CustomerProfile.findFirstOrThrow","CustomerProfile.findMany","CustomerProfile.createOne","CustomerProfile.createMany","CustomerProfile.createManyAndReturn","CustomerProfile.updateOne","CustomerProfile.updateMany","CustomerProfile.updateManyAndReturn","CustomerProfile.upsertOne","CustomerProfile.deleteOne","CustomerProfile.deleteMany","CustomerProfile.groupBy","CustomerProfile.aggregate","Meal.findUnique","Meal.findUniqueOrThrow","Meal.findFirst","Meal.findFirstOrThrow","Meal.findMany","Meal.createOne","Meal.createMany","Meal.createManyAndReturn","Meal.updateOne","Meal.updateMany","Meal.updateManyAndReturn","Meal.upsertOne","Meal.deleteOne","Meal.deleteMany","Meal.groupBy","Meal.aggregate","MealSize.findUnique","MealSize.findUniqueOrThrow","MealSize.findFirst","MealSize.findFirstOrThrow","MealSize.findMany","MealSize.createOne","MealSize.createMany","MealSize.createManyAndReturn","MealSize.updateOne","MealSize.updateMany","MealSize.updateManyAndReturn","MealSize.upsertOne","MealSize.deleteOne","MealSize.deleteMany","MealSize.groupBy","MealSize.aggregate","MealSpiceLevel.findUnique","MealSpiceLevel.findUniqueOrThrow","MealSpiceLevel.findFirst","MealSpiceLevel.findFirstOrThrow","MealSpiceLevel.findMany","MealSpiceLevel.createOne","MealSpiceLevel.createMany","MealSpiceLevel.createManyAndReturn","MealSpiceLevel.updateOne","MealSpiceLevel.updateMany","MealSpiceLevel.updateManyAndReturn","MealSpiceLevel.upsertOne","MealSpiceLevel.deleteOne","MealSpiceLevel.deleteMany","MealSpiceLevel.groupBy","MealSpiceLevel.aggregate","MealAddOn.findUnique","MealAddOn.findUniqueOrThrow","MealAddOn.findFirst","MealAddOn.findFirstOrThrow","MealAddOn.findMany","MealAddOn.createOne","MealAddOn.createMany","MealAddOn.createManyAndReturn","MealAddOn.updateOne","MealAddOn.updateMany","MealAddOn.updateManyAndReturn","MealAddOn.upsertOne","MealAddOn.deleteOne","MealAddOn.deleteMany","MealAddOn.groupBy","MealAddOn.aggregate","MealRemoveOption.findUnique","MealRemoveOption.findUniqueOrThrow","MealRemoveOption.findFirst","MealRemoveOption.findFirstOrThrow","MealRemoveOption.findMany","MealRemoveOption.createOne","MealRemoveOption.createMany","MealRemoveOption.createManyAndReturn","MealRemoveOption.updateOne","MealRemoveOption.updateMany","MealRemoveOption.updateManyAndReturn","MealRemoveOption.upsertOne","MealRemoveOption.deleteOne","MealRemoveOption.deleteMany","MealRemoveOption.groupBy","MealRemoveOption.aggregate","MealIngredient.findUnique","MealIngredient.findUniqueOrThrow","MealIngredient.findFirst","MealIngredient.findFirstOrThrow","MealIngredient.findMany","MealIngredient.createOne","MealIngredient.createMany","MealIngredient.createManyAndReturn","MealIngredient.updateOne","MealIngredient.updateMany","MealIngredient.updateManyAndReturn","MealIngredient.upsertOne","MealIngredient.deleteOne","MealIngredient.deleteMany","MealIngredient.groupBy","MealIngredient.aggregate","Order.findUnique","Order.findUniqueOrThrow","Order.findFirst","Order.findFirstOrThrow","Order.findMany","Order.createOne","Order.createMany","Order.createManyAndReturn","Order.updateOne","Order.updateMany","Order.updateManyAndReturn","Order.upsertOne","Order.deleteOne","Order.deleteMany","Order.groupBy","Order.aggregate","OrderItem.findUnique","OrderItem.findUniqueOrThrow","OrderItem.findFirst","OrderItem.findFirstOrThrow","OrderItem.findMany","OrderItem.createOne","OrderItem.createMany","OrderItem.createManyAndReturn","OrderItem.updateOne","OrderItem.updateMany","OrderItem.updateManyAndReturn","OrderItem.upsertOne","OrderItem.deleteOne","OrderItem.deleteMany","OrderItem.groupBy","OrderItem.aggregate","OrderStatusHistory.findUnique","OrderStatusHistory.findUniqueOrThrow","OrderStatusHistory.findFirst","OrderStatusHistory.findFirstOrThrow","OrderStatusHistory.findMany","OrderStatusHistory.createOne","OrderStatusHistory.createMany","OrderStatusHistory.createManyAndReturn","OrderStatusHistory.updateOne","OrderStatusHistory.updateMany","OrderStatusHistory.updateManyAndReturn","OrderStatusHistory.upsertOne","OrderStatusHistory.deleteOne","OrderStatusHistory.deleteMany","OrderStatusHistory.groupBy","OrderStatusHistory.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","ProviderProfile.findUnique","ProviderProfile.findUniqueOrThrow","ProviderProfile.findFirst","ProviderProfile.findFirstOrThrow","ProviderProfile.findMany","ProviderProfile.createOne","ProviderProfile.createMany","ProviderProfile.createManyAndReturn","ProviderProfile.updateOne","ProviderProfile.updateMany","ProviderProfile.updateManyAndReturn","ProviderProfile.upsertOne","ProviderProfile.deleteOne","ProviderProfile.deleteMany","ProviderProfile.groupBy","ProviderProfile.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","AND","OR","NOT","id","rating","feedback","images","createdAt","updatedAt","mealId","userId","providerId","equals","in","notIn","lt","lte","gt","gte","not","has","hasEvery","hasSome","contains","startsWith","endsWith","businessName","BusinessCategory","businessCategory","phone","bio","imageURL","binNumber","binVerified","city","street","houseNumber","apartment","postalCode","ApprovalStatus","approvalStatus","rejectionReason","reviewedBy","reviewedAt","isActive","businessKitchenURL","businessMainGateURL","nidImageFront_and_BackURL","businessEmail","currentPayableAmount","lastPaymentAt","totalGrossRevenue","totalOrdersCompleted","totalPlatformFee","totalProviderEarning","every","some","none","orderId","customerId","amount","platformFeePercent","platformFeeAmount","providerShareAmount","transactionId","stripeEventId","gatewayName","PaymentStatus","status","paymentGatewayData","paidAt","failedAt","refundedAt","providerSettledAt","providerSettledBy","providerSettlementNote","ProviderSettlementStatus","providerSettlementStatus","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","OrderStatus","note","changedByUserId","UserRole","changedByRole","mealName","mealSlug","mealImageUrl","quantity","unitPrice","totalPrice","orderNumber","PaymentMethod","paymentMethod","customerName","customerPhone","deliveryCity","deliveryStreetAddress","deliveryPostalCode","deliveryApartment","deliveryHouseNumber","deliveryNote","subtotal","deliveryFee","discountAmount","totalAmount","placedAt","acceptedAt","deliveredAt","cancelledAt","name","price","level","isDefault","extraPrice","categoryId","subcategory","shortDescription","fullDescription","portionSize","mainImageURL","galleryImageURLs","basePrice","discountPrice","dietaryPreferences","allergens","calories","protein","fat","carbohydrates","isAvailable","preparationTimeMinutes","isBestseller","isFeatured","tags","discountEndDate","discountStartDate","DietaryPreference","streetAddress","latitude","longitude","slug","displayOrder","cartId","baseUnitPrice","identifier","value","expiresAt","accountId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","role","userAccountStatus","needPasswordChange","isDeleted","deletedAt","cartId_mealId","HouseType","label","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide","push"]'),
  graph: "9ArHAdACDfQCAADaBQAw9QIAAAQAEPYCAADaBQAw9wIBAAAAAfsCQADoBAAh_AJAAOgEACGWAwEA4gQAIZcDAQDiBAAhmAMBAOIEACGZAwEA5AQAIZoDAQDiBAAh6QMgAOUEACGhBAAA2wWhBCIBAAAAAQAgAQAAAAEAIA30AgAA2gUAMPUCAAAEABD2AgAA2gUAMPcCAQDiBAAh-wJAAOgEACH8AkAA6AQAIZYDAQDiBAAhlwMBAOIEACGYAwEA4gQAIZkDAQDkBAAhmgMBAOIEACHpAyAA5QQAIaEEAADbBaEEIgGZAwAA3AUAIAMAAAAEACADAAAFADAEAAABACADAAAABAAgAwAABQAwBAAAAQAgAwAAAAQAIAMAAAUAMAQAAAEAIAr3AgEAAAAB-wJAAAAAAfwCQAAAAAGWAwEAAAABlwMBAAAAAZgDAQAAAAGZAwEAAAABmgMBAAAAAekDIAAAAAGhBAAAAKEEAgEIAAAJACAK9wIBAAAAAfsCQAAAAAH8AkAAAAABlgMBAAAAAZcDAQAAAAGYAwEAAAABmQMBAAAAAZoDAQAAAAHpAyAAAAABoQQAAAChBAIBCAAACwAwAQgAAAsAMAr3AgEA4gUAIfsCQADmBQAh_AJAAOYFACGWAwEA4gUAIZcDAQDiBQAhmAMBAOIFACGZAwEA5AUAIZoDAQDiBQAh6QMgAPQFACGhBAAA2wmhBCICAAAAAQAgCAAADgAgCvcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIZYDAQDiBQAhlwMBAOIFACGYAwEA4gUAIZkDAQDkBQAhmgMBAOIFACHpAyAA9AUAIaEEAADbCaEEIgIAAAAEACAIAAAQACACAAAABAAgCAAAEAAgAwAAAAEAIA8AAAkAIBAAAA4AIAEAAAABACABAAAABAAgBBUAANgJACAWAADaCQAgFwAA2QkAIJkDAADcBQAgDfQCAADWBQAw9QIAABcAEPYCAADWBQAw9wIBAMAEACH7AkAAxAQAIfwCQADEBAAhlgMBAMAEACGXAwEAwAQAIZgDAQDABAAhmQMBAMIEACGaAwEAwAQAIekDIADRBAAhoQQAANcFoQQiAwAAAAQAIAMAABYAMBQAABcAIAMAAAAEACADAAAFADAEAAABACAXGwAAqwUAICkAAPAEACArAADuBAAgLgAA7QQAIC8AAKwFACAwAACtBQAgMQAArgUAIPQCAACoBQAw9QIAAH0AEPYCAACoBQAw9wIBAAAAAfsCQADoBAAh_AJAAOgEACGRAwEA5AQAIbgDAACqBZwEIuYDAQDiBAAhlwQBAAAAAZgEIADlBAAhmQQBAOQEACGaBAAAqQXMAyKcBCAA5QQAIZ0EIADlBAAhngRAAOcEACEBAAAAGgAgERoAAO8EACD0AgAA1QUAMPUCAAAcABD2AgAA1QUAMPcCAQDiBAAh-wJAAOgEACH8AkAA6AQAIf4CAQDiBAAh_wIBAOIEACGMBAEA4gQAIY0EAQDkBAAhjgQBAOQEACGPBAEA5AQAIZAEQADnBAAhkQRAAOcEACGSBAEA5AQAIZMEAQDkBAAhCBoAAIQIACCNBAAA3AUAII4EAADcBQAgjwQAANwFACCQBAAA3AUAIJEEAADcBQAgkgQAANwFACCTBAAA3AUAIBEaAADvBAAg9AIAANUFADD1AgAAHAAQ9gIAANUFADD3AgEAAAAB-wJAAOgEACH8AkAA6AQAIf4CAQDiBAAh_wIBAOIEACGMBAEA4gQAIY0EAQDkBAAhjgQBAOQEACGPBAEA5AQAIZAEQADnBAAhkQRAAOcEACGSBAEA5AQAIZMEAQDkBAAhAwAAABwAIAMAAB0AMAQAAB4AIBEaAADvBAAgHgAAmAUAIPQCAACWBQAw9QIAACAAEPYCAACWBQAw9wIBAOIEACH7AkAA6AQAIfwCQADoBAAh_gIBAOIEACGRAwEA4gQAIZYDAQDiBAAhmAMBAOIEACGZAwEA5AQAIZoDAQDiBAAhggQBAOIEACGDBBAAlwUAIYQEEACXBQAhAQAAACAAIA8cAADUBQAgIAAAzAUAICMAALMFACD0AgAA0wUAMPUCAAAiABD2AgAA0wUAMPcCAQDiBAAh-wJAAOgEACH8AkAA6AQAIf8CAQDiBAAhrwMBAOIEACHeAxAA6QQAId8DEADpBAAh4AMQAOkEACHhAxAA6QQAIQEAAAAiACADHAAAygkAICAAANEJACAjAADLCQAgDxwAANQFACAgAADMBQAgIwAAswUAIPQCAADTBQAw9QIAACIAEPYCAADTBQAw9wIBAAAAAfsCQADoBAAh_AJAAOgEACH_AgEA4gQAIa8DAQAAAAHeAxAA6QQAId8DEADpBAAh4AMQAOkEACHhAxAA6QQAIQMAAAAiACADAAAkADAEAAAlACAqIAAAzAUAICIAAM0FACAjAACzBQAgJAAAzgUAICUAAM8FACAmAADQBQAgJwAA0QUAICgAANIFACApAADwBAAgLAAAtAUAIPQCAADJBQAw9QIAACcAEPYCAADJBQAw9wIBAOIEACH7AkAA6AQAIfwCQADoBAAh_wIBAOIEACGgAyAA5QQAId8DAgDqBAAh5gMBAOIEACHrAwEA4gQAIewDAQDkBAAh7QMBAOIEACHuAwEA5AQAIe8DAQDkBAAh8AMBAOIEACHxAwAAwwQAIPIDAgDqBAAh8wMCAMoFACH0AwAAjQUAIPUDAADDBAAg9gMCAMoFACH3AwgAywUAIfgDCADLBQAh-QMIAMsFACH6AyAA5QQAIfsDAgDqBAAh_AMgAOUEACH9AyAA5QQAIf4DAADDBAAg_wNAAOcEACGABEAA5wQAIRQgAADRCQAgIgAA0gkAICMAAMsJACAkAADTCQAgJQAA1AkAICYAANUJACAnAADWCQAgKAAA1wkAICkAAIUIACAsAADNCQAg7AMAANwFACDuAwAA3AUAIO8DAADcBQAg8wMAANwFACD2AwAA3AUAIPcDAADcBQAg-AMAANwFACD5AwAA3AUAIP8DAADcBQAggAQAANwFACAqIAAAzAUAICIAAM0FACAjAACzBQAgJAAAzgUAICUAAM8FACAmAADQBQAgJwAA0QUAICgAANIFACApAADwBAAgLAAAtAUAIPQCAADJBQAw9QIAACcAEPYCAADJBQAw9wIBAAAAAfsCQADoBAAh_AJAAOgEACH_AgEA4gQAIaADIADlBAAh3wMCAOoEACHmAwEA4gQAIesDAQDiBAAh7AMBAOQEACHtAwEA4gQAIe4DAQDkBAAh7wMBAOQEACHwAwEA4gQAIfEDAADDBAAg8gMCAOoEACHzAwIAygUAIfQDAACNBQAg9QMAAMMEACD2AwIAygUAIfcDCADLBQAh-AMIAMsFACH5AwgAywUAIfoDIADlBAAh-wMCAOoEACH8AyAA5QQAIf0DIADlBAAh_gMAAMMEACD_A0AA5wQAIYAEQADnBAAhAwAAACcAIAMAACgAMAQAACkAIA4eAADIBQAgHwAAvgUAIPQCAADHBQAw9QIAACsAEPYCAADHBQAw9wIBAOIEACH7AkAA6AQAIfwCQADoBAAh_QIBAOIEACHQAwIA6gQAIdEDEADpBAAh0gMQAOkEACGHBAEA4gQAIYgEEADpBAAhAh4AANEIACAfAADQCQAgDx4AAMgFACAfAAC-BQAg9AIAAMcFADD1AgAAKwAQ9gIAAMcFADD3AgEAAAAB-wJAAOgEACH8AkAA6AQAIf0CAQDiBAAh0AMCAOoEACHRAxAA6QQAIdIDEADpBAAhhwQBAOIEACGIBBAA6QQAIZ8EAADGBQAgAwAAACsAIAMAACwAMAQAAC0AIAMAAAAnACADAAAoADAEAAApACABAAAAJwAgCB8AAL4FACD0AgAAxQUAMPUCAAAxABD2AgAAxQUAMPcCAQDiBAAh_QIBAOIEACHmAwEA4gQAIecDAgDqBAAhAR8AANAJACAIHwAAvgUAIPQCAADFBQAw9QIAADEAEPYCAADFBQAw9wIBAAAAAf0CAQDiBAAh5gMBAOIEACHnAwIA6gQAIQMAAAAxACADAAAyADAEAAAzACAHHwAAvgUAIPQCAADEBQAw9QIAADUAEPYCAADEBQAw9wIBAOIEACH9AgEA4gQAIeYDAQDiBAAhAR8AANAJACAHHwAAvgUAIPQCAADEBQAw9QIAADUAEPYCAADEBQAw9wIBAAAAAf0CAQDiBAAh5gMBAOIEACEDAAAANQAgAwAANgAwBAAANwAgBx8AAL4FACD0AgAAwwUAMPUCAAA5ABD2AgAAwwUAMPcCAQDiBAAh_QIBAOIEACHmAwEA4gQAIQEfAADQCQAgBx8AAL4FACD0AgAAwwUAMPUCAAA5ABD2AgAAwwUAMPcCAQAAAAH9AgEA4gQAIeYDAQDiBAAhAwAAADkAIAMAADoAMAQAADsAIAkfAAC-BQAg9AIAAMIFADD1AgAAPQAQ9gIAAMIFADD3AgEA4gQAIf0CAQDiBAAh5gMBAOIEACHpAyAA5QQAIeoDAgDqBAAhAR8AANAJACAJHwAAvgUAIPQCAADCBQAw9QIAAD0AEPYCAADCBQAw9wIBAAAAAf0CAQDiBAAh5gMBAOIEACHpAyAA5QQAIeoDAgDqBAAhAwAAAD0AIAMAAD4AMAQAAD8AIAgfAAC-BQAg9AIAAMEFADD1AgAAQQAQ9gIAAMEFADD3AgEA4gQAIf0CAQDiBAAh6AMBAOIEACHpAyAA5QQAIQEfAADQCQAgCB8AAL4FACD0AgAAwQUAMPUCAABBABD2AgAAwQUAMPcCAQAAAAH9AgEA4gQAIegDAQDiBAAh6QMgAOUEACEDAAAAQQAgAwAAQgAwBAAAQwAgDxoAAO8EACAfAAC-BQAgIwAAswUAIPQCAAC_BQAw9QIAAEUAEPYCAAC_BQAw9wIBAOIEACH4AggAwAUAIfkCAQDkBAAh-gIAAMMEACD7AkAA6AQAIfwCQADoBAAh_QIBAOIEACH-AgEA4gQAIf8CAQDiBAAhBBoAAIQIACAfAADQCQAgIwAAywkAIPkCAADcBQAgDxoAAO8EACAfAAC-BQAgIwAAswUAIPQCAAC_BQAw9QIAAEUAEPYCAAC_BQAw9wIBAAAAAfgCCADABQAh-QIBAOQEACH6AgAAwwQAIPsCQADoBAAh_AJAAOgEACH9AgEA4gQAIf4CAQDiBAAh_wIBAOIEACEDAAAARQAgAwAARgAwBAAARwAgDx8AAL4FACAqAAC4BQAg9AIAAL0FADD1AgAASQAQ9gIAAL0FADD3AgEA4gQAIfsCQADoBAAh_QIBAOIEACGuAwEA4gQAIc0DAQDiBAAhzgMBAOQEACHPAwEA5AQAIdADAgDqBAAh0QMQAOkEACHSAxAA6QQAIQQfAADQCQAgKgAAzwkAIM4DAADcBQAgzwMAANwFACAPHwAAvgUAICoAALgFACD0AgAAvQUAMPUCAABJABD2AgAAvQUAMPcCAQAAAAH7AkAA6AQAIf0CAQDiBAAhrgMBAOIEACHNAwEA4gQAIc4DAQDkBAAhzwMBAOQEACHQAwIA6gQAIdEDEADpBAAh0gMQAOkEACEDAAAASQAgAwAASgAwBAAASwAgHBwAAO8EACAjAACzBQAgKgAAuAUAIPQCAAC5BQAw9QIAAE0AEPYCAAC5BQAw9wIBAOIEACH7AkAA6AQAIfwCQADoBAAh_wIBAOIEACGuAwEA4gQAIa8DAQDiBAAhsAMQAOkEACGxAxAA6QQAIbIDEADpBAAhswMQAOkEACG0AwEA4gQAIbUDAQDkBAAhtgMBAOQEACG4AwAAugW4AyK5AwAAuwUAILoDQADnBAAhuwNAAOcEACG8A0AA5wQAIb0DQADnBAAhvgMBAOQEACG_AwEA5AQAIcEDAAC8BcEDIgwcAACECAAgIwAAywkAICoAAM8JACC1AwAA3AUAILYDAADcBQAguQMAANwFACC6AwAA3AUAILsDAADcBQAgvAMAANwFACC9AwAA3AUAIL4DAADcBQAgvwMAANwFACAcHAAA7wQAICMAALMFACAqAAC4BQAg9AIAALkFADD1AgAATQAQ9gIAALkFADD3AgEAAAAB-wJAAOgEACH8AkAA6AQAIf8CAQDiBAAhrgMBAOIEACGvAwEA4gQAIbADEADpBAAhsQMQAOkEACGyAxAA6QQAIbMDEADpBAAhtAMBAAAAAbUDAQAAAAG2AwEA5AQAIbgDAAC6BbgDIrkDAAC7BQAgugNAAOcEACG7A0AA5wQAIbwDQADnBAAhvQNAAOcEACG-AwEA5AQAIb8DAQDkBAAhwQMAALwFwQMiAwAAAE0AIAMAAE4AMAQAAE8AIAMAAABJACADAABKADAEAABLACALKgAAuAUAIPQCAAC2BQAw9QIAAFIAEPYCAAC2BQAw9wIBAOIEACH7AkAA6AQAIa4DAQDiBAAhuAMAALIFyQMiyQMBAOQEACHKAwEA5AQAIcwDAAC3BcwDIwQqAADPCQAgyQMAANwFACDKAwAA3AUAIMwDAADcBQAgCyoAALgFACD0AgAAtgUAMPUCAABSABD2AgAAtgUAMPcCAQAAAAH7AkAA6AQAIa4DAQDiBAAhuAMAALIFyQMiyQMBAOQEACHKAwEA5AQAIcwDAAC3BcwDIwMAAABSACADAABTADAEAABUACABAAAATQAgAQAAAEkAIAEAAABSACABAAAAKwAgAQAAADEAIAEAAAA1ACABAAAAOQAgAQAAAD0AIAEAAABBACABAAAARQAgAQAAAEkAICAcAADvBAAgIwAAswUAICsAAO4EACAsAAC0BQAgLQAAtQUAIPQCAACwBQAw9QIAAGEAEPYCAACwBQAw9wIBAOIEACH7AkAA6AQAIfwCQADoBAAh_wIBAOIEACGvAwEA4gQAIbgDAACyBckDItMDAQDiBAAh1QMAALEF1QMi1gMBAOQEACHXAwEA5AQAIdgDAQDiBAAh2QMBAOQEACHaAwEA5AQAIdsDAQDkBAAh3AMBAOQEACHdAwEA5AQAId4DEADpBAAh3wMQAOkEACHgAxAA6QQAIeEDEADpBAAh4gNAAOcEACHjA0AA5wQAIeQDQADnBAAh5QNAAOcEACEQHAAAhAgAICMAAMsJACArAACDCAAgLAAAzQkAIC0AAM4JACDWAwAA3AUAINcDAADcBQAg2QMAANwFACDaAwAA3AUAINsDAADcBQAg3AMAANwFACDdAwAA3AUAIOIDAADcBQAg4wMAANwFACDkAwAA3AUAIOUDAADcBQAgIBwAAO8EACAjAACzBQAgKwAA7gQAICwAALQFACAtAAC1BQAg9AIAALAFADD1AgAAYQAQ9gIAALAFADD3AgEAAAAB-wJAAOgEACH8AkAA6AQAIf8CAQDiBAAhrwMBAOIEACG4AwAAsgXJAyLTAwEAAAAB1QMAALEF1QMi1gMBAOQEACHXAwEA5AQAIdgDAQDiBAAh2QMBAOQEACHaAwEA5AQAIdsDAQDkBAAh3AMBAOQEACHdAwEA5AQAId4DEADpBAAh3wMQAOkEACHgAxAA6QQAIeEDEADpBAAh4gNAAOcEACHjA0AA5wQAIeQDQADnBAAh5QNAAOcEACEDAAAAYQAgAwAAYgAwBAAAYwAgAwAAAE0AIAMAAE4AMAQAAE8AIAMAAABFACADAABGADAEAABHACABAAAAIgAgAQAAACcAIAEAAABhACABAAAATQAgAQAAAEUAIAMAAAArACADAAAsADAEAAAtACABAAAAKwAgAwAAAGEAIAMAAGIAMAQAAGMAIAMAAABNACADAABOADAEAABPACAoGgAA7wQAIB0AAOsEACAhAADsBAAgKQAA8AQAICsAAO4EACAuAADtBAAg9AIAAOEEADD1AgAAcAAQ9gIAAOEEADD3AgEA4gQAIfsCQADoBAAh_AJAAOgEACH-AgEA4gQAIY4DAQDiBAAhkAMAAOMEkAMikQMBAOIEACGSAwEA5AQAIZMDAQDkBAAhlAMBAOQEACGVAyAA5QQAIZYDAQDiBAAhlwMBAOIEACGYAwEA4gQAIZkDAQDkBAAhmgMBAOIEACGcAwAA5gScAyKdAwEA5AQAIZ4DAQDkBAAhnwNAAOcEACGgAyAA5QQAIaEDAQDkBAAhogMBAOQEACGjAwEA5AQAIaQDAQDiBAAhpQMQAOkEACGmA0AA5wQAIacDEADpBAAhqAMCAOoEACGpAxAA6QQAIaoDEADpBAAhAQAAAHAAIAMAAABFACADAABGADAEAABHACAMGgAA7wQAIPQCAACvBQAw9QIAAHMAEPYCAACvBQAw9wIBAOIEACH7AkAA6AQAIfwCQADoBAAh_gIBAOIEACGLBEAA6AQAIZQEAQDiBAAhlQQBAOQEACGWBAEA5AQAIQMaAACECAAglQQAANwFACCWBAAA3AUAIAwaAADvBAAg9AIAAK8FADD1AgAAcwAQ9gIAAK8FADD3AgEAAAAB-wJAAOgEACH8AkAA6AQAIf4CAQDiBAAhiwRAAOgEACGUBAEAAAABlQQBAOQEACGWBAEA5AQAIQMAAABzACADAAB0ADAEAAB1ACABAAAAHAAgAQAAAGEAIAEAAABNACABAAAARQAgAQAAAHMAIAEAAAAaACAXGwAAqwUAICkAAPAEACArAADuBAAgLgAA7QQAIC8AAKwFACAwAACtBQAgMQAArgUAIPQCAACoBQAw9QIAAH0AEPYCAACoBQAw9wIBAOIEACH7AkAA6AQAIfwCQADoBAAhkQMBAOQEACG4AwAAqgWcBCLmAwEA4gQAIZcEAQDiBAAhmAQgAOUEACGZBAEA5AQAIZoEAACpBcwDIpwEIADlBAAhnQQgAOUEACGeBEAA5wQAIQobAADJCQAgKQAAhQgAICsAAIMIACAuAACCCAAgLwAAygkAIDAAAMsJACAxAADMCQAgkQMAANwFACCZBAAA3AUAIJ4EAADcBQAgAwAAAH0AIAMAAH4AMAQAABoAIAMAAAB9ACADAAB-ADAEAAAaACADAAAAfQAgAwAAfgAwBAAAGgAgFBsAAMIJACApAADHCQAgKwAAxQkAIC4AAMQJACAvAADDCQAgMAAAxgkAIDEAAMgJACD3AgEAAAAB-wJAAAAAAfwCQAAAAAGRAwEAAAABuAMAAACcBALmAwEAAAABlwQBAAAAAZgEIAAAAAGZBAEAAAABmgQAAADMAwKcBCAAAAABnQQgAAAAAZ4EQAAAAAEBCAAAggEAIA33AgEAAAAB-wJAAAAAAfwCQAAAAAGRAwEAAAABuAMAAACcBALmAwEAAAABlwQBAAAAAZgEIAAAAAGZBAEAAAABmgQAAADMAwKcBCAAAAABnQQgAAAAAZ4EQAAAAAEBCAAAhAEAMAEIAACEAQAwFBsAAP4IACApAACDCQAgKwAAgQkAIC4AAIAJACAvAAD_CAAgMAAAggkAIDEAAIQJACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACGRAwEA5AUAIbgDAAD9CJwEIuYDAQDiBQAhlwQBAOIFACGYBCAA9AUAIZkEAQDkBQAhmgQAAPwIzAMinAQgAPQFACGdBCAA9AUAIZ4EQAD2BQAhAgAAABoAIAgAAIcBACAN9wIBAOIFACH7AkAA5gUAIfwCQADmBQAhkQMBAOQFACG4AwAA_QicBCLmAwEA4gUAIZcEAQDiBQAhmAQgAPQFACGZBAEA5AUAIZoEAAD8CMwDIpwEIAD0BQAhnQQgAPQFACGeBEAA9gUAIQIAAAB9ACAIAACJAQAgAgAAAH0AIAgAAIkBACADAAAAGgAgDwAAggEAIBAAAIcBACABAAAAGgAgAQAAAH0AIAYVAAD5CAAgFgAA-wgAIBcAAPoIACCRAwAA3AUAIJkEAADcBQAgngQAANwFACAQ9AIAAKEFADD1AgAAkAEAEPYCAAChBQAw9wIBAMAEACH7AkAAxAQAIfwCQADEBAAhkQMBAMIEACG4AwAAowWcBCLmAwEAwAQAIZcEAQDABAAhmAQgANEEACGZBAEAwgQAIZoEAACiBcwDIpwEIADRBAAhnQQgANEEACGeBEAA0wQAIQMAAAB9ACADAACPAQAwFAAAkAEAIAMAAAB9ACADAAB-ADAEAAAaACABAAAAdQAgAQAAAHUAIAMAAABzACADAAB0ADAEAAB1ACADAAAAcwAgAwAAdAAwBAAAdQAgAwAAAHMAIAMAAHQAMAQAAHUAIAkaAAD4CAAg9wIBAAAAAfsCQAAAAAH8AkAAAAAB_gIBAAAAAYsEQAAAAAGUBAEAAAABlQQBAAAAAZYEAQAAAAEBCAAAmAEAIAj3AgEAAAAB-wJAAAAAAfwCQAAAAAH-AgEAAAABiwRAAAAAAZQEAQAAAAGVBAEAAAABlgQBAAAAAQEIAACaAQAwAQgAAJoBADAJGgAA9wgAIPcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIf4CAQDiBQAhiwRAAOYFACGUBAEA4gUAIZUEAQDkBQAhlgQBAOQFACECAAAAdQAgCAAAnQEAIAj3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH-AgEA4gUAIYsEQADmBQAhlAQBAOIFACGVBAEA5AUAIZYEAQDkBQAhAgAAAHMAIAgAAJ8BACACAAAAcwAgCAAAnwEAIAMAAAB1ACAPAACYAQAgEAAAnQEAIAEAAAB1ACABAAAAcwAgBRUAAPQIACAWAAD2CAAgFwAA9QgAIJUEAADcBQAglgQAANwFACAL9AIAAKAFADD1AgAApgEAEPYCAACgBQAw9wIBAMAEACH7AkAAxAQAIfwCQADEBAAh_gIBAMAEACGLBEAAxAQAIZQEAQDABAAhlQQBAMIEACGWBAEAwgQAIQMAAABzACADAAClAQAwFAAApgEAIAMAAABzACADAAB0ADAEAAB1ACABAAAAHgAgAQAAAB4AIAMAAAAcACADAAAdADAEAAAeACADAAAAHAAgAwAAHQAwBAAAHgAgAwAAABwAIAMAAB0AMAQAAB4AIA4aAADzCAAg9wIBAAAAAfsCQAAAAAH8AkAAAAAB_gIBAAAAAf8CAQAAAAGMBAEAAAABjQQBAAAAAY4EAQAAAAGPBAEAAAABkARAAAAAAZEEQAAAAAGSBAEAAAABkwQBAAAAAQEIAACuAQAgDfcCAQAAAAH7AkAAAAAB_AJAAAAAAf4CAQAAAAH_AgEAAAABjAQBAAAAAY0EAQAAAAGOBAEAAAABjwQBAAAAAZAEQAAAAAGRBEAAAAABkgQBAAAAAZMEAQAAAAEBCAAAsAEAMAEIAACwAQAwDhoAAPIIACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH-AgEA4gUAIf8CAQDiBQAhjAQBAOIFACGNBAEA5AUAIY4EAQDkBQAhjwQBAOQFACGQBEAA9gUAIZEEQAD2BQAhkgQBAOQFACGTBAEA5AUAIQIAAAAeACAIAACzAQAgDfcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIf4CAQDiBQAh_wIBAOIFACGMBAEA4gUAIY0EAQDkBQAhjgQBAOQFACGPBAEA5AUAIZAEQAD2BQAhkQRAAPYFACGSBAEA5AUAIZMEAQDkBQAhAgAAABwAIAgAALUBACACAAAAHAAgCAAAtQEAIAMAAAAeACAPAACuAQAgEAAAswEAIAEAAAAeACABAAAAHAAgChUAAO8IACAWAADxCAAgFwAA8AgAII0EAADcBQAgjgQAANwFACCPBAAA3AUAIJAEAADcBQAgkQQAANwFACCSBAAA3AUAIJMEAADcBQAgEPQCAACfBQAw9QIAALwBABD2AgAAnwUAMPcCAQDABAAh-wJAAMQEACH8AkAAxAQAIf4CAQDABAAh_wIBAMAEACGMBAEAwAQAIY0EAQDCBAAhjgQBAMIEACGPBAEAwgQAIZAEQADTBAAhkQRAANMEACGSBAEAwgQAIZMEAQDCBAAhAwAAABwAIAMAALsBADAUAAC8AQAgAwAAABwAIAMAAB0AMAQAAB4AIAn0AgAAngUAMPUCAADCAQAQ9gIAAJ4FADD3AgEAAAAB-wJAAOgEACH8AkAA6AQAIYkEAQDiBAAhigQBAOIEACGLBEAA6AQAIQEAAAC_AQAgAQAAAL8BACAJ9AIAAJ4FADD1AgAAwgEAEPYCAACeBQAw9wIBAOIEACH7AkAA6AQAIfwCQADoBAAhiQQBAOIEACGKBAEA4gQAIYsEQADoBAAhAAMAAADCAQAgAwAAwwEAMAQAAL8BACADAAAAwgEAIAMAAMMBADAEAAC_AQAgAwAAAMIBACADAADDAQAwBAAAvwEAIAb3AgEAAAAB-wJAAAAAAfwCQAAAAAGJBAEAAAABigQBAAAAAYsEQAAAAAEBCAAAxwEAIAb3AgEAAAAB-wJAAAAAAfwCQAAAAAGJBAEAAAABigQBAAAAAYsEQAAAAAEBCAAAyQEAMAEIAADJAQAwBvcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIYkEAQDiBQAhigQBAOIFACGLBEAA5gUAIQIAAAC_AQAgCAAAzAEAIAb3AgEA4gUAIfsCQADmBQAh_AJAAOYFACGJBAEA4gUAIYoEAQDiBQAhiwRAAOYFACECAAAAwgEAIAgAAM4BACACAAAAwgEAIAgAAM4BACADAAAAvwEAIA8AAMcBACAQAADMAQAgAQAAAL8BACABAAAAwgEAIAMVAADsCAAgFgAA7ggAIBcAAO0IACAJ9AIAAJ0FADD1AgAA1QEAEPYCAACdBQAw9wIBAMAEACH7AkAAxAQAIfwCQADEBAAhiQQBAMAEACGKBAEAwAQAIYsEQADEBAAhAwAAAMIBACADAADUAQAwFAAA1QEAIAMAAADCAQAgAwAAwwEAMAQAAL8BACABAAAAJQAgAQAAACUAIAMAAAAiACADAAAkADAEAAAlACADAAAAIgAgAwAAJAAwBAAAJQAgAwAAACIAIAMAACQAMAQAACUAIAwcAAD4BwAgIAAA-QcAICMAAM4IACD3AgEAAAAB-wJAAAAAAfwCQAAAAAH_AgEAAAABrwMBAAAAAd4DEAAAAAHfAxAAAAAB4AMQAAAAAeEDEAAAAAEBCAAA3QEAIAn3AgEAAAAB-wJAAAAAAfwCQAAAAAH_AgEAAAABrwMBAAAAAd4DEAAAAAHfAxAAAAAB4AMQAAAAAeEDEAAAAAEBCAAA3wEAMAEIAADfAQAwDBwAAOoHACAgAADrBwAgIwAAzQgAIPcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIf8CAQDiBQAhrwMBAOIFACHeAxAA9wUAId8DEAD3BQAh4AMQAPcFACHhAxAA9wUAIQIAAAAlACAIAADiAQAgCfcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIf8CAQDiBQAhrwMBAOIFACHeAxAA9wUAId8DEAD3BQAh4AMQAPcFACHhAxAA9wUAIQIAAAAiACAIAADkAQAgAgAAACIAIAgAAOQBACADAAAAJQAgDwAA3QEAIBAAAOIBACABAAAAJQAgAQAAACIAIAUVAADnCAAgFgAA6ggAIBcAAOkIACCAAQAA6AgAIIEBAADrCAAgDPQCAACcBQAw9QIAAOsBABD2AgAAnAUAMPcCAQDABAAh-wJAAMQEACH8AkAAxAQAIf8CAQDABAAhrwMBAMAEACHeAxAA1AQAId8DEADUBAAh4AMQANQEACHhAxAA1AQAIQMAAAAiACADAADqAQAwFAAA6wEAIAMAAAAiACADAAAkADAEAAAlACABAAAALQAgAQAAAC0AIAMAAAArACADAAAsADAEAAAtACADAAAAKwAgAwAALAAwBAAALQAgAwAAACsAIAMAACwAMAQAAC0AIAseAADQBwAgHwAA9gcAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAf0CAQAAAAHQAwIAAAAB0QMQAAAAAdIDEAAAAAGHBAEAAAABiAQQAAAAAQEIAADzAQAgCfcCAQAAAAH7AkAAAAAB_AJAAAAAAf0CAQAAAAHQAwIAAAAB0QMQAAAAAdIDEAAAAAGHBAEAAAABiAQQAAAAAQEIAAD1AQAwAQgAAPUBADALHgAAzgcAIB8AAPQHACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH9AgEA4gUAIdADAgD4BQAh0QMQAPcFACHSAxAA9wUAIYcEAQDiBQAhiAQQAPcFACECAAAALQAgCAAA-AEAIAn3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH9AgEA4gUAIdADAgD4BQAh0QMQAPcFACHSAxAA9wUAIYcEAQDiBQAhiAQQAPcFACECAAAAKwAgCAAA-gEAIAIAAAArACAIAAD6AQAgAwAAAC0AIA8AAPMBACAQAAD4AQAgAQAAAC0AIAEAAAArACAFFQAA4ggAIBYAAOUIACAXAADkCAAggAEAAOMIACCBAQAA5ggAIAz0AgAAmwUAMPUCAACBAgAQ9gIAAJsFADD3AgEAwAQAIfsCQADEBAAh_AJAAMQEACH9AgEAwAQAIdADAgDVBAAh0QMQANQEACHSAxAA1AQAIYcEAQDABAAhiAQQANQEACEDAAAAKwAgAwAAgAIAMBQAAIECACADAAAAKwAgAwAALAAwBAAALQAgDCEAAOwEACD0AgAAmgUAMPUCAACHAgAQ9gIAAJoFADD3AgEAAAAB-wJAAOgEACH8AkAA6AQAIZMDAQDiBAAhoAMgAOUEACHmAwEAAAABhQQBAAAAAYYEAgDqBAAhAQAAAIQCACABAAAAhAIAIAwhAADsBAAg9AIAAJoFADD1AgAAhwIAEPYCAACaBQAw9wIBAOIEACH7AkAA6AQAIfwCQADoBAAhkwMBAOIEACGgAyAA5QQAIeYDAQDiBAAhhQQBAOIEACGGBAIA6gQAIQEhAACBCAAgAwAAAIcCACADAACIAgAwBAAAhAIAIAMAAACHAgAgAwAAiAIAMAQAAIQCACADAAAAhwIAIAMAAIgCADAEAACEAgAgCSEAAOEIACD3AgEAAAAB-wJAAAAAAfwCQAAAAAGTAwEAAAABoAMgAAAAAeYDAQAAAAGFBAEAAAABhgQCAAAAAQEIAACMAgAgCPcCAQAAAAH7AkAAAAAB_AJAAAAAAZMDAQAAAAGgAyAAAAAB5gMBAAAAAYUEAQAAAAGGBAIAAAABAQgAAI4CADABCAAAjgIAMAkhAADXCAAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAhkwMBAOIFACGgAyAA9AUAIeYDAQDiBQAhhQQBAOIFACGGBAIA-AUAIQIAAACEAgAgCAAAkQIAIAj3AgEA4gUAIfsCQADmBQAh_AJAAOYFACGTAwEA4gUAIaADIAD0BQAh5gMBAOIFACGFBAEA4gUAIYYEAgD4BQAhAgAAAIcCACAIAACTAgAgAgAAAIcCACAIAACTAgAgAwAAAIQCACAPAACMAgAgEAAAkQIAIAEAAACEAgAgAQAAAIcCACAFFQAA0ggAIBYAANUIACAXAADUCAAggAEAANMIACCBAQAA1ggAIAv0AgAAmQUAMPUCAACaAgAQ9gIAAJkFADD3AgEAwAQAIfsCQADEBAAh_AJAAMQEACGTAwEAwAQAIaADIADRBAAh5gMBAMAEACGFBAEAwAQAIYYEAgDVBAAhAwAAAIcCACADAACZAgAwFAAAmgIAIAMAAACHAgAgAwAAiAIAMAQAAIQCACARGgAA7wQAIB4AAJgFACD0AgAAlgUAMPUCAAAgABD2AgAAlgUAMPcCAQAAAAH7AkAA6AQAIfwCQADoBAAh_gIBAAAAAZEDAQDiBAAhlgMBAOIEACGYAwEA4gQAIZkDAQDkBAAhmgMBAOIEACGCBAEA4gQAIYMEEACXBQAhhAQQAJcFACEBAAAAnQIAIAEAAACdAgAgBRoAAIQIACAeAADRCAAgmQMAANwFACCDBAAA3AUAIIQEAADcBQAgAwAAACAAIAMAAKACADAEAACdAgAgAwAAACAAIAMAAKACADAEAACdAgAgAwAAACAAIAMAAKACADAEAACdAgAgDhoAANAIACAeAADPCAAg9wIBAAAAAfsCQAAAAAH8AkAAAAAB_gIBAAAAAZEDAQAAAAGWAwEAAAABmAMBAAAAAZkDAQAAAAGaAwEAAAABggQBAAAAAYMEEAAAAAGEBBAAAAABAQgAAKQCACAM9wIBAAAAAfsCQAAAAAH8AkAAAAAB_gIBAAAAAZEDAQAAAAGWAwEAAAABmAMBAAAAAZkDAQAAAAGaAwEAAAABggQBAAAAAYMEEAAAAAGEBBAAAAABAQgAAKYCADABCAAApgIAMA4aAADHCAAgHgAAxggAIPcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIf4CAQDiBQAhkQMBAOIFACGWAwEA4gUAIZgDAQDiBQAhmQMBAOQFACGaAwEA4gUAIYIEAQDiBQAhgwQQAMUIACGEBBAAxQgAIQIAAACdAgAgCAAAqQIAIAz3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH-AgEA4gUAIZEDAQDiBQAhlgMBAOIFACGYAwEA4gUAIZkDAQDkBQAhmgMBAOIFACGCBAEA4gUAIYMEEADFCAAhhAQQAMUIACECAAAAIAAgCAAAqwIAIAIAAAAgACAIAACrAgAgAwAAAJ0CACAPAACkAgAgEAAAqQIAIAEAAACdAgAgAQAAACAAIAgVAADACAAgFgAAwwgAIBcAAMIIACCAAQAAwQgAIIEBAADECAAgmQMAANwFACCDBAAA3AUAIIQEAADcBQAgD_QCAACSBQAw9QIAALICABD2AgAAkgUAMPcCAQDABAAh-wJAAMQEACH8AkAAxAQAIf4CAQDABAAhkQMBAMAEACGWAwEAwAQAIZgDAQDABAAhmQMBAMIEACGaAwEAwAQAIYIEAQDABAAhgwQQAJMFACGEBBAAkwUAIQMAAAAgACADAACxAgAwFAAAsgIAIAMAAAAgACADAACgAgAwBAAAnQIAIAEAAAApACABAAAAKQAgAwAAACcAIAMAACgAMAQAACkAIAMAAAAnACADAAAoADAEAAApACADAAAAJwAgAwAAKAAwBAAAKQAgJyAAANYHACAiAADXBwAgIwAAvwgAICQAANgHACAlAADZBwAgJgAA2gcAICcAANsHACAoAADcBwAgKQAA3QcAICwAAN4HACD3AgEAAAAB-wJAAAAAAfwCQAAAAAH_AgEAAAABoAMgAAAAAd8DAgAAAAHmAwEAAAAB6wMBAAAAAewDAQAAAAHtAwEAAAAB7gMBAAAAAe8DAQAAAAHwAwEAAAAB8QMAANIHACDyAwIAAAAB8wMCAAAAAfQDAADTBwAg9QMAANQHACD2AwIAAAAB9wMIAAAAAfgDCAAAAAH5AwgAAAAB-gMgAAAAAfsDAgAAAAH8AyAAAAAB_QMgAAAAAf4DAADVBwAg_wNAAAAAAYAEQAAAAAEBCAAAugIAIB33AgEAAAAB-wJAAAAAAfwCQAAAAAH_AgEAAAABoAMgAAAAAd8DAgAAAAHmAwEAAAAB6wMBAAAAAewDAQAAAAHtAwEAAAAB7gMBAAAAAe8DAQAAAAHwAwEAAAAB8QMAANIHACDyAwIAAAAB8wMCAAAAAfQDAADTBwAg9QMAANQHACD2AwIAAAAB9wMIAAAAAfgDCAAAAAH5AwgAAAAB-gMgAAAAAfsDAgAAAAH8AyAAAAAB_QMgAAAAAf4DAADVBwAg_wNAAAAAAYAEQAAAAAEBCAAAvAIAMAEIAAC8AgAwJyAAAOoGACAiAADrBgAgIwAAvggAICQAAOwGACAlAADtBgAgJgAA7gYAICcAAO8GACAoAADwBgAgKQAA8QYAICwAAPIGACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH_AgEA4gUAIaADIAD0BQAh3wMCAPgFACHmAwEA4gUAIesDAQDiBQAh7AMBAOQFACHtAwEA4gUAIe4DAQDkBQAh7wMBAOQFACHwAwEA4gUAIfEDAADjBgAg8gMCAPgFACHzAwIA5AYAIfQDAADlBgAg9QMAAOYGACD2AwIA5AYAIfcDCADnBgAh-AMIAOcGACH5AwgA5wYAIfoDIAD0BQAh-wMCAPgFACH8AyAA9AUAIf0DIAD0BQAh_gMAAOgGACD_A0AA9gUAIYAEQAD2BQAhAgAAACkAIAgAAL8CACAd9wIBAOIFACH7AkAA5gUAIfwCQADmBQAh_wIBAOIFACGgAyAA9AUAId8DAgD4BQAh5gMBAOIFACHrAwEA4gUAIewDAQDkBQAh7QMBAOIFACHuAwEA5AUAIe8DAQDkBQAh8AMBAOIFACHxAwAA4wYAIPIDAgD4BQAh8wMCAOQGACH0AwAA5QYAIPUDAADmBgAg9gMCAOQGACH3AwgA5wYAIfgDCADnBgAh-QMIAOcGACH6AyAA9AUAIfsDAgD4BQAh_AMgAPQFACH9AyAA9AUAIf4DAADoBgAg_wNAAPYFACGABEAA9gUAIQIAAAAnACAIAADBAgAgAgAAACcAIAgAAMECACADAAAAKQAgDwAAugIAIBAAAL8CACABAAAAKQAgAQAAACcAIA8VAAC5CAAgFgAAvAgAIBcAALsIACCAAQAAuggAIIEBAAC9CAAg7AMAANwFACDuAwAA3AUAIO8DAADcBQAg8wMAANwFACD2AwAA3AUAIPcDAADcBQAg-AMAANwFACD5AwAA3AUAIP8DAADcBQAggAQAANwFACAg9AIAAIsFADD1AgAAyAIAEPYCAACLBQAw9wIBAMAEACH7AkAAxAQAIfwCQADEBAAh_wIBAMAEACGgAyAA0QQAId8DAgDVBAAh5gMBAMAEACHrAwEAwAQAIewDAQDCBAAh7QMBAMAEACHuAwEAwgQAIe8DAQDCBAAh8AMBAMAEACHxAwAAwwQAIPIDAgDVBAAh8wMCAIwFACH0AwAAjQUAIPUDAADDBAAg9gMCAIwFACH3AwgAjgUAIfgDCACOBQAh-QMIAI4FACH6AyAA0QQAIfsDAgDVBAAh_AMgANEEACH9AyAA0QQAIf4DAADDBAAg_wNAANMEACGABEAA0wQAIQMAAAAnACADAADHAgAwFAAAyAIAIAMAAAAnACADAAAoADAEAAApACABAAAAPwAgAQAAAD8AIAMAAAA9ACADAAA-ADAEAAA_ACADAAAAPQAgAwAAPgAwBAAAPwAgAwAAAD0AIAMAAD4AMAQAAD8AIAYfAAC4CAAg9wIBAAAAAf0CAQAAAAHmAwEAAAAB6QMgAAAAAeoDAgAAAAEBCAAA0AIAIAX3AgEAAAAB_QIBAAAAAeYDAQAAAAHpAyAAAAAB6gMCAAAAAQEIAADSAgAwAQgAANICADAGHwAAtwgAIPcCAQDiBQAh_QIBAOIFACHmAwEA4gUAIekDIAD0BQAh6gMCAPgFACECAAAAPwAgCAAA1QIAIAX3AgEA4gUAIf0CAQDiBQAh5gMBAOIFACHpAyAA9AUAIeoDAgD4BQAhAgAAAD0AIAgAANcCACACAAAAPQAgCAAA1wIAIAMAAAA_ACAPAADQAgAgEAAA1QIAIAEAAAA_ACABAAAAPQAgBRUAALIIACAWAAC1CAAgFwAAtAgAIIABAACzCAAggQEAALYIACAI9AIAAIoFADD1AgAA3gIAEPYCAACKBQAw9wIBAMAEACH9AgEAwAQAIeYDAQDABAAh6QMgANEEACHqAwIA1QQAIQMAAAA9ACADAADdAgAwFAAA3gIAIAMAAAA9ACADAAA-ADAEAAA_ACABAAAAQwAgAQAAAEMAIAMAAABBACADAABCADAEAABDACADAAAAQQAgAwAAQgAwBAAAQwAgAwAAAEEAIAMAAEIAMAQAAEMAIAUfAACxCAAg9wIBAAAAAf0CAQAAAAHoAwEAAAAB6QMgAAAAAQEIAADmAgAgBPcCAQAAAAH9AgEAAAAB6AMBAAAAAekDIAAAAAEBCAAA6AIAMAEIAADoAgAwBR8AALAIACD3AgEA4gUAIf0CAQDiBQAh6AMBAOIFACHpAyAA9AUAIQIAAABDACAIAADrAgAgBPcCAQDiBQAh_QIBAOIFACHoAwEA4gUAIekDIAD0BQAhAgAAAEEAIAgAAO0CACACAAAAQQAgCAAA7QIAIAMAAABDACAPAADmAgAgEAAA6wIAIAEAAABDACABAAAAQQAgAxUAAK0IACAWAACvCAAgFwAArggAIAf0AgAAiQUAMPUCAAD0AgAQ9gIAAIkFADD3AgEAwAQAIf0CAQDABAAh6AMBAMAEACHpAyAA0QQAIQMAAABBACADAADzAgAwFAAA9AIAIAMAAABBACADAABCADAEAABDACABAAAAMwAgAQAAADMAIAMAAAAxACADAAAyADAEAAAzACADAAAAMQAgAwAAMgAwBAAAMwAgAwAAADEAIAMAADIAMAQAADMAIAUfAACsCAAg9wIBAAAAAf0CAQAAAAHmAwEAAAAB5wMCAAAAAQEIAAD8AgAgBPcCAQAAAAH9AgEAAAAB5gMBAAAAAecDAgAAAAEBCAAA_gIAMAEIAAD-AgAwBR8AAKsIACD3AgEA4gUAIf0CAQDiBQAh5gMBAOIFACHnAwIA-AUAIQIAAAAzACAIAACBAwAgBPcCAQDiBQAh_QIBAOIFACHmAwEA4gUAIecDAgD4BQAhAgAAADEAIAgAAIMDACACAAAAMQAgCAAAgwMAIAMAAAAzACAPAAD8AgAgEAAAgQMAIAEAAAAzACABAAAAMQAgBRUAAKYIACAWAACpCAAgFwAAqAgAIIABAACnCAAggQEAAKoIACAH9AIAAIgFADD1AgAAigMAEPYCAACIBQAw9wIBAMAEACH9AgEAwAQAIeYDAQDABAAh5wMCANUEACEDAAAAMQAgAwAAiQMAMBQAAIoDACADAAAAMQAgAwAAMgAwBAAAMwAgAQAAADsAIAEAAAA7ACADAAAAOQAgAwAAOgAwBAAAOwAgAwAAADkAIAMAADoAMAQAADsAIAMAAAA5ACADAAA6ADAEAAA7ACAEHwAApQgAIPcCAQAAAAH9AgEAAAAB5gMBAAAAAQEIAACSAwAgA_cCAQAAAAH9AgEAAAAB5gMBAAAAAQEIAACUAwAwAQgAAJQDADAEHwAApAgAIPcCAQDiBQAh_QIBAOIFACHmAwEA4gUAIQIAAAA7ACAIAACXAwAgA_cCAQDiBQAh_QIBAOIFACHmAwEA4gUAIQIAAAA5ACAIAACZAwAgAgAAADkAIAgAAJkDACADAAAAOwAgDwAAkgMAIBAAAJcDACABAAAAOwAgAQAAADkAIAMVAAChCAAgFgAAowgAIBcAAKIIACAG9AIAAIcFADD1AgAAoAMAEPYCAACHBQAw9wIBAMAEACH9AgEAwAQAIeYDAQDABAAhAwAAADkAIAMAAJ8DADAUAACgAwAgAwAAADkAIAMAADoAMAQAADsAIAEAAAA3ACABAAAANwAgAwAAADUAIAMAADYAMAQAADcAIAMAAAA1ACADAAA2ADAEAAA3ACADAAAANQAgAwAANgAwBAAANwAgBB8AAKAIACD3AgEAAAAB_QIBAAAAAeYDAQAAAAEBCAAAqAMAIAP3AgEAAAAB_QIBAAAAAeYDAQAAAAEBCAAAqgMAMAEIAACqAwAwBB8AAJ8IACD3AgEA4gUAIf0CAQDiBQAh5gMBAOIFACECAAAANwAgCAAArQMAIAP3AgEA4gUAIf0CAQDiBQAh5gMBAOIFACECAAAANQAgCAAArwMAIAIAAAA1ACAIAACvAwAgAwAAADcAIA8AAKgDACAQAACtAwAgAQAAADcAIAEAAAA1ACADFQAAnAgAIBYAAJ4IACAXAACdCAAgBvQCAACGBQAw9QIAALYDABD2AgAAhgUAMPcCAQDABAAh_QIBAMAEACHmAwEAwAQAIQMAAAA1ACADAAC1AwAwFAAAtgMAIAMAAAA1ACADAAA2ADAEAAA3ACABAAAAYwAgAQAAAGMAIAMAAABhACADAABiADAEAABjACADAAAAYQAgAwAAYgAwBAAAYwAgAwAAAGEAIAMAAGIAMAQAAGMAIB0cAADVBgAgIwAAmwgAICsAANYGACAsAADXBgAgLQAA2AYAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAf8CAQAAAAGvAwEAAAABuAMAAADJAwLTAwEAAAAB1QMAAADVAwLWAwEAAAAB1wMBAAAAAdgDAQAAAAHZAwEAAAAB2gMBAAAAAdsDAQAAAAHcAwEAAAAB3QMBAAAAAd4DEAAAAAHfAxAAAAAB4AMQAAAAAeEDEAAAAAHiA0AAAAAB4wNAAAAAAeQDQAAAAAHlA0AAAAABAQgAAL4DACAY9wIBAAAAAfsCQAAAAAH8AkAAAAAB_wIBAAAAAa8DAQAAAAG4AwAAAMkDAtMDAQAAAAHVAwAAANUDAtYDAQAAAAHXAwEAAAAB2AMBAAAAAdkDAQAAAAHaAwEAAAAB2wMBAAAAAdwDAQAAAAHdAwEAAAAB3gMQAAAAAd8DEAAAAAHgAxAAAAAB4QMQAAAAAeIDQAAAAAHjA0AAAAAB5ANAAAAAAeUDQAAAAAEBCAAAwAMAMAEIAADAAwAwHRwAAKoGACAjAACaCAAgKwAAqwYAICwAAKwGACAtAACtBgAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAh_wIBAOIFACGvAwEA4gUAIbgDAACoBskDItMDAQDiBQAh1QMAAKcG1QMi1gMBAOQFACHXAwEA5AUAIdgDAQDiBQAh2QMBAOQFACHaAwEA5AUAIdsDAQDkBQAh3AMBAOQFACHdAwEA5AUAId4DEAD3BQAh3wMQAPcFACHgAxAA9wUAIeEDEAD3BQAh4gNAAPYFACHjA0AA9gUAIeQDQAD2BQAh5QNAAPYFACECAAAAYwAgCAAAwwMAIBj3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH_AgEA4gUAIa8DAQDiBQAhuAMAAKgGyQMi0wMBAOIFACHVAwAApwbVAyLWAwEA5AUAIdcDAQDkBQAh2AMBAOIFACHZAwEA5AUAIdoDAQDkBQAh2wMBAOQFACHcAwEA5AUAId0DAQDkBQAh3gMQAPcFACHfAxAA9wUAIeADEAD3BQAh4QMQAPcFACHiA0AA9gUAIeMDQAD2BQAh5ANAAPYFACHlA0AA9gUAIQIAAABhACAIAADFAwAgAgAAAGEAIAgAAMUDACADAAAAYwAgDwAAvgMAIBAAAMMDACABAAAAYwAgAQAAAGEAIBAVAACVCAAgFgAAmAgAIBcAAJcIACCAAQAAlggAIIEBAACZCAAg1gMAANwFACDXAwAA3AUAINkDAADcBQAg2gMAANwFACDbAwAA3AUAINwDAADcBQAg3QMAANwFACDiAwAA3AUAIOMDAADcBQAg5AMAANwFACDlAwAA3AUAIBv0AgAAggUAMPUCAADMAwAQ9gIAAIIFADD3AgEAwAQAIfsCQADEBAAh_AJAAMQEACH_AgEAwAQAIa8DAQDABAAhuAMAAPsEyQMi0wMBAMAEACHVAwAAgwXVAyLWAwEAwgQAIdcDAQDCBAAh2AMBAMAEACHZAwEAwgQAIdoDAQDCBAAh2wMBAMIEACHcAwEAwgQAId0DAQDCBAAh3gMQANQEACHfAxAA1AQAIeADEADUBAAh4QMQANQEACHiA0AA0wQAIeMDQADTBAAh5ANAANMEACHlA0AA0wQAIQMAAABhACADAADLAwAwFAAAzAMAIAMAAABhACADAABiADAEAABjACABAAAASwAgAQAAAEsAIAMAAABJACADAABKADAEAABLACADAAAASQAgAwAASgAwBAAASwAgAwAAAEkAIAMAAEoAMAQAAEsAIAwfAADIBgAgKgAA_QYAIPcCAQAAAAH7AkAAAAAB_QIBAAAAAa4DAQAAAAHNAwEAAAABzgMBAAAAAc8DAQAAAAHQAwIAAAAB0QMQAAAAAdIDEAAAAAEBCAAA1AMAIAr3AgEAAAAB-wJAAAAAAf0CAQAAAAGuAwEAAAABzQMBAAAAAc4DAQAAAAHPAwEAAAAB0AMCAAAAAdEDEAAAAAHSAxAAAAABAQgAANYDADABCAAA1gMAMAwfAADGBgAgKgAA-wYAIPcCAQDiBQAh-wJAAOYFACH9AgEA4gUAIa4DAQDiBQAhzQMBAOIFACHOAwEA5AUAIc8DAQDkBQAh0AMCAPgFACHRAxAA9wUAIdIDEAD3BQAhAgAAAEsAIAgAANkDACAK9wIBAOIFACH7AkAA5gUAIf0CAQDiBQAhrgMBAOIFACHNAwEA4gUAIc4DAQDkBQAhzwMBAOQFACHQAwIA-AUAIdEDEAD3BQAh0gMQAPcFACECAAAASQAgCAAA2wMAIAIAAABJACAIAADbAwAgAwAAAEsAIA8AANQDACAQAADZAwAgAQAAAEsAIAEAAABJACAHFQAAkAgAIBYAAJMIACAXAACSCAAggAEAAJEIACCBAQAAlAgAIM4DAADcBQAgzwMAANwFACAN9AIAAIEFADD1AgAA4gMAEPYCAACBBQAw9wIBAMAEACH7AkAAxAQAIf0CAQDABAAhrgMBAMAEACHNAwEAwAQAIc4DAQDCBAAhzwMBAMIEACHQAwIA1QQAIdEDEADUBAAh0gMQANQEACEDAAAASQAgAwAA4QMAMBQAAOIDACADAAAASQAgAwAASgAwBAAASwAgAQAAAFQAIAEAAABUACADAAAAUgAgAwAAUwAwBAAAVAAgAwAAAFIAIAMAAFMAMAQAAFQAIAMAAABSACADAABTADAEAABUACAIKgAAjwgAIPcCAQAAAAH7AkAAAAABrgMBAAAAAbgDAAAAyQMCyQMBAAAAAcoDAQAAAAHMAwAAAMwDAwEIAADqAwAgB_cCAQAAAAH7AkAAAAABrgMBAAAAAbgDAAAAyQMCyQMBAAAAAcoDAQAAAAHMAwAAAMwDAwEIAADsAwAwAQgAAOwDADAIKgAAjggAIPcCAQDiBQAh-wJAAOYFACGuAwEA4gUAIbgDAACoBskDIskDAQDkBQAhygMBAOQFACHMAwAAuAbMAyMCAAAAVAAgCAAA7wMAIAf3AgEA4gUAIfsCQADmBQAhrgMBAOIFACG4AwAAqAbJAyLJAwEA5AUAIcoDAQDkBQAhzAMAALgGzAMjAgAAAFIAIAgAAPEDACACAAAAUgAgCAAA8QMAIAMAAABUACAPAADqAwAgEAAA7wMAIAEAAABUACABAAAAUgAgBhUAAIsIACAWAACNCAAgFwAAjAgAIMkDAADcBQAgygMAANwFACDMAwAA3AUAIAr0AgAA-gQAMPUCAAD4AwAQ9gIAAPoEADD3AgEAwAQAIfsCQADEBAAhrgMBAMAEACG4AwAA-wTJAyLJAwEAwgQAIcoDAQDCBAAhzAMAAPwEzAMjAwAAAFIAIAMAAPcDADAUAAD4AwAgAwAAAFIAIAMAAFMAMAQAAFQAIAEAAABPACABAAAATwAgAwAAAE0AIAMAAE4AMAQAAE8AIAMAAABNACADAABOADAEAABPACADAAAATQAgAwAATgAwBAAATwAgGRwAAJsGACAjAADTBgAgKgAAnAYAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAf8CAQAAAAGuAwEAAAABrwMBAAAAAbADEAAAAAGxAxAAAAABsgMQAAAAAbMDEAAAAAG0AwEAAAABtQMBAAAAAbYDAQAAAAG4AwAAALgDArkDgAAAAAG6A0AAAAABuwNAAAAAAbwDQAAAAAG9A0AAAAABvgMBAAAAAb8DAQAAAAHBAwAAAMEDAgEIAACABAAgFvcCAQAAAAH7AkAAAAAB_AJAAAAAAf8CAQAAAAGuAwEAAAABrwMBAAAAAbADEAAAAAGxAxAAAAABsgMQAAAAAbMDEAAAAAG0AwEAAAABtQMBAAAAAbYDAQAAAAG4AwAAALgDArkDgAAAAAG6A0AAAAABuwNAAAAAAbwDQAAAAAG9A0AAAAABvgMBAAAAAb8DAQAAAAHBAwAAAMEDAgEIAACCBAAwAQgAAIIEADAZHAAAmAYAICMAANEGACAqAACZBgAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAh_wIBAOIFACGuAwEA4gUAIa8DAQDiBQAhsAMQAPcFACGxAxAA9wUAIbIDEAD3BQAhswMQAPcFACG0AwEA4gUAIbUDAQDkBQAhtgMBAOQFACG4AwAAlQa4AyK5A4AAAAABugNAAPYFACG7A0AA9gUAIbwDQAD2BQAhvQNAAPYFACG-AwEA5AUAIb8DAQDkBQAhwQMAAJYGwQMiAgAAAE8AIAgAAIUEACAW9wIBAOIFACH7AkAA5gUAIfwCQADmBQAh_wIBAOIFACGuAwEA4gUAIa8DAQDiBQAhsAMQAPcFACGxAxAA9wUAIbIDEAD3BQAhswMQAPcFACG0AwEA4gUAIbUDAQDkBQAhtgMBAOQFACG4AwAAlQa4AyK5A4AAAAABugNAAPYFACG7A0AA9gUAIbwDQAD2BQAhvQNAAPYFACG-AwEA5AUAIb8DAQDkBQAhwQMAAJYGwQMiAgAAAE0AIAgAAIcEACACAAAATQAgCAAAhwQAIAMAAABPACAPAACABAAgEAAAhQQAIAEAAABPACABAAAATQAgDhUAAIYIACAWAACJCAAgFwAAiAgAIIABAACHCAAggQEAAIoIACC1AwAA3AUAILYDAADcBQAguQMAANwFACC6AwAA3AUAILsDAADcBQAgvAMAANwFACC9AwAA3AUAIL4DAADcBQAgvwMAANwFACAZ9AIAAPEEADD1AgAAjgQAEPYCAADxBAAw9wIBAMAEACH7AkAAxAQAIfwCQADEBAAh_wIBAMAEACGuAwEAwAQAIa8DAQDABAAhsAMQANQEACGxAxAA1AQAIbIDEADUBAAhswMQANQEACG0AwEAwAQAIbUDAQDCBAAhtgMBAMIEACG4AwAA8gS4AyK5AwAA8wQAILoDQADTBAAhuwNAANMEACG8A0AA0wQAIb0DQADTBAAhvgMBAMIEACG_AwEAwgQAIcEDAAD0BMEDIgMAAABNACADAACNBAAwFAAAjgQAIAMAAABNACADAABOADAEAABPACAoGgAA7wQAIB0AAOsEACAhAADsBAAgKQAA8AQAICsAAO4EACAuAADtBAAg9AIAAOEEADD1AgAAcAAQ9gIAAOEEADD3AgEAAAAB-wJAAOgEACH8AkAA6AQAIf4CAQAAAAGOAwEA4gQAIZADAADjBJADIpEDAQDiBAAhkgMBAOQEACGTAwEA5AQAIZQDAQDkBAAhlQMgAOUEACGWAwEA4gQAIZcDAQDiBAAhmAMBAOIEACGZAwEA5AQAIZoDAQDiBAAhnAMAAOYEnAMinQMBAOQEACGeAwEA5AQAIZ8DQADnBAAhoAMgAOUEACGhAwEA5AQAIaIDAQDkBAAhowMBAOQEACGkAwEAAAABpQMQAOkEACGmA0AA5wQAIacDEADpBAAhqAMCAOoEACGpAxAA6QQAIaoDEADpBAAhAQAAAJEEACABAAAAkQQAIBEaAACECAAgHQAAgAgAICEAAIEIACApAACFCAAgKwAAgwgAIC4AAIIIACCSAwAA3AUAIJMDAADcBQAglAMAANwFACCZAwAA3AUAIJ0DAADcBQAgngMAANwFACCfAwAA3AUAIKEDAADcBQAgogMAANwFACCjAwAA3AUAIKYDAADcBQAgAwAAAHAAIAMAAJQEADAEAACRBAAgAwAAAHAAIAMAAJQEADAEAACRBAAgAwAAAHAAIAMAAJQEADAEAACRBAAgJRoAAP4HACAdAAD6BwAgIQAA-wcAICkAAP8HACArAAD9BwAgLgAA_AcAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAf4CAQAAAAGOAwEAAAABkAMAAACQAwKRAwEAAAABkgMBAAAAAZMDAQAAAAGUAwEAAAABlQMgAAAAAZYDAQAAAAGXAwEAAAABmAMBAAAAAZkDAQAAAAGaAwEAAAABnAMAAACcAwKdAwEAAAABngMBAAAAAZ8DQAAAAAGgAyAAAAABoQMBAAAAAaIDAQAAAAGjAwEAAAABpAMBAAAAAaUDEAAAAAGmA0AAAAABpwMQAAAAAagDAgAAAAGpAxAAAAABqgMQAAAAAQEIAACYBAAgH_cCAQAAAAH7AkAAAAAB_AJAAAAAAf4CAQAAAAGOAwEAAAABkAMAAACQAwKRAwEAAAABkgMBAAAAAZMDAQAAAAGUAwEAAAABlQMgAAAAAZYDAQAAAAGXAwEAAAABmAMBAAAAAZkDAQAAAAGaAwEAAAABnAMAAACcAwKdAwEAAAABngMBAAAAAZ8DQAAAAAGgAyAAAAABoQMBAAAAAaIDAQAAAAGjAwEAAAABpAMBAAAAAaUDEAAAAAGmA0AAAAABpwMQAAAAAagDAgAAAAGpAxAAAAABqgMQAAAAAQEIAACaBAAwAQgAAJoEADAlGgAA_QUAIB0AAPkFACAhAAD6BQAgKQAA_gUAICsAAPwFACAuAAD7BQAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAh_gIBAOIFACGOAwEA4gUAIZADAADzBZADIpEDAQDiBQAhkgMBAOQFACGTAwEA5AUAIZQDAQDkBQAhlQMgAPQFACGWAwEA4gUAIZcDAQDiBQAhmAMBAOIFACGZAwEA5AUAIZoDAQDiBQAhnAMAAPUFnAMinQMBAOQFACGeAwEA5AUAIZ8DQAD2BQAhoAMgAPQFACGhAwEA5AUAIaIDAQDkBQAhowMBAOQFACGkAwEA4gUAIaUDEAD3BQAhpgNAAPYFACGnAxAA9wUAIagDAgD4BQAhqQMQAPcFACGqAxAA9wUAIQIAAACRBAAgCAAAnQQAIB_3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH-AgEA4gUAIY4DAQDiBQAhkAMAAPMFkAMikQMBAOIFACGSAwEA5AUAIZMDAQDkBQAhlAMBAOQFACGVAyAA9AUAIZYDAQDiBQAhlwMBAOIFACGYAwEA4gUAIZkDAQDkBQAhmgMBAOIFACGcAwAA9QWcAyKdAwEA5AUAIZ4DAQDkBQAhnwNAAPYFACGgAyAA9AUAIaEDAQDkBQAhogMBAOQFACGjAwEA5AUAIaQDAQDiBQAhpQMQAPcFACGmA0AA9gUAIacDEAD3BQAhqAMCAPgFACGpAxAA9wUAIaoDEAD3BQAhAgAAAHAAIAgAAJ8EACACAAAAcAAgCAAAnwQAIAMAAACRBAAgDwAAmAQAIBAAAJ0EACABAAAAkQQAIAEAAABwACAQFQAA7gUAIBYAAPEFACAXAADwBQAggAEAAO8FACCBAQAA8gUAIJIDAADcBQAgkwMAANwFACCUAwAA3AUAIJkDAADcBQAgnQMAANwFACCeAwAA3AUAIJ8DAADcBQAgoQMAANwFACCiAwAA3AUAIKMDAADcBQAgpgMAANwFACAi9AIAAM8EADD1AgAApgQAEPYCAADPBAAw9wIBAMAEACH7AkAAxAQAIfwCQADEBAAh_gIBAMAEACGOAwEAwAQAIZADAADQBJADIpEDAQDABAAhkgMBAMIEACGTAwEAwgQAIZQDAQDCBAAhlQMgANEEACGWAwEAwAQAIZcDAQDABAAhmAMBAMAEACGZAwEAwgQAIZoDAQDABAAhnAMAANIEnAMinQMBAMIEACGeAwEAwgQAIZ8DQADTBAAhoAMgANEEACGhAwEAwgQAIaIDAQDCBAAhowMBAMIEACGkAwEAwAQAIaUDEADUBAAhpgNAANMEACGnAxAA1AQAIagDAgDVBAAhqQMQANQEACGqAxAA1AQAIQMAAABwACADAAClBAAwFAAApgQAIAMAAABwACADAACUBAAwBAAAkQQAIAEAAABHACABAAAARwAgAwAAAEUAIAMAAEYAMAQAAEcAIAMAAABFACADAABGADAEAABHACADAAAARQAgAwAARgAwBAAARwAgDBoAAO0FACAfAADrBQAgIwAA7AUAIPcCAQAAAAH4AggAAAAB-QIBAAAAAfoCAADqBQAg-wJAAAAAAfwCQAAAAAH9AgEAAAAB_gIBAAAAAf8CAQAAAAEBCAAArgQAIAn3AgEAAAAB-AIIAAAAAfkCAQAAAAH6AgAA6gUAIPsCQAAAAAH8AkAAAAAB_QIBAAAAAf4CAQAAAAH_AgEAAAABAQgAALAEADABCAAAsAQAMAwaAADpBQAgHwAA5wUAICMAAOgFACD3AgEA4gUAIfgCCADjBQAh-QIBAOQFACH6AgAA5QUAIPsCQADmBQAh_AJAAOYFACH9AgEA4gUAIf4CAQDiBQAh_wIBAOIFACECAAAARwAgCAAAswQAIAn3AgEA4gUAIfgCCADjBQAh-QIBAOQFACH6AgAA5QUAIPsCQADmBQAh_AJAAOYFACH9AgEA4gUAIf4CAQDiBQAh_wIBAOIFACECAAAARQAgCAAAtQQAIAIAAABFACAIAAC1BAAgAwAAAEcAIA8AAK4EACAQAACzBAAgAQAAAEcAIAEAAABFACAGFQAA3QUAIBYAAOAFACAXAADfBQAggAEAAN4FACCBAQAA4QUAIPkCAADcBQAgDPQCAAC_BAAw9QIAALwEABD2AgAAvwQAMPcCAQDABAAh-AIIAMEEACH5AgEAwgQAIfoCAADDBAAg-wJAAMQEACH8AkAAxAQAIf0CAQDABAAh_gIBAMAEACH_AgEAwAQAIQMAAABFACADAAC7BAAwFAAAvAQAIAMAAABFACADAABGADAEAABHACAM9AIAAL8EADD1AgAAvAQAEPYCAAC_BAAw9wIBAMAEACH4AggAwQQAIfkCAQDCBAAh-gIAAMMEACD7AkAAxAQAIfwCQADEBAAh_QIBAMAEACH-AgEAwAQAIf8CAQDABAAhDhUAAMYEACAWAADOBAAgFwAAzgQAIIADAQAAAAGBAwEAAAAEggMBAAAABIMDAQAAAAGEAwEAAAABhQMBAAAAAYYDAQAAAAGHAwEAzQQAIYsDAQAAAAGMAwEAAAABjQMBAAAAAQ0VAADGBAAgFgAAzAQAIBcAAMwEACCAAQAAzAQAIIEBAADMBAAggAMIAAAAAYEDCAAAAASCAwgAAAAEgwMIAAAAAYQDCAAAAAGFAwgAAAABhgMIAAAAAYcDCADLBAAhDhUAAMkEACAWAADKBAAgFwAAygQAIIADAQAAAAGBAwEAAAAFggMBAAAABYMDAQAAAAGEAwEAAAABhQMBAAAAAYYDAQAAAAGHAwEAyAQAIYsDAQAAAAGMAwEAAAABjQMBAAAAAQSAAwEAAAAFiAMBAAAAAYkDAQAAAASKAwEAAAAECxUAAMYEACAWAADHBAAgFwAAxwQAIIADQAAAAAGBA0AAAAAEggNAAAAABIMDQAAAAAGEA0AAAAABhQNAAAAAAYYDQAAAAAGHA0AAxQQAIQsVAADGBAAgFgAAxwQAIBcAAMcEACCAA0AAAAABgQNAAAAABIIDQAAAAASDA0AAAAABhANAAAAAAYUDQAAAAAGGA0AAAAABhwNAAMUEACEIgAMCAAAAAYEDAgAAAASCAwIAAAAEgwMCAAAAAYQDAgAAAAGFAwIAAAABhgMCAAAAAYcDAgDGBAAhCIADQAAAAAGBA0AAAAAEggNAAAAABIMDQAAAAAGEA0AAAAABhQNAAAAAAYYDQAAAAAGHA0AAxwQAIQ4VAADJBAAgFgAAygQAIBcAAMoEACCAAwEAAAABgQMBAAAABYIDAQAAAAWDAwEAAAABhAMBAAAAAYUDAQAAAAGGAwEAAAABhwMBAMgEACGLAwEAAAABjAMBAAAAAY0DAQAAAAEIgAMCAAAAAYEDAgAAAAWCAwIAAAAFgwMCAAAAAYQDAgAAAAGFAwIAAAABhgMCAAAAAYcDAgDJBAAhC4ADAQAAAAGBAwEAAAAFggMBAAAABYMDAQAAAAGEAwEAAAABhQMBAAAAAYYDAQAAAAGHAwEAygQAIYsDAQAAAAGMAwEAAAABjQMBAAAAAQ0VAADGBAAgFgAAzAQAIBcAAMwEACCAAQAAzAQAIIEBAADMBAAggAMIAAAAAYEDCAAAAASCAwgAAAAEgwMIAAAAAYQDCAAAAAGFAwgAAAABhgMIAAAAAYcDCADLBAAhCIADCAAAAAGBAwgAAAAEggMIAAAABIMDCAAAAAGEAwgAAAABhQMIAAAAAYYDCAAAAAGHAwgAzAQAIQ4VAADGBAAgFgAAzgQAIBcAAM4EACCAAwEAAAABgQMBAAAABIIDAQAAAASDAwEAAAABhAMBAAAAAYUDAQAAAAGGAwEAAAABhwMBAM0EACGLAwEAAAABjAMBAAAAAY0DAQAAAAELgAMBAAAAAYEDAQAAAASCAwEAAAAEgwMBAAAAAYQDAQAAAAGFAwEAAAABhgMBAAAAAYcDAQDOBAAhiwMBAAAAAYwDAQAAAAGNAwEAAAABIvQCAADPBAAw9QIAAKYEABD2AgAAzwQAMPcCAQDABAAh-wJAAMQEACH8AkAAxAQAIf4CAQDABAAhjgMBAMAEACGQAwAA0ASQAyKRAwEAwAQAIZIDAQDCBAAhkwMBAMIEACGUAwEAwgQAIZUDIADRBAAhlgMBAMAEACGXAwEAwAQAIZgDAQDABAAhmQMBAMIEACGaAwEAwAQAIZwDAADSBJwDIp0DAQDCBAAhngMBAMIEACGfA0AA0wQAIaADIADRBAAhoQMBAMIEACGiAwEAwgQAIaMDAQDCBAAhpAMBAMAEACGlAxAA1AQAIaYDQADTBAAhpwMQANQEACGoAwIA1QQAIakDEADUBAAhqgMQANQEACEHFQAAxgQAIBYAAOAEACAXAADgBAAggAMAAACQAwKBAwAAAJADCIIDAAAAkAMIhwMAAN8EkAMiBRUAAMYEACAWAADeBAAgFwAA3gQAIIADIAAAAAGHAyAA3QQAIQcVAADGBAAgFgAA3AQAIBcAANwEACCAAwAAAJwDAoEDAAAAnAMIggMAAACcAwiHAwAA2wScAyILFQAAyQQAIBYAANoEACAXAADaBAAggANAAAAAAYEDQAAAAAWCA0AAAAAFgwNAAAAAAYQDQAAAAAGFA0AAAAABhgNAAAAAAYcDQADZBAAhDRUAAMYEACAWAADYBAAgFwAA2AQAIIABAADYBAAggQEAANgEACCAAxAAAAABgQMQAAAABIIDEAAAAASDAxAAAAABhAMQAAAAAYUDEAAAAAGGAxAAAAABhwMQANcEACENFQAAxgQAIBYAAMYEACAXAADGBAAggAEAAMwEACCBAQAAxgQAIIADAgAAAAGBAwIAAAAEggMCAAAABIMDAgAAAAGEAwIAAAABhQMCAAAAAYYDAgAAAAGHAwIA1gQAIQ0VAADGBAAgFgAAxgQAIBcAAMYEACCAAQAAzAQAIIEBAADGBAAggAMCAAAAAYEDAgAAAASCAwIAAAAEgwMCAAAAAYQDAgAAAAGFAwIAAAABhgMCAAAAAYcDAgDWBAAhDRUAAMYEACAWAADYBAAgFwAA2AQAIIABAADYBAAggQEAANgEACCAAxAAAAABgQMQAAAABIIDEAAAAASDAxAAAAABhAMQAAAAAYUDEAAAAAGGAxAAAAABhwMQANcEACEIgAMQAAAAAYEDEAAAAASCAxAAAAAEgwMQAAAAAYQDEAAAAAGFAxAAAAABhgMQAAAAAYcDEADYBAAhCxUAAMkEACAWAADaBAAgFwAA2gQAIIADQAAAAAGBA0AAAAAFggNAAAAABYMDQAAAAAGEA0AAAAABhQNAAAAAAYYDQAAAAAGHA0AA2QQAIQiAA0AAAAABgQNAAAAABYIDQAAAAAWDA0AAAAABhANAAAAAAYUDQAAAAAGGA0AAAAABhwNAANoEACEHFQAAxgQAIBYAANwEACAXAADcBAAggAMAAACcAwKBAwAAAJwDCIIDAAAAnAMIhwMAANsEnAMiBIADAAAAnAMCgQMAAACcAwiCAwAAAJwDCIcDAADcBJwDIgUVAADGBAAgFgAA3gQAIBcAAN4EACCAAyAAAAABhwMgAN0EACECgAMgAAAAAYcDIADeBAAhBxUAAMYEACAWAADgBAAgFwAA4AQAIIADAAAAkAMCgQMAAACQAwiCAwAAAJADCIcDAADfBJADIgSAAwAAAJADAoEDAAAAkAMIggMAAACQAwiHAwAA4ASQAyIoGgAA7wQAIB0AAOsEACAhAADsBAAgKQAA8AQAICsAAO4EACAuAADtBAAg9AIAAOEEADD1AgAAcAAQ9gIAAOEEADD3AgEA4gQAIfsCQADoBAAh_AJAAOgEACH-AgEA4gQAIY4DAQDiBAAhkAMAAOMEkAMikQMBAOIEACGSAwEA5AQAIZMDAQDkBAAhlAMBAOQEACGVAyAA5QQAIZYDAQDiBAAhlwMBAOIEACGYAwEA4gQAIZkDAQDkBAAhmgMBAOIEACGcAwAA5gScAyKdAwEA5AQAIZ4DAQDkBAAhnwNAAOcEACGgAyAA5QQAIaEDAQDkBAAhogMBAOQEACGjAwEA5AQAIaQDAQDiBAAhpQMQAOkEACGmA0AA5wQAIacDEADpBAAhqAMCAOoEACGpAxAA6QQAIaoDEADpBAAhC4ADAQAAAAGBAwEAAAAEggMBAAAABIMDAQAAAAGEAwEAAAABhQMBAAAAAYYDAQAAAAGHAwEAzgQAIYsDAQAAAAGMAwEAAAABjQMBAAAAAQSAAwAAAJADAoEDAAAAkAMIggMAAACQAwiHAwAA4ASQAyILgAMBAAAAAYEDAQAAAAWCAwEAAAAFgwMBAAAAAYQDAQAAAAGFAwEAAAABhgMBAAAAAYcDAQDKBAAhiwMBAAAAAYwDAQAAAAGNAwEAAAABAoADIAAAAAGHAyAA3gQAIQSAAwAAAJwDAoEDAAAAnAMIggMAAACcAwiHAwAA3AScAyIIgANAAAAAAYEDQAAAAAWCA0AAAAAFgwNAAAAAAYQDQAAAAAGFA0AAAAABhgNAAAAAAYcDQADaBAAhCIADQAAAAAGBA0AAAAAEggNAAAAABIMDQAAAAAGEA0AAAAABhQNAAAAAAYYDQAAAAAGHA0AAxwQAIQiAAxAAAAABgQMQAAAABIIDEAAAAASDAxAAAAABhAMQAAAAAYUDEAAAAAGGAxAAAAABhwMQANgEACEIgAMCAAAAAYEDAgAAAASCAwIAAAAEgwMCAAAAAYQDAgAAAAGFAwIAAAABhgMCAAAAAYcDAgDGBAAhA6sDAAAiACCsAwAAIgAgrQMAACIAIAOrAwAAJwAgrAMAACcAIK0DAAAnACADqwMAAGEAIKwDAABhACCtAwAAYQAgA6sDAABNACCsAwAATQAgrQMAAE0AIBkbAACrBQAgKQAA8AQAICsAAO4EACAuAADtBAAgLwAArAUAIDAAAK0FACAxAACuBQAg9AIAAKgFADD1AgAAfQAQ9gIAAKgFADD3AgEA4gQAIfsCQADoBAAh_AJAAOgEACGRAwEA5AQAIbgDAACqBZwEIuYDAQDiBAAhlwQBAOIEACGYBCAA5QQAIZkEAQDkBAAhmgQAAKkFzAMinAQgAOUEACGdBCAA5QQAIZ4EQADnBAAhogQAAH0AIKMEAAB9ACADqwMAAEUAIKwDAABFACCtAwAARQAgGfQCAADxBAAw9QIAAI4EABD2AgAA8QQAMPcCAQDABAAh-wJAAMQEACH8AkAAxAQAIf8CAQDABAAhrgMBAMAEACGvAwEAwAQAIbADEADUBAAhsQMQANQEACGyAxAA1AQAIbMDEADUBAAhtAMBAMAEACG1AwEAwgQAIbYDAQDCBAAhuAMAAPIEuAMiuQMAAPMEACC6A0AA0wQAIbsDQADTBAAhvANAANMEACG9A0AA0wQAIb4DAQDCBAAhvwMBAMIEACHBAwAA9ATBAyIHFQAAxgQAIBYAAPkEACAXAAD5BAAggAMAAAC4AwKBAwAAALgDCIIDAAAAuAMIhwMAAPgEuAMiDxUAAMkEACAWAAD3BAAgFwAA9wQAIIADgAAAAAGDA4AAAAABhAOAAAAAAYUDgAAAAAGGA4AAAAABhwOAAAAAAcIDAQAAAAHDAwEAAAABxAMBAAAAAcUDgAAAAAHGA4AAAAABxwOAAAAAAQcVAADGBAAgFgAA9gQAIBcAAPYEACCAAwAAAMEDAoEDAAAAwQMIggMAAADBAwiHAwAA9QTBAyIHFQAAxgQAIBYAAPYEACAXAAD2BAAggAMAAADBAwKBAwAAAMEDCIIDAAAAwQMIhwMAAPUEwQMiBIADAAAAwQMCgQMAAADBAwiCAwAAAMEDCIcDAAD2BMEDIgyAA4AAAAABgwOAAAAAAYQDgAAAAAGFA4AAAAABhgOAAAAAAYcDgAAAAAHCAwEAAAABwwMBAAAAAcQDAQAAAAHFA4AAAAABxgOAAAAAAccDgAAAAAEHFQAAxgQAIBYAAPkEACAXAAD5BAAggAMAAAC4AwKBAwAAALgDCIIDAAAAuAMIhwMAAPgEuAMiBIADAAAAuAMCgQMAAAC4AwiCAwAAALgDCIcDAAD5BLgDIgr0AgAA-gQAMPUCAAD4AwAQ9gIAAPoEADD3AgEAwAQAIfsCQADEBAAhrgMBAMAEACG4AwAA-wTJAyLJAwEAwgQAIcoDAQDCBAAhzAMAAPwEzAMjBxUAAMYEACAWAACABQAgFwAAgAUAIIADAAAAyQMCgQMAAADJAwiCAwAAAMkDCIcDAAD_BMkDIgcVAADJBAAgFgAA_gQAIBcAAP4EACCAAwAAAMwDA4EDAAAAzAMJggMAAADMAwmHAwAA_QTMAyMHFQAAyQQAIBYAAP4EACAXAAD-BAAggAMAAADMAwOBAwAAAMwDCYIDAAAAzAMJhwMAAP0EzAMjBIADAAAAzAMDgQMAAADMAwmCAwAAAMwDCYcDAAD-BMwDIwcVAADGBAAgFgAAgAUAIBcAAIAFACCAAwAAAMkDAoEDAAAAyQMIggMAAADJAwiHAwAA_wTJAyIEgAMAAADJAwKBAwAAAMkDCIIDAAAAyQMIhwMAAIAFyQMiDfQCAACBBQAw9QIAAOIDABD2AgAAgQUAMPcCAQDABAAh-wJAAMQEACH9AgEAwAQAIa4DAQDABAAhzQMBAMAEACHOAwEAwgQAIc8DAQDCBAAh0AMCANUEACHRAxAA1AQAIdIDEADUBAAhG_QCAACCBQAw9QIAAMwDABD2AgAAggUAMPcCAQDABAAh-wJAAMQEACH8AkAAxAQAIf8CAQDABAAhrwMBAMAEACG4AwAA-wTJAyLTAwEAwAQAIdUDAACDBdUDItYDAQDCBAAh1wMBAMIEACHYAwEAwAQAIdkDAQDCBAAh2gMBAMIEACHbAwEAwgQAIdwDAQDCBAAh3QMBAMIEACHeAxAA1AQAId8DEADUBAAh4AMQANQEACHhAxAA1AQAIeIDQADTBAAh4wNAANMEACHkA0AA0wQAIeUDQADTBAAhBxUAAMYEACAWAACFBQAgFwAAhQUAIIADAAAA1QMCgQMAAADVAwiCAwAAANUDCIcDAACEBdUDIgcVAADGBAAgFgAAhQUAIBcAAIUFACCAAwAAANUDAoEDAAAA1QMIggMAAADVAwiHAwAAhAXVAyIEgAMAAADVAwKBAwAAANUDCIIDAAAA1QMIhwMAAIUF1QMiBvQCAACGBQAw9QIAALYDABD2AgAAhgUAMPcCAQDABAAh_QIBAMAEACHmAwEAwAQAIQb0AgAAhwUAMPUCAACgAwAQ9gIAAIcFADD3AgEAwAQAIf0CAQDABAAh5gMBAMAEACEH9AIAAIgFADD1AgAAigMAEPYCAACIBQAw9wIBAMAEACH9AgEAwAQAIeYDAQDABAAh5wMCANUEACEH9AIAAIkFADD1AgAA9AIAEPYCAACJBQAw9wIBAMAEACH9AgEAwAQAIegDAQDABAAh6QMgANEEACEI9AIAAIoFADD1AgAA3gIAEPYCAACKBQAw9wIBAMAEACH9AgEAwAQAIeYDAQDABAAh6QMgANEEACHqAwIA1QQAISD0AgAAiwUAMPUCAADIAgAQ9gIAAIsFADD3AgEAwAQAIfsCQADEBAAh_AJAAMQEACH_AgEAwAQAIaADIADRBAAh3wMCANUEACHmAwEAwAQAIesDAQDABAAh7AMBAMIEACHtAwEAwAQAIe4DAQDCBAAh7wMBAMIEACHwAwEAwAQAIfEDAADDBAAg8gMCANUEACHzAwIAjAUAIfQDAACNBQAg9QMAAMMEACD2AwIAjAUAIfcDCACOBQAh-AMIAI4FACH5AwgAjgUAIfoDIADRBAAh-wMCANUEACH8AyAA0QQAIf0DIADRBAAh_gMAAMMEACD_A0AA0wQAIYAEQADTBAAhDRUAAMkEACAWAADJBAAgFwAAyQQAIIABAACQBQAggQEAAMkEACCAAwIAAAABgQMCAAAABYIDAgAAAAWDAwIAAAABhAMCAAAAAYUDAgAAAAGGAwIAAAABhwMCAJEFACEEgAMAAACCBAmIAwAAAIIEA4kDAAAAggQIigMAAACCBAgNFQAAyQQAIBYAAJAFACAXAACQBQAggAEAAJAFACCBAQAAkAUAIIADCAAAAAGBAwgAAAAFggMIAAAABYMDCAAAAAGEAwgAAAABhQMIAAAAAYYDCAAAAAGHAwgAjwUAIQ0VAADJBAAgFgAAkAUAIBcAAJAFACCAAQAAkAUAIIEBAACQBQAggAMIAAAAAYEDCAAAAAWCAwgAAAAFgwMIAAAAAYQDCAAAAAGFAwgAAAABhgMIAAAAAYcDCACPBQAhCIADCAAAAAGBAwgAAAAFggMIAAAABYMDCAAAAAGEAwgAAAABhQMIAAAAAYYDCAAAAAGHAwgAkAUAIQ0VAADJBAAgFgAAyQQAIBcAAMkEACCAAQAAkAUAIIEBAADJBAAggAMCAAAAAYEDAgAAAAWCAwIAAAAFgwMCAAAAAYQDAgAAAAGFAwIAAAABhgMCAAAAAYcDAgCRBQAhD_QCAACSBQAw9QIAALICABD2AgAAkgUAMPcCAQDABAAh-wJAAMQEACH8AkAAxAQAIf4CAQDABAAhkQMBAMAEACGWAwEAwAQAIZgDAQDABAAhmQMBAMIEACGaAwEAwAQAIYIEAQDABAAhgwQQAJMFACGEBBAAkwUAIQ0VAADJBAAgFgAAlQUAIBcAAJUFACCAAQAAlQUAIIEBAACVBQAggAMQAAAAAYEDEAAAAAWCAxAAAAAFgwMQAAAAAYQDEAAAAAGFAxAAAAABhgMQAAAAAYcDEACUBQAhDRUAAMkEACAWAACVBQAgFwAAlQUAIIABAACVBQAggQEAAJUFACCAAxAAAAABgQMQAAAABYIDEAAAAAWDAxAAAAABhAMQAAAAAYUDEAAAAAGGAxAAAAABhwMQAJQFACEIgAMQAAAAAYEDEAAAAAWCAxAAAAAFgwMQAAAAAYQDEAAAAAGFAxAAAAABhgMQAAAAAYcDEACVBQAhERoAAO8EACAeAACYBQAg9AIAAJYFADD1AgAAIAAQ9gIAAJYFADD3AgEA4gQAIfsCQADoBAAh_AJAAOgEACH-AgEA4gQAIZEDAQDiBAAhlgMBAOIEACGYAwEA4gQAIZkDAQDkBAAhmgMBAOIEACGCBAEA4gQAIYMEEACXBQAhhAQQAJcFACEIgAMQAAAAAYEDEAAAAAWCAxAAAAAFgwMQAAAAAYQDEAAAAAGFAxAAAAABhgMQAAAAAYcDEACVBQAhERwAANQFACAgAADMBQAgIwAAswUAIPQCAADTBQAw9QIAACIAEPYCAADTBQAw9wIBAOIEACH7AkAA6AQAIfwCQADoBAAh_wIBAOIEACGvAwEA4gQAId4DEADpBAAh3wMQAOkEACHgAxAA6QQAIeEDEADpBAAhogQAACIAIKMEAAAiACAL9AIAAJkFADD1AgAAmgIAEPYCAACZBQAw9wIBAMAEACH7AkAAxAQAIfwCQADEBAAhkwMBAMAEACGgAyAA0QQAIeYDAQDABAAhhQQBAMAEACGGBAIA1QQAIQwhAADsBAAg9AIAAJoFADD1AgAAhwIAEPYCAACaBQAw9wIBAOIEACH7AkAA6AQAIfwCQADoBAAhkwMBAOIEACGgAyAA5QQAIeYDAQDiBAAhhQQBAOIEACGGBAIA6gQAIQz0AgAAmwUAMPUCAACBAgAQ9gIAAJsFADD3AgEAwAQAIfsCQADEBAAh_AJAAMQEACH9AgEAwAQAIdADAgDVBAAh0QMQANQEACHSAxAA1AQAIYcEAQDABAAhiAQQANQEACEM9AIAAJwFADD1AgAA6wEAEPYCAACcBQAw9wIBAMAEACH7AkAAxAQAIfwCQADEBAAh_wIBAMAEACGvAwEAwAQAId4DEADUBAAh3wMQANQEACHgAxAA1AQAIeEDEADUBAAhCfQCAACdBQAw9QIAANUBABD2AgAAnQUAMPcCAQDABAAh-wJAAMQEACH8AkAAxAQAIYkEAQDABAAhigQBAMAEACGLBEAAxAQAIQn0AgAAngUAMPUCAADCAQAQ9gIAAJ4FADD3AgEA4gQAIfsCQADoBAAh_AJAAOgEACGJBAEA4gQAIYoEAQDiBAAhiwRAAOgEACEQ9AIAAJ8FADD1AgAAvAEAEPYCAACfBQAw9wIBAMAEACH7AkAAxAQAIfwCQADEBAAh_gIBAMAEACH_AgEAwAQAIYwEAQDABAAhjQQBAMIEACGOBAEAwgQAIY8EAQDCBAAhkARAANMEACGRBEAA0wQAIZIEAQDCBAAhkwQBAMIEACEL9AIAAKAFADD1AgAApgEAEPYCAACgBQAw9wIBAMAEACH7AkAAxAQAIfwCQADEBAAh_gIBAMAEACGLBEAAxAQAIZQEAQDABAAhlQQBAMIEACGWBAEAwgQAIRD0AgAAoQUAMPUCAACQAQAQ9gIAAKEFADD3AgEAwAQAIfsCQADEBAAh_AJAAMQEACGRAwEAwgQAIbgDAACjBZwEIuYDAQDABAAhlwQBAMAEACGYBCAA0QQAIZkEAQDCBAAhmgQAAKIFzAMinAQgANEEACGdBCAA0QQAIZ4EQADTBAAhBxUAAMYEACAWAACnBQAgFwAApwUAIIADAAAAzAMCgQMAAADMAwiCAwAAAMwDCIcDAACmBcwDIgcVAADGBAAgFgAApQUAIBcAAKUFACCAAwAAAJwEAoEDAAAAnAQIggMAAACcBAiHAwAApAWcBCIHFQAAxgQAIBYAAKUFACAXAAClBQAggAMAAACcBAKBAwAAAJwECIIDAAAAnAQIhwMAAKQFnAQiBIADAAAAnAQCgQMAAACcBAiCAwAAAJwECIcDAAClBZwEIgcVAADGBAAgFgAApwUAIBcAAKcFACCAAwAAAMwDAoEDAAAAzAMIggMAAADMAwiHAwAApgXMAyIEgAMAAADMAwKBAwAAAMwDCIIDAAAAzAMIhwMAAKcFzAMiFxsAAKsFACApAADwBAAgKwAA7gQAIC4AAO0EACAvAACsBQAgMAAArQUAIDEAAK4FACD0AgAAqAUAMPUCAAB9ABD2AgAAqAUAMPcCAQDiBAAh-wJAAOgEACH8AkAA6AQAIZEDAQDkBAAhuAMAAKoFnAQi5gMBAOIEACGXBAEA4gQAIZgEIADlBAAhmQQBAOQEACGaBAAAqQXMAyKcBCAA5QQAIZ0EIADlBAAhngRAAOcEACEEgAMAAADMAwKBAwAAAMwDCIIDAAAAzAMIhwMAAKcFzAMiBIADAAAAnAQCgQMAAACcBAiCAwAAAJwECIcDAAClBZwEIgOrAwAAHAAgrAMAABwAIK0DAAAcACATGgAA7wQAIB4AAJgFACD0AgAAlgUAMPUCAAAgABD2AgAAlgUAMPcCAQDiBAAh-wJAAOgEACH8AkAA6AQAIf4CAQDiBAAhkQMBAOIEACGWAwEA4gQAIZgDAQDiBAAhmQMBAOQEACGaAwEA4gQAIYIEAQDiBAAhgwQQAJcFACGEBBAAlwUAIaIEAAAgACCjBAAAIAAgKhoAAO8EACAdAADrBAAgIQAA7AQAICkAAPAEACArAADuBAAgLgAA7QQAIPQCAADhBAAw9QIAAHAAEPYCAADhBAAw9wIBAOIEACH7AkAA6AQAIfwCQADoBAAh_gIBAOIEACGOAwEA4gQAIZADAADjBJADIpEDAQDiBAAhkgMBAOQEACGTAwEA5AQAIZQDAQDkBAAhlQMgAOUEACGWAwEA4gQAIZcDAQDiBAAhmAMBAOIEACGZAwEA5AQAIZoDAQDiBAAhnAMAAOYEnAMinQMBAOQEACGeAwEA5AQAIZ8DQADnBAAhoAMgAOUEACGhAwEA5AQAIaIDAQDkBAAhowMBAOQEACGkAwEA4gQAIaUDEADpBAAhpgNAAOcEACGnAxAA6QQAIagDAgDqBAAhqQMQAOkEACGqAxAA6QQAIaIEAABwACCjBAAAcAAgA6sDAABzACCsAwAAcwAgrQMAAHMAIAwaAADvBAAg9AIAAK8FADD1AgAAcwAQ9gIAAK8FADD3AgEA4gQAIfsCQADoBAAh_AJAAOgEACH-AgEA4gQAIYsEQADoBAAhlAQBAOIEACGVBAEA5AQAIZYEAQDkBAAhIBwAAO8EACAjAACzBQAgKwAA7gQAICwAALQFACAtAAC1BQAg9AIAALAFADD1AgAAYQAQ9gIAALAFADD3AgEA4gQAIfsCQADoBAAh_AJAAOgEACH_AgEA4gQAIa8DAQDiBAAhuAMAALIFyQMi0wMBAOIEACHVAwAAsQXVAyLWAwEA5AQAIdcDAQDkBAAh2AMBAOIEACHZAwEA5AQAIdoDAQDkBAAh2wMBAOQEACHcAwEA5AQAId0DAQDkBAAh3gMQAOkEACHfAxAA6QQAIeADEADpBAAh4QMQAOkEACHiA0AA5wQAIeMDQADnBAAh5ANAAOcEACHlA0AA5wQAIQSAAwAAANUDAoEDAAAA1QMIggMAAADVAwiHAwAAhQXVAyIEgAMAAADJAwKBAwAAAMkDCIIDAAAAyQMIhwMAAIAFyQMiKhoAAO8EACAdAADrBAAgIQAA7AQAICkAAPAEACArAADuBAAgLgAA7QQAIPQCAADhBAAw9QIAAHAAEPYCAADhBAAw9wIBAOIEACH7AkAA6AQAIfwCQADoBAAh_gIBAOIEACGOAwEA4gQAIZADAADjBJADIpEDAQDiBAAhkgMBAOQEACGTAwEA5AQAIZQDAQDkBAAhlQMgAOUEACGWAwEA4gQAIZcDAQDiBAAhmAMBAOIEACGZAwEA5AQAIZoDAQDiBAAhnAMAAOYEnAMinQMBAOQEACGeAwEA5AQAIZ8DQADnBAAhoAMgAOUEACGhAwEA5AQAIaIDAQDkBAAhowMBAOQEACGkAwEA4gQAIaUDEADpBAAhpgNAAOcEACGnAxAA6QQAIagDAgDqBAAhqQMQAOkEACGqAxAA6QQAIaIEAABwACCjBAAAcAAgA6sDAABJACCsAwAASQAgrQMAAEkAIAOrAwAAUgAgrAMAAFIAIK0DAABSACALKgAAuAUAIPQCAAC2BQAw9QIAAFIAEPYCAAC2BQAw9wIBAOIEACH7AkAA6AQAIa4DAQDiBAAhuAMAALIFyQMiyQMBAOQEACHKAwEA5AQAIcwDAAC3BcwDIwSAAwAAAMwDA4EDAAAAzAMJggMAAADMAwmHAwAA_gTMAyMiHAAA7wQAICMAALMFACArAADuBAAgLAAAtAUAIC0AALUFACD0AgAAsAUAMPUCAABhABD2AgAAsAUAMPcCAQDiBAAh-wJAAOgEACH8AkAA6AQAIf8CAQDiBAAhrwMBAOIEACG4AwAAsgXJAyLTAwEA4gQAIdUDAACxBdUDItYDAQDkBAAh1wMBAOQEACHYAwEA4gQAIdkDAQDkBAAh2gMBAOQEACHbAwEA5AQAIdwDAQDkBAAh3QMBAOQEACHeAxAA6QQAId8DEADpBAAh4AMQAOkEACHhAxAA6QQAIeIDQADnBAAh4wNAAOcEACHkA0AA5wQAIeUDQADnBAAhogQAAGEAIKMEAABhACAcHAAA7wQAICMAALMFACAqAAC4BQAg9AIAALkFADD1AgAATQAQ9gIAALkFADD3AgEA4gQAIfsCQADoBAAh_AJAAOgEACH_AgEA4gQAIa4DAQDiBAAhrwMBAOIEACGwAxAA6QQAIbEDEADpBAAhsgMQAOkEACGzAxAA6QQAIbQDAQDiBAAhtQMBAOQEACG2AwEA5AQAIbgDAAC6BbgDIrkDAAC7BQAgugNAAOcEACG7A0AA5wQAIbwDQADnBAAhvQNAAOcEACG-AwEA5AQAIb8DAQDkBAAhwQMAALwFwQMiBIADAAAAuAMCgQMAAAC4AwiCAwAAALgDCIcDAAD5BLgDIgyAA4AAAAABgwOAAAAAAYQDgAAAAAGFA4AAAAABhgOAAAAAAYcDgAAAAAHCAwEAAAABwwMBAAAAAcQDAQAAAAHFA4AAAAABxgOAAAAAAccDgAAAAAEEgAMAAADBAwKBAwAAAMEDCIIDAAAAwQMIhwMAAPYEwQMiDx8AAL4FACAqAAC4BQAg9AIAAL0FADD1AgAASQAQ9gIAAL0FADD3AgEA4gQAIfsCQADoBAAh_QIBAOIEACGuAwEA4gQAIc0DAQDiBAAhzgMBAOQEACHPAwEA5AQAIdADAgDqBAAh0QMQAOkEACHSAxAA6QQAISwgAADMBQAgIgAAzQUAICMAALMFACAkAADOBQAgJQAAzwUAICYAANAFACAnAADRBQAgKAAA0gUAICkAAPAEACAsAAC0BQAg9AIAAMkFADD1AgAAJwAQ9gIAAMkFADD3AgEA4gQAIfsCQADoBAAh_AJAAOgEACH_AgEA4gQAIaADIADlBAAh3wMCAOoEACHmAwEA4gQAIesDAQDiBAAh7AMBAOQEACHtAwEA4gQAIe4DAQDkBAAh7wMBAOQEACHwAwEA4gQAIfEDAADDBAAg8gMCAOoEACHzAwIAygUAIfQDAACNBQAg9QMAAMMEACD2AwIAygUAIfcDCADLBQAh-AMIAMsFACH5AwgAywUAIfoDIADlBAAh-wMCAOoEACH8AyAA5QQAIf0DIADlBAAh_gMAAMMEACD_A0AA5wQAIYAEQADnBAAhogQAACcAIKMEAAAnACAPGgAA7wQAIB8AAL4FACAjAACzBQAg9AIAAL8FADD1AgAARQAQ9gIAAL8FADD3AgEA4gQAIfgCCADABQAh-QIBAOQEACH6AgAAwwQAIPsCQADoBAAh_AJAAOgEACH9AgEA4gQAIf4CAQDiBAAh_wIBAOIEACEIgAMIAAAAAYEDCAAAAASCAwgAAAAEgwMIAAAAAYQDCAAAAAGFAwgAAAABhgMIAAAAAYcDCADMBAAhCB8AAL4FACD0AgAAwQUAMPUCAABBABD2AgAAwQUAMPcCAQDiBAAh_QIBAOIEACHoAwEA4gQAIekDIADlBAAhCR8AAL4FACD0AgAAwgUAMPUCAAA9ABD2AgAAwgUAMPcCAQDiBAAh_QIBAOIEACHmAwEA4gQAIekDIADlBAAh6gMCAOoEACEHHwAAvgUAIPQCAADDBQAw9QIAADkAEPYCAADDBQAw9wIBAOIEACH9AgEA4gQAIeYDAQDiBAAhBx8AAL4FACD0AgAAxAUAMPUCAAA1ABD2AgAAxAUAMPcCAQDiBAAh_QIBAOIEACHmAwEA4gQAIQgfAAC-BQAg9AIAAMUFADD1AgAAMQAQ9gIAAMUFADD3AgEA4gQAIf0CAQDiBAAh5gMBAOIEACHnAwIA6gQAIQL9AgEAAAABhwQBAAAAAQ4eAADIBQAgHwAAvgUAIPQCAADHBQAw9QIAACsAEPYCAADHBQAw9wIBAOIEACH7AkAA6AQAIfwCQADoBAAh_QIBAOIEACHQAwIA6gQAIdEDEADpBAAh0gMQAOkEACGHBAEA4gQAIYgEEADpBAAhERwAANQFACAgAADMBQAgIwAAswUAIPQCAADTBQAw9QIAACIAEPYCAADTBQAw9wIBAOIEACH7AkAA6AQAIfwCQADoBAAh_wIBAOIEACGvAwEA4gQAId4DEADpBAAh3wMQAOkEACHgAxAA6QQAIeEDEADpBAAhogQAACIAIKMEAAAiACAqIAAAzAUAICIAAM0FACAjAACzBQAgJAAAzgUAICUAAM8FACAmAADQBQAgJwAA0QUAICgAANIFACApAADwBAAgLAAAtAUAIPQCAADJBQAw9QIAACcAEPYCAADJBQAw9wIBAOIEACH7AkAA6AQAIfwCQADoBAAh_wIBAOIEACGgAyAA5QQAId8DAgDqBAAh5gMBAOIEACHrAwEA4gQAIewDAQDkBAAh7QMBAOIEACHuAwEA5AQAIe8DAQDkBAAh8AMBAOIEACHxAwAAwwQAIPIDAgDqBAAh8wMCAMoFACH0AwAAjQUAIPUDAADDBAAg9gMCAMoFACH3AwgAywUAIfgDCADLBQAh-QMIAMsFACH6AyAA5QQAIfsDAgDqBAAh_AMgAOUEACH9AyAA5QQAIf4DAADDBAAg_wNAAOcEACGABEAA5wQAIQiAAwIAAAABgQMCAAAABYIDAgAAAAWDAwIAAAABhAMCAAAAAYUDAgAAAAGGAwIAAAABhwMCAMkEACEIgAMIAAAAAYEDCAAAAAWCAwgAAAAFgwMIAAAAAYQDCAAAAAGFAwgAAAABhgMIAAAAAYcDCACQBQAhA6sDAAArACCsAwAAKwAgrQMAACsAIA4hAADsBAAg9AIAAJoFADD1AgAAhwIAEPYCAACaBQAw9wIBAOIEACH7AkAA6AQAIfwCQADoBAAhkwMBAOIEACGgAyAA5QQAIeYDAQDiBAAhhQQBAOIEACGGBAIA6gQAIaIEAACHAgAgowQAAIcCACADqwMAADEAIKwDAAAxACCtAwAAMQAgA6sDAAA1ACCsAwAANQAgrQMAADUAIAOrAwAAOQAgrAMAADkAIK0DAAA5ACADqwMAAD0AIKwDAAA9ACCtAwAAPQAgA6sDAABBACCsAwAAQQAgrQMAAEEAIA8cAADUBQAgIAAAzAUAICMAALMFACD0AgAA0wUAMPUCAAAiABD2AgAA0wUAMPcCAQDiBAAh-wJAAOgEACH8AkAA6AQAIf8CAQDiBAAhrwMBAOIEACHeAxAA6QQAId8DEADpBAAh4AMQAOkEACHhAxAA6QQAIRMaAADvBAAgHgAAmAUAIPQCAACWBQAw9QIAACAAEPYCAACWBQAw9wIBAOIEACH7AkAA6AQAIfwCQADoBAAh_gIBAOIEACGRAwEA4gQAIZYDAQDiBAAhmAMBAOIEACGZAwEA5AQAIZoDAQDiBAAhggQBAOIEACGDBBAAlwUAIYQEEACXBQAhogQAACAAIKMEAAAgACARGgAA7wQAIPQCAADVBQAw9QIAABwAEPYCAADVBQAw9wIBAOIEACH7AkAA6AQAIfwCQADoBAAh_gIBAOIEACH_AgEA4gQAIYwEAQDiBAAhjQQBAOQEACGOBAEA5AQAIY8EAQDkBAAhkARAAOcEACGRBEAA5wQAIZIEAQDkBAAhkwQBAOQEACEN9AIAANYFADD1AgAAFwAQ9gIAANYFADD3AgEAwAQAIfsCQADEBAAh_AJAAMQEACGWAwEAwAQAIZcDAQDABAAhmAMBAMAEACGZAwEAwgQAIZoDAQDABAAh6QMgANEEACGhBAAA1wWhBCIHFQAAxgQAIBYAANkFACAXAADZBQAggAMAAAChBAKBAwAAAKEECIIDAAAAoQQIhwMAANgFoQQiBxUAAMYEACAWAADZBQAgFwAA2QUAIIADAAAAoQQCgQMAAAChBAiCAwAAAKEECIcDAADYBaEEIgSAAwAAAKEEAoEDAAAAoQQIggMAAAChBAiHAwAA2QWhBCIN9AIAANoFADD1AgAABAAQ9gIAANoFADD3AgEA4gQAIfsCQADoBAAh_AJAAOgEACGWAwEA4gQAIZcDAQDiBAAhmAMBAOIEACGZAwEA5AQAIZoDAQDiBAAh6QMgAOUEACGhBAAA2wWhBCIEgAMAAAChBAKBAwAAAKEECIIDAAAAoQQIhwMAANkFoQQiAAAAAAAAAacEAQAAAAEFpwQIAAAAAa0ECAAAAAGuBAgAAAABrwQIAAAAAbAECAAAAAEBpwQBAAAAAQKnBAEAAAAEsQQBAAAABQGnBEAAAAABBQ8AAOoKACAQAADzCgAgpAQAAOsKACClBAAA8goAIKoEAAApACAFDwAA6AoAIBAAAPAKACCkBAAA6QoAIKUEAADvCgAgqgQAAJEEACAFDwAA5goAIBAAAO0KACCkBAAA5woAIKUEAADsCgAgqgQAABoAIAGnBAEAAAAEAw8AAOoKACCkBAAA6woAIKoEAAApACADDwAA6AoAIKQEAADpCgAgqgQAAJEEACADDwAA5goAIKQEAADnCgAgqgQAABoAIAAAAAAAAacEAAAAkAMCAacEIAAAAAEBpwQAAACcAwIBpwRAAAAAAQWnBBAAAAABrQQQAAAAAa4EEAAAAAGvBBAAAAABsAQQAAAAAQWnBAIAAAABrQQCAAAAAa4EAgAAAAGvBAIAAAABsAQCAAAAAQsPAADfBwAwEAAA5AcAMKQEAADgBwAwpQQAAOEHADCmBAAA4gcAIKcEAADjBwAwqAQAAOMHADCpBAAA4wcAMKoEAADjBwAwqwQAAOUHADCsBAAA5gcAMAsPAADZBgAwEAAA3gYAMKQEAADaBgAwpQQAANsGADCmBAAA3AYAIKcEAADdBgAwqAQAAN0GADCpBAAA3QYAMKoEAADdBgAwqwQAAN8GADCsBAAA4AYAMAsPAACdBgAwEAAAogYAMKQEAACeBgAwpQQAAJ8GADCmBAAAoAYAIKcEAAChBgAwqAQAAKEGADCpBAAAoQYAMKoEAAChBgAwqwQAAKMGADCsBAAApAYAMAsPAACLBgAwEAAAkAYAMKQEAACMBgAwpQQAAI0GADCmBAAAjgYAIKcEAACPBgAwqAQAAI8GADCpBAAAjwYAMKoEAACPBgAwqwQAAJEGADCsBAAAkgYAMAUPAACeCgAgEAAA5AoAIKQEAACfCgAgpQQAAOMKACCqBAAAGgAgCw8AAP8FADAQAACEBgAwpAQAAIAGADClBAAAgQYAMKYEAACCBgAgpwQAAIMGADCoBAAAgwYAMKkEAACDBgAwqgQAAIMGADCrBAAAhQYAMKwEAACGBgAwChoAAO0FACAfAADrBQAg9wIBAAAAAfgCCAAAAAH5AgEAAAAB-gIAAOoFACD7AkAAAAAB_AJAAAAAAf0CAQAAAAH-AgEAAAABAgAAAEcAIA8AAIoGACADAAAARwAgDwAAigYAIBAAAIkGACABCAAA4goAMA8aAADvBAAgHwAAvgUAICMAALMFACD0AgAAvwUAMPUCAABFABD2AgAAvwUAMPcCAQAAAAH4AggAwAUAIfkCAQDkBAAh-gIAAMMEACD7AkAA6AQAIfwCQADoBAAh_QIBAOIEACH-AgEA4gQAIf8CAQDiBAAhAgAAAEcAIAgAAIkGACACAAAAhwYAIAgAAIgGACAM9AIAAIYGADD1AgAAhwYAEPYCAACGBgAw9wIBAOIEACH4AggAwAUAIfkCAQDkBAAh-gIAAMMEACD7AkAA6AQAIfwCQADoBAAh_QIBAOIEACH-AgEA4gQAIf8CAQDiBAAhDPQCAACGBgAw9QIAAIcGABD2AgAAhgYAMPcCAQDiBAAh-AIIAMAFACH5AgEA5AQAIfoCAADDBAAg-wJAAOgEACH8AkAA6AQAIf0CAQDiBAAh_gIBAOIEACH_AgEA4gQAIQj3AgEA4gUAIfgCCADjBQAh-QIBAOQFACH6AgAA5QUAIPsCQADmBQAh_AJAAOYFACH9AgEA4gUAIf4CAQDiBQAhChoAAOkFACAfAADnBQAg9wIBAOIFACH4AggA4wUAIfkCAQDkBQAh-gIAAOUFACD7AkAA5gUAIfwCQADmBQAh_QIBAOIFACH-AgEA4gUAIQoaAADtBQAgHwAA6wUAIPcCAQAAAAH4AggAAAAB-QIBAAAAAfoCAADqBQAg-wJAAAAAAfwCQAAAAAH9AgEAAAAB_gIBAAAAARccAACbBgAgKgAAnAYAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAa4DAQAAAAGvAwEAAAABsAMQAAAAAbEDEAAAAAGyAxAAAAABswMQAAAAAbQDAQAAAAG1AwEAAAABtgMBAAAAAbgDAAAAuAMCuQOAAAAAAboDQAAAAAG7A0AAAAABvANAAAAAAb0DQAAAAAG-AwEAAAABvwMBAAAAAcEDAAAAwQMCAgAAAE8AIA8AAJoGACADAAAATwAgDwAAmgYAIBAAAJcGACABCAAA4QoAMBwcAADvBAAgIwAAswUAICoAALgFACD0AgAAuQUAMPUCAABNABD2AgAAuQUAMPcCAQAAAAH7AkAA6AQAIfwCQADoBAAh_wIBAOIEACGuAwEA4gQAIa8DAQDiBAAhsAMQAOkEACGxAxAA6QQAIbIDEADpBAAhswMQAOkEACG0AwEAAAABtQMBAAAAAbYDAQDkBAAhuAMAALoFuAMiuQMAALsFACC6A0AA5wQAIbsDQADnBAAhvANAAOcEACG9A0AA5wQAIb4DAQDkBAAhvwMBAOQEACHBAwAAvAXBAyICAAAATwAgCAAAlwYAIAIAAACTBgAgCAAAlAYAIBn0AgAAkgYAMPUCAACTBgAQ9gIAAJIGADD3AgEA4gQAIfsCQADoBAAh_AJAAOgEACH_AgEA4gQAIa4DAQDiBAAhrwMBAOIEACGwAxAA6QQAIbEDEADpBAAhsgMQAOkEACGzAxAA6QQAIbQDAQDiBAAhtQMBAOQEACG2AwEA5AQAIbgDAAC6BbgDIrkDAAC7BQAgugNAAOcEACG7A0AA5wQAIbwDQADnBAAhvQNAAOcEACG-AwEA5AQAIb8DAQDkBAAhwQMAALwFwQMiGfQCAACSBgAw9QIAAJMGABD2AgAAkgYAMPcCAQDiBAAh-wJAAOgEACH8AkAA6AQAIf8CAQDiBAAhrgMBAOIEACGvAwEA4gQAIbADEADpBAAhsQMQAOkEACGyAxAA6QQAIbMDEADpBAAhtAMBAOIEACG1AwEA5AQAIbYDAQDkBAAhuAMAALoFuAMiuQMAALsFACC6A0AA5wQAIbsDQADnBAAhvANAAOcEACG9A0AA5wQAIb4DAQDkBAAhvwMBAOQEACHBAwAAvAXBAyIV9wIBAOIFACH7AkAA5gUAIfwCQADmBQAhrgMBAOIFACGvAwEA4gUAIbADEAD3BQAhsQMQAPcFACGyAxAA9wUAIbMDEAD3BQAhtAMBAOIFACG1AwEA5AUAIbYDAQDkBQAhuAMAAJUGuAMiuQOAAAAAAboDQAD2BQAhuwNAAPYFACG8A0AA9gUAIb0DQAD2BQAhvgMBAOQFACG_AwEA5AUAIcEDAACWBsEDIgGnBAAAALgDAgGnBAAAAMEDAhccAACYBgAgKgAAmQYAIPcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIa4DAQDiBQAhrwMBAOIFACGwAxAA9wUAIbEDEAD3BQAhsgMQAPcFACGzAxAA9wUAIbQDAQDiBQAhtQMBAOQFACG2AwEA5AUAIbgDAACVBrgDIrkDgAAAAAG6A0AA9gUAIbsDQAD2BQAhvANAAPYFACG9A0AA9gUAIb4DAQDkBQAhvwMBAOQFACHBAwAAlgbBAyIFDwAA2QoAIBAAAN8KACCkBAAA2goAIKUEAADeCgAgqgQAABoAIAUPAADXCgAgEAAA3AoAIKQEAADYCgAgpQQAANsKACCqBAAAYwAgFxwAAJsGACAqAACcBgAg9wIBAAAAAfsCQAAAAAH8AkAAAAABrgMBAAAAAa8DAQAAAAGwAxAAAAABsQMQAAAAAbIDEAAAAAGzAxAAAAABtAMBAAAAAbUDAQAAAAG2AwEAAAABuAMAAAC4AwK5A4AAAAABugNAAAAAAbsDQAAAAAG8A0AAAAABvQNAAAAAAb4DAQAAAAG_AwEAAAABwQMAAADBAwIDDwAA2QoAIKQEAADaCgAgqgQAABoAIAMPAADXCgAgpAQAANgKACCqBAAAYwAgGxwAANUGACArAADWBgAgLAAA1wYAIC0AANgGACD3AgEAAAAB-wJAAAAAAfwCQAAAAAGvAwEAAAABuAMAAADJAwLTAwEAAAAB1QMAAADVAwLWAwEAAAAB1wMBAAAAAdgDAQAAAAHZAwEAAAAB2gMBAAAAAdsDAQAAAAHcAwEAAAAB3QMBAAAAAd4DEAAAAAHfAxAAAAAB4AMQAAAAAeEDEAAAAAHiA0AAAAAB4wNAAAAAAeQDQAAAAAHlA0AAAAABAgAAAGMAIA8AANQGACADAAAAYwAgDwAA1AYAIBAAAKkGACABCAAA1goAMCAcAADvBAAgIwAAswUAICsAAO4EACAsAAC0BQAgLQAAtQUAIPQCAACwBQAw9QIAAGEAEPYCAACwBQAw9wIBAAAAAfsCQADoBAAh_AJAAOgEACH_AgEA4gQAIa8DAQDiBAAhuAMAALIFyQMi0wMBAAAAAdUDAACxBdUDItYDAQDkBAAh1wMBAOQEACHYAwEA4gQAIdkDAQDkBAAh2gMBAOQEACHbAwEA5AQAIdwDAQDkBAAh3QMBAOQEACHeAxAA6QQAId8DEADpBAAh4AMQAOkEACHhAxAA6QQAIeIDQADnBAAh4wNAAOcEACHkA0AA5wQAIeUDQADnBAAhAgAAAGMAIAgAAKkGACACAAAApQYAIAgAAKYGACAb9AIAAKQGADD1AgAApQYAEPYCAACkBgAw9wIBAOIEACH7AkAA6AQAIfwCQADoBAAh_wIBAOIEACGvAwEA4gQAIbgDAACyBckDItMDAQDiBAAh1QMAALEF1QMi1gMBAOQEACHXAwEA5AQAIdgDAQDiBAAh2QMBAOQEACHaAwEA5AQAIdsDAQDkBAAh3AMBAOQEACHdAwEA5AQAId4DEADpBAAh3wMQAOkEACHgAxAA6QQAIeEDEADpBAAh4gNAAOcEACHjA0AA5wQAIeQDQADnBAAh5QNAAOcEACEb9AIAAKQGADD1AgAApQYAEPYCAACkBgAw9wIBAOIEACH7AkAA6AQAIfwCQADoBAAh_wIBAOIEACGvAwEA4gQAIbgDAACyBckDItMDAQDiBAAh1QMAALEF1QMi1gMBAOQEACHXAwEA5AQAIdgDAQDiBAAh2QMBAOQEACHaAwEA5AQAIdsDAQDkBAAh3AMBAOQEACHdAwEA5AQAId4DEADpBAAh3wMQAOkEACHgAxAA6QQAIeEDEADpBAAh4gNAAOcEACHjA0AA5wQAIeQDQADnBAAh5QNAAOcEACEX9wIBAOIFACH7AkAA5gUAIfwCQADmBQAhrwMBAOIFACG4AwAAqAbJAyLTAwEA4gUAIdUDAACnBtUDItYDAQDkBQAh1wMBAOQFACHYAwEA4gUAIdkDAQDkBQAh2gMBAOQFACHbAwEA5AUAIdwDAQDkBQAh3QMBAOQFACHeAxAA9wUAId8DEAD3BQAh4AMQAPcFACHhAxAA9wUAIeIDQAD2BQAh4wNAAPYFACHkA0AA9gUAIeUDQAD2BQAhAacEAAAA1QMCAacEAAAAyQMCGxwAAKoGACArAACrBgAgLAAArAYAIC0AAK0GACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACGvAwEA4gUAIbgDAACoBskDItMDAQDiBQAh1QMAAKcG1QMi1gMBAOQFACHXAwEA5AUAIdgDAQDiBQAh2QMBAOQFACHaAwEA5AUAIdsDAQDkBQAh3AMBAOQFACHdAwEA5AUAId4DEAD3BQAh3wMQAPcFACHgAxAA9wUAIeEDEAD3BQAh4gNAAPYFACHjA0AA9gUAIeQDQAD2BQAh5QNAAPYFACEFDwAAxAoAIBAAANQKACCkBAAAxQoAIKUEAADTCgAgqgQAABoAIAsPAADJBgAwEAAAzQYAMKQEAADKBgAwpQQAAMsGADCmBAAAzAYAIKcEAACPBgAwqAQAAI8GADCpBAAAjwYAMKoEAACPBgAwqwQAAM4GADCsBAAAkgYAMAsPAAC7BgAwEAAAwAYAMKQEAAC8BgAwpQQAAL0GADCmBAAAvgYAIKcEAAC_BgAwqAQAAL8GADCpBAAAvwYAMKoEAAC_BgAwqwQAAMEGADCsBAAAwgYAMAsPAACuBgAwEAAAswYAMKQEAACvBgAwpQQAALAGADCmBAAAsQYAIKcEAACyBgAwqAQAALIGADCpBAAAsgYAMKoEAACyBgAwqwQAALQGADCsBAAAtQYAMAb3AgEAAAAB-wJAAAAAAbgDAAAAyQMCyQMBAAAAAcoDAQAAAAHMAwAAAMwDAwIAAABUACAPAAC6BgAgAwAAAFQAIA8AALoGACAQAAC5BgAgAQgAANIKADALKgAAuAUAIPQCAAC2BQAw9QIAAFIAEPYCAAC2BQAw9wIBAAAAAfsCQADoBAAhrgMBAOIEACG4AwAAsgXJAyLJAwEA5AQAIcoDAQDkBAAhzAMAALcFzAMjAgAAAFQAIAgAALkGACACAAAAtgYAIAgAALcGACAK9AIAALUGADD1AgAAtgYAEPYCAAC1BgAw9wIBAOIEACH7AkAA6AQAIa4DAQDiBAAhuAMAALIFyQMiyQMBAOQEACHKAwEA5AQAIcwDAAC3BcwDIwr0AgAAtQYAMPUCAAC2BgAQ9gIAALUGADD3AgEA4gQAIfsCQADoBAAhrgMBAOIEACG4AwAAsgXJAyLJAwEA5AQAIcoDAQDkBAAhzAMAALcFzAMjBvcCAQDiBQAh-wJAAOYFACG4AwAAqAbJAyLJAwEA5AUAIcoDAQDkBQAhzAMAALgGzAMjAacEAAAAzAMDBvcCAQDiBQAh-wJAAOYFACG4AwAAqAbJAyLJAwEA5AUAIcoDAQDkBQAhzAMAALgGzAMjBvcCAQAAAAH7AkAAAAABuAMAAADJAwLJAwEAAAABygMBAAAAAcwDAAAAzAMDCh8AAMgGACD3AgEAAAAB-wJAAAAAAf0CAQAAAAHNAwEAAAABzgMBAAAAAc8DAQAAAAHQAwIAAAAB0QMQAAAAAdIDEAAAAAECAAAASwAgDwAAxwYAIAMAAABLACAPAADHBgAgEAAAxQYAIAEIAADRCgAwDx8AAL4FACAqAAC4BQAg9AIAAL0FADD1AgAASQAQ9gIAAL0FADD3AgEAAAAB-wJAAOgEACH9AgEA4gQAIa4DAQDiBAAhzQMBAOIEACHOAwEA5AQAIc8DAQDkBAAh0AMCAOoEACHRAxAA6QQAIdIDEADpBAAhAgAAAEsAIAgAAMUGACACAAAAwwYAIAgAAMQGACAN9AIAAMIGADD1AgAAwwYAEPYCAADCBgAw9wIBAOIEACH7AkAA6AQAIf0CAQDiBAAhrgMBAOIEACHNAwEA4gQAIc4DAQDkBAAhzwMBAOQEACHQAwIA6gQAIdEDEADpBAAh0gMQAOkEACEN9AIAAMIGADD1AgAAwwYAEPYCAADCBgAw9wIBAOIEACH7AkAA6AQAIf0CAQDiBAAhrgMBAOIEACHNAwEA4gQAIc4DAQDkBAAhzwMBAOQEACHQAwIA6gQAIdEDEADpBAAh0gMQAOkEACEJ9wIBAOIFACH7AkAA5gUAIf0CAQDiBQAhzQMBAOIFACHOAwEA5AUAIc8DAQDkBQAh0AMCAPgFACHRAxAA9wUAIdIDEAD3BQAhCh8AAMYGACD3AgEA4gUAIfsCQADmBQAh_QIBAOIFACHNAwEA4gUAIc4DAQDkBQAhzwMBAOQFACHQAwIA-AUAIdEDEAD3BQAh0gMQAPcFACEFDwAAzAoAIBAAAM8KACCkBAAAzQoAIKUEAADOCgAgqgQAACkAIAofAADIBgAg9wIBAAAAAfsCQAAAAAH9AgEAAAABzQMBAAAAAc4DAQAAAAHPAwEAAAAB0AMCAAAAAdEDEAAAAAHSAxAAAAABAw8AAMwKACCkBAAAzQoAIKoEAAApACAXHAAAmwYAICMAANMGACD3AgEAAAAB-wJAAAAAAfwCQAAAAAH_AgEAAAABrwMBAAAAAbADEAAAAAGxAxAAAAABsgMQAAAAAbMDEAAAAAG0AwEAAAABtQMBAAAAAbYDAQAAAAG4AwAAALgDArkDgAAAAAG6A0AAAAABuwNAAAAAAbwDQAAAAAG9A0AAAAABvgMBAAAAAb8DAQAAAAHBAwAAAMEDAgIAAABPACAPAADSBgAgAwAAAE8AIA8AANIGACAQAADQBgAgAQgAAMsKADACAAAATwAgCAAA0AYAIAIAAACTBgAgCAAAzwYAIBX3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH_AgEA4gUAIa8DAQDiBQAhsAMQAPcFACGxAxAA9wUAIbIDEAD3BQAhswMQAPcFACG0AwEA4gUAIbUDAQDkBQAhtgMBAOQFACG4AwAAlQa4AyK5A4AAAAABugNAAPYFACG7A0AA9gUAIbwDQAD2BQAhvQNAAPYFACG-AwEA5AUAIb8DAQDkBQAhwQMAAJYGwQMiFxwAAJgGACAjAADRBgAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAh_wIBAOIFACGvAwEA4gUAIbADEAD3BQAhsQMQAPcFACGyAxAA9wUAIbMDEAD3BQAhtAMBAOIFACG1AwEA5AUAIbYDAQDkBQAhuAMAAJUGuAMiuQOAAAAAAboDQAD2BQAhuwNAAPYFACG8A0AA9gUAIb0DQAD2BQAhvgMBAOQFACG_AwEA5AUAIcEDAACWBsEDIgUPAADGCgAgEAAAyQoAIKQEAADHCgAgpQQAAMgKACCqBAAAkQQAIBccAACbBgAgIwAA0wYAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAf8CAQAAAAGvAwEAAAABsAMQAAAAAbEDEAAAAAGyAxAAAAABswMQAAAAAbQDAQAAAAG1AwEAAAABtgMBAAAAAbgDAAAAuAMCuQOAAAAAAboDQAAAAAG7A0AAAAABvANAAAAAAb0DQAAAAAG-AwEAAAABvwMBAAAAAcEDAAAAwQMCAw8AAMYKACCkBAAAxwoAIKoEAACRBAAgGxwAANUGACArAADWBgAgLAAA1wYAIC0AANgGACD3AgEAAAAB-wJAAAAAAfwCQAAAAAGvAwEAAAABuAMAAADJAwLTAwEAAAAB1QMAAADVAwLWAwEAAAAB1wMBAAAAAdgDAQAAAAHZAwEAAAAB2gMBAAAAAdsDAQAAAAHcAwEAAAAB3QMBAAAAAd4DEAAAAAHfAxAAAAAB4AMQAAAAAeEDEAAAAAHiA0AAAAAB4wNAAAAAAeQDQAAAAAHlA0AAAAABAw8AAMQKACCkBAAAxQoAIKoEAAAaACAEDwAAyQYAMKQEAADKBgAwpgQAAMwGACCqBAAAjwYAMAQPAAC7BgAwpAQAALwGADCmBAAAvgYAIKoEAAC_BgAwBA8AAK4GADCkBAAArwYAMKYEAACxBgAgqgQAALIGADAlIAAA1gcAICIAANcHACAkAADYBwAgJQAA2QcAICYAANoHACAnAADbBwAgKAAA3AcAICkAAN0HACAsAADeBwAg9wIBAAAAAfsCQAAAAAH8AkAAAAABoAMgAAAAAd8DAgAAAAHmAwEAAAAB6wMBAAAAAewDAQAAAAHtAwEAAAAB7gMBAAAAAe8DAQAAAAHwAwEAAAAB8QMAANIHACDyAwIAAAAB8wMCAAAAAfQDAADTBwAg9QMAANQHACD2AwIAAAAB9wMIAAAAAfgDCAAAAAH5AwgAAAAB-gMgAAAAAfsDAgAAAAH8AyAAAAAB_QMgAAAAAf4DAADVBwAg_wNAAAAAAYAEQAAAAAECAAAAKQAgDwAA0QcAIAMAAAApACAPAADRBwAgEAAA6QYAIAEIAADDCgAwKiAAAMwFACAiAADNBQAgIwAAswUAICQAAM4FACAlAADPBQAgJgAA0AUAICcAANEFACAoAADSBQAgKQAA8AQAICwAALQFACD0AgAAyQUAMPUCAAAnABD2AgAAyQUAMPcCAQAAAAH7AkAA6AQAIfwCQADoBAAh_wIBAOIEACGgAyAA5QQAId8DAgDqBAAh5gMBAOIEACHrAwEA4gQAIewDAQDkBAAh7QMBAOIEACHuAwEA5AQAIe8DAQDkBAAh8AMBAOIEACHxAwAAwwQAIPIDAgDqBAAh8wMCAMoFACH0AwAAjQUAIPUDAADDBAAg9gMCAMoFACH3AwgAywUAIfgDCADLBQAh-QMIAMsFACH6AyAA5QQAIfsDAgDqBAAh_AMgAOUEACH9AyAA5QQAIf4DAADDBAAg_wNAAOcEACGABEAA5wQAIQIAAAApACAIAADpBgAgAgAAAOEGACAIAADiBgAgIPQCAADgBgAw9QIAAOEGABD2AgAA4AYAMPcCAQDiBAAh-wJAAOgEACH8AkAA6AQAIf8CAQDiBAAhoAMgAOUEACHfAwIA6gQAIeYDAQDiBAAh6wMBAOIEACHsAwEA5AQAIe0DAQDiBAAh7gMBAOQEACHvAwEA5AQAIfADAQDiBAAh8QMAAMMEACDyAwIA6gQAIfMDAgDKBQAh9AMAAI0FACD1AwAAwwQAIPYDAgDKBQAh9wMIAMsFACH4AwgAywUAIfkDCADLBQAh-gMgAOUEACH7AwIA6gQAIfwDIADlBAAh_QMgAOUEACH-AwAAwwQAIP8DQADnBAAhgARAAOcEACEg9AIAAOAGADD1AgAA4QYAEPYCAADgBgAw9wIBAOIEACH7AkAA6AQAIfwCQADoBAAh_wIBAOIEACGgAyAA5QQAId8DAgDqBAAh5gMBAOIEACHrAwEA4gQAIewDAQDkBAAh7QMBAOIEACHuAwEA5AQAIe8DAQDkBAAh8AMBAOIEACHxAwAAwwQAIPIDAgDqBAAh8wMCAMoFACH0AwAAjQUAIPUDAADDBAAg9gMCAMoFACH3AwgAywUAIfgDCADLBQAh-QMIAMsFACH6AyAA5QQAIfsDAgDqBAAh_AMgAOUEACH9AyAA5QQAIf4DAADDBAAg_wNAAOcEACGABEAA5wQAIRz3AgEA4gUAIfsCQADmBQAh_AJAAOYFACGgAyAA9AUAId8DAgD4BQAh5gMBAOIFACHrAwEA4gUAIewDAQDkBQAh7QMBAOIFACHuAwEA5AUAIe8DAQDkBQAh8AMBAOIFACHxAwAA4wYAIPIDAgD4BQAh8wMCAOQGACH0AwAA5QYAIPUDAADmBgAg9gMCAOQGACH3AwgA5wYAIfgDCADnBgAh-QMIAOcGACH6AyAA9AUAIfsDAgD4BQAh_AMgAPQFACH9AyAA9AUAIf4DAADoBgAg_wNAAPYFACGABEAA9gUAIQKnBAEAAAAEsQQBAAAABQWnBAIAAAABrQQCAAAAAa4EAgAAAAGvBAIAAAABsAQCAAAAAQKnBAAAAIIECLEEAAAAggQCAqcEAQAAAASxBAEAAAAFBacECAAAAAGtBAgAAAABrgQIAAAAAa8ECAAAAAGwBAgAAAABAqcEAQAAAASxBAEAAAAFJSAAAOoGACAiAADrBgAgJAAA7AYAICUAAO0GACAmAADuBgAgJwAA7wYAICgAAPAGACApAADxBgAgLAAA8gYAIPcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIaADIAD0BQAh3wMCAPgFACHmAwEA4gUAIesDAQDiBQAh7AMBAOQFACHtAwEA4gUAIe4DAQDkBQAh7wMBAOQFACHwAwEA4gUAIfEDAADjBgAg8gMCAPgFACHzAwIA5AYAIfQDAADlBgAg9QMAAOYGACD2AwIA5AYAIfcDCADnBgAh-AMIAOcGACH5AwgA5wYAIfoDIAD0BQAh-wMCAPgFACH8AyAA9AUAIf0DIAD0BQAh_gMAAOgGACD_A0AA9gUAIYAEQAD2BQAhCw8AAMMHADAQAADIBwAwpAQAAMQHADClBAAAxQcAMKYEAADGBwAgpwQAAMcHADCoBAAAxwcAMKkEAADHBwAwqgQAAMcHADCrBAAAyQcAMKwEAADKBwAwBQ8AAKwKACAQAADBCgAgpAQAAK0KACClBAAAwAoAIKoEAACEAgAgCw8AALcHADAQAAC8BwAwpAQAALgHADClBAAAuQcAMKYEAAC6BwAgpwQAALsHADCoBAAAuwcAMKkEAAC7BwAwqgQAALsHADCrBAAAvQcAMKwEAAC-BwAwCw8AAKsHADAQAACwBwAwpAQAAKwHADClBAAArQcAMKYEAACuBwAgpwQAAK8HADCoBAAArwcAMKkEAACvBwAwqgQAAK8HADCrBAAAsQcAMKwEAACyBwAwCw8AAJ8HADAQAACkBwAwpAQAAKAHADClBAAAoQcAMKYEAACiBwAgpwQAAKMHADCoBAAAowcAMKkEAACjBwAwqgQAAKMHADCrBAAApQcAMKwEAACmBwAwCw8AAJMHADAQAACYBwAwpAQAAJQHADClBAAAlQcAMKYEAACWBwAgpwQAAJcHADCoBAAAlwcAMKkEAACXBwAwqgQAAJcHADCrBAAAmQcAMKwEAACaBwAwCw8AAIcHADAQAACMBwAwpAQAAIgHADClBAAAiQcAMKYEAACKBwAgpwQAAIsHADCoBAAAiwcAMKkEAACLBwAwqgQAAIsHADCrBAAAjQcAMKwEAACOBwAwCw8AAP4GADAQAACCBwAwpAQAAP8GADClBAAAgAcAMKYEAACBBwAgpwQAAIMGADCoBAAAgwYAMKkEAACDBgAwqgQAAIMGADCrBAAAgwcAMKwEAACGBgAwCw8AAPMGADAQAAD3BgAwpAQAAPQGADClBAAA9QYAMKYEAAD2BgAgpwQAAL8GADCoBAAAvwYAMKkEAAC_BgAwqgQAAL8GADCrBAAA-AYAMKwEAADCBgAwCioAAP0GACD3AgEAAAAB-wJAAAAAAa4DAQAAAAHNAwEAAAABzgMBAAAAAc8DAQAAAAHQAwIAAAAB0QMQAAAAAdIDEAAAAAECAAAASwAgDwAA_AYAIAMAAABLACAPAAD8BgAgEAAA-gYAIAEIAAC_CgAwAgAAAEsAIAgAAPoGACACAAAAwwYAIAgAAPkGACAJ9wIBAOIFACH7AkAA5gUAIa4DAQDiBQAhzQMBAOIFACHOAwEA5AUAIc8DAQDkBQAh0AMCAPgFACHRAxAA9wUAIdIDEAD3BQAhCioAAPsGACD3AgEA4gUAIfsCQADmBQAhrgMBAOIFACHNAwEA4gUAIc4DAQDkBQAhzwMBAOQFACHQAwIA-AUAIdEDEAD3BQAh0gMQAPcFACEFDwAAugoAIBAAAL0KACCkBAAAuwoAIKUEAAC8CgAgqgQAAGMAIAoqAAD9BgAg9wIBAAAAAfsCQAAAAAGuAwEAAAABzQMBAAAAAc4DAQAAAAHPAwEAAAAB0AMCAAAAAdEDEAAAAAHSAxAAAAABAw8AALoKACCkBAAAuwoAIKoEAABjACAKGgAA7QUAICMAAOwFACD3AgEAAAAB-AIIAAAAAfkCAQAAAAH6AgAA6gUAIPsCQAAAAAH8AkAAAAAB_gIBAAAAAf8CAQAAAAECAAAARwAgDwAAhgcAIAMAAABHACAPAACGBwAgEAAAhQcAIAEIAAC5CgAwAgAAAEcAIAgAAIUHACACAAAAhwYAIAgAAIQHACAI9wIBAOIFACH4AggA4wUAIfkCAQDkBQAh-gIAAOUFACD7AkAA5gUAIfwCQADmBQAh_gIBAOIFACH_AgEA4gUAIQoaAADpBQAgIwAA6AUAIPcCAQDiBQAh-AIIAOMFACH5AgEA5AUAIfoCAADlBQAg-wJAAOYFACH8AkAA5gUAIf4CAQDiBQAh_wIBAOIFACEKGgAA7QUAICMAAOwFACD3AgEAAAAB-AIIAAAAAfkCAQAAAAH6AgAA6gUAIPsCQAAAAAH8AkAAAAAB_gIBAAAAAf8CAQAAAAED9wIBAAAAAegDAQAAAAHpAyAAAAABAgAAAEMAIA8AAJIHACADAAAAQwAgDwAAkgcAIBAAAJEHACABCAAAuAoAMAgfAAC-BQAg9AIAAMEFADD1AgAAQQAQ9gIAAMEFADD3AgEAAAAB_QIBAOIEACHoAwEA4gQAIekDIADlBAAhAgAAAEMAIAgAAJEHACACAAAAjwcAIAgAAJAHACAH9AIAAI4HADD1AgAAjwcAEPYCAACOBwAw9wIBAOIEACH9AgEA4gQAIegDAQDiBAAh6QMgAOUEACEH9AIAAI4HADD1AgAAjwcAEPYCAACOBwAw9wIBAOIEACH9AgEA4gQAIegDAQDiBAAh6QMgAOUEACED9wIBAOIFACHoAwEA4gUAIekDIAD0BQAhA_cCAQDiBQAh6AMBAOIFACHpAyAA9AUAIQP3AgEAAAAB6AMBAAAAAekDIAAAAAEE9wIBAAAAAeYDAQAAAAHpAyAAAAAB6gMCAAAAAQIAAAA_ACAPAACeBwAgAwAAAD8AIA8AAJ4HACAQAACdBwAgAQgAALcKADAJHwAAvgUAIPQCAADCBQAw9QIAAD0AEPYCAADCBQAw9wIBAAAAAf0CAQDiBAAh5gMBAOIEACHpAyAA5QQAIeoDAgDqBAAhAgAAAD8AIAgAAJ0HACACAAAAmwcAIAgAAJwHACAI9AIAAJoHADD1AgAAmwcAEPYCAACaBwAw9wIBAOIEACH9AgEA4gQAIeYDAQDiBAAh6QMgAOUEACHqAwIA6gQAIQj0AgAAmgcAMPUCAACbBwAQ9gIAAJoHADD3AgEA4gQAIf0CAQDiBAAh5gMBAOIEACHpAyAA5QQAIeoDAgDqBAAhBPcCAQDiBQAh5gMBAOIFACHpAyAA9AUAIeoDAgD4BQAhBPcCAQDiBQAh5gMBAOIFACHpAyAA9AUAIeoDAgD4BQAhBPcCAQAAAAHmAwEAAAAB6QMgAAAAAeoDAgAAAAEC9wIBAAAAAeYDAQAAAAECAAAAOwAgDwAAqgcAIAMAAAA7ACAPAACqBwAgEAAAqQcAIAEIAAC2CgAwBx8AAL4FACD0AgAAwwUAMPUCAAA5ABD2AgAAwwUAMPcCAQAAAAH9AgEA4gQAIeYDAQDiBAAhAgAAADsAIAgAAKkHACACAAAApwcAIAgAAKgHACAG9AIAAKYHADD1AgAApwcAEPYCAACmBwAw9wIBAOIEACH9AgEA4gQAIeYDAQDiBAAhBvQCAACmBwAw9QIAAKcHABD2AgAApgcAMPcCAQDiBAAh_QIBAOIEACHmAwEA4gQAIQL3AgEA4gUAIeYDAQDiBQAhAvcCAQDiBQAh5gMBAOIFACEC9wIBAAAAAeYDAQAAAAEC9wIBAAAAAeYDAQAAAAECAAAANwAgDwAAtgcAIAMAAAA3ACAPAAC2BwAgEAAAtQcAIAEIAAC1CgAwBx8AAL4FACD0AgAAxAUAMPUCAAA1ABD2AgAAxAUAMPcCAQAAAAH9AgEA4gQAIeYDAQDiBAAhAgAAADcAIAgAALUHACACAAAAswcAIAgAALQHACAG9AIAALIHADD1AgAAswcAEPYCAACyBwAw9wIBAOIEACH9AgEA4gQAIeYDAQDiBAAhBvQCAACyBwAw9QIAALMHABD2AgAAsgcAMPcCAQDiBAAh_QIBAOIEACHmAwEA4gQAIQL3AgEA4gUAIeYDAQDiBQAhAvcCAQDiBQAh5gMBAOIFACEC9wIBAAAAAeYDAQAAAAED9wIBAAAAAeYDAQAAAAHnAwIAAAABAgAAADMAIA8AAMIHACADAAAAMwAgDwAAwgcAIBAAAMEHACABCAAAtAoAMAgfAAC-BQAg9AIAAMUFADD1AgAAMQAQ9gIAAMUFADD3AgEAAAAB_QIBAOIEACHmAwEA4gQAIecDAgDqBAAhAgAAADMAIAgAAMEHACACAAAAvwcAIAgAAMAHACAH9AIAAL4HADD1AgAAvwcAEPYCAAC-BwAw9wIBAOIEACH9AgEA4gQAIeYDAQDiBAAh5wMCAOoEACEH9AIAAL4HADD1AgAAvwcAEPYCAAC-BwAw9wIBAOIEACH9AgEA4gQAIeYDAQDiBAAh5wMCAOoEACED9wIBAOIFACHmAwEA4gUAIecDAgD4BQAhA_cCAQDiBQAh5gMBAOIFACHnAwIA-AUAIQP3AgEAAAAB5gMBAAAAAecDAgAAAAEJHgAA0AcAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAdADAgAAAAHRAxAAAAAB0gMQAAAAAYcEAQAAAAGIBBAAAAABAgAAAC0AIA8AAM8HACADAAAALQAgDwAAzwcAIBAAAM0HACABCAAAswoAMA8eAADIBQAgHwAAvgUAIPQCAADHBQAw9QIAACsAEPYCAADHBQAw9wIBAAAAAfsCQADoBAAh_AJAAOgEACH9AgEA4gQAIdADAgDqBAAh0QMQAOkEACHSAxAA6QQAIYcEAQDiBAAhiAQQAOkEACGfBAAAxgUAIAIAAAAtACAIAADNBwAgAgAAAMsHACAIAADMBwAgDPQCAADKBwAw9QIAAMsHABD2AgAAygcAMPcCAQDiBAAh-wJAAOgEACH8AkAA6AQAIf0CAQDiBAAh0AMCAOoEACHRAxAA6QQAIdIDEADpBAAhhwQBAOIEACGIBBAA6QQAIQz0AgAAygcAMPUCAADLBwAQ9gIAAMoHADD3AgEA4gQAIfsCQADoBAAh_AJAAOgEACH9AgEA4gQAIdADAgDqBAAh0QMQAOkEACHSAxAA6QQAIYcEAQDiBAAhiAQQAOkEACEI9wIBAOIFACH7AkAA5gUAIfwCQADmBQAh0AMCAPgFACHRAxAA9wUAIdIDEAD3BQAhhwQBAOIFACGIBBAA9wUAIQkeAADOBwAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAh0AMCAPgFACHRAxAA9wUAIdIDEAD3BQAhhwQBAOIFACGIBBAA9wUAIQUPAACuCgAgEAAAsQoAIKQEAACvCgAgpQQAALAKACCqBAAAJQAgCR4AANAHACD3AgEAAAAB-wJAAAAAAfwCQAAAAAHQAwIAAAAB0QMQAAAAAdIDEAAAAAGHBAEAAAABiAQQAAAAAQMPAACuCgAgpAQAAK8KACCqBAAAJQAgJSAAANYHACAiAADXBwAgJAAA2AcAICUAANkHACAmAADaBwAgJwAA2wcAICgAANwHACApAADdBwAgLAAA3gcAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAaADIAAAAAHfAwIAAAAB5gMBAAAAAesDAQAAAAHsAwEAAAAB7QMBAAAAAe4DAQAAAAHvAwEAAAAB8AMBAAAAAfEDAADSBwAg8gMCAAAAAfMDAgAAAAH0AwAA0wcAIPUDAADUBwAg9gMCAAAAAfcDCAAAAAH4AwgAAAAB-QMIAAAAAfoDIAAAAAH7AwIAAAAB_AMgAAAAAf0DIAAAAAH-AwAA1QcAIP8DQAAAAAGABEAAAAABAacEAQAAAAQBpwQAAACCBAgBpwQBAAAABAGnBAEAAAAEBA8AAMMHADCkBAAAxAcAMKYEAADGBwAgqgQAAMcHADADDwAArAoAIKQEAACtCgAgqgQAAIQCACAEDwAAtwcAMKQEAAC4BwAwpgQAALoHACCqBAAAuwcAMAQPAACrBwAwpAQAAKwHADCmBAAArgcAIKoEAACvBwAwBA8AAJ8HADCkBAAAoAcAMKYEAACiBwAgqgQAAKMHADAEDwAAkwcAMKQEAACUBwAwpgQAAJYHACCqBAAAlwcAMAQPAACHBwAwpAQAAIgHADCmBAAAigcAIKoEAACLBwAwBA8AAP4GADCkBAAA_wYAMKYEAACBBwAgqgQAAIMGADAEDwAA8wYAMKQEAAD0BgAwpgQAAPYGACCqBAAAvwYAMAocAAD4BwAgIAAA-QcAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAa8DAQAAAAHeAxAAAAAB3wMQAAAAAeADEAAAAAHhAxAAAAABAgAAACUAIA8AAPcHACADAAAAJQAgDwAA9wcAIBAAAOkHACABCAAAqwoAMA8cAADUBQAgIAAAzAUAICMAALMFACD0AgAA0wUAMPUCAAAiABD2AgAA0wUAMPcCAQAAAAH7AkAA6AQAIfwCQADoBAAh_wIBAOIEACGvAwEAAAAB3gMQAOkEACHfAxAA6QQAIeADEADpBAAh4QMQAOkEACECAAAAJQAgCAAA6QcAIAIAAADnBwAgCAAA6AcAIAz0AgAA5gcAMPUCAADnBwAQ9gIAAOYHADD3AgEA4gQAIfsCQADoBAAh_AJAAOgEACH_AgEA4gQAIa8DAQDiBAAh3gMQAOkEACHfAxAA6QQAIeADEADpBAAh4QMQAOkEACEM9AIAAOYHADD1AgAA5wcAEPYCAADmBwAw9wIBAOIEACH7AkAA6AQAIfwCQADoBAAh_wIBAOIEACGvAwEA4gQAId4DEADpBAAh3wMQAOkEACHgAxAA6QQAIeEDEADpBAAhCPcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIa8DAQDiBQAh3gMQAPcFACHfAxAA9wUAIeADEAD3BQAh4QMQAPcFACEKHAAA6gcAICAAAOsHACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACGvAwEA4gUAId4DEAD3BQAh3wMQAPcFACHgAxAA9wUAIeEDEAD3BQAhBQ8AAKAKACAQAACpCgAgpAQAAKEKACClBAAAqAoAIKoEAACdAgAgCw8AAOwHADAQAADwBwAwpAQAAO0HADClBAAA7gcAMKYEAADvBwAgpwQAAMcHADCoBAAAxwcAMKkEAADHBwAwqgQAAMcHADCrBAAA8QcAMKwEAADKBwAwCR8AAPYHACD3AgEAAAAB-wJAAAAAAfwCQAAAAAH9AgEAAAAB0AMCAAAAAdEDEAAAAAHSAxAAAAABiAQQAAAAAQIAAAAtACAPAAD1BwAgAwAAAC0AIA8AAPUHACAQAADzBwAgAQgAAKcKADACAAAALQAgCAAA8wcAIAIAAADLBwAgCAAA8gcAIAj3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH9AgEA4gUAIdADAgD4BQAh0QMQAPcFACHSAxAA9wUAIYgEEAD3BQAhCR8AAPQHACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH9AgEA4gUAIdADAgD4BQAh0QMQAPcFACHSAxAA9wUAIYgEEAD3BQAhBQ8AAKIKACAQAAClCgAgpAQAAKMKACClBAAApAoAIKoEAAApACAJHwAA9gcAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAf0CAQAAAAHQAwIAAAAB0QMQAAAAAdIDEAAAAAGIBBAAAAABAw8AAKIKACCkBAAAowoAIKoEAAApACAKHAAA-AcAICAAAPkHACD3AgEAAAAB-wJAAAAAAfwCQAAAAAGvAwEAAAAB3gMQAAAAAd8DEAAAAAHgAxAAAAAB4QMQAAAAAQMPAACgCgAgpAQAAKEKACCqBAAAnQIAIAQPAADsBwAwpAQAAO0HADCmBAAA7wcAIKoEAADHBwAwBA8AAN8HADCkBAAA4AcAMKYEAADiBwAgqgQAAOMHADAEDwAA2QYAMKQEAADaBgAwpgQAANwGACCqBAAA3QYAMAQPAACdBgAwpAQAAJ4GADCmBAAAoAYAIKoEAAChBgAwBA8AAIsGADCkBAAAjAYAMKYEAACOBgAgqgQAAI8GADADDwAAngoAIKQEAACfCgAgqgQAABoAIAQPAAD_BQAwpAQAAIAGADCmBAAAggYAIKoEAACDBgAwAAAAAAobAADJCQAgKQAAhQgAICsAAIMIACAuAACCCAAgLwAAygkAIDAAAMsJACAxAADMCQAgkQMAANwFACCZBAAA3AUAIJ4EAADcBQAgAAAAAAAAAAAABQ8AAJkKACAQAACcCgAgpAQAAJoKACClBAAAmwoAIKoEAABjACADDwAAmQoAIKQEAACaCgAgqgQAAGMAIAAAAAAAAAAAAAAFDwAAlAoAIBAAAJcKACCkBAAAlQoAIKUEAACWCgAgqgQAAJEEACADDwAAlAoAIKQEAACVCgAgqgQAAJEEACAAAAAFDwAAjwoAIBAAAJIKACCkBAAAkAoAIKUEAACRCgAgqgQAACkAIAMPAACPCgAgpAQAAJAKACCqBAAAKQAgAAAABQ8AAIoKACAQAACNCgAgpAQAAIsKACClBAAAjAoAIKoEAAApACADDwAAigoAIKQEAACLCgAgqgQAACkAIAAAAAAABQ8AAIUKACAQAACICgAgpAQAAIYKACClBAAAhwoAIKoEAAApACADDwAAhQoAIKQEAACGCgAgqgQAACkAIAAAAAUPAACACgAgEAAAgwoAIKQEAACBCgAgpQQAAIIKACCqBAAAKQAgAw8AAIAKACCkBAAAgQoAIKoEAAApACAAAAAAAAUPAAD7CQAgEAAA_gkAIKQEAAD8CQAgpQQAAP0JACCqBAAAKQAgAw8AAPsJACCkBAAA_AkAIKoEAAApACAAAAAAAAUPAAD2CQAgEAAA-QkAIKQEAAD3CQAgpQQAAPgJACCqBAAAkQQAIAMPAAD2CQAgpAQAAPcJACCqBAAAkQQAIAAAAAAABacEEAAAAAGtBBAAAAABrgQQAAAAAa8EEAAAAAGwBBAAAAABBw8AAMgIACAQAADLCAAgpAQAAMkIACClBAAAyggAIKgEAAAiACCpBAAAIgAgqgQAACUAIAUPAADsCQAgEAAA9AkAIKQEAADtCQAgpQQAAPMJACCqBAAAGgAgCiAAAPkHACAjAADOCAAg9wIBAAAAAfsCQAAAAAH8AkAAAAAB_wIBAAAAAd4DEAAAAAHfAxAAAAAB4AMQAAAAAeEDEAAAAAECAAAAJQAgDwAAyAgAIAMAAAAiACAPAADICAAgEAAAzAgAIAwAAAAiACAIAADMCAAgIAAA6wcAICMAAM0IACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH_AgEA4gUAId4DEAD3BQAh3wMQAPcFACHgAxAA9wUAIeEDEAD3BQAhCiAAAOsHACAjAADNCAAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAh_wIBAOIFACHeAxAA9wUAId8DEAD3BQAh4AMQAPcFACHhAxAA9wUAIQUPAADuCQAgEAAA8QkAIKQEAADvCQAgpQQAAPAJACCqBAAAkQQAIAMPAADuCQAgpAQAAO8JACCqBAAAkQQAIAMPAADICAAgpAQAAMkIACCqBAAAJQAgAw8AAOwJACCkBAAA7QkAIKoEAAAaACADHAAAygkAICAAANEJACAjAADLCQAgAAAAAAALDwAA2AgAMBAAANwIADCkBAAA2QgAMKUEAADaCAAwpgQAANsIACCnBAAA3QYAMKgEAADdBgAwqQQAAN0GADCqBAAA3QYAMKsEAADdCAAwrAQAAOAGADAlIAAA1gcAICMAAL8IACAkAADYBwAgJQAA2QcAICYAANoHACAnAADbBwAgKAAA3AcAICkAAN0HACAsAADeBwAg9wIBAAAAAfsCQAAAAAH8AkAAAAAB_wIBAAAAAaADIAAAAAHfAwIAAAAB5gMBAAAAAewDAQAAAAHtAwEAAAAB7gMBAAAAAe8DAQAAAAHwAwEAAAAB8QMAANIHACDyAwIAAAAB8wMCAAAAAfQDAADTBwAg9QMAANQHACD2AwIAAAAB9wMIAAAAAfgDCAAAAAH5AwgAAAAB-gMgAAAAAfsDAgAAAAH8AyAAAAAB_QMgAAAAAf4DAADVBwAg_wNAAAAAAYAEQAAAAAECAAAAKQAgDwAA4AgAIAMAAAApACAPAADgCAAgEAAA3wgAIAEIAADrCQAwAgAAACkAIAgAAN8IACACAAAA4QYAIAgAAN4IACAc9wIBAOIFACH7AkAA5gUAIfwCQADmBQAh_wIBAOIFACGgAyAA9AUAId8DAgD4BQAh5gMBAOIFACHsAwEA5AUAIe0DAQDiBQAh7gMBAOQFACHvAwEA5AUAIfADAQDiBQAh8QMAAOMGACDyAwIA-AUAIfMDAgDkBgAh9AMAAOUGACD1AwAA5gYAIPYDAgDkBgAh9wMIAOcGACH4AwgA5wYAIfkDCADnBgAh-gMgAPQFACH7AwIA-AUAIfwDIAD0BQAh_QMgAPQFACH-AwAA6AYAIP8DQAD2BQAhgARAAPYFACElIAAA6gYAICMAAL4IACAkAADsBgAgJQAA7QYAICYAAO4GACAnAADvBgAgKAAA8AYAICkAAPEGACAsAADyBgAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAh_wIBAOIFACGgAyAA9AUAId8DAgD4BQAh5gMBAOIFACHsAwEA5AUAIe0DAQDiBQAh7gMBAOQFACHvAwEA5AUAIfADAQDiBQAh8QMAAOMGACDyAwIA-AUAIfMDAgDkBgAh9AMAAOUGACD1AwAA5gYAIPYDAgDkBgAh9wMIAOcGACH4AwgA5wYAIfkDCADnBgAh-gMgAPQFACH7AwIA-AUAIfwDIAD0BQAh_QMgAPQFACH-AwAA6AYAIP8DQAD2BQAhgARAAPYFACElIAAA1gcAICMAAL8IACAkAADYBwAgJQAA2QcAICYAANoHACAnAADbBwAgKAAA3AcAICkAAN0HACAsAADeBwAg9wIBAAAAAfsCQAAAAAH8AkAAAAAB_wIBAAAAAaADIAAAAAHfAwIAAAAB5gMBAAAAAewDAQAAAAHtAwEAAAAB7gMBAAAAAe8DAQAAAAHwAwEAAAAB8QMAANIHACDyAwIAAAAB8wMCAAAAAfQDAADTBwAg9QMAANQHACD2AwIAAAAB9wMIAAAAAfgDCAAAAAH5AwgAAAAB-gMgAAAAAfsDAgAAAAH8AyAAAAAB_QMgAAAAAf4DAADVBwAg_wNAAAAAAYAEQAAAAAEEDwAA2AgAMKQEAADZCAAwpgQAANsIACCqBAAA3QYAMAAAAAAAAAAAAAAAAAAAAAAFDwAA5gkAIBAAAOkJACCkBAAA5wkAIKUEAADoCQAgqgQAABoAIAMPAADmCQAgpAQAAOcJACCqBAAAGgAgAAAABQ8AAOEJACAQAADkCQAgpAQAAOIJACClBAAA4wkAIKoEAAAaACADDwAA4QkAIKQEAADiCQAgqgQAABoAIAAAAAGnBAAAAMwDAgGnBAAAAJwEAgsPAAC2CQAwEAAAuwkAMKQEAAC3CQAwpQQAALgJADCmBAAAuQkAIKcEAAC6CQAwqAQAALoJADCpBAAAugkAMKoEAAC6CQAwqwQAALwJADCsBAAAvQkAMAcPAACxCQAgEAAAtAkAIKQEAACyCQAgpQQAALMJACCoBAAAIAAgqQQAACAAIKoEAACdAgAgCw8AAKgJADAQAACsCQAwpAQAAKkJADClBAAAqgkAMKYEAACrCQAgpwQAAKEGADCoBAAAoQYAMKkEAAChBgAwqgQAAKEGADCrBAAArQkAMKwEAACkBgAwCw8AAJ8JADAQAACjCQAwpAQAAKAJADClBAAAoQkAMKYEAACiCQAgpwQAAI8GADCoBAAAjwYAMKkEAACPBgAwqgQAAI8GADCrBAAApAkAMKwEAACSBgAwBw8AAJoJACAQAACdCQAgpAQAAJsJACClBAAAnAkAIKgEAABwACCpBAAAcAAgqgQAAJEEACALDwAAkQkAMBAAAJUJADCkBAAAkgkAMKUEAACTCQAwpgQAAJQJACCnBAAAgwYAMKgEAACDBgAwqQQAAIMGADCqBAAAgwYAMKsEAACWCQAwrAQAAIYGADALDwAAhQkAMBAAAIoJADCkBAAAhgkAMKUEAACHCQAwpgQAAIgJACCnBAAAiQkAMKgEAACJCQAwqQQAAIkJADCqBAAAiQkAMKsEAACLCQAwrAQAAIwJADAH9wIBAAAAAfsCQAAAAAH8AkAAAAABiwRAAAAAAZQEAQAAAAGVBAEAAAABlgQBAAAAAQIAAAB1ACAPAACQCQAgAwAAAHUAIA8AAJAJACAQAACPCQAgAQgAAOAJADAMGgAA7wQAIPQCAACvBQAw9QIAAHMAEPYCAACvBQAw9wIBAAAAAfsCQADoBAAh_AJAAOgEACH-AgEA4gQAIYsEQADoBAAhlAQBAAAAAZUEAQDkBAAhlgQBAOQEACECAAAAdQAgCAAAjwkAIAIAAACNCQAgCAAAjgkAIAv0AgAAjAkAMPUCAACNCQAQ9gIAAIwJADD3AgEA4gQAIfsCQADoBAAh_AJAAOgEACH-AgEA4gQAIYsEQADoBAAhlAQBAOIEACGVBAEA5AQAIZYEAQDkBAAhC_QCAACMCQAw9QIAAI0JABD2AgAAjAkAMPcCAQDiBAAh-wJAAOgEACH8AkAA6AQAIf4CAQDiBAAhiwRAAOgEACGUBAEA4gQAIZUEAQDkBAAhlgQBAOQEACEH9wIBAOIFACH7AkAA5gUAIfwCQADmBQAhiwRAAOYFACGUBAEA4gUAIZUEAQDkBQAhlgQBAOQFACEH9wIBAOIFACH7AkAA5gUAIfwCQADmBQAhiwRAAOYFACGUBAEA4gUAIZUEAQDkBQAhlgQBAOQFACEH9wIBAAAAAfsCQAAAAAH8AkAAAAABiwRAAAAAAZQEAQAAAAGVBAEAAAABlgQBAAAAAQofAADrBQAgIwAA7AUAIPcCAQAAAAH4AggAAAAB-QIBAAAAAfoCAADqBQAg-wJAAAAAAfwCQAAAAAH9AgEAAAAB_wIBAAAAAQIAAABHACAPAACZCQAgAwAAAEcAIA8AAJkJACAQAACYCQAgAQgAAN8JADACAAAARwAgCAAAmAkAIAIAAACHBgAgCAAAlwkAIAj3AgEA4gUAIfgCCADjBQAh-QIBAOQFACH6AgAA5QUAIPsCQADmBQAh_AJAAOYFACH9AgEA4gUAIf8CAQDiBQAhCh8AAOcFACAjAADoBQAg9wIBAOIFACH4AggA4wUAIfkCAQDkBQAh-gIAAOUFACD7AkAA5gUAIfwCQADmBQAh_QIBAOIFACH_AgEA4gUAIQofAADrBQAgIwAA7AUAIPcCAQAAAAH4AggAAAAB-QIBAAAAAfoCAADqBQAg-wJAAAAAAfwCQAAAAAH9AgEAAAAB_wIBAAAAASMdAAD6BwAgIQAA-wcAICkAAP8HACArAAD9BwAgLgAA_AcAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAY4DAQAAAAGQAwAAAJADApEDAQAAAAGSAwEAAAABkwMBAAAAAZQDAQAAAAGVAyAAAAABlgMBAAAAAZcDAQAAAAGYAwEAAAABmQMBAAAAAZoDAQAAAAGcAwAAAJwDAp0DAQAAAAGeAwEAAAABnwNAAAAAAaADIAAAAAGhAwEAAAABogMBAAAAAaMDAQAAAAGkAwEAAAABpQMQAAAAAaYDQAAAAAGnAxAAAAABqAMCAAAAAakDEAAAAAGqAxAAAAABAgAAAJEEACAPAACaCQAgAwAAAHAAIA8AAJoJACAQAACeCQAgJQAAAHAAIAgAAJ4JACAdAAD5BQAgIQAA-gUAICkAAP4FACArAAD8BQAgLgAA-wUAIPcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIY4DAQDiBQAhkAMAAPMFkAMikQMBAOIFACGSAwEA5AUAIZMDAQDkBQAhlAMBAOQFACGVAyAA9AUAIZYDAQDiBQAhlwMBAOIFACGYAwEA4gUAIZkDAQDkBQAhmgMBAOIFACGcAwAA9QWcAyKdAwEA5AUAIZ4DAQDkBQAhnwNAAPYFACGgAyAA9AUAIaEDAQDkBQAhogMBAOQFACGjAwEA5AUAIaQDAQDiBQAhpQMQAPcFACGmA0AA9gUAIacDEAD3BQAhqAMCAPgFACGpAxAA9wUAIaoDEAD3BQAhIx0AAPkFACAhAAD6BQAgKQAA_gUAICsAAPwFACAuAAD7BQAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAhjgMBAOIFACGQAwAA8wWQAyKRAwEA4gUAIZIDAQDkBQAhkwMBAOQFACGUAwEA5AUAIZUDIAD0BQAhlgMBAOIFACGXAwEA4gUAIZgDAQDiBQAhmQMBAOQFACGaAwEA4gUAIZwDAAD1BZwDIp0DAQDkBQAhngMBAOQFACGfA0AA9gUAIaADIAD0BQAhoQMBAOQFACGiAwEA5AUAIaMDAQDkBQAhpAMBAOIFACGlAxAA9wUAIaYDQAD2BQAhpwMQAPcFACGoAwIA-AUAIakDEAD3BQAhqgMQAPcFACEXIwAA0wYAICoAAJwGACD3AgEAAAAB-wJAAAAAAfwCQAAAAAH_AgEAAAABrgMBAAAAAbADEAAAAAGxAxAAAAABsgMQAAAAAbMDEAAAAAG0AwEAAAABtQMBAAAAAbYDAQAAAAG4AwAAALgDArkDgAAAAAG6A0AAAAABuwNAAAAAAbwDQAAAAAG9A0AAAAABvgMBAAAAAb8DAQAAAAHBAwAAAMEDAgIAAABPACAPAACnCQAgAwAAAE8AIA8AAKcJACAQAACmCQAgAQgAAN4JADACAAAATwAgCAAApgkAIAIAAACTBgAgCAAApQkAIBX3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH_AgEA4gUAIa4DAQDiBQAhsAMQAPcFACGxAxAA9wUAIbIDEAD3BQAhswMQAPcFACG0AwEA4gUAIbUDAQDkBQAhtgMBAOQFACG4AwAAlQa4AyK5A4AAAAABugNAAPYFACG7A0AA9gUAIbwDQAD2BQAhvQNAAPYFACG-AwEA5AUAIb8DAQDkBQAhwQMAAJYGwQMiFyMAANEGACAqAACZBgAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAh_wIBAOIFACGuAwEA4gUAIbADEAD3BQAhsQMQAPcFACGyAxAA9wUAIbMDEAD3BQAhtAMBAOIFACG1AwEA5AUAIbYDAQDkBQAhuAMAAJUGuAMiuQOAAAAAAboDQAD2BQAhuwNAAPYFACG8A0AA9gUAIb0DQAD2BQAhvgMBAOQFACG_AwEA5AUAIcEDAACWBsEDIhcjAADTBgAgKgAAnAYAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAf8CAQAAAAGuAwEAAAABsAMQAAAAAbEDEAAAAAGyAxAAAAABswMQAAAAAbQDAQAAAAG1AwEAAAABtgMBAAAAAbgDAAAAuAMCuQOAAAAAAboDQAAAAAG7A0AAAAABvANAAAAAAb0DQAAAAAG-AwEAAAABvwMBAAAAAcEDAAAAwQMCGyMAAJsIACArAADWBgAgLAAA1wYAIC0AANgGACD3AgEAAAAB-wJAAAAAAfwCQAAAAAH_AgEAAAABuAMAAADJAwLTAwEAAAAB1QMAAADVAwLWAwEAAAAB1wMBAAAAAdgDAQAAAAHZAwEAAAAB2gMBAAAAAdsDAQAAAAHcAwEAAAAB3QMBAAAAAd4DEAAAAAHfAxAAAAAB4AMQAAAAAeEDEAAAAAHiA0AAAAAB4wNAAAAAAeQDQAAAAAHlA0AAAAABAgAAAGMAIA8AALAJACADAAAAYwAgDwAAsAkAIBAAAK8JACABCAAA3QkAMAIAAABjACAIAACvCQAgAgAAAKUGACAIAACuCQAgF_cCAQDiBQAh-wJAAOYFACH8AkAA5gUAIf8CAQDiBQAhuAMAAKgGyQMi0wMBAOIFACHVAwAApwbVAyLWAwEA5AUAIdcDAQDkBQAh2AMBAOIFACHZAwEA5AUAIdoDAQDkBQAh2wMBAOQFACHcAwEA5AUAId0DAQDkBQAh3gMQAPcFACHfAxAA9wUAIeADEAD3BQAh4QMQAPcFACHiA0AA9gUAIeMDQAD2BQAh5ANAAPYFACHlA0AA9gUAIRsjAACaCAAgKwAAqwYAICwAAKwGACAtAACtBgAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAh_wIBAOIFACG4AwAAqAbJAyLTAwEA4gUAIdUDAACnBtUDItYDAQDkBQAh1wMBAOQFACHYAwEA4gUAIdkDAQDkBQAh2gMBAOQFACHbAwEA5AUAIdwDAQDkBQAh3QMBAOQFACHeAxAA9wUAId8DEAD3BQAh4AMQAPcFACHhAxAA9wUAIeIDQAD2BQAh4wNAAPYFACHkA0AA9gUAIeUDQAD2BQAhGyMAAJsIACArAADWBgAgLAAA1wYAIC0AANgGACD3AgEAAAAB-wJAAAAAAfwCQAAAAAH_AgEAAAABuAMAAADJAwLTAwEAAAAB1QMAAADVAwLWAwEAAAAB1wMBAAAAAdgDAQAAAAHZAwEAAAAB2gMBAAAAAdsDAQAAAAHcAwEAAAAB3QMBAAAAAd4DEAAAAAHfAxAAAAAB4AMQAAAAAeEDEAAAAAHiA0AAAAAB4wNAAAAAAeQDQAAAAAHlA0AAAAABDB4AAM8IACD3AgEAAAAB-wJAAAAAAfwCQAAAAAGRAwEAAAABlgMBAAAAAZgDAQAAAAGZAwEAAAABmgMBAAAAAYIEAQAAAAGDBBAAAAABhAQQAAAAAQIAAACdAgAgDwAAsQkAIAMAAAAgACAPAACxCQAgEAAAtQkAIA4AAAAgACAIAAC1CQAgHgAAxggAIPcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIZEDAQDiBQAhlgMBAOIFACGYAwEA4gUAIZkDAQDkBQAhmgMBAOIFACGCBAEA4gUAIYMEEADFCAAhhAQQAMUIACEMHgAAxggAIPcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIZEDAQDiBQAhlgMBAOIFACGYAwEA4gUAIZkDAQDkBQAhmgMBAOIFACGCBAEA4gUAIYMEEADFCAAhhAQQAMUIACEM9wIBAAAAAfsCQAAAAAH8AkAAAAAB_wIBAAAAAYwEAQAAAAGNBAEAAAABjgQBAAAAAY8EAQAAAAGQBEAAAAABkQRAAAAAAZIEAQAAAAGTBAEAAAABAgAAAB4AIA8AAMEJACADAAAAHgAgDwAAwQkAIBAAAMAJACABCAAA3AkAMBEaAADvBAAg9AIAANUFADD1AgAAHAAQ9gIAANUFADD3AgEAAAAB-wJAAOgEACH8AkAA6AQAIf4CAQDiBAAh_wIBAOIEACGMBAEA4gQAIY0EAQDkBAAhjgQBAOQEACGPBAEA5AQAIZAEQADnBAAhkQRAAOcEACGSBAEA5AQAIZMEAQDkBAAhAgAAAB4AIAgAAMAJACACAAAAvgkAIAgAAL8JACAQ9AIAAL0JADD1AgAAvgkAEPYCAAC9CQAw9wIBAOIEACH7AkAA6AQAIfwCQADoBAAh_gIBAOIEACH_AgEA4gQAIYwEAQDiBAAhjQQBAOQEACGOBAEA5AQAIY8EAQDkBAAhkARAAOcEACGRBEAA5wQAIZIEAQDkBAAhkwQBAOQEACEQ9AIAAL0JADD1AgAAvgkAEPYCAAC9CQAw9wIBAOIEACH7AkAA6AQAIfwCQADoBAAh_gIBAOIEACH_AgEA4gQAIYwEAQDiBAAhjQQBAOQEACGOBAEA5AQAIY8EAQDkBAAhkARAAOcEACGRBEAA5wQAIZIEAQDkBAAhkwQBAOQEACEM9wIBAOIFACH7AkAA5gUAIfwCQADmBQAh_wIBAOIFACGMBAEA4gUAIY0EAQDkBQAhjgQBAOQFACGPBAEA5AUAIZAEQAD2BQAhkQRAAPYFACGSBAEA5AUAIZMEAQDkBQAhDPcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIf8CAQDiBQAhjAQBAOIFACGNBAEA5AUAIY4EAQDkBQAhjwQBAOQFACGQBEAA9gUAIZEEQAD2BQAhkgQBAOQFACGTBAEA5AUAIQz3AgEAAAAB-wJAAAAAAfwCQAAAAAH_AgEAAAABjAQBAAAAAY0EAQAAAAGOBAEAAAABjwQBAAAAAZAEQAAAAAGRBEAAAAABkgQBAAAAAZMEAQAAAAEEDwAAtgkAMKQEAAC3CQAwpgQAALkJACCqBAAAugkAMAMPAACxCQAgpAQAALIJACCqBAAAnQIAIAQPAACoCQAwpAQAAKkJADCmBAAAqwkAIKoEAAChBgAwBA8AAJ8JADCkBAAAoAkAMKYEAACiCQAgqgQAAI8GADADDwAAmgkAIKQEAACbCQAgqgQAAJEEACAEDwAAkQkAMKQEAACSCQAwpgQAAJQJACCqBAAAgwYAMAQPAACFCQAwpAQAAIYJADCmBAAAiAkAIKoEAACJCQAwAAUaAACECAAgHgAA0QgAIJkDAADcBQAggwQAANwFACCEBAAA3AUAIBEaAACECAAgHQAAgAgAICEAAIEIACApAACFCAAgKwAAgwgAIC4AAIIIACCSAwAA3AUAIJMDAADcBQAglAMAANwFACCZAwAA3AUAIJ0DAADcBQAgngMAANwFACCfAwAA3AUAIKEDAADcBQAgogMAANwFACCjAwAA3AUAIKYDAADcBQAgAAAAEBwAAIQIACAjAADLCQAgKwAAgwgAICwAAM0JACAtAADOCQAg1gMAANwFACDXAwAA3AUAINkDAADcBQAg2gMAANwFACDbAwAA3AUAINwDAADcBQAg3QMAANwFACDiAwAA3AUAIOMDAADcBQAg5AMAANwFACDlAwAA3AUAIBQgAADRCQAgIgAA0gkAICMAAMsJACAkAADTCQAgJQAA1AkAICYAANUJACAnAADWCQAgKAAA1wkAICkAAIUIACAsAADNCQAg7AMAANwFACDuAwAA3AUAIO8DAADcBQAg8wMAANwFACD2AwAA3AUAIPcDAADcBQAg-AMAANwFACD5AwAA3AUAIP8DAADcBQAggAQAANwFACAAASEAAIEIACAAAAAAAAAAAAGnBAAAAKEEAgz3AgEAAAAB-wJAAAAAAfwCQAAAAAH_AgEAAAABjAQBAAAAAY0EAQAAAAGOBAEAAAABjwQBAAAAAZAEQAAAAAGRBEAAAAABkgQBAAAAAZMEAQAAAAEX9wIBAAAAAfsCQAAAAAH8AkAAAAAB_wIBAAAAAbgDAAAAyQMC0wMBAAAAAdUDAAAA1QMC1gMBAAAAAdcDAQAAAAHYAwEAAAAB2QMBAAAAAdoDAQAAAAHbAwEAAAAB3AMBAAAAAd0DAQAAAAHeAxAAAAAB3wMQAAAAAeADEAAAAAHhAxAAAAAB4gNAAAAAAeMDQAAAAAHkA0AAAAAB5QNAAAAAARX3AgEAAAAB-wJAAAAAAfwCQAAAAAH_AgEAAAABrgMBAAAAAbADEAAAAAGxAxAAAAABsgMQAAAAAbMDEAAAAAG0AwEAAAABtQMBAAAAAbYDAQAAAAG4AwAAALgDArkDgAAAAAG6A0AAAAABuwNAAAAAAbwDQAAAAAG9A0AAAAABvgMBAAAAAb8DAQAAAAHBAwAAAMEDAgj3AgEAAAAB-AIIAAAAAfkCAQAAAAH6AgAA6gUAIPsCQAAAAAH8AkAAAAAB_QIBAAAAAf8CAQAAAAEH9wIBAAAAAfsCQAAAAAH8AkAAAAABiwRAAAAAAZQEAQAAAAGVBAEAAAABlgQBAAAAARMbAADCCQAgKQAAxwkAICsAAMUJACAuAADECQAgLwAAwwkAIDAAAMYJACD3AgEAAAAB-wJAAAAAAfwCQAAAAAGRAwEAAAABuAMAAACcBALmAwEAAAABlwQBAAAAAZgEIAAAAAGZBAEAAAABmgQAAADMAwKcBCAAAAABnQQgAAAAAZ4EQAAAAAECAAAAGgAgDwAA4QkAIAMAAAB9ACAPAADhCQAgEAAA5QkAIBUAAAB9ACAIAADlCQAgGwAA_ggAICkAAIMJACArAACBCQAgLgAAgAkAIC8AAP8IACAwAACCCQAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAhkQMBAOQFACG4AwAA_QicBCLmAwEA4gUAIZcEAQDiBQAhmAQgAPQFACGZBAEA5AUAIZoEAAD8CMwDIpwEIAD0BQAhnQQgAPQFACGeBEAA9gUAIRMbAAD-CAAgKQAAgwkAICsAAIEJACAuAACACQAgLwAA_wgAIDAAAIIJACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACGRAwEA5AUAIbgDAAD9CJwEIuYDAQDiBQAhlwQBAOIFACGYBCAA9AUAIZkEAQDkBQAhmgQAAPwIzAMinAQgAPQFACGdBCAA9AUAIZ4EQAD2BQAhEykAAMcJACArAADFCQAgLgAAxAkAIC8AAMMJACAwAADGCQAgMQAAyAkAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAZEDAQAAAAG4AwAAAJwEAuYDAQAAAAGXBAEAAAABmAQgAAAAAZkEAQAAAAGaBAAAAMwDApwEIAAAAAGdBCAAAAABngRAAAAAAQIAAAAaACAPAADmCQAgAwAAAH0AIA8AAOYJACAQAADqCQAgFQAAAH0AIAgAAOoJACApAACDCQAgKwAAgQkAIC4AAIAJACAvAAD_CAAgMAAAggkAIDEAAIQJACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACGRAwEA5AUAIbgDAAD9CJwEIuYDAQDiBQAhlwQBAOIFACGYBCAA9AUAIZkEAQDkBQAhmgQAAPwIzAMinAQgAPQFACGdBCAA9AUAIZ4EQAD2BQAhEykAAIMJACArAACBCQAgLgAAgAkAIC8AAP8IACAwAACCCQAgMQAAhAkAIPcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIZEDAQDkBQAhuAMAAP0InAQi5gMBAOIFACGXBAEA4gUAIZgEIAD0BQAhmQQBAOQFACGaBAAA_AjMAyKcBCAA9AUAIZ0EIAD0BQAhngRAAPYFACEc9wIBAAAAAfsCQAAAAAH8AkAAAAAB_wIBAAAAAaADIAAAAAHfAwIAAAAB5gMBAAAAAewDAQAAAAHtAwEAAAAB7gMBAAAAAe8DAQAAAAHwAwEAAAAB8QMAANIHACDyAwIAAAAB8wMCAAAAAfQDAADTBwAg9QMAANQHACD2AwIAAAAB9wMIAAAAAfgDCAAAAAH5AwgAAAAB-gMgAAAAAfsDAgAAAAH8AyAAAAAB_QMgAAAAAf4DAADVBwAg_wNAAAAAAYAEQAAAAAETGwAAwgkAICkAAMcJACArAADFCQAgLgAAxAkAIDAAAMYJACAxAADICQAg9wIBAAAAAfsCQAAAAAH8AkAAAAABkQMBAAAAAbgDAAAAnAQC5gMBAAAAAZcEAQAAAAGYBCAAAAABmQQBAAAAAZoEAAAAzAMCnAQgAAAAAZ0EIAAAAAGeBEAAAAABAgAAABoAIA8AAOwJACAkGgAA_gcAICEAAPsHACApAAD_BwAgKwAA_QcAIC4AAPwHACD3AgEAAAAB-wJAAAAAAfwCQAAAAAH-AgEAAAABjgMBAAAAAZADAAAAkAMCkQMBAAAAAZIDAQAAAAGTAwEAAAABlAMBAAAAAZUDIAAAAAGWAwEAAAABlwMBAAAAAZgDAQAAAAGZAwEAAAABmgMBAAAAAZwDAAAAnAMCnQMBAAAAAZ4DAQAAAAGfA0AAAAABoAMgAAAAAaEDAQAAAAGiAwEAAAABowMBAAAAAaQDAQAAAAGlAxAAAAABpgNAAAAAAacDEAAAAAGoAwIAAAABqQMQAAAAAaoDEAAAAAECAAAAkQQAIA8AAO4JACADAAAAcAAgDwAA7gkAIBAAAPIJACAmAAAAcAAgCAAA8gkAIBoAAP0FACAhAAD6BQAgKQAA_gUAICsAAPwFACAuAAD7BQAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAh_gIBAOIFACGOAwEA4gUAIZADAADzBZADIpEDAQDiBQAhkgMBAOQFACGTAwEA5AUAIZQDAQDkBQAhlQMgAPQFACGWAwEA4gUAIZcDAQDiBQAhmAMBAOIFACGZAwEA5AUAIZoDAQDiBQAhnAMAAPUFnAMinQMBAOQFACGeAwEA5AUAIZ8DQAD2BQAhoAMgAPQFACGhAwEA5AUAIaIDAQDkBQAhowMBAOQFACGkAwEA4gUAIaUDEAD3BQAhpgNAAPYFACGnAxAA9wUAIagDAgD4BQAhqQMQAPcFACGqAxAA9wUAISQaAAD9BQAgIQAA-gUAICkAAP4FACArAAD8BQAgLgAA-wUAIPcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIf4CAQDiBQAhjgMBAOIFACGQAwAA8wWQAyKRAwEA4gUAIZIDAQDkBQAhkwMBAOQFACGUAwEA5AUAIZUDIAD0BQAhlgMBAOIFACGXAwEA4gUAIZgDAQDiBQAhmQMBAOQFACGaAwEA4gUAIZwDAAD1BZwDIp0DAQDkBQAhngMBAOQFACGfA0AA9gUAIaADIAD0BQAhoQMBAOQFACGiAwEA5AUAIaMDAQDkBQAhpAMBAOIFACGlAxAA9wUAIaYDQAD2BQAhpwMQAPcFACGoAwIA-AUAIakDEAD3BQAhqgMQAPcFACEDAAAAfQAgDwAA7AkAIBAAAPUJACAVAAAAfQAgCAAA9QkAIBsAAP4IACApAACDCQAgKwAAgQkAIC4AAIAJACAwAACCCQAgMQAAhAkAIPcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIZEDAQDkBQAhuAMAAP0InAQi5gMBAOIFACGXBAEA4gUAIZgEIAD0BQAhmQQBAOQFACGaBAAA_AjMAyKcBCAA9AUAIZ0EIAD0BQAhngRAAPYFACETGwAA_ggAICkAAIMJACArAACBCQAgLgAAgAkAIDAAAIIJACAxAACECQAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAhkQMBAOQFACG4AwAA_QicBCLmAwEA4gUAIZcEAQDiBQAhmAQgAPQFACGZBAEA5AUAIZoEAAD8CMwDIpwEIAD0BQAhnQQgAPQFACGeBEAA9gUAISQaAAD-BwAgHQAA-gcAICkAAP8HACArAAD9BwAgLgAA_AcAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAf4CAQAAAAGOAwEAAAABkAMAAACQAwKRAwEAAAABkgMBAAAAAZMDAQAAAAGUAwEAAAABlQMgAAAAAZYDAQAAAAGXAwEAAAABmAMBAAAAAZkDAQAAAAGaAwEAAAABnAMAAACcAwKdAwEAAAABngMBAAAAAZ8DQAAAAAGgAyAAAAABoQMBAAAAAaIDAQAAAAGjAwEAAAABpAMBAAAAAaUDEAAAAAGmA0AAAAABpwMQAAAAAagDAgAAAAGpAxAAAAABqgMQAAAAAQIAAACRBAAgDwAA9gkAIAMAAABwACAPAAD2CQAgEAAA-gkAICYAAABwACAIAAD6CQAgGgAA_QUAIB0AAPkFACApAAD-BQAgKwAA_AUAIC4AAPsFACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH-AgEA4gUAIY4DAQDiBQAhkAMAAPMFkAMikQMBAOIFACGSAwEA5AUAIZMDAQDkBQAhlAMBAOQFACGVAyAA9AUAIZYDAQDiBQAhlwMBAOIFACGYAwEA4gUAIZkDAQDkBQAhmgMBAOIFACGcAwAA9QWcAyKdAwEA5AUAIZ4DAQDkBQAhnwNAAPYFACGgAyAA9AUAIaEDAQDkBQAhogMBAOQFACGjAwEA5AUAIaQDAQDiBQAhpQMQAPcFACGmA0AA9gUAIacDEAD3BQAhqAMCAPgFACGpAxAA9wUAIaoDEAD3BQAhJBoAAP0FACAdAAD5BQAgKQAA_gUAICsAAPwFACAuAAD7BQAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAh_gIBAOIFACGOAwEA4gUAIZADAADzBZADIpEDAQDiBQAhkgMBAOQFACGTAwEA5AUAIZQDAQDkBQAhlQMgAPQFACGWAwEA4gUAIZcDAQDiBQAhmAMBAOIFACGZAwEA5AUAIZoDAQDiBQAhnAMAAPUFnAMinQMBAOQFACGeAwEA5AUAIZ8DQAD2BQAhoAMgAPQFACGhAwEA5AUAIaIDAQDkBQAhowMBAOQFACGkAwEA4gUAIaUDEAD3BQAhpgNAAPYFACGnAxAA9wUAIagDAgD4BQAhqQMQAPcFACGqAxAA9wUAISYgAADWBwAgIgAA1wcAICMAAL8IACAkAADYBwAgJQAA2QcAICYAANoHACAoAADcBwAgKQAA3QcAICwAAN4HACD3AgEAAAAB-wJAAAAAAfwCQAAAAAH_AgEAAAABoAMgAAAAAd8DAgAAAAHmAwEAAAAB6wMBAAAAAewDAQAAAAHtAwEAAAAB7gMBAAAAAe8DAQAAAAHwAwEAAAAB8QMAANIHACDyAwIAAAAB8wMCAAAAAfQDAADTBwAg9QMAANQHACD2AwIAAAAB9wMIAAAAAfgDCAAAAAH5AwgAAAAB-gMgAAAAAfsDAgAAAAH8AyAAAAAB_QMgAAAAAf4DAADVBwAg_wNAAAAAAYAEQAAAAAECAAAAKQAgDwAA-wkAIAMAAAAnACAPAAD7CQAgEAAA_wkAICgAAAAnACAIAAD_CQAgIAAA6gYAICIAAOsGACAjAAC-CAAgJAAA7AYAICUAAO0GACAmAADuBgAgKAAA8AYAICkAAPEGACAsAADyBgAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAh_wIBAOIFACGgAyAA9AUAId8DAgD4BQAh5gMBAOIFACHrAwEA4gUAIewDAQDkBQAh7QMBAOIFACHuAwEA5AUAIe8DAQDkBQAh8AMBAOIFACHxAwAA4wYAIPIDAgD4BQAh8wMCAOQGACH0AwAA5QYAIPUDAADmBgAg9gMCAOQGACH3AwgA5wYAIfgDCADnBgAh-QMIAOcGACH6AyAA9AUAIfsDAgD4BQAh_AMgAPQFACH9AyAA9AUAIf4DAADoBgAg_wNAAPYFACGABEAA9gUAISYgAADqBgAgIgAA6wYAICMAAL4IACAkAADsBgAgJQAA7QYAICYAAO4GACAoAADwBgAgKQAA8QYAICwAAPIGACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH_AgEA4gUAIaADIAD0BQAh3wMCAPgFACHmAwEA4gUAIesDAQDiBQAh7AMBAOQFACHtAwEA4gUAIe4DAQDkBQAh7wMBAOQFACHwAwEA4gUAIfEDAADjBgAg8gMCAPgFACHzAwIA5AYAIfQDAADlBgAg9QMAAOYGACD2AwIA5AYAIfcDCADnBgAh-AMIAOcGACH5AwgA5wYAIfoDIAD0BQAh-wMCAPgFACH8AyAA9AUAIf0DIAD0BQAh_gMAAOgGACD_A0AA9gUAIYAEQAD2BQAhJiAAANYHACAiAADXBwAgIwAAvwgAICQAANgHACAlAADZBwAgJgAA2gcAICcAANsHACApAADdBwAgLAAA3gcAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAf8CAQAAAAGgAyAAAAAB3wMCAAAAAeYDAQAAAAHrAwEAAAAB7AMBAAAAAe0DAQAAAAHuAwEAAAAB7wMBAAAAAfADAQAAAAHxAwAA0gcAIPIDAgAAAAHzAwIAAAAB9AMAANMHACD1AwAA1AcAIPYDAgAAAAH3AwgAAAAB-AMIAAAAAfkDCAAAAAH6AyAAAAAB-wMCAAAAAfwDIAAAAAH9AyAAAAAB_gMAANUHACD_A0AAAAABgARAAAAAAQIAAAApACAPAACACgAgAwAAACcAIA8AAIAKACAQAACECgAgKAAAACcAIAgAAIQKACAgAADqBgAgIgAA6wYAICMAAL4IACAkAADsBgAgJQAA7QYAICYAAO4GACAnAADvBgAgKQAA8QYAICwAAPIGACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH_AgEA4gUAIaADIAD0BQAh3wMCAPgFACHmAwEA4gUAIesDAQDiBQAh7AMBAOQFACHtAwEA4gUAIe4DAQDkBQAh7wMBAOQFACHwAwEA4gUAIfEDAADjBgAg8gMCAPgFACHzAwIA5AYAIfQDAADlBgAg9QMAAOYGACD2AwIA5AYAIfcDCADnBgAh-AMIAOcGACH5AwgA5wYAIfoDIAD0BQAh-wMCAPgFACH8AyAA9AUAIf0DIAD0BQAh_gMAAOgGACD_A0AA9gUAIYAEQAD2BQAhJiAAAOoGACAiAADrBgAgIwAAvggAICQAAOwGACAlAADtBgAgJgAA7gYAICcAAO8GACApAADxBgAgLAAA8gYAIPcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIf8CAQDiBQAhoAMgAPQFACHfAwIA-AUAIeYDAQDiBQAh6wMBAOIFACHsAwEA5AUAIe0DAQDiBQAh7gMBAOQFACHvAwEA5AUAIfADAQDiBQAh8QMAAOMGACDyAwIA-AUAIfMDAgDkBgAh9AMAAOUGACD1AwAA5gYAIPYDAgDkBgAh9wMIAOcGACH4AwgA5wYAIfkDCADnBgAh-gMgAPQFACH7AwIA-AUAIfwDIAD0BQAh_QMgAPQFACH-AwAA6AYAIP8DQAD2BQAhgARAAPYFACEmIAAA1gcAICIAANcHACAjAAC_CAAgJQAA2QcAICYAANoHACAnAADbBwAgKAAA3AcAICkAAN0HACAsAADeBwAg9wIBAAAAAfsCQAAAAAH8AkAAAAAB_wIBAAAAAaADIAAAAAHfAwIAAAAB5gMBAAAAAesDAQAAAAHsAwEAAAAB7QMBAAAAAe4DAQAAAAHvAwEAAAAB8AMBAAAAAfEDAADSBwAg8gMCAAAAAfMDAgAAAAH0AwAA0wcAIPUDAADUBwAg9gMCAAAAAfcDCAAAAAH4AwgAAAAB-QMIAAAAAfoDIAAAAAH7AwIAAAAB_AMgAAAAAf0DIAAAAAH-AwAA1QcAIP8DQAAAAAGABEAAAAABAgAAACkAIA8AAIUKACADAAAAJwAgDwAAhQoAIBAAAIkKACAoAAAAJwAgCAAAiQoAICAAAOoGACAiAADrBgAgIwAAvggAICUAAO0GACAmAADuBgAgJwAA7wYAICgAAPAGACApAADxBgAgLAAA8gYAIPcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIf8CAQDiBQAhoAMgAPQFACHfAwIA-AUAIeYDAQDiBQAh6wMBAOIFACHsAwEA5AUAIe0DAQDiBQAh7gMBAOQFACHvAwEA5AUAIfADAQDiBQAh8QMAAOMGACDyAwIA-AUAIfMDAgDkBgAh9AMAAOUGACD1AwAA5gYAIPYDAgDkBgAh9wMIAOcGACH4AwgA5wYAIfkDCADnBgAh-gMgAPQFACH7AwIA-AUAIfwDIAD0BQAh_QMgAPQFACH-AwAA6AYAIP8DQAD2BQAhgARAAPYFACEmIAAA6gYAICIAAOsGACAjAAC-CAAgJQAA7QYAICYAAO4GACAnAADvBgAgKAAA8AYAICkAAPEGACAsAADyBgAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAh_wIBAOIFACGgAyAA9AUAId8DAgD4BQAh5gMBAOIFACHrAwEA4gUAIewDAQDkBQAh7QMBAOIFACHuAwEA5AUAIe8DAQDkBQAh8AMBAOIFACHxAwAA4wYAIPIDAgD4BQAh8wMCAOQGACH0AwAA5QYAIPUDAADmBgAg9gMCAOQGACH3AwgA5wYAIfgDCADnBgAh-QMIAOcGACH6AyAA9AUAIfsDAgD4BQAh_AMgAPQFACH9AyAA9AUAIf4DAADoBgAg_wNAAPYFACGABEAA9gUAISYgAADWBwAgIgAA1wcAICMAAL8IACAkAADYBwAgJQAA2QcAICcAANsHACAoAADcBwAgKQAA3QcAICwAAN4HACD3AgEAAAAB-wJAAAAAAfwCQAAAAAH_AgEAAAABoAMgAAAAAd8DAgAAAAHmAwEAAAAB6wMBAAAAAewDAQAAAAHtAwEAAAAB7gMBAAAAAe8DAQAAAAHwAwEAAAAB8QMAANIHACDyAwIAAAAB8wMCAAAAAfQDAADTBwAg9QMAANQHACD2AwIAAAAB9wMIAAAAAfgDCAAAAAH5AwgAAAAB-gMgAAAAAfsDAgAAAAH8AyAAAAAB_QMgAAAAAf4DAADVBwAg_wNAAAAAAYAEQAAAAAECAAAAKQAgDwAAigoAIAMAAAAnACAPAACKCgAgEAAAjgoAICgAAAAnACAIAACOCgAgIAAA6gYAICIAAOsGACAjAAC-CAAgJAAA7AYAICUAAO0GACAnAADvBgAgKAAA8AYAICkAAPEGACAsAADyBgAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAh_wIBAOIFACGgAyAA9AUAId8DAgD4BQAh5gMBAOIFACHrAwEA4gUAIewDAQDkBQAh7QMBAOIFACHuAwEA5AUAIe8DAQDkBQAh8AMBAOIFACHxAwAA4wYAIPIDAgD4BQAh8wMCAOQGACH0AwAA5QYAIPUDAADmBgAg9gMCAOQGACH3AwgA5wYAIfgDCADnBgAh-QMIAOcGACH6AyAA9AUAIfsDAgD4BQAh_AMgAPQFACH9AyAA9AUAIf4DAADoBgAg_wNAAPYFACGABEAA9gUAISYgAADqBgAgIgAA6wYAICMAAL4IACAkAADsBgAgJQAA7QYAICcAAO8GACAoAADwBgAgKQAA8QYAICwAAPIGACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH_AgEA4gUAIaADIAD0BQAh3wMCAPgFACHmAwEA4gUAIesDAQDiBQAh7AMBAOQFACHtAwEA4gUAIe4DAQDkBQAh7wMBAOQFACHwAwEA4gUAIfEDAADjBgAg8gMCAPgFACHzAwIA5AYAIfQDAADlBgAg9QMAAOYGACD2AwIA5AYAIfcDCADnBgAh-AMIAOcGACH5AwgA5wYAIfoDIAD0BQAh-wMCAPgFACH8AyAA9AUAIf0DIAD0BQAh_gMAAOgGACD_A0AA9gUAIYAEQAD2BQAhJiAAANYHACAiAADXBwAgIwAAvwgAICQAANgHACAmAADaBwAgJwAA2wcAICgAANwHACApAADdBwAgLAAA3gcAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAf8CAQAAAAGgAyAAAAAB3wMCAAAAAeYDAQAAAAHrAwEAAAAB7AMBAAAAAe0DAQAAAAHuAwEAAAAB7wMBAAAAAfADAQAAAAHxAwAA0gcAIPIDAgAAAAHzAwIAAAAB9AMAANMHACD1AwAA1AcAIPYDAgAAAAH3AwgAAAAB-AMIAAAAAfkDCAAAAAH6AyAAAAAB-wMCAAAAAfwDIAAAAAH9AyAAAAAB_gMAANUHACD_A0AAAAABgARAAAAAAQIAAAApACAPAACPCgAgAwAAACcAIA8AAI8KACAQAACTCgAgKAAAACcAIAgAAJMKACAgAADqBgAgIgAA6wYAICMAAL4IACAkAADsBgAgJgAA7gYAICcAAO8GACAoAADwBgAgKQAA8QYAICwAAPIGACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH_AgEA4gUAIaADIAD0BQAh3wMCAPgFACHmAwEA4gUAIesDAQDiBQAh7AMBAOQFACHtAwEA4gUAIe4DAQDkBQAh7wMBAOQFACHwAwEA4gUAIfEDAADjBgAg8gMCAPgFACHzAwIA5AYAIfQDAADlBgAg9QMAAOYGACD2AwIA5AYAIfcDCADnBgAh-AMIAOcGACH5AwgA5wYAIfoDIAD0BQAh-wMCAPgFACH8AyAA9AUAIf0DIAD0BQAh_gMAAOgGACD_A0AA9gUAIYAEQAD2BQAhJiAAAOoGACAiAADrBgAgIwAAvggAICQAAOwGACAmAADuBgAgJwAA7wYAICgAAPAGACApAADxBgAgLAAA8gYAIPcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIf8CAQDiBQAhoAMgAPQFACHfAwIA-AUAIeYDAQDiBQAh6wMBAOIFACHsAwEA5AUAIe0DAQDiBQAh7gMBAOQFACHvAwEA5AUAIfADAQDiBQAh8QMAAOMGACDyAwIA-AUAIfMDAgDkBgAh9AMAAOUGACD1AwAA5gYAIPYDAgDkBgAh9wMIAOcGACH4AwgA5wYAIfkDCADnBgAh-gMgAPQFACH7AwIA-AUAIfwDIAD0BQAh_QMgAPQFACH-AwAA6AYAIP8DQAD2BQAhgARAAPYFACEkGgAA_gcAIB0AAPoHACAhAAD7BwAgKQAA_wcAICsAAP0HACD3AgEAAAAB-wJAAAAAAfwCQAAAAAH-AgEAAAABjgMBAAAAAZADAAAAkAMCkQMBAAAAAZIDAQAAAAGTAwEAAAABlAMBAAAAAZUDIAAAAAGWAwEAAAABlwMBAAAAAZgDAQAAAAGZAwEAAAABmgMBAAAAAZwDAAAAnAMCnQMBAAAAAZ4DAQAAAAGfA0AAAAABoAMgAAAAAaEDAQAAAAGiAwEAAAABowMBAAAAAaQDAQAAAAGlAxAAAAABpgNAAAAAAacDEAAAAAGoAwIAAAABqQMQAAAAAaoDEAAAAAECAAAAkQQAIA8AAJQKACADAAAAcAAgDwAAlAoAIBAAAJgKACAmAAAAcAAgCAAAmAoAIBoAAP0FACAdAAD5BQAgIQAA-gUAICkAAP4FACArAAD8BQAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAh_gIBAOIFACGOAwEA4gUAIZADAADzBZADIpEDAQDiBQAhkgMBAOQFACGTAwEA5AUAIZQDAQDkBQAhlQMgAPQFACGWAwEA4gUAIZcDAQDiBQAhmAMBAOIFACGZAwEA5AUAIZoDAQDiBQAhnAMAAPUFnAMinQMBAOQFACGeAwEA5AUAIZ8DQAD2BQAhoAMgAPQFACGhAwEA5AUAIaIDAQDkBQAhowMBAOQFACGkAwEA4gUAIaUDEAD3BQAhpgNAAPYFACGnAxAA9wUAIagDAgD4BQAhqQMQAPcFACGqAxAA9wUAISQaAAD9BQAgHQAA-QUAICEAAPoFACApAAD-BQAgKwAA_AUAIPcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIf4CAQDiBQAhjgMBAOIFACGQAwAA8wWQAyKRAwEA4gUAIZIDAQDkBQAhkwMBAOQFACGUAwEA5AUAIZUDIAD0BQAhlgMBAOIFACGXAwEA4gUAIZgDAQDiBQAhmQMBAOQFACGaAwEA4gUAIZwDAAD1BZwDIp0DAQDkBQAhngMBAOQFACGfA0AA9gUAIaADIAD0BQAhoQMBAOQFACGiAwEA5AUAIaMDAQDkBQAhpAMBAOIFACGlAxAA9wUAIaYDQAD2BQAhpwMQAPcFACGoAwIA-AUAIakDEAD3BQAhqgMQAPcFACEcHAAA1QYAICMAAJsIACArAADWBgAgLAAA1wYAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAf8CAQAAAAGvAwEAAAABuAMAAADJAwLTAwEAAAAB1QMAAADVAwLWAwEAAAAB1wMBAAAAAdgDAQAAAAHZAwEAAAAB2gMBAAAAAdsDAQAAAAHcAwEAAAAB3QMBAAAAAd4DEAAAAAHfAxAAAAAB4AMQAAAAAeEDEAAAAAHiA0AAAAAB4wNAAAAAAeQDQAAAAAHlA0AAAAABAgAAAGMAIA8AAJkKACADAAAAYQAgDwAAmQoAIBAAAJ0KACAeAAAAYQAgCAAAnQoAIBwAAKoGACAjAACaCAAgKwAAqwYAICwAAKwGACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH_AgEA4gUAIa8DAQDiBQAhuAMAAKgGyQMi0wMBAOIFACHVAwAApwbVAyLWAwEA5AUAIdcDAQDkBQAh2AMBAOIFACHZAwEA5AUAIdoDAQDkBQAh2wMBAOQFACHcAwEA5AUAId0DAQDkBQAh3gMQAPcFACHfAxAA9wUAIeADEAD3BQAh4QMQAPcFACHiA0AA9gUAIeMDQAD2BQAh5ANAAPYFACHlA0AA9gUAIRwcAACqBgAgIwAAmggAICsAAKsGACAsAACsBgAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAh_wIBAOIFACGvAwEA4gUAIbgDAACoBskDItMDAQDiBQAh1QMAAKcG1QMi1gMBAOQFACHXAwEA5AUAIdgDAQDiBQAh2QMBAOQFACHaAwEA5AUAIdsDAQDkBQAh3AMBAOQFACHdAwEA5AUAId4DEAD3BQAh3wMQAPcFACHgAxAA9wUAIeEDEAD3BQAh4gNAAPYFACHjA0AA9gUAIeQDQAD2BQAh5QNAAPYFACETGwAAwgkAICkAAMcJACArAADFCQAgLgAAxAkAIC8AAMMJACAxAADICQAg9wIBAAAAAfsCQAAAAAH8AkAAAAABkQMBAAAAAbgDAAAAnAQC5gMBAAAAAZcEAQAAAAGYBCAAAAABmQQBAAAAAZoEAAAAzAMCnAQgAAAAAZ0EIAAAAAGeBEAAAAABAgAAABoAIA8AAJ4KACANGgAA0AgAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAf4CAQAAAAGRAwEAAAABlgMBAAAAAZgDAQAAAAGZAwEAAAABmgMBAAAAAYIEAQAAAAGDBBAAAAABhAQQAAAAAQIAAACdAgAgDwAAoAoAICYiAADXBwAgIwAAvwgAICQAANgHACAlAADZBwAgJgAA2gcAICcAANsHACAoAADcBwAgKQAA3QcAICwAAN4HACD3AgEAAAAB-wJAAAAAAfwCQAAAAAH_AgEAAAABoAMgAAAAAd8DAgAAAAHmAwEAAAAB6wMBAAAAAewDAQAAAAHtAwEAAAAB7gMBAAAAAe8DAQAAAAHwAwEAAAAB8QMAANIHACDyAwIAAAAB8wMCAAAAAfQDAADTBwAg9QMAANQHACD2AwIAAAAB9wMIAAAAAfgDCAAAAAH5AwgAAAAB-gMgAAAAAfsDAgAAAAH8AyAAAAAB_QMgAAAAAf4DAADVBwAg_wNAAAAAAYAEQAAAAAECAAAAKQAgDwAAogoAIAMAAAAnACAPAACiCgAgEAAApgoAICgAAAAnACAIAACmCgAgIgAA6wYAICMAAL4IACAkAADsBgAgJQAA7QYAICYAAO4GACAnAADvBgAgKAAA8AYAICkAAPEGACAsAADyBgAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAh_wIBAOIFACGgAyAA9AUAId8DAgD4BQAh5gMBAOIFACHrAwEA4gUAIewDAQDkBQAh7QMBAOIFACHuAwEA5AUAIe8DAQDkBQAh8AMBAOIFACHxAwAA4wYAIPIDAgD4BQAh8wMCAOQGACH0AwAA5QYAIPUDAADmBgAg9gMCAOQGACH3AwgA5wYAIfgDCADnBgAh-QMIAOcGACH6AyAA9AUAIfsDAgD4BQAh_AMgAPQFACH9AyAA9AUAIf4DAADoBgAg_wNAAPYFACGABEAA9gUAISYiAADrBgAgIwAAvggAICQAAOwGACAlAADtBgAgJgAA7gYAICcAAO8GACAoAADwBgAgKQAA8QYAICwAAPIGACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH_AgEA4gUAIaADIAD0BQAh3wMCAPgFACHmAwEA4gUAIesDAQDiBQAh7AMBAOQFACHtAwEA4gUAIe4DAQDkBQAh7wMBAOQFACHwAwEA4gUAIfEDAADjBgAg8gMCAPgFACHzAwIA5AYAIfQDAADlBgAg9QMAAOYGACD2AwIA5AYAIfcDCADnBgAh-AMIAOcGACH5AwgA5wYAIfoDIAD0BQAh-wMCAPgFACH8AyAA9AUAIf0DIAD0BQAh_gMAAOgGACD_A0AA9gUAIYAEQAD2BQAhCPcCAQAAAAH7AkAAAAAB_AJAAAAAAf0CAQAAAAHQAwIAAAAB0QMQAAAAAdIDEAAAAAGIBBAAAAABAwAAACAAIA8AAKAKACAQAACqCgAgDwAAACAAIAgAAKoKACAaAADHCAAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAh_gIBAOIFACGRAwEA4gUAIZYDAQDiBQAhmAMBAOIFACGZAwEA5AUAIZoDAQDiBQAhggQBAOIFACGDBBAAxQgAIYQEEADFCAAhDRoAAMcIACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH-AgEA4gUAIZEDAQDiBQAhlgMBAOIFACGYAwEA4gUAIZkDAQDkBQAhmgMBAOIFACGCBAEA4gUAIYMEEADFCAAhhAQQAMUIACEI9wIBAAAAAfsCQAAAAAH8AkAAAAABrwMBAAAAAd4DEAAAAAHfAxAAAAAB4AMQAAAAAeEDEAAAAAEI9wIBAAAAAfsCQAAAAAH8AkAAAAABkwMBAAAAAaADIAAAAAHmAwEAAAABhQQBAAAAAYYEAgAAAAECAAAAhAIAIA8AAKwKACALHAAA-AcAICMAAM4IACD3AgEAAAAB-wJAAAAAAfwCQAAAAAH_AgEAAAABrwMBAAAAAd4DEAAAAAHfAxAAAAAB4AMQAAAAAeEDEAAAAAECAAAAJQAgDwAArgoAIAMAAAAiACAPAACuCgAgEAAAsgoAIA0AAAAiACAIAACyCgAgHAAA6gcAICMAAM0IACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH_AgEA4gUAIa8DAQDiBQAh3gMQAPcFACHfAxAA9wUAIeADEAD3BQAh4QMQAPcFACELHAAA6gcAICMAAM0IACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH_AgEA4gUAIa8DAQDiBQAh3gMQAPcFACHfAxAA9wUAIeADEAD3BQAh4QMQAPcFACEI9wIBAAAAAfsCQAAAAAH8AkAAAAAB0AMCAAAAAdEDEAAAAAHSAxAAAAABhwQBAAAAAYgEEAAAAAED9wIBAAAAAeYDAQAAAAHnAwIAAAABAvcCAQAAAAHmAwEAAAABAvcCAQAAAAHmAwEAAAABBPcCAQAAAAHmAwEAAAAB6QMgAAAAAeoDAgAAAAED9wIBAAAAAegDAQAAAAHpAyAAAAABCPcCAQAAAAH4AggAAAAB-QIBAAAAAfoCAADqBQAg-wJAAAAAAfwCQAAAAAH-AgEAAAAB_wIBAAAAARwcAADVBgAgIwAAmwgAICsAANYGACAtAADYBgAg9wIBAAAAAfsCQAAAAAH8AkAAAAAB_wIBAAAAAa8DAQAAAAG4AwAAAMkDAtMDAQAAAAHVAwAAANUDAtYDAQAAAAHXAwEAAAAB2AMBAAAAAdkDAQAAAAHaAwEAAAAB2wMBAAAAAdwDAQAAAAHdAwEAAAAB3gMQAAAAAd8DEAAAAAHgAxAAAAAB4QMQAAAAAeIDQAAAAAHjA0AAAAAB5ANAAAAAAeUDQAAAAAECAAAAYwAgDwAAugoAIAMAAABhACAPAAC6CgAgEAAAvgoAIB4AAABhACAIAAC-CgAgHAAAqgYAICMAAJoIACArAACrBgAgLQAArQYAIPcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIf8CAQDiBQAhrwMBAOIFACG4AwAAqAbJAyLTAwEA4gUAIdUDAACnBtUDItYDAQDkBQAh1wMBAOQFACHYAwEA4gUAIdkDAQDkBQAh2gMBAOQFACHbAwEA5AUAIdwDAQDkBQAh3QMBAOQFACHeAxAA9wUAId8DEAD3BQAh4AMQAPcFACHhAxAA9wUAIeIDQAD2BQAh4wNAAPYFACHkA0AA9gUAIeUDQAD2BQAhHBwAAKoGACAjAACaCAAgKwAAqwYAIC0AAK0GACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH_AgEA4gUAIa8DAQDiBQAhuAMAAKgGyQMi0wMBAOIFACHVAwAApwbVAyLWAwEA5AUAIdcDAQDkBQAh2AMBAOIFACHZAwEA5AUAIdoDAQDkBQAh2wMBAOQFACHcAwEA5AUAId0DAQDkBQAh3gMQAPcFACHfAxAA9wUAIeADEAD3BQAh4QMQAPcFACHiA0AA9gUAIeMDQAD2BQAh5ANAAPYFACHlA0AA9gUAIQn3AgEAAAAB-wJAAAAAAa4DAQAAAAHNAwEAAAABzgMBAAAAAc8DAQAAAAHQAwIAAAAB0QMQAAAAAdIDEAAAAAEDAAAAhwIAIA8AAKwKACAQAADCCgAgCgAAAIcCACAIAADCCgAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAhkwMBAOIFACGgAyAA9AUAIeYDAQDiBQAhhQQBAOIFACGGBAIA-AUAIQj3AgEA4gUAIfsCQADmBQAh_AJAAOYFACGTAwEA4gUAIaADIAD0BQAh5gMBAOIFACGFBAEA4gUAIYYEAgD4BQAhHPcCAQAAAAH7AkAAAAAB_AJAAAAAAaADIAAAAAHfAwIAAAAB5gMBAAAAAesDAQAAAAHsAwEAAAAB7QMBAAAAAe4DAQAAAAHvAwEAAAAB8AMBAAAAAfEDAADSBwAg8gMCAAAAAfMDAgAAAAH0AwAA0wcAIPUDAADUBwAg9gMCAAAAAfcDCAAAAAH4AwgAAAAB-QMIAAAAAfoDIAAAAAH7AwIAAAAB_AMgAAAAAf0DIAAAAAH-AwAA1QcAIP8DQAAAAAGABEAAAAABExsAAMIJACApAADHCQAgKwAAxQkAIC8AAMMJACAwAADGCQAgMQAAyAkAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAZEDAQAAAAG4AwAAAJwEAuYDAQAAAAGXBAEAAAABmAQgAAAAAZkEAQAAAAGaBAAAAMwDApwEIAAAAAGdBCAAAAABngRAAAAAAQIAAAAaACAPAADECgAgJBoAAP4HACAdAAD6BwAgIQAA-wcAICkAAP8HACAuAAD8BwAg9wIBAAAAAfsCQAAAAAH8AkAAAAAB_gIBAAAAAY4DAQAAAAGQAwAAAJADApEDAQAAAAGSAwEAAAABkwMBAAAAAZQDAQAAAAGVAyAAAAABlgMBAAAAAZcDAQAAAAGYAwEAAAABmQMBAAAAAZoDAQAAAAGcAwAAAJwDAp0DAQAAAAGeAwEAAAABnwNAAAAAAaADIAAAAAGhAwEAAAABogMBAAAAAaMDAQAAAAGkAwEAAAABpQMQAAAAAaYDQAAAAAGnAxAAAAABqAMCAAAAAakDEAAAAAGqAxAAAAABAgAAAJEEACAPAADGCgAgAwAAAHAAIA8AAMYKACAQAADKCgAgJgAAAHAAIAgAAMoKACAaAAD9BQAgHQAA-QUAICEAAPoFACApAAD-BQAgLgAA-wUAIPcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIf4CAQDiBQAhjgMBAOIFACGQAwAA8wWQAyKRAwEA4gUAIZIDAQDkBQAhkwMBAOQFACGUAwEA5AUAIZUDIAD0BQAhlgMBAOIFACGXAwEA4gUAIZgDAQDiBQAhmQMBAOQFACGaAwEA4gUAIZwDAAD1BZwDIp0DAQDkBQAhngMBAOQFACGfA0AA9gUAIaADIAD0BQAhoQMBAOQFACGiAwEA5AUAIaMDAQDkBQAhpAMBAOIFACGlAxAA9wUAIaYDQAD2BQAhpwMQAPcFACGoAwIA-AUAIakDEAD3BQAhqgMQAPcFACEkGgAA_QUAIB0AAPkFACAhAAD6BQAgKQAA_gUAIC4AAPsFACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH-AgEA4gUAIY4DAQDiBQAhkAMAAPMFkAMikQMBAOIFACGSAwEA5AUAIZMDAQDkBQAhlAMBAOQFACGVAyAA9AUAIZYDAQDiBQAhlwMBAOIFACGYAwEA4gUAIZkDAQDkBQAhmgMBAOIFACGcAwAA9QWcAyKdAwEA5AUAIZ4DAQDkBQAhnwNAAPYFACGgAyAA9AUAIaEDAQDkBQAhogMBAOQFACGjAwEA5AUAIaQDAQDiBQAhpQMQAPcFACGmA0AA9gUAIacDEAD3BQAhqAMCAPgFACGpAxAA9wUAIaoDEAD3BQAhFfcCAQAAAAH7AkAAAAAB_AJAAAAAAf8CAQAAAAGvAwEAAAABsAMQAAAAAbEDEAAAAAGyAxAAAAABswMQAAAAAbQDAQAAAAG1AwEAAAABtgMBAAAAAbgDAAAAuAMCuQOAAAAAAboDQAAAAAG7A0AAAAABvANAAAAAAb0DQAAAAAG-AwEAAAABvwMBAAAAAcEDAAAAwQMCJiAAANYHACAiAADXBwAgIwAAvwgAICQAANgHACAlAADZBwAgJgAA2gcAICcAANsHACAoAADcBwAgKQAA3QcAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAf8CAQAAAAGgAyAAAAAB3wMCAAAAAeYDAQAAAAHrAwEAAAAB7AMBAAAAAe0DAQAAAAHuAwEAAAAB7wMBAAAAAfADAQAAAAHxAwAA0gcAIPIDAgAAAAHzAwIAAAAB9AMAANMHACD1AwAA1AcAIPYDAgAAAAH3AwgAAAAB-AMIAAAAAfkDCAAAAAH6AyAAAAAB-wMCAAAAAfwDIAAAAAH9AyAAAAAB_gMAANUHACD_A0AAAAABgARAAAAAAQIAAAApACAPAADMCgAgAwAAACcAIA8AAMwKACAQAADQCgAgKAAAACcAIAgAANAKACAgAADqBgAgIgAA6wYAICMAAL4IACAkAADsBgAgJQAA7QYAICYAAO4GACAnAADvBgAgKAAA8AYAICkAAPEGACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH_AgEA4gUAIaADIAD0BQAh3wMCAPgFACHmAwEA4gUAIesDAQDiBQAh7AMBAOQFACHtAwEA4gUAIe4DAQDkBQAh7wMBAOQFACHwAwEA4gUAIfEDAADjBgAg8gMCAPgFACHzAwIA5AYAIfQDAADlBgAg9QMAAOYGACD2AwIA5AYAIfcDCADnBgAh-AMIAOcGACH5AwgA5wYAIfoDIAD0BQAh-wMCAPgFACH8AyAA9AUAIf0DIAD0BQAh_gMAAOgGACD_A0AA9gUAIYAEQAD2BQAhJiAAAOoGACAiAADrBgAgIwAAvggAICQAAOwGACAlAADtBgAgJgAA7gYAICcAAO8GACAoAADwBgAgKQAA8QYAIPcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIf8CAQDiBQAhoAMgAPQFACHfAwIA-AUAIeYDAQDiBQAh6wMBAOIFACHsAwEA5AUAIe0DAQDiBQAh7gMBAOQFACHvAwEA5AUAIfADAQDiBQAh8QMAAOMGACDyAwIA-AUAIfMDAgDkBgAh9AMAAOUGACD1AwAA5gYAIPYDAgDkBgAh9wMIAOcGACH4AwgA5wYAIfkDCADnBgAh-gMgAPQFACH7AwIA-AUAIfwDIAD0BQAh_QMgAPQFACH-AwAA6AYAIP8DQAD2BQAhgARAAPYFACEJ9wIBAAAAAfsCQAAAAAH9AgEAAAABzQMBAAAAAc4DAQAAAAHPAwEAAAAB0AMCAAAAAdEDEAAAAAHSAxAAAAABBvcCAQAAAAH7AkAAAAABuAMAAADJAwLJAwEAAAABygMBAAAAAcwDAAAAzAMDAwAAAH0AIA8AAMQKACAQAADVCgAgFQAAAH0AIAgAANUKACAbAAD-CAAgKQAAgwkAICsAAIEJACAvAAD_CAAgMAAAggkAIDEAAIQJACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACGRAwEA5AUAIbgDAAD9CJwEIuYDAQDiBQAhlwQBAOIFACGYBCAA9AUAIZkEAQDkBQAhmgQAAPwIzAMinAQgAPQFACGdBCAA9AUAIZ4EQAD2BQAhExsAAP4IACApAACDCQAgKwAAgQkAIC8AAP8IACAwAACCCQAgMQAAhAkAIPcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIZEDAQDkBQAhuAMAAP0InAQi5gMBAOIFACGXBAEA4gUAIZgEIAD0BQAhmQQBAOQFACGaBAAA_AjMAyKcBCAA9AUAIZ0EIAD0BQAhngRAAPYFACEX9wIBAAAAAfsCQAAAAAH8AkAAAAABrwMBAAAAAbgDAAAAyQMC0wMBAAAAAdUDAAAA1QMC1gMBAAAAAdcDAQAAAAHYAwEAAAAB2QMBAAAAAdoDAQAAAAHbAwEAAAAB3AMBAAAAAd0DAQAAAAHeAxAAAAAB3wMQAAAAAeADEAAAAAHhAxAAAAAB4gNAAAAAAeMDQAAAAAHkA0AAAAAB5QNAAAAAARwcAADVBgAgIwAAmwgAICwAANcGACAtAADYBgAg9wIBAAAAAfsCQAAAAAH8AkAAAAAB_wIBAAAAAa8DAQAAAAG4AwAAAMkDAtMDAQAAAAHVAwAAANUDAtYDAQAAAAHXAwEAAAAB2AMBAAAAAdkDAQAAAAHaAwEAAAAB2wMBAAAAAdwDAQAAAAHdAwEAAAAB3gMQAAAAAd8DEAAAAAHgAxAAAAAB4QMQAAAAAeIDQAAAAAHjA0AAAAAB5ANAAAAAAeUDQAAAAAECAAAAYwAgDwAA1woAIBMbAADCCQAgKQAAxwkAIC4AAMQJACAvAADDCQAgMAAAxgkAIDEAAMgJACD3AgEAAAAB-wJAAAAAAfwCQAAAAAGRAwEAAAABuAMAAACcBALmAwEAAAABlwQBAAAAAZgEIAAAAAGZBAEAAAABmgQAAADMAwKcBCAAAAABnQQgAAAAAZ4EQAAAAAECAAAAGgAgDwAA2QoAIAMAAABhACAPAADXCgAgEAAA3QoAIB4AAABhACAIAADdCgAgHAAAqgYAICMAAJoIACAsAACsBgAgLQAArQYAIPcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIf8CAQDiBQAhrwMBAOIFACG4AwAAqAbJAyLTAwEA4gUAIdUDAACnBtUDItYDAQDkBQAh1wMBAOQFACHYAwEA4gUAIdkDAQDkBQAh2gMBAOQFACHbAwEA5AUAIdwDAQDkBQAh3QMBAOQFACHeAxAA9wUAId8DEAD3BQAh4AMQAPcFACHhAxAA9wUAIeIDQAD2BQAh4wNAAPYFACHkA0AA9gUAIeUDQAD2BQAhHBwAAKoGACAjAACaCAAgLAAArAYAIC0AAK0GACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACH_AgEA4gUAIa8DAQDiBQAhuAMAAKgGyQMi0wMBAOIFACHVAwAApwbVAyLWAwEA5AUAIdcDAQDkBQAh2AMBAOIFACHZAwEA5AUAIdoDAQDkBQAh2wMBAOQFACHcAwEA5AUAId0DAQDkBQAh3gMQAPcFACHfAxAA9wUAIeADEAD3BQAh4QMQAPcFACHiA0AA9gUAIeMDQAD2BQAh5ANAAPYFACHlA0AA9gUAIQMAAAB9ACAPAADZCgAgEAAA4AoAIBUAAAB9ACAIAADgCgAgGwAA_ggAICkAAIMJACAuAACACQAgLwAA_wgAIDAAAIIJACAxAACECQAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAhkQMBAOQFACG4AwAA_QicBCLmAwEA4gUAIZcEAQDiBQAhmAQgAPQFACGZBAEA5AUAIZoEAAD8CMwDIpwEIAD0BQAhnQQgAPQFACGeBEAA9gUAIRMbAAD-CAAgKQAAgwkAIC4AAIAJACAvAAD_CAAgMAAAggkAIDEAAIQJACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACGRAwEA5AUAIbgDAAD9CJwEIuYDAQDiBQAhlwQBAOIFACGYBCAA9AUAIZkEAQDkBQAhmgQAAPwIzAMinAQgAPQFACGdBCAA9AUAIZ4EQAD2BQAhFfcCAQAAAAH7AkAAAAAB_AJAAAAAAa4DAQAAAAGvAwEAAAABsAMQAAAAAbEDEAAAAAGyAxAAAAABswMQAAAAAbQDAQAAAAG1AwEAAAABtgMBAAAAAbgDAAAAuAMCuQOAAAAAAboDQAAAAAG7A0AAAAABvANAAAAAAb0DQAAAAAG-AwEAAAABvwMBAAAAAcEDAAAAwQMCCPcCAQAAAAH4AggAAAAB-QIBAAAAAfoCAADqBQAg-wJAAAAAAfwCQAAAAAH9AgEAAAAB_gIBAAAAAQMAAAB9ACAPAACeCgAgEAAA5QoAIBUAAAB9ACAIAADlCgAgGwAA_ggAICkAAIMJACArAACBCQAgLgAAgAkAIC8AAP8IACAxAACECQAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAhkQMBAOQFACG4AwAA_QicBCLmAwEA4gUAIZcEAQDiBQAhmAQgAPQFACGZBAEA5AUAIZoEAAD8CMwDIpwEIAD0BQAhnQQgAPQFACGeBEAA9gUAIRMbAAD-CAAgKQAAgwkAICsAAIEJACAuAACACQAgLwAA_wgAIDEAAIQJACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACGRAwEA5AUAIbgDAAD9CJwEIuYDAQDiBQAhlwQBAOIFACGYBCAA9AUAIZkEAQDkBQAhmgQAAPwIzAMinAQgAPQFACGdBCAA9AUAIZ4EQAD2BQAhExsAAMIJACArAADFCQAgLgAAxAkAIC8AAMMJACAwAADGCQAgMQAAyAkAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAZEDAQAAAAG4AwAAAJwEAuYDAQAAAAGXBAEAAAABmAQgAAAAAZkEAQAAAAGaBAAAAMwDApwEIAAAAAGdBCAAAAABngRAAAAAAQIAAAAaACAPAADmCgAgJBoAAP4HACAdAAD6BwAgIQAA-wcAICsAAP0HACAuAAD8BwAg9wIBAAAAAfsCQAAAAAH8AkAAAAAB_gIBAAAAAY4DAQAAAAGQAwAAAJADApEDAQAAAAGSAwEAAAABkwMBAAAAAZQDAQAAAAGVAyAAAAABlgMBAAAAAZcDAQAAAAGYAwEAAAABmQMBAAAAAZoDAQAAAAGcAwAAAJwDAp0DAQAAAAGeAwEAAAABnwNAAAAAAaADIAAAAAGhAwEAAAABogMBAAAAAaMDAQAAAAGkAwEAAAABpQMQAAAAAaYDQAAAAAGnAxAAAAABqAMCAAAAAakDEAAAAAGqAxAAAAABAgAAAJEEACAPAADoCgAgJiAAANYHACAiAADXBwAgIwAAvwgAICQAANgHACAlAADZBwAgJgAA2gcAICcAANsHACAoAADcBwAgLAAA3gcAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAf8CAQAAAAGgAyAAAAAB3wMCAAAAAeYDAQAAAAHrAwEAAAAB7AMBAAAAAe0DAQAAAAHuAwEAAAAB7wMBAAAAAfADAQAAAAHxAwAA0gcAIPIDAgAAAAHzAwIAAAAB9AMAANMHACD1AwAA1AcAIPYDAgAAAAH3AwgAAAAB-AMIAAAAAfkDCAAAAAH6AyAAAAAB-wMCAAAAAfwDIAAAAAH9AyAAAAAB_gMAANUHACD_A0AAAAABgARAAAAAAQIAAAApACAPAADqCgAgAwAAAH0AIA8AAOYKACAQAADuCgAgFQAAAH0AIAgAAO4KACAbAAD-CAAgKwAAgQkAIC4AAIAJACAvAAD_CAAgMAAAggkAIDEAAIQJACD3AgEA4gUAIfsCQADmBQAh_AJAAOYFACGRAwEA5AUAIbgDAAD9CJwEIuYDAQDiBQAhlwQBAOIFACGYBCAA9AUAIZkEAQDkBQAhmgQAAPwIzAMinAQgAPQFACGdBCAA9AUAIZ4EQAD2BQAhExsAAP4IACArAACBCQAgLgAAgAkAIC8AAP8IACAwAACCCQAgMQAAhAkAIPcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIZEDAQDkBQAhuAMAAP0InAQi5gMBAOIFACGXBAEA4gUAIZgEIAD0BQAhmQQBAOQFACGaBAAA_AjMAyKcBCAA9AUAIZ0EIAD0BQAhngRAAPYFACEDAAAAcAAgDwAA6AoAIBAAAPEKACAmAAAAcAAgCAAA8QoAIBoAAP0FACAdAAD5BQAgIQAA-gUAICsAAPwFACAuAAD7BQAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAh_gIBAOIFACGOAwEA4gUAIZADAADzBZADIpEDAQDiBQAhkgMBAOQFACGTAwEA5AUAIZQDAQDkBQAhlQMgAPQFACGWAwEA4gUAIZcDAQDiBQAhmAMBAOIFACGZAwEA5AUAIZoDAQDiBQAhnAMAAPUFnAMinQMBAOQFACGeAwEA5AUAIZ8DQAD2BQAhoAMgAPQFACGhAwEA5AUAIaIDAQDkBQAhowMBAOQFACGkAwEA4gUAIaUDEAD3BQAhpgNAAPYFACGnAxAA9wUAIagDAgD4BQAhqQMQAPcFACGqAxAA9wUAISQaAAD9BQAgHQAA-QUAICEAAPoFACArAAD8BQAgLgAA-wUAIPcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIf4CAQDiBQAhjgMBAOIFACGQAwAA8wWQAyKRAwEA4gUAIZIDAQDkBQAhkwMBAOQFACGUAwEA5AUAIZUDIAD0BQAhlgMBAOIFACGXAwEA4gUAIZgDAQDiBQAhmQMBAOQFACGaAwEA4gUAIZwDAAD1BZwDIp0DAQDkBQAhngMBAOQFACGfA0AA9gUAIaADIAD0BQAhoQMBAOQFACGiAwEA5AUAIaMDAQDkBQAhpAMBAOIFACGlAxAA9wUAIaYDQAD2BQAhpwMQAPcFACGoAwIA-AUAIakDEAD3BQAhqgMQAPcFACEDAAAAJwAgDwAA6goAIBAAAPQKACAoAAAAJwAgCAAA9AoAICAAAOoGACAiAADrBgAgIwAAvggAICQAAOwGACAlAADtBgAgJgAA7gYAICcAAO8GACAoAADwBgAgLAAA8gYAIPcCAQDiBQAh-wJAAOYFACH8AkAA5gUAIf8CAQDiBQAhoAMgAPQFACHfAwIA-AUAIeYDAQDiBQAh6wMBAOIFACHsAwEA5AUAIe0DAQDiBQAh7gMBAOQFACHvAwEA5AUAIfADAQDiBQAh8QMAAOMGACDyAwIA-AUAIfMDAgDkBgAh9AMAAOUGACD1AwAA5gYAIPYDAgDkBgAh9wMIAOcGACH4AwgA5wYAIfkDCADnBgAh-gMgAPQFACH7AwIA-AUAIfwDIAD0BQAh_QMgAPQFACH-AwAA6AYAIP8DQAD2BQAhgARAAPYFACEmIAAA6gYAICIAAOsGACAjAAC-CAAgJAAA7AYAICUAAO0GACAmAADuBgAgJwAA7wYAICgAAPAGACAsAADyBgAg9wIBAOIFACH7AkAA5gUAIfwCQADmBQAh_wIBAOIFACGgAyAA9AUAId8DAgD4BQAh5gMBAOIFACHrAwEA4gUAIewDAQDkBQAh7QMBAOIFACHuAwEA5AUAIe8DAQDkBQAh8AMBAOIFACHxAwAA4wYAIPIDAgD4BQAh8wMCAOQGACH0AwAA5QYAIPUDAADmBgAg9gMCAOQGACH3AwgA5wYAIfgDCADnBgAh-QMIAOcGACH6AyAA9AUAIfsDAgD4BQAh_AMgAPQFACH9AyAA9AUAIf4DAADoBgAg_wNAAPYFACGABEAA9gUAIQAAAAADFQAGFgAHFwAIAAAAAxUABhYABxcACAgVACIbHwspchgrbxsubhovIQwwcQ4xdiEBGgAKAhoACh4jDQQVACAcAAwgbBAjAA4HFQAfGgAKHSYNISoPKWYYK2UbLmQaCxUAHiAuECIAESMADiQ0EyU4FCY8FSdAFihEFylIGCxMGQIeAA0fAA8CFQASIS8PASEwAAEfAA8BHwAPAR8ADwEfAA8BHwAPAxoACh8ADyMADgIfAA8qABoGFQAdHAAKIwAOK1AbLFEZLVUcAxwACiMADioAGgEqABoDK1YALFcALVgACCBZACRaACVbACZcACddACheAClfACxgAAUdZwAhaAApawAragAuaQABIG0AARoACgUbdwApegAreQAueAAxewAAAAMVACYWACcXACgAAAADFQAmFgAnFwAoARoACgEaAAoDFQAtFgAuFwAvAAAAAxUALRYALhcALwEaAAoBGgAKAxUANBYANRcANgAAAAMVADQWADUXADYAAAADFQA8FgA9FwA-AAAAAxUAPBYAPRcAPgIcAAwjAA4CHAAMIwAOBRUAQxYARhcAR4ABAESBAQBFAAAAAAAFFQBDFgBGFwBHgAEARIEBAEUCHgANHwAPAh4ADR8ADwUVAEwWAE8XAFCAAQBNgQEATgAAAAAABRUATBYATxcAUIABAE2BAQBOAAAFFQBVFgBYFwBZgAEAVoEBAFcAAAAAAAUVAFUWAFgXAFmAAQBWgQEAVwEaAAoBGgAKBRUAXhYAYRcAYoABAF-BAQBgAAAAAAAFFQBeFgBhFwBigAEAX4EBAGACIgARIwAOAiIAESMADgUVAGcWAGoXAGuAAQBogQEAaQAAAAAABRUAZxYAahcAa4ABAGiBAQBpAR8ADwEfAA8FFQBwFgBzFwB0gAEAcYEBAHIAAAAAAAUVAHAWAHMXAHSAAQBxgQEAcgEfAA8BHwAPAxUAeRYAehcAewAAAAMVAHkWAHoXAHsBHwAPAR8ADwUVAIABFgCDARcAhAGAAQCBAYEBAIIBAAAAAAAFFQCAARYAgwEXAIQBgAEAgQGBAQCCAQEfAA8BHwAPAxUAiQEWAIoBFwCLAQAAAAMVAIkBFgCKARcAiwEBHwAPAR8ADwMVAJABFgCRARcAkgEAAAADFQCQARYAkQEXAJIBAhwACiMADgIcAAojAA4FFQCXARYAmgEXAJsBgAEAmAGBAQCZAQAAAAAABRUAlwEWAJoBFwCbAYABAJgBgQEAmQECHwAPKgAaAh8ADyoAGgUVAKABFgCjARcApAGAAQChAYEBAKIBAAAAAAAFFQCgARYAowEXAKQBgAEAoQGBAQCiAQEqABoBKgAaAxUAqQEWAKoBFwCrAQAAAAMVAKkBFgCqARcAqwEDHAAKIwAOKgAaAxwACiMADioAGgUVALABFgCzARcAtAGAAQCxAYEBALIBAAAAAAAFFQCwARYAswEXALQBgAEAsQGBAQCyAQEaAAoBGgAKBRUAuQEWALwBFwC9AYABALoBgQEAuwEAAAAAAAUVALkBFgC8ARcAvQGAAQC6AYEBALsBAxoACh8ADyMADgMaAAofAA8jAA4FFQDCARYAxQEXAMYBgAEAwwGBAQDEAQAAAAAABRUAwgEWAMUBFwDGAYABAMMBgQEAxAEBAgECAwEFBgEGBwEHCAEJCgEKDAILDQMMDwENEQIOEgQREwESFAETFQIYGAUZGQkyGwozfAo0fwo1gAEKNoEBCjeDAQo4hQECOYYBIzqIAQo7igECPIsBJD2MAQo-jQEKP44BAkCRASVBkgEpQpMBIUOUASFElQEhRZYBIUaXASFHmQEhSJsBAkmcASpKngEhS6ABAkyhAStNogEhTqMBIU-kAQJQpwEsUagBMFKpAQtTqgELVKsBC1WsAQtWrQELV68BC1ixAQJZsgExWrQBC1u2AQJctwEyXbgBC165AQtfugECYL0BM2G-ATdiwAE4Y8EBOGTEAThlxQE4ZsYBOGfIAThoygECacsBOWrNAThrzwECbNABOm3RAThu0gE4b9MBAnDWATtx1wE_ctgBDXPZAQ102gENddsBDXbcAQ133gENeOABAnnhAUB64wENe-UBAnzmAUF95wENfugBDX_pAQKCAewBQoMB7QFIhAHuARCFAe8BEIYB8AEQhwHxARCIAfIBEIkB9AEQigH2AQKLAfcBSYwB-QEQjQH7AQKOAfwBSo8B_QEQkAH-ARCRAf8BApIBggJLkwGDAlGUAYUCEZUBhgIRlgGJAhGXAYoCEZgBiwIRmQGNAhGaAY8CApsBkAJSnAGSAhGdAZQCAp4BlQJTnwGWAhGgAZcCEaEBmAICogGbAlSjAZwCWqQBngIMpQGfAgymAaECDKcBogIMqAGjAgypAaUCDKoBpwICqwGoAlusAaoCDK0BrAICrgGtAlyvAa4CDLABrwIMsQGwAgKyAbMCXbMBtAJjtAG1Ag-1AbYCD7YBtwIPtwG4Ag-4AbkCD7kBuwIPugG9AgK7Ab4CZLwBwAIPvQHCAgK-AcMCZb8BxAIPwAHFAg_BAcYCAsIByQJmwwHKAmzEAcsCFsUBzAIWxgHNAhbHAc4CFsgBzwIWyQHRAhbKAdMCAssB1AJtzAHWAhbNAdgCAs4B2QJuzwHaAhbQAdsCFtEB3AIC0gHfAm_TAeACddQB4QIX1QHiAhfWAeMCF9cB5AIX2AHlAhfZAecCF9oB6QIC2wHqAnbcAewCF90B7gIC3gHvAnffAfACF-AB8QIX4QHyAgLiAfUCeOMB9gJ85AH3AhPlAfgCE-YB-QIT5wH6AhPoAfsCE-kB_QIT6gH_AgLrAYADfewBggMT7QGEAwLuAYUDfu8BhgMT8AGHAxPxAYgDAvIBiwN_8wGMA4UB9AGNAxX1AY4DFfYBjwMV9wGQAxX4AZEDFfkBkwMV-gGVAwL7AZYDhgH8AZgDFf0BmgMC_gGbA4cB_wGcAxWAAp0DFYECngMCggKhA4gBgwKiA4wBhAKjAxSFAqQDFIYCpQMUhwKmAxSIAqcDFIkCqQMUigKrAwKLAqwDjQGMAq4DFI0CsAMCjgKxA44BjwKyAxSQArMDFJECtAMCkgK3A48BkwK4A5MBlAK5AxqVAroDGpYCuwMalwK8AxqYAr0DGpkCvwMamgLBAwKbAsIDlAGcAsQDGp0CxgMCngLHA5UBnwLIAxqgAskDGqECygMCogLNA5YBowLOA5wBpALPAxmlAtADGaYC0QMZpwLSAxmoAtMDGakC1QMZqgLXAwKrAtgDnQGsAtoDGa0C3AMCrgLdA54BrwLeAxmwAt8DGbEC4AMCsgLjA58BswLkA6UBtALlAxy1AuYDHLYC5wMctwLoAxy4AukDHLkC6wMcugLtAwK7Au4DpgG8AvADHL0C8gMCvgLzA6cBvwL0AxzAAvUDHMEC9gMCwgL5A6gBwwL6A6wBxAL7AxvFAvwDG8YC_QMbxwL-AxvIAv8DG8kCgQQbygKDBALLAoQErQHMAoYEG80CiAQCzgKJBK4BzwKKBBvQAosEG9ECjAQC0gKPBK8B0wKQBLUB1AKSBA7VApMEDtYClQQO1wKWBA7YApcEDtkCmQQO2gKbBALbApwEtgHcAp4EDt0CoAQC3gKhBLcB3wKiBA7gAqMEDuECpAQC4gKnBLgB4wKoBL4B5AKpBBjlAqoEGOYCqwQY5wKsBBjoAq0EGOkCrwQY6gKxBALrArIEvwHsArQEGO0CtgQC7gK3BMAB7wK4BBjwArkEGPECugQC8gK9BMEB8wK-BMcB"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AddressScalarFieldEnum: () => AddressScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CartItemScalarFieldEnum: () => CartItemScalarFieldEnum,
  CartScalarFieldEnum: () => CartScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  CustomerProfileScalarFieldEnum: () => CustomerProfileScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  MealAddOnScalarFieldEnum: () => MealAddOnScalarFieldEnum,
  MealIngredientScalarFieldEnum: () => MealIngredientScalarFieldEnum,
  MealRemoveOptionScalarFieldEnum: () => MealRemoveOptionScalarFieldEnum,
  MealScalarFieldEnum: () => MealScalarFieldEnum,
  MealSizeScalarFieldEnum: () => MealSizeScalarFieldEnum,
  MealSpiceLevelScalarFieldEnum: () => MealSpiceLevelScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  OrderItemScalarFieldEnum: () => OrderItemScalarFieldEnum,
  OrderScalarFieldEnum: () => OrderScalarFieldEnum,
  OrderStatusHistoryScalarFieldEnum: () => OrderStatusHistoryScalarFieldEnum,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProviderProfileScalarFieldEnum: () => ProviderProfileScalarFieldEnum,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.6.0",
  engine: "75cbdc1eb7150937890ad5465d861175c6624711"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Address: "Address",
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Cart: "Cart",
  CartItem: "CartItem",
  Category: "Category",
  CustomerProfile: "CustomerProfile",
  Meal: "Meal",
  MealSize: "MealSize",
  MealSpiceLevel: "MealSpiceLevel",
  MealAddOn: "MealAddOn",
  MealRemoveOption: "MealRemoveOption",
  MealIngredient: "MealIngredient",
  Order: "Order",
  OrderItem: "OrderItem",
  OrderStatusHistory: "OrderStatusHistory",
  Payment: "Payment",
  ProviderProfile: "ProviderProfile",
  Review: "Review"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var AddressScalarFieldEnum = {
  id: "id",
  city: "city",
  street: "street",
  houseNumber: "houseNumber",
  apartment: "apartment",
  postalCode: "postalCode",
  label: "label",
  isDefault: "isDefault",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  role: "role",
  status: "status",
  phone: "phone",
  needPasswordChange: "needPasswordChange",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CartScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  providerId: "providerId",
  subtotal: "subtotal",
  deliveryFee: "deliveryFee",
  discountAmount: "discountAmount",
  totalAmount: "totalAmount",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CartItemScalarFieldEnum = {
  id: "id",
  cartId: "cartId",
  mealId: "mealId",
  quantity: "quantity",
  baseUnitPrice: "baseUnitPrice",
  unitPrice: "unitPrice",
  totalPrice: "totalPrice",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  imageURL: "imageURL",
  displayOrder: "displayOrder",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CustomerProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  phone: "phone",
  city: "city",
  streetAddress: "streetAddress",
  houseNumber: "houseNumber",
  apartment: "apartment",
  postalCode: "postalCode",
  latitude: "latitude",
  longitude: "longitude",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MealScalarFieldEnum = {
  id: "id",
  providerId: "providerId",
  categoryId: "categoryId",
  name: "name",
  subcategory: "subcategory",
  shortDescription: "shortDescription",
  fullDescription: "fullDescription",
  portionSize: "portionSize",
  mainImageURL: "mainImageURL",
  galleryImageURLs: "galleryImageURLs",
  basePrice: "basePrice",
  discountPrice: "discountPrice",
  dietaryPreferences: "dietaryPreferences",
  allergens: "allergens",
  calories: "calories",
  protein: "protein",
  fat: "fat",
  carbohydrates: "carbohydrates",
  isAvailable: "isAvailable",
  isActive: "isActive",
  preparationTimeMinutes: "preparationTimeMinutes",
  isBestseller: "isBestseller",
  isFeatured: "isFeatured",
  tags: "tags",
  deliveryFee: "deliveryFee",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  discountEndDate: "discountEndDate",
  discountStartDate: "discountStartDate"
};
var MealSizeScalarFieldEnum = {
  id: "id",
  mealId: "mealId",
  name: "name",
  extraPrice: "extraPrice",
  isDefault: "isDefault"
};
var MealSpiceLevelScalarFieldEnum = {
  id: "id",
  mealId: "mealId",
  level: "level",
  isDefault: "isDefault"
};
var MealAddOnScalarFieldEnum = {
  id: "id",
  mealId: "mealId",
  name: "name",
  price: "price"
};
var MealRemoveOptionScalarFieldEnum = {
  id: "id",
  mealId: "mealId",
  name: "name"
};
var MealIngredientScalarFieldEnum = {
  id: "id",
  mealId: "mealId",
  name: "name"
};
var OrderScalarFieldEnum = {
  id: "id",
  orderNumber: "orderNumber",
  customerId: "customerId",
  providerId: "providerId",
  paymentMethod: "paymentMethod",
  status: "status",
  customerName: "customerName",
  customerPhone: "customerPhone",
  deliveryCity: "deliveryCity",
  deliveryStreetAddress: "deliveryStreetAddress",
  deliveryPostalCode: "deliveryPostalCode",
  deliveryApartment: "deliveryApartment",
  deliveryHouseNumber: "deliveryHouseNumber",
  deliveryNote: "deliveryNote",
  subtotal: "subtotal",
  deliveryFee: "deliveryFee",
  discountAmount: "discountAmount",
  totalAmount: "totalAmount",
  placedAt: "placedAt",
  acceptedAt: "acceptedAt",
  deliveredAt: "deliveredAt",
  cancelledAt: "cancelledAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderItemScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  mealId: "mealId",
  mealName: "mealName",
  mealSlug: "mealSlug",
  mealImageUrl: "mealImageUrl",
  quantity: "quantity",
  unitPrice: "unitPrice",
  totalPrice: "totalPrice",
  createdAt: "createdAt"
};
var OrderStatusHistoryScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  status: "status",
  note: "note",
  changedByUserId: "changedByUserId",
  changedByRole: "changedByRole",
  createdAt: "createdAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  customerId: "customerId",
  providerId: "providerId",
  amount: "amount",
  platformFeePercent: "platformFeePercent",
  platformFeeAmount: "platformFeeAmount",
  providerShareAmount: "providerShareAmount",
  transactionId: "transactionId",
  stripeEventId: "stripeEventId",
  gatewayName: "gatewayName",
  status: "status",
  paymentGatewayData: "paymentGatewayData",
  paidAt: "paidAt",
  failedAt: "failedAt",
  refundedAt: "refundedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  providerSettledAt: "providerSettledAt",
  providerSettledBy: "providerSettledBy",
  providerSettlementNote: "providerSettlementNote",
  providerSettlementStatus: "providerSettlementStatus"
};
var ProviderProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  businessName: "businessName",
  businessCategory: "businessCategory",
  phone: "phone",
  bio: "bio",
  imageURL: "imageURL",
  binNumber: "binNumber",
  binVerified: "binVerified",
  city: "city",
  street: "street",
  houseNumber: "houseNumber",
  apartment: "apartment",
  postalCode: "postalCode",
  approvalStatus: "approvalStatus",
  rejectionReason: "rejectionReason",
  reviewedBy: "reviewedBy",
  reviewedAt: "reviewedAt",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  businessKitchenURL: "businessKitchenURL",
  businessMainGateURL: "businessMainGateURL",
  nidImageFront_and_BackURL: "nidImageFront_and_BackURL",
  businessEmail: "businessEmail",
  currentPayableAmount: "currentPayableAmount",
  lastPaymentAt: "lastPaymentAt",
  totalGrossRevenue: "totalGrossRevenue",
  totalOrdersCompleted: "totalOrdersCompleted",
  totalPlatformFee: "totalPlatformFee",
  totalProviderEarning: "totalProviderEarning"
};
var ReviewScalarFieldEnum = {
  id: "id",
  rating: "rating",
  feedback: "feedback",
  images: "images",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  mealId: "mealId",
  userId: "userId",
  providerId: "providerId"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var UserRole = {
  CUSTOMER: "CUSTOMER",
  PROVIDER: "PROVIDER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN"
};
var userAccountStatus = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/errors/AppError.ts
var AppError = class extends Error {
  statusCode;
  isOperational;
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
};
var BadRequestError = class extends AppError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
};
var UnauthorizedError = class extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
};
var ForbiddenError = class extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
};
var NotFoundError = class extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
};
var ConflictError = class extends AppError {
  constructor(message = "Resource conflict") {
    super(message, 409);
  }
};
var UnprocessableError = class extends AppError {
  constructor(message) {
    super(message, 422);
  }
};

// src/utils/errorFormatter.ts
var formatZodError = (error) => {
  return error.issues.map((issue) => {
    const formattedIssue = {
      message: issue.message,
      code: issue.code
    };
    if (issue.path.length > 0) {
      formattedIssue.field = issue.path.join(".");
    }
    return formattedIssue;
  });
};
var formatPrismaValidationError = (error) => {
  return [
    {
      message: error.message,
      code: "PRISMA_VALIDATION_ERROR"
    }
  ];
};
var formatPrismaClientRequestError = (error) => {
  const errorSource = {
    message: error.message,
    code: error.code
  };
  if (Array.isArray(error.meta?.target)) {
    errorSource.field = error.meta.target.join(".");
  } else if (typeof error.meta?.target === "string") {
    errorSource.field = error.meta.target;
  }
  switch (error.code) {
    case "P2002":
      return [
        {
          ...errorSource,
          message: `Duplicate value for ${errorSource.field || "unique field"}`
        }
      ];
    case "P2025":
      return [
        {
          ...errorSource,
          message: "Requested record was not found"
        }
      ];
    case "P2003":
      return [
        {
          ...errorSource,
          message: `Foreign key constraint failed on ${errorSource.field || "related field"}`
        }
      ];
    case "P2000":
      return [
        {
          ...errorSource,
          message: `Value too long for ${errorSource.field || "field"}`
        }
      ];
    case "P2021":
      return [
        {
          ...errorSource,
          message: "Table does not exist in the database"
        }
      ];
    case "P2022":
      return [
        {
          ...errorSource,
          message: "Column does not exist in the database"
        }
      ];
    default:
      return [errorSource];
  }
};
var formatPrismaClientInitError = (error) => {
  return [
    {
      message: error.message,
      code: "PRISMA_CONNECTION_ERROR"
    }
  ];
};
var formatPrismaClientRuntimeError = (error) => {
  return [
    {
      message: error.message,
      code: error instanceof prismaNamespace_exports.PrismaClientRustPanicError ? "PRISMA_RUST_PANIC" : "PRISMA_UNKNOWN_REQUEST_ERROR"
    }
  ];
};
var formatGenericError = (error) => {
  return [
    {
      message: error.message || "Something went wrong",
      code: error.name || "GENERIC_ERROR"
    }
  ];
};
var createErrorResponse = (message, errorSource, err, isDevelopment2 = false) => {
  const response = {
    success: false,
    message,
    errorSource
  };
  if (isDevelopment2 && err) {
    const debug = {
      name: err.name,
      message: err.message
    };
    if (err.stack) {
      debug.stack = err.stack;
    }
    response.debug = debug;
  }
  return response;
};

// src/config/index.ts
import dotenv from "dotenv";
import path2 from "path";
dotenv.config({ path: path2.join(process.cwd(), ".env") });
var envConfig = {
  NODE_ENV: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5e3,
  // bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUND),
  database_url: process.env.DATABASE_URL,
  BACKEND_LOCAL_HOST: process.env.BACKEND_LOCAL_HOST,
  frontend_local_host: process.env.FRONTEND_LOCAL_HOST,
  frontend_production_host: process.env.FRONTEND_PRODUCTION_HOST,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL,
  CLAUDINARY_CLOUD_NAME: process.env.CLAUDINARY_CLOUD_NAME,
  CLAUDINARY_API_KEY: process.env.CLAUDINARY_API_KEY,
  CLAUDINARY_API_SECRET: process.env.CLAUDINARY_API_SECRET,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: Number(process.env.SMTP_PORT) || 2525,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM,
  SUPER_ADMIN_NAME: process.env.SUPER_ADMIN_NAME,
  SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
  ADMIN_NAME: process.env.ADMIN_NAME,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  SSLCOMMERZ_API: process.env.SSLCOMMERZ_API,
  SSLCOMMERZ_VALIDATION_API: process.env.SSLCOMMERZ_VALIDATION_API,
  SSLCOMMERZ_STORE_ID: process.env.SSLCOMMERZ_STORE_ID,
  SSLCOMMERZ_STORE_PASSWORD: process.env.SSLCOMMERZ_STORE_PASSWORD,
  SSLCOMMERZ_IS_LIVE: process.env.SSLCOMMERZ_IS_LIVE === "true",
  SSLCOMMERZ_IPN_URL: process.env.SSLCOMMERZ_IPN_URL,
  SSLCOMMERZ_SUCCESS_URL: process.env.SSLCOMMERZ_SUCCESS_URL,
  SSLCOMMERZ_FAIL_URL: process.env.SSLCOMMERZ_FAIL_URL,
  SSLCOMMERZ_CANCEL_URL: process.env.SSLCOMMERZ_CANCEL_URL
  // RESEND_API_KEY: process.env.RESEND_API_KEY as string,
  // EMAIL_FROM: process.env.EMAIL_FROM as string,
  // jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  // jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  // jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  // jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  // stripe_secret_key: process.env.STRIPE_SECRET_KEY,
};
var config_default = envConfig;

// src/utils/errorLogger.ts
var sendToSlack = async (payload) => {
  try {
    const slackWebhookUrl = config_default.SLACK_WEBHOOK_URL;
    if (!slackWebhookUrl) {
      console.warn("SLACK_WEBHOOK_URL is not configured");
      return;
    }
    const message = {
      text: `\u{1F6A8} Server Error Occurred`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "\u{1F6A8} Server Error Alert"
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Error Type:*
${payload.errorType}`
            },
            {
              type: "mrkdwn",
              text: `*Status Code:*
${payload.statusCode}`
            },
            {
              type: "mrkdwn",
              text: `*Message:*
${payload.message}`
            },
            {
              type: "mrkdwn",
              text: `*Timestamp:*
${payload.timestamp}`
            }
          ]
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Request Info:*
${payload.method} ${payload.url}

*Stack Trace:*
\`\`\`${payload.stack || "N/A"}\`\`\``
          }
        }
      ]
    };
    await fetch(slackWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    });
  } catch (error) {
    console.error("Failed to send error to Slack:", error);
  }
};
var logErrorToConsole = (error, isDevelopment2) => {
  if (!isDevelopment2) return;
  console.error("=".repeat(80));
  console.error("ERROR:", error.message);
  console.error("STACK:", error.stack);
  console.error("=".repeat(80));
};

// src/middlewares/globalErrorHandler.ts
var isDevelopment = process.env.NODE_ENV === "development";
var globalErrorHandler = (err, req, res, _next) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errorSource = [
    {
      message: "Something went wrong",
      code: "INTERNAL_SERVER_ERROR"
    }
  ];
  logErrorToConsole(err, isDevelopment);
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errorSource = formatZodError(err);
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSource = [
      {
        message: err.message,
        code: err.constructor.name
      }
    ];
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    message = "Database Validation Error";
    errorSource = formatPrismaValidationError(err);
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    errorSource = formatPrismaClientRequestError(err);
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        message = "Resource already exists";
        break;
      case "P2025":
        statusCode = 404;
        message = "Resource not found";
        break;
      case "P2003":
        statusCode = 409;
        message = "Foreign key constraint failed";
        break;
      case "P2021":
      case "P2022":
      case "P2024":
        statusCode = 500;
        message = "Database Operation Error";
        break;
      default:
        statusCode = 400;
        message = "Database Operation Error";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    statusCode = 500;
    message = "Database Connection Error";
    errorSource = formatPrismaClientInitError(err);
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError || err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = 500;
    message = "Database Runtime Error";
    errorSource = formatPrismaClientRuntimeError(err);
  } else if (err instanceof SyntaxError) {
    statusCode = 400;
    message = "Invalid Request Format";
    errorSource = formatGenericError(err);
  } else if (err instanceof Error) {
    statusCode = 500;
    message = "Internal Server Error";
    errorSource = formatGenericError(err);
  }
  const errorResponse = createErrorResponse(
    message,
    errorSource,
    err instanceof Error ? err : void 0,
    isDevelopment
  );
  if (!isDevelopment && statusCode >= 500) {
    const slackPayload = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      errorType: err instanceof Error ? err.name : "UnknownError",
      statusCode,
      message,
      url: req.originalUrl,
      method: req.method
    };
    if (err instanceof Error && err.stack) {
      slackPayload.stack = err.stack;
    }
    sendToSlack(slackPayload).catch((slackError) => {
      console.error("Failed to send to Slack:", slackError);
    });
  }
  res.status(statusCode).json(errorResponse);
};
var globalErrorHandler_default = globalErrorHandler;

// src/middlewares/notFoundHandler.ts
var notFoundHandler = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found!`, 404);
  next(error);
};
var notFoundHandler_default = notFoundHandler;

// src/routes/index.ts
import { Router as Router10 } from "express";

// src/modules/auth/auth.route.ts
import { Router } from "express";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import { emailOTP } from "better-auth/plugins";

// src/utils/email.utils.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: config_default.SMTP_HOST,
  port: config_default.SMTP_PORT,
  secure: config_default.SMTP_PORT === 465,
  // true for 465, false for 587
  auth: {
    user: config_default.SMTP_USER,
    pass: config_default.SMTP_PASS
  }
});
transporter.verify((error) => {
  if (error) {
    console.warn("[Email] SMTP connection failed:", error.message);
  } else {
    console.log("[Email] SMTP connected via Gmail.");
  }
});
var sendEmail = async (options) => {
  try {
    await transporter.sendMail({
      from: `"Platera" <${config_default.SMTP_FROM}>`,
      to: options.to,
      subject: options.subject,
      html: options.html
    });
    console.log(
      `[Email] Sent to ${options.to} \u2014 "${options.subject}"`
    );
  } catch (error) {
    console.error(
      `[Email] Failed to send to ${options.to}:`,
      error
    );
  }
};

// src/utils/emailTemplates.utils.ts
var emailTemplates = {
  providerRegistered: (name) => ({
    subject: "Welcome to Platera \u2014 Please verify your email",
    html: `
      <h2>Hi ${name},</h2>
      <p>Thank you for creating a Platera provider account.</p>
      <p>Please verify your email address to continue.
         After verification, log in and complete your 
         provider profile to request approval.</p>
      <p>\u2014 The Platera Team</p>
    `
  }),
  providerProfileApproved: (name) => ({
    subject: "Your Platera provider profile is approved!",
    html: `
      <h2>Congratulations ${name}!</h2>
      <p>Your provider profile has been approved by our team.</p>
      <p>You can now log in and start listing your meals.</p>
      <a href="${config_default.frontend_local_host}/provider-dashboard/profile">
        Go to your dashboard
      </a>
      <p>\u2014 The Platera Team</p>
    `
  }),
  providerProfileRejected: (name, reason) => ({
    subject: "Update on your Platera provider profile",
    html: `
      <h2>Hi ${name},</h2>
      <p>Unfortunately we could not approve your provider 
         profile at this time.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>You can log in, update your profile based on the 
         feedback above, and resubmit for approval.</p>
      <a href="${config_default.frontend_local_host}/provider-dashboard/profile">
        Update your profile
      </a>
      <p>\u2014 The Platera Team</p>
    `
  }),
  adminProviderApprovalRequest: (data) => ({
    subject: "New provider approval request",
    html: `
      <h2>Provider Approval Request</h2>

      <p><strong>Provider Name:</strong> ${data.providerName}</p>
      <p><strong>Provider Email:</strong> ${data.providerEmail}</p>
      <p><strong>Provider Phone:</strong> ${data.providerPhone ?? "N/A"}</p>

      <hr />

      <p><strong>Business Name:</strong> ${data.businessName}</p>
      <p><strong>Business Type:</strong> ${data.businessCategory}</p>
      <p><strong>Business Email:</strong> ${data.businessEmail}</p>
      <p><strong>BIN:</strong> ${data.binNumber ?? "N/A"}</p>

      <hr />

      <p><strong>District:</strong> ${data.city}</p>
      <p><strong>Street:</strong> ${data.street}</p>
      <p><strong>House Number:</strong> ${data.houseNumber}</p>
      <p><strong>Apartment:</strong> ${data.apartment ?? "N/A"}</p>
      <p><strong>Postal Code:</strong> ${data.postalCode}</p>

      <br />

      <a href="${config_default.frontend_local_host}/admin-dashboard/provider-request">
        Review in admin panel
      </a>
    `
  }),
  emailVerificationOTP: (name, otp) => ({
    subject: "Verify your Platera account",
    html: `
      <div style="font-family: Arial, sans-serif; color:#111;">
        <h2>Hi ${name},</h2>
        <p>Welcome to <strong>Platera</strong> \u{1F37D}\uFE0F</p>
        <p>Use the code below to verify your email:</p>

        <div style="
          margin: 24px 0;
          padding: 16px;
          font-size: 32px;
          font-weight: 700;
          letter-spacing: 6px;
          text-align:center;
          background:#FFF7EA;
          color:#D99017;
          border-radius:12px;
        ">
          ${otp}
        </div>

        <p>This code will expire in 2 minutes.</p>
        <p>If you didn\u2019t request this, ignore this email.</p>

        <p>\u2014 Platera Team</p>
      </div>
    `
  })
};
var sendProviderApprovedEmail = async (name, email) => {
  const template = emailTemplates.providerProfileApproved(name);
  await sendEmail({ to: email, ...template });
};
var sendProviderRejectedEmail = async (name, email, reason) => {
  const template = emailTemplates.providerProfileRejected(name, reason);
  await sendEmail({ to: email, ...template });
};
var sendAdminApprovalRequestEmail = async (adminEmail, data) => {
  const template = emailTemplates.adminProviderApprovalRequest(data);
  await sendEmail({ to: adminEmail, ...template });
};
var sendEmailVerificationOTP = async (name, email, otp) => {
  const template = emailTemplates.emailVerificationOTP(name, otp);
  await sendEmail({ to: email, ...template });
};

// src/lib/auth.ts
var auth = betterAuth({
  baseURL: config_default.BETTER_AUTH_URL,
  basePath: "/api/auth",
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5
    }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true
  },
  trustedOrigins: [
    config_default.frontend_local_host,
    "http://localhost:5000",
    "http://localhost:3000"
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: UserRole.CUSTOMER,
        input: false
        // never accept from client, I will set it in the code
      },
      status: {
        type: "string",
        required: true,
        defaultValue: userAccountStatus.ACTIVE,
        input: false
        // never accept from client, I will set it in the code
      },
      phone: {
        type: "string",
        required: false,
        input: true
      },
      needPasswordChange: {
        type: "boolean",
        required: false,
        defaultValue: false
      },
      isDeleted: {
        type: "boolean",
        required: false,
        defaultValue: false
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null
      }
    }
  },
  plugins: [
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });
          if (user && !user.emailVerified) {
            const name = user.name;
            await sendEmailVerificationOTP(name, email, otp);
          }
        }
      },
      expiresIn: 2 * 60
    })
  ],
  databaseHooks: {
    user: {
      create: {
        before: async (user, context) => {
          const intendedRole = context?.headers?.get("x-intended-role") || "CUSTOMER";
          return {
            data: {
              ...user,
              role: intendedRole
            }
          };
        }
      }
    }
  }
});

// src/modules/auth/auth.service.ts
import status from "http-status";
var getMe = async (userId) => {
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      status: true,
      isDeleted: true,
      emailVerified: true
    }
  });
  return userData;
};
var sessionCheck = async (user) => {
  let hasProviderProfile = false;
  let providerProfileStatus = null;
  if (user.role === "PROVIDER") {
    const profile = await prisma.providerProfile.findUnique({
      where: { userId: user.id },
      select: { approvalStatus: true }
    });
    if (profile) {
      hasProviderProfile = true;
      providerProfileStatus = profile.approvalStatus;
    }
  }
  return {
    isAuthenticated: true,
    user: {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name
    },
    hasProviderProfile,
    providerProfileStatus
  };
};
var registerCustomer = async (payload) => {
  const { name, email, password } = payload;
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, isDeleted: true }
  });
  if (existingUser) {
    if (existingUser.isDeleted) {
      throw new ForbiddenError(
        "This email is associated with a deleted account. Please contact support."
      );
    }
    throw new ConflictError("An account with this email already exists.");
  }
  const result = await auth.api.signUpEmail({
    body: { name, email, password },
    headers: new Headers({ "x-intended-role": "CUSTOMER" })
  });
  if (!result.user) {
    throw new BadRequestError("Failed to create your account.");
  }
  return result.user;
};
var registerProvider = async (payload) => {
  const { name, email, password } = payload;
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, isDeleted: true }
  });
  if (existingUser) {
    if (existingUser.isDeleted) {
      throw new ForbiddenError(
        "This email is associated with a deleted account. Please contact support."
      );
    }
    throw new ConflictError("An account with this email already exists.");
  }
  const result = await auth.api.signUpEmail({
    body: { name, email, password },
    headers: new Headers({ "x-intended-role": "PROVIDER" })
  });
  if (!result.user) {
    throw new BadRequestError("Failed to create provider account.");
  }
  return result.user;
};
var loginUser = async (payload, headers) => {
  const { email, password } = payload;
  const { headers: responseHeaders, response } = await auth.api.signInEmail({
    body: {
      email,
      password
    },
    headers,
    returnHeaders: true
  });
  if (response.user.status === userAccountStatus.SUSPENDED) {
    throw new AppError(
      "User is suspended. Please contact support.",
      status.FORBIDDEN
    );
  }
  if (response.user.isDeleted) {
    throw new AppError(
      "This user account was deleted. Please contact support.",
      status.NOT_FOUND
    );
  }
  const hasProviderProfile = await prisma.providerProfile.findUnique({
    where: {
      userId: response.user.id
    },
    select: {
      id: true
    }
  });
  return {
    data: response,
    headers: responseHeaders,
    hasProviderProfile
  };
};
var verifyEmail = async (email, otp) => {
  const result = await auth.api.verifyEmailOTP({
    body: { email, otp }
  });
  if (result.status && !result.user.emailVerified) {
    await prisma.user.update({
      where: { email },
      data: { emailVerified: true }
    });
  }
};
var logoutUser = async (headers) => {
  return await auth.api.signOut({ headers, returnHeaders: true });
};
var AuthService = {
  registerCustomer,
  registerProvider,
  loginUser,
  getMe,
  sessionCheck,
  logoutUser,
  verifyEmail
};

// src/utils/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data
  });
};

// src/modules/auth/auth.controller.ts
import status2 from "http-status";
var getMe2 = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await AuthService.getMe(userId);
    return sendResponse(res, {
      httpStatusCode: status2.OK,
      success: true,
      message: "Your profile data fetched successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var sessionCheck2 = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    if (!session?.user) {
      sendResponse(res, {
        httpStatusCode: status2.OK,
        success: true,
        message: "No session.",
        data: null
      });
      return;
    }
    const user = session.user;
    const result = await AuthService.sessionCheck(user);
    sendResponse(res, {
      httpStatusCode: status2.OK,
      success: true,
      message: "Session found.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var registerCustomer2 = async (req, res, next) => {
  try {
    const payload = req.body;
    const result = await AuthService.registerCustomer(payload);
    sendResponse(res, {
      httpStatusCode: status2.CREATED,
      success: true,
      message: "Customer registered successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var registerProvider2 = async (req, res, next) => {
  try {
    const payload = req.body;
    const result = await AuthService.registerProvider(payload);
    sendResponse(res, {
      httpStatusCode: status2.CREATED,
      success: true,
      message: "Provider account created. Please check your email to verify your account.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var buildHeaders = (req) => {
  const headers = new Headers();
  const copy = (key) => {
    const val = req.headers[key];
    if (!val) return;
    if (Array.isArray(val)) {
      headers.set(key, val.join(", "));
    } else {
      headers.set(key, String(val));
    }
  };
  copy("cookie");
  copy("user-agent");
  copy("origin");
  copy("host");
  copy("x-forwarded-for");
  copy("x-forwarded-host");
  copy("x-forwarded-proto");
  return headers;
};
var loginUser2 = async (req, res, next) => {
  try {
    const payload = req.body;
    const result = await AuthService.loginUser(payload, buildHeaders(req));
    const setCookies = typeof result.headers.getSetCookie === "function" ? result.headers.getSetCookie() : (() => {
      const single = result.headers.get("set-cookie");
      return single ? [single] : [];
    })();
    for (const cookie of setCookies) {
      res.append("Set-Cookie", cookie);
    }
    sendResponse(res, {
      httpStatusCode: status2.OK,
      success: true,
      message: "Login successful.",
      data: {
        data: result.data,
        hasProviderProfile: result.hasProviderProfile
      }
    });
  } catch (error) {
    next(error);
  }
};
var verifyEmail2 = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    await AuthService.verifyEmail(email, otp);
    sendResponse(res, {
      httpStatusCode: status2.OK,
      success: true,
      message: "Email verified successfully"
    });
  } catch (error) {
    next(error);
  }
};
var logout = async (req, res, next) => {
  try {
    const result = await AuthService.logoutUser(buildHeaders(req));
    const setCookies = typeof result.headers.getSetCookie === "function" ? result.headers.getSetCookie() : (() => {
      const single = result.headers.get("set-cookie");
      return single ? [single] : [];
    })();
    for (const cookie of setCookies) {
      res.append("Set-Cookie", cookie);
    }
    return sendResponse(res, {
      httpStatusCode: status2.OK,
      success: true,
      message: "Logged out successfully",
      data: null
    });
  } catch (error) {
    next(error);
  }
};
var AuthController = {
  registerCustomer: registerCustomer2,
  registerProvider: registerProvider2,
  loginUser: loginUser2,
  getMe: getMe2,
  sessionCheck: sessionCheck2,
  verifyEmail: verifyEmail2,
  logout
};

// src/middlewares/validateRequest.ts
var JSON_FIELDS = [
  "sizes",
  "spiceLevels",
  "addOns",
  "removeOptions",
  "ingredients",
  "dietaryPreferences",
  "allergens",
  "tags",
  "galleryImageURLs"
];
var validateRequest = (schema) => {
  return (req, res, next) => {
    for (const field of JSON_FIELDS) {
      if (req.body[field] !== void 0 && typeof req.body[field] === "string") {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch {
        }
      }
    }
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(result.error);
      return;
    }
    req.body = result.data;
    next();
  };
};
var validateRequest_default = validateRequest;

// src/modules/auth/auth.validation.ts
import { z } from "zod";
var customerRegisterSchema = z.object({
  name: z.string().min(1, "Name is required.").min(2, "Name must be at least 2 characters.").max(50, "Name cannot exceed 50 characters."),
  email: z.email("Please provide a valid email address."),
  password: z.string().min(1, "Password is required.").min(8, "Password must be at least 8 characters.").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    "Password must contain uppercase, lowercase, number and special character."
  )
});
var providerRegisterSchema = z.object({
  name: z.string().min(1, "Name is required.").min(2, "Name must be at least 2 characters.").max(50, "Name cannot exceed 50 characters."),
  email: z.email("Please provide a valid email address."),
  password: z.string().min(1, "Password is required.").min(8, "Password must be at least 8 characters.").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    "Password must contain uppercase, lowercase, number and special character."
  )
});
var loginSchema = z.object({
  email: z.email("Please provide a valid email address."),
  password: z.string().min(1, "Password is required.")
});

// src/middlewares/auth.middleware.ts
var authMiddleware = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session?.user) {
        throw new UnauthorizedError(
          "You are not logged in. Please log in to continue."
        );
      }
      const { user } = session;
      const typedUser = user;
      if (typedUser.isDeleted) {
        throw new ForbiddenError(
          "This account no longer exists. Please contact support."
        );
      }
      if (typedUser.status === "SUSPENDED") {
        throw new ForbiddenError(
          "Your account has been suspended. Please contact support."
        );
      }
      if (roles.length > 0 && !roles.includes(typedUser.role)) {
        throw new ForbiddenError(
          "You do not have permission to access this resource."
        );
      }
      req.user = typedUser;
      req.session = session.session;
      next();
    } catch (error) {
      next(error);
    }
  };
};
var auth_middleware_default = authMiddleware;

// src/modules/auth/auth.route.ts
var router = Router();
router.get("/me", auth_middleware_default("CUSTOMER" /* CUSTOMER */, "PROVIDER" /* PROVIDER */, "ADMIN" /* ADMIN */, "SUPER_ADMIN" /* SUPER_ADMIN */), AuthController.getMe);
router.get("/session-check", AuthController.sessionCheck);
router.post(
  "/register-customer",
  validateRequest_default(customerRegisterSchema),
  AuthController.registerCustomer
);
router.post(
  "/register-provider",
  validateRequest_default(providerRegisterSchema),
  AuthController.registerProvider
);
router.post(
  "/login",
  validateRequest_default(loginSchema),
  AuthController.loginUser
);
router.post("/verify-email", AuthController.verifyEmail);
router.post("/logout", AuthController.logout);
var AuthRoutes = router;

// src/modules/provider/provider.routes.ts
import { Router as Router2 } from "express";

// src/config/claudinary.config.ts
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: config_default.CLAUDINARY_CLOUD_NAME,
  api_key: config_default.CLAUDINARY_API_KEY,
  api_secret: config_default.CLAUDINARY_API_SECRET
});
var claudinary_config_default = cloudinary;

// src/utils/claudinary.ts
var extractPublicId = (url) => {
  try {
    const urlParts = url.split("/");
    const uploadIndex = urlParts.indexOf("upload");
    if (uploadIndex === -1) return null;
    const afterUpload = urlParts.slice(uploadIndex + 1);
    const withoutVersion = afterUpload[0]?.startsWith("v") ? afterUpload.slice(1) : afterUpload;
    const publicIdWithExt = withoutVersion.join("/");
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");
    return publicId;
  } catch {
    return null;
  }
};
var deleteFromCloudinary = async (url) => {
  const publicId = extractPublicId(url);
  if (!publicId) {
    console.warn(
      `[Cloudinary] Could not extract public_id from URL: ${url}`
    );
    return;
  }
  try {
    await claudinary_config_default.uploader.destroy(publicId);
  } catch (error) {
    console.error(
      `[Cloudinary] Failed to delete image: ${publicId}`,
      error
    );
  }
};
var deleteMultipleFromCloudinary = async (urls) => {
  const validUrls = urls.filter(Boolean);
  if (validUrls.length === 0) return;
  await Promise.all(validUrls.map(deleteFromCloudinary));
};

// src/modules/provider/provider.service.ts
var getMyProfile = async (userId) => {
  const profile = await prisma.providerProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          emailVerified: true,
          status: true
        }
      }
    }
  });
  return profile;
};
var createProviderProfile = async (userId, payload, images) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      status: true,
      isDeleted: true,
      emailVerified: true
    }
  });
  const uploadedUrls = Object.values(images).filter(
    (v) => typeof v === "string"
  );
  const cleanupAndThrow = async (error) => {
    await deleteMultipleFromCloudinary(uploadedUrls);
    throw error;
  };
  if (!user) {
    return cleanupAndThrow(new NotFoundError("User not found."));
  }
  if (user.isDeleted) {
    return cleanupAndThrow(
      new ForbiddenError("This account has been deleted.")
    );
  }
  if (user.status === "SUSPENDED") {
    return cleanupAndThrow(
      new ForbiddenError(
        "Your account is suspended. Please contact support."
      )
    );
  }
  if (!user.emailVerified) {
    return cleanupAndThrow(
      new ForbiddenError(
        "Please verify your email address before creating your profile."
      )
    );
  }
  if (user.role !== "PROVIDER") {
    return cleanupAndThrow(
      new ForbiddenError(
        "Only provider accounts can create a provider profile."
      )
    );
  }
  const existingProfile = await prisma.providerProfile.findUnique({
    where: { userId },
    select: { id: true }
  });
  if (existingProfile) {
    return cleanupAndThrow(
      new ConflictError(
        "You already have a provider profile. Use the update endpoint instead."
      )
    );
  }
  const nidUrls = [
    images.nidImageFrontURL,
    images.nidImageBackURL
  ].filter((v) => typeof v === "string");
  const nidImageFront_and_BackURL = nidUrls.length > 0 ? JSON.stringify(nidUrls) : null;
  console.log(nidImageFront_and_BackURL);
  const createData = {
    user: { connect: { id: userId } },
    businessName: payload.businessName,
    businessCategory: payload.businessCategory,
    phone: payload.phone,
    businessEmail: payload.businessEmail,
    bio: payload.bio ?? null,
    binNumber: payload.binNumber ?? null,
    city: payload.city,
    street: payload.street,
    houseNumber: payload.houseNumber,
    apartment: payload.apartment ?? null,
    postalCode: payload.postalCode,
    nidImageFront_and_BackURL,
    businessMainGateURL: images.businessMainGateURL ?? null,
    businessKitchenURL: images.businessKitchenURL ?? null,
    imageURL: images.profileImageURL ?? null
  };
  const profile = await prisma.providerProfile.create({
    data: createData
  });
  return profile;
};
var updateProviderProfile = async (userId, payload, newImages) => {
  const profile = await prisma.providerProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      approvalStatus: true,
      businessCategory: true,
      nidImageFront_and_BackURL: true,
      businessMainGateURL: true,
      businessKitchenURL: true,
      imageURL: true
    }
  });
  const uploadedUrls = Object.values(newImages).filter(
    (v) => typeof v === "string"
  );
  if (!profile) {
    await deleteMultipleFromCloudinary(uploadedUrls);
    throw new NotFoundError(
      "Provider profile not found. Please create your profile first."
    );
  }
  const finalCategory = payload.businessCategory ?? profile.businessCategory;
  if (finalCategory === "RESTAURANT" && payload.binNumber !== void 0 && (payload.binNumber === null || payload.binNumber.trim() === "")) {
    await deleteMultipleFromCloudinary(uploadedUrls);
    throw new UnprocessableError(
      "BIN/Tax number is mandatory for Restaurant category."
    );
  }
  const shouldResetApproval = profile.approvalStatus === "APPROVED";
  const updateData = {};
  if (payload.businessName !== void 0) {
    updateData.businessName = payload.businessName;
  }
  if (payload.businessCategory !== void 0) {
    updateData.businessCategory = payload.businessCategory;
  }
  if (payload.phone !== void 0) {
    updateData.phone = payload.phone;
  }
  if (payload.city !== void 0) {
    updateData.city = payload.city;
  }
  if (payload.street !== void 0) {
    updateData.street = payload.street;
  }
  if (payload.houseNumber !== void 0) {
    updateData.houseNumber = payload.houseNumber;
  }
  if (payload.postalCode !== void 0) {
    updateData.postalCode = payload.postalCode;
  }
  if (payload.bio !== void 0) {
    updateData.bio = payload.bio ?? null;
  }
  if (payload.binNumber !== void 0) {
    updateData.binNumber = payload.binNumber ?? null;
  }
  if (payload.apartment !== void 0) {
    updateData.apartment = payload.apartment ?? null;
  }
  if (newImages.nidImageFrontURL !== void 0 || newImages.nidImageBackURL !== void 0) {
    const existingNids = profile.nidImageFront_and_BackURL ? JSON.parse(profile.nidImageFront_and_BackURL) : [];
    const updatedNids = [...existingNids];
    if (newImages.nidImageFrontURL !== void 0) {
      if (existingNids[0]) {
        await deleteFromCloudinary(existingNids[0]);
      }
      updatedNids[0] = newImages.nidImageFrontURL;
    }
    if (newImages.nidImageBackURL !== void 0) {
      if (existingNids[1]) {
        await deleteFromCloudinary(existingNids[1]);
      }
      updatedNids[1] = newImages.nidImageBackURL;
    }
    updateData.nidImageFront_and_BackURL = JSON.stringify(
      updatedNids.filter(Boolean)
    );
  }
  if (newImages.businessMainGateURL !== void 0) {
    if (profile.businessMainGateURL) {
      await deleteFromCloudinary(profile.businessMainGateURL);
    }
    updateData.businessMainGateURL = newImages.businessMainGateURL;
  }
  if (newImages.businessKitchenURL !== void 0) {
    if (profile.businessKitchenURL) {
      await deleteFromCloudinary(profile.businessKitchenURL);
    }
    updateData.businessKitchenURL = newImages.businessKitchenURL;
  }
  if (newImages.profileImageURL !== void 0) {
    if (profile.imageURL) {
      await deleteFromCloudinary(profile.imageURL);
    }
    updateData.imageURL = newImages.profileImageURL;
  }
  if (shouldResetApproval) {
    updateData.approvalStatus = "DRAFT";
    updateData.rejectionReason = null;
    updateData.reviewedBy = null;
    updateData.reviewedAt = null;
  }
  const updatedProfile = await prisma.providerProfile.update({
    where: { userId },
    data: updateData
  });
  return updatedProfile;
};
var deleteProviderImage = async (userId, imageType) => {
  const profile = await prisma.providerProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      approvalStatus: true,
      nidImageFront_and_BackURL: true,
      businessMainGateURL: true,
      businessKitchenURL: true,
      imageURL: true
    }
  });
  if (!profile) {
    throw new NotFoundError("Provider profile not found.");
  }
  const updateData = {};
  switch (imageType) {
    case "nidImageFront":
    case "nidImageBack": {
      const existingNids = profile.nidImageFront_and_BackURL ? JSON.parse(
        profile.nidImageFront_and_BackURL
      ) : [];
      const index = imageType === "nidImageFront" ? 0 : 1;
      const label = imageType === "nidImageFront" ? "front" : "back";
      if (!existingNids[index]) {
        throw new NotFoundError(`NID ${label} image not found.`);
      }
      await deleteFromCloudinary(existingNids[index]);
      existingNids[index] = "";
      const remaining = existingNids.filter(Boolean);
      updateData.nidImageFront_and_BackURL = remaining.length > 0 ? JSON.stringify(existingNids) : null;
      break;
    }
    case "businessMainGate": {
      if (!profile.businessMainGateURL) {
        throw new NotFoundError(
          "Business main gate image not found."
        );
      }
      await deleteFromCloudinary(profile.businessMainGateURL);
      updateData.businessMainGateURL = null;
      break;
    }
    case "businessKitchen": {
      if (!profile.businessKitchenURL) {
        throw new NotFoundError(
          "Business kitchen image not found."
        );
      }
      await deleteFromCloudinary(profile.businessKitchenURL);
      updateData.businessKitchenURL = null;
      break;
    }
    case "profileImage": {
      if (!profile.imageURL) {
        throw new NotFoundError("Profile image not found.");
      }
      await deleteFromCloudinary(profile.imageURL);
      updateData.imageURL = null;
      break;
    }
  }
  const shouldResetApproval = profile.approvalStatus === "APPROVED";
  const updatedProfile = await prisma.providerProfile.update({
    where: { userId },
    data: {
      ...updateData,
      ...shouldResetApproval && {
        approvalStatus: "PENDING",
        rejectionReason: null,
        reviewedBy: null,
        reviewedAt: null
      }
    }
  });
  return updatedProfile;
};
var requestApproval = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      isDeleted: true,
      emailVerified: true,
      phone: true
    }
  });
  if (!user) throw new NotFoundError("User not found.");
  if (user.isDeleted) {
    throw new ForbiddenError("This account has been deleted.");
  }
  if (user.status === "SUSPENDED") {
    throw new ForbiddenError(
      "Your account is suspended. Please contact support."
    );
  }
  if (!user.emailVerified) {
    throw new ForbiddenError(
      "Please verify your email before requesting approval."
    );
  }
  const profile = await prisma.providerProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      approvalStatus: true,
      businessName: true,
      businessCategory: true,
      businessEmail: true,
      phone: true,
      city: true,
      street: true,
      houseNumber: true,
      apartment: true,
      postalCode: true,
      binNumber: true,
      nidImageFront_and_BackURL: true,
      businessMainGateURL: true,
      businessKitchenURL: true,
      imageURL: true,
      bio: true
    }
  });
  if (!profile) {
    throw new NotFoundError(
      "Please complete your provider profile before requesting approval."
    );
  }
  if (profile.approvalStatus === "APPROVED") {
    throw new ConflictError(
      "Your profile is already approved. No action needed."
    );
  }
  if (profile.approvalStatus === "PENDING") {
    throw new ConflictError(
      "Your approval request is already under review. Please wait for admin response."
    );
  }
  if (profile.businessCategory === "RESTAURANT" && (!profile.binNumber || profile.binNumber.trim() === "")) {
    throw new UnprocessableError(
      "BIN/Tax number is required for Restaurant category before requesting approval."
    );
  }
  const nidUrls = profile.nidImageFront_and_BackURL ? JSON.parse(profile.nidImageFront_and_BackURL) : [];
  if (nidUrls.filter(Boolean).length < 2) {
    throw new UnprocessableError(
      "Both front and back NID images are required before requesting approval."
    );
  }
  if (!profile.businessMainGateURL) {
    throw new UnprocessableError(
      "Business main gate image is required before requesting approval."
    );
  }
  const updatedProfile = await prisma.providerProfile.update({
    where: { userId },
    data: {
      approvalStatus: "PENDING",
      rejectionReason: null,
      reviewedBy: null,
      reviewedAt: null
    }
  });
  const admins = await prisma.user.findMany({
    where: {
      role: { in: ["ADMIN", "SUPER_ADMIN"] },
      status: "ACTIVE",
      isDeleted: false
    },
    select: { email: true }
  });
  await Promise.all(
    admins.map(
      (admin) => sendAdminApprovalRequestEmail(admin.email, {
        providerName: user.name,
        providerEmail: user.email,
        providerPhone: profile.phone ?? user.phone ?? null,
        businessName: profile.businessName,
        businessCategory: profile.businessCategory,
        businessEmail: profile.businessEmail,
        city: profile.city,
        street: profile.street,
        houseNumber: profile.houseNumber,
        apartment: profile.apartment ?? null,
        postalCode: profile.postalCode,
        binNumber: profile.binNumber ?? null
      })
    )
  );
  return updatedProfile;
};
var getProviderDashboardStats = async (userId) => {
  const profile = await prisma.providerProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      totalGrossRevenue: true,
      totalPlatformFee: true,
      totalProviderEarning: true,
      currentPayableAmount: true,
      totalOrdersCompleted: true,
      lastPaymentAt: true
    }
  });
  if (!profile) throw new NotFoundError("Provider profile not found.");
  const [
    placedOrders,
    cancelledOrders,
    deliveredOrders,
    activeOrders,
    totalOrders,
    paidSettlements,
    pendingSettlements,
    monthlyRevenue
  ] = await Promise.all([
    prisma.order.count({ where: { providerId: profile.id, status: "PLACED" } }),
    prisma.order.count({ where: { providerId: profile.id, status: "CANCELLED" } }),
    prisma.order.count({ where: { providerId: profile.id, status: "DELIVERED" } }),
    prisma.order.count({
      where: {
        providerId: profile.id,
        status: { in: ["PLACED", "ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY"] }
      }
    }),
    prisma.order.count({ where: { providerId: profile.id } }),
    prisma.payment.aggregate({
      where: {
        providerId: profile.id,
        status: "SUCCESS",
        providerSettlementStatus: "PAID"
      },
      _sum: { providerShareAmount: true },
      _count: true
    }),
    prisma.payment.aggregate({
      where: {
        providerId: profile.id,
        status: "SUCCESS",
        providerSettlementStatus: "PENDING"
      },
      _sum: { providerShareAmount: true },
      _count: true
    }),
    prisma.$queryRaw`
      SELECT
        TO_CHAR(DATE_TRUNC('month', p."paidAt"), 'Mon YY') AS month,
        COALESCE(SUM(p.amount), 0)::float AS gross,
        COALESCE(SUM(p."platformFeeAmount"), 0)::float AS fee,
        COALESCE(SUM(p."providerShareAmount"), 0)::float AS net
      FROM payments p
      WHERE p."providerId" = ${profile.id}
        AND p.status = 'SUCCESS'
        AND p."paidAt" >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', p."paidAt")
      ORDER BY DATE_TRUNC('month', p."paidAt") ASC
    `
  ]);
  return {
    overview: {
      totalGrossRevenue: Number(profile.totalGrossRevenue),
      totalPlatformFee: Number(profile.totalPlatformFee),
      totalProviderEarning: Number(profile.totalProviderEarning),
      currentPayableAmount: Number(profile.currentPayableAmount),
      totalOrdersCompleted: profile.totalOrdersCompleted,
      lastPaymentAt: profile.lastPaymentAt
    },
    orders: {
      total: totalOrders,
      placed: placedOrders,
      active: activeOrders,
      delivered: deliveredOrders,
      cancelled: cancelledOrders
    },
    settlements: {
      paid: {
        count: paidSettlements._count,
        amount: Number(paidSettlements._sum.providerShareAmount ?? 0)
      },
      pending: {
        count: pendingSettlements._count,
        amount: Number(pendingSettlements._sum.providerShareAmount ?? 0)
      }
    },
    monthlyRevenue
  };
};
var ProviderService = {
  getMyProfile,
  createProviderProfile,
  updateProviderProfile,
  deleteProviderImage,
  requestApproval,
  getProviderDashboardStats
};

// src/modules/provider/provider.controller.ts
import status3 from "http-status";

// src/utils/extractFiles.ts
var extractProviderImages = (req) => {
  const files = req.files;
  if (!files) return {};
  const result = {};
  if (files.nidImages) {
    if (files.nidImages[0]) {
      result.nidImageFrontURL = files.nidImages[0].path;
    }
    if (files.nidImages[1]) {
      result.nidImageBackURL = files.nidImages[1].path;
    }
  }
  if (files.businessMainGate?.[0]) {
    result.businessMainGateURL = files.businessMainGate[0].path;
  }
  if (files.businessKitchen?.[0]) {
    result.businessKitchenURL = files.businessKitchen[0].path;
  }
  if (files.profileImage?.[0]) {
    result.profileImageURL = files.profileImage[0].path;
  }
  console.log("From extractProvider image: ", result);
  return result;
};
var extractMealImages = (req) => {
  const files = req.files;
  if (!files) return {};
  const result = {};
  if (files.mainImage?.[0]) {
    result.mainImageURL = files.mainImage[0].path;
  }
  if (files.galleryImages && files.galleryImages.length > 0) {
    result.galleryImageURLs = files.galleryImages.map(
      (f) => f.path
    );
  }
  return result;
};

// src/modules/provider/provider.controller.ts
var getMyProfile2 = async (req, res, next) => {
  try {
    const result = await ProviderService.getMyProfile(req.user.id);
    sendResponse(res, {
      httpStatusCode: status3.OK,
      success: true,
      message: result ? "Profile fetched successfully." : "No profile found. Please complete your profile setup.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var createProfile = async (req, res, next) => {
  try {
    const payload = req.body;
    console.log("From provider controller create profile: images: ", payload);
    const images = extractProviderImages(req);
    console.log("From provider controller create profile: images: ", images);
    const result = await ProviderService.createProviderProfile(
      req.user.id,
      payload,
      images
    );
    sendResponse(res, {
      httpStatusCode: status3.CREATED,
      success: true,
      message: "Provider profile created successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateProfile = async (req, res, next) => {
  try {
    const payload = req.body;
    const images = extractProviderImages(req);
    const result = await ProviderService.updateProviderProfile(
      req.user.id,
      payload,
      images
    );
    sendResponse(res, {
      httpStatusCode: status3.OK,
      success: true,
      message: "Profile updated successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var deleteImage = async (req, res, next) => {
  try {
    const { imageType } = req.body;
    const result = await ProviderService.deleteProviderImage(
      req.user.id,
      imageType
    );
    sendResponse(res, {
      httpStatusCode: status3.OK,
      success: true,
      message: "Image deleted successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var requestApproval2 = async (req, res, next) => {
  try {
    const result = await ProviderService.requestApproval(req.user.id);
    sendResponse(res, {
      httpStatusCode: status3.OK,
      success: true,
      message: "Approval request submitted. You will be notified within 2 to 3 business days.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getDashboardStats = async (req, res, next) => {
  try {
    const result = await ProviderService.getProviderDashboardStats(req.user.id);
    sendResponse(res, {
      httpStatusCode: status3.OK,
      success: true,
      message: "Dashboard stats fetched successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var ProviderController = {
  getMyProfile: getMyProfile2,
  createProfile,
  updateProfile,
  deleteImage,
  requestApproval: requestApproval2,
  getDashboardStats
};

// src/config/multer.config.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
var ALLOWED_FORMATS = ["jpg", "jpeg", "png", "webp"];
var MAX_FILE_SIZE = 5 * 1024 * 1024;
var providerProfileStorage = new CloudinaryStorage({
  cloudinary: claudinary_config_default,
  params: (req, file) => {
    let folder = "platera_foodhub/providers/misc";
    if (file.fieldname === "nidImages") {
      folder = "platera_foodhub/providers/nid";
    } else if (file.fieldname === "businessMainGate") {
      folder = "platera_foodhub/providers/main-gate";
    } else if (file.fieldname === "businessKitchen") {
      folder = "platera_foodhub/providers/kitchen";
    } else if (file.fieldname === "profileImage") {
      folder = "platera_foodhub/providers/profile";
    }
    return {
      folder,
      allowed_formats: ALLOWED_FORMATS,
      transformation: [
        { quality: "auto", fetch_format: "auto" }
      ]
    };
  }
});
var imageFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only image files are allowed (jpg, jpeg, png, webp)."
      )
    );
  }
};
var providerProfileUpload = multer({
  storage: providerProfileStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
});
var mealImageStorage = new CloudinaryStorage({
  cloudinary: claudinary_config_default,
  params: (req, file) => {
    let folder = "platera_foodhub/meals/misc";
    if (file.fieldname === "mainImage") {
      folder = "platera_foodhub/meals/main";
    } else if (file.fieldname === "galleryImages") {
      folder = "platera_foodhub/meals/gallery";
    }
    return {
      folder,
      allowed_formats: ALLOWED_FORMATS,
      transformation: [
        { quality: "auto", fetch_format: "auto" },
        { width: 800, crop: "limit" }
        // max 800px wide for meal images
      ]
    };
  }
});
var mealImageUpload = multer({
  storage: mealImageStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
});

// src/middlewares/upload.middleware.ts
var uploadProviderImages = (req, res, next) => {
  const upload = providerProfileUpload.fields([
    { name: "nidImages", maxCount: 2 },
    { name: "businessMainGate", maxCount: 1 },
    { name: "businessKitchen", maxCount: 1 },
    { name: "profileImage", maxCount: 1 }
  ]);
  upload(req, res, (err) => {
    if (err) {
      return next(new BadRequestError(err.message));
    }
    next();
  });
};
var uploadProviderImagesOptional = (req, res, next) => {
  const upload = providerProfileUpload.fields([
    { name: "nidImages", maxCount: 2 },
    { name: "businessMainGate", maxCount: 1 },
    { name: "businessKitchen", maxCount: 1 },
    { name: "profileImage", maxCount: 1 }
  ]);
  upload(req, res, (err) => {
    if (err) {
      return next(new BadRequestError(err.message));
    }
    next();
  });
};
var uploadMealImages = (req, res, next) => {
  const upload = mealImageUpload.fields([
    { name: "mainImage", maxCount: 1 },
    // required
    { name: "galleryImages", maxCount: 5 }
    // optional, max 5
  ]);
  upload(req, res, (err) => {
    if (err) {
      return next(new BadRequestError(err.message));
    }
    next();
  });
};
var uploadMealImagesOptional = (req, res, next) => {
  const upload = mealImageUpload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 5 }
  ]);
  upload(req, res, (err) => {
    if (err) {
      return next(new BadRequestError(err.message));
    }
    next();
  });
};

// src/modules/provider/provider.validation.ts
import { z as z2 } from "zod";
var createProviderProfileSchema = z2.object({
  businessName: z2.string().min(1, "Business name is required.").min(2, "Business name must be at least 2 characters.").max(100, "Business name cannot exceed 100 characters."),
  businessCategory: z2.enum(
    ["RESTAURANT", "SHOP", "HOME_KITCHEN", "STREET_FOOD"],
    {
      error: "Business category is required and must be one of: RESTAURANT, SHOP, HOME_KITCHEN, STREET_FOOD."
    }
  ),
  phone: z2.string().min(1, "Phone number is required.").min(8, "Phone number must be at least 8 digits.").max(14, "Phone number cannot exceed 14 digits.").regex(/^[0-9+\-\s()]+$/, "Please provide a valid phone number."),
  businessEmail: z2.email(),
  bio: z2.string().max(500, "Bio cannot exceed 500 characters.").nullish(),
  binNumber: z2.string().nullish(),
  city: z2.string().min(1, "City is required.").min(2, "City must be at least 2 characters."),
  street: z2.string().min(1, "Street is required.").min(2, "Street must be at least 2 characters."),
  houseNumber: z2.string().min(1, "House number is required."),
  apartment: z2.string().nullish(),
  postalCode: z2.string().min(1, "Postal code is required.").min(4, "Postal code must be at least 4 characters.")
}).refine(
  (data) => {
    if (data.businessCategory === "RESTAURANT") {
      return !!data.binNumber && data.binNumber.trim().length > 0;
    }
    return true;
  },
  {
    message: "BIN/Tax number is mandatory for Restaurant category.",
    path: ["binNumber"]
  }
);
var updateProviderProfileSchema = z2.object({
  businessName: z2.string().min(2, "Business name must be at least 2 characters.").max(100, "Business name cannot exceed 100 characters.").nullish(),
  businessCategory: z2.enum(["RESTAURANT", "SHOP", "HOME_KITCHEN", "STREET_FOOD"]).nullish(),
  phone: z2.string().min(10, "Phone number must be at least 10 digits.").max(15, "Phone number cannot exceed 15 digits.").regex(/^[0-9+\-\s()]+$/, "Please provide a valid phone number.").nullish(),
  bio: z2.string().max(500, "Bio cannot exceed 500 characters.").nullish(),
  binNumber: z2.string().nullish(),
  city: z2.string().min(2, "City must be at least 2 characters.").nullish(),
  street: z2.string().min(2, "Street must be at least 2 characters.").nullish(),
  houseNumber: z2.string().min(1, "House number is required.").nullish(),
  apartment: z2.string().nullish(),
  postalCode: z2.string().min(4, "Postal code must be at least 4 characters.").nullish()
}).refine(
  (data) => {
    if (data.businessCategory === "RESTAURANT") {
      return !!data.binNumber && data.binNumber.trim().length > 0;
    }
    return true;
  },
  {
    message: "BIN/Tax number is mandatory for Restaurant category.",
    path: ["binNumber"]
  }
);
var deleteImageSchema = z2.object({
  imageType: z2.enum(
    [
      "nidImageFront",
      "nidImageBack",
      "businessMainGate",
      "businessKitchen",
      "profileImage"
    ],
    {
      error: "imageType must be one of: nidImageFront, nidImageBack, businessMainGate, businessKitchen, profileImage."
    }
  )
});
var rejectProviderSchema = z2.object({
  rejectionReason: z2.string().min(1, "Rejection reason is required.").min(10, "Please provide a meaningful rejection reason.")
});

// src/modules/provider/provider.routes.ts
var router2 = Router2();
router2.get(
  "/profile/me",
  auth_middleware_default("PROVIDER" /* PROVIDER */),
  ProviderController.getMyProfile
);
router2.get(
  "/dashboard/stats",
  auth_middleware_default("PROVIDER" /* PROVIDER */),
  ProviderController.getDashboardStats
);
router2.post(
  "/profile",
  auth_middleware_default("PROVIDER" /* PROVIDER */),
  uploadProviderImages,
  validateRequest_default(createProviderProfileSchema),
  ProviderController.createProfile
);
router2.patch(
  "/profile",
  auth_middleware_default("PROVIDER" /* PROVIDER */),
  uploadProviderImagesOptional,
  validateRequest_default(updateProviderProfileSchema),
  ProviderController.updateProfile
);
router2.delete(
  "/profile/image",
  auth_middleware_default("PROVIDER" /* PROVIDER */),
  validateRequest_default(deleteImageSchema),
  ProviderController.deleteImage
);
router2.post(
  "/profile/request-approval",
  auth_middleware_default("PROVIDER" /* PROVIDER */),
  ProviderController.requestApproval
);
var ProviderRoutes = router2;

// src/modules/admin/admin.routes.ts
import { Router as Router3 } from "express";

// src/middlewares/adminGuard.middleware.ts
var adminGuard = (req, res, next) => {
  const role = req.user.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    throw new ForbiddenError(
      "Access restricted to admin accounts only."
    );
  }
  next();
};
var superAdminGuard = (req, res, next) => {
  const role = req.user.role;
  if (role !== "SUPER_ADMIN") {
    throw new ForbiddenError(
      "Access restricted to super admin only."
    );
  }
  next();
};

// src/modules/admin/admin.validation.ts
import { z as z3 } from "zod";
var rejectProviderSchema2 = z3.object({
  rejectionReason: z3.string().min(1, "Rejection reason is required.").min(10, "Please provide a meaningful rejection reason.").max(500, "Rejection reason cannot exceed 500 characters.")
});
var createAdminSchema = z3.object({
  name: z3.string().min(1, "Name is required.").min(2, "Name must be at least 2 characters.").max(50, "Name cannot exceed 50 characters."),
  email: z3.string().min(1, "Email is required.").email("Please provide a valid email address."),
  password: z3.string().min(1, "Password is required.").min(8, "Password must be at least 8 characters.").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    "Password must contain uppercase, lowercase, number and special character."
  )
});
var suspendUserSchema = z3.object({
  reason: z3.string().max(300, "Reason cannot exceed 300 characters.").optional()
});
var userListQuerySchema = z3.object({
  role: z3.enum(["CUSTOMER", "PROVIDER", "ADMIN", "SUPER_ADMIN"]).optional(),
  status: z3.enum(["ACTIVE", "SUSPENDED"]).optional(),
  page: z3.coerce.number().min(1).default(1),
  limit: z3.coerce.number().min(1).max(100).default(10),
  search: z3.string().optional()
});
var providerListQuerySchema = z3.object({
  approvalStatus: z3.enum(["DRAFT", "PENDING", "APPROVED", "REJECTED"]).optional(),
  page: z3.coerce.number().min(1).default(1),
  limit: z3.coerce.number().min(1).max(100).default(10),
  search: z3.string().optional()
});
var paymentListQuerySchema = z3.object({
  status: z3.enum(["PENDING", "SUCCESS", "FAILED", "CANCELLED", "REFUNDED"]).optional(),
  providerSettlementStatus: z3.enum(["PENDING", "PAID"]).optional(),
  page: z3.coerce.number().min(1).default(1),
  limit: z3.coerce.number().min(1).max(100).default(10),
  search: z3.string().optional()
});
var orderListQuerySchema = z3.object({
  status: z3.enum([
    "PENDING_PAYMENT",
    "PLACED",
    "ACCEPTED",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED"
  ]).optional(),
  page: z3.coerce.number().min(1).default(1),
  limit: z3.coerce.number().min(1).max(100).default(10),
  search: z3.string().optional()
});
var markProviderPaidSchema = z3.object({
  note: z3.string().max(300).optional()
});
var updateProviderStatusSchema = z3.object({
  approvalStatus: z3.enum(["DRAFT", "PENDING", "APPROVED", "REJECTED"]).optional(),
  userStatus: z3.enum(["ACTIVE", "SUSPENDED"]).optional(),
  rejectionReason: z3.string().max(500).optional()
});

// src/modules/admin/admin.service.ts
var getPendingProviders = async (query) => {
  const { page, limit, search } = query;
  const skip = (page - 1) * limit;
  const where = {
    approvalStatus: "PENDING",
    user: {
      isDeleted: false,
      ...search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } }
        ]
      }
    }
  };
  const [providers, total] = await Promise.all([
    prisma.providerProfile.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, createdAt: true }
        }
      },
      orderBy: { createdAt: "asc" },
      // oldest first — fairness
      skip,
      take: limit
    }),
    prisma.providerProfile.count({ where })
  ]);
  return {
    providers,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};
var getAllProviders = async (query) => {
  const { page, limit, search, approvalStatus } = query;
  const skip = (page - 1) * limit;
  const where = {
    ...approvalStatus && { approvalStatus },
    user: {
      isDeleted: false,
      ...search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } }
        ]
      }
    }
  };
  const [providers, total] = await Promise.all([
    prisma.providerProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
            createdAt: true
          }
        },
        _count: { select: { meals: true, orders: true } }
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.providerProfile.count({ where })
  ]);
  return {
    providers: providers.map((p) => ({
      ...p,
      mealCount: p._count.meals,
      orderCount: p._count.orders
    })),
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};
var getProviderDetail = async (profileId) => {
  const profile = await prisma.providerProfile.findUnique({
    where: { id: profileId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          status: true,
          isDeleted: true,
          createdAt: true,
          emailVerified: true
        }
      },
      meals: { select: { id: true } },
      orders: { select: { id: true } },
      payments: {
        select: {
          id: true,
          amount: true,
          status: true,
          providerSettlementStatus: true
        }
      }
    }
  });
  if (!profile) throw new NotFoundError("Provider profile not found.");
  return {
    ...profile,
    mealCount: profile.meals.length,
    orderCount: profile.orders.length,
    paymentCount: profile.payments.length
  };
};
var approveProvider = async (profileId, adminId) => {
  const profile = await prisma.providerProfile.findUnique({
    where: { id: profileId },
    include: {
      user: {
        select: { id: true, name: true, email: true, status: true, isDeleted: true }
      }
    }
  });
  if (!profile) throw new NotFoundError("Provider profile not found.");
  if (profile.user.isDeleted) throw new ForbiddenError("This provider account has been deleted.");
  if (profile.user.status === "SUSPENDED") throw new ForbiddenError("This provider account is suspended.");
  if (profile.approvalStatus === "APPROVED") throw new ConflictError("Provider is already approved.");
  if (profile.approvalStatus !== "PENDING") throw new BadRequestError("Only PENDING profiles can be approved.");
  const updated = await prisma.providerProfile.update({
    where: { id: profileId },
    data: {
      approvalStatus: "APPROVED",
      rejectionReason: null,
      reviewedBy: adminId,
      reviewedAt: /* @__PURE__ */ new Date()
    }
  });
  await sendProviderApprovedEmail(profile.user.name, profile.user.email);
  return updated;
};
var rejectProvider = async (profileId, adminId, rejectionReason) => {
  const profile = await prisma.providerProfile.findUnique({
    where: { id: profileId },
    include: {
      user: {
        select: { id: true, name: true, email: true, status: true, isDeleted: true }
      }
    }
  });
  if (!profile) throw new NotFoundError("Provider profile not found.");
  if (profile.user.isDeleted) throw new ForbiddenError("This provider account has been deleted.");
  if (profile.approvalStatus === "REJECTED") throw new ConflictError("Provider is already rejected.");
  if (profile.approvalStatus !== "PENDING") throw new BadRequestError("Only PENDING profiles can be rejected.");
  const updated = await prisma.providerProfile.update({
    where: { id: profileId },
    data: {
      approvalStatus: "REJECTED",
      rejectionReason,
      reviewedBy: adminId,
      reviewedAt: /* @__PURE__ */ new Date()
    }
  });
  await sendProviderRejectedEmail(profile.user.name, profile.user.email, rejectionReason);
  return updated;
};
var updateProviderStatus = async (profileId, adminId, payload) => {
  const profile = await prisma.providerProfile.findUnique({
    where: { id: profileId },
    include: {
      user: {
        select: { id: true, name: true, email: true, status: true, isDeleted: true }
      }
    }
  });
  if (!profile) throw new NotFoundError("Provider profile not found.");
  if (profile.user.isDeleted) throw new ForbiddenError("This provider account has been deleted.");
  const { approvalStatus, userStatus, rejectionReason } = payload;
  const updated = await prisma.$transaction(async (tx) => {
    if (userStatus) {
      await tx.user.update({
        where: { id: profile.user.id },
        data: { status: userStatus }
      });
    }
    if (approvalStatus) {
      await tx.providerProfile.update({
        where: { id: profileId },
        data: {
          approvalStatus,
          rejectionReason: approvalStatus === "REJECTED" ? rejectionReason ?? null : null,
          reviewedBy: adminId,
          reviewedAt: /* @__PURE__ */ new Date()
        }
      });
    }
    return tx.providerProfile.findUnique({
      where: { id: profileId },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, status: true }
        }
      }
    });
  });
  return updated;
};
var getAllUsers = async (query) => {
  const { page, limit, role, status: status12, search } = query;
  const skip = (page - 1) * limit;
  const where = {
    isDeleted: false,
    NOT: { role: "SUPER_ADMIN" },
    ...role && { role },
    ...status12 && { status: status12 },
    ...search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } }
      ]
    }
  };
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        providerProfile: {
          select: { id: true, businessName: true, approvalStatus: true }
        }
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.user.count({ where })
  ]);
  return {
    users,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};
var getUserDetail = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, isDeleted: false },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true,
      image: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      providerProfile: true
    }
  });
  if (!user) throw new NotFoundError("User not found.");
  return user;
};
var suspendUser = async (targetUserId, adminId, reason) => {
  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, role: true, status: true, isDeleted: true }
  });
  if (!user) throw new NotFoundError("User not found.");
  if (user.isDeleted) throw new ForbiddenError("Account has been deleted.");
  if (user.status === "SUSPENDED") throw new ConflictError("User is already suspended.");
  if (["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    throw new ForbiddenError("Admin accounts cannot be suspended through this endpoint.");
  }
  return prisma.user.update({
    where: { id: targetUserId },
    data: { status: "SUSPENDED" },
    select: { id: true, name: true, email: true, role: true, status: true }
  });
};
var reactivateUser = async (targetUserId, adminId) => {
  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, role: true, status: true, isDeleted: true }
  });
  if (!user) throw new NotFoundError("User not found.");
  if (user.isDeleted) throw new ForbiddenError("Account has been deleted.");
  if (user.status === "ACTIVE") throw new ConflictError("User is already active.");
  return prisma.user.update({
    where: { id: targetUserId },
    data: { status: "ACTIVE" },
    select: { id: true, name: true, email: true, role: true, status: true }
  });
};
var toggleUserStatus = async (userId, adminId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, status: true, role: true, isDeleted: true }
  });
  if (!user) throw new NotFoundError("User not found.");
  if (user.isDeleted) throw new ForbiddenError("Account has been deleted.");
  if (["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    throw new ForbiddenError("Admin accounts cannot be toggled through this endpoint.");
  }
  const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
  return prisma.user.update({
    where: { id: userId },
    data: { status: newStatus },
    select: { id: true, name: true, email: true, role: true, status: true }
  });
};
var getAllAdmins = async () => prisma.user.findMany({
  where: { role: { in: ["ADMIN", "SUPER_ADMIN"] }, isDeleted: false },
  select: {
    id: true,
    name: true,
    email: true,
    role: true,
    status: true,
    emailVerified: true,
    createdAt: true
  },
  orderBy: { createdAt: "asc" }
});
var createAdmin = async (payload, createdById) => {
  const existing = await prisma.user.findUnique({
    where: { email: payload.email },
    select: { id: true, isDeleted: true }
  });
  if (existing) {
    if (existing.isDeleted) throw new ForbiddenError("Email is associated with a deleted account.");
    throw new ConflictError("An account with this email already exists.");
  }
  const result = await auth.api.signUpEmail({
    body: { name: payload.name, email: payload.email, password: payload.password },
    headers: new Headers({ "x-intended-role": "ADMIN" })
  });
  if (!result.user) throw new BadRequestError("Failed to create admin account.");
  await prisma.user.update({
    where: { id: result.user.id },
    data: { emailVerified: true }
  });
  return result.user;
};
var getDashboardStats2 = async () => {
  const [
    totalUsers,
    totalCustomers,
    totalProviders,
    pendingProviders,
    approvedProviders,
    rejectedProviders,
    suspendedUsers,
    totalOrders,
    placedOrders,
    activeOrders,
    deliveredOrders,
    cancelledOrders,
    grossRevenue,
    totalFeeAgg,
    totalProviderShareAgg,
    paidToProvidersAgg,
    unpaidToProvidersAgg,
    monthlyRevenue,
    userGrowth
  ] = await Promise.all([
    prisma.user.count({ where: { isDeleted: false, role: { in: ["CUSTOMER", "PROVIDER"] } } }),
    prisma.user.count({ where: { isDeleted: false, role: "CUSTOMER" } }),
    prisma.user.count({ where: { isDeleted: false, role: "PROVIDER" } }),
    prisma.providerProfile.count({ where: { approvalStatus: "PENDING" } }),
    prisma.providerProfile.count({ where: { approvalStatus: "APPROVED" } }),
    prisma.providerProfile.count({ where: { approvalStatus: "REJECTED" } }),
    prisma.user.count({ where: { isDeleted: false, status: "SUSPENDED" } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PLACED" } }),
    prisma.order.count({ where: { status: { in: ["PLACED", "ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY"] } } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
    prisma.order.count({ where: { status: "CANCELLED" } }),
    prisma.payment.aggregate({ where: { status: "SUCCESS" }, _sum: { amount: true } }),
    prisma.payment.aggregate({ where: { status: "SUCCESS" }, _sum: { platformFeeAmount: true } }),
    prisma.payment.aggregate({ where: { status: "SUCCESS" }, _sum: { providerShareAmount: true } }),
    prisma.payment.aggregate({ where: { status: "SUCCESS", providerSettlementStatus: "PAID" }, _sum: { providerShareAmount: true } }),
    prisma.payment.aggregate({ where: { status: "SUCCESS", providerSettlementStatus: "PENDING" }, _sum: { providerShareAmount: true } }),
    prisma.$queryRaw`
      SELECT
        TO_CHAR(DATE_TRUNC('month', p."paidAt"), 'Mon YY') AS month,
        COALESCE(SUM(p.amount), 0)::float AS gross,
        COALESCE(SUM(p."platformFeeAmount"), 0)::float AS fee,
        COALESCE(SUM(p."providerShareAmount"), 0)::float AS net,
        COUNT(DISTINCT p."orderId")::int AS orders
      FROM payments p
      WHERE p.status = 'SUCCESS'
        AND p."paidAt" >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', p."paidAt")
      ORDER BY DATE_TRUNC('month', p."paidAt") ASC
    `,
    prisma.$queryRaw`
      SELECT
        TO_CHAR(DATE_TRUNC('month', u."createdAt"), 'Mon YY') AS month,
        COUNT(CASE WHEN u.role = 'CUSTOMER' THEN 1 END)::int AS customers,
        COUNT(CASE WHEN u.role = 'PROVIDER' THEN 1 END)::int AS providers
      FROM "user" as u
      WHERE u."isDeleted" = false
        AND u."createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', u."createdAt")
      ORDER BY DATE_TRUNC('month', u."createdAt") ASC
    `
  ]);
  return {
    users: {
      total: totalUsers,
      customers: totalCustomers,
      providers: totalProviders,
      suspended: suspendedUsers
    },
    providers: {
      pending: pendingProviders,
      approved: approvedProviders,
      rejected: rejectedProviders
    },
    orders: {
      total: totalOrders,
      placed: placedOrders,
      active: activeOrders,
      delivered: deliveredOrders,
      cancelled: cancelledOrders
    },
    revenue: {
      gross: Number(grossRevenue._sum.amount ?? 0),
      platformFee: Number(totalFeeAgg._sum.platformFeeAmount ?? 0),
      providerShare: Number(totalProviderShareAgg._sum.providerShareAmount ?? 0),
      paidToProviders: Number(paidToProvidersAgg._sum.providerShareAmount ?? 0),
      unpaidToProviders: Number(unpaidToProvidersAgg._sum.providerShareAmount ?? 0)
    },
    monthlyRevenue,
    userGrowth
  };
};
var getAllOrders = async (query) => {
  const { page, limit, search, status: status12 } = query;
  const skip = (page - 1) * limit;
  const where = {
    ...status12 && { status: status12 },
    ...search && {
      OR: [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { provider: { businessName: { contains: search, mode: "insensitive" } } },
        { customer: { name: { contains: search, mode: "insensitive" } } },
        { customer: { email: { contains: search, mode: "insensitive" } } }
      ]
    }
  };
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        provider: { select: { id: true, businessName: true, city: true, businessEmail: true } },
        customer: { select: { id: true, name: true, email: true } },
        payments: {
          select: {
            id: true,
            status: true,
            amount: true,
            providerSettlementStatus: true,
            gatewayName: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.order.count({ where })
  ]);
  return {
    orders,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};
var getOrderDetail = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      provider: { select: { id: true, businessName: true, businessEmail: true, city: true } },
      customer: { select: { id: true, name: true, email: true, phone: true } },
      orderItems: true,
      payments: true,
      orderStatusHistories: { orderBy: { createdAt: "asc" } }
    }
  });
  if (!order) throw new NotFoundError("Order not found.");
  return order;
};
var getAllPayments = async (query) => {
  const { page, limit, search, status: status12, providerSettlementStatus } = query;
  const skip = (page - 1) * limit;
  const where = {
    ...status12 && { status: status12 },
    ...providerSettlementStatus && { providerSettlementStatus },
    ...search && {
      OR: [
        { transactionId: { contains: search, mode: "insensitive" } },
        { gatewayName: { contains: search, mode: "insensitive" } },
        { provider: { businessName: { contains: search, mode: "insensitive" } } },
        { customer: { name: { contains: search, mode: "insensitive" } } },
        { customer: { email: { contains: search, mode: "insensitive" } } }
      ]
    }
  };
  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      include: {
        provider: {
          select: { id: true, businessName: true, businessEmail: true, city: true }
        },
        customer: { select: { id: true, name: true, email: true } },
        order: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            totalAmount: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.payment.count({ where })
  ]);
  return {
    payments,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};
var getPaymentDetail = async (paymentId) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      provider: {
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } }
        }
      },
      customer: { select: { id: true, name: true, email: true, phone: true } },
      order: { include: { orderItems: true } }
    }
  });
  if (!payment) throw new NotFoundError("Payment not found.");
  return payment;
};
var getProviderPayablesSummary = async () => {
  const providers = await prisma.providerProfile.findMany({
    where: { currentPayableAmount: { gt: 0 } },
    select: {
      id: true,
      businessName: true,
      businessEmail: true,
      city: true,
      totalGrossRevenue: true,
      totalPlatformFee: true,
      totalProviderEarning: true,
      currentPayableAmount: true,
      lastPaymentAt: true,
      user: { select: { id: true, name: true, email: true, phone: true } }
    },
    orderBy: { currentPayableAmount: "desc" }
  });
  const pendingSettlementCount = await prisma.payment.count({
    where: { status: "SUCCESS", providerSettlementStatus: "PENDING" }
  });
  return { providers, pendingSettlementCount };
};
var markPaymentAsProviderPaid = async (paymentId, adminId, note) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { provider: true }
  });
  if (!payment) throw new NotFoundError("Payment not found.");
  if (payment.status !== "SUCCESS") throw new BadRequestError("Only successful payments can be settled.");
  if (payment.providerSettlementStatus === "PAID") throw new ConflictError("Payment already settled.");
  return prisma.$transaction(async (tx) => {
    const updated = await tx.payment.update({
      where: { id: paymentId },
      data: {
        providerSettlementStatus: "PAID",
        providerSettledAt: /* @__PURE__ */ new Date(),
        providerSettledBy: adminId,
        providerSettlementNote: note ?? null
      }
    });
    await tx.providerProfile.update({
      where: { id: payment.providerId },
      data: { currentPayableAmount: { decrement: payment.providerShareAmount }, lastPaymentAt: /* @__PURE__ */ new Date() }
    });
    return updated;
  });
};
var bulkSettleProvider = async (providerId, adminId, note) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { id: providerId },
    select: { id: true, businessName: true, currentPayableAmount: true }
  });
  if (!provider) throw new NotFoundError("Provider not found.");
  if (Number(provider.currentPayableAmount) <= 0) throw new BadRequestError("Provider has no pending settlements.");
  const pending = await prisma.payment.findMany({
    where: { providerId, status: "SUCCESS", providerSettlementStatus: "PENDING" },
    select: { id: true, providerShareAmount: true }
  });
  if (pending.length === 0) throw new BadRequestError("No pending payments for this provider.");
  const total = pending.reduce((s, p) => s + Number(p.providerShareAmount), 0);
  return prisma.$transaction(async (tx) => {
    await tx.payment.updateMany({
      where: { providerId, status: "SUCCESS", providerSettlementStatus: "PENDING" },
      data: {
        providerSettlementStatus: "PAID",
        providerSettledAt: /* @__PURE__ */ new Date(),
        providerSettledBy: adminId,
        providerSettlementNote: note ?? null
      }
    });
    await tx.providerProfile.update({
      where: { id: providerId },
      data: {
        currentPayableAmount: { decrement: total },
        lastPaymentAt: /* @__PURE__ */ new Date()
      }
    });
    const settled = await tx.payment.findMany({
      where: { providerId, providerSettledBy: adminId },
      include: { order: { select: { id: true, orderNumber: true } } },
      orderBy: { providerSettledAt: "desc" },
      take: pending.length
    });
    return {
      provider: { id: provider.id, businessName: provider.businessName },
      settledPayments: settled,
      totalSettledAmount: total,
      paymentCount: settled.length
    };
  });
};
var getAllCategories = async () => prisma.category.findMany({
  orderBy: { displayOrder: "asc" },
  include: { _count: { select: { meals: true } } }
});
var createCategory = async (payload) => {
  const existing = await prisma.category.findFirst({
    where: { OR: [{ name: payload.name }, { slug: payload.slug }] },
    select: { id: true }
  });
  if (existing) throw new ConflictError("A category with this name or slug already exists.");
  return prisma.category.create({
    data: { ...payload, displayOrder: payload.displayOrder ?? 0 }
  });
};
var updateCategory = async (categoryId, payload) => {
  const cat = await prisma.category.findUnique({ where: { id: categoryId }, select: { id: true } });
  if (!cat) throw new NotFoundError("Category not found.");
  return prisma.category.update({ where: { id: categoryId }, data: payload });
};
var deleteCategory = async (categoryId) => {
  const cat = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { _count: { select: { meals: true } } }
  });
  if (!cat) throw new NotFoundError("Category not found.");
  if (cat._count.meals > 0) {
    throw new BadRequestError(`Cannot delete category with ${cat._count.meals} meal(s). Reassign first.`);
  }
  return prisma.category.delete({ where: { id: categoryId } });
};
var toggleCategoryStatus = async (categoryId) => {
  const cat = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true, isActive: true }
  });
  if (!cat) throw new NotFoundError("Category not found.");
  return prisma.category.update({
    where: { id: categoryId },
    data: { isActive: !cat.isActive }
  });
};
var AdminService = {
  // providers
  getPendingProviders,
  getAllProviders,
  getProviderDetail,
  approveProvider,
  rejectProvider,
  updateProviderStatus,
  // users
  getAllUsers,
  getUserDetail,
  suspendUser,
  reactivateUser,
  toggleUserStatus,
  // super admin
  getAllAdmins,
  createAdmin,
  // dashboard
  getDashboardStats: getDashboardStats2,
  // orders
  getAllOrders,
  getOrderDetail,
  // payments/settlements
  getAllPayments,
  getPaymentDetail,
  getProviderPayablesSummary,
  markPaymentAsProviderPaid,
  bulkSettleProvider,
  // categories
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus
};

// src/modules/admin/admin.controller.ts
import status4 from "http-status";
var getDashboardStats3 = async (req, res, next) => {
  try {
    const result = await AdminService.getDashboardStats();
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "Dashboard stats fetched.", data: result });
  } catch (e) {
    next(e);
  }
};
var getPendingProviders2 = async (req, res, next) => {
  try {
    const query = providerListQuerySchema.parse(req.query);
    const result = await AdminService.getPendingProviders(query);
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "Pending providers fetched.", data: result });
  } catch (e) {
    next(e);
  }
};
var getAllProviders2 = async (req, res, next) => {
  try {
    const query = providerListQuerySchema.parse(req.query);
    const result = await AdminService.getAllProviders(query);
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "Providers fetched.", data: result });
  } catch (e) {
    next(e);
  }
};
var getProviderDetail2 = async (req, res, next) => {
  try {
    const result = await AdminService.getProviderDetail(req.params.id);
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "Provider detail fetched.", data: result });
  } catch (e) {
    next(e);
  }
};
var approveProvider2 = async (req, res, next) => {
  try {
    const result = await AdminService.approveProvider(req.params.id, req.user.id);
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "Provider approved.", data: result });
  } catch (e) {
    next(e);
  }
};
var rejectProvider2 = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;
    const result = await AdminService.rejectProvider(req.params.id, req.user.id, rejectionReason);
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "Provider rejected.", data: result });
  } catch (e) {
    next(e);
  }
};
var updateProviderStatus2 = async (req, res, next) => {
  try {
    const result = await AdminService.updateProviderStatus(req.params.id, req.user.id, req.body);
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "Provider status updated.", data: result });
  } catch (e) {
    next(e);
  }
};
var getAllUsers2 = async (req, res, next) => {
  try {
    const query = userListQuerySchema.parse(req.query);
    const result = await AdminService.getAllUsers(query);
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "Users fetched.", data: result });
  } catch (e) {
    next(e);
  }
};
var getUserDetail2 = async (req, res, next) => {
  try {
    const result = await AdminService.getUserDetail(req.params.id);
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "User detail fetched.", data: result });
  } catch (e) {
    next(e);
  }
};
var suspendUser2 = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const result = await AdminService.suspendUser(req.params.id, req.user.id, reason);
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "User suspended.", data: result });
  } catch (e) {
    next(e);
  }
};
var reactivateUser2 = async (req, res, next) => {
  try {
    const result = await AdminService.reactivateUser(req.params.id, req.user.id);
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "User reactivated.", data: result });
  } catch (e) {
    next(e);
  }
};
var toggleUserStatus2 = async (req, res, next) => {
  try {
    const result = await AdminService.toggleUserStatus(req.params.id, req.user.id);
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "User status toggled.", data: result });
  } catch (e) {
    next(e);
  }
};
var getAllAdmins2 = async (req, res, next) => {
  try {
    const result = await AdminService.getAllAdmins();
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "Admins fetched.", data: result });
  } catch (e) {
    next(e);
  }
};
var createAdmin2 = async (req, res, next) => {
  try {
    const result = await AdminService.createAdmin(req.body, req.user.id);
    sendResponse(res, { httpStatusCode: status4.CREATED, success: true, message: "Admin account created.", data: result });
  } catch (e) {
    next(e);
  }
};
var getAllOrders2 = async (req, res, next) => {
  try {
    const query = orderListQuerySchema.parse(req.query);
    const result = await AdminService.getAllOrders(query);
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "Orders fetched.", data: result });
  } catch (e) {
    next(e);
  }
};
var getOrderDetail2 = async (req, res, next) => {
  try {
    const result = await AdminService.getOrderDetail(req.params.id);
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "Order detail fetched.", data: result });
  } catch (e) {
    next(e);
  }
};
var getAllPayments2 = async (req, res, next) => {
  try {
    const query = paymentListQuerySchema.parse(req.query);
    const result = await AdminService.getAllPayments(query);
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "Payments fetched.", data: result });
  } catch (e) {
    next(e);
  }
};
var getPaymentDetail2 = async (req, res, next) => {
  try {
    const result = await AdminService.getPaymentDetail(req.params.id);
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "Payment detail fetched.", data: result });
  } catch (e) {
    next(e);
  }
};
var getProviderPayablesSummary2 = async (req, res, next) => {
  try {
    const result = await AdminService.getProviderPayablesSummary();
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "Provider payables fetched.", data: result });
  } catch (e) {
    next(e);
  }
};
var markPaymentAsProviderPaid2 = async (req, res, next) => {
  try {
    const { note } = req.body;
    const result = await AdminService.markPaymentAsProviderPaid(req.params.paymentId, req.user.id, note);
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "Payment settled.", data: result });
  } catch (e) {
    next(e);
  }
};
var bulkSettleProvider2 = async (req, res, next) => {
  try {
    const { note } = req.body;
    const result = await AdminService.bulkSettleProvider(req.params.providerId, req.user.id, note);
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "Bulk settlement completed.", data: result });
  } catch (e) {
    next(e);
  }
};
var getAllCategories2 = async (req, res, next) => {
  try {
    const result = await AdminService.getAllCategories();
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "Categories fetched.", data: result });
  } catch (e) {
    next(e);
  }
};
var createCategory2 = async (req, res, next) => {
  try {
    const result = await AdminService.createCategory(req.body);
    sendResponse(res, { httpStatusCode: status4.CREATED, success: true, message: "Category created.", data: result });
  } catch (e) {
    next(e);
  }
};
var updateCategory2 = async (req, res, next) => {
  try {
    const result = await AdminService.updateCategory(req.params.id, req.body);
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "Category updated.", data: result });
  } catch (e) {
    next(e);
  }
};
var deleteCategory2 = async (req, res, next) => {
  try {
    const result = await AdminService.deleteCategory(req.params.id);
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "Category deleted.", data: result });
  } catch (e) {
    next(e);
  }
};
var toggleCategoryStatus2 = async (req, res, next) => {
  try {
    const result = await AdminService.toggleCategoryStatus(req.params.id);
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "Category status toggled.", data: result });
  } catch (e) {
    next(e);
  }
};
var AdminController = {
  getDashboardStats: getDashboardStats3,
  getPendingProviders: getPendingProviders2,
  getAllProviders: getAllProviders2,
  getProviderDetail: getProviderDetail2,
  approveProvider: approveProvider2,
  rejectProvider: rejectProvider2,
  updateProviderStatus: updateProviderStatus2,
  getAllUsers: getAllUsers2,
  getUserDetail: getUserDetail2,
  suspendUser: suspendUser2,
  reactivateUser: reactivateUser2,
  toggleUserStatus: toggleUserStatus2,
  getAllAdmins: getAllAdmins2,
  createAdmin: createAdmin2,
  getAllOrders: getAllOrders2,
  getOrderDetail: getOrderDetail2,
  getAllPayments: getAllPayments2,
  getPaymentDetail: getPaymentDetail2,
  getProviderPayablesSummary: getProviderPayablesSummary2,
  markPaymentAsProviderPaid: markPaymentAsProviderPaid2,
  bulkSettleProvider: bulkSettleProvider2,
  getAllCategories: getAllCategories2,
  createCategory: createCategory2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2,
  toggleCategoryStatus: toggleCategoryStatus2
};

// src/modules/admin/admin.routes.ts
var router3 = Router3();
router3.use(auth_middleware_default("ADMIN" /* ADMIN */, "SUPER_ADMIN" /* SUPER_ADMIN */));
router3.use(adminGuard);
router3.get("/dashboard", AdminController.getDashboardStats);
router3.get("/providers/pending", AdminController.getPendingProviders);
router3.get("/providers", AdminController.getAllProviders);
router3.get("/providers/:id", AdminController.getProviderDetail);
router3.patch("/providers/:id/approve", AdminController.approveProvider);
router3.patch(
  "/providers/:id/reject",
  validateRequest_default(rejectProviderSchema2),
  AdminController.rejectProvider
);
router3.patch(
  "/providers/:id/status",
  validateRequest_default(updateProviderStatusSchema),
  AdminController.updateProviderStatus
);
router3.get("/users", AdminController.getAllUsers);
router3.get("/users/:id", AdminController.getUserDetail);
router3.patch(
  "/users/:id/suspend",
  validateRequest_default(suspendUserSchema),
  AdminController.suspendUser
);
router3.patch("/users/:id/reactivate", AdminController.reactivateUser);
router3.patch("/users/:id/toggle-status", AdminController.toggleUserStatus);
router3.get("/admins", superAdminGuard, AdminController.getAllAdmins);
router3.post(
  "/admins",
  superAdminGuard,
  validateRequest_default(createAdminSchema),
  AdminController.createAdmin
);
router3.get("/orders", AdminController.getAllOrders);
router3.get("/orders/:id", AdminController.getOrderDetail);
router3.get("/payments", AdminController.getAllPayments);
router3.get("/payments/:id", AdminController.getPaymentDetail);
router3.patch(
  "/payments/:id/mark-provider-paid",
  validateRequest_default(markProviderPaidSchema),
  AdminController.markPaymentAsProviderPaid
);
router3.get("/payables/providers", AdminController.getProviderPayablesSummary);
router3.get("/settlements", AdminController.getAllPayments);
router3.patch(
  "/settlements/:paymentId",
  validateRequest_default(markProviderPaidSchema),
  AdminController.markPaymentAsProviderPaid
);
router3.patch("/settlements/bulk/:providerId", AdminController.bulkSettleProvider);
router3.get("/categories", AdminController.getAllCategories);
router3.post("/categories", AdminController.createCategory);
router3.patch("/categories/:id", AdminController.updateCategory);
router3.delete("/categories/:id", AdminController.deleteCategory);
router3.patch("/categories/:id/toggle", AdminController.toggleCategoryStatus);
var AdminRoutes = router3;

// src/modules/public/public.route.ts
import { Router as Router4 } from "express";

// src/modules/public/public.controller.ts
import status5 from "http-status";

// src/modules/public/public.service.ts
var getCategories = async () => {
  return prisma.category.findMany({
    where: { isActive: { not: false } },
    orderBy: { displayOrder: "asc" }
  });
};
var getRestaurants = async (filters) => {
  const { search, city, categoryId, subcategory, businessCategory, page, limit } = filters;
  const skip = (page - 1) * limit;
  const where = {
    approvalStatus: "APPROVED",
    isActive: true,
    ...city && { city: { equals: city, mode: "insensitive" } },
    ...businessCategory && { businessCategory },
    ...search && {
      OR: [
        { businessName: { contains: search, mode: "insensitive" } },
        { bio: { contains: search, mode: "insensitive" } }
      ]
    },
    ...categoryId && {
      meals: { some: { categoryId, isActive: true, isAvailable: true } }
    },
    ...subcategory && {
      meals: {
        some: {
          subcategory: { contains: subcategory, mode: "insensitive" },
          isActive: true,
          isAvailable: true
        }
      }
    }
  };
  const [restaurants, total] = await Promise.all([
    prisma.providerProfile.findMany({
      where,
      skip,
      take: limit,
      orderBy: { totalOrdersCompleted: "desc" },
      select: {
        id: true,
        businessName: true,
        businessCategory: true,
        bio: true,
        imageURL: true,
        city: true,
        street: true,
        totalOrdersCompleted: true,
        createdAt: true,
        _count: { select: { meals: true, reviews: true } },
        reviews: { select: { rating: true }, take: 1e3 },
        meals: {
          where: { isActive: true, isAvailable: true },
          select: { subcategory: true, categoryId: true },
          take: 200
        }
      }
    }),
    prisma.providerProfile.count({ where })
  ]);
  const enriched = restaurants.map((r) => {
    const ratings = r.reviews.map((rv) => rv.rating);
    const avgRating = ratings.length > 0 ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length * 10) / 10 : 0;
    const subcategories = [...new Set(r.meals.map((m) => m.subcategory).filter(Boolean))];
    return {
      id: r.id,
      businessName: r.businessName,
      businessCategory: r.businessCategory,
      bio: r.bio,
      imageURL: r.imageURL,
      city: r.city,
      street: r.street,
      totalOrdersCompleted: r.totalOrdersCompleted,
      reviewCount: ratings.length,
      mealCount: r._count.meals,
      avgRating,
      subcategories
    };
  });
  return {
    data: enriched,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};
var getRestaurantById = async (restaurantId, mealFilters) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { id: restaurantId, approvalStatus: "APPROVED", isActive: true },
    select: {
      id: true,
      businessName: true,
      businessCategory: true,
      bio: true,
      imageURL: true,
      businessMainGateURL: true,
      businessKitchenURL: true,
      city: true,
      street: true,
      houseNumber: true,
      apartment: true,
      totalOrdersCompleted: true,
      createdAt: true,
      _count: { select: { meals: true, reviews: true } },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          rating: true,
          feedback: true,
          createdAt: true,
          user: { select: { name: true, image: true } }
        }
      }
    }
  });
  if (!provider) return null;
  const ratings = provider.reviews.map((r) => r.rating);
  const avgRating = ratings.length > 0 ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length * 10) / 10 : 0;
  let orderBy = {};
  switch (mealFilters.sortBy) {
    case "price_asc":
      orderBy = { basePrice: "asc" };
      break;
    case "price_desc":
      orderBy = { basePrice: "desc" };
      break;
    case "popular":
      orderBy = { isBestseller: "desc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }
  const mealWhere = {
    providerId: restaurantId,
    isActive: true,
    isAvailable: true,
    ...mealFilters.search && {
      OR: [
        { name: { contains: mealFilters.search, mode: "insensitive" } },
        { shortDescription: { contains: mealFilters.search, mode: "insensitive" } }
      ]
    },
    ...mealFilters.categoryId && { categoryId: mealFilters.categoryId },
    ...mealFilters.subcategory && {
      subcategory: { contains: mealFilters.subcategory, mode: "insensitive" }
    },
    ...mealFilters.dietary && {
      dietaryPreferences: { has: mealFilters.dietary }
    }
  };
  const meals = await prisma.meal.findMany({
    where: mealWhere,
    orderBy,
    select: {
      id: true,
      name: true,
      subcategory: true,
      shortDescription: true,
      mainImageURL: true,
      basePrice: true,
      discountPrice: true,
      discountStartDate: true,
      discountEndDate: true,
      dietaryPreferences: true,
      isBestseller: true,
      isFeatured: true,
      isAvailable: true,
      preparationTimeMinutes: true,
      deliveryFee: true,
      tags: true,
      category: { select: { id: true, name: true, slug: true } },
      _count: { select: { orderItems: true } }
    }
  });
  const allMeals = await prisma.meal.findMany({
    where: { providerId: restaurantId, isActive: true, isAvailable: true },
    select: { subcategory: true, categoryId: true, category: { select: { name: true } } }
  });
  const uniqueSubcategories = [...new Set(allMeals.map((m) => m.subcategory).filter(Boolean))];
  const uniqueCategories = [
    ...new Map(allMeals.map((m) => [m.categoryId, m.category.name])).entries()
  ].map(([id, name]) => ({ id, name }));
  return {
    restaurant: { ...provider, avgRating, reviewCount: ratings.length },
    meals,
    meta: { uniqueSubcategories, uniqueCategories, totalMeals: meals.length }
  };
};
var getFeaturedRestaurants = async () => {
  const restaurants = await prisma.providerProfile.findMany({
    where: { approvalStatus: "APPROVED", isActive: true },
    orderBy: { totalOrdersCompleted: "desc" },
    take: 8,
    select: {
      id: true,
      businessName: true,
      businessCategory: true,
      bio: true,
      imageURL: true,
      city: true,
      totalOrdersCompleted: true,
      reviews: { select: { rating: true } },
      _count: { select: { meals: true } },
      meals: {
        where: { isActive: true, isAvailable: true },
        select: { subcategory: true },
        take: 100
      }
    }
  });
  return restaurants.map((r) => {
    const ratings = r.reviews.map((rv) => rv.rating);
    const avgRating = ratings.length > 0 ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length * 10) / 10 : 0;
    const subcategories = [...new Set(r.meals.map((m) => m.subcategory).filter(Boolean))];
    return {
      id: r.id,
      businessName: r.businessName,
      businessCategory: r.businessCategory,
      bio: r.bio,
      imageURL: r.imageURL,
      city: r.city,
      totalOrdersCompleted: r.totalOrdersCompleted,
      reviewCount: ratings.length,
      mealCount: r._count.meals,
      avgRating,
      subcategories
    };
  });
};
var getTopDishes = async (limit = 9) => {
  const meals = await prisma.meal.findMany({
    where: {
      isActive: true,
      isAvailable: true,
      OR: [{ isFeatured: true }, { isBestseller: true }],
      provider: { approvalStatus: "APPROVED", isActive: true }
    },
    select: {
      id: true,
      name: true,
      shortDescription: true,
      mainImageURL: true,
      basePrice: true,
      discountPrice: true,
      discountStartDate: true,
      discountEndDate: true,
      isBestseller: true,
      isFeatured: true,
      preparationTimeMinutes: true,
      deliveryFee: true,
      subcategory: true,
      tags: true,
      category: { select: { id: true, name: true, slug: true } },
      provider: {
        select: {
          id: true,
          businessName: true,
          city: true,
          imageURL: true
        }
      },
      reviews: {
        select: { rating: true }
      },
      _count: { select: { orderItems: true } }
    },
    orderBy: [
      // isFeatured first, then isBestseller
      { isFeatured: "desc" },
      { isBestseller: "desc" }
    ],
    take: limit * 3
    // fetch more, then sort in JS by orderCount
  });
  const enriched = meals.map((m) => {
    const ratings = m.reviews.map((r) => r.rating);
    const avgRating = ratings.length > 0 ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length * 10) / 10 : 0;
    return {
      id: m.id,
      name: m.name,
      shortDescription: m.shortDescription,
      mainImageURL: m.mainImageURL,
      basePrice: m.basePrice,
      discountPrice: m.discountPrice ?? null,
      discountStartDate: m.discountStartDate?.toISOString() ?? null,
      discountEndDate: m.discountEndDate?.toISOString() ?? null,
      isBestseller: m.isBestseller,
      isFeatured: m.isFeatured,
      preparationTimeMinutes: m.preparationTimeMinutes,
      deliveryFee: m.deliveryFee,
      subcategory: m.subcategory ?? null,
      tags: m.tags,
      orderCount: m._count.orderItems,
      avgRating,
      reviewCount: ratings.length,
      category: m.category,
      provider: m.provider
    };
  }).sort((a, b) => b.orderCount - a.orderCount).slice(0, limit);
  if (enriched.length < limit) {
    const existingIds = new Set(enriched.map((m) => m.id));
    const backfill = await prisma.meal.findMany({
      where: {
        isActive: true,
        isAvailable: true,
        id: { notIn: Array.from(existingIds) },
        provider: { approvalStatus: "APPROVED", isActive: true }
      },
      select: {
        id: true,
        name: true,
        shortDescription: true,
        mainImageURL: true,
        basePrice: true,
        discountPrice: true,
        discountStartDate: true,
        discountEndDate: true,
        isBestseller: true,
        isFeatured: true,
        preparationTimeMinutes: true,
        deliveryFee: true,
        subcategory: true,
        tags: true,
        category: { select: { id: true, name: true, slug: true } },
        provider: {
          select: { id: true, businessName: true, city: true, imageURL: true }
        },
        reviews: { select: { rating: true } },
        _count: { select: { orderItems: true } }
      },
      orderBy: { orderItems: { _count: "desc" } },
      take: limit - enriched.length
    });
    for (const m of backfill) {
      const ratings = m.reviews.map((r) => r.rating);
      const avgRating = ratings.length > 0 ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length * 10) / 10 : 0;
      enriched.push({
        id: m.id,
        name: m.name,
        shortDescription: m.shortDescription,
        mainImageURL: m.mainImageURL,
        basePrice: m.basePrice,
        discountPrice: m.discountPrice ?? null,
        discountStartDate: m.discountStartDate?.toISOString() ?? null,
        discountEndDate: m.discountEndDate?.toISOString() ?? null,
        isBestseller: m.isBestseller,
        isFeatured: m.isFeatured,
        preparationTimeMinutes: m.preparationTimeMinutes,
        deliveryFee: m.deliveryFee,
        subcategory: m.subcategory ?? null,
        tags: m.tags,
        orderCount: m._count.orderItems,
        avgRating,
        reviewCount: ratings.length,
        category: m.category,
        provider: m.provider
      });
    }
  }
  return enriched;
};
var getHomeTestimonials = async (limit = 9) => {
  const reviews = await prisma.review.findMany({
    where: {
      rating: { gte: 4 },
      feedback: { not: null, notIn: ["", " "] },
      provider: { approvalStatus: "APPROVED", isActive: true }
    },
    orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
    take: limit * 3,
    // fetch more, deduplicate by user
    select: {
      id: true,
      rating: true,
      feedback: true,
      createdAt: true,
      user: { select: { name: true, image: true } },
      meal: { select: { name: true } },
      provider: { select: { businessName: true, city: true } }
    }
  });
  const seen = /* @__PURE__ */ new Set();
  const deduped = reviews.filter((r) => {
    const key = r.user.name;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return deduped.slice(0, limit).map((r) => ({
    id: r.id,
    rating: r.rating,
    feedback: r.feedback,
    createdAt: r.createdAt.toISOString(),
    user: { name: r.user.name, image: r.user.image ?? null },
    meal: { name: r.meal.name },
    provider: {
      businessName: r.provider.businessName,
      city: r.provider.city
    }
  }));
};
var PublicService = {
  getCategories,
  getRestaurants,
  getRestaurantById,
  getFeaturedRestaurants,
  getTopDishes,
  getHomeTestimonials
};

// src/modules/public/public.controller.ts
var getCategories2 = async (req, res, next) => {
  try {
    const result = await PublicService.getCategories();
    sendResponse(res, {
      httpStatusCode: status5.OK,
      success: true,
      message: "Categories fetched successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getRestaurants2 = async (req, res, next) => {
  try {
    const {
      search,
      city,
      categoryId,
      subcategory,
      businessCategory,
      page = "1",
      limit = "12"
    } = req.query;
    const result = await PublicService.getRestaurants({
      ...search && { search },
      ...city && { city },
      ...categoryId && { categoryId },
      ...subcategory && { subcategory },
      ...businessCategory && { businessCategory },
      page: parseInt(page),
      limit: parseInt(limit)
    });
    sendResponse(res, {
      httpStatusCode: status5.OK,
      success: true,
      message: "Restaurants fetched successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getRestaurantById2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { search, categoryId, subcategory, dietary, sortBy } = req.query;
    const result = await PublicService.getRestaurantById(id, {
      ...search && { search },
      ...categoryId && { categoryId },
      ...subcategory && { subcategory },
      ...dietary && { dietary },
      ...sortBy && { sortBy }
    });
    if (!result) {
      sendResponse(res, {
        httpStatusCode: status5.NOT_FOUND,
        success: false,
        message: "Restaurant not found.",
        data: null
      });
      return;
    }
    sendResponse(res, {
      httpStatusCode: status5.OK,
      success: true,
      message: "Restaurant fetched successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getFeaturedRestaurants2 = async (req, res, next) => {
  try {
    const result = await PublicService.getFeaturedRestaurants();
    sendResponse(res, {
      httpStatusCode: status5.OK,
      success: true,
      message: "Featured restaurants fetched.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getTopDishes2 = async (req, res, next) => {
  try {
    const limit = Math.min(18, Math.max(1, parseInt(req.query.limit ?? "9")));
    const result = await PublicService.getTopDishes(limit);
    sendResponse(res, {
      httpStatusCode: status5.OK,
      success: true,
      message: "Top dishes fetched successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getHomeTestimonials2 = async (req, res, next) => {
  try {
    const limit = Math.min(18, Math.max(1, parseInt(req.query.limit ?? "9")));
    const result = await PublicService.getHomeTestimonials(limit);
    sendResponse(res, {
      httpStatusCode: status5.OK,
      success: true,
      message: "Testimonials fetched successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var PublicController = {
  getCategories: getCategories2,
  getRestaurants: getRestaurants2,
  getRestaurantById: getRestaurantById2,
  getFeaturedRestaurants: getFeaturedRestaurants2,
  getTopDishes: getTopDishes2,
  getHomeTestimonials: getHomeTestimonials2
};

// src/modules/public/public.route.ts
var router4 = Router4();
router4.get("/categories", PublicController.getCategories);
router4.get("/restaurants/featured", PublicController.getFeaturedRestaurants);
router4.get("/restaurants", PublicController.getRestaurants);
router4.get("/restaurants/:id", PublicController.getRestaurantById);
router4.get("/top-dishes", PublicController.getTopDishes);
router4.get("/testimonials", PublicController.getHomeTestimonials);
var PublicRoutes = router4;

// src/modules/meal/meal.routes.ts
import { Router as Router5 } from "express";

// src/helpers/getProviderProfile.ts
var getProviderProfile = async (userId) => {
  const profile = await prisma.providerProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      businessName: true,
      approvalStatus: true,
      isActive: true,
      totalPlatformFee: true,
      currentPayableAmount: true,
      lastPaymentAt: true
    }
  });
  if (!profile) {
    throw new NotFoundError(
      "Provider profile not found."
    );
  }
  if (profile.approvalStatus !== "APPROVED") {
    throw new ForbiddenError(
      "Your provider profile must be approved before managing meals."
    );
  }
  return profile;
};

// src/helpers/getMealOwnership.ts
var getMealOwnership = async (mealId, providerId) => {
  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
    select: { id: true, providerId: true }
  });
  if (!meal) {
    throw new NotFoundError("Meal not found.");
  }
  if (meal.providerId !== providerId) {
    throw new ForbiddenError(
      "You do not have permission to modify this meal."
    );
  }
  return meal;
};

// src/modules/meal/meal.service.ts
var getMyMeals = async (userId, filters) => {
  const profile = await getProviderProfile(userId);
  const skip = (filters.page - 1) * filters.limit;
  const where = {
    providerId: profile.id,
    isActive: true,
    ...filters.isAvailable !== void 0 && {
      isAvailable: filters.isAvailable
    },
    ...filters.categoryId && {
      categoryId: filters.categoryId
    },
    ...filters.search && {
      OR: [
        {
          name: {
            contains: filters.search,
            mode: "insensitive"
          }
        },
        {
          shortDescription: {
            contains: filters.search,
            mode: "insensitive"
          }
        }
      ]
    }
  };
  const [meals, total] = await Promise.all([
    prisma.meal.findMany({
      where,
      include: {
        category: { select: { id: true, name: true } },
        sizes: true,
        spiceLevels: true,
        addOns: true,
        removeOptions: true,
        ingredients: true
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: filters.limit
    }),
    prisma.meal.count({ where })
  ]);
  return {
    meals,
    pagination: {
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit)
    }
  };
};
var getMyMealById = async (mealId, userId) => {
  const profile = await getProviderProfile(userId);
  const meal = await prisma.meal.findUnique({
    where: { id: mealId, providerId: profile.id },
    include: {
      category: true,
      sizes: true,
      spiceLevels: true,
      addOns: true,
      removeOptions: true,
      ingredients: true
    }
  });
  if (!meal) {
    throw new NotFoundError("Meal not found.");
  }
  return meal;
};
var createMeal = async (userId, payload, images) => {
  const profile = await getProviderProfile(userId);
  if (!images.mainImageURL) {
    throw new BadRequestError(
      "Main meal image is required."
    );
  }
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId, isActive: true },
    select: { id: true }
  });
  if (!category) {
    await deleteMultipleFromCloudinary([
      images.mainImageURL,
      ...images.galleryImageURLs ?? []
    ]);
    throw new NotFoundError(
      "Selected category not found or is inactive."
    );
  }
  const meal = await prisma.$transaction(async (tx) => {
    const createdMeal = await tx.meal.create({
      data: {
        providerId: profile.id,
        categoryId: payload.categoryId,
        name: payload.name,
        subcategory: payload.subcategory ?? null,
        shortDescription: payload.shortDescription,
        fullDescription: payload.fullDescription ?? null,
        portionSize: payload.portionSize ?? null,
        mainImageURL: images.mainImageURL,
        galleryImageURLs: images.galleryImageURLs ?? [],
        basePrice: payload.basePrice,
        discountPrice: payload.discountPrice ?? null,
        discountStartDate: payload.discountStartDate ? new Date(payload.discountStartDate) : null,
        discountEndDate: payload.discountEndDate ? new Date(payload.discountEndDate) : null,
        dietaryPreferences: payload.dietaryPreferences,
        allergens: payload.allergens,
        calories: payload.calories ?? null,
        protein: payload.protein ?? null,
        fat: payload.fat ?? null,
        carbohydrates: payload.carbohydrates ?? null,
        preparationTimeMinutes: payload.preparationTimeMinutes,
        deliveryFee: payload.deliveryFee,
        tags: payload.tags
      }
    });
    if (payload.sizes.length > 0) {
      await tx.mealSize.createMany({
        data: payload.sizes.map((s) => ({
          mealId: createdMeal.id,
          name: s.name,
          extraPrice: s.extraPrice,
          isDefault: s.isDefault
        }))
      });
    }
    if (payload.spiceLevels.length > 0) {
      await tx.mealSpiceLevel.createMany({
        data: payload.spiceLevels.map((s) => ({
          mealId: createdMeal.id,
          level: s.level,
          isDefault: s.isDefault
        }))
      });
    }
    if (payload.addOns.length > 0) {
      await tx.mealAddOn.createMany({
        data: payload.addOns.map((a) => ({
          mealId: createdMeal.id,
          name: a.name,
          price: a.price
        }))
      });
    }
    if (payload.removeOptions.length > 0) {
      await tx.mealRemoveOption.createMany({
        data: payload.removeOptions.map((r) => ({
          mealId: createdMeal.id,
          name: r.name
        }))
      });
    }
    if (payload.ingredients.length > 0) {
      await tx.mealIngredient.createMany({
        data: payload.ingredients.map((i) => ({
          mealId: createdMeal.id,
          name: i.name
        }))
      });
    }
    return createdMeal;
  });
  return prisma.meal.findUnique({
    where: { id: meal.id },
    include: {
      category: true,
      sizes: true,
      spiceLevels: true,
      addOns: true,
      removeOptions: true,
      ingredients: true
    }
  });
};
var updateMeal = async (mealId, userId, payload, newImages) => {
  const profile = await getProviderProfile(userId);
  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: payload.categoryId, isActive: true },
      select: { id: true }
    });
    if (!category) {
      await deleteMultipleFromCloudinary([
        ...newImages.mainImageURL ? [newImages.mainImageURL] : [],
        ...newImages.galleryImageURLs ?? []
      ]);
      throw new NotFoundError(
        "Selected category not found or is inactive."
      );
    }
  }
  const existingMeal = await prisma.meal.findUnique({
    where: { id: mealId, providerId: profile.id },
    select: {
      mainImageURL: true,
      galleryImageURLs: true
    }
  });
  if (!existingMeal) {
    throw new NotFoundError("Meal not found.");
  }
  const imageUpdateData = {};
  if (newImages.mainImageURL) {
    await deleteFromCloudinary(existingMeal.mainImageURL);
    imageUpdateData.mainImageURL = newImages.mainImageURL;
  }
  if (newImages.galleryImageURLs && newImages.galleryImageURLs.length > 0) {
    await deleteMultipleFromCloudinary(existingMeal.galleryImageURLs);
    imageUpdateData.galleryImageURLs = newImages.galleryImageURLs;
  }
  const updateData = {
    ...imageUpdateData
  };
  if (payload.categoryId !== void 0) {
    updateData.categoryId = payload.categoryId;
  }
  if (payload.name !== void 0) updateData.name = payload.name;
  if (payload.subcategory !== void 0) {
    updateData.subcategory = payload.subcategory ?? null;
  }
  if (payload.shortDescription !== void 0) {
    updateData.shortDescription = payload.shortDescription;
  }
  if (payload.fullDescription !== void 0) {
    updateData.fullDescription = payload.fullDescription ?? null;
  }
  if (payload.portionSize !== void 0) {
    updateData.portionSize = payload.portionSize ?? null;
  }
  if (payload.basePrice !== void 0) {
    updateData.basePrice = payload.basePrice;
  }
  if (payload.discountPrice !== void 0) {
    updateData.discountPrice = payload.discountPrice ?? null;
  }
  if (payload.discountStartDate !== void 0) {
    updateData.discountStartDate = payload.discountStartDate ? new Date(payload.discountStartDate) : null;
  }
  if (payload.discountEndDate !== void 0) {
    updateData.discountEndDate = payload.discountEndDate ? new Date(payload.discountEndDate) : null;
  }
  if (payload.dietaryPreferences !== void 0) {
    updateData.dietaryPreferences = payload.dietaryPreferences;
  }
  if (payload.allergens !== void 0) {
    updateData.allergens = payload.allergens;
  }
  if (payload.calories !== void 0) {
    updateData.calories = payload.calories ?? null;
  }
  if (payload.protein !== void 0) {
    updateData.protein = payload.protein ?? null;
  }
  if (payload.fat !== void 0) {
    updateData.fat = payload.fat ?? null;
  }
  if (payload.carbohydrates !== void 0) {
    updateData.carbohydrates = payload.carbohydrates ?? null;
  }
  if (payload.preparationTimeMinutes !== void 0) {
    updateData.preparationTimeMinutes = payload.preparationTimeMinutes;
  }
  if (payload.deliveryFee !== void 0) {
    updateData.deliveryFee = payload.deliveryFee;
  }
  if (payload.tags !== void 0) {
    updateData.tags = payload.tags;
  }
  if (payload.isAvailable !== void 0) {
    updateData.isAvailable = payload.isAvailable;
  }
  await prisma.$transaction(async (tx) => {
    await tx.meal.update({
      where: { id: mealId },
      data: updateData
    });
    if (payload.sizes !== void 0) {
      await tx.mealSize.deleteMany({ where: { mealId } });
      if (payload.sizes.length > 0) {
        await tx.mealSize.createMany({
          data: payload.sizes.map((s) => ({
            mealId,
            name: s.name,
            extraPrice: s.extraPrice,
            isDefault: s.isDefault
          }))
        });
      }
    }
    if (payload.spiceLevels !== void 0) {
      await tx.mealSpiceLevel.deleteMany({ where: { mealId } });
      if (payload.spiceLevels.length > 0) {
        await tx.mealSpiceLevel.createMany({
          data: payload.spiceLevels.map((s) => ({
            mealId,
            level: s.level,
            isDefault: s.isDefault
          }))
        });
      }
    }
    if (payload.addOns !== void 0) {
      await tx.mealAddOn.deleteMany({ where: { mealId } });
      if (payload.addOns.length > 0) {
        await tx.mealAddOn.createMany({
          data: payload.addOns.map((a) => ({
            mealId,
            name: a.name,
            price: a.price
          }))
        });
      }
    }
    if (payload.removeOptions !== void 0) {
      await tx.mealRemoveOption.deleteMany({ where: { mealId } });
      if (payload.removeOptions.length > 0) {
        await tx.mealRemoveOption.createMany({
          data: payload.removeOptions.map((r) => ({
            mealId,
            name: r.name
          }))
        });
      }
    }
    if (payload.ingredients !== void 0) {
      await tx.mealIngredient.deleteMany({ where: { mealId } });
      if (payload.ingredients.length > 0) {
        await tx.mealIngredient.createMany({
          data: payload.ingredients.map((i) => ({
            mealId,
            name: i.name
          }))
        });
      }
    }
  });
  return prisma.meal.findUnique({
    where: { id: mealId },
    include: {
      category: true,
      sizes: true,
      spiceLevels: true,
      addOns: true,
      removeOptions: true,
      ingredients: true
    }
  });
};
var toggleAvailability = async (mealId, userId, isAvailable) => {
  const profile = await getProviderProfile(userId);
  await getMealOwnership(mealId, profile.id);
  const updated = await prisma.meal.update({
    where: { id: mealId },
    data: { isAvailable },
    select: {
      id: true,
      name: true,
      isAvailable: true
    }
  });
  return updated;
};
var deleteMeal = async (mealId, userId) => {
  const profile = await getProviderProfile(userId);
  await getMealOwnership(mealId, profile.id);
  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
    select: {
      mainImageURL: true,
      galleryImageURLs: true
    }
  });
  if (!meal) throw new NotFoundError("Meal not found.");
  await prisma.meal.update({
    where: { id: mealId },
    data: { isActive: false }
  });
  await deleteFromCloudinary(meal.mainImageURL);
  await deleteMultipleFromCloudinary(meal.galleryImageURLs);
};
var deleteGalleryImage = async (mealId, userId, imageURL) => {
  const profile = await getProviderProfile(userId);
  await getMealOwnership(mealId, profile.id);
  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
    select: { galleryImageURLs: true }
  });
  if (!meal) throw new NotFoundError("Meal not found.");
  if (!meal.galleryImageURLs.includes(imageURL)) {
    throw new NotFoundError(
      "Image not found in gallery."
    );
  }
  await deleteFromCloudinary(imageURL);
  const updatedGallery = meal.galleryImageURLs.filter(
    (url) => url !== imageURL
  );
  const updated = await prisma.meal.update({
    where: { id: mealId },
    data: { galleryImageURLs: updatedGallery },
    select: {
      id: true,
      galleryImageURLs: true
    }
  });
  return updated;
};
var MealService = {
  getMyMeals,
  getMyMealById,
  createMeal,
  updateMeal,
  toggleAvailability,
  deleteMeal,
  deleteGalleryImage
};

// src/modules/meal/meal.controller.ts
import status6 from "http-status";
var getMyMeals2 = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const isAvailable = req.query.isAvailable !== void 0 ? req.query.isAvailable === "true" : void 0;
    const categoryId = req.query.categoryId;
    const search = req.query.search;
    const filterObject = {
      page,
      limit
    };
    if (isAvailable !== void 0) filterObject.isAvailable = isAvailable;
    if (categoryId !== void 0) filterObject.categoryId = categoryId;
    if (search !== void 0) filterObject.search = search;
    const result = await MealService.getMyMeals(req.user.id, filterObject);
    sendResponse(res, {
      httpStatusCode: status6.OK,
      success: true,
      message: "Meals fetched successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getMyMealById2 = async (req, res, next) => {
  try {
    const result = await MealService.getMyMealById(
      req.params.id,
      req.user.id
    );
    sendResponse(res, {
      httpStatusCode: status6.OK,
      success: true,
      message: "Meal fetched successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var createMeal2 = async (req, res, next) => {
  try {
    const payload = req.body;
    const images = extractMealImages(req);
    const result = await MealService.createMeal(
      req.user.id,
      payload,
      images
    );
    sendResponse(res, {
      httpStatusCode: status6.CREATED,
      success: true,
      message: "Meal created successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateMeal2 = async (req, res, next) => {
  try {
    const payload = req.body;
    const images = extractMealImages(req);
    const result = await MealService.updateMeal(
      req.params.id,
      req.user.id,
      payload,
      images
    );
    sendResponse(res, {
      httpStatusCode: status6.OK,
      success: true,
      message: "Meal updated successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var toggleAvailability2 = async (req, res, next) => {
  try {
    const { isAvailable } = req.body;
    const result = await MealService.toggleAvailability(
      req.params.id,
      req.user.id,
      isAvailable
    );
    sendResponse(res, {
      httpStatusCode: status6.OK,
      success: true,
      message: `Meal marked as ${isAvailable ? "available" : "unavailable"}.`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var deleteMeal2 = async (req, res, next) => {
  try {
    await MealService.deleteMeal(req.params.id, req.user.id);
    sendResponse(res, {
      httpStatusCode: status6.OK,
      success: true,
      message: "Meal deleted successfully.",
      data: null
    });
  } catch (error) {
    next(error);
  }
};
var deleteGalleryImage2 = async (req, res, next) => {
  try {
    const { imageURL } = req.body;
    const result = await MealService.deleteGalleryImage(
      req.params.id,
      req.user.id,
      imageURL
    );
    sendResponse(res, {
      httpStatusCode: status6.OK,
      success: true,
      message: "Gallery image deleted successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var MealController = {
  getMyMeals: getMyMeals2,
  getMyMealById: getMyMealById2,
  createMeal: createMeal2,
  updateMeal: updateMeal2,
  toggleAvailability: toggleAvailability2,
  deleteMeal: deleteMeal2,
  deleteGalleryImage: deleteGalleryImage2
};

// src/middlewares/providerGuard.middleware.ts
var providerGuard = async (req, res, next) => {
  try {
    const profile = await prisma.providerProfile.findUnique({
      where: { userId: req.user.id },
      select: {
        approvalStatus: true,
        rejectionReason: true
      }
    });
    if (!profile) {
      throw new NotFoundError(
        "Please complete your provider profile first."
      );
    }
    if (profile.approvalStatus === "DRAFT") {
      throw new ForbiddenError(
        "Please complete your profile and request for approval before accessing this feature."
      );
    }
    if (profile.approvalStatus === "PENDING") {
      throw new ForbiddenError(
        "Your provider profile is under review. You will be notified within 2 to 3 business days from the date of submission."
      );
    }
    if (profile.approvalStatus === "REJECTED") {
      throw new ForbiddenError(
        `Your provider profile was rejected. Reason: ${profile.rejectionReason ?? "No reason provided"}. Please update and resubmit.`
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};
var providerGuard_middleware_default = providerGuard;

// src/modules/meal/meal.validation.ts
import { z as z4 } from "zod";
var mealSizeSchema = z4.object({
  name: z4.string().min(1, "Size name is required.").max(30, "Size name too long."),
  extraPrice: z4.coerce.number().int("Extra price must be a whole number.").min(0, "Extra price cannot be negative.").default(0),
  isDefault: z4.boolean().default(false)
});
var mealSpiceLevelSchema = z4.object({
  level: z4.string().min(1, "Spice level name is required.").max(30, "Spice level name too long."),
  isDefault: z4.boolean().default(false)
});
var mealAddOnSchema = z4.object({
  name: z4.string().min(1, "Add-on name is required.").max(50, "Add-on name too long."),
  price: z4.coerce.number().int("Price must be a whole number.").min(1, "Add-on price must be at least 1.")
});
var mealRemoveOptionSchema = z4.object({
  name: z4.string().min(1, "Remove option name is required.").max(50, "Remove option name too long.")
});
var mealIngredientSchema = z4.object({
  name: z4.string().min(1, "Ingredient name is required.").max(100, "Ingredient name too long.")
});
var createMealSchema = z4.object({
  categoryId: z4.uuid("Invalid category ID."),
  name: z4.string().min(1, "Meal name is required.").min(2, "Meal name must be at least 2 characters.").max(100, "Meal name cannot exceed 100 characters."),
  subcategory: z4.string().max(50, "Subcategory cannot exceed 50 characters.").nullish(),
  shortDescription: z4.string().min(1, "Short description is required.").min(10, "Short description must be at least 10 characters.").max(200, "Short description cannot exceed 200 characters."),
  fullDescription: z4.string().max(2e3, "Full description cannot exceed 2000 characters.").nullish(),
  portionSize: z4.string().max(50, "Portion size cannot exceed 50 characters.").nullish(),
  basePrice: z4.coerce.number().int("Base price must be a whole number.").min(1, "Base price must be at least 1 BDT."),
  discountPrice: z4.coerce.number().int("Discount price must be a whole number.").min(1, "Discount price must be at least 1 BDT.").nullish(),
  discountStartDate: z4.iso.datetime("Invalid start date format. Use ISO 8601.").nullish(),
  discountEndDate: z4.iso.datetime("Invalid end date format. Use ISO 8601.").nullish(),
  dietaryPreferences: z4.array(
    z4.enum([
      "VEGAN",
      "VEGETARIAN",
      "HALAL",
      "GLUTEN_FREE",
      "DAIRY_FREE",
      "NUT_FREE",
      "ORGANIC",
      "LOW_CARB",
      "KETO",
      "PALEO",
      "LOW_FAT",
      "HIGH_PROTEIN",
      "LOW_SUGAR",
      "SUGAR_FREE",
      "FODMAP_FREE"
    ])
  ).default([]),
  allergens: z4.array(z4.string().min(1).max(50)).default([]),
  // nutrition — all optional
  calories: z4.coerce.number().int().min(0).nullish(),
  protein: z4.coerce.number().min(0).nullish(),
  fat: z4.coerce.number().min(0).nullish(),
  carbohydrates: z4.coerce.number().min(0).nullish(),
  preparationTimeMinutes: z4.coerce.number().int().min(1, "Preparation time must be at least 1 minute.").max(180, "Preparation time cannot exceed 180 minutes.").default(15),
  deliveryFee: z4.coerce.number().int().min(0).default(0),
  tags: z4.array(z4.string().min(1).max(30)).max(10, "Cannot have more than 10 tags.").default([]),
  // customization
  sizes: z4.array(mealSizeSchema).max(5, "Cannot have more than 5 size options.").default([]),
  spiceLevels: z4.array(mealSpiceLevelSchema).max(5, "Cannot have more than 5 spice levels.").default([]),
  addOns: z4.array(mealAddOnSchema).max(10, "Cannot have more than 10 add-ons.").default([]),
  removeOptions: z4.array(mealRemoveOptionSchema).max(10, "Cannot have more than 10 remove options.").default([]),
  ingredients: z4.array(mealIngredientSchema).max(30, "Cannot have more than 30 ingredients.").default([])
}).refine(
  (data) => {
    if (data.discountPrice != null && data.discountPrice >= data.basePrice) {
      return false;
    }
    return true;
  },
  {
    message: "Discount price must be less than base price.",
    path: ["discountPrice"]
  }
).refine(
  (data) => {
    if (data.discountPrice != null && data.discountPrice <= 0) {
      return false;
    }
    return true;
  },
  {
    message: "Discount price must be greater than 0.",
    path: ["discountPrice"]
  }
).refine(
  (data) => {
    const hasDateWithoutDiscount = (data.discountStartDate != null || data.discountEndDate != null) && data.discountPrice == null;
    return !hasDateWithoutDiscount;
  },
  {
    message: "Discount dates can only be set when a discount price is provided.",
    path: ["discountStartDate"]
  }
).refine(
  (data) => {
    const hasStart = data.discountStartDate != null;
    const hasEnd = data.discountEndDate != null;
    if (hasStart !== hasEnd) return false;
    return true;
  },
  {
    message: "Both discount start date and end date must be provided together.",
    path: ["discountEndDate"]
  }
).refine(
  (data) => {
    if (data.discountStartDate != null && data.discountEndDate != null) {
      return new Date(data.discountEndDate) > new Date(data.discountStartDate);
    }
    return true;
  },
  {
    message: "Discount end date must be after start date.",
    path: ["discountEndDate"]
  }
).refine(
  (data) => {
    if (data.discountEndDate != null) {
      return new Date(data.discountEndDate) > /* @__PURE__ */ new Date();
    }
    return true;
  },
  {
    message: "Discount end date must be in the future.",
    path: ["discountEndDate"]
  }
).refine(
  (data) => {
    if (data.sizes.length > 0) {
      const defaultCount = data.sizes.filter(
        (s) => s.isDefault
      ).length;
      return defaultCount === 1;
    }
    return true;
  },
  {
    message: "Exactly one size must be marked as default when sizes are provided.",
    path: ["sizes"]
  }
).refine(
  (data) => {
    if (data.spiceLevels.length > 0) {
      const defaultCount = data.spiceLevels.filter(
        (s) => s.isDefault
      ).length;
      return defaultCount === 1;
    }
    return true;
  },
  {
    message: "Exactly one spice level must be marked as default when spice levels are provided.",
    path: ["spiceLevels"]
  }
);
var updateMealSchema = z4.object({
  categoryId: z4.uuid("Invalid category ID.").optional(),
  name: z4.string().min(2).max(100).optional(),
  subcategory: z4.string().max(50).nullish(),
  shortDescription: z4.string().min(10).max(200).optional(),
  fullDescription: z4.string().max(2e3).nullish(),
  portionSize: z4.string().max(50).nullish(),
  basePrice: z4.coerce.number().int().min(1).optional(),
  discountPrice: z4.coerce.number().int().min(1).nullish(),
  discountStartDate: z4.iso.datetime("Invalid start date format.").nullish(),
  discountEndDate: z4.iso.datetime("Invalid end date format.").nullish(),
  dietaryPreferences: z4.array(
    z4.enum([
      "VEGAN",
      "VEGETARIAN",
      "HALAL",
      "GLUTEN_FREE",
      "DAIRY_FREE",
      "NUT_FREE"
    ])
  ).optional(),
  allergens: z4.array(z4.string().min(1).max(50)).optional(),
  calories: z4.coerce.number().int().min(0).nullish(),
  protein: z4.coerce.number().min(0).nullish(),
  fat: z4.coerce.number().min(0).nullish(),
  carbohydrates: z4.coerce.number().min(0).nullish(),
  preparationTimeMinutes: z4.coerce.number().int().min(1).max(180).optional(),
  deliveryFee: z4.coerce.number().int().min(0).optional(),
  tags: z4.array(z4.string().min(1).max(30)).max(10).optional(),
  isAvailable: z4.preprocess(
    (val) => val === "true" || val === true,
    z4.boolean()
  ).optional(),
  sizes: z4.array(mealSizeSchema).max(5).optional(),
  spiceLevels: z4.array(mealSpiceLevelSchema).max(5).optional(),
  addOns: z4.array(mealAddOnSchema).max(10).optional(),
  removeOptions: z4.array(mealRemoveOptionSchema).max(10).optional(),
  ingredients: z4.array(mealIngredientSchema).max(30).optional()
}).refine(
  (data) => {
    if (data.discountPrice !== null && data.discountPrice !== void 0 && data.basePrice !== void 0 && data.discountPrice >= data.basePrice) {
      return false;
    }
    return true;
  },
  {
    message: "Discount price must be less than base price.",
    path: ["discountPrice"]
  }
).refine(
  (data) => {
    if (data.discountPrice != null && data.basePrice !== void 0 && data.discountPrice >= data.basePrice) {
      return false;
    }
    return true;
  },
  {
    message: "Discount price must be less than base price.",
    path: ["discountPrice"]
  }
).refine(
  (data) => {
    const hasDateWithoutDiscount = (data.discountStartDate != null || data.discountEndDate != null) && data.discountPrice === null;
    return !hasDateWithoutDiscount;
  },
  {
    message: "Discount dates can only be set when a discount price is provided.",
    path: ["discountStartDate"]
  }
).refine(
  (data) => {
    const hasStart = data.discountStartDate != null;
    const hasEnd = data.discountEndDate != null;
    if (data.discountPrice != null && hasStart !== hasEnd) {
      return false;
    }
    return true;
  },
  {
    message: "Both start and end date must be provided together.",
    path: ["discountEndDate"]
  }
).refine(
  (data) => {
    if (data.discountStartDate != null && data.discountEndDate != null) {
      return new Date(data.discountEndDate) > new Date(data.discountStartDate);
    }
    return true;
  },
  {
    message: "End date must be after start date.",
    path: ["discountEndDate"]
  }
).refine(
  (data) => {
    if (data.discountEndDate != null) {
      return new Date(data.discountEndDate) > /* @__PURE__ */ new Date();
    }
    return true;
  },
  {
    message: "Discount end date must be in the future.",
    path: ["discountEndDate"]
  }
);
var toggleAvailabilitySchema = z4.object({
  isAvailable: z4.boolean({
    error: "isAvailable must be a boolean."
  })
});

// src/modules/meal/meal.routes.ts
var router5 = Router5();
router5.use(
  auth_middleware_default("PROVIDER" /* PROVIDER */),
  providerGuard_middleware_default
);
router5.get(
  "/",
  MealController.getMyMeals
);
router5.get(
  "/:id",
  MealController.getMyMealById
);
router5.post(
  "/",
  auth_middleware_default("PROVIDER" /* PROVIDER */),
  providerGuard_middleware_default,
  uploadMealImages,
  // 1. process images
  validateRequest_default(createMealSchema),
  // 2. validate text
  MealController.createMeal
  // 3. handle
);
router5.patch(
  "/:id",
  uploadMealImagesOptional,
  validateRequest_default(updateMealSchema),
  MealController.updateMeal
);
router5.patch(
  "/:id/availability",
  validateRequest_default(toggleAvailabilitySchema),
  MealController.toggleAvailability
);
router5.delete(
  "/:id",
  MealController.deleteMeal
);
router5.delete(
  "/:id/gallery",
  MealController.deleteGalleryImage
);
var MealRoutes = router5;

// src/modules/customer/customer.routes.ts
import { Router as Router6 } from "express";

// src/modules/customer/customer.controller.ts
import status7 from "http-status";

// src/modules/customer/customer.service.ts
var normalizeCity = (city) => city.trim().toUpperCase();
var getMyProfile3 = async (userId) => {
  const profile = await prisma.customerProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          emailVerified: true,
          status: true,
          role: true
        }
      }
    }
  });
  return profile;
};
var createCustomerProfile = async (userId, payload) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      status: true,
      isDeleted: true,
      emailVerified: true,
      phone: true
    }
  });
  if (!user) {
    throw new NotFoundError("User not found.");
  }
  if (user.isDeleted) {
    throw new ForbiddenError("This account has been deleted.");
  }
  if (user.status === "SUSPENDED") {
    throw new ForbiddenError(
      "Your account is suspended. Please contact support."
    );
  }
  if (!user.emailVerified) {
    throw new ForbiddenError(
      "Please verify your email address before creating your profile."
    );
  }
  if (user.role !== "CUSTOMER") {
    throw new ForbiddenError(
      "Only customer accounts can create a customer profile."
    );
  }
  const existingProfile = await prisma.customerProfile.findUnique({
    where: { userId },
    select: { id: true }
  });
  if (existingProfile) {
    throw new ConflictError(
      "You already have a customer profile. Use the update endpoint instead."
    );
  }
  const profile = await prisma.customerProfile.create({
    data: {
      user: { connect: { id: userId } },
      phone: payload.phone ?? user.phone ?? null,
      city: normalizeCity(payload.city),
      streetAddress: payload.streetAddress,
      houseNumber: payload.houseNumber ?? null,
      apartment: payload.apartment ?? null,
      postalCode: payload.postalCode ?? null,
      latitude: payload.latitude ?? null,
      longitude: payload.longitude ?? null
    }
  });
  return profile;
};
var updateCustomerProfile = async (userId, payload) => {
  const profile = await prisma.customerProfile.findUnique({
    where: { userId },
    select: { id: true }
  });
  if (!profile) {
    throw new NotFoundError(
      "Customer profile not found. Please create your profile first."
    );
  }
  const updateData = {};
  if (payload.phone !== void 0) {
    updateData.phone = payload.phone ?? null;
  }
  if (payload.city !== void 0) {
    updateData.city = normalizeCity(payload.city);
  }
  if (payload.streetAddress !== void 0) {
    updateData.streetAddress = payload.streetAddress;
  }
  if (payload.houseNumber !== void 0) {
    updateData.houseNumber = payload.houseNumber ?? null;
  }
  if (payload.apartment !== void 0) {
    updateData.apartment = payload.apartment ?? null;
  }
  if (payload.postalCode !== void 0) {
    updateData.postalCode = payload.postalCode ?? null;
  }
  if (payload.latitude !== void 0) {
    updateData.latitude = payload.latitude;
  }
  if (payload.longitude !== void 0) {
    updateData.longitude = payload.longitude;
  }
  const updatedProfile = await prisma.customerProfile.update({
    where: { userId },
    data: updateData
  });
  return updatedProfile;
};
var CustomerService = {
  getMyProfile: getMyProfile3,
  createCustomerProfile,
  updateCustomerProfile
};

// src/modules/customer/customer.controller.ts
var getMyProfile4 = async (req, res, next) => {
  try {
    const result = await CustomerService.getMyProfile(req.user.id);
    sendResponse(res, {
      httpStatusCode: status7.OK,
      success: true,
      message: result ? "Customer profile fetched successfully." : "No customer profile found. Please complete your profile setup.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var createProfile2 = async (req, res, next) => {
  try {
    const payload = req.body;
    const result = await CustomerService.createCustomerProfile(
      req.user.id,
      payload
    );
    sendResponse(res, {
      httpStatusCode: status7.CREATED,
      success: true,
      message: "Customer profile created successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateProfile2 = async (req, res, next) => {
  try {
    const payload = req.body;
    const result = await CustomerService.updateCustomerProfile(
      req.user.id,
      payload
    );
    sendResponse(res, {
      httpStatusCode: status7.OK,
      success: true,
      message: "Customer profile updated successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var CustomerController = {
  getMyProfile: getMyProfile4,
  createProfile: createProfile2,
  updateProfile: updateProfile2
};

// src/modules/customer/customer.validation.ts
import { z as z5 } from "zod";
var emptyToUndefined = (value) => {
  if (typeof value === "string" && value.trim() === "") {
    return void 0;
  }
  return value;
};
var createCustomerProfileSchema = z5.object({
  phone: z5.preprocess(emptyToUndefined, z5.string().min(8, "Phone number must be at least 8 digits.").max(14, "Phone number cannot exceed 14 digits.").regex(/^[0-9+\-\s()]+$/, "Please provide a valid phone number.")),
  city: z5.string().trim().min(2, "City is required and must be at least 2 characters."),
  streetAddress: z5.string().trim().min(3, "Street address is required."),
  houseNumber: z5.preprocess(emptyToUndefined, z5.string().trim().min(1, "House number is required")),
  apartment: z5.preprocess(emptyToUndefined, z5.string().trim().optional()),
  postalCode: z5.preprocess(emptyToUndefined, z5.string().trim()),
  latitude: z5.preprocess(
    (value) => value === "" || value === void 0 || value === null ? void 0 : Number(value),
    z5.number().min(-90).max(90).optional()
  ),
  longitude: z5.preprocess(
    (value) => value === "" || value === void 0 || value === null ? void 0 : Number(value),
    z5.number().min(-180).max(180).optional()
  )
});
var updateCustomerProfileSchema = z5.object({
  phone: z5.preprocess(emptyToUndefined, z5.string().min(8, "Phone number must be at least 8 digits.").max(14, "Phone number cannot exceed 14 digits.").regex(/^[0-9+\-\s()]+$/, "Please provide a valid phone number.").optional()),
  city: z5.string().trim().min(2, "City must be at least 2 characters.").optional(),
  streetAddress: z5.string().trim().min(3, "Street address must be at least 3 characters.").optional(),
  houseNumber: z5.preprocess(emptyToUndefined, z5.string().trim().optional()),
  apartment: z5.preprocess(emptyToUndefined, z5.string().trim().optional()),
  postalCode: z5.preprocess(emptyToUndefined, z5.string().trim().optional()),
  latitude: z5.preprocess(
    (value) => value === "" || value === void 0 || value === null ? void 0 : Number(value),
    z5.number().min(-90).max(90).optional()
  ),
  longitude: z5.preprocess(
    (value) => value === "" || value === void 0 || value === null ? void 0 : Number(value),
    z5.number().min(-180).max(180).optional()
  )
});

// src/modules/customer/customer.routes.ts
var router6 = Router6();
router6.get(
  "/profile/me",
  auth_middleware_default("CUSTOMER" /* CUSTOMER */),
  CustomerController.getMyProfile
);
router6.post(
  "/profile",
  auth_middleware_default("CUSTOMER" /* CUSTOMER */),
  validateRequest_default(createCustomerProfileSchema),
  CustomerController.createProfile
);
router6.patch(
  "/profile",
  auth_middleware_default("CUSTOMER" /* CUSTOMER */),
  validateRequest_default(updateCustomerProfileSchema),
  CustomerController.updateProfile
);
var CustomerRoutes = router6;

// src/modules/cart/cart.routes.ts
import { Router as Router7 } from "express";

// src/modules/cart/cart.controller.ts
import status8 from "http-status";

// src/utils/discount.util.ts
var computeDiscount = (meal) => {
  const now = /* @__PURE__ */ new Date();
  if (meal.discountPrice === null) {
    return {
      effectivePrice: meal.basePrice,
      discountPrice: null,
      discountPercentage: null,
      isDiscountActive: false,
      discountStartDate: null,
      discountEndDate: null
    };
  }
  let isDiscountActive = true;
  if (meal.discountStartDate !== null && meal.discountEndDate !== null) {
    isDiscountActive = now >= meal.discountStartDate && now <= meal.discountEndDate;
  }
  if (!isDiscountActive) {
    return {
      effectivePrice: meal.basePrice,
      discountPrice: meal.discountPrice,
      discountPercentage: null,
      isDiscountActive: false,
      discountStartDate: meal.discountStartDate,
      discountEndDate: meal.discountEndDate
    };
  }
  const discountPercentage = Math.round(
    (meal.basePrice - meal.discountPrice) / meal.basePrice * 100
  );
  return {
    effectivePrice: meal.discountPrice,
    discountPrice: meal.discountPrice,
    discountPercentage,
    isDiscountActive: true,
    discountStartDate: meal.discountStartDate,
    discountEndDate: meal.discountEndDate
  };
};

// src/modules/cart/cart.service.ts
var normalizeCity2 = (city) => city.trim().toUpperCase();
var getCustomerProfileOrThrow = async (userId) => {
  const customerProfile = await prisma.customerProfile.findUnique({
    where: { userId }
  });
  if (!customerProfile) {
    throw new ForbiddenError(
      "Please complete your customer profile before using the cart."
    );
  }
  return customerProfile;
};
var recalculateCartTotals = async (tx, cartId) => {
  const items = await tx.cartItem.findMany({
    where: { cartId },
    include: {
      meal: {
        select: {
          deliveryFee: true
        }
      }
    }
  });
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.totalPrice),
    0
  );
  const discountAmount = items.reduce(
    (sum, item) => sum + (Number(item.baseUnitPrice) - Number(item.unitPrice)) * item.quantity,
    0
  );
  const deliveryFee = items.length > 0 ? Math.max(...items.map((item) => Number(item.meal.deliveryFee || 0))) : 0;
  const totalAmount = subtotal + deliveryFee;
  await tx.cart.update({
    where: { id: cartId },
    data: {
      subtotal,
      discountAmount,
      deliveryFee,
      totalAmount
    }
  });
  const updatedCart = await tx.cart.findUnique({
    where: { id: cartId },
    include: {
      provider: {
        select: {
          id: true,
          businessName: true,
          city: true,
          imageURL: true
        }
      },
      cartItems: {
        include: {
          meal: {
            select: {
              id: true,
              name: true,
              mainImageURL: true,
              basePrice: true,
              discountPrice: true,
              deliveryFee: true,
              isAvailable: true,
              isActive: true
            }
          }
        },
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  });
  if (!updatedCart) {
    throw new NotFoundError("Cart not found after recalculation.");
  }
  return updatedCart;
};
var getMyCart = async (userId) => {
  const customerProfile = await getCustomerProfileOrThrow(userId);
  const cart = await prisma.cart.findUnique({
    where: {
      customerId: customerProfile.id
    },
    include: {
      provider: {
        select: {
          id: true,
          businessName: true,
          city: true,
          imageURL: true
        }
      },
      cartItems: {
        include: {
          meal: {
            select: {
              id: true,
              name: true,
              mainImageURL: true,
              basePrice: true,
              discountPrice: true,
              deliveryFee: true,
              isAvailable: true,
              isActive: true
            }
          }
        },
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  });
  return cart;
};
var addItem = async (userId, payload) => {
  const customerProfile = await getCustomerProfileOrThrow(userId);
  const meal = await prisma.meal.findUnique({
    where: { id: payload.mealId },
    include: {
      provider: {
        select: {
          id: true,
          businessName: true,
          city: true,
          approvalStatus: true,
          isActive: true
        }
      }
    }
  });
  if (!meal) {
    throw new NotFoundError("Meal not found.");
  }
  if (!meal.isActive || !meal.isAvailable) {
    throw new BadRequestError("This meal is currently unavailable.");
  }
  if (!meal.provider.isActive || meal.provider.approvalStatus !== "APPROVED") {
    throw new BadRequestError(
      "This provider is not currently available for orders."
    );
  }
  const customerCity = normalizeCity2(customerProfile.city);
  const providerCity = normalizeCity2(meal.provider.city);
  if (customerCity !== providerCity) {
    throw new ForbiddenError(
      `This provider only serves customers in ${meal.provider.city}.`
    );
  }
  const quantity = payload.quantity ?? 1;
  const discountInfo = computeDiscount({
    basePrice: Number(meal.basePrice),
    discountPrice: meal.discountPrice !== null && meal.discountPrice !== void 0 ? Number(meal.discountPrice) : null,
    discountStartDate: meal.discountStartDate,
    discountEndDate: meal.discountEndDate
  });
  const unitPrice = discountInfo.effectivePrice;
  const baseUnitPrice = Number(meal.basePrice);
  const totalPrice = unitPrice * quantity;
  const result = await prisma.$transaction(async (tx) => {
    let cart = await tx.cart.findUnique({
      where: { customerId: customerProfile.id }
    });
    if (cart && cart.providerId !== meal.providerId) {
      throw new ConflictError(
        "Your cart already contains items from another provider. Clear the cart first."
      );
    }
    if (!cart) {
      cart = await tx.cart.create({
        data: {
          customerId: customerProfile.id,
          providerId: meal.providerId,
          subtotal: 0,
          deliveryFee: 0,
          discountAmount: 0,
          totalAmount: 0
        }
      });
    }
    const existingItem = await tx.cartItem.findUnique({
      where: {
        cartId_mealId: {
          cartId: cart.id,
          mealId: meal.id
        }
      }
    });
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      await tx.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: newQuantity,
          baseUnitPrice,
          unitPrice,
          totalPrice: unitPrice * newQuantity
        }
      });
    } else {
      await tx.cartItem.create({
        data: {
          cartId: cart.id,
          mealId: meal.id,
          quantity,
          baseUnitPrice,
          unitPrice,
          totalPrice
        }
      });
    }
    return recalculateCartTotals(tx, cart.id);
  });
  return result;
};
var updateItemQuantity = async (userId, itemId, payload) => {
  const customerProfile = await getCustomerProfileOrThrow(userId);
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: {
      cart: true,
      meal: true
    }
  });
  if (!item) {
    throw new NotFoundError("Cart item not found.");
  }
  if (item.cart.customerId !== customerProfile.id) {
    throw new ForbiddenError("You cannot modify another customer's cart.");
  }
  if (!item.meal.isActive || !item.meal.isAvailable) {
    throw new BadRequestError("This meal is currently unavailable.");
  }
  const discountInfo = computeDiscount({
    basePrice: Number(item.meal.basePrice),
    discountPrice: item.meal.discountPrice !== null && item.meal.discountPrice !== void 0 ? Number(item.meal.discountPrice) : null,
    discountStartDate: item.meal.discountStartDate,
    discountEndDate: item.meal.discountEndDate
  });
  const unitPrice = discountInfo.effectivePrice;
  const baseUnitPrice = Number(item.meal.basePrice);
  const totalPrice = unitPrice * payload.quantity;
  const result = await prisma.$transaction(async (tx) => {
    await tx.cartItem.update({
      where: { id: item.id },
      data: {
        quantity: payload.quantity,
        baseUnitPrice,
        unitPrice,
        totalPrice
      }
    });
    return recalculateCartTotals(tx, item.cartId);
  });
  return result;
};
var removeItem = async (userId, itemId) => {
  const customerProfile = await getCustomerProfileOrThrow(userId);
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: {
      cart: true
    }
  });
  if (!item) {
    throw new NotFoundError("Cart item not found.");
  }
  if (item.cart.customerId !== customerProfile.id) {
    throw new ForbiddenError("You cannot modify another customer's cart.");
  }
  const result = await prisma.$transaction(async (tx) => {
    await tx.cartItem.delete({
      where: { id: item.id }
    });
    const remainingCount = await tx.cartItem.count({
      where: { cartId: item.cartId }
    });
    if (remainingCount === 0) {
      await tx.cart.delete({
        where: { id: item.cartId }
      });
      return null;
    }
    return recalculateCartTotals(tx, item.cartId);
  });
  return result;
};
var clearCart = async (userId) => {
  const customerProfile = await getCustomerProfileOrThrow(userId);
  const cart = await prisma.cart.findUnique({
    where: { customerId: customerProfile.id },
    select: { id: true }
  });
  if (!cart) {
    return null;
  }
  await prisma.cart.delete({
    where: { id: cart.id }
  });
  return null;
};
var CartService = {
  getMyCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart
};

// src/modules/cart/cart.controller.ts
var getMyCart2 = async (req, res, next) => {
  try {
    const result = await CartService.getMyCart(req.user.id);
    sendResponse(res, {
      httpStatusCode: status8.OK,
      success: true,
      message: result ? "Cart fetched successfully." : "Cart is empty.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var addItem2 = async (req, res, next) => {
  try {
    const payload = req.body;
    const result = await CartService.addItem(req.user.id, payload);
    sendResponse(res, {
      httpStatusCode: status8.OK,
      success: true,
      message: "Item added to cart successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateItemQuantity2 = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const payload = req.body;
    const result = await CartService.updateItemQuantity(
      req.user.id,
      itemId,
      payload
    );
    sendResponse(res, {
      httpStatusCode: status8.OK,
      success: true,
      message: "Cart item quantity updated successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var removeItem2 = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const result = await CartService.removeItem(req.user.id, itemId);
    sendResponse(res, {
      httpStatusCode: status8.OK,
      success: true,
      message: result ? "Cart item removed successfully." : "Cart cleared successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var clearCart2 = async (req, res, next) => {
  try {
    await CartService.clearCart(req.user.id);
    sendResponse(res, {
      httpStatusCode: status8.OK,
      success: true,
      message: "Cart cleared successfully.",
      data: null
    });
  } catch (error) {
    next(error);
  }
};
var CartController = {
  getMyCart: getMyCart2,
  addItem: addItem2,
  updateItemQuantity: updateItemQuantity2,
  removeItem: removeItem2,
  clearCart: clearCart2
};

// src/modules/cart/cart.validation.ts
import { z as z6 } from "zod";
var addCartItemSchema = z6.object({
  mealId: z6.uuid("Valid mealId is required."),
  quantity: z6.number().int().min(1).max(20).default(1)
});
var updateCartItemQuantitySchema = z6.object({
  quantity: z6.number().int().min(1).max(20)
});

// src/modules/cart/cart.routes.ts
var router7 = Router7();
router7.get(
  "/",
  auth_middleware_default("CUSTOMER" /* CUSTOMER */),
  CartController.getMyCart
);
router7.post(
  "/items",
  auth_middleware_default("CUSTOMER" /* CUSTOMER */),
  validateRequest_default(addCartItemSchema),
  CartController.addItem
);
router7.patch(
  "/items/:itemId",
  auth_middleware_default("CUSTOMER" /* CUSTOMER */),
  validateRequest_default(updateCartItemQuantitySchema),
  CartController.updateItemQuantity
);
router7.delete(
  "/items/:itemId",
  auth_middleware_default("CUSTOMER" /* CUSTOMER */),
  CartController.removeItem
);
router7.delete(
  "/",
  auth_middleware_default("CUSTOMER" /* CUSTOMER */),
  CartController.clearCart
);
var CartRoutes = router7;

// src/modules/order/order.routes.ts
import { Router as Router8 } from "express";

// src/modules/order/order.controller.ts
import status9 from "http-status";

// src/modules/order/order.constants.ts
var ORDER_STATUS_TRANSITIONS = {
  PENDING_PAYMENT: ["PLACED", "CANCELLED"],
  PLACED: ["ACCEPTED", "CANCELLED"],
  ACCEPTED: ["PREPARING", "CANCELLED"],
  PREPARING: ["OUT_FOR_DELIVERY"],
  // provider cannot cancel once preparing
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
  REFUNDED: []
};
var CUSTOMER_CANCELLABLE_STATUSES = [
  "PENDING_PAYMENT",
  "PLACED",
  "ACCEPTED"
];

// src/modules/order/order.event.ts
import { EventEmitter } from "events";
var OrderEventBus = class extends EventEmitter {
  emitOrderUpdate(payload) {
    this.emit(`order:${payload.orderId}`, payload);
  }
  subscribe(orderId, listener) {
    this.on(`order:${orderId}`, listener);
  }
  unsubscribe(orderId, listener) {
    this.off(`order:${orderId}`, listener);
  }
};
var orderEventBus = new OrderEventBus();

// src/modules/order/order.service.ts
var normalizeCity3 = (city) => city.trim().toUpperCase();
var getCustomerProfileOrThrow2 = async (userId) => {
  const customerProfile = await prisma.customerProfile.findUnique({
    where: { userId }
  });
  if (!customerProfile) {
    throw new ForbiddenError(
      "Please complete your customer profile before checkout."
    );
  }
  return customerProfile;
};
var getCartOrThrow = async (customerProfileId) => {
  const cart = await prisma.cart.findUnique({
    where: { customerId: customerProfileId },
    include: {
      provider: true,
      cartItems: {
        include: { meal: true },
        orderBy: { createdAt: "asc" }
      }
    }
  });
  if (!cart || cart.cartItems.length === 0) {
    throw new BadRequestError("Your cart is empty.");
  }
  return cart;
};
var buildValidatedCheckoutState = async (userId, payload) => {
  const customerProfile = await getCustomerProfileOrThrow2(userId);
  const cart = await getCartOrThrow(customerProfile.id);
  if (!cart.provider.isActive || cart.provider.approvalStatus !== "APPROVED") {
    throw new BadRequestError("This provider is not available for checkout.");
  }
  const customerCity = normalizeCity3(customerProfile.city);
  const providerCity = normalizeCity3(cart.provider.city);
  if (customerCity !== providerCity) {
    throw new ForbiddenError(
      `This provider only serves customers in ${cart.provider.city}.`
    );
  }
  const validatedItems = cart.cartItems.map((item) => {
    const meal = item.meal;
    if (!meal.isActive || !meal.isAvailable) {
      throw new BadRequestError(
        `The meal "${meal.name}" is currently unavailable.`
      );
    }
    const discountInfo = computeDiscount({
      basePrice: Number(meal.basePrice),
      discountPrice: meal.discountPrice !== null && meal.discountPrice !== void 0 ? Number(meal.discountPrice) : null,
      discountStartDate: meal.discountStartDate,
      discountEndDate: meal.discountEndDate
    });
    const unitPrice = discountInfo.effectivePrice;
    const baseUnitPrice = Number(meal.basePrice);
    const totalPrice = unitPrice * item.quantity;
    return {
      mealId: meal.id,
      mealName: meal.name,
      mealImageUrl: meal.mainImageURL,
      quantity: item.quantity,
      baseUnitPrice,
      unitPrice,
      totalPrice,
      mealDeliveryFee: Number(meal.deliveryFee || 0)
    };
  });
  const subtotal = validatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const discountAmount = validatedItems.reduce(
    (sum, item) => sum + (item.baseUnitPrice - item.unitPrice) * item.quantity,
    0
  );
  const deliveryFee = validatedItems.length > 0 ? Math.max(...validatedItems.map((item) => item.mealDeliveryFee)) : 0;
  const totalAmount = subtotal + deliveryFee;
  return {
    customerProfile,
    cart,
    validatedItems,
    totals: { subtotal, discountAmount, deliveryFee, totalAmount },
    delivery: {
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      deliveryCity: customerProfile.city,
      deliveryStreetAddress: payload.deliveryStreetAddress,
      deliveryHouseNumber: payload.deliveryHouseNumber || null,
      deliveryApartment: payload.deliveryApartment || null,
      deliveryPostalCode: payload.deliveryPostalCode || null,
      deliveryNote: payload.deliveryNote || null
    }
  };
};
var getCheckoutPreview = async (userId, payload) => {
  const state = await buildValidatedCheckoutState(userId, payload);
  return {
    provider: {
      id: state.cart.provider.id,
      businessName: state.cart.provider.businessName,
      city: state.cart.provider.city,
      imageURL: state.cart.provider.imageURL
    },
    items: state.validatedItems,
    totals: state.totals,
    delivery: state.delivery
  };
};
var generateOrderNumber = () => {
  const now = /* @__PURE__ */ new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `PLT-${y}${m}${d}-${rand}`;
};
var createOrder = async (userId, payload) => {
  const state = await buildValidatedCheckoutState(userId, payload);
  const existingPendingOrder = await prisma.order.findFirst({
    where: {
      customerId: userId,
      providerId: state.cart.provider.id,
      status: "PENDING_PAYMENT"
    },
    select: { id: true }
  });
  if (existingPendingOrder && payload.paymentMethod === "ONLINE") {
    throw new BadRequestError(
      "You already have a pending payment order for this provider."
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const initialStatus = payload.paymentMethod === "ONLINE" ? "PENDING_PAYMENT" : "PLACED";
    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: userId,
        providerId: state.cart.provider.id,
        paymentMethod: payload.paymentMethod,
        status: initialStatus,
        customerName: state.delivery.customerName,
        customerPhone: state.delivery.customerPhone,
        deliveryCity: state.delivery.deliveryCity,
        deliveryStreetAddress: state.delivery.deliveryStreetAddress,
        deliveryHouseNumber: state.delivery.deliveryHouseNumber,
        deliveryApartment: state.delivery.deliveryApartment,
        deliveryPostalCode: state.delivery.deliveryPostalCode,
        deliveryNote: state.delivery.deliveryNote,
        subtotal: state.totals.subtotal,
        deliveryFee: state.totals.deliveryFee,
        discountAmount: state.totals.discountAmount,
        totalAmount: state.totals.totalAmount,
        placedAt: payload.paymentMethod === "COD" ? /* @__PURE__ */ new Date() : null
      }
    });
    if (state.validatedItems.length > 0) {
      await tx.orderItem.createMany({
        data: state.validatedItems.map((item) => ({
          orderId: order.id,
          mealId: item.mealId,
          mealName: item.mealName,
          mealImageUrl: item.mealImageUrl,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice
        }))
      });
    }
    await tx.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: initialStatus,
        note: payload.paymentMethod === "ONLINE" ? "Order created. Waiting for payment." : "Order placed successfully via Cash on Delivery.",
        changedByUserId: userId,
        changedByRole: "CUSTOMER"
      }
    });
    if (payload.paymentMethod === "COD") {
      await tx.cart.delete({ where: { id: state.cart.id } });
    }
    return tx.order.findUnique({
      where: { id: order.id },
      include: {
        provider: {
          select: { id: true, businessName: true, city: true, imageURL: true }
        },
        orderItems: true,
        orderStatusHistories: { orderBy: { createdAt: "asc" } }
      }
    });
  });
  return result;
};
var getMyOrders = async (userId, query) => {
  const page = Math.max(1, query?.page ?? 1);
  const limit = Math.min(50, Math.max(1, query?.limit ?? 20));
  const skip = (page - 1) * limit;
  const where = {
    customerId: userId,
    ...query?.status && { status: query.status },
    ...query?.search && {
      OR: [
        { orderNumber: { contains: query.search, mode: "insensitive" } },
        {
          orderItems: {
            some: {
              mealName: { contains: query.search, mode: "insensitive" }
            }
          }
        },
        {
          provider: {
            businessName: { contains: query.search, mode: "insensitive" }
          }
        }
      ]
    }
  };
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        provider: {
          select: { id: true, businessName: true, city: true, imageURL: true }
        },
        orderItems: true,
        payments: {
          select: { id: true, status: true, amount: true, gatewayName: true }
        }
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.order.count({ where })
  ]);
  return {
    orders: orders.map((order) => ({ ...order, items: order.orderItems })),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: skip + limit < total,
      hasPrevPage: page > 1
    }
  };
};
var getMyOrderDetail = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, customerId: userId },
    include: {
      provider: {
        select: {
          id: true,
          businessName: true,
          city: true,
          imageURL: true,
          phone: true
        }
      },
      orderItems: true,
      payments: true,
      orderStatusHistories: { orderBy: { createdAt: "asc" } }
    }
  });
  if (!order) throw new NotFoundError("Order not found.");
  return { ...order, items: order.orderItems };
};
var cancelMyOrder = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, customerId: userId }
  });
  if (!order) throw new NotFoundError("Order not found.");
  if (!CUSTOMER_CANCELLABLE_STATUSES.includes(order.status)) {
    throw new BadRequestError(
      order.status === "PREPARING" || order.status === "OUT_FOR_DELIVERY" ? "Your order is already being prepared and can no longer be cancelled." : order.status === "DELIVERED" ? "This order has already been delivered." : order.status === "CANCELLED" ? "This order is already cancelled." : "This order can no longer be cancelled."
    );
  }
  const updated = await prisma.$transaction(async (tx) => {
    const next = await tx.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELLED",
        cancelledAt: /* @__PURE__ */ new Date()
      }
    });
    await tx.orderStatusHistory.create({
      data: {
        orderId,
        status: "CANCELLED",
        note: "Cancelled by customer.",
        changedByUserId: userId,
        changedByRole: "CUSTOMER"
      }
    });
    return next;
  });
  orderEventBus.emitOrderUpdate({
    orderId,
    status: updated.status,
    message: "Your order has been cancelled.",
    updatedAt: updated.updatedAt.toISOString()
  });
  return updated;
};
var getProviderOrders = async (userId, query) => {
  const provider = await getProviderProfile(userId);
  console.log(provider);
  const page = Math.max(1, query?.page ?? 1);
  const limit = Math.min(50, Math.max(1, query?.limit ?? 20));
  const skip = (page - 1) * limit;
  const where = {
    providerId: provider.id,
    status: {
      in: query?.status ? [query.status] : ["PLACED", "ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"]
    }
  };
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true, email: true } },
        orderItems: true,
        payments: {
          select: { id: true, status: true, amount: true }
        }
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.order.count({ where })
  ]);
  return {
    orders: orders.map((order) => ({ ...order, items: order.orderItems })),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: skip + limit < total,
      hasPrevPage: page > 1
    }
  };
};
var updateProviderOrderStatus = async (userId, orderId, payload) => {
  const provider = await getProviderProfile(userId);
  const order = await prisma.order.findFirst({
    where: { id: orderId, providerId: provider.id }
  });
  if (!order) throw new NotFoundError("Order not found.");
  const allowedNext = ORDER_STATUS_TRANSITIONS[order.status];
  if (!allowedNext.includes(payload.status)) {
    throw new BadRequestError(
      `Invalid transition: ${order.status} \u2192 ${payload.status}.`
    );
  }
  const updated = await prisma.$transaction(async (tx) => {
    const next = await tx.order.update({
      where: { id: orderId },
      data: {
        status: payload.status,
        acceptedAt: payload.status === "ACCEPTED" ? /* @__PURE__ */ new Date() : order.acceptedAt,
        deliveredAt: payload.status === "DELIVERED" ? /* @__PURE__ */ new Date() : order.deliveredAt,
        cancelledAt: payload.status === "CANCELLED" ? /* @__PURE__ */ new Date() : order.cancelledAt
      }
    });
    await tx.orderStatusHistory.create({
      data: {
        orderId,
        status: payload.status,
        note: payload.note || `Order moved to ${payload.status}`,
        changedByUserId: userId,
        changedByRole: "PROVIDER"
      }
    });
    return next;
  });
  const statusMessages = {
    ACCEPTED: "Restaurant has accepted your order!",
    PREPARING: "Your food is being prepared.",
    OUT_FOR_DELIVERY: "Your order is out for delivery!",
    DELIVERED: "Your order has been delivered. Enjoy!",
    CANCELLED: "Your order was cancelled by the restaurant."
  };
  orderEventBus.emitOrderUpdate({
    orderId,
    status: updated.status,
    message: payload.note || statusMessages[payload.status] || `Order moved to ${updated.status}`,
    updatedAt: updated.updatedAt.toISOString()
  });
  return updated;
};
var getOrderTracking = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, customerId: userId },
    include: {
      provider: {
        select: {
          id: true,
          businessName: true,
          city: true,
          imageURL: true,
          phone: true
        }
      },
      orderItems: true,
      payments: {
        select: {
          id: true,
          status: true,
          amount: true,
          gatewayName: true,
          createdAt: true
        }
      },
      orderStatusHistories: { orderBy: { createdAt: "asc" } }
    }
  });
  if (!order) throw new NotFoundError("Order not found.");
  return { ...order, items: order.orderItems };
};
var OrderService = {
  getCheckoutPreview,
  createOrder,
  getMyOrders,
  getMyOrderDetail,
  cancelMyOrder,
  getProviderOrders,
  updateProviderOrderStatus,
  getOrderTracking
};

// src/modules/order/order.controller.ts
var getCheckoutPreview2 = async (req, res, next) => {
  try {
    const payload = req.body;
    const result = await OrderService.getCheckoutPreview(req.user.id, payload);
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "Checkout preview generated successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var createOrder2 = async (req, res, next) => {
  try {
    const payload = req.body;
    const result = await OrderService.createOrder(req.user.id, payload);
    sendResponse(res, {
      httpStatusCode: status9.CREATED,
      success: true,
      message: "Order created successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getMyOrders2 = async (req, res, next) => {
  try {
    const result = await OrderService.getMyOrders(req.user.id, {
      ...req.query.status && { status: req.query.status },
      ...req.query.page && { page: Number(req.query.page) },
      ...req.query.limit && { limit: Number(req.query.limit) },
      ...req.query.search && { search: req.query.search }
    });
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "Orders fetched successfully.",
      data: {
        orders: result.orders,
        pagination: result.pagination
      }
    });
  } catch (error) {
    next(error);
  }
};
var getMyOrderDetail2 = async (req, res, next) => {
  try {
    const result = await OrderService.getMyOrderDetail(
      req.user.id,
      req.params.id
    );
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "Order detail fetched successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var cancelMyOrder2 = async (req, res, next) => {
  try {
    const result = await OrderService.cancelMyOrder(
      req.user.id,
      req.params.id
    );
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "Order cancelled successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getProviderOrders2 = async (req, res, next) => {
  try {
    const result = await OrderService.getProviderOrders(req.user.id, {
      ...req.query.status && { status: req.query.status },
      ...req.query.page && { page: Number(req.query.page) },
      ...req.query.limit && { limit: Number(req.query.limit) }
    });
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "Provider orders fetched successfully.",
      data: {
        orders: result.orders,
        pagination: result.pagination
      }
    });
  } catch (error) {
    next(error);
  }
};
var updateProviderOrderStatus2 = async (req, res, next) => {
  try {
    const payload = req.body;
    const result = await OrderService.updateProviderOrderStatus(
      req.user.id,
      req.params.id,
      payload
    );
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "Order status updated successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getOrderTracking2 = async (req, res, next) => {
  try {
    const result = await OrderService.getOrderTracking(
      req.user.id,
      req.params.id
    );
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "Order tracking fetched successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var streamOrderTracking = async (req, res) => {
  const orderId = req.params.id;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  const send = (payload) => {
    res.write(`data: ${JSON.stringify(payload)}

`);
  };
  send({
    type: "CONNECTED",
    orderId,
    at: (/* @__PURE__ */ new Date()).toISOString()
  });
  const listener = (payload) => {
    send({ type: "ORDER_UPDATED", ...payload });
  };
  orderEventBus.subscribe(orderId, listener);
  const heartbeat = setInterval(() => {
    res.write(
      `event: ping
data: ${JSON.stringify({ at: (/* @__PURE__ */ new Date()).toISOString() })}

`
    );
  }, 15e3);
  req.on("close", () => {
    clearInterval(heartbeat);
    orderEventBus.unsubscribe(orderId, listener);
    res.end();
  });
};
var OrderController = {
  getCheckoutPreview: getCheckoutPreview2,
  createOrder: createOrder2,
  getMyOrders: getMyOrders2,
  getMyOrderDetail: getMyOrderDetail2,
  cancelMyOrder: cancelMyOrder2,
  getProviderOrders: getProviderOrders2,
  updateProviderOrderStatus: updateProviderOrderStatus2,
  getOrderTracking: getOrderTracking2,
  streamOrderTracking
};

// src/modules/order/order.validation.ts
import { z as z7 } from "zod";
var checkoutPreviewSchema = z7.object({
  customerName: z7.string().trim().min(2, "Customer name is required."),
  customerPhone: z7.string().trim().min(8, "Phone number is required."),
  deliveryStreetAddress: z7.string().trim().min(3, "Street address is required."),
  deliveryHouseNumber: z7.string().trim().optional(),
  deliveryApartment: z7.string().trim().optional(),
  deliveryPostalCode: z7.string().trim().optional(),
  deliveryNote: z7.string().trim().max(300, "Note cannot exceed 300 characters.").optional()
});
var createOrderSchema = z7.object({
  customerName: z7.string().trim().min(2, "Customer name is required."),
  customerPhone: z7.string().trim().min(8, "Phone number is required."),
  deliveryStreetAddress: z7.string().trim().min(3, "Street address is required."),
  deliveryHouseNumber: z7.string().trim().optional(),
  deliveryApartment: z7.string().trim().optional(),
  deliveryPostalCode: z7.string().trim().optional(),
  deliveryNote: z7.string().trim().max(300, "Note cannot exceed 300 characters.").optional(),
  paymentMethod: z7.enum(["ONLINE", "COD"])
});
var updateOrderStatusSchema = z7.object({
  status: z7.enum([
    "PLACED",
    "ACCEPTED",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED"
  ]),
  note: z7.string().trim().max(300).optional()
});

// src/modules/order/order.routes.ts
var router8 = Router8();
router8.post(
  "/checkout-preview",
  auth_middleware_default("CUSTOMER" /* CUSTOMER */),
  validateRequest_default(checkoutPreviewSchema),
  OrderController.getCheckoutPreview
);
router8.post(
  "/",
  auth_middleware_default("CUSTOMER" /* CUSTOMER */),
  validateRequest_default(createOrderSchema),
  OrderController.createOrder
);
router8.get(
  "/my-orders",
  auth_middleware_default("CUSTOMER" /* CUSTOMER */),
  OrderController.getMyOrders
);
router8.get(
  "/:id/tracking",
  auth_middleware_default("CUSTOMER" /* CUSTOMER */),
  OrderController.getOrderTracking
);
router8.get(
  "/:id/tracking/stream",
  auth_middleware_default("CUSTOMER" /* CUSTOMER */),
  OrderController.streamOrderTracking
);
router8.patch(
  "/:id/cancel",
  auth_middleware_default("CUSTOMER" /* CUSTOMER */),
  OrderController.cancelMyOrder
);
router8.get(
  "/:id",
  auth_middleware_default("CUSTOMER" /* CUSTOMER */),
  OrderController.getMyOrderDetail
);
router8.get(
  "/provider/orders",
  auth_middleware_default("PROVIDER" /* PROVIDER */),
  OrderController.getProviderOrders
);
router8.patch(
  "/:id/provider-status",
  auth_middleware_default("PROVIDER" /* PROVIDER */),
  validateRequest_default(updateOrderStatusSchema),
  OrderController.updateProviderOrderStatus
);
var OrderRoutes = router8;

// src/modules/payment/payment.routes.ts
import { Router as Router9 } from "express";

// src/modules/payment/payment.controller.ts
import status11 from "http-status";

// src/modules/payment/payment.service.ts
import status10 from "http-status";
import axios from "axios";
import { randomUUID } from "crypto";
var backendBaseUrl = config_default.BACKEND_LOCAL_HOST;
var frontendBaseUrl = config_default.NODE_ENV === "production" ? config_default.frontend_production_host : config_default.frontend_local_host;
var validateSSLPayment = async (val_id) => {
  const store_id = config_default.SSLCOMMERZ_STORE_ID;
  const store_passwd = config_default.SSLCOMMERZ_STORE_PASSWORD;
  if (!store_id || !store_passwd) {
    throw new AppError(
      "SSLCommerz credentials are missing.",
      status10.INTERNAL_SERVER_ERROR
    );
  }
  const validationURL = `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${store_id}&store_passwd=${store_passwd}&v=1&format=json`;
  const response = await axios.get(validationURL);
  return response.data;
};
var finalizeSuccessPayment = async (payment, validation) => {
  if (payment.status === "SUCCESS") return;
  const amount = Number(payment.amount);
  const platformFeeAmount = amount * 0.25;
  const providerShareAmount = amount * 0.75;
  await prisma.$transaction(async (tx) => {
    const paymentRecord = await tx.payment.findUnique({
      where: { id: payment.id }
    });
    if (!paymentRecord) {
      throw new AppError("Payment not found.", status10.NOT_FOUND);
    }
    if (paymentRecord.status === "SUCCESS") return;
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "SUCCESS",
        paidAt: /* @__PURE__ */ new Date(),
        paymentGatewayData: validation,
        platformFeeAmount,
        providerShareAmount
      }
    });
    const order = await tx.order.findUnique({
      where: { id: payment.orderId },
      include: {
        orderItems: true
      }
    });
    if (!order) {
      throw new AppError("Order not found.", status10.NOT_FOUND);
    }
    await tx.order.update({
      where: { id: order.id },
      data: {
        status: "PLACED",
        placedAt: /* @__PURE__ */ new Date()
      }
    });
    await tx.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: "PLACED",
        note: "Online payment successful. Order placed.",
        changedByUserId: order.customerId,
        changedByRole: "CUSTOMER"
      }
    });
    const customerProfile = await tx.customerProfile.findUnique({
      where: { userId: order.customerId }
    });
    if (customerProfile) {
      const cart = await tx.cart.findUnique({
        where: { customerId: customerProfile.id }
      });
      if (cart) {
        await tx.cart.delete({
          where: { id: cart.id }
        });
      }
    }
    await tx.providerProfile.update({
      where: {
        id: order.providerId
      },
      data: {
        currentPayableAmount: {
          increment: providerShareAmount
        },
        totalGrossRevenue: {
          increment: amount
        },
        totalProviderEarning: {
          increment: providerShareAmount
        },
        totalPlatformFee: {
          increment: platformFeeAmount
        },
        totalOrdersCompleted: {
          increment: 1
        }
      }
    });
  });
};
var initiateSSLPayment = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      customerId: userId
    },
    include: {
      orderItems: true,
      payments: {
        orderBy: {
          createdAt: "desc"
        },
        take: 1
      },
      customer: true
    }
  });
  if (!order) {
    throw new AppError("Order not found.", status10.NOT_FOUND);
  }
  if (order.paymentMethod !== "ONLINE") {
    throw new AppError(
      "This order is not an online payment order.",
      status10.BAD_REQUEST
    );
  }
  if (order.status === "PLACED") {
    throw new AppError(
      "This order is already paid and placed.",
      status10.BAD_REQUEST
    );
  }
  const latestPayment = order.payments?.[0];
  if (latestPayment?.status === "SUCCESS") {
    throw new AppError(
      "Payment already completed for this order.",
      status10.BAD_REQUEST
    );
  }
  const store_id = config_default.SSLCOMMERZ_STORE_ID;
  const store_passwd = config_default.SSLCOMMERZ_STORE_PASSWORD;
  if (!store_id || !store_passwd) {
    throw new AppError(
      "SSLCommerz credentials are missing.",
      status10.INTERNAL_SERVER_ERROR
    );
  }
  const amount = Number(order.totalAmount);
  const platformFeeAmount = amount * 0.25;
  const providerShareAmount = amount * 0.75;
  const transactionId = `PLATERA_${randomUUID()}`;
  let payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      customerId: order.customerId,
      providerId: order.providerId,
      amount,
      platformFeeAmount,
      providerShareAmount,
      transactionId,
      status: "PENDING",
      gatewayName: "SSLCommerz"
    }
  });
  const sslPayload = {
    store_id,
    store_passwd,
    total_amount: Number(order.totalAmount),
    currency: "BDT",
    tran_id: transactionId,
    success_url: `${backendBaseUrl}/api/v1/payments/sslcommerz/success`,
    fail_url: `${backendBaseUrl}/api/v1/payments/sslcommerz/fail`,
    cancel_url: `${backendBaseUrl}/api/v1/payments/sslcommerz/cancel`,
    ipn_url: config_default.SSLCOMMERZ_IPN_URL || `${backendBaseUrl}/api/v1/payments/sslcommerz/ipn`,
    shipping_method: "NO",
    product_name: `Order-${order.id}`,
    product_category: "Food",
    product_profile: "general",
    cus_name: order.customerName || order.customer?.name || order.customer?.email || "Customer",
    cus_email: order.customer?.email || "customer@example.com",
    cus_add1: `${order.deliveryStreetAddress || ""} ${order.deliveryHouseNumber || ""}`.trim() || "Dhaka",
    cus_city: order.deliveryCity || "Dhaka",
    cus_postcode: order.deliveryPostalCode || "1200",
    cus_country: "Bangladesh",
    cus_phone: order.customerPhone || "01700000000",
    ship_name: order.customerName || order.customer?.name || order.customer?.email || "Customer",
    ship_add1: `${order.deliveryStreetAddress || ""} ${order.deliveryHouseNumber || ""}`.trim() || "Dhaka",
    ship_city: order.deliveryCity || "Dhaka",
    ship_postcode: order.deliveryPostalCode || "1200",
    ship_country: "Bangladesh",
    value_a: order.id,
    value_b: userId,
    value_c: "Platera",
    value_d: frontendBaseUrl
  };
  try {
    const sslResponse = await axios.post(
      "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
      sslPayload,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    const responseData = sslResponse.data;
    if (!responseData || responseData.status !== "SUCCESS") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "FAILED",
          paymentGatewayData: responseData
        }
      });
      throw new AppError(
        responseData?.failedreason || "Failed to initiate SSLCommerz payment.",
        status10.BAD_REQUEST
      );
    }
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentGatewayData: responseData
      }
    });
    return {
      success: true,
      message: "Payment session initiated successfully.",
      data: {
        gatewayURL: responseData.GatewayPageURL,
        paymentId: payment.id,
        transactionId,
        orderId: order.id
      }
    };
  } catch (error) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "FAILED",
        paymentGatewayData: {
          error: error?.response?.data || error?.message || "Unknown error"
        }
      }
    });
    throw new AppError(
      error?.response?.data?.failedreason || error?.message || "Failed to initiate payment.",
      status10.BAD_REQUEST
    );
  }
};
var handleSuccess = async (payload) => {
  const { tran_id, val_id, amount } = payload;
  const payment = await prisma.payment.findUnique({
    where: { transactionId: tran_id }
  });
  if (!payment) {
    throw new AppError("Payment not found.", status10.NOT_FOUND);
  }
  const validation = await validateSSLPayment(val_id);
  if (validation.status !== "VALID" && validation.status !== "VALIDATED") {
    throw new AppError(
      "Payment validation failed.",
      status10.BAD_REQUEST
    );
  }
  if (validation.tran_id !== tran_id) {
    throw new AppError(
      "Transaction ID mismatch.",
      status10.BAD_REQUEST
    );
  }
  if (Number(validation.amount) !== Number(payment.amount)) {
    throw new AppError(
      "Paid amount does not match order amount.",
      status10.BAD_REQUEST
    );
  }
  orderEventBus.emitOrderUpdate({
    orderId: payment.orderId,
    status: "PLACED",
    message: "Payment successful. Order placed.",
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  await finalizeSuccessPayment(payment, validation);
  return { orderId: payment.orderId };
};
var handleFail = async (payload) => {
  const { tran_id } = payload;
  const payment = await prisma.payment.findUnique({
    where: { transactionId: tran_id }
  });
  if (!payment) {
    throw new AppError("Payment not found.", status10.NOT_FOUND);
  }
  if (payment.status !== "SUCCESS") {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "FAILED",
        failedAt: /* @__PURE__ */ new Date(),
        paymentGatewayData: payload
      }
    });
  }
  return { orderId: payment.orderId };
};
var handleCancel = async (payload) => {
  const { tran_id } = payload;
  const payment = await prisma.payment.findUnique({
    where: { transactionId: tran_id }
  });
  if (!payment) {
    throw new AppError("Payment not found.", status10.NOT_FOUND);
  }
  if (payment.status !== "SUCCESS") {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "CANCELLED",
        cancelledAt: /* @__PURE__ */ new Date(),
        paymentGatewayData: payload
      }
    });
  }
  return { orderId: payment.orderId };
};
var handleIPN = async (payload) => {
  const { tran_id, val_id } = payload;
  const payment = await prisma.payment.findUnique({
    where: { transactionId: tran_id }
  });
  if (!payment) return;
  const validation = await validateSSLPayment(val_id);
  if ((validation.status === "VALID" || validation.status === "VALIDATED") && validation.tran_id === tran_id && Number(validation.amount) === Number(payment.amount)) {
    await finalizeSuccessPayment(payment, validation);
  }
};
var getPaymentStatus = async (orderId, userId) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      customerId: userId
    },
    include: {
      payments: {
        orderBy: {
          createdAt: "desc"
        },
        take: 1
      }
    }
  });
  if (!order) {
    throw new AppError("Order not found.", status10.NOT_FOUND);
  }
  return {
    success: true,
    message: "Payment status fetched successfully.",
    data: {
      orderId: order.id,
      orderStatus: order.status,
      payment: order.payments[0] || null
    }
  };
};
var PaymentService = {
  initiateSSLPayment,
  handleSuccess,
  handleFail,
  handleCancel,
  handleIPN,
  getPaymentStatus
};

// src/modules/payment/payment.controller.ts
var initiateSSLPayment2 = async (req, res, next) => {
  try {
    const result = await PaymentService.initiateSSLPayment(
      req.user.id,
      req.params.orderId
    );
    sendResponse(res, {
      httpStatusCode: status11.OK,
      success: true,
      message: "Payment session initiated.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var handleIPN2 = async (req, res, next) => {
  try {
    const result = await PaymentService.handleIPN(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
var getPaymentStatus2 = async (req, res, next) => {
  try {
    const result = await PaymentService.getPaymentStatus(
      req.user.id,
      req.params.orderId
    );
    sendResponse(res, {
      httpStatusCode: status11.OK,
      success: true,
      message: "Payment status fetched.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var handleSuccess2 = async (req, res) => {
  const result = await PaymentService.handleSuccess(req.body);
  return res.redirect(
    `${config_default.frontend_local_host}/checkout/payment/success?orderId=${result.orderId}`
  );
};
var handleFail2 = async (req, res) => {
  const result = await PaymentService.handleFail(req.body);
  return res.redirect(
    `${config_default.frontend_local_host}/checkout/payment/fail?orderId=${result.orderId}`
  );
};
var handleCancel2 = async (req, res) => {
  const result = await PaymentService.handleCancel(req.body);
  return res.redirect(
    `${config_default.frontend_local_host}/checkout/payment/cancel?orderId=${result.orderId}`
  );
};
var PaymentController = {
  initiateSSLPayment: initiateSSLPayment2,
  handleIPN: handleIPN2,
  getPaymentStatus: getPaymentStatus2,
  handleSuccess: handleSuccess2,
  handleFail: handleFail2,
  handleCancel: handleCancel2
};

// src/modules/payment/payment.routes.ts
var router9 = Router9();
router9.post(
  "/initiate/:orderId",
  auth_middleware_default("CUSTOMER" /* CUSTOMER */),
  PaymentController.initiateSSLPayment
);
router9.get(
  "/status/:orderId",
  auth_middleware_default("CUSTOMER" /* CUSTOMER */),
  PaymentController.getPaymentStatus
);
router9.post("/sslcommerz/success", PaymentController.handleSuccess);
router9.post("/sslcommerz/fail", PaymentController.handleFail);
router9.post("/sslcommerz/cancel", PaymentController.handleCancel);
router9.post("/sslcommerz/ipn", PaymentController.handleIPN);
var PaymentRoutes = router9;

// src/routes/index.ts
var router10 = Router10();
router10.use("/auth", AuthRoutes);
router10.use("/public", PublicRoutes);
router10.use("/customers", CustomerRoutes);
router10.use("/cart", CartRoutes);
router10.use("/orders", OrderRoutes);
router10.use("/payments", PaymentRoutes);
router10.use("/provider/meals", MealRoutes);
router10.use("/providers", ProviderRoutes);
router10.use("/admins", auth_middleware_default("ADMIN" /* ADMIN */, "SUPER_ADMIN" /* SUPER_ADMIN */), adminGuard, AdminRoutes);
var IndexRoutes = router10;

// src/app.ts
import { toNodeHandler } from "better-auth/node";
var app = express();
app.use(cookieParser());
app.use(cors({
  origin: [config_default.frontend_local_host].filter(Boolean),
  credentials: true
}));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", IndexRoutes);
app.get("/", (req, res) => {
  res.send("Hello from Apollo Gears World!");
});
app.use(notFoundHandler_default);
app.use(globalErrorHandler_default);
var app_default = app;

// src/vercel.ts
var vercel_default = app_default;
export {
  vercel_default as default
};
//! ================ New Added ==================================
//! ================== New added ==============================
