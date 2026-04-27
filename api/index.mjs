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
  "inlineSchema": 'model Address {\n  id          String    @id @default(uuid(7))\n  city        String\n  street      String\n  houseNumber String\n  apartment   String?\n  postalCode  String\n  label       HouseType @default(HOME)\n  isDefault   Boolean   @default(false)\n  createdAt   DateTime  @default(now())\n  updatedAt   DateTime  @updatedAt\n\n  @@index([city])\n  @@index([postalCode])\n}\n\nmodel User {\n  id                 String            @id\n  name               String\n  email              String            @unique\n  emailVerified      Boolean           @default(false)\n  image              String?\n  role               UserRole          @default(CUSTOMER)\n  status             userAccountStatus @default(ACTIVE)\n  phone              String?\n  needPasswordChange Boolean           @default(false)\n  isDeleted          Boolean           @default(false)\n  deletedAt          DateTime?\n  createdAt          DateTime          @default(now())\n  updatedAt          DateTime          @updatedAt\n  accounts           Account[]\n  customerProfile    CustomerProfile?\n  orders             Order[]\n  payments           Payment[]\n  providerProfile    ProviderProfile?\n  reviews            Review[]\n  sessions           Session[]\n\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String   @unique\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Cart {\n  id             String          @id @default(uuid())\n  customerId     String          @unique\n  providerId     String\n  subtotal       Decimal         @default(0) @db.Decimal(12, 2)\n  deliveryFee    Decimal         @default(0) @db.Decimal(12, 2)\n  discountAmount Decimal         @default(0) @db.Decimal(12, 2)\n  totalAmount    Decimal         @default(0) @db.Decimal(12, 2)\n  createdAt      DateTime        @default(now())\n  updatedAt      DateTime        @updatedAt\n  customer       CustomerProfile @relation(fields: [customerId], references: [id], onDelete: Cascade)\n  provider       ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Cascade)\n  cartItems      CartItem[]\n\n  @@index([providerId])\n  @@map("carts")\n}\n\nmodel CartItem {\n  id            String   @id @default(uuid())\n  cartId        String\n  mealId        String\n  quantity      Int      @default(1)\n  baseUnitPrice Decimal  @db.Decimal(12, 2)\n  unitPrice     Decimal  @db.Decimal(12, 2)\n  totalPrice    Decimal  @db.Decimal(12, 2)\n  createdAt     DateTime @default(now())\n  updatedAt     DateTime @updatedAt\n\n  cart Cart @relation(fields: [cartId], references: [id], onDelete: Cascade)\n  meal Meal @relation(fields: [mealId], references: [id], onDelete: Cascade)\n\n  @@unique([cartId, mealId])\n  @@index([mealId])\n  @@map("cart_item")\n}\n\nmodel Category {\n  id           String   @id @default(uuid())\n  name         String   @unique\n  slug         String   @unique\n  imageURL     String\n  displayOrder Int      @default(0)\n  isActive     Boolean  @default(true)\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n  meals        Meal[]\n\n  @@index([slug])\n  @@map("category")\n}\n\nmodel CustomerProfile {\n  id            String   @id @default(uuid())\n  userId        String   @unique\n  phone         String\n  city          String\n  streetAddress String\n  houseNumber   String\n  apartment     String?\n  postalCode    String\n  latitude      Decimal? @db.Decimal(10, 7)\n  longitude     Decimal? @db.Decimal(10, 7)\n  createdAt     DateTime @default(now())\n  updatedAt     DateTime @updatedAt\n  cart          Cart?\n  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([city])\n  @@map("customer_profiles")\n}\n\nenum UserRole {\n  CUSTOMER\n  PROVIDER\n  ADMIN\n  SUPER_ADMIN\n}\n\nenum userAccountStatus {\n  ACTIVE\n  SUSPENDED\n}\n\nenum HouseType {\n  HOME\n  OFFICE\n}\n\nenum BusinessCategory {\n  RESTAURANT\n  SHOP\n  HOME_KITCHEN\n  STREET_FOOD\n}\n\nenum ApprovalStatus {\n  PENDING\n  APPROVED\n  REJECTED\n  DRAFT\n}\n\nenum PaymentMethod {\n  COD\n  ONLINE\n}\n\nenum PaymentStatus {\n  PENDING\n  SUCCESS\n  FAILED\n  CANCELLED\n  REFUNDED\n}\n\nenum OrderStatus {\n  PENDING_PAYMENT\n  PLACED\n  ACCEPTED\n  PREPARING\n  OUT_FOR_DELIVERY\n  DELIVERED\n  CANCELLED\n  REFUNDED\n}\n\nenum ProviderSettlementStatus {\n  PENDING\n  PAID\n}\n\nmodel Meal {\n  id         String @id @default(uuid())\n  providerId String\n  categoryId String\n\n  name String\n\n  subcategory      String?\n  shortDescription String\n  fullDescription  String?\n\n  portionSize String?\n\n  mainImageURL     String\n  galleryImageURLs String[]\n\n  basePrice     Int\n  discountPrice Int?\n\n  dietaryPreferences DietaryPreference[]\n  allergens          String[]\n  calories           Int?\n  protein            Float?\n  fat                Float?\n  carbohydrates      Float?\n\n  isAvailable Boolean @default(true)\n  isActive    Boolean @default(true)\n\n  preparationTimeMinutes Int @default(15)\n\n  isBestseller      Boolean            @default(false)\n  isFeatured        Boolean            @default(false)\n  tags              String[]\n  deliveryFee       Int                @default(0)\n  createdAt         DateTime           @default(now())\n  updatedAt         DateTime           @updatedAt\n  discountEndDate   DateTime?\n  discountStartDate DateTime?\n  cartItems         CartItem[]\n  category          Category           @relation(fields: [categoryId], references: [id])\n  provider          ProviderProfile    @relation(fields: [providerId], references: [id], onDelete: Cascade)\n  addOns            MealAddOn[]\n  ingredients       MealIngredient[]\n  removeOptions     MealRemoveOption[]\n  sizes             MealSize[]\n  spiceLevels       MealSpiceLevel[]\n  reviews           Review[]\n  orderItems        OrderItem[]\n\n  @@index([providerId])\n  @@index([categoryId])\n  @@index([isAvailable, isActive])\n  @@map("meal")\n}\n\nenum DietaryPreference {\n  VEGAN\n  VEGETARIAN\n  HALAL\n  GLUTEN_FREE\n  DAIRY_FREE\n  NUT_FREE\n  ORGANIC\n  LOW_CARB\n  KETO\n  PALEO\n  LOW_FAT\n  HIGH_PROTEIN\n  LOW_SUGAR\n  SUGAR_FREE\n  FODMAP_FREE\n}\n\nmodel MealSize {\n  id         String  @id @default(uuid())\n  mealId     String\n  name       String\n  extraPrice Int     @default(0)\n  isDefault  Boolean @default(false)\n  meal       Meal    @relation(fields: [mealId], references: [id], onDelete: Cascade)\n\n  @@index([mealId])\n  @@map("meal_size")\n}\n\nmodel MealSpiceLevel {\n  id        String  @id @default(uuid())\n  mealId    String\n  level     String\n  isDefault Boolean @default(false)\n  meal      Meal    @relation(fields: [mealId], references: [id], onDelete: Cascade)\n\n  @@index([mealId])\n  @@map("meal_spice_level")\n}\n\nmodel MealAddOn {\n  id     String @id @default(uuid())\n  mealId String\n  name   String\n  price  Int\n  meal   Meal   @relation(fields: [mealId], references: [id], onDelete: Cascade)\n\n  @@index([mealId])\n  @@map("meal_add_on")\n}\n\nmodel MealRemoveOption {\n  id     String @id @default(uuid())\n  mealId String\n  name   String\n  meal   Meal   @relation(fields: [mealId], references: [id], onDelete: Cascade)\n\n  @@index([mealId])\n  @@map("meal_remove_option")\n}\n\nmodel MealIngredient {\n  id     String @id @default(uuid())\n  mealId String\n  name   String\n  meal   Meal   @relation(fields: [mealId], references: [id], onDelete: Cascade)\n\n  @@index([mealId])\n  @@map("meal_ingredient")\n}\n\nmodel Order {\n  id String @id @default(uuid())\n\n  orderNumber String @unique\n\n  customerId String\n  providerId String\n\n  paymentMethod PaymentMethod\n  status        OrderStatus   @default(PENDING_PAYMENT)\n\n  customerName  String?\n  customerPhone String?\n\n  deliveryCity          String\n  deliveryStreetAddress String?\n  deliveryPostalCode    String?\n  deliveryApartment     String?\n  deliveryHouseNumber   String?\n  deliveryNote          String?\n\n  subtotal       Decimal @db.Decimal(12, 2)\n  deliveryFee    Decimal @default(0) @db.Decimal(12, 2)\n  discountAmount Decimal @default(0) @db.Decimal(12, 2)\n  totalAmount    Decimal @db.Decimal(12, 2)\n\n  placedAt    DateTime?\n  acceptedAt  DateTime?\n  deliveredAt DateTime?\n  cancelledAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  customer User            @relation(fields: [customerId], references: [id])\n  provider ProviderProfile @relation(fields: [providerId], references: [id])\n\n  payments             Payment[]\n  orderItems           OrderItem[]\n  orderStatusHistories OrderStatusHistory[]\n  reviews              Review[]\n\n  @@index([customerId])\n  @@index([providerId])\n  @@index([status])\n  @@map("orders")\n}\n\nmodel OrderItem {\n  id String @id @default(uuid())\n\n  orderId      String\n  mealId       String\n  mealName     String\n  mealSlug     String?\n  mealImageUrl String?\n\n  quantity Int\n\n  unitPrice  Decimal @db.Decimal(12, 2)\n  totalPrice Decimal @db.Decimal(12, 2)\n\n  createdAt DateTime @default(now())\n\n  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  meal  Meal  @relation(fields: [mealId], references: [id])\n\n  @@index([orderId])\n  @@index([mealId])\n  @@map("order_items")\n}\n\nmodel OrderStatusHistory {\n  id              String      @id @default(uuid())\n  orderId         String\n  status          OrderStatus\n  note            String?\n  changedByUserId String?\n  changedByRole   UserRole?\n  createdAt       DateTime    @default(now())\n\n  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)\n\n  @@index([orderId, createdAt])\n  @@index([status])\n  @@map("order_status_history")\n}\n\nmodel Payment {\n  id                       String                   @id @default(uuid())\n  orderId                  String\n  customerId               String\n  providerId               String\n  amount                   Decimal                  @db.Decimal(12, 2)\n  platformFeePercent       Decimal                  @default(25) @db.Decimal(5, 2)\n  platformFeeAmount        Decimal                  @db.Decimal(12, 2)\n  providerShareAmount      Decimal                  @db.Decimal(12, 2)\n  transactionId            String                   @unique\n  stripeEventId            String?                  @unique\n  gatewayName              String?\n  status                   PaymentStatus            @default(PENDING)\n  paymentGatewayData       Json?\n  paidAt                   DateTime?\n  failedAt                 DateTime?\n  refundedAt               DateTime?\n  createdAt                DateTime                 @default(now())\n  updatedAt                DateTime                 @updatedAt\n  cancelledAt              DateTime?\n  providerSettledAt        DateTime?\n  providerSettledBy        String?\n  providerSettlementNote   String?\n  providerSettlementStatus ProviderSettlementStatus @default(PENDING)\n  customer                 User                     @relation(fields: [customerId], references: [id])\n  order                    Order                    @relation(fields: [orderId], references: [id])\n  provider                 ProviderProfile          @relation(fields: [providerId], references: [id])\n\n  @@index([orderId])\n  @@index([customerId])\n  @@index([providerId])\n  @@index([status])\n  @@index([providerSettlementStatus])\n  @@index([transactionId])\n  @@map("payments")\n}\n\nmodel ProviderProfile {\n  id                        String           @id @default(uuid())\n  userId                    String           @unique\n  businessName              String\n  businessCategory          BusinessCategory\n  phone                     String\n  bio                       String?\n  imageURL                  String?\n  binNumber                 String?\n  binVerified               Boolean          @default(false)\n  city                      String\n  street                    String\n  houseNumber               String\n  apartment                 String?\n  postalCode                String\n  approvalStatus            ApprovalStatus   @default(DRAFT)\n  rejectionReason           String?\n  reviewedBy                String?\n  reviewedAt                DateTime?\n  isActive                  Boolean          @default(true)\n  createdAt                 DateTime         @default(now())\n  updatedAt                 DateTime         @updatedAt\n  businessKitchenURL        String?\n  businessMainGateURL       String?\n  nidImageFront_and_BackURL String?\n  businessEmail             String           @unique\n  currentPayableAmount      Decimal          @default(0) @db.Decimal(12, 2)\n  lastPaymentAt             DateTime?\n  totalGrossRevenue         Decimal          @default(0) @db.Decimal(12, 2)\n  totalOrdersCompleted      Int              @default(0)\n  totalPlatformFee          Decimal          @default(0) @db.Decimal(12, 2)\n  totalProviderEarning      Decimal          @default(0) @db.Decimal(12, 2)\n  carts                     Cart[]\n  meals                     Meal[]\n  orders                    Order[]\n  payments                  Payment[]\n  user                      User             @relation(fields: [userId], references: [id], onDelete: Cascade)\n  reviews                   Review[]\n\n  @@index([userId])\n  @@index([city])\n  @@index([approvalStatus])\n  @@map("provider_profile")\n}\n\nmodel Review {\n  id       String   @id @default(uuid())\n  rating   Float\n  feedback String?\n  images   String[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  orderId    String\n  mealId     String\n  userId     String\n  providerId String\n\n  // Relations\n  order    Order           @relation(fields: [orderId], references: [id])\n  meal     Meal            @relation(fields: [mealId], references: [id], onDelete: Cascade)\n  provider ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Cascade)\n  user     User            @relation(fields: [userId], references: [id])\n\n  @@unique([userId, orderId])\n  @@index([providerId])\n  @@index([mealId])\n  @@index([orderId])\n  @@map("reviews")\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"Address":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"street","kind":"scalar","type":"String"},{"name":"houseNumber","kind":"scalar","type":"String"},{"name":"apartment","kind":"scalar","type":"String"},{"name":"postalCode","kind":"scalar","type":"String"},{"name":"label","kind":"enum","type":"HouseType"},{"name":"isDefault","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"userAccountStatus"},{"name":"phone","kind":"scalar","type":"String"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"customerProfile","kind":"object","type":"CustomerProfile","relationName":"CustomerProfileToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"providerProfile","kind":"object","type":"ProviderProfile","relationName":"ProviderProfileToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"subtotal","kind":"scalar","type":"Decimal"},{"name":"deliveryFee","kind":"scalar","type":"Decimal"},{"name":"discountAmount","kind":"scalar","type":"Decimal"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"customer","kind":"object","type":"CustomerProfile","relationName":"CartToCustomerProfile"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"CartToProviderProfile"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartToCartItem"}],"dbName":"carts"},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cartId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"baseUnitPrice","kind":"scalar","type":"Decimal"},{"name":"unitPrice","kind":"scalar","type":"Decimal"},{"name":"totalPrice","kind":"scalar","type":"Decimal"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCartItem"},{"name":"meal","kind":"object","type":"Meal","relationName":"CartItemToMeal"}],"dbName":"cart_item"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"imageURL","kind":"scalar","type":"String"},{"name":"displayOrder","kind":"scalar","type":"Int"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"meals","kind":"object","type":"Meal","relationName":"CategoryToMeal"}],"dbName":"category"},"CustomerProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"streetAddress","kind":"scalar","type":"String"},{"name":"houseNumber","kind":"scalar","type":"String"},{"name":"apartment","kind":"scalar","type":"String"},{"name":"postalCode","kind":"scalar","type":"String"},{"name":"latitude","kind":"scalar","type":"Decimal"},{"name":"longitude","kind":"scalar","type":"Decimal"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCustomerProfile"},{"name":"user","kind":"object","type":"User","relationName":"CustomerProfileToUser"}],"dbName":"customer_profiles"},"Meal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"subcategory","kind":"scalar","type":"String"},{"name":"shortDescription","kind":"scalar","type":"String"},{"name":"fullDescription","kind":"scalar","type":"String"},{"name":"portionSize","kind":"scalar","type":"String"},{"name":"mainImageURL","kind":"scalar","type":"String"},{"name":"galleryImageURLs","kind":"scalar","type":"String"},{"name":"basePrice","kind":"scalar","type":"Int"},{"name":"discountPrice","kind":"scalar","type":"Int"},{"name":"dietaryPreferences","kind":"enum","type":"DietaryPreference"},{"name":"allergens","kind":"scalar","type":"String"},{"name":"calories","kind":"scalar","type":"Int"},{"name":"protein","kind":"scalar","type":"Float"},{"name":"fat","kind":"scalar","type":"Float"},{"name":"carbohydrates","kind":"scalar","type":"Float"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"preparationTimeMinutes","kind":"scalar","type":"Int"},{"name":"isBestseller","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"tags","kind":"scalar","type":"String"},{"name":"deliveryFee","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"discountEndDate","kind":"scalar","type":"DateTime"},{"name":"discountStartDate","kind":"scalar","type":"DateTime"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToMeal"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMeal"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"MealToProviderProfile"},{"name":"addOns","kind":"object","type":"MealAddOn","relationName":"MealToMealAddOn"},{"name":"ingredients","kind":"object","type":"MealIngredient","relationName":"MealToMealIngredient"},{"name":"removeOptions","kind":"object","type":"MealRemoveOption","relationName":"MealToMealRemoveOption"},{"name":"sizes","kind":"object","type":"MealSize","relationName":"MealToMealSize"},{"name":"spiceLevels","kind":"object","type":"MealSpiceLevel","relationName":"MealToMealSpiceLevel"},{"name":"reviews","kind":"object","type":"Review","relationName":"MealToReview"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MealToOrderItem"}],"dbName":"meal"},"MealSize":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"extraPrice","kind":"scalar","type":"Int"},{"name":"isDefault","kind":"scalar","type":"Boolean"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToMealSize"}],"dbName":"meal_size"},"MealSpiceLevel":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"level","kind":"scalar","type":"String"},{"name":"isDefault","kind":"scalar","type":"Boolean"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToMealSpiceLevel"}],"dbName":"meal_spice_level"},"MealAddOn":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Int"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToMealAddOn"}],"dbName":"meal_add_on"},"MealRemoveOption":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToMealRemoveOption"}],"dbName":"meal_remove_option"},"MealIngredient":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToMealIngredient"}],"dbName":"meal_ingredient"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderNumber","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"paymentMethod","kind":"enum","type":"PaymentMethod"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"customerName","kind":"scalar","type":"String"},{"name":"customerPhone","kind":"scalar","type":"String"},{"name":"deliveryCity","kind":"scalar","type":"String"},{"name":"deliveryStreetAddress","kind":"scalar","type":"String"},{"name":"deliveryPostalCode","kind":"scalar","type":"String"},{"name":"deliveryApartment","kind":"scalar","type":"String"},{"name":"deliveryHouseNumber","kind":"scalar","type":"String"},{"name":"deliveryNote","kind":"scalar","type":"String"},{"name":"subtotal","kind":"scalar","type":"Decimal"},{"name":"deliveryFee","kind":"scalar","type":"Decimal"},{"name":"discountAmount","kind":"scalar","type":"Decimal"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"placedAt","kind":"scalar","type":"DateTime"},{"name":"acceptedAt","kind":"scalar","type":"DateTime"},{"name":"deliveredAt","kind":"scalar","type":"DateTime"},{"name":"cancelledAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"customer","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"OrderToProviderProfile"},{"name":"payments","kind":"object","type":"Payment","relationName":"OrderToPayment"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"orderStatusHistories","kind":"object","type":"OrderStatusHistory","relationName":"OrderToOrderStatusHistory"},{"name":"reviews","kind":"object","type":"Review","relationName":"OrderToReview"}],"dbName":"orders"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"mealName","kind":"scalar","type":"String"},{"name":"mealSlug","kind":"scalar","type":"String"},{"name":"mealImageUrl","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"unitPrice","kind":"scalar","type":"Decimal"},{"name":"totalPrice","kind":"scalar","type":"Decimal"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToOrderItem"}],"dbName":"order_items"},"OrderStatusHistory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"note","kind":"scalar","type":"String"},{"name":"changedByUserId","kind":"scalar","type":"String"},{"name":"changedByRole","kind":"enum","type":"UserRole"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderStatusHistory"}],"dbName":"order_status_history"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"platformFeePercent","kind":"scalar","type":"Decimal"},{"name":"platformFeeAmount","kind":"scalar","type":"Decimal"},{"name":"providerShareAmount","kind":"scalar","type":"Decimal"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"stripeEventId","kind":"scalar","type":"String"},{"name":"gatewayName","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"paymentGatewayData","kind":"scalar","type":"Json"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"failedAt","kind":"scalar","type":"DateTime"},{"name":"refundedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"cancelledAt","kind":"scalar","type":"DateTime"},{"name":"providerSettledAt","kind":"scalar","type":"DateTime"},{"name":"providerSettledBy","kind":"scalar","type":"String"},{"name":"providerSettlementNote","kind":"scalar","type":"String"},{"name":"providerSettlementStatus","kind":"enum","type":"ProviderSettlementStatus"},{"name":"customer","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToPayment"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"PaymentToProviderProfile"}],"dbName":"payments"},"ProviderProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"businessName","kind":"scalar","type":"String"},{"name":"businessCategory","kind":"enum","type":"BusinessCategory"},{"name":"phone","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"imageURL","kind":"scalar","type":"String"},{"name":"binNumber","kind":"scalar","type":"String"},{"name":"binVerified","kind":"scalar","type":"Boolean"},{"name":"city","kind":"scalar","type":"String"},{"name":"street","kind":"scalar","type":"String"},{"name":"houseNumber","kind":"scalar","type":"String"},{"name":"apartment","kind":"scalar","type":"String"},{"name":"postalCode","kind":"scalar","type":"String"},{"name":"approvalStatus","kind":"enum","type":"ApprovalStatus"},{"name":"rejectionReason","kind":"scalar","type":"String"},{"name":"reviewedBy","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"businessKitchenURL","kind":"scalar","type":"String"},{"name":"businessMainGateURL","kind":"scalar","type":"String"},{"name":"nidImageFront_and_BackURL","kind":"scalar","type":"String"},{"name":"businessEmail","kind":"scalar","type":"String"},{"name":"currentPayableAmount","kind":"scalar","type":"Decimal"},{"name":"lastPaymentAt","kind":"scalar","type":"DateTime"},{"name":"totalGrossRevenue","kind":"scalar","type":"Decimal"},{"name":"totalOrdersCompleted","kind":"scalar","type":"Int"},{"name":"totalPlatformFee","kind":"scalar","type":"Decimal"},{"name":"totalProviderEarning","kind":"scalar","type":"Decimal"},{"name":"carts","kind":"object","type":"Cart","relationName":"CartToProviderProfile"},{"name":"meals","kind":"object","type":"Meal","relationName":"MealToProviderProfile"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToProviderProfile"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToProviderProfile"},{"name":"user","kind":"object","type":"User","relationName":"ProviderProfileToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ProviderProfileToReview"}],"dbName":"provider_profile"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Float"},{"name":"feedback","kind":"scalar","type":"String"},{"name":"images","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToReview"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToReview"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"ProviderProfileToReview"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"}],"dbName":"reviews"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","Address.findUnique","Address.findUniqueOrThrow","orderBy","cursor","Address.findFirst","Address.findFirstOrThrow","Address.findMany","data","Address.createOne","Address.createMany","Address.createManyAndReturn","Address.updateOne","Address.updateMany","Address.updateManyAndReturn","create","update","Address.upsertOne","Address.deleteOne","Address.deleteMany","having","_count","_min","_max","Address.groupBy","Address.aggregate","user","accounts","customer","carts","cart","meal","cartItems","meals","category","provider","addOns","ingredients","removeOptions","sizes","spiceLevels","order","payments","orderItems","orderStatusHistories","reviews","orders","customerProfile","providerProfile","sessions","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Cart.findUnique","Cart.findUniqueOrThrow","Cart.findFirst","Cart.findFirstOrThrow","Cart.findMany","Cart.createOne","Cart.createMany","Cart.createManyAndReturn","Cart.updateOne","Cart.updateMany","Cart.updateManyAndReturn","Cart.upsertOne","Cart.deleteOne","Cart.deleteMany","_avg","_sum","Cart.groupBy","Cart.aggregate","CartItem.findUnique","CartItem.findUniqueOrThrow","CartItem.findFirst","CartItem.findFirstOrThrow","CartItem.findMany","CartItem.createOne","CartItem.createMany","CartItem.createManyAndReturn","CartItem.updateOne","CartItem.updateMany","CartItem.updateManyAndReturn","CartItem.upsertOne","CartItem.deleteOne","CartItem.deleteMany","CartItem.groupBy","CartItem.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","CustomerProfile.findUnique","CustomerProfile.findUniqueOrThrow","CustomerProfile.findFirst","CustomerProfile.findFirstOrThrow","CustomerProfile.findMany","CustomerProfile.createOne","CustomerProfile.createMany","CustomerProfile.createManyAndReturn","CustomerProfile.updateOne","CustomerProfile.updateMany","CustomerProfile.updateManyAndReturn","CustomerProfile.upsertOne","CustomerProfile.deleteOne","CustomerProfile.deleteMany","CustomerProfile.groupBy","CustomerProfile.aggregate","Meal.findUnique","Meal.findUniqueOrThrow","Meal.findFirst","Meal.findFirstOrThrow","Meal.findMany","Meal.createOne","Meal.createMany","Meal.createManyAndReturn","Meal.updateOne","Meal.updateMany","Meal.updateManyAndReturn","Meal.upsertOne","Meal.deleteOne","Meal.deleteMany","Meal.groupBy","Meal.aggregate","MealSize.findUnique","MealSize.findUniqueOrThrow","MealSize.findFirst","MealSize.findFirstOrThrow","MealSize.findMany","MealSize.createOne","MealSize.createMany","MealSize.createManyAndReturn","MealSize.updateOne","MealSize.updateMany","MealSize.updateManyAndReturn","MealSize.upsertOne","MealSize.deleteOne","MealSize.deleteMany","MealSize.groupBy","MealSize.aggregate","MealSpiceLevel.findUnique","MealSpiceLevel.findUniqueOrThrow","MealSpiceLevel.findFirst","MealSpiceLevel.findFirstOrThrow","MealSpiceLevel.findMany","MealSpiceLevel.createOne","MealSpiceLevel.createMany","MealSpiceLevel.createManyAndReturn","MealSpiceLevel.updateOne","MealSpiceLevel.updateMany","MealSpiceLevel.updateManyAndReturn","MealSpiceLevel.upsertOne","MealSpiceLevel.deleteOne","MealSpiceLevel.deleteMany","MealSpiceLevel.groupBy","MealSpiceLevel.aggregate","MealAddOn.findUnique","MealAddOn.findUniqueOrThrow","MealAddOn.findFirst","MealAddOn.findFirstOrThrow","MealAddOn.findMany","MealAddOn.createOne","MealAddOn.createMany","MealAddOn.createManyAndReturn","MealAddOn.updateOne","MealAddOn.updateMany","MealAddOn.updateManyAndReturn","MealAddOn.upsertOne","MealAddOn.deleteOne","MealAddOn.deleteMany","MealAddOn.groupBy","MealAddOn.aggregate","MealRemoveOption.findUnique","MealRemoveOption.findUniqueOrThrow","MealRemoveOption.findFirst","MealRemoveOption.findFirstOrThrow","MealRemoveOption.findMany","MealRemoveOption.createOne","MealRemoveOption.createMany","MealRemoveOption.createManyAndReturn","MealRemoveOption.updateOne","MealRemoveOption.updateMany","MealRemoveOption.updateManyAndReturn","MealRemoveOption.upsertOne","MealRemoveOption.deleteOne","MealRemoveOption.deleteMany","MealRemoveOption.groupBy","MealRemoveOption.aggregate","MealIngredient.findUnique","MealIngredient.findUniqueOrThrow","MealIngredient.findFirst","MealIngredient.findFirstOrThrow","MealIngredient.findMany","MealIngredient.createOne","MealIngredient.createMany","MealIngredient.createManyAndReturn","MealIngredient.updateOne","MealIngredient.updateMany","MealIngredient.updateManyAndReturn","MealIngredient.upsertOne","MealIngredient.deleteOne","MealIngredient.deleteMany","MealIngredient.groupBy","MealIngredient.aggregate","Order.findUnique","Order.findUniqueOrThrow","Order.findFirst","Order.findFirstOrThrow","Order.findMany","Order.createOne","Order.createMany","Order.createManyAndReturn","Order.updateOne","Order.updateMany","Order.updateManyAndReturn","Order.upsertOne","Order.deleteOne","Order.deleteMany","Order.groupBy","Order.aggregate","OrderItem.findUnique","OrderItem.findUniqueOrThrow","OrderItem.findFirst","OrderItem.findFirstOrThrow","OrderItem.findMany","OrderItem.createOne","OrderItem.createMany","OrderItem.createManyAndReturn","OrderItem.updateOne","OrderItem.updateMany","OrderItem.updateManyAndReturn","OrderItem.upsertOne","OrderItem.deleteOne","OrderItem.deleteMany","OrderItem.groupBy","OrderItem.aggregate","OrderStatusHistory.findUnique","OrderStatusHistory.findUniqueOrThrow","OrderStatusHistory.findFirst","OrderStatusHistory.findFirstOrThrow","OrderStatusHistory.findMany","OrderStatusHistory.createOne","OrderStatusHistory.createMany","OrderStatusHistory.createManyAndReturn","OrderStatusHistory.updateOne","OrderStatusHistory.updateMany","OrderStatusHistory.updateManyAndReturn","OrderStatusHistory.upsertOne","OrderStatusHistory.deleteOne","OrderStatusHistory.deleteMany","OrderStatusHistory.groupBy","OrderStatusHistory.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","ProviderProfile.findUnique","ProviderProfile.findUniqueOrThrow","ProviderProfile.findFirst","ProviderProfile.findFirstOrThrow","ProviderProfile.findMany","ProviderProfile.createOne","ProviderProfile.createMany","ProviderProfile.createManyAndReturn","ProviderProfile.updateOne","ProviderProfile.updateMany","ProviderProfile.updateManyAndReturn","ProviderProfile.upsertOne","ProviderProfile.deleteOne","ProviderProfile.deleteMany","ProviderProfile.groupBy","ProviderProfile.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","AND","OR","NOT","id","rating","feedback","images","createdAt","updatedAt","orderId","mealId","userId","providerId","equals","in","notIn","lt","lte","gt","gte","not","has","hasEvery","hasSome","contains","startsWith","endsWith","businessName","BusinessCategory","businessCategory","phone","bio","imageURL","binNumber","binVerified","city","street","houseNumber","apartment","postalCode","ApprovalStatus","approvalStatus","rejectionReason","reviewedBy","reviewedAt","isActive","businessKitchenURL","businessMainGateURL","nidImageFront_and_BackURL","businessEmail","currentPayableAmount","lastPaymentAt","totalGrossRevenue","totalOrdersCompleted","totalPlatformFee","totalProviderEarning","every","some","none","customerId","amount","platformFeePercent","platformFeeAmount","providerShareAmount","transactionId","stripeEventId","gatewayName","PaymentStatus","status","paymentGatewayData","paidAt","failedAt","refundedAt","cancelledAt","providerSettledAt","providerSettledBy","providerSettlementNote","ProviderSettlementStatus","providerSettlementStatus","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","OrderStatus","note","changedByUserId","UserRole","changedByRole","mealName","mealSlug","mealImageUrl","quantity","unitPrice","totalPrice","orderNumber","PaymentMethod","paymentMethod","customerName","customerPhone","deliveryCity","deliveryStreetAddress","deliveryPostalCode","deliveryApartment","deliveryHouseNumber","deliveryNote","subtotal","deliveryFee","discountAmount","totalAmount","placedAt","acceptedAt","deliveredAt","name","price","level","isDefault","extraPrice","categoryId","subcategory","shortDescription","fullDescription","portionSize","mainImageURL","galleryImageURLs","basePrice","discountPrice","dietaryPreferences","allergens","calories","protein","fat","carbohydrates","isAvailable","preparationTimeMinutes","isBestseller","isFeatured","tags","discountEndDate","discountStartDate","DietaryPreference","streetAddress","latitude","longitude","slug","displayOrder","cartId","baseUnitPrice","identifier","value","expiresAt","accountId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","role","userAccountStatus","needPasswordChange","isDeleted","deletedAt","userId_orderId","cartId_mealId","HouseType","label","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide","push"]'),
  graph: "igvHAdACDfQCAADdBQAw9QIAAAQAEPYCAADdBQAw9wIBAAAAAfsCQADqBAAh_AJAAOoEACGXAwEA5AQAIZgDAQDkBAAhmQMBAOQEACGaAwEA5gQAIZsDAQDkBAAh6QMgAOcEACGiBAAA3gWiBCIBAAAAAQAgAQAAAAEAIA30AgAA3QUAMPUCAAAEABD2AgAA3QUAMPcCAQDkBAAh-wJAAOoEACH8AkAA6gQAIZcDAQDkBAAhmAMBAOQEACGZAwEA5AQAIZoDAQDmBAAhmwMBAOQEACHpAyAA5wQAIaIEAADeBaIEIgGaAwAA3wUAIAMAAAAEACADAAAFADAEAAABACADAAAABAAgAwAABQAwBAAAAQAgAwAAAAQAIAMAAAUAMAQAAAEAIAr3AgEAAAAB-wJAAAAAAfwCQAAAAAGXAwEAAAABmAMBAAAAAZkDAQAAAAGaAwEAAAABmwMBAAAAAekDIAAAAAGiBAAAAKIEAgEIAAAJACAK9wIBAAAAAfsCQAAAAAH8AkAAAAABlwMBAAAAAZgDAQAAAAGZAwEAAAABmgMBAAAAAZsDAQAAAAHpAyAAAAABogQAAACiBAIBCAAACwAwAQgAAAsAMAr3AgEA5QUAIfsCQADpBQAh_AJAAOkFACGXAwEA5QUAIZgDAQDlBQAhmQMBAOUFACGaAwEA5wUAIZsDAQDlBQAh6QMgAPkFACGiBAAA6wmiBCICAAAAAQAgCAAADgAgCvcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIZcDAQDlBQAhmAMBAOUFACGZAwEA5QUAIZoDAQDnBQAhmwMBAOUFACHpAyAA-QUAIaIEAADrCaIEIgIAAAAEACAIAAAQACACAAAABAAgCAAAEAAgAwAAAAEAIA8AAAkAIBAAAA4AIAEAAAABACABAAAABAAgBBUAAOgJACAWAADqCQAgFwAA6QkAIJoDAADfBQAgDfQCAADZBQAw9QIAABcAEPYCAADZBQAw9wIBAMIEACH7AkAAxgQAIfwCQADGBAAhlwMBAMIEACGYAwEAwgQAIZkDAQDCBAAhmgMBAMQEACGbAwEAwgQAIekDIADTBAAhogQAANoFogQiAwAAAAQAIAMAABYAMBQAABcAIAMAAAAEACADAAAFADAEAAABACAXGwAArQUAICoAAPAEACAtAADyBAAgLgAA7wQAIC8AAK4FACAwAACvBQAgMQAAsAUAIPQCAACqBQAw9QIAAH8AEPYCAACqBQAw9wIBAAAAAfsCQADqBAAh_AJAAOoEACGSAwEA5gQAIbgDAACsBZwEIuYDAQDkBAAhlwQBAAAAAZgEIADnBAAhmQQBAOYEACGaBAAAqwXNAyKcBCAA5wQAIZ0EIADnBAAhngRAAOkEACEBAAAAGgAgERoAAPEEACD0AgAA2AUAMPUCAAAcABD2AgAA2AUAMPcCAQDkBAAh-wJAAOoEACH8AkAA6gQAIf8CAQDkBAAhgAMBAOQEACGMBAEA5AQAIY0EAQDmBAAhjgQBAOYEACGPBAEA5gQAIZAEQADpBAAhkQRAAOkEACGSBAEA5gQAIZMEAQDmBAAhCBoAAJQIACCNBAAA3wUAII4EAADfBQAgjwQAAN8FACCQBAAA3wUAIJEEAADfBQAgkgQAAN8FACCTBAAA3wUAIBEaAADxBAAg9AIAANgFADD1AgAAHAAQ9gIAANgFADD3AgEAAAAB-wJAAOoEACH8AkAA6gQAIf8CAQDkBAAhgAMBAOQEACGMBAEA5AQAIY0EAQDmBAAhjgQBAOYEACGPBAEA5gQAIZAEQADpBAAhkQRAAOkEACGSBAEA5gQAIZMEAQDmBAAhAwAAABwAIAMAAB0AMAQAAB4AIBEaAADxBAAgHgAAmgUAIPQCAACYBQAw9QIAACAAEPYCAACYBQAw9wIBAOQEACH7AkAA6gQAIfwCQADqBAAh_wIBAOQEACGSAwEA5AQAIZcDAQDkBAAhmQMBAOQEACGaAwEA5gQAIZsDAQDkBAAhggQBAOQEACGDBBAAmQUAIYQEEACZBQAhAQAAACAAIA8cAADXBQAgIAAAzwUAICMAALUFACD0AgAA1gUAMPUCAAAiABD2AgAA1gUAMPcCAQDkBAAh-wJAAOoEACH8AkAA6gQAIYADAQDkBAAhrwMBAOQEACHfAxAA6wQAIeADEADrBAAh4QMQAOsEACHiAxAA6wQAIQEAAAAiACADHAAA2gkAICAAAOEJACAjAADbCQAgDxwAANcFACAgAADPBQAgIwAAtQUAIPQCAADWBQAw9QIAACIAEPYCAADWBQAw9wIBAAAAAfsCQADqBAAh_AJAAOoEACGAAwEA5AQAIa8DAQAAAAHfAxAA6wQAIeADEADrBAAh4QMQAOsEACHiAxAA6wQAIQMAAAAiACADAAAkADAEAAAlACAqIAAAzwUAICIAANAFACAjAAC1BQAgJAAA0QUAICUAANIFACAmAADTBQAgJwAA1AUAICgAANUFACArAAC2BQAgLQAA8gQAIPQCAADMBQAw9QIAACcAEPYCAADMBQAw9wIBAOQEACH7AkAA6gQAIfwCQADqBAAhgAMBAOQEACGhAyAA5wQAIeADAgDsBAAh5gMBAOQEACHrAwEA5AQAIewDAQDmBAAh7QMBAOQEACHuAwEA5gQAIe8DAQDmBAAh8AMBAOQEACHxAwAAxQQAIPIDAgDsBAAh8wMCAM0FACH0AwAAjwUAIPUDAADFBAAg9gMCAM0FACH3AwgAzgUAIfgDCADOBQAh-QMIAM4FACH6AyAA5wQAIfsDAgDsBAAh_AMgAOcEACH9AyAA5wQAIf4DAADFBAAg_wNAAOkEACGABEAA6QQAIRQgAADhCQAgIgAA4gkAICMAANsJACAkAADjCQAgJQAA5AkAICYAAOUJACAnAADmCQAgKAAA5wkAICsAAN0JACAtAACVCAAg7AMAAN8FACDuAwAA3wUAIO8DAADfBQAg8wMAAN8FACD2AwAA3wUAIPcDAADfBQAg-AMAAN8FACD5AwAA3wUAIP8DAADfBQAggAQAAN8FACAqIAAAzwUAICIAANAFACAjAAC1BQAgJAAA0QUAICUAANIFACAmAADTBQAgJwAA1AUAICgAANUFACArAAC2BQAgLQAA8gQAIPQCAADMBQAw9QIAACcAEPYCAADMBQAw9wIBAAAAAfsCQADqBAAh_AJAAOoEACGAAwEA5AQAIaEDIADnBAAh4AMCAOwEACHmAwEA5AQAIesDAQDkBAAh7AMBAOYEACHtAwEA5AQAIe4DAQDmBAAh7wMBAOYEACHwAwEA5AQAIfEDAADFBAAg8gMCAOwEACHzAwIAzQUAIfQDAACPBQAg9QMAAMUEACD2AwIAzQUAIfcDCADOBQAh-AMIAM4FACH5AwgAzgUAIfoDIADnBAAh-wMCAOwEACH8AyAA5wQAIf0DIADnBAAh_gMAAMUEACD_A0AA6QQAIYAEQADpBAAhAwAAACcAIAMAACgAMAQAACkAIA4eAADLBQAgHwAAvAUAIPQCAADKBQAw9QIAACsAEPYCAADKBQAw9wIBAOQEACH7AkAA6gQAIfwCQADqBAAh_gIBAOQEACHRAwIA7AQAIdIDEADrBAAh0wMQAOsEACGHBAEA5AQAIYgEEADrBAAhAh4AAOEIACAfAADgCQAgDx4AAMsFACAfAAC8BQAg9AIAAMoFADD1AgAAKwAQ9gIAAMoFADD3AgEAAAAB-wJAAOoEACH8AkAA6gQAIf4CAQDkBAAh0QMCAOwEACHSAxAA6wQAIdMDEADrBAAhhwQBAOQEACGIBBAA6wQAIaAEAADJBQAgAwAAACsAIAMAACwAMAQAAC0AIAMAAAAnACADAAAoADAEAAApACABAAAAJwAgCB8AALwFACD0AgAAyAUAMPUCAAAxABD2AgAAyAUAMPcCAQDkBAAh_gIBAOQEACHmAwEA5AQAIecDAgDsBAAhAR8AAOAJACAIHwAAvAUAIPQCAADIBQAw9QIAADEAEPYCAADIBQAw9wIBAAAAAf4CAQDkBAAh5gMBAOQEACHnAwIA7AQAIQMAAAAxACADAAAyADAEAAAzACAHHwAAvAUAIPQCAADHBQAw9QIAADUAEPYCAADHBQAw9wIBAOQEACH-AgEA5AQAIeYDAQDkBAAhAR8AAOAJACAHHwAAvAUAIPQCAADHBQAw9QIAADUAEPYCAADHBQAw9wIBAAAAAf4CAQDkBAAh5gMBAOQEACEDAAAANQAgAwAANgAwBAAANwAgBx8AALwFACD0AgAAxgUAMPUCAAA5ABD2AgAAxgUAMPcCAQDkBAAh_gIBAOQEACHmAwEA5AQAIQEfAADgCQAgBx8AALwFACD0AgAAxgUAMPUCAAA5ABD2AgAAxgUAMPcCAQAAAAH-AgEA5AQAIeYDAQDkBAAhAwAAADkAIAMAADoAMAQAADsAIAkfAAC8BQAg9AIAAMUFADD1AgAAPQAQ9gIAAMUFADD3AgEA5AQAIf4CAQDkBAAh5gMBAOQEACHpAyAA5wQAIeoDAgDsBAAhAR8AAOAJACAJHwAAvAUAIPQCAADFBQAw9QIAAD0AEPYCAADFBQAw9wIBAAAAAf4CAQDkBAAh5gMBAOQEACHpAyAA5wQAIeoDAgDsBAAhAwAAAD0AIAMAAD4AMAQAAD8AIAgfAAC8BQAg9AIAAMQFADD1AgAAQQAQ9gIAAMQFADD3AgEA5AQAIf4CAQDkBAAh6AMBAOQEACHpAyAA5wQAIQEfAADgCQAgCB8AALwFACD0AgAAxAUAMPUCAABBABD2AgAAxAUAMPcCAQAAAAH-AgEA5AQAIegDAQDkBAAh6QMgAOcEACEDAAAAQQAgAwAAQgAwBAAAQwAgERoAAPEEACAfAAC8BQAgIwAAtQUAICkAALoFACD0AgAAwgUAMPUCAABFABD2AgAAwgUAMPcCAQDkBAAh-AIIAMMFACH5AgEA5gQAIfoCAADFBAAg-wJAAOoEACH8AkAA6gQAIf0CAQDkBAAh_gIBAOQEACH_AgEA5AQAIYADAQDkBAAhBRoAAJQIACAfAADgCQAgIwAA2wkAICkAAN8JACD5AgAA3wUAIBIaAADxBAAgHwAAvAUAICMAALUFACApAAC6BQAg9AIAAMIFADD1AgAARQAQ9gIAAMIFADD3AgEAAAAB-AIIAMMFACH5AgEA5gQAIfoCAADFBAAg-wJAAOoEACH8AkAA6gQAIf0CAQDkBAAh_gIBAOQEACH_AgEA5AQAIYADAQDkBAAhnwQAAMEFACADAAAARQAgAwAARgAwBAAARwAgHRwAAPEEACAjAAC1BQAgKQAAugUAIPQCAAC9BQAw9QIAAEkAEPYCAAC9BQAw9wIBAOQEACH7AkAA6gQAIfwCQADqBAAh_QIBAOQEACGAAwEA5AQAIa8DAQDkBAAhsAMQAOsEACGxAxAA6wQAIbIDEADrBAAhswMQAOsEACG0AwEA5AQAIbUDAQDmBAAhtgMBAOYEACG4AwAAvgW4AyK5AwAAvwUAILoDQADpBAAhuwNAAOkEACG8A0AA6QQAIb0DQADpBAAhvgNAAOkEACG_AwEA5gQAIcADAQDmBAAhwgMAAMAFwgMiDRwAAJQIACAjAADbCQAgKQAA3wkAILUDAADfBQAgtgMAAN8FACC5AwAA3wUAILoDAADfBQAguwMAAN8FACC8AwAA3wUAIL0DAADfBQAgvgMAAN8FACC_AwAA3wUAIMADAADfBQAgHRwAAPEEACAjAAC1BQAgKQAAugUAIPQCAAC9BQAw9QIAAEkAEPYCAAC9BQAw9wIBAAAAAfsCQADqBAAh_AJAAOoEACH9AgEA5AQAIYADAQDkBAAhrwMBAOQEACGwAxAA6wQAIbEDEADrBAAhsgMQAOsEACGzAxAA6wQAIbQDAQAAAAG1AwEAAAABtgMBAOYEACG4AwAAvgW4AyK5AwAAvwUAILoDQADpBAAhuwNAAOkEACG8A0AA6QQAIb0DQADpBAAhvgNAAOkEACG_AwEA5gQAIcADAQDmBAAhwgMAAMAFwgMiAwAAAEkAIAMAAEoAMAQAAEsAIA8fAAC8BQAgKQAAugUAIPQCAAC7BQAw9QIAAE0AEPYCAAC7BQAw9wIBAOQEACH7AkAA6gQAIf0CAQDkBAAh_gIBAOQEACHOAwEA5AQAIc8DAQDmBAAh0AMBAOYEACHRAwIA7AQAIdIDEADrBAAh0wMQAOsEACEEHwAA4AkAICkAAN8JACDPAwAA3wUAINADAADfBQAgDx8AALwFACApAAC6BQAg9AIAALsFADD1AgAATQAQ9gIAALsFADD3AgEAAAAB-wJAAOoEACH9AgEA5AQAIf4CAQDkBAAhzgMBAOQEACHPAwEA5gQAIdADAQDmBAAh0QMCAOwEACHSAxAA6wQAIdMDEADrBAAhAwAAAE0AIAMAAE4AMAQAAE8AIAspAAC6BQAg9AIAALgFADD1AgAAUQAQ9gIAALgFADD3AgEA5AQAIfsCQADqBAAh_QIBAOQEACG4AwAAtAXKAyLKAwEA5gQAIcsDAQDmBAAhzQMAALkFzQMjBCkAAN8JACDKAwAA3wUAIMsDAADfBQAgzQMAAN8FACALKQAAugUAIPQCAAC4BQAw9QIAAFEAEPYCAAC4BQAw9wIBAAAAAfsCQADqBAAh_QIBAOQEACG4AwAAtAXKAyLKAwEA5gQAIcsDAQDmBAAhzQMAALkFzQMjAwAAAFEAIAMAAFIAMAQAAFMAIAMAAABFACADAABGADAEAABHACABAAAASQAgAQAAAE0AIAEAAABRACABAAAARQAgAwAAAE0AIAMAAE4AMAQAAE8AIAEAAAArACABAAAAMQAgAQAAADUAIAEAAAA5ACABAAAAPQAgAQAAAEEAIAEAAABFACABAAAATQAgIRwAAPEEACAjAAC1BQAgKgAA8AQAICsAALYFACAsAAC3BQAgLQAA8gQAIPQCAACyBQAw9QIAAGMAEPYCAACyBQAw9wIBAOQEACH7AkAA6gQAIfwCQADqBAAhgAMBAOQEACGvAwEA5AQAIbgDAAC0BcoDIr0DQADpBAAh1AMBAOQEACHWAwAAswXWAyLXAwEA5gQAIdgDAQDmBAAh2QMBAOQEACHaAwEA5gQAIdsDAQDmBAAh3AMBAOYEACHdAwEA5gQAId4DAQDmBAAh3wMQAOsEACHgAxAA6wQAIeEDEADrBAAh4gMQAOsEACHjA0AA6QQAIeQDQADpBAAh5QNAAOkEACERHAAAlAgAICMAANsJACAqAACTCAAgKwAA3QkAICwAAN4JACAtAACVCAAgvQMAAN8FACDXAwAA3wUAINgDAADfBQAg2gMAAN8FACDbAwAA3wUAINwDAADfBQAg3QMAAN8FACDeAwAA3wUAIOMDAADfBQAg5AMAAN8FACDlAwAA3wUAICEcAADxBAAgIwAAtQUAICoAAPAEACArAAC2BQAgLAAAtwUAIC0AAPIEACD0AgAAsgUAMPUCAABjABD2AgAAsgUAMPcCAQAAAAH7AkAA6gQAIfwCQADqBAAhgAMBAOQEACGvAwEA5AQAIbgDAAC0BcoDIr0DQADpBAAh1AMBAAAAAdYDAACzBdYDItcDAQDmBAAh2AMBAOYEACHZAwEA5AQAIdoDAQDmBAAh2wMBAOYEACHcAwEA5gQAId0DAQDmBAAh3gMBAOYEACHfAxAA6wQAIeADEADrBAAh4QMQAOsEACHiAxAA6wQAIeMDQADpBAAh5ANAAOkEACHlA0AA6QQAIQMAAABjACADAABkADAEAABlACADAAAASQAgAwAASgAwBAAASwAgAwAAAEUAIAMAAEYAMAQAAEcAIAEAAAAiACABAAAAJwAgAQAAAGMAIAEAAABJACABAAAARQAgAwAAACsAIAMAACwAMAQAAC0AIAEAAAArACADAAAAYwAgAwAAZAAwBAAAZQAgAwAAAEkAIAMAAEoAMAQAAEsAICgaAADxBAAgHQAA7QQAICEAAO4EACAqAADwBAAgLQAA8gQAIC4AAO8EACD0AgAA4wQAMPUCAAByABD2AgAA4wQAMPcCAQDkBAAh-wJAAOoEACH8AkAA6gQAIf8CAQDkBAAhjwMBAOQEACGRAwAA5QSRAyKSAwEA5AQAIZMDAQDmBAAhlAMBAOYEACGVAwEA5gQAIZYDIADnBAAhlwMBAOQEACGYAwEA5AQAIZkDAQDkBAAhmgMBAOYEACGbAwEA5AQAIZ0DAADoBJ0DIp4DAQDmBAAhnwMBAOYEACGgA0AA6QQAIaEDIADnBAAhogMBAOYEACGjAwEA5gQAIaQDAQDmBAAhpQMBAOQEACGmAxAA6wQAIacDQADpBAAhqAMQAOsEACGpAwIA7AQAIaoDEADrBAAhqwMQAOsEACEBAAAAcgAgAwAAAEUAIAMAAEYAMAQAAEcAIAwaAADxBAAg9AIAALEFADD1AgAAdQAQ9gIAALEFADD3AgEA5AQAIfsCQADqBAAh_AJAAOoEACH_AgEA5AQAIYsEQADqBAAhlAQBAOQEACGVBAEA5gQAIZYEAQDmBAAhAxoAAJQIACCVBAAA3wUAIJYEAADfBQAgDBoAAPEEACD0AgAAsQUAMPUCAAB1ABD2AgAAsQUAMPcCAQAAAAH7AkAA6gQAIfwCQADqBAAh_wIBAOQEACGLBEAA6gQAIZQEAQAAAAGVBAEA5gQAIZYEAQDmBAAhAwAAAHUAIAMAAHYAMAQAAHcAIAEAAAAcACABAAAAYwAgAQAAAEkAIAEAAABFACABAAAAdQAgAQAAABoAIBcbAACtBQAgKgAA8AQAIC0AAPIEACAuAADvBAAgLwAArgUAIDAAAK8FACAxAACwBQAg9AIAAKoFADD1AgAAfwAQ9gIAAKoFADD3AgEA5AQAIfsCQADqBAAh_AJAAOoEACGSAwEA5gQAIbgDAACsBZwEIuYDAQDkBAAhlwQBAOQEACGYBCAA5wQAIZkEAQDmBAAhmgQAAKsFzQMinAQgAOcEACGdBCAA5wQAIZ4EQADpBAAhChsAANkJACAqAACTCAAgLQAAlQgAIC4AAJIIACAvAADaCQAgMAAA2wkAIDEAANwJACCSAwAA3wUAIJkEAADfBQAgngQAAN8FACADAAAAfwAgAwAAgAEAMAQAABoAIAMAAAB_ACADAACAAQAwBAAAGgAgAwAAAH8AIAMAAIABADAEAAAaACAUGwAA0gkAICoAANUJACAtAADXCQAgLgAA1AkAIC8AANMJACAwAADWCQAgMQAA2AkAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAZIDAQAAAAG4AwAAAJwEAuYDAQAAAAGXBAEAAAABmAQgAAAAAZkEAQAAAAGaBAAAAM0DApwEIAAAAAGdBCAAAAABngRAAAAAAQEIAACEAQAgDfcCAQAAAAH7AkAAAAAB_AJAAAAAAZIDAQAAAAG4AwAAAJwEAuYDAQAAAAGXBAEAAAABmAQgAAAAAZkEAQAAAAGaBAAAAM0DApwEIAAAAAGdBCAAAAABngRAAAAAAQEIAACGAQAwAQgAAIYBADAUGwAAjgkAICoAAJEJACAtAACTCQAgLgAAkAkAIC8AAI8JACAwAACSCQAgMQAAlAkAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIZIDAQDnBQAhuAMAAI0JnAQi5gMBAOUFACGXBAEA5QUAIZgEIAD5BQAhmQQBAOcFACGaBAAAjAnNAyKcBCAA-QUAIZ0EIAD5BQAhngRAAPsFACECAAAAGgAgCAAAiQEAIA33AgEA5QUAIfsCQADpBQAh_AJAAOkFACGSAwEA5wUAIbgDAACNCZwEIuYDAQDlBQAhlwQBAOUFACGYBCAA-QUAIZkEAQDnBQAhmgQAAIwJzQMinAQgAPkFACGdBCAA-QUAIZ4EQAD7BQAhAgAAAH8AIAgAAIsBACACAAAAfwAgCAAAiwEAIAMAAAAaACAPAACEAQAgEAAAiQEAIAEAAAAaACABAAAAfwAgBhUAAIkJACAWAACLCQAgFwAAigkAIJIDAADfBQAgmQQAAN8FACCeBAAA3wUAIBD0AgAAowUAMPUCAACSAQAQ9gIAAKMFADD3AgEAwgQAIfsCQADGBAAh_AJAAMYEACGSAwEAxAQAIbgDAAClBZwEIuYDAQDCBAAhlwQBAMIEACGYBCAA0wQAIZkEAQDEBAAhmgQAAKQFzQMinAQgANMEACGdBCAA0wQAIZ4EQADVBAAhAwAAAH8AIAMAAJEBADAUAACSAQAgAwAAAH8AIAMAAIABADAEAAAaACABAAAAdwAgAQAAAHcAIAMAAAB1ACADAAB2ADAEAAB3ACADAAAAdQAgAwAAdgAwBAAAdwAgAwAAAHUAIAMAAHYAMAQAAHcAIAkaAACICQAg9wIBAAAAAfsCQAAAAAH8AkAAAAAB_wIBAAAAAYsEQAAAAAGUBAEAAAABlQQBAAAAAZYEAQAAAAEBCAAAmgEAIAj3AgEAAAAB-wJAAAAAAfwCQAAAAAH_AgEAAAABiwRAAAAAAZQEAQAAAAGVBAEAAAABlgQBAAAAAQEIAACcAQAwAQgAAJwBADAJGgAAhwkAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIf8CAQDlBQAhiwRAAOkFACGUBAEA5QUAIZUEAQDnBQAhlgQBAOcFACECAAAAdwAgCAAAnwEAIAj3AgEA5QUAIfsCQADpBQAh_AJAAOkFACH_AgEA5QUAIYsEQADpBQAhlAQBAOUFACGVBAEA5wUAIZYEAQDnBQAhAgAAAHUAIAgAAKEBACACAAAAdQAgCAAAoQEAIAMAAAB3ACAPAACaAQAgEAAAnwEAIAEAAAB3ACABAAAAdQAgBRUAAIQJACAWAACGCQAgFwAAhQkAIJUEAADfBQAglgQAAN8FACAL9AIAAKIFADD1AgAAqAEAEPYCAACiBQAw9wIBAMIEACH7AkAAxgQAIfwCQADGBAAh_wIBAMIEACGLBEAAxgQAIZQEAQDCBAAhlQQBAMQEACGWBAEAxAQAIQMAAAB1ACADAACnAQAwFAAAqAEAIAMAAAB1ACADAAB2ADAEAAB3ACABAAAAHgAgAQAAAB4AIAMAAAAcACADAAAdADAEAAAeACADAAAAHAAgAwAAHQAwBAAAHgAgAwAAABwAIAMAAB0AMAQAAB4AIA4aAACDCQAg9wIBAAAAAfsCQAAAAAH8AkAAAAAB_wIBAAAAAYADAQAAAAGMBAEAAAABjQQBAAAAAY4EAQAAAAGPBAEAAAABkARAAAAAAZEEQAAAAAGSBAEAAAABkwQBAAAAAQEIAACwAQAgDfcCAQAAAAH7AkAAAAAB_AJAAAAAAf8CAQAAAAGAAwEAAAABjAQBAAAAAY0EAQAAAAGOBAEAAAABjwQBAAAAAZAEQAAAAAGRBEAAAAABkgQBAAAAAZMEAQAAAAEBCAAAsgEAMAEIAACyAQAwDhoAAIIJACD3AgEA5QUAIfsCQADpBQAh_AJAAOkFACH_AgEA5QUAIYADAQDlBQAhjAQBAOUFACGNBAEA5wUAIY4EAQDnBQAhjwQBAOcFACGQBEAA-wUAIZEEQAD7BQAhkgQBAOcFACGTBAEA5wUAIQIAAAAeACAIAAC1AQAgDfcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIf8CAQDlBQAhgAMBAOUFACGMBAEA5QUAIY0EAQDnBQAhjgQBAOcFACGPBAEA5wUAIZAEQAD7BQAhkQRAAPsFACGSBAEA5wUAIZMEAQDnBQAhAgAAABwAIAgAALcBACACAAAAHAAgCAAAtwEAIAMAAAAeACAPAACwAQAgEAAAtQEAIAEAAAAeACABAAAAHAAgChUAAP8IACAWAACBCQAgFwAAgAkAII0EAADfBQAgjgQAAN8FACCPBAAA3wUAIJAEAADfBQAgkQQAAN8FACCSBAAA3wUAIJMEAADfBQAgEPQCAAChBQAw9QIAAL4BABD2AgAAoQUAMPcCAQDCBAAh-wJAAMYEACH8AkAAxgQAIf8CAQDCBAAhgAMBAMIEACGMBAEAwgQAIY0EAQDEBAAhjgQBAMQEACGPBAEAxAQAIZAEQADVBAAhkQRAANUEACGSBAEAxAQAIZMEAQDEBAAhAwAAABwAIAMAAL0BADAUAAC-AQAgAwAAABwAIAMAAB0AMAQAAB4AIAn0AgAAoAUAMPUCAADEAQAQ9gIAAKAFADD3AgEAAAAB-wJAAOoEACH8AkAA6gQAIYkEAQDkBAAhigQBAOQEACGLBEAA6gQAIQEAAADBAQAgAQAAAMEBACAJ9AIAAKAFADD1AgAAxAEAEPYCAACgBQAw9wIBAOQEACH7AkAA6gQAIfwCQADqBAAhiQQBAOQEACGKBAEA5AQAIYsEQADqBAAhAAMAAADEAQAgAwAAxQEAMAQAAMEBACADAAAAxAEAIAMAAMUBADAEAADBAQAgAwAAAMQBACADAADFAQAwBAAAwQEAIAb3AgEAAAAB-wJAAAAAAfwCQAAAAAGJBAEAAAABigQBAAAAAYsEQAAAAAEBCAAAyQEAIAb3AgEAAAAB-wJAAAAAAfwCQAAAAAGJBAEAAAABigQBAAAAAYsEQAAAAAEBCAAAywEAMAEIAADLAQAwBvcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIYkEAQDlBQAhigQBAOUFACGLBEAA6QUAIQIAAADBAQAgCAAAzgEAIAb3AgEA5QUAIfsCQADpBQAh_AJAAOkFACGJBAEA5QUAIYoEAQDlBQAhiwRAAOkFACECAAAAxAEAIAgAANABACACAAAAxAEAIAgAANABACADAAAAwQEAIA8AAMkBACAQAADOAQAgAQAAAMEBACABAAAAxAEAIAMVAAD8CAAgFgAA_ggAIBcAAP0IACAJ9AIAAJ8FADD1AgAA1wEAEPYCAACfBQAw9wIBAMIEACH7AkAAxgQAIfwCQADGBAAhiQQBAMIEACGKBAEAwgQAIYsEQADGBAAhAwAAAMQBACADAADWAQAwFAAA1wEAIAMAAADEAQAgAwAAxQEAMAQAAMEBACABAAAAJQAgAQAAACUAIAMAAAAiACADAAAkADAEAAAlACADAAAAIgAgAwAAJAAwBAAAJQAgAwAAACIAIAMAACQAMAQAACUAIAwcAACICAAgIAAAiQgAICMAAN4IACD3AgEAAAAB-wJAAAAAAfwCQAAAAAGAAwEAAAABrwMBAAAAAd8DEAAAAAHgAxAAAAAB4QMQAAAAAeIDEAAAAAEBCAAA3wEAIAn3AgEAAAAB-wJAAAAAAfwCQAAAAAGAAwEAAAABrwMBAAAAAd8DEAAAAAHgAxAAAAAB4QMQAAAAAeIDEAAAAAEBCAAA4QEAMAEIAADhAQAwDBwAAPoHACAgAAD7BwAgIwAA3QgAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIYADAQDlBQAhrwMBAOUFACHfAxAA_AUAIeADEAD8BQAh4QMQAPwFACHiAxAA_AUAIQIAAAAlACAIAADkAQAgCfcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIYADAQDlBQAhrwMBAOUFACHfAxAA_AUAIeADEAD8BQAh4QMQAPwFACHiAxAA_AUAIQIAAAAiACAIAADmAQAgAgAAACIAIAgAAOYBACADAAAAJQAgDwAA3wEAIBAAAOQBACABAAAAJQAgAQAAACIAIAUVAAD3CAAgFgAA-ggAIBcAAPkIACCAAQAA-AgAIIEBAAD7CAAgDPQCAACeBQAw9QIAAO0BABD2AgAAngUAMPcCAQDCBAAh-wJAAMYEACH8AkAAxgQAIYADAQDCBAAhrwMBAMIEACHfAxAA1gQAIeADEADWBAAh4QMQANYEACHiAxAA1gQAIQMAAAAiACADAADsAQAwFAAA7QEAIAMAAAAiACADAAAkADAEAAAlACABAAAALQAgAQAAAC0AIAMAAAArACADAAAsADAEAAAtACADAAAAKwAgAwAALAAwBAAALQAgAwAAACsAIAMAACwAMAQAAC0AIAseAADgBwAgHwAAhggAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAf4CAQAAAAHRAwIAAAAB0gMQAAAAAdMDEAAAAAGHBAEAAAABiAQQAAAAAQEIAAD1AQAgCfcCAQAAAAH7AkAAAAAB_AJAAAAAAf4CAQAAAAHRAwIAAAAB0gMQAAAAAdMDEAAAAAGHBAEAAAABiAQQAAAAAQEIAAD3AQAwAQgAAPcBADALHgAA3gcAIB8AAIQIACD3AgEA5QUAIfsCQADpBQAh_AJAAOkFACH-AgEA5QUAIdEDAgD9BQAh0gMQAPwFACHTAxAA_AUAIYcEAQDlBQAhiAQQAPwFACECAAAALQAgCAAA-gEAIAn3AgEA5QUAIfsCQADpBQAh_AJAAOkFACH-AgEA5QUAIdEDAgD9BQAh0gMQAPwFACHTAxAA_AUAIYcEAQDlBQAhiAQQAPwFACECAAAAKwAgCAAA_AEAIAIAAAArACAIAAD8AQAgAwAAAC0AIA8AAPUBACAQAAD6AQAgAQAAAC0AIAEAAAArACAFFQAA8ggAIBYAAPUIACAXAAD0CAAggAEAAPMIACCBAQAA9ggAIAz0AgAAnQUAMPUCAACDAgAQ9gIAAJ0FADD3AgEAwgQAIfsCQADGBAAh_AJAAMYEACH-AgEAwgQAIdEDAgDXBAAh0gMQANYEACHTAxAA1gQAIYcEAQDCBAAhiAQQANYEACEDAAAAKwAgAwAAggIAMBQAAIMCACADAAAAKwAgAwAALAAwBAAALQAgDCEAAO4EACD0AgAAnAUAMPUCAACJAgAQ9gIAAJwFADD3AgEAAAAB-wJAAOoEACH8AkAA6gQAIZQDAQDkBAAhoQMgAOcEACHmAwEAAAABhQQBAAAAAYYEAgDsBAAhAQAAAIYCACABAAAAhgIAIAwhAADuBAAg9AIAAJwFADD1AgAAiQIAEPYCAACcBQAw9wIBAOQEACH7AkAA6gQAIfwCQADqBAAhlAMBAOQEACGhAyAA5wQAIeYDAQDkBAAhhQQBAOQEACGGBAIA7AQAIQEhAACRCAAgAwAAAIkCACADAACKAgAwBAAAhgIAIAMAAACJAgAgAwAAigIAMAQAAIYCACADAAAAiQIAIAMAAIoCADAEAACGAgAgCSEAAPEIACD3AgEAAAAB-wJAAAAAAfwCQAAAAAGUAwEAAAABoQMgAAAAAeYDAQAAAAGFBAEAAAABhgQCAAAAAQEIAACOAgAgCPcCAQAAAAH7AkAAAAAB_AJAAAAAAZQDAQAAAAGhAyAAAAAB5gMBAAAAAYUEAQAAAAGGBAIAAAABAQgAAJACADABCAAAkAIAMAkhAADnCAAg9wIBAOUFACH7AkAA6QUAIfwCQADpBQAhlAMBAOUFACGhAyAA-QUAIeYDAQDlBQAhhQQBAOUFACGGBAIA_QUAIQIAAACGAgAgCAAAkwIAIAj3AgEA5QUAIfsCQADpBQAh_AJAAOkFACGUAwEA5QUAIaEDIAD5BQAh5gMBAOUFACGFBAEA5QUAIYYEAgD9BQAhAgAAAIkCACAIAACVAgAgAgAAAIkCACAIAACVAgAgAwAAAIYCACAPAACOAgAgEAAAkwIAIAEAAACGAgAgAQAAAIkCACAFFQAA4ggAIBYAAOUIACAXAADkCAAggAEAAOMIACCBAQAA5ggAIAv0AgAAmwUAMPUCAACcAgAQ9gIAAJsFADD3AgEAwgQAIfsCQADGBAAh_AJAAMYEACGUAwEAwgQAIaEDIADTBAAh5gMBAMIEACGFBAEAwgQAIYYEAgDXBAAhAwAAAIkCACADAACbAgAwFAAAnAIAIAMAAACJAgAgAwAAigIAMAQAAIYCACARGgAA8QQAIB4AAJoFACD0AgAAmAUAMPUCAAAgABD2AgAAmAUAMPcCAQAAAAH7AkAA6gQAIfwCQADqBAAh_wIBAAAAAZIDAQDkBAAhlwMBAOQEACGZAwEA5AQAIZoDAQDmBAAhmwMBAOQEACGCBAEA5AQAIYMEEACZBQAhhAQQAJkFACEBAAAAnwIAIAEAAACfAgAgBRoAAJQIACAeAADhCAAgmgMAAN8FACCDBAAA3wUAIIQEAADfBQAgAwAAACAAIAMAAKICADAEAACfAgAgAwAAACAAIAMAAKICADAEAACfAgAgAwAAACAAIAMAAKICADAEAACfAgAgDhoAAOAIACAeAADfCAAg9wIBAAAAAfsCQAAAAAH8AkAAAAAB_wIBAAAAAZIDAQAAAAGXAwEAAAABmQMBAAAAAZoDAQAAAAGbAwEAAAABggQBAAAAAYMEEAAAAAGEBBAAAAABAQgAAKYCACAM9wIBAAAAAfsCQAAAAAH8AkAAAAAB_wIBAAAAAZIDAQAAAAGXAwEAAAABmQMBAAAAAZoDAQAAAAGbAwEAAAABggQBAAAAAYMEEAAAAAGEBBAAAAABAQgAAKgCADABCAAAqAIAMA4aAADXCAAgHgAA1ggAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIf8CAQDlBQAhkgMBAOUFACGXAwEA5QUAIZkDAQDlBQAhmgMBAOcFACGbAwEA5QUAIYIEAQDlBQAhgwQQANUIACGEBBAA1QgAIQIAAACfAgAgCAAAqwIAIAz3AgEA5QUAIfsCQADpBQAh_AJAAOkFACH_AgEA5QUAIZIDAQDlBQAhlwMBAOUFACGZAwEA5QUAIZoDAQDnBQAhmwMBAOUFACGCBAEA5QUAIYMEEADVCAAhhAQQANUIACECAAAAIAAgCAAArQIAIAIAAAAgACAIAACtAgAgAwAAAJ8CACAPAACmAgAgEAAAqwIAIAEAAACfAgAgAQAAACAAIAgVAADQCAAgFgAA0wgAIBcAANIIACCAAQAA0QgAIIEBAADUCAAgmgMAAN8FACCDBAAA3wUAIIQEAADfBQAgD_QCAACUBQAw9QIAALQCABD2AgAAlAUAMPcCAQDCBAAh-wJAAMYEACH8AkAAxgQAIf8CAQDCBAAhkgMBAMIEACGXAwEAwgQAIZkDAQDCBAAhmgMBAMQEACGbAwEAwgQAIYIEAQDCBAAhgwQQAJUFACGEBBAAlQUAIQMAAAAgACADAACzAgAwFAAAtAIAIAMAAAAgACADAACiAgAwBAAAnwIAIAEAAAApACABAAAAKQAgAwAAACcAIAMAACgAMAQAACkAIAMAAAAnACADAAAoADAEAAApACADAAAAJwAgAwAAKAAwBAAAKQAgJyAAAOYHACAiAADnBwAgIwAAzwgAICQAAOgHACAlAADpBwAgJgAA6gcAICcAAOsHACAoAADsBwAgKwAA7gcAIC0AAO0HACD3AgEAAAAB-wJAAAAAAfwCQAAAAAGAAwEAAAABoQMgAAAAAeADAgAAAAHmAwEAAAAB6wMBAAAAAewDAQAAAAHtAwEAAAAB7gMBAAAAAe8DAQAAAAHwAwEAAAAB8QMAAOIHACDyAwIAAAAB8wMCAAAAAfQDAADjBwAg9QMAAOQHACD2AwIAAAAB9wMIAAAAAfgDCAAAAAH5AwgAAAAB-gMgAAAAAfsDAgAAAAH8AyAAAAAB_QMgAAAAAf4DAADlBwAg_wNAAAAAAYAEQAAAAAEBCAAAvAIAIB33AgEAAAAB-wJAAAAAAfwCQAAAAAGAAwEAAAABoQMgAAAAAeADAgAAAAHmAwEAAAAB6wMBAAAAAewDAQAAAAHtAwEAAAAB7gMBAAAAAe8DAQAAAAHwAwEAAAAB8QMAAOIHACDyAwIAAAAB8wMCAAAAAfQDAADjBwAg9QMAAOQHACD2AwIAAAAB9wMIAAAAAfgDCAAAAAH5AwgAAAAB-gMgAAAAAfsDAgAAAAH8AyAAAAAB_QMgAAAAAf4DAADlBwAg_wNAAAAAAYAEQAAAAAEBCAAAvgIAMAEIAAC-AgAwJyAAAPoGACAiAAD7BgAgIwAAzggAICQAAPwGACAlAAD9BgAgJgAA_gYAICcAAP8GACAoAACABwAgKwAAggcAIC0AAIEHACD3AgEA5QUAIfsCQADpBQAh_AJAAOkFACGAAwEA5QUAIaEDIAD5BQAh4AMCAP0FACHmAwEA5QUAIesDAQDlBQAh7AMBAOcFACHtAwEA5QUAIe4DAQDnBQAh7wMBAOcFACHwAwEA5QUAIfEDAADzBgAg8gMCAP0FACHzAwIA9AYAIfQDAAD1BgAg9QMAAPYGACD2AwIA9AYAIfcDCAD3BgAh-AMIAPcGACH5AwgA9wYAIfoDIAD5BQAh-wMCAP0FACH8AyAA-QUAIf0DIAD5BQAh_gMAAPgGACD_A0AA-wUAIYAEQAD7BQAhAgAAACkAIAgAAMECACAd9wIBAOUFACH7AkAA6QUAIfwCQADpBQAhgAMBAOUFACGhAyAA-QUAIeADAgD9BQAh5gMBAOUFACHrAwEA5QUAIewDAQDnBQAh7QMBAOUFACHuAwEA5wUAIe8DAQDnBQAh8AMBAOUFACHxAwAA8wYAIPIDAgD9BQAh8wMCAPQGACH0AwAA9QYAIPUDAAD2BgAg9gMCAPQGACH3AwgA9wYAIfgDCAD3BgAh-QMIAPcGACH6AyAA-QUAIfsDAgD9BQAh_AMgAPkFACH9AyAA-QUAIf4DAAD4BgAg_wNAAPsFACGABEAA-wUAIQIAAAAnACAIAADDAgAgAgAAACcAIAgAAMMCACADAAAAKQAgDwAAvAIAIBAAAMECACABAAAAKQAgAQAAACcAIA8VAADJCAAgFgAAzAgAIBcAAMsIACCAAQAAyggAIIEBAADNCAAg7AMAAN8FACDuAwAA3wUAIO8DAADfBQAg8wMAAN8FACD2AwAA3wUAIPcDAADfBQAg-AMAAN8FACD5AwAA3wUAIP8DAADfBQAggAQAAN8FACAg9AIAAI0FADD1AgAAygIAEPYCAACNBQAw9wIBAMIEACH7AkAAxgQAIfwCQADGBAAhgAMBAMIEACGhAyAA0wQAIeADAgDXBAAh5gMBAMIEACHrAwEAwgQAIewDAQDEBAAh7QMBAMIEACHuAwEAxAQAIe8DAQDEBAAh8AMBAMIEACHxAwAAxQQAIPIDAgDXBAAh8wMCAI4FACH0AwAAjwUAIPUDAADFBAAg9gMCAI4FACH3AwgAkAUAIfgDCACQBQAh-QMIAJAFACH6AyAA0wQAIfsDAgDXBAAh_AMgANMEACH9AyAA0wQAIf4DAADFBAAg_wNAANUEACGABEAA1QQAIQMAAAAnACADAADJAgAwFAAAygIAIAMAAAAnACADAAAoADAEAAApACABAAAAPwAgAQAAAD8AIAMAAAA9ACADAAA-ADAEAAA_ACADAAAAPQAgAwAAPgAwBAAAPwAgAwAAAD0AIAMAAD4AMAQAAD8AIAYfAADICAAg9wIBAAAAAf4CAQAAAAHmAwEAAAAB6QMgAAAAAeoDAgAAAAEBCAAA0gIAIAX3AgEAAAAB_gIBAAAAAeYDAQAAAAHpAyAAAAAB6gMCAAAAAQEIAADUAgAwAQgAANQCADAGHwAAxwgAIPcCAQDlBQAh_gIBAOUFACHmAwEA5QUAIekDIAD5BQAh6gMCAP0FACECAAAAPwAgCAAA1wIAIAX3AgEA5QUAIf4CAQDlBQAh5gMBAOUFACHpAyAA-QUAIeoDAgD9BQAhAgAAAD0AIAgAANkCACACAAAAPQAgCAAA2QIAIAMAAAA_ACAPAADSAgAgEAAA1wIAIAEAAAA_ACABAAAAPQAgBRUAAMIIACAWAADFCAAgFwAAxAgAIIABAADDCAAggQEAAMYIACAI9AIAAIwFADD1AgAA4AIAEPYCAACMBQAw9wIBAMIEACH-AgEAwgQAIeYDAQDCBAAh6QMgANMEACHqAwIA1wQAIQMAAAA9ACADAADfAgAwFAAA4AIAIAMAAAA9ACADAAA-ADAEAAA_ACABAAAAQwAgAQAAAEMAIAMAAABBACADAABCADAEAABDACADAAAAQQAgAwAAQgAwBAAAQwAgAwAAAEEAIAMAAEIAMAQAAEMAIAUfAADBCAAg9wIBAAAAAf4CAQAAAAHoAwEAAAAB6QMgAAAAAQEIAADoAgAgBPcCAQAAAAH-AgEAAAAB6AMBAAAAAekDIAAAAAEBCAAA6gIAMAEIAADqAgAwBR8AAMAIACD3AgEA5QUAIf4CAQDlBQAh6AMBAOUFACHpAyAA-QUAIQIAAABDACAIAADtAgAgBPcCAQDlBQAh_gIBAOUFACHoAwEA5QUAIekDIAD5BQAhAgAAAEEAIAgAAO8CACACAAAAQQAgCAAA7wIAIAMAAABDACAPAADoAgAgEAAA7QIAIAEAAABDACABAAAAQQAgAxUAAL0IACAWAAC_CAAgFwAAvggAIAf0AgAAiwUAMPUCAAD2AgAQ9gIAAIsFADD3AgEAwgQAIf4CAQDCBAAh6AMBAMIEACHpAyAA0wQAIQMAAABBACADAAD1AgAwFAAA9gIAIAMAAABBACADAABCADAEAABDACABAAAAMwAgAQAAADMAIAMAAAAxACADAAAyADAEAAAzACADAAAAMQAgAwAAMgAwBAAAMwAgAwAAADEAIAMAADIAMAQAADMAIAUfAAC8CAAg9wIBAAAAAf4CAQAAAAHmAwEAAAAB5wMCAAAAAQEIAAD-AgAgBPcCAQAAAAH-AgEAAAAB5gMBAAAAAecDAgAAAAEBCAAAgAMAMAEIAACAAwAwBR8AALsIACD3AgEA5QUAIf4CAQDlBQAh5gMBAOUFACHnAwIA_QUAIQIAAAAzACAIAACDAwAgBPcCAQDlBQAh_gIBAOUFACHmAwEA5QUAIecDAgD9BQAhAgAAADEAIAgAAIUDACACAAAAMQAgCAAAhQMAIAMAAAAzACAPAAD-AgAgEAAAgwMAIAEAAAAzACABAAAAMQAgBRUAALYIACAWAAC5CAAgFwAAuAgAIIABAAC3CAAggQEAALoIACAH9AIAAIoFADD1AgAAjAMAEPYCAACKBQAw9wIBAMIEACH-AgEAwgQAIeYDAQDCBAAh5wMCANcEACEDAAAAMQAgAwAAiwMAMBQAAIwDACADAAAAMQAgAwAAMgAwBAAAMwAgAQAAADsAIAEAAAA7ACADAAAAOQAgAwAAOgAwBAAAOwAgAwAAADkAIAMAADoAMAQAADsAIAMAAAA5ACADAAA6ADAEAAA7ACAEHwAAtQgAIPcCAQAAAAH-AgEAAAAB5gMBAAAAAQEIAACUAwAgA_cCAQAAAAH-AgEAAAAB5gMBAAAAAQEIAACWAwAwAQgAAJYDADAEHwAAtAgAIPcCAQDlBQAh_gIBAOUFACHmAwEA5QUAIQIAAAA7ACAIAACZAwAgA_cCAQDlBQAh_gIBAOUFACHmAwEA5QUAIQIAAAA5ACAIAACbAwAgAgAAADkAIAgAAJsDACADAAAAOwAgDwAAlAMAIBAAAJkDACABAAAAOwAgAQAAADkAIAMVAACxCAAgFgAAswgAIBcAALIIACAG9AIAAIkFADD1AgAAogMAEPYCAACJBQAw9wIBAMIEACH-AgEAwgQAIeYDAQDCBAAhAwAAADkAIAMAAKEDADAUAACiAwAgAwAAADkAIAMAADoAMAQAADsAIAEAAAA3ACABAAAANwAgAwAAADUAIAMAADYAMAQAADcAIAMAAAA1ACADAAA2ADAEAAA3ACADAAAANQAgAwAANgAwBAAANwAgBB8AALAIACD3AgEAAAAB_gIBAAAAAeYDAQAAAAEBCAAAqgMAIAP3AgEAAAAB_gIBAAAAAeYDAQAAAAEBCAAArAMAMAEIAACsAwAwBB8AAK8IACD3AgEA5QUAIf4CAQDlBQAh5gMBAOUFACECAAAANwAgCAAArwMAIAP3AgEA5QUAIf4CAQDlBQAh5gMBAOUFACECAAAANQAgCAAAsQMAIAIAAAA1ACAIAACxAwAgAwAAADcAIA8AAKoDACAQAACvAwAgAQAAADcAIAEAAAA1ACADFQAArAgAIBYAAK4IACAXAACtCAAgBvQCAACIBQAw9QIAALgDABD2AgAAiAUAMPcCAQDCBAAh_gIBAMIEACHmAwEAwgQAIQMAAAA1ACADAAC3AwAwFAAAuAMAIAMAAAA1ACADAAA2ADAEAAA3ACABAAAAZQAgAQAAAGUAIAMAAABjACADAABkADAEAABlACADAAAAYwAgAwAAZAAwBAAAZQAgAwAAAGMAIAMAAGQAMAQAAGUAIB4cAADkBgAgIwAAqwgAICoAAOUGACArAADmBgAgLAAA5wYAIC0AAOgGACD3AgEAAAAB-wJAAAAAAfwCQAAAAAGAAwEAAAABrwMBAAAAAbgDAAAAygMCvQNAAAAAAdQDAQAAAAHWAwAAANYDAtcDAQAAAAHYAwEAAAAB2QMBAAAAAdoDAQAAAAHbAwEAAAAB3AMBAAAAAd0DAQAAAAHeAwEAAAAB3wMQAAAAAeADEAAAAAHhAxAAAAAB4gMQAAAAAeMDQAAAAAHkA0AAAAAB5QNAAAAAAQEIAADAAwAgGPcCAQAAAAH7AkAAAAAB_AJAAAAAAYADAQAAAAGvAwEAAAABuAMAAADKAwK9A0AAAAAB1AMBAAAAAdYDAAAA1gMC1wMBAAAAAdgDAQAAAAHZAwEAAAAB2gMBAAAAAdsDAQAAAAHcAwEAAAAB3QMBAAAAAd4DAQAAAAHfAxAAAAAB4AMQAAAAAeEDEAAAAAHiAxAAAAAB4wNAAAAAAeQDQAAAAAHlA0AAAAABAQgAAMIDADABCAAAwgMAMB4cAACvBgAgIwAAqggAICoAALAGACArAACxBgAgLAAAsgYAIC0AALMGACD3AgEA5QUAIfsCQADpBQAh_AJAAOkFACGAAwEA5QUAIa8DAQDlBQAhuAMAAK0GygMivQNAAPsFACHUAwEA5QUAIdYDAACsBtYDItcDAQDnBQAh2AMBAOcFACHZAwEA5QUAIdoDAQDnBQAh2wMBAOcFACHcAwEA5wUAId0DAQDnBQAh3gMBAOcFACHfAxAA_AUAIeADEAD8BQAh4QMQAPwFACHiAxAA_AUAIeMDQAD7BQAh5ANAAPsFACHlA0AA-wUAIQIAAABlACAIAADFAwAgGPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIYADAQDlBQAhrwMBAOUFACG4AwAArQbKAyK9A0AA-wUAIdQDAQDlBQAh1gMAAKwG1gMi1wMBAOcFACHYAwEA5wUAIdkDAQDlBQAh2gMBAOcFACHbAwEA5wUAIdwDAQDnBQAh3QMBAOcFACHeAwEA5wUAId8DEAD8BQAh4AMQAPwFACHhAxAA_AUAIeIDEAD8BQAh4wNAAPsFACHkA0AA-wUAIeUDQAD7BQAhAgAAAGMAIAgAAMcDACACAAAAYwAgCAAAxwMAIAMAAABlACAPAADAAwAgEAAAxQMAIAEAAABlACABAAAAYwAgEBUAAKUIACAWAACoCAAgFwAApwgAIIABAACmCAAggQEAAKkIACC9AwAA3wUAINcDAADfBQAg2AMAAN8FACDaAwAA3wUAINsDAADfBQAg3AMAAN8FACDdAwAA3wUAIN4DAADfBQAg4wMAAN8FACDkAwAA3wUAIOUDAADfBQAgG_QCAACEBQAw9QIAAM4DABD2AgAAhAUAMPcCAQDCBAAh-wJAAMYEACH8AkAAxgQAIYADAQDCBAAhrwMBAMIEACG4AwAA_QTKAyK9A0AA1QQAIdQDAQDCBAAh1gMAAIUF1gMi1wMBAMQEACHYAwEAxAQAIdkDAQDCBAAh2gMBAMQEACHbAwEAxAQAIdwDAQDEBAAh3QMBAMQEACHeAwEAxAQAId8DEADWBAAh4AMQANYEACHhAxAA1gQAIeIDEADWBAAh4wNAANUEACHkA0AA1QQAIeUDQADVBAAhAwAAAGMAIAMAAM0DADAUAADOAwAgAwAAAGMAIAMAAGQAMAQAAGUAIAEAAABPACABAAAATwAgAwAAAE0AIAMAAE4AMAQAAE8AIAMAAABNACADAABOADAEAABPACADAAAATQAgAwAATgAwBAAATwAgDB8AANcGACApAACNBwAg9wIBAAAAAfsCQAAAAAH9AgEAAAAB_gIBAAAAAc4DAQAAAAHPAwEAAAAB0AMBAAAAAdEDAgAAAAHSAxAAAAAB0wMQAAAAAQEIAADWAwAgCvcCAQAAAAH7AkAAAAAB_QIBAAAAAf4CAQAAAAHOAwEAAAABzwMBAAAAAdADAQAAAAHRAwIAAAAB0gMQAAAAAdMDEAAAAAEBCAAA2AMAMAEIAADYAwAwDB8AANUGACApAACLBwAg9wIBAOUFACH7AkAA6QUAIf0CAQDlBQAh_gIBAOUFACHOAwEA5QUAIc8DAQDnBQAh0AMBAOcFACHRAwIA_QUAIdIDEAD8BQAh0wMQAPwFACECAAAATwAgCAAA2wMAIAr3AgEA5QUAIfsCQADpBQAh_QIBAOUFACH-AgEA5QUAIc4DAQDlBQAhzwMBAOcFACHQAwEA5wUAIdEDAgD9BQAh0gMQAPwFACHTAxAA_AUAIQIAAABNACAIAADdAwAgAgAAAE0AIAgAAN0DACADAAAATwAgDwAA1gMAIBAAANsDACABAAAATwAgAQAAAE0AIAcVAACgCAAgFgAAowgAIBcAAKIIACCAAQAAoQgAIIEBAACkCAAgzwMAAN8FACDQAwAA3wUAIA30AgAAgwUAMPUCAADkAwAQ9gIAAIMFADD3AgEAwgQAIfsCQADGBAAh_QIBAMIEACH-AgEAwgQAIc4DAQDCBAAhzwMBAMQEACHQAwEAxAQAIdEDAgDXBAAh0gMQANYEACHTAxAA1gQAIQMAAABNACADAADjAwAwFAAA5AMAIAMAAABNACADAABOADAEAABPACABAAAAUwAgAQAAAFMAIAMAAABRACADAABSADAEAABTACADAAAAUQAgAwAAUgAwBAAAUwAgAwAAAFEAIAMAAFIAMAQAAFMAIAgpAACfCAAg9wIBAAAAAfsCQAAAAAH9AgEAAAABuAMAAADKAwLKAwEAAAABywMBAAAAAc0DAAAAzQMDAQgAAOwDACAH9wIBAAAAAfsCQAAAAAH9AgEAAAABuAMAAADKAwLKAwEAAAABywMBAAAAAc0DAAAAzQMDAQgAAO4DADABCAAA7gMAMAgpAACeCAAg9wIBAOUFACH7AkAA6QUAIf0CAQDlBQAhuAMAAK0GygMiygMBAOcFACHLAwEA5wUAIc0DAADHBs0DIwIAAABTACAIAADxAwAgB_cCAQDlBQAh-wJAAOkFACH9AgEA5QUAIbgDAACtBsoDIsoDAQDnBQAhywMBAOcFACHNAwAAxwbNAyMCAAAAUQAgCAAA8wMAIAIAAABRACAIAADzAwAgAwAAAFMAIA8AAOwDACAQAADxAwAgAQAAAFMAIAEAAABRACAGFQAAmwgAIBYAAJ0IACAXAACcCAAgygMAAN8FACDLAwAA3wUAIM0DAADfBQAgCvQCAAD8BAAw9QIAAPoDABD2AgAA_AQAMPcCAQDCBAAh-wJAAMYEACH9AgEAwgQAIbgDAAD9BMoDIsoDAQDEBAAhywMBAMQEACHNAwAA_gTNAyMDAAAAUQAgAwAA-QMAMBQAAPoDACADAAAAUQAgAwAAUgAwBAAAUwAgAQAAAEsAIAEAAABLACADAAAASQAgAwAASgAwBAAASwAgAwAAAEkAIAMAAEoAMAQAAEsAIAMAAABJACADAABKADAEAABLACAaHAAAoAYAICMAAOIGACApAAChBgAg9wIBAAAAAfsCQAAAAAH8AkAAAAAB_QIBAAAAAYADAQAAAAGvAwEAAAABsAMQAAAAAbEDEAAAAAGyAxAAAAABswMQAAAAAbQDAQAAAAG1AwEAAAABtgMBAAAAAbgDAAAAuAMCuQOAAAAAAboDQAAAAAG7A0AAAAABvANAAAAAAb0DQAAAAAG-A0AAAAABvwMBAAAAAcADAQAAAAHCAwAAAMIDAgEIAACCBAAgF_cCAQAAAAH7AkAAAAAB_AJAAAAAAf0CAQAAAAGAAwEAAAABrwMBAAAAAbADEAAAAAGxAxAAAAABsgMQAAAAAbMDEAAAAAG0AwEAAAABtQMBAAAAAbYDAQAAAAG4AwAAALgDArkDgAAAAAG6A0AAAAABuwNAAAAAAbwDQAAAAAG9A0AAAAABvgNAAAAAAb8DAQAAAAHAAwEAAAABwgMAAADCAwIBCAAAhAQAMAEIAACEBAAwGhwAAJ0GACAjAADgBgAgKQAAngYAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIf0CAQDlBQAhgAMBAOUFACGvAwEA5QUAIbADEAD8BQAhsQMQAPwFACGyAxAA_AUAIbMDEAD8BQAhtAMBAOUFACG1AwEA5wUAIbYDAQDnBQAhuAMAAJoGuAMiuQOAAAAAAboDQAD7BQAhuwNAAPsFACG8A0AA-wUAIb0DQAD7BQAhvgNAAPsFACG_AwEA5wUAIcADAQDnBQAhwgMAAJsGwgMiAgAAAEsAIAgAAIcEACAX9wIBAOUFACH7AkAA6QUAIfwCQADpBQAh_QIBAOUFACGAAwEA5QUAIa8DAQDlBQAhsAMQAPwFACGxAxAA_AUAIbIDEAD8BQAhswMQAPwFACG0AwEA5QUAIbUDAQDnBQAhtgMBAOcFACG4AwAAmga4AyK5A4AAAAABugNAAPsFACG7A0AA-wUAIbwDQAD7BQAhvQNAAPsFACG-A0AA-wUAIb8DAQDnBQAhwAMBAOcFACHCAwAAmwbCAyICAAAASQAgCAAAiQQAIAIAAABJACAIAACJBAAgAwAAAEsAIA8AAIIEACAQAACHBAAgAQAAAEsAIAEAAABJACAPFQAAlggAIBYAAJkIACAXAACYCAAggAEAAJcIACCBAQAAmggAILUDAADfBQAgtgMAAN8FACC5AwAA3wUAILoDAADfBQAguwMAAN8FACC8AwAA3wUAIL0DAADfBQAgvgMAAN8FACC_AwAA3wUAIMADAADfBQAgGvQCAADzBAAw9QIAAJAEABD2AgAA8wQAMPcCAQDCBAAh-wJAAMYEACH8AkAAxgQAIf0CAQDCBAAhgAMBAMIEACGvAwEAwgQAIbADEADWBAAhsQMQANYEACGyAxAA1gQAIbMDEADWBAAhtAMBAMIEACG1AwEAxAQAIbYDAQDEBAAhuAMAAPQEuAMiuQMAAPUEACC6A0AA1QQAIbsDQADVBAAhvANAANUEACG9A0AA1QQAIb4DQADVBAAhvwMBAMQEACHAAwEAxAQAIcIDAAD2BMIDIgMAAABJACADAACPBAAwFAAAkAQAIAMAAABJACADAABKADAEAABLACAoGgAA8QQAIB0AAO0EACAhAADuBAAgKgAA8AQAIC0AAPIEACAuAADvBAAg9AIAAOMEADD1AgAAcgAQ9gIAAOMEADD3AgEAAAAB-wJAAOoEACH8AkAA6gQAIf8CAQAAAAGPAwEA5AQAIZEDAADlBJEDIpIDAQDkBAAhkwMBAOYEACGUAwEA5gQAIZUDAQDmBAAhlgMgAOcEACGXAwEA5AQAIZgDAQDkBAAhmQMBAOQEACGaAwEA5gQAIZsDAQDkBAAhnQMAAOgEnQMingMBAOYEACGfAwEA5gQAIaADQADpBAAhoQMgAOcEACGiAwEA5gQAIaMDAQDmBAAhpAMBAOYEACGlAwEAAAABpgMQAOsEACGnA0AA6QQAIagDEADrBAAhqQMCAOwEACGqAxAA6wQAIasDEADrBAAhAQAAAJMEACABAAAAkwQAIBEaAACUCAAgHQAAkAgAICEAAJEIACAqAACTCAAgLQAAlQgAIC4AAJIIACCTAwAA3wUAIJQDAADfBQAglQMAAN8FACCaAwAA3wUAIJ4DAADfBQAgnwMAAN8FACCgAwAA3wUAIKIDAADfBQAgowMAAN8FACCkAwAA3wUAIKcDAADfBQAgAwAAAHIAIAMAAJYEADAEAACTBAAgAwAAAHIAIAMAAJYEADAEAACTBAAgAwAAAHIAIAMAAJYEADAEAACTBAAgJRoAAI4IACAdAACKCAAgIQAAiwgAICoAAI0IACAtAACPCAAgLgAAjAgAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAf8CAQAAAAGPAwEAAAABkQMAAACRAwKSAwEAAAABkwMBAAAAAZQDAQAAAAGVAwEAAAABlgMgAAAAAZcDAQAAAAGYAwEAAAABmQMBAAAAAZoDAQAAAAGbAwEAAAABnQMAAACdAwKeAwEAAAABnwMBAAAAAaADQAAAAAGhAyAAAAABogMBAAAAAaMDAQAAAAGkAwEAAAABpQMBAAAAAaYDEAAAAAGnA0AAAAABqAMQAAAAAakDAgAAAAGqAxAAAAABqwMQAAAAAQEIAACaBAAgH_cCAQAAAAH7AkAAAAAB_AJAAAAAAf8CAQAAAAGPAwEAAAABkQMAAACRAwKSAwEAAAABkwMBAAAAAZQDAQAAAAGVAwEAAAABlgMgAAAAAZcDAQAAAAGYAwEAAAABmQMBAAAAAZoDAQAAAAGbAwEAAAABnQMAAACdAwKeAwEAAAABnwMBAAAAAaADQAAAAAGhAyAAAAABogMBAAAAAaMDAQAAAAGkAwEAAAABpQMBAAAAAaYDEAAAAAGnA0AAAAABqAMQAAAAAakDAgAAAAGqAxAAAAABqwMQAAAAAQEIAACcBAAwAQgAAJwEADAlGgAAggYAIB0AAP4FACAhAAD_BQAgKgAAgQYAIC0AAIMGACAuAACABgAg9wIBAOUFACH7AkAA6QUAIfwCQADpBQAh_wIBAOUFACGPAwEA5QUAIZEDAAD4BZEDIpIDAQDlBQAhkwMBAOcFACGUAwEA5wUAIZUDAQDnBQAhlgMgAPkFACGXAwEA5QUAIZgDAQDlBQAhmQMBAOUFACGaAwEA5wUAIZsDAQDlBQAhnQMAAPoFnQMingMBAOcFACGfAwEA5wUAIaADQAD7BQAhoQMgAPkFACGiAwEA5wUAIaMDAQDnBQAhpAMBAOcFACGlAwEA5QUAIaYDEAD8BQAhpwNAAPsFACGoAxAA_AUAIakDAgD9BQAhqgMQAPwFACGrAxAA_AUAIQIAAACTBAAgCAAAnwQAIB_3AgEA5QUAIfsCQADpBQAh_AJAAOkFACH_AgEA5QUAIY8DAQDlBQAhkQMAAPgFkQMikgMBAOUFACGTAwEA5wUAIZQDAQDnBQAhlQMBAOcFACGWAyAA-QUAIZcDAQDlBQAhmAMBAOUFACGZAwEA5QUAIZoDAQDnBQAhmwMBAOUFACGdAwAA-gWdAyKeAwEA5wUAIZ8DAQDnBQAhoANAAPsFACGhAyAA-QUAIaIDAQDnBQAhowMBAOcFACGkAwEA5wUAIaUDAQDlBQAhpgMQAPwFACGnA0AA-wUAIagDEAD8BQAhqQMCAP0FACGqAxAA_AUAIasDEAD8BQAhAgAAAHIAIAgAAKEEACACAAAAcgAgCAAAoQQAIAMAAACTBAAgDwAAmgQAIBAAAJ8EACABAAAAkwQAIAEAAAByACAQFQAA8wUAIBYAAPYFACAXAAD1BQAggAEAAPQFACCBAQAA9wUAIJMDAADfBQAglAMAAN8FACCVAwAA3wUAIJoDAADfBQAgngMAAN8FACCfAwAA3wUAIKADAADfBQAgogMAAN8FACCjAwAA3wUAIKQDAADfBQAgpwMAAN8FACAi9AIAANEEADD1AgAAqAQAEPYCAADRBAAw9wIBAMIEACH7AkAAxgQAIfwCQADGBAAh_wIBAMIEACGPAwEAwgQAIZEDAADSBJEDIpIDAQDCBAAhkwMBAMQEACGUAwEAxAQAIZUDAQDEBAAhlgMgANMEACGXAwEAwgQAIZgDAQDCBAAhmQMBAMIEACGaAwEAxAQAIZsDAQDCBAAhnQMAANQEnQMingMBAMQEACGfAwEAxAQAIaADQADVBAAhoQMgANMEACGiAwEAxAQAIaMDAQDEBAAhpAMBAMQEACGlAwEAwgQAIaYDEADWBAAhpwNAANUEACGoAxAA1gQAIakDAgDXBAAhqgMQANYEACGrAxAA1gQAIQMAAAByACADAACnBAAwFAAAqAQAIAMAAAByACADAACWBAAwBAAAkwQAIAEAAABHACABAAAARwAgAwAAAEUAIAMAAEYAMAQAAEcAIAMAAABFACADAABGADAEAABHACADAAAARQAgAwAARgAwBAAARwAgDhoAAPIFACAfAADwBQAgIwAA8QUAICkAAO8FACD3AgEAAAAB-AIIAAAAAfkCAQAAAAH6AgAA7gUAIPsCQAAAAAH8AkAAAAAB_QIBAAAAAf4CAQAAAAH_AgEAAAABgAMBAAAAAQEIAACwBAAgCvcCAQAAAAH4AggAAAAB-QIBAAAAAfoCAADuBQAg-wJAAAAAAfwCQAAAAAH9AgEAAAAB_gIBAAAAAf8CAQAAAAGAAwEAAAABAQgAALIEADABCAAAsgQAMA4aAADtBQAgHwAA6wUAICMAAOwFACApAADqBQAg9wIBAOUFACH4AggA5gUAIfkCAQDnBQAh-gIAAOgFACD7AkAA6QUAIfwCQADpBQAh_QIBAOUFACH-AgEA5QUAIf8CAQDlBQAhgAMBAOUFACECAAAARwAgCAAAtQQAIAr3AgEA5QUAIfgCCADmBQAh-QIBAOcFACH6AgAA6AUAIPsCQADpBQAh_AJAAOkFACH9AgEA5QUAIf4CAQDlBQAh_wIBAOUFACGAAwEA5QUAIQIAAABFACAIAAC3BAAgAgAAAEUAIAgAALcEACADAAAARwAgDwAAsAQAIBAAALUEACABAAAARwAgAQAAAEUAIAYVAADgBQAgFgAA4wUAIBcAAOIFACCAAQAA4QUAIIEBAADkBQAg-QIAAN8FACAN9AIAAMEEADD1AgAAvgQAEPYCAADBBAAw9wIBAMIEACH4AggAwwQAIfkCAQDEBAAh-gIAAMUEACD7AkAAxgQAIfwCQADGBAAh_QIBAMIEACH-AgEAwgQAIf8CAQDCBAAhgAMBAMIEACEDAAAARQAgAwAAvQQAMBQAAL4EACADAAAARQAgAwAARgAwBAAARwAgDfQCAADBBAAw9QIAAL4EABD2AgAAwQQAMPcCAQDCBAAh-AIIAMMEACH5AgEAxAQAIfoCAADFBAAg-wJAAMYEACH8AkAAxgQAIf0CAQDCBAAh_gIBAMIEACH_AgEAwgQAIYADAQDCBAAhDhUAAMgEACAWAADQBAAgFwAA0AQAIIEDAQAAAAGCAwEAAAAEgwMBAAAABIQDAQAAAAGFAwEAAAABhgMBAAAAAYcDAQAAAAGIAwEAzwQAIYwDAQAAAAGNAwEAAAABjgMBAAAAAQ0VAADIBAAgFgAAzgQAIBcAAM4EACCAAQAAzgQAIIEBAADOBAAggQMIAAAAAYIDCAAAAASDAwgAAAAEhAMIAAAAAYUDCAAAAAGGAwgAAAABhwMIAAAAAYgDCADNBAAhDhUAAMsEACAWAADMBAAgFwAAzAQAIIEDAQAAAAGCAwEAAAAFgwMBAAAABYQDAQAAAAGFAwEAAAABhgMBAAAAAYcDAQAAAAGIAwEAygQAIYwDAQAAAAGNAwEAAAABjgMBAAAAAQSBAwEAAAAFiQMBAAAAAYoDAQAAAASLAwEAAAAECxUAAMgEACAWAADJBAAgFwAAyQQAIIEDQAAAAAGCA0AAAAAEgwNAAAAABIQDQAAAAAGFA0AAAAABhgNAAAAAAYcDQAAAAAGIA0AAxwQAIQsVAADIBAAgFgAAyQQAIBcAAMkEACCBA0AAAAABggNAAAAABIMDQAAAAASEA0AAAAABhQNAAAAAAYYDQAAAAAGHA0AAAAABiANAAMcEACEIgQMCAAAAAYIDAgAAAASDAwIAAAAEhAMCAAAAAYUDAgAAAAGGAwIAAAABhwMCAAAAAYgDAgDIBAAhCIEDQAAAAAGCA0AAAAAEgwNAAAAABIQDQAAAAAGFA0AAAAABhgNAAAAAAYcDQAAAAAGIA0AAyQQAIQ4VAADLBAAgFgAAzAQAIBcAAMwEACCBAwEAAAABggMBAAAABYMDAQAAAAWEAwEAAAABhQMBAAAAAYYDAQAAAAGHAwEAAAABiAMBAMoEACGMAwEAAAABjQMBAAAAAY4DAQAAAAEIgQMCAAAAAYIDAgAAAAWDAwIAAAAFhAMCAAAAAYUDAgAAAAGGAwIAAAABhwMCAAAAAYgDAgDLBAAhC4EDAQAAAAGCAwEAAAAFgwMBAAAABYQDAQAAAAGFAwEAAAABhgMBAAAAAYcDAQAAAAGIAwEAzAQAIYwDAQAAAAGNAwEAAAABjgMBAAAAAQ0VAADIBAAgFgAAzgQAIBcAAM4EACCAAQAAzgQAIIEBAADOBAAggQMIAAAAAYIDCAAAAASDAwgAAAAEhAMIAAAAAYUDCAAAAAGGAwgAAAABhwMIAAAAAYgDCADNBAAhCIEDCAAAAAGCAwgAAAAEgwMIAAAABIQDCAAAAAGFAwgAAAABhgMIAAAAAYcDCAAAAAGIAwgAzgQAIQ4VAADIBAAgFgAA0AQAIBcAANAEACCBAwEAAAABggMBAAAABIMDAQAAAASEAwEAAAABhQMBAAAAAYYDAQAAAAGHAwEAAAABiAMBAM8EACGMAwEAAAABjQMBAAAAAY4DAQAAAAELgQMBAAAAAYIDAQAAAASDAwEAAAAEhAMBAAAAAYUDAQAAAAGGAwEAAAABhwMBAAAAAYgDAQDQBAAhjAMBAAAAAY0DAQAAAAGOAwEAAAABIvQCAADRBAAw9QIAAKgEABD2AgAA0QQAMPcCAQDCBAAh-wJAAMYEACH8AkAAxgQAIf8CAQDCBAAhjwMBAMIEACGRAwAA0gSRAyKSAwEAwgQAIZMDAQDEBAAhlAMBAMQEACGVAwEAxAQAIZYDIADTBAAhlwMBAMIEACGYAwEAwgQAIZkDAQDCBAAhmgMBAMQEACGbAwEAwgQAIZ0DAADUBJ0DIp4DAQDEBAAhnwMBAMQEACGgA0AA1QQAIaEDIADTBAAhogMBAMQEACGjAwEAxAQAIaQDAQDEBAAhpQMBAMIEACGmAxAA1gQAIacDQADVBAAhqAMQANYEACGpAwIA1wQAIaoDEADWBAAhqwMQANYEACEHFQAAyAQAIBYAAOIEACAXAADiBAAggQMAAACRAwKCAwAAAJEDCIMDAAAAkQMIiAMAAOEEkQMiBRUAAMgEACAWAADgBAAgFwAA4AQAIIEDIAAAAAGIAyAA3wQAIQcVAADIBAAgFgAA3gQAIBcAAN4EACCBAwAAAJ0DAoIDAAAAnQMIgwMAAACdAwiIAwAA3QSdAyILFQAAywQAIBYAANwEACAXAADcBAAggQNAAAAAAYIDQAAAAAWDA0AAAAAFhANAAAAAAYUDQAAAAAGGA0AAAAABhwNAAAAAAYgDQADbBAAhDRUAAMgEACAWAADaBAAgFwAA2gQAIIABAADaBAAggQEAANoEACCBAxAAAAABggMQAAAABIMDEAAAAASEAxAAAAABhQMQAAAAAYYDEAAAAAGHAxAAAAABiAMQANkEACENFQAAyAQAIBYAAMgEACAXAADIBAAggAEAAM4EACCBAQAAyAQAIIEDAgAAAAGCAwIAAAAEgwMCAAAABIQDAgAAAAGFAwIAAAABhgMCAAAAAYcDAgAAAAGIAwIA2AQAIQ0VAADIBAAgFgAAyAQAIBcAAMgEACCAAQAAzgQAIIEBAADIBAAggQMCAAAAAYIDAgAAAASDAwIAAAAEhAMCAAAAAYUDAgAAAAGGAwIAAAABhwMCAAAAAYgDAgDYBAAhDRUAAMgEACAWAADaBAAgFwAA2gQAIIABAADaBAAggQEAANoEACCBAxAAAAABggMQAAAABIMDEAAAAASEAxAAAAABhQMQAAAAAYYDEAAAAAGHAxAAAAABiAMQANkEACEIgQMQAAAAAYIDEAAAAASDAxAAAAAEhAMQAAAAAYUDEAAAAAGGAxAAAAABhwMQAAAAAYgDEADaBAAhCxUAAMsEACAWAADcBAAgFwAA3AQAIIEDQAAAAAGCA0AAAAAFgwNAAAAABYQDQAAAAAGFA0AAAAABhgNAAAAAAYcDQAAAAAGIA0AA2wQAIQiBA0AAAAABggNAAAAABYMDQAAAAAWEA0AAAAABhQNAAAAAAYYDQAAAAAGHA0AAAAABiANAANwEACEHFQAAyAQAIBYAAN4EACAXAADeBAAggQMAAACdAwKCAwAAAJ0DCIMDAAAAnQMIiAMAAN0EnQMiBIEDAAAAnQMCggMAAACdAwiDAwAAAJ0DCIgDAADeBJ0DIgUVAADIBAAgFgAA4AQAIBcAAOAEACCBAyAAAAABiAMgAN8EACECgQMgAAAAAYgDIADgBAAhBxUAAMgEACAWAADiBAAgFwAA4gQAIIEDAAAAkQMCggMAAACRAwiDAwAAAJEDCIgDAADhBJEDIgSBAwAAAJEDAoIDAAAAkQMIgwMAAACRAwiIAwAA4gSRAyIoGgAA8QQAIB0AAO0EACAhAADuBAAgKgAA8AQAIC0AAPIEACAuAADvBAAg9AIAAOMEADD1AgAAcgAQ9gIAAOMEADD3AgEA5AQAIfsCQADqBAAh_AJAAOoEACH_AgEA5AQAIY8DAQDkBAAhkQMAAOUEkQMikgMBAOQEACGTAwEA5gQAIZQDAQDmBAAhlQMBAOYEACGWAyAA5wQAIZcDAQDkBAAhmAMBAOQEACGZAwEA5AQAIZoDAQDmBAAhmwMBAOQEACGdAwAA6ASdAyKeAwEA5gQAIZ8DAQDmBAAhoANAAOkEACGhAyAA5wQAIaIDAQDmBAAhowMBAOYEACGkAwEA5gQAIaUDAQDkBAAhpgMQAOsEACGnA0AA6QQAIagDEADrBAAhqQMCAOwEACGqAxAA6wQAIasDEADrBAAhC4EDAQAAAAGCAwEAAAAEgwMBAAAABIQDAQAAAAGFAwEAAAABhgMBAAAAAYcDAQAAAAGIAwEA0AQAIYwDAQAAAAGNAwEAAAABjgMBAAAAAQSBAwAAAJEDAoIDAAAAkQMIgwMAAACRAwiIAwAA4gSRAyILgQMBAAAAAYIDAQAAAAWDAwEAAAAFhAMBAAAAAYUDAQAAAAGGAwEAAAABhwMBAAAAAYgDAQDMBAAhjAMBAAAAAY0DAQAAAAGOAwEAAAABAoEDIAAAAAGIAyAA4AQAIQSBAwAAAJ0DAoIDAAAAnQMIgwMAAACdAwiIAwAA3gSdAyIIgQNAAAAAAYIDQAAAAAWDA0AAAAAFhANAAAAAAYUDQAAAAAGGA0AAAAABhwNAAAAAAYgDQADcBAAhCIEDQAAAAAGCA0AAAAAEgwNAAAAABIQDQAAAAAGFA0AAAAABhgNAAAAAAYcDQAAAAAGIA0AAyQQAIQiBAxAAAAABggMQAAAABIMDEAAAAASEAxAAAAABhQMQAAAAAYYDEAAAAAGHAxAAAAABiAMQANoEACEIgQMCAAAAAYIDAgAAAASDAwIAAAAEhAMCAAAAAYUDAgAAAAGGAwIAAAABhwMCAAAAAYgDAgDIBAAhA6wDAAAiACCtAwAAIgAgrgMAACIAIAOsAwAAJwAgrQMAACcAIK4DAAAnACADrAMAAGMAIK0DAABjACCuAwAAYwAgA6wDAABJACCtAwAASQAgrgMAAEkAIBkbAACtBQAgKgAA8AQAIC0AAPIEACAuAADvBAAgLwAArgUAIDAAAK8FACAxAACwBQAg9AIAAKoFADD1AgAAfwAQ9gIAAKoFADD3AgEA5AQAIfsCQADqBAAh_AJAAOoEACGSAwEA5gQAIbgDAACsBZwEIuYDAQDkBAAhlwQBAOQEACGYBCAA5wQAIZkEAQDmBAAhmgQAAKsFzQMinAQgAOcEACGdBCAA5wQAIZ4EQADpBAAhowQAAH8AIKQEAAB_ACADrAMAAEUAIK0DAABFACCuAwAARQAgGvQCAADzBAAw9QIAAJAEABD2AgAA8wQAMPcCAQDCBAAh-wJAAMYEACH8AkAAxgQAIf0CAQDCBAAhgAMBAMIEACGvAwEAwgQAIbADEADWBAAhsQMQANYEACGyAxAA1gQAIbMDEADWBAAhtAMBAMIEACG1AwEAxAQAIbYDAQDEBAAhuAMAAPQEuAMiuQMAAPUEACC6A0AA1QQAIbsDQADVBAAhvANAANUEACG9A0AA1QQAIb4DQADVBAAhvwMBAMQEACHAAwEAxAQAIcIDAAD2BMIDIgcVAADIBAAgFgAA-wQAIBcAAPsEACCBAwAAALgDAoIDAAAAuAMIgwMAAAC4AwiIAwAA-gS4AyIPFQAAywQAIBYAAPkEACAXAAD5BAAggQOAAAAAAYQDgAAAAAGFA4AAAAABhgOAAAAAAYcDgAAAAAGIA4AAAAABwwMBAAAAAcQDAQAAAAHFAwEAAAABxgOAAAAAAccDgAAAAAHIA4AAAAABBxUAAMgEACAWAAD4BAAgFwAA-AQAIIEDAAAAwgMCggMAAADCAwiDAwAAAMIDCIgDAAD3BMIDIgcVAADIBAAgFgAA-AQAIBcAAPgEACCBAwAAAMIDAoIDAAAAwgMIgwMAAADCAwiIAwAA9wTCAyIEgQMAAADCAwKCAwAAAMIDCIMDAAAAwgMIiAMAAPgEwgMiDIEDgAAAAAGEA4AAAAABhQOAAAAAAYYDgAAAAAGHA4AAAAABiAOAAAAAAcMDAQAAAAHEAwEAAAABxQMBAAAAAcYDgAAAAAHHA4AAAAAByAOAAAAAAQcVAADIBAAgFgAA-wQAIBcAAPsEACCBAwAAALgDAoIDAAAAuAMIgwMAAAC4AwiIAwAA-gS4AyIEgQMAAAC4AwKCAwAAALgDCIMDAAAAuAMIiAMAAPsEuAMiCvQCAAD8BAAw9QIAAPoDABD2AgAA_AQAMPcCAQDCBAAh-wJAAMYEACH9AgEAwgQAIbgDAAD9BMoDIsoDAQDEBAAhywMBAMQEACHNAwAA_gTNAyMHFQAAyAQAIBYAAIIFACAXAACCBQAggQMAAADKAwKCAwAAAMoDCIMDAAAAygMIiAMAAIEFygMiBxUAAMsEACAWAACABQAgFwAAgAUAIIEDAAAAzQMDggMAAADNAwmDAwAAAM0DCYgDAAD_BM0DIwcVAADLBAAgFgAAgAUAIBcAAIAFACCBAwAAAM0DA4IDAAAAzQMJgwMAAADNAwmIAwAA_wTNAyMEgQMAAADNAwOCAwAAAM0DCYMDAAAAzQMJiAMAAIAFzQMjBxUAAMgEACAWAACCBQAgFwAAggUAIIEDAAAAygMCggMAAADKAwiDAwAAAMoDCIgDAACBBcoDIgSBAwAAAMoDAoIDAAAAygMIgwMAAADKAwiIAwAAggXKAyIN9AIAAIMFADD1AgAA5AMAEPYCAACDBQAw9wIBAMIEACH7AkAAxgQAIf0CAQDCBAAh_gIBAMIEACHOAwEAwgQAIc8DAQDEBAAh0AMBAMQEACHRAwIA1wQAIdIDEADWBAAh0wMQANYEACEb9AIAAIQFADD1AgAAzgMAEPYCAACEBQAw9wIBAMIEACH7AkAAxgQAIfwCQADGBAAhgAMBAMIEACGvAwEAwgQAIbgDAAD9BMoDIr0DQADVBAAh1AMBAMIEACHWAwAAhQXWAyLXAwEAxAQAIdgDAQDEBAAh2QMBAMIEACHaAwEAxAQAIdsDAQDEBAAh3AMBAMQEACHdAwEAxAQAId4DAQDEBAAh3wMQANYEACHgAxAA1gQAIeEDEADWBAAh4gMQANYEACHjA0AA1QQAIeQDQADVBAAh5QNAANUEACEHFQAAyAQAIBYAAIcFACAXAACHBQAggQMAAADWAwKCAwAAANYDCIMDAAAA1gMIiAMAAIYF1gMiBxUAAMgEACAWAACHBQAgFwAAhwUAIIEDAAAA1gMCggMAAADWAwiDAwAAANYDCIgDAACGBdYDIgSBAwAAANYDAoIDAAAA1gMIgwMAAADWAwiIAwAAhwXWAyIG9AIAAIgFADD1AgAAuAMAEPYCAACIBQAw9wIBAMIEACH-AgEAwgQAIeYDAQDCBAAhBvQCAACJBQAw9QIAAKIDABD2AgAAiQUAMPcCAQDCBAAh_gIBAMIEACHmAwEAwgQAIQf0AgAAigUAMPUCAACMAwAQ9gIAAIoFADD3AgEAwgQAIf4CAQDCBAAh5gMBAMIEACHnAwIA1wQAIQf0AgAAiwUAMPUCAAD2AgAQ9gIAAIsFADD3AgEAwgQAIf4CAQDCBAAh6AMBAMIEACHpAyAA0wQAIQj0AgAAjAUAMPUCAADgAgAQ9gIAAIwFADD3AgEAwgQAIf4CAQDCBAAh5gMBAMIEACHpAyAA0wQAIeoDAgDXBAAhIPQCAACNBQAw9QIAAMoCABD2AgAAjQUAMPcCAQDCBAAh-wJAAMYEACH8AkAAxgQAIYADAQDCBAAhoQMgANMEACHgAwIA1wQAIeYDAQDCBAAh6wMBAMIEACHsAwEAxAQAIe0DAQDCBAAh7gMBAMQEACHvAwEAxAQAIfADAQDCBAAh8QMAAMUEACDyAwIA1wQAIfMDAgCOBQAh9AMAAI8FACD1AwAAxQQAIPYDAgCOBQAh9wMIAJAFACH4AwgAkAUAIfkDCACQBQAh-gMgANMEACH7AwIA1wQAIfwDIADTBAAh_QMgANMEACH-AwAAxQQAIP8DQADVBAAhgARAANUEACENFQAAywQAIBYAAMsEACAXAADLBAAggAEAAJIFACCBAQAAywQAIIEDAgAAAAGCAwIAAAAFgwMCAAAABYQDAgAAAAGFAwIAAAABhgMCAAAAAYcDAgAAAAGIAwIAkwUAIQSBAwAAAIIECYkDAAAAggQDigMAAACCBAiLAwAAAIIECA0VAADLBAAgFgAAkgUAIBcAAJIFACCAAQAAkgUAIIEBAACSBQAggQMIAAAAAYIDCAAAAAWDAwgAAAAFhAMIAAAAAYUDCAAAAAGGAwgAAAABhwMIAAAAAYgDCACRBQAhDRUAAMsEACAWAACSBQAgFwAAkgUAIIABAACSBQAggQEAAJIFACCBAwgAAAABggMIAAAABYMDCAAAAAWEAwgAAAABhQMIAAAAAYYDCAAAAAGHAwgAAAABiAMIAJEFACEIgQMIAAAAAYIDCAAAAAWDAwgAAAAFhAMIAAAAAYUDCAAAAAGGAwgAAAABhwMIAAAAAYgDCACSBQAhDRUAAMsEACAWAADLBAAgFwAAywQAIIABAACSBQAggQEAAMsEACCBAwIAAAABggMCAAAABYMDAgAAAAWEAwIAAAABhQMCAAAAAYYDAgAAAAGHAwIAAAABiAMCAJMFACEP9AIAAJQFADD1AgAAtAIAEPYCAACUBQAw9wIBAMIEACH7AkAAxgQAIfwCQADGBAAh_wIBAMIEACGSAwEAwgQAIZcDAQDCBAAhmQMBAMIEACGaAwEAxAQAIZsDAQDCBAAhggQBAMIEACGDBBAAlQUAIYQEEACVBQAhDRUAAMsEACAWAACXBQAgFwAAlwUAIIABAACXBQAggQEAAJcFACCBAxAAAAABggMQAAAABYMDEAAAAAWEAxAAAAABhQMQAAAAAYYDEAAAAAGHAxAAAAABiAMQAJYFACENFQAAywQAIBYAAJcFACAXAACXBQAggAEAAJcFACCBAQAAlwUAIIEDEAAAAAGCAxAAAAAFgwMQAAAABYQDEAAAAAGFAxAAAAABhgMQAAAAAYcDEAAAAAGIAxAAlgUAIQiBAxAAAAABggMQAAAABYMDEAAAAAWEAxAAAAABhQMQAAAAAYYDEAAAAAGHAxAAAAABiAMQAJcFACERGgAA8QQAIB4AAJoFACD0AgAAmAUAMPUCAAAgABD2AgAAmAUAMPcCAQDkBAAh-wJAAOoEACH8AkAA6gQAIf8CAQDkBAAhkgMBAOQEACGXAwEA5AQAIZkDAQDkBAAhmgMBAOYEACGbAwEA5AQAIYIEAQDkBAAhgwQQAJkFACGEBBAAmQUAIQiBAxAAAAABggMQAAAABYMDEAAAAAWEAxAAAAABhQMQAAAAAYYDEAAAAAGHAxAAAAABiAMQAJcFACERHAAA1wUAICAAAM8FACAjAAC1BQAg9AIAANYFADD1AgAAIgAQ9gIAANYFADD3AgEA5AQAIfsCQADqBAAh_AJAAOoEACGAAwEA5AQAIa8DAQDkBAAh3wMQAOsEACHgAxAA6wQAIeEDEADrBAAh4gMQAOsEACGjBAAAIgAgpAQAACIAIAv0AgAAmwUAMPUCAACcAgAQ9gIAAJsFADD3AgEAwgQAIfsCQADGBAAh_AJAAMYEACGUAwEAwgQAIaEDIADTBAAh5gMBAMIEACGFBAEAwgQAIYYEAgDXBAAhDCEAAO4EACD0AgAAnAUAMPUCAACJAgAQ9gIAAJwFADD3AgEA5AQAIfsCQADqBAAh_AJAAOoEACGUAwEA5AQAIaEDIADnBAAh5gMBAOQEACGFBAEA5AQAIYYEAgDsBAAhDPQCAACdBQAw9QIAAIMCABD2AgAAnQUAMPcCAQDCBAAh-wJAAMYEACH8AkAAxgQAIf4CAQDCBAAh0QMCANcEACHSAxAA1gQAIdMDEADWBAAhhwQBAMIEACGIBBAA1gQAIQz0AgAAngUAMPUCAADtAQAQ9gIAAJ4FADD3AgEAwgQAIfsCQADGBAAh_AJAAMYEACGAAwEAwgQAIa8DAQDCBAAh3wMQANYEACHgAxAA1gQAIeEDEADWBAAh4gMQANYEACEJ9AIAAJ8FADD1AgAA1wEAEPYCAACfBQAw9wIBAMIEACH7AkAAxgQAIfwCQADGBAAhiQQBAMIEACGKBAEAwgQAIYsEQADGBAAhCfQCAACgBQAw9QIAAMQBABD2AgAAoAUAMPcCAQDkBAAh-wJAAOoEACH8AkAA6gQAIYkEAQDkBAAhigQBAOQEACGLBEAA6gQAIRD0AgAAoQUAMPUCAAC-AQAQ9gIAAKEFADD3AgEAwgQAIfsCQADGBAAh_AJAAMYEACH_AgEAwgQAIYADAQDCBAAhjAQBAMIEACGNBAEAxAQAIY4EAQDEBAAhjwQBAMQEACGQBEAA1QQAIZEEQADVBAAhkgQBAMQEACGTBAEAxAQAIQv0AgAAogUAMPUCAACoAQAQ9gIAAKIFADD3AgEAwgQAIfsCQADGBAAh_AJAAMYEACH_AgEAwgQAIYsEQADGBAAhlAQBAMIEACGVBAEAxAQAIZYEAQDEBAAhEPQCAACjBQAw9QIAAJIBABD2AgAAowUAMPcCAQDCBAAh-wJAAMYEACH8AkAAxgQAIZIDAQDEBAAhuAMAAKUFnAQi5gMBAMIEACGXBAEAwgQAIZgEIADTBAAhmQQBAMQEACGaBAAApAXNAyKcBCAA0wQAIZ0EIADTBAAhngRAANUEACEHFQAAyAQAIBYAAKkFACAXAACpBQAggQMAAADNAwKCAwAAAM0DCIMDAAAAzQMIiAMAAKgFzQMiBxUAAMgEACAWAACnBQAgFwAApwUAIIEDAAAAnAQCggMAAACcBAiDAwAAAJwECIgDAACmBZwEIgcVAADIBAAgFgAApwUAIBcAAKcFACCBAwAAAJwEAoIDAAAAnAQIgwMAAACcBAiIAwAApgWcBCIEgQMAAACcBAKCAwAAAJwECIMDAAAAnAQIiAMAAKcFnAQiBxUAAMgEACAWAACpBQAgFwAAqQUAIIEDAAAAzQMCggMAAADNAwiDAwAAAM0DCIgDAACoBc0DIgSBAwAAAM0DAoIDAAAAzQMIgwMAAADNAwiIAwAAqQXNAyIXGwAArQUAICoAAPAEACAtAADyBAAgLgAA7wQAIC8AAK4FACAwAACvBQAgMQAAsAUAIPQCAACqBQAw9QIAAH8AEPYCAACqBQAw9wIBAOQEACH7AkAA6gQAIfwCQADqBAAhkgMBAOYEACG4AwAArAWcBCLmAwEA5AQAIZcEAQDkBAAhmAQgAOcEACGZBAEA5gQAIZoEAACrBc0DIpwEIADnBAAhnQQgAOcEACGeBEAA6QQAIQSBAwAAAM0DAoIDAAAAzQMIgwMAAADNAwiIAwAAqQXNAyIEgQMAAACcBAKCAwAAAJwECIMDAAAAnAQIiAMAAKcFnAQiA6wDAAAcACCtAwAAHAAgrgMAABwAIBMaAADxBAAgHgAAmgUAIPQCAACYBQAw9QIAACAAEPYCAACYBQAw9wIBAOQEACH7AkAA6gQAIfwCQADqBAAh_wIBAOQEACGSAwEA5AQAIZcDAQDkBAAhmQMBAOQEACGaAwEA5gQAIZsDAQDkBAAhggQBAOQEACGDBBAAmQUAIYQEEACZBQAhowQAACAAIKQEAAAgACAqGgAA8QQAIB0AAO0EACAhAADuBAAgKgAA8AQAIC0AAPIEACAuAADvBAAg9AIAAOMEADD1AgAAcgAQ9gIAAOMEADD3AgEA5AQAIfsCQADqBAAh_AJAAOoEACH_AgEA5AQAIY8DAQDkBAAhkQMAAOUEkQMikgMBAOQEACGTAwEA5gQAIZQDAQDmBAAhlQMBAOYEACGWAyAA5wQAIZcDAQDkBAAhmAMBAOQEACGZAwEA5AQAIZoDAQDmBAAhmwMBAOQEACGdAwAA6ASdAyKeAwEA5gQAIZ8DAQDmBAAhoANAAOkEACGhAyAA5wQAIaIDAQDmBAAhowMBAOYEACGkAwEA5gQAIaUDAQDkBAAhpgMQAOsEACGnA0AA6QQAIagDEADrBAAhqQMCAOwEACGqAxAA6wQAIasDEADrBAAhowQAAHIAIKQEAAByACADrAMAAHUAIK0DAAB1ACCuAwAAdQAgDBoAAPEEACD0AgAAsQUAMPUCAAB1ABD2AgAAsQUAMPcCAQDkBAAh-wJAAOoEACH8AkAA6gQAIf8CAQDkBAAhiwRAAOoEACGUBAEA5AQAIZUEAQDmBAAhlgQBAOYEACEhHAAA8QQAICMAALUFACAqAADwBAAgKwAAtgUAICwAALcFACAtAADyBAAg9AIAALIFADD1AgAAYwAQ9gIAALIFADD3AgEA5AQAIfsCQADqBAAh_AJAAOoEACGAAwEA5AQAIa8DAQDkBAAhuAMAALQFygMivQNAAOkEACHUAwEA5AQAIdYDAACzBdYDItcDAQDmBAAh2AMBAOYEACHZAwEA5AQAIdoDAQDmBAAh2wMBAOYEACHcAwEA5gQAId0DAQDmBAAh3gMBAOYEACHfAxAA6wQAIeADEADrBAAh4QMQAOsEACHiAxAA6wQAIeMDQADpBAAh5ANAAOkEACHlA0AA6QQAIQSBAwAAANYDAoIDAAAA1gMIgwMAAADWAwiIAwAAhwXWAyIEgQMAAADKAwKCAwAAAMoDCIMDAAAAygMIiAMAAIIFygMiKhoAAPEEACAdAADtBAAgIQAA7gQAICoAAPAEACAtAADyBAAgLgAA7wQAIPQCAADjBAAw9QIAAHIAEPYCAADjBAAw9wIBAOQEACH7AkAA6gQAIfwCQADqBAAh_wIBAOQEACGPAwEA5AQAIZEDAADlBJEDIpIDAQDkBAAhkwMBAOYEACGUAwEA5gQAIZUDAQDmBAAhlgMgAOcEACGXAwEA5AQAIZgDAQDkBAAhmQMBAOQEACGaAwEA5gQAIZsDAQDkBAAhnQMAAOgEnQMingMBAOYEACGfAwEA5gQAIaADQADpBAAhoQMgAOcEACGiAwEA5gQAIaMDAQDmBAAhpAMBAOYEACGlAwEA5AQAIaYDEADrBAAhpwNAAOkEACGoAxAA6wQAIakDAgDsBAAhqgMQAOsEACGrAxAA6wQAIaMEAAByACCkBAAAcgAgA6wDAABNACCtAwAATQAgrgMAAE0AIAOsAwAAUQAgrQMAAFEAIK4DAABRACALKQAAugUAIPQCAAC4BQAw9QIAAFEAEPYCAAC4BQAw9wIBAOQEACH7AkAA6gQAIf0CAQDkBAAhuAMAALQFygMiygMBAOYEACHLAwEA5gQAIc0DAAC5Bc0DIwSBAwAAAM0DA4IDAAAAzQMJgwMAAADNAwmIAwAAgAXNAyMjHAAA8QQAICMAALUFACAqAADwBAAgKwAAtgUAICwAALcFACAtAADyBAAg9AIAALIFADD1AgAAYwAQ9gIAALIFADD3AgEA5AQAIfsCQADqBAAh_AJAAOoEACGAAwEA5AQAIa8DAQDkBAAhuAMAALQFygMivQNAAOkEACHUAwEA5AQAIdYDAACzBdYDItcDAQDmBAAh2AMBAOYEACHZAwEA5AQAIdoDAQDmBAAh2wMBAOYEACHcAwEA5gQAId0DAQDmBAAh3gMBAOYEACHfAxAA6wQAIeADEADrBAAh4QMQAOsEACHiAxAA6wQAIeMDQADpBAAh5ANAAOkEACHlA0AA6QQAIaMEAABjACCkBAAAYwAgDx8AALwFACApAAC6BQAg9AIAALsFADD1AgAATQAQ9gIAALsFADD3AgEA5AQAIfsCQADqBAAh_QIBAOQEACH-AgEA5AQAIc4DAQDkBAAhzwMBAOYEACHQAwEA5gQAIdEDAgDsBAAh0gMQAOsEACHTAxAA6wQAISwgAADPBQAgIgAA0AUAICMAALUFACAkAADRBQAgJQAA0gUAICYAANMFACAnAADUBQAgKAAA1QUAICsAALYFACAtAADyBAAg9AIAAMwFADD1AgAAJwAQ9gIAAMwFADD3AgEA5AQAIfsCQADqBAAh_AJAAOoEACGAAwEA5AQAIaEDIADnBAAh4AMCAOwEACHmAwEA5AQAIesDAQDkBAAh7AMBAOYEACHtAwEA5AQAIe4DAQDmBAAh7wMBAOYEACHwAwEA5AQAIfEDAADFBAAg8gMCAOwEACHzAwIAzQUAIfQDAACPBQAg9QMAAMUEACD2AwIAzQUAIfcDCADOBQAh-AMIAM4FACH5AwgAzgUAIfoDIADnBAAh-wMCAOwEACH8AyAA5wQAIf0DIADnBAAh_gMAAMUEACD_A0AA6QQAIYAEQADpBAAhowQAACcAIKQEAAAnACAdHAAA8QQAICMAALUFACApAAC6BQAg9AIAAL0FADD1AgAASQAQ9gIAAL0FADD3AgEA5AQAIfsCQADqBAAh_AJAAOoEACH9AgEA5AQAIYADAQDkBAAhrwMBAOQEACGwAxAA6wQAIbEDEADrBAAhsgMQAOsEACGzAxAA6wQAIbQDAQDkBAAhtQMBAOYEACG2AwEA5gQAIbgDAAC-BbgDIrkDAAC_BQAgugNAAOkEACG7A0AA6QQAIbwDQADpBAAhvQNAAOkEACG-A0AA6QQAIb8DAQDmBAAhwAMBAOYEACHCAwAAwAXCAyIEgQMAAAC4AwKCAwAAALgDCIMDAAAAuAMIiAMAAPsEuAMiDIEDgAAAAAGEA4AAAAABhQOAAAAAAYYDgAAAAAGHA4AAAAABiAOAAAAAAcMDAQAAAAHEAwEAAAABxQMBAAAAAcYDgAAAAAHHA4AAAAAByAOAAAAAAQSBAwAAAMIDAoIDAAAAwgMIgwMAAADCAwiIAwAA-ATCAyIC_QIBAAAAAf8CAQAAAAERGgAA8QQAIB8AALwFACAjAAC1BQAgKQAAugUAIPQCAADCBQAw9QIAAEUAEPYCAADCBQAw9wIBAOQEACH4AggAwwUAIfkCAQDmBAAh-gIAAMUEACD7AkAA6gQAIfwCQADqBAAh_QIBAOQEACH-AgEA5AQAIf8CAQDkBAAhgAMBAOQEACEIgQMIAAAAAYIDCAAAAASDAwgAAAAEhAMIAAAAAYUDCAAAAAGGAwgAAAABhwMIAAAAAYgDCADOBAAhCB8AALwFACD0AgAAxAUAMPUCAABBABD2AgAAxAUAMPcCAQDkBAAh_gIBAOQEACHoAwEA5AQAIekDIADnBAAhCR8AALwFACD0AgAAxQUAMPUCAAA9ABD2AgAAxQUAMPcCAQDkBAAh_gIBAOQEACHmAwEA5AQAIekDIADnBAAh6gMCAOwEACEHHwAAvAUAIPQCAADGBQAw9QIAADkAEPYCAADGBQAw9wIBAOQEACH-AgEA5AQAIeYDAQDkBAAhBx8AALwFACD0AgAAxwUAMPUCAAA1ABD2AgAAxwUAMPcCAQDkBAAh_gIBAOQEACHmAwEA5AQAIQgfAAC8BQAg9AIAAMgFADD1AgAAMQAQ9gIAAMgFADD3AgEA5AQAIf4CAQDkBAAh5gMBAOQEACHnAwIA7AQAIQL-AgEAAAABhwQBAAAAAQ4eAADLBQAgHwAAvAUAIPQCAADKBQAw9QIAACsAEPYCAADKBQAw9wIBAOQEACH7AkAA6gQAIfwCQADqBAAh_gIBAOQEACHRAwIA7AQAIdIDEADrBAAh0wMQAOsEACGHBAEA5AQAIYgEEADrBAAhERwAANcFACAgAADPBQAgIwAAtQUAIPQCAADWBQAw9QIAACIAEPYCAADWBQAw9wIBAOQEACH7AkAA6gQAIfwCQADqBAAhgAMBAOQEACGvAwEA5AQAId8DEADrBAAh4AMQAOsEACHhAxAA6wQAIeIDEADrBAAhowQAACIAIKQEAAAiACAqIAAAzwUAICIAANAFACAjAAC1BQAgJAAA0QUAICUAANIFACAmAADTBQAgJwAA1AUAICgAANUFACArAAC2BQAgLQAA8gQAIPQCAADMBQAw9QIAACcAEPYCAADMBQAw9wIBAOQEACH7AkAA6gQAIfwCQADqBAAhgAMBAOQEACGhAyAA5wQAIeADAgDsBAAh5gMBAOQEACHrAwEA5AQAIewDAQDmBAAh7QMBAOQEACHuAwEA5gQAIe8DAQDmBAAh8AMBAOQEACHxAwAAxQQAIPIDAgDsBAAh8wMCAM0FACH0AwAAjwUAIPUDAADFBAAg9gMCAM0FACH3AwgAzgUAIfgDCADOBQAh-QMIAM4FACH6AyAA5wQAIfsDAgDsBAAh_AMgAOcEACH9AyAA5wQAIf4DAADFBAAg_wNAAOkEACGABEAA6QQAIQiBAwIAAAABggMCAAAABYMDAgAAAAWEAwIAAAABhQMCAAAAAYYDAgAAAAGHAwIAAAABiAMCAMsEACEIgQMIAAAAAYIDCAAAAAWDAwgAAAAFhAMIAAAAAYUDCAAAAAGGAwgAAAABhwMIAAAAAYgDCACSBQAhA6wDAAArACCtAwAAKwAgrgMAACsAIA4hAADuBAAg9AIAAJwFADD1AgAAiQIAEPYCAACcBQAw9wIBAOQEACH7AkAA6gQAIfwCQADqBAAhlAMBAOQEACGhAyAA5wQAIeYDAQDkBAAhhQQBAOQEACGGBAIA7AQAIaMEAACJAgAgpAQAAIkCACADrAMAADEAIK0DAAAxACCuAwAAMQAgA6wDAAA1ACCtAwAANQAgrgMAADUAIAOsAwAAOQAgrQMAADkAIK4DAAA5ACADrAMAAD0AIK0DAAA9ACCuAwAAPQAgA6wDAABBACCtAwAAQQAgrgMAAEEAIA8cAADXBQAgIAAAzwUAICMAALUFACD0AgAA1gUAMPUCAAAiABD2AgAA1gUAMPcCAQDkBAAh-wJAAOoEACH8AkAA6gQAIYADAQDkBAAhrwMBAOQEACHfAxAA6wQAIeADEADrBAAh4QMQAOsEACHiAxAA6wQAIRMaAADxBAAgHgAAmgUAIPQCAACYBQAw9QIAACAAEPYCAACYBQAw9wIBAOQEACH7AkAA6gQAIfwCQADqBAAh_wIBAOQEACGSAwEA5AQAIZcDAQDkBAAhmQMBAOQEACGaAwEA5gQAIZsDAQDkBAAhggQBAOQEACGDBBAAmQUAIYQEEACZBQAhowQAACAAIKQEAAAgACARGgAA8QQAIPQCAADYBQAw9QIAABwAEPYCAADYBQAw9wIBAOQEACH7AkAA6gQAIfwCQADqBAAh_wIBAOQEACGAAwEA5AQAIYwEAQDkBAAhjQQBAOYEACGOBAEA5gQAIY8EAQDmBAAhkARAAOkEACGRBEAA6QQAIZIEAQDmBAAhkwQBAOYEACEN9AIAANkFADD1AgAAFwAQ9gIAANkFADD3AgEAwgQAIfsCQADGBAAh_AJAAMYEACGXAwEAwgQAIZgDAQDCBAAhmQMBAMIEACGaAwEAxAQAIZsDAQDCBAAh6QMgANMEACGiBAAA2gWiBCIHFQAAyAQAIBYAANwFACAXAADcBQAggQMAAACiBAKCAwAAAKIECIMDAAAAogQIiAMAANsFogQiBxUAAMgEACAWAADcBQAgFwAA3AUAIIEDAAAAogQCggMAAACiBAiDAwAAAKIECIgDAADbBaIEIgSBAwAAAKIEAoIDAAAAogQIgwMAAACiBAiIAwAA3AWiBCIN9AIAAN0FADD1AgAABAAQ9gIAAN0FADD3AgEA5AQAIfsCQADqBAAh_AJAAOoEACGXAwEA5AQAIZgDAQDkBAAhmQMBAOQEACGaAwEA5gQAIZsDAQDkBAAh6QMgAOcEACGiBAAA3gWiBCIEgQMAAACiBAKCAwAAAKIECIMDAAAAogQIiAMAANwFogQiAAAAAAAAAagEAQAAAAEFqAQIAAAAAa4ECAAAAAGvBAgAAAABsAQIAAAAAbEECAAAAAEBqAQBAAAAAQKoBAEAAAAEsgQBAAAABQGoBEAAAAABBQ8AAP0KACAQAACJCwAgpQQAAP4KACCmBAAAiAsAIKsEAABlACAFDwAA-woAIBAAAIYLACClBAAA_AoAIKYEAACFCwAgqwQAACkAIAUPAAD5CgAgEAAAgwsAIKUEAAD6CgAgpgQAAIILACCrBAAAkwQAIAUPAAD3CgAgEAAAgAsAIKUEAAD4CgAgpgQAAP8KACCrBAAAGgAgAagEAQAAAAQDDwAA_QoAIKUEAAD-CgAgqwQAAGUAIAMPAAD7CgAgpQQAAPwKACCrBAAAKQAgAw8AAPkKACClBAAA-goAIKsEAACTBAAgAw8AAPcKACClBAAA-AoAIKsEAAAaACAAAAAAAAGoBAAAAJEDAgGoBCAAAAABAagEAAAAnQMCAagEQAAAAAEFqAQQAAAAAa4EEAAAAAGvBBAAAAABsAQQAAAAAbEEEAAAAAEFqAQCAAAAAa4EAgAAAAGvBAIAAAABsAQCAAAAAbEEAgAAAAELDwAA7wcAMBAAAPQHADClBAAA8AcAMKYEAADxBwAwpwQAAPIHACCoBAAA8wcAMKkEAADzBwAwqgQAAPMHADCrBAAA8wcAMKwEAAD1BwAwrQQAAPYHADALDwAA6QYAMBAAAO4GADClBAAA6gYAMKYEAADrBgAwpwQAAOwGACCoBAAA7QYAMKkEAADtBgAwqgQAAO0GADCrBAAA7QYAMKwEAADvBgAwrQQAAPAGADALDwAAogYAMBAAAKcGADClBAAAowYAMKYEAACkBgAwpwQAAKUGACCoBAAApgYAMKkEAACmBgAwqgQAAKYGADCrBAAApgYAMKwEAACoBgAwrQQAAKkGADALDwAAkAYAMBAAAJUGADClBAAAkQYAMKYEAACSBgAwpwQAAJMGACCoBAAAlAYAMKkEAACUBgAwqgQAAJQGADCrBAAAlAYAMKwEAACWBgAwrQQAAJcGADAFDwAArgoAIBAAAPUKACClBAAArwoAIKYEAAD0CgAgqwQAABoAIAsPAACEBgAwEAAAiQYAMKUEAACFBgAwpgQAAIYGADCnBAAAhwYAIKgEAACIBgAwqQQAAIgGADCqBAAAiAYAMKsEAACIBgAwrAQAAIoGADCtBAAAiwYAMAwaAADyBQAgHwAA8AUAICkAAO8FACD3AgEAAAAB-AIIAAAAAfkCAQAAAAH6AgAA7gUAIPsCQAAAAAH8AkAAAAAB_QIBAAAAAf4CAQAAAAH_AgEAAAABAgAAAEcAIA8AAI8GACADAAAARwAgDwAAjwYAIBAAAI4GACABCAAA8woAMBIaAADxBAAgHwAAvAUAICMAALUFACApAAC6BQAg9AIAAMIFADD1AgAARQAQ9gIAAMIFADD3AgEAAAAB-AIIAMMFACH5AgEA5gQAIfoCAADFBAAg-wJAAOoEACH8AkAA6gQAIf0CAQDkBAAh_gIBAOQEACH_AgEA5AQAIYADAQDkBAAhnwQAAMEFACACAAAARwAgCAAAjgYAIAIAAACMBgAgCAAAjQYAIA30AgAAiwYAMPUCAACMBgAQ9gIAAIsGADD3AgEA5AQAIfgCCADDBQAh-QIBAOYEACH6AgAAxQQAIPsCQADqBAAh_AJAAOoEACH9AgEA5AQAIf4CAQDkBAAh_wIBAOQEACGAAwEA5AQAIQ30AgAAiwYAMPUCAACMBgAQ9gIAAIsGADD3AgEA5AQAIfgCCADDBQAh-QIBAOYEACH6AgAAxQQAIPsCQADqBAAh_AJAAOoEACH9AgEA5AQAIf4CAQDkBAAh_wIBAOQEACGAAwEA5AQAIQn3AgEA5QUAIfgCCADmBQAh-QIBAOcFACH6AgAA6AUAIPsCQADpBQAh_AJAAOkFACH9AgEA5QUAIf4CAQDlBQAh_wIBAOUFACEMGgAA7QUAIB8AAOsFACApAADqBQAg9wIBAOUFACH4AggA5gUAIfkCAQDnBQAh-gIAAOgFACD7AkAA6QUAIfwCQADpBQAh_QIBAOUFACH-AgEA5QUAIf8CAQDlBQAhDBoAAPIFACAfAADwBQAgKQAA7wUAIPcCAQAAAAH4AggAAAAB-QIBAAAAAfoCAADuBQAg-wJAAAAAAfwCQAAAAAH9AgEAAAAB_gIBAAAAAf8CAQAAAAEYHAAAoAYAICkAAKEGACD3AgEAAAAB-wJAAAAAAfwCQAAAAAH9AgEAAAABrwMBAAAAAbADEAAAAAGxAxAAAAABsgMQAAAAAbMDEAAAAAG0AwEAAAABtQMBAAAAAbYDAQAAAAG4AwAAALgDArkDgAAAAAG6A0AAAAABuwNAAAAAAbwDQAAAAAG9A0AAAAABvgNAAAAAAb8DAQAAAAHAAwEAAAABwgMAAADCAwICAAAASwAgDwAAnwYAIAMAAABLACAPAACfBgAgEAAAnAYAIAEIAADyCgAwHRwAAPEEACAjAAC1BQAgKQAAugUAIPQCAAC9BQAw9QIAAEkAEPYCAAC9BQAw9wIBAAAAAfsCQADqBAAh_AJAAOoEACH9AgEA5AQAIYADAQDkBAAhrwMBAOQEACGwAxAA6wQAIbEDEADrBAAhsgMQAOsEACGzAxAA6wQAIbQDAQAAAAG1AwEAAAABtgMBAOYEACG4AwAAvgW4AyK5AwAAvwUAILoDQADpBAAhuwNAAOkEACG8A0AA6QQAIb0DQADpBAAhvgNAAOkEACG_AwEA5gQAIcADAQDmBAAhwgMAAMAFwgMiAgAAAEsAIAgAAJwGACACAAAAmAYAIAgAAJkGACAa9AIAAJcGADD1AgAAmAYAEPYCAACXBgAw9wIBAOQEACH7AkAA6gQAIfwCQADqBAAh_QIBAOQEACGAAwEA5AQAIa8DAQDkBAAhsAMQAOsEACGxAxAA6wQAIbIDEADrBAAhswMQAOsEACG0AwEA5AQAIbUDAQDmBAAhtgMBAOYEACG4AwAAvgW4AyK5AwAAvwUAILoDQADpBAAhuwNAAOkEACG8A0AA6QQAIb0DQADpBAAhvgNAAOkEACG_AwEA5gQAIcADAQDmBAAhwgMAAMAFwgMiGvQCAACXBgAw9QIAAJgGABD2AgAAlwYAMPcCAQDkBAAh-wJAAOoEACH8AkAA6gQAIf0CAQDkBAAhgAMBAOQEACGvAwEA5AQAIbADEADrBAAhsQMQAOsEACGyAxAA6wQAIbMDEADrBAAhtAMBAOQEACG1AwEA5gQAIbYDAQDmBAAhuAMAAL4FuAMiuQMAAL8FACC6A0AA6QQAIbsDQADpBAAhvANAAOkEACG9A0AA6QQAIb4DQADpBAAhvwMBAOYEACHAAwEA5gQAIcIDAADABcIDIhb3AgEA5QUAIfsCQADpBQAh_AJAAOkFACH9AgEA5QUAIa8DAQDlBQAhsAMQAPwFACGxAxAA_AUAIbIDEAD8BQAhswMQAPwFACG0AwEA5QUAIbUDAQDnBQAhtgMBAOcFACG4AwAAmga4AyK5A4AAAAABugNAAPsFACG7A0AA-wUAIbwDQAD7BQAhvQNAAPsFACG-A0AA-wUAIb8DAQDnBQAhwAMBAOcFACHCAwAAmwbCAyIBqAQAAAC4AwIBqAQAAADCAwIYHAAAnQYAICkAAJ4GACD3AgEA5QUAIfsCQADpBQAh_AJAAOkFACH9AgEA5QUAIa8DAQDlBQAhsAMQAPwFACGxAxAA_AUAIbIDEAD8BQAhswMQAPwFACG0AwEA5QUAIbUDAQDnBQAhtgMBAOcFACG4AwAAmga4AyK5A4AAAAABugNAAPsFACG7A0AA-wUAIbwDQAD7BQAhvQNAAPsFACG-A0AA-wUAIb8DAQDnBQAhwAMBAOcFACHCAwAAmwbCAyIFDwAA6goAIBAAAPAKACClBAAA6woAIKYEAADvCgAgqwQAABoAIAUPAADoCgAgEAAA7QoAIKUEAADpCgAgpgQAAOwKACCrBAAAZQAgGBwAAKAGACApAAChBgAg9wIBAAAAAfsCQAAAAAH8AkAAAAAB_QIBAAAAAa8DAQAAAAGwAxAAAAABsQMQAAAAAbIDEAAAAAGzAxAAAAABtAMBAAAAAbUDAQAAAAG2AwEAAAABuAMAAAC4AwK5A4AAAAABugNAAAAAAbsDQAAAAAG8A0AAAAABvQNAAAAAAb4DQAAAAAG_AwEAAAABwAMBAAAAAcIDAAAAwgMCAw8AAOoKACClBAAA6woAIKsEAAAaACADDwAA6AoAIKUEAADpCgAgqwQAAGUAIBwcAADkBgAgKgAA5QYAICsAAOYGACAsAADnBgAgLQAA6AYAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAa8DAQAAAAG4AwAAAMoDAr0DQAAAAAHUAwEAAAAB1gMAAADWAwLXAwEAAAAB2AMBAAAAAdkDAQAAAAHaAwEAAAAB2wMBAAAAAdwDAQAAAAHdAwEAAAAB3gMBAAAAAd8DEAAAAAHgAxAAAAAB4QMQAAAAAeIDEAAAAAHjA0AAAAAB5ANAAAAAAeUDQAAAAAECAAAAZQAgDwAA4wYAIAMAAABlACAPAADjBgAgEAAArgYAIAEIAADnCgAwIRwAAPEEACAjAAC1BQAgKgAA8AQAICsAALYFACAsAAC3BQAgLQAA8gQAIPQCAACyBQAw9QIAAGMAEPYCAACyBQAw9wIBAAAAAfsCQADqBAAh_AJAAOoEACGAAwEA5AQAIa8DAQDkBAAhuAMAALQFygMivQNAAOkEACHUAwEAAAAB1gMAALMF1gMi1wMBAOYEACHYAwEA5gQAIdkDAQDkBAAh2gMBAOYEACHbAwEA5gQAIdwDAQDmBAAh3QMBAOYEACHeAwEA5gQAId8DEADrBAAh4AMQAOsEACHhAxAA6wQAIeIDEADrBAAh4wNAAOkEACHkA0AA6QQAIeUDQADpBAAhAgAAAGUAIAgAAK4GACACAAAAqgYAIAgAAKsGACAb9AIAAKkGADD1AgAAqgYAEPYCAACpBgAw9wIBAOQEACH7AkAA6gQAIfwCQADqBAAhgAMBAOQEACGvAwEA5AQAIbgDAAC0BcoDIr0DQADpBAAh1AMBAOQEACHWAwAAswXWAyLXAwEA5gQAIdgDAQDmBAAh2QMBAOQEACHaAwEA5gQAIdsDAQDmBAAh3AMBAOYEACHdAwEA5gQAId4DAQDmBAAh3wMQAOsEACHgAxAA6wQAIeEDEADrBAAh4gMQAOsEACHjA0AA6QQAIeQDQADpBAAh5QNAAOkEACEb9AIAAKkGADD1AgAAqgYAEPYCAACpBgAw9wIBAOQEACH7AkAA6gQAIfwCQADqBAAhgAMBAOQEACGvAwEA5AQAIbgDAAC0BcoDIr0DQADpBAAh1AMBAOQEACHWAwAAswXWAyLXAwEA5gQAIdgDAQDmBAAh2QMBAOQEACHaAwEA5gQAIdsDAQDmBAAh3AMBAOYEACHdAwEA5gQAId4DAQDmBAAh3wMQAOsEACHgAxAA6wQAIeEDEADrBAAh4gMQAOsEACHjA0AA6QQAIeQDQADpBAAh5QNAAOkEACEX9wIBAOUFACH7AkAA6QUAIfwCQADpBQAhrwMBAOUFACG4AwAArQbKAyK9A0AA-wUAIdQDAQDlBQAh1gMAAKwG1gMi1wMBAOcFACHYAwEA5wUAIdkDAQDlBQAh2gMBAOcFACHbAwEA5wUAIdwDAQDnBQAh3QMBAOcFACHeAwEA5wUAId8DEAD8BQAh4AMQAPwFACHhAxAA_AUAIeIDEAD8BQAh4wNAAPsFACHkA0AA-wUAIeUDQAD7BQAhAagEAAAA1gMCAagEAAAAygMCHBwAAK8GACAqAACwBgAgKwAAsQYAICwAALIGACAtAACzBgAg9wIBAOUFACH7AkAA6QUAIfwCQADpBQAhrwMBAOUFACG4AwAArQbKAyK9A0AA-wUAIdQDAQDlBQAh1gMAAKwG1gMi1wMBAOcFACHYAwEA5wUAIdkDAQDlBQAh2gMBAOcFACHbAwEA5wUAIdwDAQDnBQAh3QMBAOcFACHeAwEA5wUAId8DEAD8BQAh4AMQAPwFACHhAxAA_AUAIeIDEAD8BQAh4wNAAPsFACHkA0AA-wUAIeUDQAD7BQAhBQ8AANQKACAQAADlCgAgpQQAANUKACCmBAAA5AoAIKsEAAAaACALDwAA2AYAMBAAANwGADClBAAA2QYAMKYEAADaBgAwpwQAANsGACCoBAAAlAYAMKkEAACUBgAwqgQAAJQGADCrBAAAlAYAMKwEAADdBgAwrQQAAJcGADALDwAAygYAMBAAAM8GADClBAAAywYAMKYEAADMBgAwpwQAAM0GACCoBAAAzgYAMKkEAADOBgAwqgQAAM4GADCrBAAAzgYAMKwEAADQBgAwrQQAANEGADALDwAAvQYAMBAAAMIGADClBAAAvgYAMKYEAAC_BgAwpwQAAMAGACCoBAAAwQYAMKkEAADBBgAwqgQAAMEGADCrBAAAwQYAMKwEAADDBgAwrQQAAMQGADALDwAAtAYAMBAAALgGADClBAAAtQYAMKYEAAC2BgAwpwQAALcGACCoBAAAiAYAMKkEAACIBgAwqgQAAIgGADCrBAAAiAYAMKwEAAC5BgAwrQQAAIsGADAMGgAA8gUAIB8AAPAFACAjAADxBQAg9wIBAAAAAfgCCAAAAAH5AgEAAAAB-gIAAO4FACD7AkAAAAAB_AJAAAAAAf4CAQAAAAH_AgEAAAABgAMBAAAAAQIAAABHACAPAAC8BgAgAwAAAEcAIA8AALwGACAQAAC7BgAgAQgAAOMKADACAAAARwAgCAAAuwYAIAIAAACMBgAgCAAAugYAIAn3AgEA5QUAIfgCCADmBQAh-QIBAOcFACH6AgAA6AUAIPsCQADpBQAh_AJAAOkFACH-AgEA5QUAIf8CAQDlBQAhgAMBAOUFACEMGgAA7QUAIB8AAOsFACAjAADsBQAg9wIBAOUFACH4AggA5gUAIfkCAQDnBQAh-gIAAOgFACD7AkAA6QUAIfwCQADpBQAh_gIBAOUFACH_AgEA5QUAIYADAQDlBQAhDBoAAPIFACAfAADwBQAgIwAA8QUAIPcCAQAAAAH4AggAAAAB-QIBAAAAAfoCAADuBQAg-wJAAAAAAfwCQAAAAAH-AgEAAAAB_wIBAAAAAYADAQAAAAEG9wIBAAAAAfsCQAAAAAG4AwAAAMoDAsoDAQAAAAHLAwEAAAABzQMAAADNAwMCAAAAUwAgDwAAyQYAIAMAAABTACAPAADJBgAgEAAAyAYAIAEIAADiCgAwCykAALoFACD0AgAAuAUAMPUCAABRABD2AgAAuAUAMPcCAQAAAAH7AkAA6gQAIf0CAQDkBAAhuAMAALQFygMiygMBAOYEACHLAwEA5gQAIc0DAAC5Bc0DIwIAAABTACAIAADIBgAgAgAAAMUGACAIAADGBgAgCvQCAADEBgAw9QIAAMUGABD2AgAAxAYAMPcCAQDkBAAh-wJAAOoEACH9AgEA5AQAIbgDAAC0BcoDIsoDAQDmBAAhywMBAOYEACHNAwAAuQXNAyMK9AIAAMQGADD1AgAAxQYAEPYCAADEBgAw9wIBAOQEACH7AkAA6gQAIf0CAQDkBAAhuAMAALQFygMiygMBAOYEACHLAwEA5gQAIc0DAAC5Bc0DIwb3AgEA5QUAIfsCQADpBQAhuAMAAK0GygMiygMBAOcFACHLAwEA5wUAIc0DAADHBs0DIwGoBAAAAM0DAwb3AgEA5QUAIfsCQADpBQAhuAMAAK0GygMiygMBAOcFACHLAwEA5wUAIc0DAADHBs0DIwb3AgEAAAAB-wJAAAAAAbgDAAAAygMCygMBAAAAAcsDAQAAAAHNAwAAAM0DAwofAADXBgAg9wIBAAAAAfsCQAAAAAH-AgEAAAABzgMBAAAAAc8DAQAAAAHQAwEAAAAB0QMCAAAAAdIDEAAAAAHTAxAAAAABAgAAAE8AIA8AANYGACADAAAATwAgDwAA1gYAIBAAANQGACABCAAA4QoAMA8fAAC8BQAgKQAAugUAIPQCAAC7BQAw9QIAAE0AEPYCAAC7BQAw9wIBAAAAAfsCQADqBAAh_QIBAOQEACH-AgEA5AQAIc4DAQDkBAAhzwMBAOYEACHQAwEA5gQAIdEDAgDsBAAh0gMQAOsEACHTAxAA6wQAIQIAAABPACAIAADUBgAgAgAAANIGACAIAADTBgAgDfQCAADRBgAw9QIAANIGABD2AgAA0QYAMPcCAQDkBAAh-wJAAOoEACH9AgEA5AQAIf4CAQDkBAAhzgMBAOQEACHPAwEA5gQAIdADAQDmBAAh0QMCAOwEACHSAxAA6wQAIdMDEADrBAAhDfQCAADRBgAw9QIAANIGABD2AgAA0QYAMPcCAQDkBAAh-wJAAOoEACH9AgEA5AQAIf4CAQDkBAAhzgMBAOQEACHPAwEA5gQAIdADAQDmBAAh0QMCAOwEACHSAxAA6wQAIdMDEADrBAAhCfcCAQDlBQAh-wJAAOkFACH-AgEA5QUAIc4DAQDlBQAhzwMBAOcFACHQAwEA5wUAIdEDAgD9BQAh0gMQAPwFACHTAxAA_AUAIQofAADVBgAg9wIBAOUFACH7AkAA6QUAIf4CAQDlBQAhzgMBAOUFACHPAwEA5wUAIdADAQDnBQAh0QMCAP0FACHSAxAA_AUAIdMDEAD8BQAhBQ8AANwKACAQAADfCgAgpQQAAN0KACCmBAAA3goAIKsEAAApACAKHwAA1wYAIPcCAQAAAAH7AkAAAAAB_gIBAAAAAc4DAQAAAAHPAwEAAAAB0AMBAAAAAdEDAgAAAAHSAxAAAAAB0wMQAAAAAQMPAADcCgAgpQQAAN0KACCrBAAAKQAgGBwAAKAGACAjAADiBgAg9wIBAAAAAfsCQAAAAAH8AkAAAAABgAMBAAAAAa8DAQAAAAGwAxAAAAABsQMQAAAAAbIDEAAAAAGzAxAAAAABtAMBAAAAAbUDAQAAAAG2AwEAAAABuAMAAAC4AwK5A4AAAAABugNAAAAAAbsDQAAAAAG8A0AAAAABvQNAAAAAAb4DQAAAAAG_AwEAAAABwAMBAAAAAcIDAAAAwgMCAgAAAEsAIA8AAOEGACADAAAASwAgDwAA4QYAIBAAAN8GACABCAAA2woAMAIAAABLACAIAADfBgAgAgAAAJgGACAIAADeBgAgFvcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIYADAQDlBQAhrwMBAOUFACGwAxAA_AUAIbEDEAD8BQAhsgMQAPwFACGzAxAA_AUAIbQDAQDlBQAhtQMBAOcFACG2AwEA5wUAIbgDAACaBrgDIrkDgAAAAAG6A0AA-wUAIbsDQAD7BQAhvANAAPsFACG9A0AA-wUAIb4DQAD7BQAhvwMBAOcFACHAAwEA5wUAIcIDAACbBsIDIhgcAACdBgAgIwAA4AYAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIYADAQDlBQAhrwMBAOUFACGwAxAA_AUAIbEDEAD8BQAhsgMQAPwFACGzAxAA_AUAIbQDAQDlBQAhtQMBAOcFACG2AwEA5wUAIbgDAACaBrgDIrkDgAAAAAG6A0AA-wUAIbsDQAD7BQAhvANAAPsFACG9A0AA-wUAIb4DQAD7BQAhvwMBAOcFACHAAwEA5wUAIcIDAACbBsIDIgUPAADWCgAgEAAA2QoAIKUEAADXCgAgpgQAANgKACCrBAAAkwQAIBgcAACgBgAgIwAA4gYAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAYADAQAAAAGvAwEAAAABsAMQAAAAAbEDEAAAAAGyAxAAAAABswMQAAAAAbQDAQAAAAG1AwEAAAABtgMBAAAAAbgDAAAAuAMCuQOAAAAAAboDQAAAAAG7A0AAAAABvANAAAAAAb0DQAAAAAG-A0AAAAABvwMBAAAAAcADAQAAAAHCAwAAAMIDAgMPAADWCgAgpQQAANcKACCrBAAAkwQAIBwcAADkBgAgKgAA5QYAICsAAOYGACAsAADnBgAgLQAA6AYAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAa8DAQAAAAG4AwAAAMoDAr0DQAAAAAHUAwEAAAAB1gMAAADWAwLXAwEAAAAB2AMBAAAAAdkDAQAAAAHaAwEAAAAB2wMBAAAAAdwDAQAAAAHdAwEAAAAB3gMBAAAAAd8DEAAAAAHgAxAAAAAB4QMQAAAAAeIDEAAAAAHjA0AAAAAB5ANAAAAAAeUDQAAAAAEDDwAA1AoAIKUEAADVCgAgqwQAABoAIAQPAADYBgAwpQQAANkGADCnBAAA2wYAIKsEAACUBgAwBA8AAMoGADClBAAAywYAMKcEAADNBgAgqwQAAM4GADAEDwAAvQYAMKUEAAC-BgAwpwQAAMAGACCrBAAAwQYAMAQPAAC0BgAwpQQAALUGADCnBAAAtwYAIKsEAACIBgAwJSAAAOYHACAiAADnBwAgJAAA6AcAICUAAOkHACAmAADqBwAgJwAA6wcAICgAAOwHACArAADuBwAgLQAA7QcAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAaEDIAAAAAHgAwIAAAAB5gMBAAAAAesDAQAAAAHsAwEAAAAB7QMBAAAAAe4DAQAAAAHvAwEAAAAB8AMBAAAAAfEDAADiBwAg8gMCAAAAAfMDAgAAAAH0AwAA4wcAIPUDAADkBwAg9gMCAAAAAfcDCAAAAAH4AwgAAAAB-QMIAAAAAfoDIAAAAAH7AwIAAAAB_AMgAAAAAf0DIAAAAAH-AwAA5QcAIP8DQAAAAAGABEAAAAABAgAAACkAIA8AAOEHACADAAAAKQAgDwAA4QcAIBAAAPkGACABCAAA0woAMCogAADPBQAgIgAA0AUAICMAALUFACAkAADRBQAgJQAA0gUAICYAANMFACAnAADUBQAgKAAA1QUAICsAALYFACAtAADyBAAg9AIAAMwFADD1AgAAJwAQ9gIAAMwFADD3AgEAAAAB-wJAAOoEACH8AkAA6gQAIYADAQDkBAAhoQMgAOcEACHgAwIA7AQAIeYDAQDkBAAh6wMBAOQEACHsAwEA5gQAIe0DAQDkBAAh7gMBAOYEACHvAwEA5gQAIfADAQDkBAAh8QMAAMUEACDyAwIA7AQAIfMDAgDNBQAh9AMAAI8FACD1AwAAxQQAIPYDAgDNBQAh9wMIAM4FACH4AwgAzgUAIfkDCADOBQAh-gMgAOcEACH7AwIA7AQAIfwDIADnBAAh_QMgAOcEACH-AwAAxQQAIP8DQADpBAAhgARAAOkEACECAAAAKQAgCAAA-QYAIAIAAADxBgAgCAAA8gYAICD0AgAA8AYAMPUCAADxBgAQ9gIAAPAGADD3AgEA5AQAIfsCQADqBAAh_AJAAOoEACGAAwEA5AQAIaEDIADnBAAh4AMCAOwEACHmAwEA5AQAIesDAQDkBAAh7AMBAOYEACHtAwEA5AQAIe4DAQDmBAAh7wMBAOYEACHwAwEA5AQAIfEDAADFBAAg8gMCAOwEACHzAwIAzQUAIfQDAACPBQAg9QMAAMUEACD2AwIAzQUAIfcDCADOBQAh-AMIAM4FACH5AwgAzgUAIfoDIADnBAAh-wMCAOwEACH8AyAA5wQAIf0DIADnBAAh_gMAAMUEACD_A0AA6QQAIYAEQADpBAAhIPQCAADwBgAw9QIAAPEGABD2AgAA8AYAMPcCAQDkBAAh-wJAAOoEACH8AkAA6gQAIYADAQDkBAAhoQMgAOcEACHgAwIA7AQAIeYDAQDkBAAh6wMBAOQEACHsAwEA5gQAIe0DAQDkBAAh7gMBAOYEACHvAwEA5gQAIfADAQDkBAAh8QMAAMUEACDyAwIA7AQAIfMDAgDNBQAh9AMAAI8FACD1AwAAxQQAIPYDAgDNBQAh9wMIAM4FACH4AwgAzgUAIfkDCADOBQAh-gMgAOcEACH7AwIA7AQAIfwDIADnBAAh_QMgAOcEACH-AwAAxQQAIP8DQADpBAAhgARAAOkEACEc9wIBAOUFACH7AkAA6QUAIfwCQADpBQAhoQMgAPkFACHgAwIA_QUAIeYDAQDlBQAh6wMBAOUFACHsAwEA5wUAIe0DAQDlBQAh7gMBAOcFACHvAwEA5wUAIfADAQDlBQAh8QMAAPMGACDyAwIA_QUAIfMDAgD0BgAh9AMAAPUGACD1AwAA9gYAIPYDAgD0BgAh9wMIAPcGACH4AwgA9wYAIfkDCAD3BgAh-gMgAPkFACH7AwIA_QUAIfwDIAD5BQAh_QMgAPkFACH-AwAA-AYAIP8DQAD7BQAhgARAAPsFACECqAQBAAAABLIEAQAAAAUFqAQCAAAAAa4EAgAAAAGvBAIAAAABsAQCAAAAAbEEAgAAAAECqAQAAACCBAiyBAAAAIIEAgKoBAEAAAAEsgQBAAAABQWoBAgAAAABrgQIAAAAAa8ECAAAAAGwBAgAAAABsQQIAAAAAQKoBAEAAAAEsgQBAAAABSUgAAD6BgAgIgAA-wYAICQAAPwGACAlAAD9BgAgJgAA_gYAICcAAP8GACAoAACABwAgKwAAggcAIC0AAIEHACD3AgEA5QUAIfsCQADpBQAh_AJAAOkFACGhAyAA-QUAIeADAgD9BQAh5gMBAOUFACHrAwEA5QUAIewDAQDnBQAh7QMBAOUFACHuAwEA5wUAIe8DAQDnBQAh8AMBAOUFACHxAwAA8wYAIPIDAgD9BQAh8wMCAPQGACH0AwAA9QYAIPUDAAD2BgAg9gMCAPQGACH3AwgA9wYAIfgDCAD3BgAh-QMIAPcGACH6AyAA-QUAIfsDAgD9BQAh_AMgAPkFACH9AyAA-QUAIf4DAAD4BgAg_wNAAPsFACGABEAA-wUAIQsPAADTBwAwEAAA2AcAMKUEAADUBwAwpgQAANUHADCnBAAA1gcAIKgEAADXBwAwqQQAANcHADCqBAAA1wcAMKsEAADXBwAwrAQAANkHADCtBAAA2gcAMAUPAAC8CgAgEAAA0QoAIKUEAAC9CgAgpgQAANAKACCrBAAAhgIAIAsPAADHBwAwEAAAzAcAMKUEAADIBwAwpgQAAMkHADCnBAAAygcAIKgEAADLBwAwqQQAAMsHADCqBAAAywcAMKsEAADLBwAwrAQAAM0HADCtBAAAzgcAMAsPAAC7BwAwEAAAwAcAMKUEAAC8BwAwpgQAAL0HADCnBAAAvgcAIKgEAAC_BwAwqQQAAL8HADCqBAAAvwcAMKsEAAC_BwAwrAQAAMEHADCtBAAAwgcAMAsPAACvBwAwEAAAtAcAMKUEAACwBwAwpgQAALEHADCnBAAAsgcAIKgEAACzBwAwqQQAALMHADCqBAAAswcAMKsEAACzBwAwrAQAALUHADCtBAAAtgcAMAsPAACjBwAwEAAAqAcAMKUEAACkBwAwpgQAAKUHADCnBAAApgcAIKgEAACnBwAwqQQAAKcHADCqBAAApwcAMKsEAACnBwAwrAQAAKkHADCtBAAAqgcAMAsPAACXBwAwEAAAnAcAMKUEAACYBwAwpgQAAJkHADCnBAAAmgcAIKgEAACbBwAwqQQAAJsHADCqBAAAmwcAMKsEAACbBwAwrAQAAJ0HADCtBAAAngcAMAsPAACOBwAwEAAAkgcAMKUEAACPBwAwpgQAAJAHADCnBAAAkQcAIKgEAACIBgAwqQQAAIgGADCqBAAAiAYAMKsEAACIBgAwrAQAAJMHADCtBAAAiwYAMAsPAACDBwAwEAAAhwcAMKUEAACEBwAwpgQAAIUHADCnBAAAhgcAIKgEAADOBgAwqQQAAM4GADCqBAAAzgYAMKsEAADOBgAwrAQAAIgHADCtBAAA0QYAMAopAACNBwAg9wIBAAAAAfsCQAAAAAH9AgEAAAABzgMBAAAAAc8DAQAAAAHQAwEAAAAB0QMCAAAAAdIDEAAAAAHTAxAAAAABAgAAAE8AIA8AAIwHACADAAAATwAgDwAAjAcAIBAAAIoHACABCAAAzwoAMAIAAABPACAIAACKBwAgAgAAANIGACAIAACJBwAgCfcCAQDlBQAh-wJAAOkFACH9AgEA5QUAIc4DAQDlBQAhzwMBAOcFACHQAwEA5wUAIdEDAgD9BQAh0gMQAPwFACHTAxAA_AUAIQopAACLBwAg9wIBAOUFACH7AkAA6QUAIf0CAQDlBQAhzgMBAOUFACHPAwEA5wUAIdADAQDnBQAh0QMCAP0FACHSAxAA_AUAIdMDEAD8BQAhBQ8AAMoKACAQAADNCgAgpQQAAMsKACCmBAAAzAoAIKsEAABlACAKKQAAjQcAIPcCAQAAAAH7AkAAAAAB_QIBAAAAAc4DAQAAAAHPAwEAAAAB0AMBAAAAAdEDAgAAAAHSAxAAAAAB0wMQAAAAAQMPAADKCgAgpQQAAMsKACCrBAAAZQAgDBoAAPIFACAjAADxBQAgKQAA7wUAIPcCAQAAAAH4AggAAAAB-QIBAAAAAfoCAADuBQAg-wJAAAAAAfwCQAAAAAH9AgEAAAAB_wIBAAAAAYADAQAAAAECAAAARwAgDwAAlgcAIAMAAABHACAPAACWBwAgEAAAlQcAIAEIAADJCgAwAgAAAEcAIAgAAJUHACACAAAAjAYAIAgAAJQHACAJ9wIBAOUFACH4AggA5gUAIfkCAQDnBQAh-gIAAOgFACD7AkAA6QUAIfwCQADpBQAh_QIBAOUFACH_AgEA5QUAIYADAQDlBQAhDBoAAO0FACAjAADsBQAgKQAA6gUAIPcCAQDlBQAh-AIIAOYFACH5AgEA5wUAIfoCAADoBQAg-wJAAOkFACH8AkAA6QUAIf0CAQDlBQAh_wIBAOUFACGAAwEA5QUAIQwaAADyBQAgIwAA8QUAICkAAO8FACD3AgEAAAAB-AIIAAAAAfkCAQAAAAH6AgAA7gUAIPsCQAAAAAH8AkAAAAAB_QIBAAAAAf8CAQAAAAGAAwEAAAABA_cCAQAAAAHoAwEAAAAB6QMgAAAAAQIAAABDACAPAACiBwAgAwAAAEMAIA8AAKIHACAQAAChBwAgAQgAAMgKADAIHwAAvAUAIPQCAADEBQAw9QIAAEEAEPYCAADEBQAw9wIBAAAAAf4CAQDkBAAh6AMBAOQEACHpAyAA5wQAIQIAAABDACAIAAChBwAgAgAAAJ8HACAIAACgBwAgB_QCAACeBwAw9QIAAJ8HABD2AgAAngcAMPcCAQDkBAAh_gIBAOQEACHoAwEA5AQAIekDIADnBAAhB_QCAACeBwAw9QIAAJ8HABD2AgAAngcAMPcCAQDkBAAh_gIBAOQEACHoAwEA5AQAIekDIADnBAAhA_cCAQDlBQAh6AMBAOUFACHpAyAA-QUAIQP3AgEA5QUAIegDAQDlBQAh6QMgAPkFACED9wIBAAAAAegDAQAAAAHpAyAAAAABBPcCAQAAAAHmAwEAAAAB6QMgAAAAAeoDAgAAAAECAAAAPwAgDwAArgcAIAMAAAA_ACAPAACuBwAgEAAArQcAIAEIAADHCgAwCR8AALwFACD0AgAAxQUAMPUCAAA9ABD2AgAAxQUAMPcCAQAAAAH-AgEA5AQAIeYDAQDkBAAh6QMgAOcEACHqAwIA7AQAIQIAAAA_ACAIAACtBwAgAgAAAKsHACAIAACsBwAgCPQCAACqBwAw9QIAAKsHABD2AgAAqgcAMPcCAQDkBAAh_gIBAOQEACHmAwEA5AQAIekDIADnBAAh6gMCAOwEACEI9AIAAKoHADD1AgAAqwcAEPYCAACqBwAw9wIBAOQEACH-AgEA5AQAIeYDAQDkBAAh6QMgAOcEACHqAwIA7AQAIQT3AgEA5QUAIeYDAQDlBQAh6QMgAPkFACHqAwIA_QUAIQT3AgEA5QUAIeYDAQDlBQAh6QMgAPkFACHqAwIA_QUAIQT3AgEAAAAB5gMBAAAAAekDIAAAAAHqAwIAAAABAvcCAQAAAAHmAwEAAAABAgAAADsAIA8AALoHACADAAAAOwAgDwAAugcAIBAAALkHACABCAAAxgoAMAcfAAC8BQAg9AIAAMYFADD1AgAAOQAQ9gIAAMYFADD3AgEAAAAB_gIBAOQEACHmAwEA5AQAIQIAAAA7ACAIAAC5BwAgAgAAALcHACAIAAC4BwAgBvQCAAC2BwAw9QIAALcHABD2AgAAtgcAMPcCAQDkBAAh_gIBAOQEACHmAwEA5AQAIQb0AgAAtgcAMPUCAAC3BwAQ9gIAALYHADD3AgEA5AQAIf4CAQDkBAAh5gMBAOQEACEC9wIBAOUFACHmAwEA5QUAIQL3AgEA5QUAIeYDAQDlBQAhAvcCAQAAAAHmAwEAAAABAvcCAQAAAAHmAwEAAAABAgAAADcAIA8AAMYHACADAAAANwAgDwAAxgcAIBAAAMUHACABCAAAxQoAMAcfAAC8BQAg9AIAAMcFADD1AgAANQAQ9gIAAMcFADD3AgEAAAAB_gIBAOQEACHmAwEA5AQAIQIAAAA3ACAIAADFBwAgAgAAAMMHACAIAADEBwAgBvQCAADCBwAw9QIAAMMHABD2AgAAwgcAMPcCAQDkBAAh_gIBAOQEACHmAwEA5AQAIQb0AgAAwgcAMPUCAADDBwAQ9gIAAMIHADD3AgEA5AQAIf4CAQDkBAAh5gMBAOQEACEC9wIBAOUFACHmAwEA5QUAIQL3AgEA5QUAIeYDAQDlBQAhAvcCAQAAAAHmAwEAAAABA_cCAQAAAAHmAwEAAAAB5wMCAAAAAQIAAAAzACAPAADSBwAgAwAAADMAIA8AANIHACAQAADRBwAgAQgAAMQKADAIHwAAvAUAIPQCAADIBQAw9QIAADEAEPYCAADIBQAw9wIBAAAAAf4CAQDkBAAh5gMBAOQEACHnAwIA7AQAIQIAAAAzACAIAADRBwAgAgAAAM8HACAIAADQBwAgB_QCAADOBwAw9QIAAM8HABD2AgAAzgcAMPcCAQDkBAAh_gIBAOQEACHmAwEA5AQAIecDAgDsBAAhB_QCAADOBwAw9QIAAM8HABD2AgAAzgcAMPcCAQDkBAAh_gIBAOQEACHmAwEA5AQAIecDAgDsBAAhA_cCAQDlBQAh5gMBAOUFACHnAwIA_QUAIQP3AgEA5QUAIeYDAQDlBQAh5wMCAP0FACED9wIBAAAAAeYDAQAAAAHnAwIAAAABCR4AAOAHACD3AgEAAAAB-wJAAAAAAfwCQAAAAAHRAwIAAAAB0gMQAAAAAdMDEAAAAAGHBAEAAAABiAQQAAAAAQIAAAAtACAPAADfBwAgAwAAAC0AIA8AAN8HACAQAADdBwAgAQgAAMMKADAPHgAAywUAIB8AALwFACD0AgAAygUAMPUCAAArABD2AgAAygUAMPcCAQAAAAH7AkAA6gQAIfwCQADqBAAh_gIBAOQEACHRAwIA7AQAIdIDEADrBAAh0wMQAOsEACGHBAEA5AQAIYgEEADrBAAhoAQAAMkFACACAAAALQAgCAAA3QcAIAIAAADbBwAgCAAA3AcAIAz0AgAA2gcAMPUCAADbBwAQ9gIAANoHADD3AgEA5AQAIfsCQADqBAAh_AJAAOoEACH-AgEA5AQAIdEDAgDsBAAh0gMQAOsEACHTAxAA6wQAIYcEAQDkBAAhiAQQAOsEACEM9AIAANoHADD1AgAA2wcAEPYCAADaBwAw9wIBAOQEACH7AkAA6gQAIfwCQADqBAAh_gIBAOQEACHRAwIA7AQAIdIDEADrBAAh0wMQAOsEACGHBAEA5AQAIYgEEADrBAAhCPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIdEDAgD9BQAh0gMQAPwFACHTAxAA_AUAIYcEAQDlBQAhiAQQAPwFACEJHgAA3gcAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIdEDAgD9BQAh0gMQAPwFACHTAxAA_AUAIYcEAQDlBQAhiAQQAPwFACEFDwAAvgoAIBAAAMEKACClBAAAvwoAIKYEAADACgAgqwQAACUAIAkeAADgBwAg9wIBAAAAAfsCQAAAAAH8AkAAAAAB0QMCAAAAAdIDEAAAAAHTAxAAAAABhwQBAAAAAYgEEAAAAAEDDwAAvgoAIKUEAAC_CgAgqwQAACUAICUgAADmBwAgIgAA5wcAICQAAOgHACAlAADpBwAgJgAA6gcAICcAAOsHACAoAADsBwAgKwAA7gcAIC0AAO0HACD3AgEAAAAB-wJAAAAAAfwCQAAAAAGhAyAAAAAB4AMCAAAAAeYDAQAAAAHrAwEAAAAB7AMBAAAAAe0DAQAAAAHuAwEAAAAB7wMBAAAAAfADAQAAAAHxAwAA4gcAIPIDAgAAAAHzAwIAAAAB9AMAAOMHACD1AwAA5AcAIPYDAgAAAAH3AwgAAAAB-AMIAAAAAfkDCAAAAAH6AyAAAAAB-wMCAAAAAfwDIAAAAAH9AyAAAAAB_gMAAOUHACD_A0AAAAABgARAAAAAAQGoBAEAAAAEAagEAAAAggQIAagEAQAAAAQBqAQBAAAABAQPAADTBwAwpQQAANQHADCnBAAA1gcAIKsEAADXBwAwAw8AALwKACClBAAAvQoAIKsEAACGAgAgBA8AAMcHADClBAAAyAcAMKcEAADKBwAgqwQAAMsHADAEDwAAuwcAMKUEAAC8BwAwpwQAAL4HACCrBAAAvwcAMAQPAACvBwAwpQQAALAHADCnBAAAsgcAIKsEAACzBwAwBA8AAKMHADClBAAApAcAMKcEAACmBwAgqwQAAKcHADAEDwAAlwcAMKUEAACYBwAwpwQAAJoHACCrBAAAmwcAMAQPAACOBwAwpQQAAI8HADCnBAAAkQcAIKsEAACIBgAwBA8AAIMHADClBAAAhAcAMKcEAACGBwAgqwQAAM4GADAKHAAAiAgAICAAAIkIACD3AgEAAAAB-wJAAAAAAfwCQAAAAAGvAwEAAAAB3wMQAAAAAeADEAAAAAHhAxAAAAAB4gMQAAAAAQIAAAAlACAPAACHCAAgAwAAACUAIA8AAIcIACAQAAD5BwAgAQgAALsKADAPHAAA1wUAICAAAM8FACAjAAC1BQAg9AIAANYFADD1AgAAIgAQ9gIAANYFADD3AgEAAAAB-wJAAOoEACH8AkAA6gQAIYADAQDkBAAhrwMBAAAAAd8DEADrBAAh4AMQAOsEACHhAxAA6wQAIeIDEADrBAAhAgAAACUAIAgAAPkHACACAAAA9wcAIAgAAPgHACAM9AIAAPYHADD1AgAA9wcAEPYCAAD2BwAw9wIBAOQEACH7AkAA6gQAIfwCQADqBAAhgAMBAOQEACGvAwEA5AQAId8DEADrBAAh4AMQAOsEACHhAxAA6wQAIeIDEADrBAAhDPQCAAD2BwAw9QIAAPcHABD2AgAA9gcAMPcCAQDkBAAh-wJAAOoEACH8AkAA6gQAIYADAQDkBAAhrwMBAOQEACHfAxAA6wQAIeADEADrBAAh4QMQAOsEACHiAxAA6wQAIQj3AgEA5QUAIfsCQADpBQAh_AJAAOkFACGvAwEA5QUAId8DEAD8BQAh4AMQAPwFACHhAxAA_AUAIeIDEAD8BQAhChwAAPoHACAgAAD7BwAg9wIBAOUFACH7AkAA6QUAIfwCQADpBQAhrwMBAOUFACHfAxAA_AUAIeADEAD8BQAh4QMQAPwFACHiAxAA_AUAIQUPAACwCgAgEAAAuQoAIKUEAACxCgAgpgQAALgKACCrBAAAnwIAIAsPAAD8BwAwEAAAgAgAMKUEAAD9BwAwpgQAAP4HADCnBAAA_wcAIKgEAADXBwAwqQQAANcHADCqBAAA1wcAMKsEAADXBwAwrAQAAIEIADCtBAAA2gcAMAkfAACGCAAg9wIBAAAAAfsCQAAAAAH8AkAAAAAB_gIBAAAAAdEDAgAAAAHSAxAAAAAB0wMQAAAAAYgEEAAAAAECAAAALQAgDwAAhQgAIAMAAAAtACAPAACFCAAgEAAAgwgAIAEIAAC3CgAwAgAAAC0AIAgAAIMIACACAAAA2wcAIAgAAIIIACAI9wIBAOUFACH7AkAA6QUAIfwCQADpBQAh_gIBAOUFACHRAwIA_QUAIdIDEAD8BQAh0wMQAPwFACGIBBAA_AUAIQkfAACECAAg9wIBAOUFACH7AkAA6QUAIfwCQADpBQAh_gIBAOUFACHRAwIA_QUAIdIDEAD8BQAh0wMQAPwFACGIBBAA_AUAIQUPAACyCgAgEAAAtQoAIKUEAACzCgAgpgQAALQKACCrBAAAKQAgCR8AAIYIACD3AgEAAAAB-wJAAAAAAfwCQAAAAAH-AgEAAAAB0QMCAAAAAdIDEAAAAAHTAxAAAAABiAQQAAAAAQMPAACyCgAgpQQAALMKACCrBAAAKQAgChwAAIgIACAgAACJCAAg9wIBAAAAAfsCQAAAAAH8AkAAAAABrwMBAAAAAd8DEAAAAAHgAxAAAAAB4QMQAAAAAeIDEAAAAAEDDwAAsAoAIKUEAACxCgAgqwQAAJ8CACAEDwAA_AcAMKUEAAD9BwAwpwQAAP8HACCrBAAA1wcAMAQPAADvBwAwpQQAAPAHADCnBAAA8gcAIKsEAADzBwAwBA8AAOkGADClBAAA6gYAMKcEAADsBgAgqwQAAO0GADAEDwAAogYAMKUEAACjBgAwpwQAAKUGACCrBAAApgYAMAQPAACQBgAwpQQAAJEGADCnBAAAkwYAIKsEAACUBgAwAw8AAK4KACClBAAArwoAIKsEAAAaACAEDwAAhAYAMKUEAACFBgAwpwQAAIcGACCrBAAAiAYAMAAAAAAKGwAA2QkAICoAAJMIACAtAACVCAAgLgAAkggAIC8AANoJACAwAADbCQAgMQAA3AkAIJIDAADfBQAgmQQAAN8FACCeBAAA3wUAIAAAAAAAAAAAAAUPAACpCgAgEAAArAoAIKUEAACqCgAgpgQAAKsKACCrBAAAZQAgAw8AAKkKACClBAAAqgoAIKsEAABlACAAAAAAAAAAAAAABQ8AAKQKACAQAACnCgAgpQQAAKUKACCmBAAApgoAIKsEAACTBAAgAw8AAKQKACClBAAApQoAIKsEAACTBAAgAAAABQ8AAJ8KACAQAACiCgAgpQQAAKAKACCmBAAAoQoAIKsEAAApACADDwAAnwoAIKUEAACgCgAgqwQAACkAIAAAAAUPAACaCgAgEAAAnQoAIKUEAACbCgAgpgQAAJwKACCrBAAAKQAgAw8AAJoKACClBAAAmwoAIKsEAAApACAAAAAAAAUPAACVCgAgEAAAmAoAIKUEAACWCgAgpgQAAJcKACCrBAAAKQAgAw8AAJUKACClBAAAlgoAIKsEAAApACAAAAAFDwAAkAoAIBAAAJMKACClBAAAkQoAIKYEAACSCgAgqwQAACkAIAMPAACQCgAgpQQAAJEKACCrBAAAKQAgAAAAAAAFDwAAiwoAIBAAAI4KACClBAAAjAoAIKYEAACNCgAgqwQAACkAIAMPAACLCgAgpQQAAIwKACCrBAAAKQAgAAAAAAAFDwAAhgoAIBAAAIkKACClBAAAhwoAIKYEAACICgAgqwQAAJMEACADDwAAhgoAIKUEAACHCgAgqwQAAJMEACAAAAAAAAWoBBAAAAABrgQQAAAAAa8EEAAAAAGwBBAAAAABsQQQAAAAAQcPAADYCAAgEAAA2wgAIKUEAADZCAAgpgQAANoIACCpBAAAIgAgqgQAACIAIKsEAAAlACAFDwAA_AkAIBAAAIQKACClBAAA_QkAIKYEAACDCgAgqwQAABoAIAogAACJCAAgIwAA3ggAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAYADAQAAAAHfAxAAAAAB4AMQAAAAAeEDEAAAAAHiAxAAAAABAgAAACUAIA8AANgIACADAAAAIgAgDwAA2AgAIBAAANwIACAMAAAAIgAgCAAA3AgAICAAAPsHACAjAADdCAAg9wIBAOUFACH7AkAA6QUAIfwCQADpBQAhgAMBAOUFACHfAxAA_AUAIeADEAD8BQAh4QMQAPwFACHiAxAA_AUAIQogAAD7BwAgIwAA3QgAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIYADAQDlBQAh3wMQAPwFACHgAxAA_AUAIeEDEAD8BQAh4gMQAPwFACEFDwAA_gkAIBAAAIEKACClBAAA_wkAIKYEAACACgAgqwQAAJMEACADDwAA_gkAIKUEAAD_CQAgqwQAAJMEACADDwAA2AgAIKUEAADZCAAgqwQAACUAIAMPAAD8CQAgpQQAAP0JACCrBAAAGgAgAxwAANoJACAgAADhCQAgIwAA2wkAIAAAAAAACw8AAOgIADAQAADsCAAwpQQAAOkIADCmBAAA6ggAMKcEAADrCAAgqAQAAO0GADCpBAAA7QYAMKoEAADtBgAwqwQAAO0GADCsBAAA7QgAMK0EAADwBgAwJSAAAOYHACAjAADPCAAgJAAA6AcAICUAAOkHACAmAADqBwAgJwAA6wcAICgAAOwHACArAADuBwAgLQAA7QcAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAYADAQAAAAGhAyAAAAAB4AMCAAAAAeYDAQAAAAHsAwEAAAAB7QMBAAAAAe4DAQAAAAHvAwEAAAAB8AMBAAAAAfEDAADiBwAg8gMCAAAAAfMDAgAAAAH0AwAA4wcAIPUDAADkBwAg9gMCAAAAAfcDCAAAAAH4AwgAAAAB-QMIAAAAAfoDIAAAAAH7AwIAAAAB_AMgAAAAAf0DIAAAAAH-AwAA5QcAIP8DQAAAAAGABEAAAAABAgAAACkAIA8AAPAIACADAAAAKQAgDwAA8AgAIBAAAO8IACABCAAA-wkAMAIAAAApACAIAADvCAAgAgAAAPEGACAIAADuCAAgHPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIYADAQDlBQAhoQMgAPkFACHgAwIA_QUAIeYDAQDlBQAh7AMBAOcFACHtAwEA5QUAIe4DAQDnBQAh7wMBAOcFACHwAwEA5QUAIfEDAADzBgAg8gMCAP0FACHzAwIA9AYAIfQDAAD1BgAg9QMAAPYGACD2AwIA9AYAIfcDCAD3BgAh-AMIAPcGACH5AwgA9wYAIfoDIAD5BQAh-wMCAP0FACH8AyAA-QUAIf0DIAD5BQAh_gMAAPgGACD_A0AA-wUAIYAEQAD7BQAhJSAAAPoGACAjAADOCAAgJAAA_AYAICUAAP0GACAmAAD-BgAgJwAA_wYAICgAAIAHACArAACCBwAgLQAAgQcAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIYADAQDlBQAhoQMgAPkFACHgAwIA_QUAIeYDAQDlBQAh7AMBAOcFACHtAwEA5QUAIe4DAQDnBQAh7wMBAOcFACHwAwEA5QUAIfEDAADzBgAg8gMCAP0FACHzAwIA9AYAIfQDAAD1BgAg9QMAAPYGACD2AwIA9AYAIfcDCAD3BgAh-AMIAPcGACH5AwgA9wYAIfoDIAD5BQAh-wMCAP0FACH8AyAA-QUAIf0DIAD5BQAh_gMAAPgGACD_A0AA-wUAIYAEQAD7BQAhJSAAAOYHACAjAADPCAAgJAAA6AcAICUAAOkHACAmAADqBwAgJwAA6wcAICgAAOwHACArAADuBwAgLQAA7QcAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAYADAQAAAAGhAyAAAAAB4AMCAAAAAeYDAQAAAAHsAwEAAAAB7QMBAAAAAe4DAQAAAAHvAwEAAAAB8AMBAAAAAfEDAADiBwAg8gMCAAAAAfMDAgAAAAH0AwAA4wcAIPUDAADkBwAg9gMCAAAAAfcDCAAAAAH4AwgAAAAB-QMIAAAAAfoDIAAAAAH7AwIAAAAB_AMgAAAAAf0DIAAAAAH-AwAA5QcAIP8DQAAAAAGABEAAAAABBA8AAOgIADClBAAA6QgAMKcEAADrCAAgqwQAAO0GADAAAAAAAAAAAAAAAAAAAAAABQ8AAPYJACAQAAD5CQAgpQQAAPcJACCmBAAA-AkAIKsEAAAaACADDwAA9gkAIKUEAAD3CQAgqwQAABoAIAAAAAUPAADxCQAgEAAA9AkAIKUEAADyCQAgpgQAAPMJACCrBAAAGgAgAw8AAPEJACClBAAA8gkAIKsEAAAaACAAAAABqAQAAADNAwIBqAQAAACcBAILDwAAxgkAMBAAAMsJADClBAAAxwkAMKYEAADICQAwpwQAAMkJACCoBAAAygkAMKkEAADKCQAwqgQAAMoJADCrBAAAygkAMKwEAADMCQAwrQQAAM0JADAHDwAAwQkAIBAAAMQJACClBAAAwgkAIKYEAADDCQAgqQQAACAAIKoEAAAgACCrBAAAnwIAIAsPAAC4CQAwEAAAvAkAMKUEAAC5CQAwpgQAALoJADCnBAAAuwkAIKgEAACmBgAwqQQAAKYGADCqBAAApgYAMKsEAACmBgAwrAQAAL0JADCtBAAAqQYAMAsPAACvCQAwEAAAswkAMKUEAACwCQAwpgQAALEJADCnBAAAsgkAIKgEAACUBgAwqQQAAJQGADCqBAAAlAYAMKsEAACUBgAwrAQAALQJADCtBAAAlwYAMAcPAACqCQAgEAAArQkAIKUEAACrCQAgpgQAAKwJACCpBAAAcgAgqgQAAHIAIKsEAACTBAAgCw8AAKEJADAQAAClCQAwpQQAAKIJADCmBAAAowkAMKcEAACkCQAgqAQAAIgGADCpBAAAiAYAMKoEAACIBgAwqwQAAIgGADCsBAAApgkAMK0EAACLBgAwCw8AAJUJADAQAACaCQAwpQQAAJYJADCmBAAAlwkAMKcEAACYCQAgqAQAAJkJADCpBAAAmQkAMKoEAACZCQAwqwQAAJkJADCsBAAAmwkAMK0EAACcCQAwB_cCAQAAAAH7AkAAAAAB_AJAAAAAAYsEQAAAAAGUBAEAAAABlQQBAAAAAZYEAQAAAAECAAAAdwAgDwAAoAkAIAMAAAB3ACAPAACgCQAgEAAAnwkAIAEIAADwCQAwDBoAAPEEACD0AgAAsQUAMPUCAAB1ABD2AgAAsQUAMPcCAQAAAAH7AkAA6gQAIfwCQADqBAAh_wIBAOQEACGLBEAA6gQAIZQEAQAAAAGVBAEA5gQAIZYEAQDmBAAhAgAAAHcAIAgAAJ8JACACAAAAnQkAIAgAAJ4JACAL9AIAAJwJADD1AgAAnQkAEPYCAACcCQAw9wIBAOQEACH7AkAA6gQAIfwCQADqBAAh_wIBAOQEACGLBEAA6gQAIZQEAQDkBAAhlQQBAOYEACGWBAEA5gQAIQv0AgAAnAkAMPUCAACdCQAQ9gIAAJwJADD3AgEA5AQAIfsCQADqBAAh_AJAAOoEACH_AgEA5AQAIYsEQADqBAAhlAQBAOQEACGVBAEA5gQAIZYEAQDmBAAhB_cCAQDlBQAh-wJAAOkFACH8AkAA6QUAIYsEQADpBQAhlAQBAOUFACGVBAEA5wUAIZYEAQDnBQAhB_cCAQDlBQAh-wJAAOkFACH8AkAA6QUAIYsEQADpBQAhlAQBAOUFACGVBAEA5wUAIZYEAQDnBQAhB_cCAQAAAAH7AkAAAAAB_AJAAAAAAYsEQAAAAAGUBAEAAAABlQQBAAAAAZYEAQAAAAEMHwAA8AUAICMAAPEFACApAADvBQAg9wIBAAAAAfgCCAAAAAH5AgEAAAAB-gIAAO4FACD7AkAAAAAB_AJAAAAAAf0CAQAAAAH-AgEAAAABgAMBAAAAAQIAAABHACAPAACpCQAgAwAAAEcAIA8AAKkJACAQAACoCQAgAQgAAO8JADACAAAARwAgCAAAqAkAIAIAAACMBgAgCAAApwkAIAn3AgEA5QUAIfgCCADmBQAh-QIBAOcFACH6AgAA6AUAIPsCQADpBQAh_AJAAOkFACH9AgEA5QUAIf4CAQDlBQAhgAMBAOUFACEMHwAA6wUAICMAAOwFACApAADqBQAg9wIBAOUFACH4AggA5gUAIfkCAQDnBQAh-gIAAOgFACD7AkAA6QUAIfwCQADpBQAh_QIBAOUFACH-AgEA5QUAIYADAQDlBQAhDB8AAPAFACAjAADxBQAgKQAA7wUAIPcCAQAAAAH4AggAAAAB-QIBAAAAAfoCAADuBQAg-wJAAAAAAfwCQAAAAAH9AgEAAAAB_gIBAAAAAYADAQAAAAEjHQAAiggAICEAAIsIACAqAACNCAAgLQAAjwgAIC4AAIwIACD3AgEAAAAB-wJAAAAAAfwCQAAAAAGPAwEAAAABkQMAAACRAwKSAwEAAAABkwMBAAAAAZQDAQAAAAGVAwEAAAABlgMgAAAAAZcDAQAAAAGYAwEAAAABmQMBAAAAAZoDAQAAAAGbAwEAAAABnQMAAACdAwKeAwEAAAABnwMBAAAAAaADQAAAAAGhAyAAAAABogMBAAAAAaMDAQAAAAGkAwEAAAABpQMBAAAAAaYDEAAAAAGnA0AAAAABqAMQAAAAAakDAgAAAAGqAxAAAAABqwMQAAAAAQIAAACTBAAgDwAAqgkAIAMAAAByACAPAACqCQAgEAAArgkAICUAAAByACAIAACuCQAgHQAA_gUAICEAAP8FACAqAACBBgAgLQAAgwYAIC4AAIAGACD3AgEA5QUAIfsCQADpBQAh_AJAAOkFACGPAwEA5QUAIZEDAAD4BZEDIpIDAQDlBQAhkwMBAOcFACGUAwEA5wUAIZUDAQDnBQAhlgMgAPkFACGXAwEA5QUAIZgDAQDlBQAhmQMBAOUFACGaAwEA5wUAIZsDAQDlBQAhnQMAAPoFnQMingMBAOcFACGfAwEA5wUAIaADQAD7BQAhoQMgAPkFACGiAwEA5wUAIaMDAQDnBQAhpAMBAOcFACGlAwEA5QUAIaYDEAD8BQAhpwNAAPsFACGoAxAA_AUAIakDAgD9BQAhqgMQAPwFACGrAxAA_AUAISMdAAD-BQAgIQAA_wUAICoAAIEGACAtAACDBgAgLgAAgAYAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIY8DAQDlBQAhkQMAAPgFkQMikgMBAOUFACGTAwEA5wUAIZQDAQDnBQAhlQMBAOcFACGWAyAA-QUAIZcDAQDlBQAhmAMBAOUFACGZAwEA5QUAIZoDAQDnBQAhmwMBAOUFACGdAwAA-gWdAyKeAwEA5wUAIZ8DAQDnBQAhoANAAPsFACGhAyAA-QUAIaIDAQDnBQAhowMBAOcFACGkAwEA5wUAIaUDAQDlBQAhpgMQAPwFACGnA0AA-wUAIagDEAD8BQAhqQMCAP0FACGqAxAA_AUAIasDEAD8BQAhGCMAAOIGACApAAChBgAg9wIBAAAAAfsCQAAAAAH8AkAAAAAB_QIBAAAAAYADAQAAAAGwAxAAAAABsQMQAAAAAbIDEAAAAAGzAxAAAAABtAMBAAAAAbUDAQAAAAG2AwEAAAABuAMAAAC4AwK5A4AAAAABugNAAAAAAbsDQAAAAAG8A0AAAAABvQNAAAAAAb4DQAAAAAG_AwEAAAABwAMBAAAAAcIDAAAAwgMCAgAAAEsAIA8AALcJACADAAAASwAgDwAAtwkAIBAAALYJACABCAAA7gkAMAIAAABLACAIAAC2CQAgAgAAAJgGACAIAAC1CQAgFvcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIf0CAQDlBQAhgAMBAOUFACGwAxAA_AUAIbEDEAD8BQAhsgMQAPwFACGzAxAA_AUAIbQDAQDlBQAhtQMBAOcFACG2AwEA5wUAIbgDAACaBrgDIrkDgAAAAAG6A0AA-wUAIbsDQAD7BQAhvANAAPsFACG9A0AA-wUAIb4DQAD7BQAhvwMBAOcFACHAAwEA5wUAIcIDAACbBsIDIhgjAADgBgAgKQAAngYAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIf0CAQDlBQAhgAMBAOUFACGwAxAA_AUAIbEDEAD8BQAhsgMQAPwFACGzAxAA_AUAIbQDAQDlBQAhtQMBAOcFACG2AwEA5wUAIbgDAACaBrgDIrkDgAAAAAG6A0AA-wUAIbsDQAD7BQAhvANAAPsFACG9A0AA-wUAIb4DQAD7BQAhvwMBAOcFACHAAwEA5wUAIcIDAACbBsIDIhgjAADiBgAgKQAAoQYAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAf0CAQAAAAGAAwEAAAABsAMQAAAAAbEDEAAAAAGyAxAAAAABswMQAAAAAbQDAQAAAAG1AwEAAAABtgMBAAAAAbgDAAAAuAMCuQOAAAAAAboDQAAAAAG7A0AAAAABvANAAAAAAb0DQAAAAAG-A0AAAAABvwMBAAAAAcADAQAAAAHCAwAAAMIDAhwjAACrCAAgKgAA5QYAICsAAOYGACAsAADnBgAgLQAA6AYAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAYADAQAAAAG4AwAAAMoDAr0DQAAAAAHUAwEAAAAB1gMAAADWAwLXAwEAAAAB2AMBAAAAAdkDAQAAAAHaAwEAAAAB2wMBAAAAAdwDAQAAAAHdAwEAAAAB3gMBAAAAAd8DEAAAAAHgAxAAAAAB4QMQAAAAAeIDEAAAAAHjA0AAAAAB5ANAAAAAAeUDQAAAAAECAAAAZQAgDwAAwAkAIAMAAABlACAPAADACQAgEAAAvwkAIAEIAADtCQAwAgAAAGUAIAgAAL8JACACAAAAqgYAIAgAAL4JACAX9wIBAOUFACH7AkAA6QUAIfwCQADpBQAhgAMBAOUFACG4AwAArQbKAyK9A0AA-wUAIdQDAQDlBQAh1gMAAKwG1gMi1wMBAOcFACHYAwEA5wUAIdkDAQDlBQAh2gMBAOcFACHbAwEA5wUAIdwDAQDnBQAh3QMBAOcFACHeAwEA5wUAId8DEAD8BQAh4AMQAPwFACHhAxAA_AUAIeIDEAD8BQAh4wNAAPsFACHkA0AA-wUAIeUDQAD7BQAhHCMAAKoIACAqAACwBgAgKwAAsQYAICwAALIGACAtAACzBgAg9wIBAOUFACH7AkAA6QUAIfwCQADpBQAhgAMBAOUFACG4AwAArQbKAyK9A0AA-wUAIdQDAQDlBQAh1gMAAKwG1gMi1wMBAOcFACHYAwEA5wUAIdkDAQDlBQAh2gMBAOcFACHbAwEA5wUAIdwDAQDnBQAh3QMBAOcFACHeAwEA5wUAId8DEAD8BQAh4AMQAPwFACHhAxAA_AUAIeIDEAD8BQAh4wNAAPsFACHkA0AA-wUAIeUDQAD7BQAhHCMAAKsIACAqAADlBgAgKwAA5gYAICwAAOcGACAtAADoBgAg9wIBAAAAAfsCQAAAAAH8AkAAAAABgAMBAAAAAbgDAAAAygMCvQNAAAAAAdQDAQAAAAHWAwAAANYDAtcDAQAAAAHYAwEAAAAB2QMBAAAAAdoDAQAAAAHbAwEAAAAB3AMBAAAAAd0DAQAAAAHeAwEAAAAB3wMQAAAAAeADEAAAAAHhAxAAAAAB4gMQAAAAAeMDQAAAAAHkA0AAAAAB5QNAAAAAAQweAADfCAAg9wIBAAAAAfsCQAAAAAH8AkAAAAABkgMBAAAAAZcDAQAAAAGZAwEAAAABmgMBAAAAAZsDAQAAAAGCBAEAAAABgwQQAAAAAYQEEAAAAAECAAAAnwIAIA8AAMEJACADAAAAIAAgDwAAwQkAIBAAAMUJACAOAAAAIAAgCAAAxQkAIB4AANYIACD3AgEA5QUAIfsCQADpBQAh_AJAAOkFACGSAwEA5QUAIZcDAQDlBQAhmQMBAOUFACGaAwEA5wUAIZsDAQDlBQAhggQBAOUFACGDBBAA1QgAIYQEEADVCAAhDB4AANYIACD3AgEA5QUAIfsCQADpBQAh_AJAAOkFACGSAwEA5QUAIZcDAQDlBQAhmQMBAOUFACGaAwEA5wUAIZsDAQDlBQAhggQBAOUFACGDBBAA1QgAIYQEEADVCAAhDPcCAQAAAAH7AkAAAAAB_AJAAAAAAYADAQAAAAGMBAEAAAABjQQBAAAAAY4EAQAAAAGPBAEAAAABkARAAAAAAZEEQAAAAAGSBAEAAAABkwQBAAAAAQIAAAAeACAPAADRCQAgAwAAAB4AIA8AANEJACAQAADQCQAgAQgAAOwJADARGgAA8QQAIPQCAADYBQAw9QIAABwAEPYCAADYBQAw9wIBAAAAAfsCQADqBAAh_AJAAOoEACH_AgEA5AQAIYADAQDkBAAhjAQBAOQEACGNBAEA5gQAIY4EAQDmBAAhjwQBAOYEACGQBEAA6QQAIZEEQADpBAAhkgQBAOYEACGTBAEA5gQAIQIAAAAeACAIAADQCQAgAgAAAM4JACAIAADPCQAgEPQCAADNCQAw9QIAAM4JABD2AgAAzQkAMPcCAQDkBAAh-wJAAOoEACH8AkAA6gQAIf8CAQDkBAAhgAMBAOQEACGMBAEA5AQAIY0EAQDmBAAhjgQBAOYEACGPBAEA5gQAIZAEQADpBAAhkQRAAOkEACGSBAEA5gQAIZMEAQDmBAAhEPQCAADNCQAw9QIAAM4JABD2AgAAzQkAMPcCAQDkBAAh-wJAAOoEACH8AkAA6gQAIf8CAQDkBAAhgAMBAOQEACGMBAEA5AQAIY0EAQDmBAAhjgQBAOYEACGPBAEA5gQAIZAEQADpBAAhkQRAAOkEACGSBAEA5gQAIZMEAQDmBAAhDPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIYADAQDlBQAhjAQBAOUFACGNBAEA5wUAIY4EAQDnBQAhjwQBAOcFACGQBEAA-wUAIZEEQAD7BQAhkgQBAOcFACGTBAEA5wUAIQz3AgEA5QUAIfsCQADpBQAh_AJAAOkFACGAAwEA5QUAIYwEAQDlBQAhjQQBAOcFACGOBAEA5wUAIY8EAQDnBQAhkARAAPsFACGRBEAA-wUAIZIEAQDnBQAhkwQBAOcFACEM9wIBAAAAAfsCQAAAAAH8AkAAAAABgAMBAAAAAYwEAQAAAAGNBAEAAAABjgQBAAAAAY8EAQAAAAGQBEAAAAABkQRAAAAAAZIEAQAAAAGTBAEAAAABBA8AAMYJADClBAAAxwkAMKcEAADJCQAgqwQAAMoJADADDwAAwQkAIKUEAADCCQAgqwQAAJ8CACAEDwAAuAkAMKUEAAC5CQAwpwQAALsJACCrBAAApgYAMAQPAACvCQAwpQQAALAJADCnBAAAsgkAIKsEAACUBgAwAw8AAKoJACClBAAAqwkAIKsEAACTBAAgBA8AAKEJADClBAAAogkAMKcEAACkCQAgqwQAAIgGADAEDwAAlQkAMKUEAACWCQAwpwQAAJgJACCrBAAAmQkAMAAFGgAAlAgAIB4AAOEIACCaAwAA3wUAIIMEAADfBQAghAQAAN8FACARGgAAlAgAIB0AAJAIACAhAACRCAAgKgAAkwgAIC0AAJUIACAuAACSCAAgkwMAAN8FACCUAwAA3wUAIJUDAADfBQAgmgMAAN8FACCeAwAA3wUAIJ8DAADfBQAgoAMAAN8FACCiAwAA3wUAIKMDAADfBQAgpAMAAN8FACCnAwAA3wUAIAAAABEcAACUCAAgIwAA2wkAICoAAJMIACArAADdCQAgLAAA3gkAIC0AAJUIACC9AwAA3wUAINcDAADfBQAg2AMAAN8FACDaAwAA3wUAINsDAADfBQAg3AMAAN8FACDdAwAA3wUAIN4DAADfBQAg4wMAAN8FACDkAwAA3wUAIOUDAADfBQAgFCAAAOEJACAiAADiCQAgIwAA2wkAICQAAOMJACAlAADkCQAgJgAA5QkAICcAAOYJACAoAADnCQAgKwAA3QkAIC0AAJUIACDsAwAA3wUAIO4DAADfBQAg7wMAAN8FACDzAwAA3wUAIPYDAADfBQAg9wMAAN8FACD4AwAA3wUAIPkDAADfBQAg_wMAAN8FACCABAAA3wUAIAABIQAAkQgAIAAAAAAAAAAAAagEAAAAogQCDPcCAQAAAAH7AkAAAAAB_AJAAAAAAYADAQAAAAGMBAEAAAABjQQBAAAAAY4EAQAAAAGPBAEAAAABkARAAAAAAZEEQAAAAAGSBAEAAAABkwQBAAAAARf3AgEAAAAB-wJAAAAAAfwCQAAAAAGAAwEAAAABuAMAAADKAwK9A0AAAAAB1AMBAAAAAdYDAAAA1gMC1wMBAAAAAdgDAQAAAAHZAwEAAAAB2gMBAAAAAdsDAQAAAAHcAwEAAAAB3QMBAAAAAd4DAQAAAAHfAxAAAAAB4AMQAAAAAeEDEAAAAAHiAxAAAAAB4wNAAAAAAeQDQAAAAAHlA0AAAAABFvcCAQAAAAH7AkAAAAAB_AJAAAAAAf0CAQAAAAGAAwEAAAABsAMQAAAAAbEDEAAAAAGyAxAAAAABswMQAAAAAbQDAQAAAAG1AwEAAAABtgMBAAAAAbgDAAAAuAMCuQOAAAAAAboDQAAAAAG7A0AAAAABvANAAAAAAb0DQAAAAAG-A0AAAAABvwMBAAAAAcADAQAAAAHCAwAAAMIDAgn3AgEAAAAB-AIIAAAAAfkCAQAAAAH6AgAA7gUAIPsCQAAAAAH8AkAAAAAB_QIBAAAAAf4CAQAAAAGAAwEAAAABB_cCAQAAAAH7AkAAAAAB_AJAAAAAAYsEQAAAAAGUBAEAAAABlQQBAAAAAZYEAQAAAAETGwAA0gkAICoAANUJACAtAADXCQAgLgAA1AkAIC8AANMJACAwAADWCQAg9wIBAAAAAfsCQAAAAAH8AkAAAAABkgMBAAAAAbgDAAAAnAQC5gMBAAAAAZcEAQAAAAGYBCAAAAABmQQBAAAAAZoEAAAAzQMCnAQgAAAAAZ0EIAAAAAGeBEAAAAABAgAAABoAIA8AAPEJACADAAAAfwAgDwAA8QkAIBAAAPUJACAVAAAAfwAgCAAA9QkAIBsAAI4JACAqAACRCQAgLQAAkwkAIC4AAJAJACAvAACPCQAgMAAAkgkAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIZIDAQDnBQAhuAMAAI0JnAQi5gMBAOUFACGXBAEA5QUAIZgEIAD5BQAhmQQBAOcFACGaBAAAjAnNAyKcBCAA-QUAIZ0EIAD5BQAhngRAAPsFACETGwAAjgkAICoAAJEJACAtAACTCQAgLgAAkAkAIC8AAI8JACAwAACSCQAg9wIBAOUFACH7AkAA6QUAIfwCQADpBQAhkgMBAOcFACG4AwAAjQmcBCLmAwEA5QUAIZcEAQDlBQAhmAQgAPkFACGZBAEA5wUAIZoEAACMCc0DIpwEIAD5BQAhnQQgAPkFACGeBEAA-wUAIRMqAADVCQAgLQAA1wkAIC4AANQJACAvAADTCQAgMAAA1gkAIDEAANgJACD3AgEAAAAB-wJAAAAAAfwCQAAAAAGSAwEAAAABuAMAAACcBALmAwEAAAABlwQBAAAAAZgEIAAAAAGZBAEAAAABmgQAAADNAwKcBCAAAAABnQQgAAAAAZ4EQAAAAAECAAAAGgAgDwAA9gkAIAMAAAB_ACAPAAD2CQAgEAAA-gkAIBUAAAB_ACAIAAD6CQAgKgAAkQkAIC0AAJMJACAuAACQCQAgLwAAjwkAIDAAAJIJACAxAACUCQAg9wIBAOUFACH7AkAA6QUAIfwCQADpBQAhkgMBAOcFACG4AwAAjQmcBCLmAwEA5QUAIZcEAQDlBQAhmAQgAPkFACGZBAEA5wUAIZoEAACMCc0DIpwEIAD5BQAhnQQgAPkFACGeBEAA-wUAIRMqAACRCQAgLQAAkwkAIC4AAJAJACAvAACPCQAgMAAAkgkAIDEAAJQJACD3AgEA5QUAIfsCQADpBQAh_AJAAOkFACGSAwEA5wUAIbgDAACNCZwEIuYDAQDlBQAhlwQBAOUFACGYBCAA-QUAIZkEAQDnBQAhmgQAAIwJzQMinAQgAPkFACGdBCAA-QUAIZ4EQAD7BQAhHPcCAQAAAAH7AkAAAAAB_AJAAAAAAYADAQAAAAGhAyAAAAAB4AMCAAAAAeYDAQAAAAHsAwEAAAAB7QMBAAAAAe4DAQAAAAHvAwEAAAAB8AMBAAAAAfEDAADiBwAg8gMCAAAAAfMDAgAAAAH0AwAA4wcAIPUDAADkBwAg9gMCAAAAAfcDCAAAAAH4AwgAAAAB-QMIAAAAAfoDIAAAAAH7AwIAAAAB_AMgAAAAAf0DIAAAAAH-AwAA5QcAIP8DQAAAAAGABEAAAAABExsAANIJACAqAADVCQAgLQAA1wkAIC4AANQJACAwAADWCQAgMQAA2AkAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAZIDAQAAAAG4AwAAAJwEAuYDAQAAAAGXBAEAAAABmAQgAAAAAZkEAQAAAAGaBAAAAM0DApwEIAAAAAGdBCAAAAABngRAAAAAAQIAAAAaACAPAAD8CQAgJBoAAI4IACAhAACLCAAgKgAAjQgAIC0AAI8IACAuAACMCAAg9wIBAAAAAfsCQAAAAAH8AkAAAAAB_wIBAAAAAY8DAQAAAAGRAwAAAJEDApIDAQAAAAGTAwEAAAABlAMBAAAAAZUDAQAAAAGWAyAAAAABlwMBAAAAAZgDAQAAAAGZAwEAAAABmgMBAAAAAZsDAQAAAAGdAwAAAJ0DAp4DAQAAAAGfAwEAAAABoANAAAAAAaEDIAAAAAGiAwEAAAABowMBAAAAAaQDAQAAAAGlAwEAAAABpgMQAAAAAacDQAAAAAGoAxAAAAABqQMCAAAAAaoDEAAAAAGrAxAAAAABAgAAAJMEACAPAAD-CQAgAwAAAHIAIA8AAP4JACAQAACCCgAgJgAAAHIAIAgAAIIKACAaAACCBgAgIQAA_wUAICoAAIEGACAtAACDBgAgLgAAgAYAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIf8CAQDlBQAhjwMBAOUFACGRAwAA-AWRAyKSAwEA5QUAIZMDAQDnBQAhlAMBAOcFACGVAwEA5wUAIZYDIAD5BQAhlwMBAOUFACGYAwEA5QUAIZkDAQDlBQAhmgMBAOcFACGbAwEA5QUAIZ0DAAD6BZ0DIp4DAQDnBQAhnwMBAOcFACGgA0AA-wUAIaEDIAD5BQAhogMBAOcFACGjAwEA5wUAIaQDAQDnBQAhpQMBAOUFACGmAxAA_AUAIacDQAD7BQAhqAMQAPwFACGpAwIA_QUAIaoDEAD8BQAhqwMQAPwFACEkGgAAggYAICEAAP8FACAqAACBBgAgLQAAgwYAIC4AAIAGACD3AgEA5QUAIfsCQADpBQAh_AJAAOkFACH_AgEA5QUAIY8DAQDlBQAhkQMAAPgFkQMikgMBAOUFACGTAwEA5wUAIZQDAQDnBQAhlQMBAOcFACGWAyAA-QUAIZcDAQDlBQAhmAMBAOUFACGZAwEA5QUAIZoDAQDnBQAhmwMBAOUFACGdAwAA-gWdAyKeAwEA5wUAIZ8DAQDnBQAhoANAAPsFACGhAyAA-QUAIaIDAQDnBQAhowMBAOcFACGkAwEA5wUAIaUDAQDlBQAhpgMQAPwFACGnA0AA-wUAIagDEAD8BQAhqQMCAP0FACGqAxAA_AUAIasDEAD8BQAhAwAAAH8AIA8AAPwJACAQAACFCgAgFQAAAH8AIAgAAIUKACAbAACOCQAgKgAAkQkAIC0AAJMJACAuAACQCQAgMAAAkgkAIDEAAJQJACD3AgEA5QUAIfsCQADpBQAh_AJAAOkFACGSAwEA5wUAIbgDAACNCZwEIuYDAQDlBQAhlwQBAOUFACGYBCAA-QUAIZkEAQDnBQAhmgQAAIwJzQMinAQgAPkFACGdBCAA-QUAIZ4EQAD7BQAhExsAAI4JACAqAACRCQAgLQAAkwkAIC4AAJAJACAwAACSCQAgMQAAlAkAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIZIDAQDnBQAhuAMAAI0JnAQi5gMBAOUFACGXBAEA5QUAIZgEIAD5BQAhmQQBAOcFACGaBAAAjAnNAyKcBCAA-QUAIZ0EIAD5BQAhngRAAPsFACEkGgAAjggAIB0AAIoIACAqAACNCAAgLQAAjwgAIC4AAIwIACD3AgEAAAAB-wJAAAAAAfwCQAAAAAH_AgEAAAABjwMBAAAAAZEDAAAAkQMCkgMBAAAAAZMDAQAAAAGUAwEAAAABlQMBAAAAAZYDIAAAAAGXAwEAAAABmAMBAAAAAZkDAQAAAAGaAwEAAAABmwMBAAAAAZ0DAAAAnQMCngMBAAAAAZ8DAQAAAAGgA0AAAAABoQMgAAAAAaIDAQAAAAGjAwEAAAABpAMBAAAAAaUDAQAAAAGmAxAAAAABpwNAAAAAAagDEAAAAAGpAwIAAAABqgMQAAAAAasDEAAAAAECAAAAkwQAIA8AAIYKACADAAAAcgAgDwAAhgoAIBAAAIoKACAmAAAAcgAgCAAAigoAIBoAAIIGACAdAAD-BQAgKgAAgQYAIC0AAIMGACAuAACABgAg9wIBAOUFACH7AkAA6QUAIfwCQADpBQAh_wIBAOUFACGPAwEA5QUAIZEDAAD4BZEDIpIDAQDlBQAhkwMBAOcFACGUAwEA5wUAIZUDAQDnBQAhlgMgAPkFACGXAwEA5QUAIZgDAQDlBQAhmQMBAOUFACGaAwEA5wUAIZsDAQDlBQAhnQMAAPoFnQMingMBAOcFACGfAwEA5wUAIaADQAD7BQAhoQMgAPkFACGiAwEA5wUAIaMDAQDnBQAhpAMBAOcFACGlAwEA5QUAIaYDEAD8BQAhpwNAAPsFACGoAxAA_AUAIakDAgD9BQAhqgMQAPwFACGrAxAA_AUAISQaAACCBgAgHQAA_gUAICoAAIEGACAtAACDBgAgLgAAgAYAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIf8CAQDlBQAhjwMBAOUFACGRAwAA-AWRAyKSAwEA5QUAIZMDAQDnBQAhlAMBAOcFACGVAwEA5wUAIZYDIAD5BQAhlwMBAOUFACGYAwEA5QUAIZkDAQDlBQAhmgMBAOcFACGbAwEA5QUAIZ0DAAD6BZ0DIp4DAQDnBQAhnwMBAOcFACGgA0AA-wUAIaEDIAD5BQAhogMBAOcFACGjAwEA5wUAIaQDAQDnBQAhpQMBAOUFACGmAxAA_AUAIacDQAD7BQAhqAMQAPwFACGpAwIA_QUAIaoDEAD8BQAhqwMQAPwFACEmIAAA5gcAICIAAOcHACAjAADPCAAgJAAA6AcAICUAAOkHACAmAADqBwAgKAAA7AcAICsAAO4HACAtAADtBwAg9wIBAAAAAfsCQAAAAAH8AkAAAAABgAMBAAAAAaEDIAAAAAHgAwIAAAAB5gMBAAAAAesDAQAAAAHsAwEAAAAB7QMBAAAAAe4DAQAAAAHvAwEAAAAB8AMBAAAAAfEDAADiBwAg8gMCAAAAAfMDAgAAAAH0AwAA4wcAIPUDAADkBwAg9gMCAAAAAfcDCAAAAAH4AwgAAAAB-QMIAAAAAfoDIAAAAAH7AwIAAAAB_AMgAAAAAf0DIAAAAAH-AwAA5QcAIP8DQAAAAAGABEAAAAABAgAAACkAIA8AAIsKACADAAAAJwAgDwAAiwoAIBAAAI8KACAoAAAAJwAgCAAAjwoAICAAAPoGACAiAAD7BgAgIwAAzggAICQAAPwGACAlAAD9BgAgJgAA_gYAICgAAIAHACArAACCBwAgLQAAgQcAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIYADAQDlBQAhoQMgAPkFACHgAwIA_QUAIeYDAQDlBQAh6wMBAOUFACHsAwEA5wUAIe0DAQDlBQAh7gMBAOcFACHvAwEA5wUAIfADAQDlBQAh8QMAAPMGACDyAwIA_QUAIfMDAgD0BgAh9AMAAPUGACD1AwAA9gYAIPYDAgD0BgAh9wMIAPcGACH4AwgA9wYAIfkDCAD3BgAh-gMgAPkFACH7AwIA_QUAIfwDIAD5BQAh_QMgAPkFACH-AwAA-AYAIP8DQAD7BQAhgARAAPsFACEmIAAA-gYAICIAAPsGACAjAADOCAAgJAAA_AYAICUAAP0GACAmAAD-BgAgKAAAgAcAICsAAIIHACAtAACBBwAg9wIBAOUFACH7AkAA6QUAIfwCQADpBQAhgAMBAOUFACGhAyAA-QUAIeADAgD9BQAh5gMBAOUFACHrAwEA5QUAIewDAQDnBQAh7QMBAOUFACHuAwEA5wUAIe8DAQDnBQAh8AMBAOUFACHxAwAA8wYAIPIDAgD9BQAh8wMCAPQGACH0AwAA9QYAIPUDAAD2BgAg9gMCAPQGACH3AwgA9wYAIfgDCAD3BgAh-QMIAPcGACH6AyAA-QUAIfsDAgD9BQAh_AMgAPkFACH9AyAA-QUAIf4DAAD4BgAg_wNAAPsFACGABEAA-wUAISYgAADmBwAgIgAA5wcAICMAAM8IACAkAADoBwAgJQAA6QcAICYAAOoHACAnAADrBwAgKwAA7gcAIC0AAO0HACD3AgEAAAAB-wJAAAAAAfwCQAAAAAGAAwEAAAABoQMgAAAAAeADAgAAAAHmAwEAAAAB6wMBAAAAAewDAQAAAAHtAwEAAAAB7gMBAAAAAe8DAQAAAAHwAwEAAAAB8QMAAOIHACDyAwIAAAAB8wMCAAAAAfQDAADjBwAg9QMAAOQHACD2AwIAAAAB9wMIAAAAAfgDCAAAAAH5AwgAAAAB-gMgAAAAAfsDAgAAAAH8AyAAAAAB_QMgAAAAAf4DAADlBwAg_wNAAAAAAYAEQAAAAAECAAAAKQAgDwAAkAoAIAMAAAAnACAPAACQCgAgEAAAlAoAICgAAAAnACAIAACUCgAgIAAA-gYAICIAAPsGACAjAADOCAAgJAAA_AYAICUAAP0GACAmAAD-BgAgJwAA_wYAICsAAIIHACAtAACBBwAg9wIBAOUFACH7AkAA6QUAIfwCQADpBQAhgAMBAOUFACGhAyAA-QUAIeADAgD9BQAh5gMBAOUFACHrAwEA5QUAIewDAQDnBQAh7QMBAOUFACHuAwEA5wUAIe8DAQDnBQAh8AMBAOUFACHxAwAA8wYAIPIDAgD9BQAh8wMCAPQGACH0AwAA9QYAIPUDAAD2BgAg9gMCAPQGACH3AwgA9wYAIfgDCAD3BgAh-QMIAPcGACH6AyAA-QUAIfsDAgD9BQAh_AMgAPkFACH9AyAA-QUAIf4DAAD4BgAg_wNAAPsFACGABEAA-wUAISYgAAD6BgAgIgAA-wYAICMAAM4IACAkAAD8BgAgJQAA_QYAICYAAP4GACAnAAD_BgAgKwAAggcAIC0AAIEHACD3AgEA5QUAIfsCQADpBQAh_AJAAOkFACGAAwEA5QUAIaEDIAD5BQAh4AMCAP0FACHmAwEA5QUAIesDAQDlBQAh7AMBAOcFACHtAwEA5QUAIe4DAQDnBQAh7wMBAOcFACHwAwEA5QUAIfEDAADzBgAg8gMCAP0FACHzAwIA9AYAIfQDAAD1BgAg9QMAAPYGACD2AwIA9AYAIfcDCAD3BgAh-AMIAPcGACH5AwgA9wYAIfoDIAD5BQAh-wMCAP0FACH8AyAA-QUAIf0DIAD5BQAh_gMAAPgGACD_A0AA-wUAIYAEQAD7BQAhJiAAAOYHACAiAADnBwAgIwAAzwgAICUAAOkHACAmAADqBwAgJwAA6wcAICgAAOwHACArAADuBwAgLQAA7QcAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAYADAQAAAAGhAyAAAAAB4AMCAAAAAeYDAQAAAAHrAwEAAAAB7AMBAAAAAe0DAQAAAAHuAwEAAAAB7wMBAAAAAfADAQAAAAHxAwAA4gcAIPIDAgAAAAHzAwIAAAAB9AMAAOMHACD1AwAA5AcAIPYDAgAAAAH3AwgAAAAB-AMIAAAAAfkDCAAAAAH6AyAAAAAB-wMCAAAAAfwDIAAAAAH9AyAAAAAB_gMAAOUHACD_A0AAAAABgARAAAAAAQIAAAApACAPAACVCgAgAwAAACcAIA8AAJUKACAQAACZCgAgKAAAACcAIAgAAJkKACAgAAD6BgAgIgAA-wYAICMAAM4IACAlAAD9BgAgJgAA_gYAICcAAP8GACAoAACABwAgKwAAggcAIC0AAIEHACD3AgEA5QUAIfsCQADpBQAh_AJAAOkFACGAAwEA5QUAIaEDIAD5BQAh4AMCAP0FACHmAwEA5QUAIesDAQDlBQAh7AMBAOcFACHtAwEA5QUAIe4DAQDnBQAh7wMBAOcFACHwAwEA5QUAIfEDAADzBgAg8gMCAP0FACHzAwIA9AYAIfQDAAD1BgAg9QMAAPYGACD2AwIA9AYAIfcDCAD3BgAh-AMIAPcGACH5AwgA9wYAIfoDIAD5BQAh-wMCAP0FACH8AyAA-QUAIf0DIAD5BQAh_gMAAPgGACD_A0AA-wUAIYAEQAD7BQAhJiAAAPoGACAiAAD7BgAgIwAAzggAICUAAP0GACAmAAD-BgAgJwAA_wYAICgAAIAHACArAACCBwAgLQAAgQcAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIYADAQDlBQAhoQMgAPkFACHgAwIA_QUAIeYDAQDlBQAh6wMBAOUFACHsAwEA5wUAIe0DAQDlBQAh7gMBAOcFACHvAwEA5wUAIfADAQDlBQAh8QMAAPMGACDyAwIA_QUAIfMDAgD0BgAh9AMAAPUGACD1AwAA9gYAIPYDAgD0BgAh9wMIAPcGACH4AwgA9wYAIfkDCAD3BgAh-gMgAPkFACH7AwIA_QUAIfwDIAD5BQAh_QMgAPkFACH-AwAA-AYAIP8DQAD7BQAhgARAAPsFACEmIAAA5gcAICIAAOcHACAjAADPCAAgJAAA6AcAICUAAOkHACAnAADrBwAgKAAA7AcAICsAAO4HACAtAADtBwAg9wIBAAAAAfsCQAAAAAH8AkAAAAABgAMBAAAAAaEDIAAAAAHgAwIAAAAB5gMBAAAAAesDAQAAAAHsAwEAAAAB7QMBAAAAAe4DAQAAAAHvAwEAAAAB8AMBAAAAAfEDAADiBwAg8gMCAAAAAfMDAgAAAAH0AwAA4wcAIPUDAADkBwAg9gMCAAAAAfcDCAAAAAH4AwgAAAAB-QMIAAAAAfoDIAAAAAH7AwIAAAAB_AMgAAAAAf0DIAAAAAH-AwAA5QcAIP8DQAAAAAGABEAAAAABAgAAACkAIA8AAJoKACADAAAAJwAgDwAAmgoAIBAAAJ4KACAoAAAAJwAgCAAAngoAICAAAPoGACAiAAD7BgAgIwAAzggAICQAAPwGACAlAAD9BgAgJwAA_wYAICgAAIAHACArAACCBwAgLQAAgQcAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIYADAQDlBQAhoQMgAPkFACHgAwIA_QUAIeYDAQDlBQAh6wMBAOUFACHsAwEA5wUAIe0DAQDlBQAh7gMBAOcFACHvAwEA5wUAIfADAQDlBQAh8QMAAPMGACDyAwIA_QUAIfMDAgD0BgAh9AMAAPUGACD1AwAA9gYAIPYDAgD0BgAh9wMIAPcGACH4AwgA9wYAIfkDCAD3BgAh-gMgAPkFACH7AwIA_QUAIfwDIAD5BQAh_QMgAPkFACH-AwAA-AYAIP8DQAD7BQAhgARAAPsFACEmIAAA-gYAICIAAPsGACAjAADOCAAgJAAA_AYAICUAAP0GACAnAAD_BgAgKAAAgAcAICsAAIIHACAtAACBBwAg9wIBAOUFACH7AkAA6QUAIfwCQADpBQAhgAMBAOUFACGhAyAA-QUAIeADAgD9BQAh5gMBAOUFACHrAwEA5QUAIewDAQDnBQAh7QMBAOUFACHuAwEA5wUAIe8DAQDnBQAh8AMBAOUFACHxAwAA8wYAIPIDAgD9BQAh8wMCAPQGACH0AwAA9QYAIPUDAAD2BgAg9gMCAPQGACH3AwgA9wYAIfgDCAD3BgAh-QMIAPcGACH6AyAA-QUAIfsDAgD9BQAh_AMgAPkFACH9AyAA-QUAIf4DAAD4BgAg_wNAAPsFACGABEAA-wUAISYgAADmBwAgIgAA5wcAICMAAM8IACAkAADoBwAgJgAA6gcAICcAAOsHACAoAADsBwAgKwAA7gcAIC0AAO0HACD3AgEAAAAB-wJAAAAAAfwCQAAAAAGAAwEAAAABoQMgAAAAAeADAgAAAAHmAwEAAAAB6wMBAAAAAewDAQAAAAHtAwEAAAAB7gMBAAAAAe8DAQAAAAHwAwEAAAAB8QMAAOIHACDyAwIAAAAB8wMCAAAAAfQDAADjBwAg9QMAAOQHACD2AwIAAAAB9wMIAAAAAfgDCAAAAAH5AwgAAAAB-gMgAAAAAfsDAgAAAAH8AyAAAAAB_QMgAAAAAf4DAADlBwAg_wNAAAAAAYAEQAAAAAECAAAAKQAgDwAAnwoAIAMAAAAnACAPAACfCgAgEAAAowoAICgAAAAnACAIAACjCgAgIAAA-gYAICIAAPsGACAjAADOCAAgJAAA_AYAICYAAP4GACAnAAD_BgAgKAAAgAcAICsAAIIHACAtAACBBwAg9wIBAOUFACH7AkAA6QUAIfwCQADpBQAhgAMBAOUFACGhAyAA-QUAIeADAgD9BQAh5gMBAOUFACHrAwEA5QUAIewDAQDnBQAh7QMBAOUFACHuAwEA5wUAIe8DAQDnBQAh8AMBAOUFACHxAwAA8wYAIPIDAgD9BQAh8wMCAPQGACH0AwAA9QYAIPUDAAD2BgAg9gMCAPQGACH3AwgA9wYAIfgDCAD3BgAh-QMIAPcGACH6AyAA-QUAIfsDAgD9BQAh_AMgAPkFACH9AyAA-QUAIf4DAAD4BgAg_wNAAPsFACGABEAA-wUAISYgAAD6BgAgIgAA-wYAICMAAM4IACAkAAD8BgAgJgAA_gYAICcAAP8GACAoAACABwAgKwAAggcAIC0AAIEHACD3AgEA5QUAIfsCQADpBQAh_AJAAOkFACGAAwEA5QUAIaEDIAD5BQAh4AMCAP0FACHmAwEA5QUAIesDAQDlBQAh7AMBAOcFACHtAwEA5QUAIe4DAQDnBQAh7wMBAOcFACHwAwEA5QUAIfEDAADzBgAg8gMCAP0FACHzAwIA9AYAIfQDAAD1BgAg9QMAAPYGACD2AwIA9AYAIfcDCAD3BgAh-AMIAPcGACH5AwgA9wYAIfoDIAD5BQAh-wMCAP0FACH8AyAA-QUAIf0DIAD5BQAh_gMAAPgGACD_A0AA-wUAIYAEQAD7BQAhJBoAAI4IACAdAACKCAAgIQAAiwgAICoAAI0IACAtAACPCAAg9wIBAAAAAfsCQAAAAAH8AkAAAAAB_wIBAAAAAY8DAQAAAAGRAwAAAJEDApIDAQAAAAGTAwEAAAABlAMBAAAAAZUDAQAAAAGWAyAAAAABlwMBAAAAAZgDAQAAAAGZAwEAAAABmgMBAAAAAZsDAQAAAAGdAwAAAJ0DAp4DAQAAAAGfAwEAAAABoANAAAAAAaEDIAAAAAGiAwEAAAABowMBAAAAAaQDAQAAAAGlAwEAAAABpgMQAAAAAacDQAAAAAGoAxAAAAABqQMCAAAAAaoDEAAAAAGrAxAAAAABAgAAAJMEACAPAACkCgAgAwAAAHIAIA8AAKQKACAQAACoCgAgJgAAAHIAIAgAAKgKACAaAACCBgAgHQAA_gUAICEAAP8FACAqAACBBgAgLQAAgwYAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIf8CAQDlBQAhjwMBAOUFACGRAwAA-AWRAyKSAwEA5QUAIZMDAQDnBQAhlAMBAOcFACGVAwEA5wUAIZYDIAD5BQAhlwMBAOUFACGYAwEA5QUAIZkDAQDlBQAhmgMBAOcFACGbAwEA5QUAIZ0DAAD6BZ0DIp4DAQDnBQAhnwMBAOcFACGgA0AA-wUAIaEDIAD5BQAhogMBAOcFACGjAwEA5wUAIaQDAQDnBQAhpQMBAOUFACGmAxAA_AUAIacDQAD7BQAhqAMQAPwFACGpAwIA_QUAIaoDEAD8BQAhqwMQAPwFACEkGgAAggYAIB0AAP4FACAhAAD_BQAgKgAAgQYAIC0AAIMGACD3AgEA5QUAIfsCQADpBQAh_AJAAOkFACH_AgEA5QUAIY8DAQDlBQAhkQMAAPgFkQMikgMBAOUFACGTAwEA5wUAIZQDAQDnBQAhlQMBAOcFACGWAyAA-QUAIZcDAQDlBQAhmAMBAOUFACGZAwEA5QUAIZoDAQDnBQAhmwMBAOUFACGdAwAA-gWdAyKeAwEA5wUAIZ8DAQDnBQAhoANAAPsFACGhAyAA-QUAIaIDAQDnBQAhowMBAOcFACGkAwEA5wUAIaUDAQDlBQAhpgMQAPwFACGnA0AA-wUAIagDEAD8BQAhqQMCAP0FACGqAxAA_AUAIasDEAD8BQAhHRwAAOQGACAjAACrCAAgKgAA5QYAICsAAOYGACAtAADoBgAg9wIBAAAAAfsCQAAAAAH8AkAAAAABgAMBAAAAAa8DAQAAAAG4AwAAAMoDAr0DQAAAAAHUAwEAAAAB1gMAAADWAwLXAwEAAAAB2AMBAAAAAdkDAQAAAAHaAwEAAAAB2wMBAAAAAdwDAQAAAAHdAwEAAAAB3gMBAAAAAd8DEAAAAAHgAxAAAAAB4QMQAAAAAeIDEAAAAAHjA0AAAAAB5ANAAAAAAeUDQAAAAAECAAAAZQAgDwAAqQoAIAMAAABjACAPAACpCgAgEAAArQoAIB8AAABjACAIAACtCgAgHAAArwYAICMAAKoIACAqAACwBgAgKwAAsQYAIC0AALMGACD3AgEA5QUAIfsCQADpBQAh_AJAAOkFACGAAwEA5QUAIa8DAQDlBQAhuAMAAK0GygMivQNAAPsFACHUAwEA5QUAIdYDAACsBtYDItcDAQDnBQAh2AMBAOcFACHZAwEA5QUAIdoDAQDnBQAh2wMBAOcFACHcAwEA5wUAId0DAQDnBQAh3gMBAOcFACHfAxAA_AUAIeADEAD8BQAh4QMQAPwFACHiAxAA_AUAIeMDQAD7BQAh5ANAAPsFACHlA0AA-wUAIR0cAACvBgAgIwAAqggAICoAALAGACArAACxBgAgLQAAswYAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIYADAQDlBQAhrwMBAOUFACG4AwAArQbKAyK9A0AA-wUAIdQDAQDlBQAh1gMAAKwG1gMi1wMBAOcFACHYAwEA5wUAIdkDAQDlBQAh2gMBAOcFACHbAwEA5wUAIdwDAQDnBQAh3QMBAOcFACHeAwEA5wUAId8DEAD8BQAh4AMQAPwFACHhAxAA_AUAIeIDEAD8BQAh4wNAAPsFACHkA0AA-wUAIeUDQAD7BQAhExsAANIJACAqAADVCQAgLQAA1wkAIC4AANQJACAvAADTCQAgMQAA2AkAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAZIDAQAAAAG4AwAAAJwEAuYDAQAAAAGXBAEAAAABmAQgAAAAAZkEAQAAAAGaBAAAAM0DApwEIAAAAAGdBCAAAAABngRAAAAAAQIAAAAaACAPAACuCgAgDRoAAOAIACD3AgEAAAAB-wJAAAAAAfwCQAAAAAH_AgEAAAABkgMBAAAAAZcDAQAAAAGZAwEAAAABmgMBAAAAAZsDAQAAAAGCBAEAAAABgwQQAAAAAYQEEAAAAAECAAAAnwIAIA8AALAKACAmIgAA5wcAICMAAM8IACAkAADoBwAgJQAA6QcAICYAAOoHACAnAADrBwAgKAAA7AcAICsAAO4HACAtAADtBwAg9wIBAAAAAfsCQAAAAAH8AkAAAAABgAMBAAAAAaEDIAAAAAHgAwIAAAAB5gMBAAAAAesDAQAAAAHsAwEAAAAB7QMBAAAAAe4DAQAAAAHvAwEAAAAB8AMBAAAAAfEDAADiBwAg8gMCAAAAAfMDAgAAAAH0AwAA4wcAIPUDAADkBwAg9gMCAAAAAfcDCAAAAAH4AwgAAAAB-QMIAAAAAfoDIAAAAAH7AwIAAAAB_AMgAAAAAf0DIAAAAAH-AwAA5QcAIP8DQAAAAAGABEAAAAABAgAAACkAIA8AALIKACADAAAAJwAgDwAAsgoAIBAAALYKACAoAAAAJwAgCAAAtgoAICIAAPsGACAjAADOCAAgJAAA_AYAICUAAP0GACAmAAD-BgAgJwAA_wYAICgAAIAHACArAACCBwAgLQAAgQcAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIYADAQDlBQAhoQMgAPkFACHgAwIA_QUAIeYDAQDlBQAh6wMBAOUFACHsAwEA5wUAIe0DAQDlBQAh7gMBAOcFACHvAwEA5wUAIfADAQDlBQAh8QMAAPMGACDyAwIA_QUAIfMDAgD0BgAh9AMAAPUGACD1AwAA9gYAIPYDAgD0BgAh9wMIAPcGACH4AwgA9wYAIfkDCAD3BgAh-gMgAPkFACH7AwIA_QUAIfwDIAD5BQAh_QMgAPkFACH-AwAA-AYAIP8DQAD7BQAhgARAAPsFACEmIgAA-wYAICMAAM4IACAkAAD8BgAgJQAA_QYAICYAAP4GACAnAAD_BgAgKAAAgAcAICsAAIIHACAtAACBBwAg9wIBAOUFACH7AkAA6QUAIfwCQADpBQAhgAMBAOUFACGhAyAA-QUAIeADAgD9BQAh5gMBAOUFACHrAwEA5QUAIewDAQDnBQAh7QMBAOUFACHuAwEA5wUAIe8DAQDnBQAh8AMBAOUFACHxAwAA8wYAIPIDAgD9BQAh8wMCAPQGACH0AwAA9QYAIPUDAAD2BgAg9gMCAPQGACH3AwgA9wYAIfgDCAD3BgAh-QMIAPcGACH6AyAA-QUAIfsDAgD9BQAh_AMgAPkFACH9AyAA-QUAIf4DAAD4BgAg_wNAAPsFACGABEAA-wUAIQj3AgEAAAAB-wJAAAAAAfwCQAAAAAH-AgEAAAAB0QMCAAAAAdIDEAAAAAHTAxAAAAABiAQQAAAAAQMAAAAgACAPAACwCgAgEAAAugoAIA8AAAAgACAIAAC6CgAgGgAA1wgAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIf8CAQDlBQAhkgMBAOUFACGXAwEA5QUAIZkDAQDlBQAhmgMBAOcFACGbAwEA5QUAIYIEAQDlBQAhgwQQANUIACGEBBAA1QgAIQ0aAADXCAAg9wIBAOUFACH7AkAA6QUAIfwCQADpBQAh_wIBAOUFACGSAwEA5QUAIZcDAQDlBQAhmQMBAOUFACGaAwEA5wUAIZsDAQDlBQAhggQBAOUFACGDBBAA1QgAIYQEEADVCAAhCPcCAQAAAAH7AkAAAAAB_AJAAAAAAa8DAQAAAAHfAxAAAAAB4AMQAAAAAeEDEAAAAAHiAxAAAAABCPcCAQAAAAH7AkAAAAAB_AJAAAAAAZQDAQAAAAGhAyAAAAAB5gMBAAAAAYUEAQAAAAGGBAIAAAABAgAAAIYCACAPAAC8CgAgCxwAAIgIACAjAADeCAAg9wIBAAAAAfsCQAAAAAH8AkAAAAABgAMBAAAAAa8DAQAAAAHfAxAAAAAB4AMQAAAAAeEDEAAAAAHiAxAAAAABAgAAACUAIA8AAL4KACADAAAAIgAgDwAAvgoAIBAAAMIKACANAAAAIgAgCAAAwgoAIBwAAPoHACAjAADdCAAg9wIBAOUFACH7AkAA6QUAIfwCQADpBQAhgAMBAOUFACGvAwEA5QUAId8DEAD8BQAh4AMQAPwFACHhAxAA_AUAIeIDEAD8BQAhCxwAAPoHACAjAADdCAAg9wIBAOUFACH7AkAA6QUAIfwCQADpBQAhgAMBAOUFACGvAwEA5QUAId8DEAD8BQAh4AMQAPwFACHhAxAA_AUAIeIDEAD8BQAhCPcCAQAAAAH7AkAAAAAB_AJAAAAAAdEDAgAAAAHSAxAAAAAB0wMQAAAAAYcEAQAAAAGIBBAAAAABA_cCAQAAAAHmAwEAAAAB5wMCAAAAAQL3AgEAAAAB5gMBAAAAAQL3AgEAAAAB5gMBAAAAAQT3AgEAAAAB5gMBAAAAAekDIAAAAAHqAwIAAAABA_cCAQAAAAHoAwEAAAAB6QMgAAAAAQn3AgEAAAAB-AIIAAAAAfkCAQAAAAH6AgAA7gUAIPsCQAAAAAH8AkAAAAAB_QIBAAAAAf8CAQAAAAGAAwEAAAABHRwAAOQGACAjAACrCAAgKgAA5QYAICwAAOcGACAtAADoBgAg9wIBAAAAAfsCQAAAAAH8AkAAAAABgAMBAAAAAa8DAQAAAAG4AwAAAMoDAr0DQAAAAAHUAwEAAAAB1gMAAADWAwLXAwEAAAAB2AMBAAAAAdkDAQAAAAHaAwEAAAAB2wMBAAAAAdwDAQAAAAHdAwEAAAAB3gMBAAAAAd8DEAAAAAHgAxAAAAAB4QMQAAAAAeIDEAAAAAHjA0AAAAAB5ANAAAAAAeUDQAAAAAECAAAAZQAgDwAAygoAIAMAAABjACAPAADKCgAgEAAAzgoAIB8AAABjACAIAADOCgAgHAAArwYAICMAAKoIACAqAACwBgAgLAAAsgYAIC0AALMGACD3AgEA5QUAIfsCQADpBQAh_AJAAOkFACGAAwEA5QUAIa8DAQDlBQAhuAMAAK0GygMivQNAAPsFACHUAwEA5QUAIdYDAACsBtYDItcDAQDnBQAh2AMBAOcFACHZAwEA5QUAIdoDAQDnBQAh2wMBAOcFACHcAwEA5wUAId0DAQDnBQAh3gMBAOcFACHfAxAA_AUAIeADEAD8BQAh4QMQAPwFACHiAxAA_AUAIeMDQAD7BQAh5ANAAPsFACHlA0AA-wUAIR0cAACvBgAgIwAAqggAICoAALAGACAsAACyBgAgLQAAswYAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIYADAQDlBQAhrwMBAOUFACG4AwAArQbKAyK9A0AA-wUAIdQDAQDlBQAh1gMAAKwG1gMi1wMBAOcFACHYAwEA5wUAIdkDAQDlBQAh2gMBAOcFACHbAwEA5wUAIdwDAQDnBQAh3QMBAOcFACHeAwEA5wUAId8DEAD8BQAh4AMQAPwFACHhAxAA_AUAIeIDEAD8BQAh4wNAAPsFACHkA0AA-wUAIeUDQAD7BQAhCfcCAQAAAAH7AkAAAAAB_QIBAAAAAc4DAQAAAAHPAwEAAAAB0AMBAAAAAdEDAgAAAAHSAxAAAAAB0wMQAAAAAQMAAACJAgAgDwAAvAoAIBAAANIKACAKAAAAiQIAIAgAANIKACD3AgEA5QUAIfsCQADpBQAh_AJAAOkFACGUAwEA5QUAIaEDIAD5BQAh5gMBAOUFACGFBAEA5QUAIYYEAgD9BQAhCPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIZQDAQDlBQAhoQMgAPkFACHmAwEA5QUAIYUEAQDlBQAhhgQCAP0FACEc9wIBAAAAAfsCQAAAAAH8AkAAAAABoQMgAAAAAeADAgAAAAHmAwEAAAAB6wMBAAAAAewDAQAAAAHtAwEAAAAB7gMBAAAAAe8DAQAAAAHwAwEAAAAB8QMAAOIHACDyAwIAAAAB8wMCAAAAAfQDAADjBwAg9QMAAOQHACD2AwIAAAAB9wMIAAAAAfgDCAAAAAH5AwgAAAAB-gMgAAAAAfsDAgAAAAH8AyAAAAAB_QMgAAAAAf4DAADlBwAg_wNAAAAAAYAEQAAAAAETGwAA0gkAICoAANUJACAtAADXCQAgLwAA0wkAIDAAANYJACAxAADYCQAg9wIBAAAAAfsCQAAAAAH8AkAAAAABkgMBAAAAAbgDAAAAnAQC5gMBAAAAAZcEAQAAAAGYBCAAAAABmQQBAAAAAZoEAAAAzQMCnAQgAAAAAZ0EIAAAAAGeBEAAAAABAgAAABoAIA8AANQKACAkGgAAjggAIB0AAIoIACAhAACLCAAgLQAAjwgAIC4AAIwIACD3AgEAAAAB-wJAAAAAAfwCQAAAAAH_AgEAAAABjwMBAAAAAZEDAAAAkQMCkgMBAAAAAZMDAQAAAAGUAwEAAAABlQMBAAAAAZYDIAAAAAGXAwEAAAABmAMBAAAAAZkDAQAAAAGaAwEAAAABmwMBAAAAAZ0DAAAAnQMCngMBAAAAAZ8DAQAAAAGgA0AAAAABoQMgAAAAAaIDAQAAAAGjAwEAAAABpAMBAAAAAaUDAQAAAAGmAxAAAAABpwNAAAAAAagDEAAAAAGpAwIAAAABqgMQAAAAAasDEAAAAAECAAAAkwQAIA8AANYKACADAAAAcgAgDwAA1goAIBAAANoKACAmAAAAcgAgCAAA2goAIBoAAIIGACAdAAD-BQAgIQAA_wUAIC0AAIMGACAuAACABgAg9wIBAOUFACH7AkAA6QUAIfwCQADpBQAh_wIBAOUFACGPAwEA5QUAIZEDAAD4BZEDIpIDAQDlBQAhkwMBAOcFACGUAwEA5wUAIZUDAQDnBQAhlgMgAPkFACGXAwEA5QUAIZgDAQDlBQAhmQMBAOUFACGaAwEA5wUAIZsDAQDlBQAhnQMAAPoFnQMingMBAOcFACGfAwEA5wUAIaADQAD7BQAhoQMgAPkFACGiAwEA5wUAIaMDAQDnBQAhpAMBAOcFACGlAwEA5QUAIaYDEAD8BQAhpwNAAPsFACGoAxAA_AUAIakDAgD9BQAhqgMQAPwFACGrAxAA_AUAISQaAACCBgAgHQAA_gUAICEAAP8FACAtAACDBgAgLgAAgAYAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIf8CAQDlBQAhjwMBAOUFACGRAwAA-AWRAyKSAwEA5QUAIZMDAQDnBQAhlAMBAOcFACGVAwEA5wUAIZYDIAD5BQAhlwMBAOUFACGYAwEA5QUAIZkDAQDlBQAhmgMBAOcFACGbAwEA5QUAIZ0DAAD6BZ0DIp4DAQDnBQAhnwMBAOcFACGgA0AA-wUAIaEDIAD5BQAhogMBAOcFACGjAwEA5wUAIaQDAQDnBQAhpQMBAOUFACGmAxAA_AUAIacDQAD7BQAhqAMQAPwFACGpAwIA_QUAIaoDEAD8BQAhqwMQAPwFACEW9wIBAAAAAfsCQAAAAAH8AkAAAAABgAMBAAAAAa8DAQAAAAGwAxAAAAABsQMQAAAAAbIDEAAAAAGzAxAAAAABtAMBAAAAAbUDAQAAAAG2AwEAAAABuAMAAAC4AwK5A4AAAAABugNAAAAAAbsDQAAAAAG8A0AAAAABvQNAAAAAAb4DQAAAAAG_AwEAAAABwAMBAAAAAcIDAAAAwgMCJiAAAOYHACAiAADnBwAgIwAAzwgAICQAAOgHACAlAADpBwAgJgAA6gcAICcAAOsHACAoAADsBwAgLQAA7QcAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAYADAQAAAAGhAyAAAAAB4AMCAAAAAeYDAQAAAAHrAwEAAAAB7AMBAAAAAe0DAQAAAAHuAwEAAAAB7wMBAAAAAfADAQAAAAHxAwAA4gcAIPIDAgAAAAHzAwIAAAAB9AMAAOMHACD1AwAA5AcAIPYDAgAAAAH3AwgAAAAB-AMIAAAAAfkDCAAAAAH6AyAAAAAB-wMCAAAAAfwDIAAAAAH9AyAAAAAB_gMAAOUHACD_A0AAAAABgARAAAAAAQIAAAApACAPAADcCgAgAwAAACcAIA8AANwKACAQAADgCgAgKAAAACcAIAgAAOAKACAgAAD6BgAgIgAA-wYAICMAAM4IACAkAAD8BgAgJQAA_QYAICYAAP4GACAnAAD_BgAgKAAAgAcAIC0AAIEHACD3AgEA5QUAIfsCQADpBQAh_AJAAOkFACGAAwEA5QUAIaEDIAD5BQAh4AMCAP0FACHmAwEA5QUAIesDAQDlBQAh7AMBAOcFACHtAwEA5QUAIe4DAQDnBQAh7wMBAOcFACHwAwEA5QUAIfEDAADzBgAg8gMCAP0FACHzAwIA9AYAIfQDAAD1BgAg9QMAAPYGACD2AwIA9AYAIfcDCAD3BgAh-AMIAPcGACH5AwgA9wYAIfoDIAD5BQAh-wMCAP0FACH8AyAA-QUAIf0DIAD5BQAh_gMAAPgGACD_A0AA-wUAIYAEQAD7BQAhJiAAAPoGACAiAAD7BgAgIwAAzggAICQAAPwGACAlAAD9BgAgJgAA_gYAICcAAP8GACAoAACABwAgLQAAgQcAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIYADAQDlBQAhoQMgAPkFACHgAwIA_QUAIeYDAQDlBQAh6wMBAOUFACHsAwEA5wUAIe0DAQDlBQAh7gMBAOcFACHvAwEA5wUAIfADAQDlBQAh8QMAAPMGACDyAwIA_QUAIfMDAgD0BgAh9AMAAPUGACD1AwAA9gYAIPYDAgD0BgAh9wMIAPcGACH4AwgA9wYAIfkDCAD3BgAh-gMgAPkFACH7AwIA_QUAIfwDIAD5BQAh_QMgAPkFACH-AwAA-AYAIP8DQAD7BQAhgARAAPsFACEJ9wIBAAAAAfsCQAAAAAH-AgEAAAABzgMBAAAAAc8DAQAAAAHQAwEAAAAB0QMCAAAAAdIDEAAAAAHTAxAAAAABBvcCAQAAAAH7AkAAAAABuAMAAADKAwLKAwEAAAABywMBAAAAAc0DAAAAzQMDCfcCAQAAAAH4AggAAAAB-QIBAAAAAfoCAADuBQAg-wJAAAAAAfwCQAAAAAH-AgEAAAAB_wIBAAAAAYADAQAAAAEDAAAAfwAgDwAA1AoAIBAAAOYKACAVAAAAfwAgCAAA5goAIBsAAI4JACAqAACRCQAgLQAAkwkAIC8AAI8JACAwAACSCQAgMQAAlAkAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIZIDAQDnBQAhuAMAAI0JnAQi5gMBAOUFACGXBAEA5QUAIZgEIAD5BQAhmQQBAOcFACGaBAAAjAnNAyKcBCAA-QUAIZ0EIAD5BQAhngRAAPsFACETGwAAjgkAICoAAJEJACAtAACTCQAgLwAAjwkAIDAAAJIJACAxAACUCQAg9wIBAOUFACH7AkAA6QUAIfwCQADpBQAhkgMBAOcFACG4AwAAjQmcBCLmAwEA5QUAIZcEAQDlBQAhmAQgAPkFACGZBAEA5wUAIZoEAACMCc0DIpwEIAD5BQAhnQQgAPkFACGeBEAA-wUAIRf3AgEAAAAB-wJAAAAAAfwCQAAAAAGvAwEAAAABuAMAAADKAwK9A0AAAAAB1AMBAAAAAdYDAAAA1gMC1wMBAAAAAdgDAQAAAAHZAwEAAAAB2gMBAAAAAdsDAQAAAAHcAwEAAAAB3QMBAAAAAd4DAQAAAAHfAxAAAAAB4AMQAAAAAeEDEAAAAAHiAxAAAAAB4wNAAAAAAeQDQAAAAAHlA0AAAAABHRwAAOQGACAjAACrCAAgKwAA5gYAICwAAOcGACAtAADoBgAg9wIBAAAAAfsCQAAAAAH8AkAAAAABgAMBAAAAAa8DAQAAAAG4AwAAAMoDAr0DQAAAAAHUAwEAAAAB1gMAAADWAwLXAwEAAAAB2AMBAAAAAdkDAQAAAAHaAwEAAAAB2wMBAAAAAdwDAQAAAAHdAwEAAAAB3gMBAAAAAd8DEAAAAAHgAxAAAAAB4QMQAAAAAeIDEAAAAAHjA0AAAAAB5ANAAAAAAeUDQAAAAAECAAAAZQAgDwAA6AoAIBMbAADSCQAgLQAA1wkAIC4AANQJACAvAADTCQAgMAAA1gkAIDEAANgJACD3AgEAAAAB-wJAAAAAAfwCQAAAAAGSAwEAAAABuAMAAACcBALmAwEAAAABlwQBAAAAAZgEIAAAAAGZBAEAAAABmgQAAADNAwKcBCAAAAABnQQgAAAAAZ4EQAAAAAECAAAAGgAgDwAA6goAIAMAAABjACAPAADoCgAgEAAA7goAIB8AAABjACAIAADuCgAgHAAArwYAICMAAKoIACArAACxBgAgLAAAsgYAIC0AALMGACD3AgEA5QUAIfsCQADpBQAh_AJAAOkFACGAAwEA5QUAIa8DAQDlBQAhuAMAAK0GygMivQNAAPsFACHUAwEA5QUAIdYDAACsBtYDItcDAQDnBQAh2AMBAOcFACHZAwEA5QUAIdoDAQDnBQAh2wMBAOcFACHcAwEA5wUAId0DAQDnBQAh3gMBAOcFACHfAxAA_AUAIeADEAD8BQAh4QMQAPwFACHiAxAA_AUAIeMDQAD7BQAh5ANAAPsFACHlA0AA-wUAIR0cAACvBgAgIwAAqggAICsAALEGACAsAACyBgAgLQAAswYAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIYADAQDlBQAhrwMBAOUFACG4AwAArQbKAyK9A0AA-wUAIdQDAQDlBQAh1gMAAKwG1gMi1wMBAOcFACHYAwEA5wUAIdkDAQDlBQAh2gMBAOcFACHbAwEA5wUAIdwDAQDnBQAh3QMBAOcFACHeAwEA5wUAId8DEAD8BQAh4AMQAPwFACHhAxAA_AUAIeIDEAD8BQAh4wNAAPsFACHkA0AA-wUAIeUDQAD7BQAhAwAAAH8AIA8AAOoKACAQAADxCgAgFQAAAH8AIAgAAPEKACAbAACOCQAgLQAAkwkAIC4AAJAJACAvAACPCQAgMAAAkgkAIDEAAJQJACD3AgEA5QUAIfsCQADpBQAh_AJAAOkFACGSAwEA5wUAIbgDAACNCZwEIuYDAQDlBQAhlwQBAOUFACGYBCAA-QUAIZkEAQDnBQAhmgQAAIwJzQMinAQgAPkFACGdBCAA-QUAIZ4EQAD7BQAhExsAAI4JACAtAACTCQAgLgAAkAkAIC8AAI8JACAwAACSCQAgMQAAlAkAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIZIDAQDnBQAhuAMAAI0JnAQi5gMBAOUFACGXBAEA5QUAIZgEIAD5BQAhmQQBAOcFACGaBAAAjAnNAyKcBCAA-QUAIZ0EIAD5BQAhngRAAPsFACEW9wIBAAAAAfsCQAAAAAH8AkAAAAAB_QIBAAAAAa8DAQAAAAGwAxAAAAABsQMQAAAAAbIDEAAAAAGzAxAAAAABtAMBAAAAAbUDAQAAAAG2AwEAAAABuAMAAAC4AwK5A4AAAAABugNAAAAAAbsDQAAAAAG8A0AAAAABvQNAAAAAAb4DQAAAAAG_AwEAAAABwAMBAAAAAcIDAAAAwgMCCfcCAQAAAAH4AggAAAAB-QIBAAAAAfoCAADuBQAg-wJAAAAAAfwCQAAAAAH9AgEAAAAB_gIBAAAAAf8CAQAAAAEDAAAAfwAgDwAArgoAIBAAAPYKACAVAAAAfwAgCAAA9goAIBsAAI4JACAqAACRCQAgLQAAkwkAIC4AAJAJACAvAACPCQAgMQAAlAkAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIZIDAQDnBQAhuAMAAI0JnAQi5gMBAOUFACGXBAEA5QUAIZgEIAD5BQAhmQQBAOcFACGaBAAAjAnNAyKcBCAA-QUAIZ0EIAD5BQAhngRAAPsFACETGwAAjgkAICoAAJEJACAtAACTCQAgLgAAkAkAIC8AAI8JACAxAACUCQAg9wIBAOUFACH7AkAA6QUAIfwCQADpBQAhkgMBAOcFACG4AwAAjQmcBCLmAwEA5QUAIZcEAQDlBQAhmAQgAPkFACGZBAEA5wUAIZoEAACMCc0DIpwEIAD5BQAhnQQgAPkFACGeBEAA-wUAIRMbAADSCQAgKgAA1QkAIC4AANQJACAvAADTCQAgMAAA1gkAIDEAANgJACD3AgEAAAAB-wJAAAAAAfwCQAAAAAGSAwEAAAABuAMAAACcBALmAwEAAAABlwQBAAAAAZgEIAAAAAGZBAEAAAABmgQAAADNAwKcBCAAAAABnQQgAAAAAZ4EQAAAAAECAAAAGgAgDwAA9woAICQaAACOCAAgHQAAiggAICEAAIsIACAqAACNCAAgLgAAjAgAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAf8CAQAAAAGPAwEAAAABkQMAAACRAwKSAwEAAAABkwMBAAAAAZQDAQAAAAGVAwEAAAABlgMgAAAAAZcDAQAAAAGYAwEAAAABmQMBAAAAAZoDAQAAAAGbAwEAAAABnQMAAACdAwKeAwEAAAABnwMBAAAAAaADQAAAAAGhAyAAAAABogMBAAAAAaMDAQAAAAGkAwEAAAABpQMBAAAAAaYDEAAAAAGnA0AAAAABqAMQAAAAAakDAgAAAAGqAxAAAAABqwMQAAAAAQIAAACTBAAgDwAA-QoAICYgAADmBwAgIgAA5wcAICMAAM8IACAkAADoBwAgJQAA6QcAICYAAOoHACAnAADrBwAgKAAA7AcAICsAAO4HACD3AgEAAAAB-wJAAAAAAfwCQAAAAAGAAwEAAAABoQMgAAAAAeADAgAAAAHmAwEAAAAB6wMBAAAAAewDAQAAAAHtAwEAAAAB7gMBAAAAAe8DAQAAAAHwAwEAAAAB8QMAAOIHACDyAwIAAAAB8wMCAAAAAfQDAADjBwAg9QMAAOQHACD2AwIAAAAB9wMIAAAAAfgDCAAAAAH5AwgAAAAB-gMgAAAAAfsDAgAAAAH8AyAAAAAB_QMgAAAAAf4DAADlBwAg_wNAAAAAAYAEQAAAAAECAAAAKQAgDwAA-woAIB0cAADkBgAgIwAAqwgAICoAAOUGACArAADmBgAgLAAA5wYAIPcCAQAAAAH7AkAAAAAB_AJAAAAAAYADAQAAAAGvAwEAAAABuAMAAADKAwK9A0AAAAAB1AMBAAAAAdYDAAAA1gMC1wMBAAAAAdgDAQAAAAHZAwEAAAAB2gMBAAAAAdsDAQAAAAHcAwEAAAAB3QMBAAAAAd4DAQAAAAHfAxAAAAAB4AMQAAAAAeEDEAAAAAHiAxAAAAAB4wNAAAAAAeQDQAAAAAHlA0AAAAABAgAAAGUAIA8AAP0KACADAAAAfwAgDwAA9woAIBAAAIELACAVAAAAfwAgCAAAgQsAIBsAAI4JACAqAACRCQAgLgAAkAkAIC8AAI8JACAwAACSCQAgMQAAlAkAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIZIDAQDnBQAhuAMAAI0JnAQi5gMBAOUFACGXBAEA5QUAIZgEIAD5BQAhmQQBAOcFACGaBAAAjAnNAyKcBCAA-QUAIZ0EIAD5BQAhngRAAPsFACETGwAAjgkAICoAAJEJACAuAACQCQAgLwAAjwkAIDAAAJIJACAxAACUCQAg9wIBAOUFACH7AkAA6QUAIfwCQADpBQAhkgMBAOcFACG4AwAAjQmcBCLmAwEA5QUAIZcEAQDlBQAhmAQgAPkFACGZBAEA5wUAIZoEAACMCc0DIpwEIAD5BQAhnQQgAPkFACGeBEAA-wUAIQMAAAByACAPAAD5CgAgEAAAhAsAICYAAAByACAIAACECwAgGgAAggYAIB0AAP4FACAhAAD_BQAgKgAAgQYAIC4AAIAGACD3AgEA5QUAIfsCQADpBQAh_AJAAOkFACH_AgEA5QUAIY8DAQDlBQAhkQMAAPgFkQMikgMBAOUFACGTAwEA5wUAIZQDAQDnBQAhlQMBAOcFACGWAyAA-QUAIZcDAQDlBQAhmAMBAOUFACGZAwEA5QUAIZoDAQDnBQAhmwMBAOUFACGdAwAA-gWdAyKeAwEA5wUAIZ8DAQDnBQAhoANAAPsFACGhAyAA-QUAIaIDAQDnBQAhowMBAOcFACGkAwEA5wUAIaUDAQDlBQAhpgMQAPwFACGnA0AA-wUAIagDEAD8BQAhqQMCAP0FACGqAxAA_AUAIasDEAD8BQAhJBoAAIIGACAdAAD-BQAgIQAA_wUAICoAAIEGACAuAACABgAg9wIBAOUFACH7AkAA6QUAIfwCQADpBQAh_wIBAOUFACGPAwEA5QUAIZEDAAD4BZEDIpIDAQDlBQAhkwMBAOcFACGUAwEA5wUAIZUDAQDnBQAhlgMgAPkFACGXAwEA5QUAIZgDAQDlBQAhmQMBAOUFACGaAwEA5wUAIZsDAQDlBQAhnQMAAPoFnQMingMBAOcFACGfAwEA5wUAIaADQAD7BQAhoQMgAPkFACGiAwEA5wUAIaMDAQDnBQAhpAMBAOcFACGlAwEA5QUAIaYDEAD8BQAhpwNAAPsFACGoAxAA_AUAIakDAgD9BQAhqgMQAPwFACGrAxAA_AUAIQMAAAAnACAPAAD7CgAgEAAAhwsAICgAAAAnACAIAACHCwAgIAAA-gYAICIAAPsGACAjAADOCAAgJAAA_AYAICUAAP0GACAmAAD-BgAgJwAA_wYAICgAAIAHACArAACCBwAg9wIBAOUFACH7AkAA6QUAIfwCQADpBQAhgAMBAOUFACGhAyAA-QUAIeADAgD9BQAh5gMBAOUFACHrAwEA5QUAIewDAQDnBQAh7QMBAOUFACHuAwEA5wUAIe8DAQDnBQAh8AMBAOUFACHxAwAA8wYAIPIDAgD9BQAh8wMCAPQGACH0AwAA9QYAIPUDAAD2BgAg9gMCAPQGACH3AwgA9wYAIfgDCAD3BgAh-QMIAPcGACH6AyAA-QUAIfsDAgD9BQAh_AMgAPkFACH9AyAA-QUAIf4DAAD4BgAg_wNAAPsFACGABEAA-wUAISYgAAD6BgAgIgAA-wYAICMAAM4IACAkAAD8BgAgJQAA_QYAICYAAP4GACAnAAD_BgAgKAAAgAcAICsAAIIHACD3AgEA5QUAIfsCQADpBQAh_AJAAOkFACGAAwEA5QUAIaEDIAD5BQAh4AMCAP0FACHmAwEA5QUAIesDAQDlBQAh7AMBAOcFACHtAwEA5QUAIe4DAQDnBQAh7wMBAOcFACHwAwEA5QUAIfEDAADzBgAg8gMCAP0FACHzAwIA9AYAIfQDAAD1BgAg9QMAAPYGACD2AwIA9AYAIfcDCAD3BgAh-AMIAPcGACH5AwgA9wYAIfoDIAD5BQAh-wMCAP0FACH8AyAA-QUAIf0DIAD5BQAh_gMAAPgGACD_A0AA-wUAIYAEQAD7BQAhAwAAAGMAIA8AAP0KACAQAACKCwAgHwAAAGMAIAgAAIoLACAcAACvBgAgIwAAqggAICoAALAGACArAACxBgAgLAAAsgYAIPcCAQDlBQAh-wJAAOkFACH8AkAA6QUAIYADAQDlBQAhrwMBAOUFACG4AwAArQbKAyK9A0AA-wUAIdQDAQDlBQAh1gMAAKwG1gMi1wMBAOcFACHYAwEA5wUAIdkDAQDlBQAh2gMBAOcFACHbAwEA5wUAIdwDAQDnBQAh3QMBAOcFACHeAwEA5wUAId8DEAD8BQAh4AMQAPwFACHhAxAA_AUAIeIDEAD8BQAh4wNAAPsFACHkA0AA-wUAIeUDQAD7BQAhHRwAAK8GACAjAACqCAAgKgAAsAYAICsAALEGACAsAACyBgAg9wIBAOUFACH7AkAA6QUAIfwCQADpBQAhgAMBAOUFACGvAwEA5QUAIbgDAACtBsoDIr0DQAD7BQAh1AMBAOUFACHWAwAArAbWAyLXAwEA5wUAIdgDAQDnBQAh2QMBAOUFACHaAwEA5wUAIdsDAQDnBQAh3AMBAOcFACHdAwEA5wUAId4DAQDnBQAh3wMQAPwFACHgAxAA_AUAIeEDEAD8BQAh4gMQAPwFACHjA0AA-wUAIeQDQAD7BQAh5QNAAPsFACEAAAAAAxUABhYABxcACAAAAAMVAAYWAAcXAAgIFQAiGx8LKnEaLXQYLnAZLyEMMHMOMXghARoACgIaAAoeIw0EFQAgHAAMIG4QIwAOBxUAHxoACh0mDSEqDypnGi1oGC5mGQsVAB4gLhAiABEjAA4kNBMlOBQmPBUnQBYoRBcrWhstSBgCHgANHwAPAhUAEiEvDwEhMAABHwAPAR8ADwEfAA8BHwAPAR8ADwQaAAofAA8jAA4pABkHFQAdHAAKIwAOKkwaK1AbLFQcLVUYAxwACiMADikAGQIfAA8pABkBKQAZBCpWACtXACxYAC1ZAAggWwAkXAAlXQAmXgAnXwAoYAArYgAtYQAFHWkAIWoAKmwALW0ALmsAASBvAAEaAAoFG3kAKnsALXwALnoAMX0AAAADFQAmFgAnFwAoAAAAAxUAJhYAJxcAKAEaAAoBGgAKAxUALRYALhcALwAAAAMVAC0WAC4XAC8BGgAKARoACgMVADQWADUXADYAAAADFQA0FgA1FwA2AAAAAxUAPBYAPRcAPgAAAAMVADwWAD0XAD4CHAAMIwAOAhwADCMADgUVAEMWAEYXAEeAAQBEgQEARQAAAAAABRUAQxYARhcAR4ABAESBAQBFAh4ADR8ADwIeAA0fAA8FFQBMFgBPFwBQgAEATYEBAE4AAAAAAAUVAEwWAE8XAFCAAQBNgQEATgAABRUAVRYAWBcAWYABAFaBAQBXAAAAAAAFFQBVFgBYFwBZgAEAVoEBAFcBGgAKARoACgUVAF4WAGEXAGKAAQBfgQEAYAAAAAAABRUAXhYAYRcAYoABAF-BAQBgAiIAESMADgIiABEjAA4FFQBnFgBqFwBrgAEAaIEBAGkAAAAAAAUVAGcWAGoXAGuAAQBogQEAaQEfAA8BHwAPBRUAcBYAcxcAdIABAHGBAQByAAAAAAAFFQBwFgBzFwB0gAEAcYEBAHIBHwAPAR8ADwMVAHkWAHoXAHsAAAADFQB5FgB6FwB7AR8ADwEfAA8FFQCAARYAgwEXAIQBgAEAgQGBAQCCAQAAAAAABRUAgAEWAIMBFwCEAYABAIEBgQEAggEBHwAPAR8ADwMVAIkBFgCKARcAiwEAAAADFQCJARYAigEXAIsBAR8ADwEfAA8DFQCQARYAkQEXAJIBAAAAAxUAkAEWAJEBFwCSAQIcAAojAA4CHAAKIwAOBRUAlwEWAJoBFwCbAYABAJgBgQEAmQEAAAAAAAUVAJcBFgCaARcAmwGAAQCYAYEBAJkBAh8ADykAGQIfAA8pABkFFQCgARYAowEXAKQBgAEAoQGBAQCiAQAAAAAABRUAoAEWAKMBFwCkAYABAKEBgQEAogEBKQAZASkAGQMVAKkBFgCqARcAqwEAAAADFQCpARYAqgEXAKsBAxwACiMADikAGQMcAAojAA4pABkFFQCwARYAswEXALQBgAEAsQGBAQCyAQAAAAAABRUAsAEWALMBFwC0AYABALEBgQEAsgEBGgAKARoACgUVALkBFgC8ARcAvQGAAQC6AYEBALsBAAAAAAAFFQC5ARYAvAEXAL0BgAEAugGBAQC7AQQaAAofAA8jAA4pABkEGgAKHwAPIwAOKQAZBRUAwgEWAMUBFwDGAYABAMMBgQEAxAEAAAAAAAUVAMIBFgDFARcAxgGAAQDDAYEBAMQBAQIBAgMBBQYBBgcBBwgBCQoBCgwCCw0DDA8BDRECDhIEERMBEhQBExUCGBgFGRkJMhsKM34KNIEBCjWCAQo2gwEKN4UBCjiHAQI5iAEjOooBCjuMAQI8jQEkPY4BCj6PAQo_kAECQJMBJUGUASlClQEhQ5YBIUSXASFFmAEhRpkBIUebASFInQECSZ4BKkqgASFLogECTKMBK02kASFOpQEhT6YBAlCpASxRqgEwUqsBC1OsAQtUrQELVa4BC1avAQtXsQELWLMBAlm0ATFatgELW7gBAly5ATJdugELXrsBC1-8AQJgvwEzYcABN2LCAThjwwE4ZMYBOGXHAThmyAE4Z8oBOGjMAQJpzQE5as8BOGvRAQJs0gE6bdMBOG7UAThv1QECcNgBO3HZAT9y2gENc9sBDXTcAQ113QENdt4BDXfgAQ144gECeeMBQHrlAQ175wECfOgBQX3pAQ1-6gENf-sBAoIB7gFCgwHvAUiEAfABEIUB8QEQhgHyARCHAfMBEIgB9AEQiQH2ARCKAfgBAosB-QFJjAH7ARCNAf0BAo4B_gFKjwH_ARCQAYACEJEBgQICkgGEAkuTAYUCUZQBhwIRlQGIAhGWAYsCEZcBjAIRmAGNAhGZAY8CEZoBkQICmwGSAlKcAZQCEZ0BlgICngGXAlOfAZgCEaABmQIRoQGaAgKiAZ0CVKMBngJapAGgAgylAaECDKYBowIMpwGkAgyoAaUCDKkBpwIMqgGpAgKrAaoCW6wBrAIMrQGuAgKuAa8CXK8BsAIMsAGxAgyxAbICArIBtQJdswG2AmO0AbcCD7UBuAIPtgG5Ag-3AboCD7gBuwIPuQG9Ag-6Ab8CArsBwAJkvAHCAg-9AcQCAr4BxQJlvwHGAg_AAccCD8EByAICwgHLAmbDAcwCbMQBzQIWxQHOAhbGAc8CFscB0AIWyAHRAhbJAdMCFsoB1QICywHWAm3MAdgCFs0B2gICzgHbAm7PAdwCFtAB3QIW0QHeAgLSAeECb9MB4gJ11AHjAhfVAeQCF9YB5QIX1wHmAhfYAecCF9kB6QIX2gHrAgLbAewCdtwB7gIX3QHwAgLeAfECd98B8gIX4AHzAhfhAfQCAuIB9wJ44wH4AnzkAfkCE-UB-gIT5gH7AhPnAfwCE-gB_QIT6QH_AhPqAYEDAusBggN97AGEAxPtAYYDAu4BhwN-7wGIAxPwAYkDE_EBigMC8gGNA3_zAY4DhQH0AY8DFfUBkAMV9gGRAxX3AZIDFfgBkwMV-QGVAxX6AZcDAvsBmAOGAfwBmgMV_QGcAwL-AZ0DhwH_AZ4DFYACnwMVgQKgAwKCAqMDiAGDAqQDjAGEAqUDFIUCpgMUhgKnAxSHAqgDFIgCqQMUiQKrAxSKAq0DAosCrgONAYwCsAMUjQKyAwKOArMDjgGPArQDFJACtQMUkQK2AwKSArkDjwGTAroDkwGUArsDGZUCvAMZlgK9AxmXAr4DGZgCvwMZmQLBAxmaAsMDApsCxAOUAZwCxgMZnQLIAwKeAskDlQGfAsoDGaACywMZoQLMAwKiAs8DlgGjAtADnAGkAtEDG6UC0gMbpgLTAxunAtQDG6gC1QMbqQLXAxuqAtkDAqsC2gOdAawC3AMbrQLeAwKuAt8DngGvAuADG7AC4QMbsQLiAwKyAuUDnwGzAuYDpQG0AucDHLUC6AMctgLpAxy3AuoDHLgC6wMcuQLtAxy6Au8DArsC8AOmAbwC8gMcvQL0AwK-AvUDpwG_AvYDHMAC9wMcwQL4AwLCAvsDqAHDAvwDrAHEAv0DGsUC_gMaxgL_AxrHAoAEGsgCgQQayQKDBBrKAoUEAssChgStAcwCiAQazQKKBALOAosErgHPAowEGtACjQQa0QKOBALSApEErwHTApIEtQHUApQEDtUClQQO1gKXBA7XApgEDtgCmQQO2QKbBA7aAp0EAtsCngS2AdwCoAQO3QKiBALeAqMEtwHfAqQEDuACpQQO4QKmBALiAqkEuAHjAqoEvgHkAqsEGOUCrAQY5gKtBBjnAq4EGOgCrwQY6QKxBBjqArMEAusCtAS_AewCtgQY7QK4BALuArkEwAHvAroEGPACuwQY8QK8BALyAr8EwQHzAsAExwE"
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
  cancelledAt: "cancelledAt",
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
  orderId: "orderId",
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
  database_url: process.env.DATABASE_URL,
  BACKEND_LOCAL_HOST: process.env.BACKEND_LOCAL_HOST,
  BACKEND_PROD_HOST: process.env.BACKEND_PROD_HOST,
  frontend_local_host: process.env.FRONTEND_LOCAL_HOST,
  frontend_production_host: process.env.FRONTEND_PROD_HOST,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL,
  CLAUDINARY_CLOUD_NAME: process.env.CLAUDINARY_CLOUD_NAME,
  CLAUDINARY_API_KEY: process.env.CLAUDINARY_API_KEY,
  CLAUDINARY_API_SECRET: process.env.CLAUDINARY_API_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
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
import { Router as Router12 } from "express";

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
import { emailOTP, oAuthProxy } from "better-auth/plugins";

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
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  baseURL: config_default.frontend_production_host,
  secret: config_default.BETTER_AUTH_SECRET,
  advanced: {
    cookies: {
      session_token: {
        name: "session_token",
        // Force this exact name
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true
        }
      },
      state: {
        name: "session_token",
        // Force this exact name
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true
        }
      }
    }
  },
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
  socialProviders: {
    google: {
      clientId: config_default.GOOGLE_CLIENT_ID,
      clientSecret: config_default.GOOGLE_CLIENT_SECRET,
      prompt: "select_account consent",
      mapProfileToUser: () => ({
        role: UserRole.CUSTOMER,
        status: userAccountStatus.ACTIVE,
        isDeleted: false,
        needPasswordChange: false,
        emailVerified: true
      })
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true
  },
  trustedOrigins: [
    config_default.frontend_local_host,
    config_default.frontend_production_host,
    config_default.BACKEND_PROD_HOST,
    config_default.BETTER_AUTH_URL,
    "http://localhost:3000",
    "http://localhost:5000"
  ].filter(Boolean),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: UserRole.CUSTOMER,
        input: false
      },
      status: {
        type: "string",
        required: true,
        defaultValue: userAccountStatus.ACTIVE,
        input: false
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
          const user = await prisma.user.findUnique({ where: { email } });
          if (user && !user.emailVerified) {
            await sendEmailVerificationOTP(user.name, email, otp);
          }
        }
      },
      expiresIn: 2 * 60
    }),
    oAuthProxy()
  ],
  databaseHooks: {
    user: {
      create: {
        before: async (user, context) => {
          const intendedRole = context?.headers?.get("x-intended-role") || "CUSTOMER";
          return {
            data: { ...user, role: intendedRole }
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
  console.log("Hittted from geME");
  try {
    console.log("Hittted from geME ");
    const userId = req.user.id;
    console.log(userId);
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
  console.log("Hitted from session check 1");
  try {
    console.log("Hitted from session check 2");
    const session = await auth.api.getSession({
      headers: req.headers
    });
    const sessionToken = req.cookies["__Secure-session_token"] || req.cookies["session_token"];
    console.log("session check", session);
    console.log("session chec2", sessionToken);
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
      console.log("hellow:", session);
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
router.post("/register-customer", validateRequest_default(customerRegisterSchema), AuthController.registerCustomer);
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
  const { page, limit, role, status: status14, search } = query;
  const skip = (page - 1) * limit;
  const where = {
    isDeleted: false,
    NOT: { role: "SUPER_ADMIN" },
    ...role && { role },
    ...status14 && { status: status14 },
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
  const { page, limit, search, status: status14 } = query;
  const skip = (page - 1) * limit;
  const where = {
    ...status14 && { status: status14 },
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
  const { page, limit, search, status: status14, providerSettlementStatus } = query;
  const skip = (page - 1) * limit;
  const where = {
    ...status14 && { status: status14 },
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
    include: {
      provider: true,
      order: { select: { id: true, orderNumber: true, status: true } }
    }
  });
  if (!payment) throw new NotFoundError("Payment not found.");
  if (payment.status !== "SUCCESS") throw new BadRequestError("Only successful payments can be settled.");
  if (payment.providerSettlementStatus === "PAID") throw new ConflictError("Payment already settled.");
  const settleableOrderStatuses = ["DELIVERED"];
  if (!settleableOrderStatuses.includes(payment.order?.status ?? "")) {
    throw new BadRequestError(
      `Cannot settle payment for order #${payment.order?.orderNumber} \u2014 order must be DELIVERED before settlement. Current status: ${payment.order?.status ?? "unknown"}.`
    );
  }
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
    where: {
      providerId,
      status: "SUCCESS",
      providerSettlementStatus: "PENDING",
      order: { status: "DELIVERED" }
    },
    select: { id: true, providerShareAmount: true }
  });
  if (pending.length === 0) {
    throw new BadRequestError(
      "No settleable payments found for this provider. Only payments linked to DELIVERED orders can be settled."
    );
  }
  const total = pending.reduce((s, p) => s + Number(p.providerShareAmount), 0);
  return prisma.$transaction(async (tx) => {
    await tx.payment.updateMany({
      where: {
        providerId,
        status: "SUCCESS",
        providerSettlementStatus: "PENDING",
        order: { status: "DELIVERED" }
      },
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
var suspendAdmin = async (targetAdminId, requesterId) => {
  const target = await prisma.user.findUnique({
    where: { id: targetAdminId },
    select: { id: true, role: true, status: true, isDeleted: true }
  });
  if (!target) throw new NotFoundError("Admin account not found.");
  if (target.isDeleted) throw new ForbiddenError("This account has been deleted.");
  if (target.role === "SUPER_ADMIN") throw new ForbiddenError("Super admin accounts cannot be suspended.");
  if (target.role !== "ADMIN") throw new ForbiddenError("Target account is not an admin.");
  if (target.status === "SUSPENDED") throw new ConflictError("Admin is already suspended.");
  return prisma.user.update({
    where: { id: targetAdminId },
    data: { status: "SUSPENDED" },
    select: { id: true, name: true, email: true, role: true, status: true }
  });
};
var reactivateAdmin = async (targetAdminId, requesterId) => {
  const target = await prisma.user.findUnique({
    where: { id: targetAdminId },
    select: { id: true, role: true, status: true, isDeleted: true }
  });
  if (!target) throw new NotFoundError("Admin account not found.");
  if (target.isDeleted) throw new ForbiddenError("This account has been deleted.");
  if (target.role !== "ADMIN") throw new ForbiddenError("Target account is not an admin.");
  if (target.status === "ACTIVE") throw new ConflictError("Admin is already active.");
  return prisma.user.update({
    where: { id: targetAdminId },
    data: { status: "ACTIVE" },
    select: { id: true, name: true, email: true, role: true, status: true }
  });
};
var deleteAdmin = async (targetAdminId, requesterId) => {
  if (targetAdminId === requesterId) {
    throw new ForbiddenError("You cannot delete your own account.");
  }
  const target = await prisma.user.findUnique({
    where: { id: targetAdminId },
    select: { id: true, role: true, isDeleted: true }
  });
  if (!target) throw new NotFoundError("Admin account not found.");
  if (target.isDeleted) throw new ConflictError("Account has already been deleted.");
  if (target.role === "SUPER_ADMIN") throw new ForbiddenError("Super admin accounts cannot be deleted.");
  if (target.role !== "ADMIN") throw new ForbiddenError("Target account is not an admin.");
  await prisma.session.deleteMany({ where: { userId: targetAdminId } });
  await prisma.user.update({
    where: { id: targetAdminId },
    data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date(), status: "SUSPENDED" }
  });
};
var AdminService = {
  getPendingProviders,
  getAllProviders,
  getProviderDetail,
  approveProvider,
  rejectProvider,
  updateProviderStatus,
  getAllUsers,
  getUserDetail,
  suspendUser,
  reactivateUser,
  toggleUserStatus,
  getAllAdmins,
  createAdmin,
  suspendAdmin,
  reactivateAdmin,
  deleteAdmin,
  getDashboardStats: getDashboardStats2,
  getAllOrders,
  getOrderDetail,
  getAllPayments,
  getPaymentDetail,
  getProviderPayablesSummary,
  markPaymentAsProviderPaid,
  bulkSettleProvider,
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
var suspendAdmin2 = async (req, res, next) => {
  try {
    const result = await AdminService.suspendAdmin(req.params.id, req.user.id);
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "Admin account suspended.", data: result });
  } catch (e) {
    next(e);
  }
};
var reactivateAdmin2 = async (req, res, next) => {
  try {
    const result = await AdminService.reactivateAdmin(req.params.id, req.user.id);
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "Admin account reactivated.", data: result });
  } catch (e) {
    next(e);
  }
};
var deleteAdmin2 = async (req, res, next) => {
  try {
    await AdminService.deleteAdmin(req.params.id, req.user.id);
    sendResponse(res, { httpStatusCode: status4.OK, success: true, message: "Admin account deleted." });
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
  suspendAdmin: suspendAdmin2,
  reactivateAdmin: reactivateAdmin2,
  deleteAdmin: deleteAdmin2,
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
router3.patch("/admins/:id/suspend", superAdminGuard, AdminController.suspendAdmin);
router3.patch("/admins/:id/reactivate", superAdminGuard, AdminController.reactivateAdmin);
router3.delete("/admins/:id", superAdminGuard, AdminController.deleteAdmin);
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
        meals: {
          where: { isActive: true, isAvailable: true },
          select: { subcategory: true, categoryId: true },
          take: 200
        }
      }
    }),
    prisma.providerProfile.count({ where })
  ]);
  const providerIds = restaurants.map((r) => r.id);
  const ratingAggregates = await prisma.review.groupBy({
    by: ["providerId"],
    where: { providerId: { in: providerIds } },
    _avg: { rating: true },
    _count: { rating: true }
  });
  const ratingMap = new Map(
    ratingAggregates.map((a) => [
      a.providerId,
      { avg: a._avg.rating ?? 0, count: a._count.rating }
    ])
  );
  const enriched = restaurants.map((r) => {
    const ratingInfo = ratingMap.get(r.id) ?? { avg: 0, count: 0 };
    const avgRating = Math.round(ratingInfo.avg * 10) / 10;
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
      reviewCount: ratingInfo.count,
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
      { isFeatured: "desc" },
      { isBestseller: "desc" }
    ],
    take: limit * 3
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
      user: { select: { id: true, name: true, image: true } },
      meal: { select: { name: true } },
      provider: { select: { businessName: true, city: true } }
    }
  });
  const seen = /* @__PURE__ */ new Set();
  const deduped = reviews.filter((r) => {
    const key = r.user.id;
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
var getHeroStats = async () => {
  const [restaurantCount, cuisines, happyFoodies, ratingAggregate] = await Promise.all([
    // 1. Active, approved provider profiles
    prisma.providerProfile.count({
      where: { approvalStatus: "APPROVED", isActive: true }
    }),
    // 2. Distinct cuisine / business-category values in use
    prisma.providerProfile.findMany({
      where: { approvalStatus: "APPROVED", isActive: true },
      select: { businessCategory: true },
      distinct: ["businessCategory"]
    }),
    // 3. Unique customers who have at least one delivered order
    prisma.order.findMany({
      where: { status: "DELIVERED" },
      select: { customerId: true },
      distinct: ["customerId"]
    }),
    // 4. Platform-wide average rating (single SQL AVG)
    prisma.review.aggregate({ _avg: { rating: true } })
  ]);
  const averageRating = ratingAggregate._avg.rating ? Math.round(ratingAggregate._avg.rating * 10) / 10 : 0;
  return {
    restaurantCount,
    cuisineCount: cuisines.length,
    happyFoodiesCount: happyFoodies.length,
    averageRating
  };
};
var PublicService = {
  getCategories,
  getRestaurants,
  getRestaurantById,
  getFeaturedRestaurants,
  getTopDishes,
  getHomeTestimonials,
  getHeroStats
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
var getHeroStats2 = async (req, res, next) => {
  try {
    const result = await PublicService.getHeroStats();
    res.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600"
    );
    sendResponse(res, {
      httpStatusCode: status5.OK,
      success: true,
      message: "Hero stats fetched successfully.",
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
  getHomeTestimonials: getHomeTestimonials2,
  getHeroStats: getHeroStats2
};

// src/modules/public/public.route.ts
var router4 = Router4();
router4.get("/categories", PublicController.getCategories);
router4.get("/hero-stats", PublicController.getHeroStats);
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

// src/utils/refundEmail.ts
function buildRefundEmail({
  customerName,
  orderNumber,
  amount,
  paymentMethod,
  refundRefId
}) {
  const isOnline = paymentMethod === "ONLINE";
  const subject = isOnline ? `Refund initiated \u2014 Order #${orderNumber}` : `Order cancelled \u2014 Order #${orderNumber}`;
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1C0A06,#3B0F15);padding:28px 32px;text-align:center;">
              <p style="margin:0;font-size:26px;font-weight:800;color:#D4881E;font-family:Georgia,serif;letter-spacing:-0.5px;">Platera</p>
              <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.5px;">Food Delivery Platform</p>
              <p style="margin:8px 0 0;font-size:11px;font-weight:700;color:#D4881E;background:rgba(212,136,30,0.12);border:1px solid rgba(212,136,30,0.3);border-radius:20px;padding:3px 12px;display:inline-block;text-transform:uppercase;letter-spacing:1px;">
                \u26A0 Sandbox / Test Mode
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">

              <h2 style="margin:0 0 12px;font-size:22px;color:#0F172A;font-family:Georgia,serif;">
                ${isOnline ? "Refund Initiated \u2713" : "Order Cancelled"}
              </h2>

              <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.7;">
                Hi <strong>${customerName}</strong>,<br/>
                ${isOnline ? `Your order has been cancelled and a refund has been initiated.` : `Your order has been cancelled. Since it was a Cash on Delivery order, no payment was taken.`}
              </p>

              <!-- Summary box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:${isOnline ? "#F0FDF4" : "#F8FAFC"};border:1px solid ${isOnline ? "#BBF7D0" : "#E2E8F0"};border-radius:12px;margin-bottom:24px;">
                <tr><td style="padding:20px 24px;">

                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:13px;color:#64748B;padding:5px 0;">Order number</td>
                      <td style="font-size:13px;font-weight:700;color:#0F172A;text-align:right;">#${orderNumber}</td>
                    </tr>
                    ${isOnline ? `
                    <tr>
                      <td style="font-size:13px;color:#64748B;padding:5px 0;">Refund amount</td>
                      <td style="font-size:20px;font-weight:800;color:#16A34A;text-align:right;font-family:Georgia,serif;">\u09F3${amount.toFixed(2)}</td>
                    </tr>` : ""}
                    <tr>
                      <td style="font-size:13px;color:#64748B;padding:5px 0;">Payment method</td>
                      <td style="font-size:13px;color:#0F172A;text-align:right;">${isOnline ? "Online (SSLCommerz)" : "Cash on Delivery"}</td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#64748B;padding:5px 0;">Status</td>
                      <td style="text-align:right;">
                        <span style="background:${isOnline ? "#DCFCE7" : "#F1F5F9"};color:${isOnline ? "#15803D" : "#475569"};font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;">
                          ${isOnline ? "Refunded" : "Cancelled"}
                        </span>
                      </td>
                    </tr>
                    ${refundRefId ? `
                    <tr>
                      <td style="font-size:13px;color:#64748B;padding:5px 0;">Reference ID</td>
                      <td style="font-size:11px;font-family:monospace;color:#374151;text-align:right;word-break:break-all;">${refundRefId}</td>
                    </tr>` : ""}
                  </table>

                </td></tr>
              </table>

              ${isOnline ? `
              <!-- Sandbox notice -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:10px;margin-bottom:20px;">
                <tr><td style="padding:14px 18px;">
                  <p style="margin:0;font-size:13px;font-weight:700;color:#9A3412;">\u26A0 Sandbox Mode \u2014 Test Refund</p>
                  <p style="margin:4px 0 0;font-size:12px;color:#C2410C;line-height:1.5;">
                    This is a <strong>simulated refund</strong> \u2014 no real money has moved. In production, the refund would be processed via SSLCommerz and reach your account within 3\u20137 business days.
                  </p>
                </td></tr>
              </table>` : ""}

              <p style="font-size:13px;color:#94A3B8;margin:0 0 4px;">
                Questions? Reply to this email or contact
                <a href="mailto:support@platera.com.bd" style="color:#D4881E;">support@platera.com.bd</a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F8FAFC;padding:16px 32px;border-top:1px solid #E2E8F0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94A3B8;">\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} Platera \xB7 All rights reserved</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  return { subject, html };
}

// src/modules/order/order.service.ts
var normalizeCity3 = (city) => city.trim().toUpperCase();
var getCustomerProfileOrThrow2 = async (userId) => {
  const cp = await prisma.customerProfile.findUnique({ where: { userId } });
  if (!cp) throw new ForbiddenError("Please complete your customer profile before checkout.");
  return cp;
};
var getCartOrThrow = async (customerProfileId) => {
  const cart = await prisma.cart.findUnique({
    where: { customerId: customerProfileId },
    include: {
      provider: true,
      cartItems: { include: { meal: true }, orderBy: { createdAt: "asc" } }
    }
  });
  if (!cart || cart.cartItems.length === 0) throw new BadRequestError("Your cart is empty.");
  return cart;
};
var buildValidatedCheckoutState = async (userId, payload) => {
  const customerProfile = await getCustomerProfileOrThrow2(userId);
  const cart = await getCartOrThrow(customerProfile.id);
  if (!cart.provider.isActive || cart.provider.approvalStatus !== "APPROVED") {
    throw new BadRequestError("This provider is not available for checkout.");
  }
  if (normalizeCity3(customerProfile.city) !== normalizeCity3(cart.provider.city)) {
    throw new ForbiddenError(`This provider only serves customers in ${cart.provider.city}.`);
  }
  const validatedItems = cart.cartItems.map((item) => {
    const meal = item.meal;
    if (!meal.isActive || !meal.isAvailable) {
      throw new BadRequestError(`The meal "${meal.name}" is currently unavailable.`);
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
  const subtotal = validatedItems.reduce((s, i) => s + i.totalPrice, 0);
  const discountAmount = validatedItems.reduce((s, i) => s + (i.baseUnitPrice - i.unitPrice) * i.quantity, 0);
  const deliveryFee = validatedItems.length > 0 ? Math.max(...validatedItems.map((i) => i.mealDeliveryFee)) : 0;
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
var generateOrderNumber = () => {
  const now = /* @__PURE__ */ new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `PLT-${y}${m}${d}-${rand}`;
};
var getCheckoutPreview = async (userId, payload) => {
  const state = await buildValidatedCheckoutState(userId, payload);
  return {
    provider: { id: state.cart.provider.id, businessName: state.cart.provider.businessName, city: state.cart.provider.city, imageURL: state.cart.provider.imageURL },
    items: state.validatedItems,
    totals: state.totals,
    delivery: state.delivery
  };
};
var createOrder = async (userId, payload) => {
  const state = await buildValidatedCheckoutState(userId, payload);
  const existingPending = await prisma.order.findFirst({
    where: { customerId: userId, providerId: state.cart.provider.id, status: "PENDING_PAYMENT" },
    select: { id: true }
  });
  if (existingPending && payload.paymentMethod === "ONLINE") {
    throw new BadRequestError("You already have a pending payment order for this provider.");
  }
  return prisma.$transaction(async (tx) => {
    const initialStatus = payload.paymentMethod === "ONLINE" ? "PENDING_PAYMENT" : "PLACED";
    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: userId,
        providerId: state.cart.provider.id,
        paymentMethod: payload.paymentMethod,
        status: initialStatus,
        ...state.delivery,
        subtotal: state.totals.subtotal,
        deliveryFee: state.totals.deliveryFee,
        discountAmount: state.totals.discountAmount,
        totalAmount: state.totals.totalAmount,
        placedAt: payload.paymentMethod === "COD" ? /* @__PURE__ */ new Date() : null
      }
    });
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
        provider: { select: { id: true, businessName: true, city: true, imageURL: true } },
        orderItems: true,
        orderStatusHistories: { orderBy: { createdAt: "asc" } }
      }
    });
  });
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
        { orderItems: { some: { mealName: { contains: query.search, mode: "insensitive" } } } },
        { provider: { businessName: { contains: query.search, mode: "insensitive" } } }
      ]
    }
  };
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        provider: { select: { id: true, businessName: true, city: true, imageURL: true } },
        orderItems: true,
        payments: {
          select: {
            id: true,
            status: true,
            amount: true,
            gatewayName: true,
            refundedAt: true,
            paymentGatewayData: true
            // needed to surface refund info on card
          },
          orderBy: { createdAt: "desc" }
        }
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.order.count({ where })
  ]);
  return {
    orders: orders.map((o) => ({ ...o, items: o.orderItems })),
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: skip + limit < total, hasPrevPage: page > 1 }
  };
};
var getMyOrderDetail = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, customerId: userId },
    include: {
      provider: { select: { id: true, businessName: true, city: true, imageURL: true, phone: true } },
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
    where: { id: orderId, customerId: userId },
    include: {
      // Only grab the most recent SUCCESS payment — that is what we refund
      payments: {
        where: { status: "SUCCESS" },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          amount: true,
          providerShareAmount: true,
          platformFeeAmount: true,
          paymentGatewayData: true,
          providerSettlementStatus: true
          // KEY: tells us if admin already paid the provider
        }
      },
      customer: { select: { name: true, email: true } }
    }
  });
  if (!order) throw new NotFoundError("Order not found.");
  if (!CUSTOMER_CANCELLABLE_STATUSES.includes(order.status)) {
    const msg = order.status === "PREPARING" || order.status === "OUT_FOR_DELIVERY" ? "Your order is already being prepared and can no longer be cancelled." : order.status === "DELIVERED" ? "This order has already been delivered." : order.status === "CANCELLED" || order.status === "REFUNDED" ? "This order is already cancelled." : "This order can no longer be cancelled.";
    throw new BadRequestError(msg);
  }
  const successPayment = order.payments[0] ?? null;
  const isOnlinePaid = order.paymentMethod === "ONLINE" && successPayment !== null;
  const sandboxRefundRefId = isOnlinePaid ? `SANDBOX-REF-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}` : null;
  const refundAmount = isOnlinePaid ? Number(successPayment.amount) : 0;
  const finalStatus = isOnlinePaid ? "REFUNDED" : "CANCELLED";
  const updated = await prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { status: finalStatus, cancelledAt: /* @__PURE__ */ new Date() }
    });
    const historyNote = isOnlinePaid ? `Cancelled by customer. Sandbox refund of \u09F3${refundAmount.toFixed(2)} simulated (Ref: ${sandboxRefundRefId}).` : order.paymentMethod === "COD" ? "Cancelled by customer. Cash on Delivery \u2014 no payment to refund." : "Cancelled by customer. Order was unpaid \u2014 no charge made.";
    await tx.orderStatusHistory.create({
      data: {
        orderId,
        status: finalStatus,
        note: historyNote,
        changedByUserId: userId,
        changedByRole: "CUSTOMER"
      }
    });
    if (isOnlinePaid && successPayment) {
      const providerEarning = Number(successPayment.providerShareAmount);
      const platformFee = Number(successPayment.platformFeeAmount);
      await tx.payment.update({
        where: { id: successPayment.id },
        data: {
          status: "REFUNDED",
          refundedAt: /* @__PURE__ */ new Date(),
          // We store refund info inside the existing Json column — no schema change needed
          paymentGatewayData: {
            ...typeof successPayment.paymentGatewayData === "object" && successPayment.paymentGatewayData !== null ? successPayment.paymentGatewayData : {},
            refundSimulated: true,
            refundRefId: sandboxRefundRefId,
            refundedAt: (/* @__PURE__ */ new Date()).toISOString(),
            refundAmount,
            refundRemarks: `Customer cancelled order #${order.orderNumber}`
          }
        }
      });
      const alreadySettledToProvider = successPayment.providerSettlementStatus === "PAID";
      await tx.providerProfile.update({
        where: { id: order.providerId },
        data: {
          totalGrossRevenue: { decrement: refundAmount },
          totalProviderEarning: { decrement: providerEarning },
          totalPlatformFee: { decrement: platformFee },
          totalOrdersCompleted: { decrement: 1 },
          // Only reduce the payable balance when the payment has NOT yet been
          // settled.  If already settled, the funds left the platform and a
          // manual clawback process would be needed (out of scope for sandbox).
          ...alreadySettledToProvider ? {} : { currentPayableAmount: { decrement: providerEarning } }
        }
      });
    }
    return updatedOrder;
  });
  orderEventBus.emitOrderUpdate({
    orderId,
    status: updated.status,
    message: isOnlinePaid ? `Your order has been cancelled. Refund of \u09F3${refundAmount.toFixed(2)} has been initiated.` : "Your order has been cancelled.",
    updatedAt: updated.updatedAt.toISOString()
  });
  const customerEmail = order.customer?.email;
  const customerName = order.customerName ?? order.customer?.name ?? "Customer";
  if (customerEmail) {
    const emailData = buildRefundEmail({
      customerName,
      orderNumber: order.orderNumber,
      amount: Number(order.totalAmount),
      paymentMethod: order.paymentMethod,
      refundRefId: sandboxRefundRefId
    });
    sendEmail({ to: customerEmail, ...emailData }).catch(
      (e) => console.error("[cancelMyOrder] Refund email failed:", e?.message)
    );
  }
  return {
    order: updated,
    // The refund object is what the frontend modal reads to decide what to show
    refund: isOnlinePaid ? {
      attempted: true,
      success: true,
      refundRefId: sandboxRefundRefId,
      amount: refundAmount,
      isSandbox: true
    } : {
      attempted: false,
      reason: order.paymentMethod === "COD" ? "Cash on Delivery order \u2014 no payment to refund." : "Order was unpaid \u2014 no charge was made."
    }
  };
};
var getProviderOrders = async (userId, query) => {
  const provider = await getProviderProfile(userId);
  const page = Math.max(1, query?.page ?? 1);
  const limit = Math.min(50, Math.max(1, query?.limit ?? 20));
  const skip = (page - 1) * limit;
  const where = {
    providerId: provider.id,
    status: {
      in: query?.status ? [query.status] : ["PLACED", "ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "REFUNDED"]
    }
  };
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true, email: true } },
        orderItems: true,
        payments: { select: { id: true, status: true, amount: true } }
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.order.count({ where })
  ]);
  return {
    orders: orders.map((o) => ({ ...o, items: o.orderItems })),
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: skip + limit < total, hasPrevPage: page > 1 }
  };
};
var updateProviderOrderStatus = async (userId, orderId, payload) => {
  const provider = await getProviderProfile(userId);
  const order = await prisma.order.findFirst({ where: { id: orderId, providerId: provider.id } });
  if (!order) throw new NotFoundError("Order not found.");
  const allowedNext = ORDER_STATUS_TRANSITIONS[order.status];
  if (!allowedNext.includes(payload.status)) {
    throw new BadRequestError(`Invalid transition: ${order.status} \u2192 ${payload.status}.`);
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
    if (payload.status === "DELIVERED" && order.paymentMethod === "COD") {
      const amount = Number(order.totalAmount);
      const PLATFORM_FEE_RATE2 = 0.25;
      const platformFeeAmount = amount * PLATFORM_FEE_RATE2;
      const providerShareAmount = amount * (1 - PLATFORM_FEE_RATE2);
      await tx.payment.create({
        data: {
          orderId: order.id,
          customerId: order.customerId,
          providerId: order.providerId,
          amount,
          platformFeeAmount,
          providerShareAmount,
          transactionId: `COD-${order.orderNumber}`,
          status: "SUCCESS",
          gatewayName: "COD",
          paidAt: /* @__PURE__ */ new Date()
        }
      });
      await tx.providerProfile.update({
        where: { id: provider.id },
        data: {
          totalGrossRevenue: { increment: amount },
          totalProviderEarning: { increment: providerShareAmount },
          totalPlatformFee: { increment: platformFeeAmount },
          totalOrdersCompleted: { increment: 1 }
          // COD cash is collected by provider directly — do not increment
          // currentPayableAmount since the provider already has the cash.
        }
      });
    }
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
      provider: { select: { id: true, businessName: true, city: true, imageURL: true, phone: true } },
      orderItems: true,
      payments: {
        select: { id: true, status: true, amount: true, gatewayName: true, refundedAt: true, paymentGatewayData: true, createdAt: true }
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
    const result = await OrderService.getCheckoutPreview(req.user.id, req.body);
    sendResponse(res, { httpStatusCode: status9.OK, success: true, message: "Checkout preview generated.", data: result });
  } catch (e) {
    next(e);
  }
};
var createOrder2 = async (req, res, next) => {
  try {
    const result = await OrderService.createOrder(req.user.id, req.body);
    sendResponse(res, { httpStatusCode: status9.CREATED, success: true, message: "Order created successfully.", data: result });
  } catch (e) {
    next(e);
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
    sendResponse(res, { httpStatusCode: status9.OK, success: true, message: "Orders fetched.", data: result });
  } catch (e) {
    next(e);
  }
};
var getMyOrderDetail2 = async (req, res, next) => {
  try {
    const result = await OrderService.getMyOrderDetail(req.user.id, req.params.id);
    sendResponse(res, { httpStatusCode: status9.OK, success: true, message: "Order detail fetched.", data: result });
  } catch (e) {
    next(e);
  }
};
var cancelMyOrder2 = async (req, res, next) => {
  try {
    const result = await OrderService.cancelMyOrder(req.user.id, req.params.id);
    let message;
    const refund = result.refund;
    if (!refund.attempted) {
      message = refund.reason === "Cash on Delivery order \u2014 no payment to refund." ? "Order cancelled. No charge was made." : "Order cancelled. The order was unpaid \u2014 no charge was made.";
    } else {
      const amt = refund.amount.toFixed(2);
      message = `Order cancelled. Refund of \u09F3${amt} has been initiated (Ref: ${refund.refundRefId}).`;
    }
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message,
      data: result
    });
  } catch (e) {
    next(e);
  }
};
var getProviderOrders2 = async (req, res, next) => {
  try {
    const result = await OrderService.getProviderOrders(req.user.id, {
      ...req.query.status && { status: req.query.status },
      ...req.query.page && { page: Number(req.query.page) },
      ...req.query.limit && { limit: Number(req.query.limit) }
    });
    sendResponse(res, { httpStatusCode: status9.OK, success: true, message: "Provider orders fetched.", data: result });
  } catch (e) {
    next(e);
  }
};
var updateProviderOrderStatus2 = async (req, res, next) => {
  try {
    const result = await OrderService.updateProviderOrderStatus(req.user.id, req.params.id, req.body);
    sendResponse(res, { httpStatusCode: status9.OK, success: true, message: "Order status updated.", data: result });
  } catch (e) {
    next(e);
  }
};
var getOrderTracking2 = async (req, res, next) => {
  try {
    const result = await OrderService.getOrderTracking(req.user.id, req.params.id);
    sendResponse(res, { httpStatusCode: status9.OK, success: true, message: "Order tracking fetched.", data: result });
  } catch (e) {
    next(e);
  }
};
var streamOrderTracking = async (req, res) => {
  const orderId = req.params.id;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  const send = (p) => res.write(`data: ${JSON.stringify(p)}

`);
  send({ type: "CONNECTED", orderId, at: (/* @__PURE__ */ new Date()).toISOString() });
  const listener = (p) => send({ type: "ORDER_UPDATED", ...p });
  orderEventBus.subscribe(orderId, listener);
  const hb = setInterval(() => {
    res.write(`event: ping
data: ${JSON.stringify({ at: (/* @__PURE__ */ new Date()).toISOString() })}

`);
  }, 15e3);
  req.on("close", () => {
    clearInterval(hb);
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
var backendBaseUrl = config_default.BACKEND_PROD_HOST;
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
var PLATFORM_FEE_RATE = 0.25;
var finalizeSuccessPayment = async (payment, validation) => {
  await prisma.$transaction(async (tx) => {
    const guard = await tx.payment.updateMany({
      where: { id: payment.id, status: { not: "SUCCESS" } },
      data: { status: "SUCCESS" }
    });
    if (guard.count === 0) return;
    const paymentRecord = await tx.payment.findUnique({
      where: { id: payment.id }
    });
    if (!paymentRecord) {
      throw new AppError("Payment not found.", status10.NOT_FOUND);
    }
    const amount = Number(paymentRecord.amount);
    const feeRate = Number(paymentRecord.platformFeePercent) / 100;
    const platformFeeAmount = amount * feeRate;
    const providerShareAmount = amount * (1 - feeRate);
    await tx.payment.update({
      where: { id: payment.id },
      data: {
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
  const platformFeeAmount = amount * PLATFORM_FEE_RATE;
  const providerShareAmount = amount * (1 - PLATFORM_FEE_RATE);
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

// src/modules/reviews/review.routes.ts
import { Router as Router10 } from "express";

// src/modules/reviews/review.controller.ts
import status12 from "http-status";

// src/modules/reviews/review.service.ts
var createReview = async (userId, payload) => {
  const { orderId, mealId, rating, feedback } = payload;
  const order = await prisma.order.findFirst({
    where: { id: orderId, customerId: userId },
    include: {
      orderItems: { select: { mealId: true } }
    }
  });
  if (!order) {
    throw new NotFoundError("Order not found.");
  }
  if (order.status !== "DELIVERED") {
    throw new BadRequestError(
      "You can only review orders that have been delivered."
    );
  }
  const mealInOrder = order.orderItems.some((item) => item.mealId === mealId);
  if (!mealInOrder) {
    throw new BadRequestError("This meal was not part of the specified order.");
  }
  const existing = await prisma.review.findUnique({
    where: { userId_orderId: { userId, orderId } }
  });
  if (existing) {
    throw new ConflictError("You have already reviewed this order.");
  }
  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
    select: { id: true, providerId: true }
  });
  if (!meal) throw new NotFoundError("Meal not found.");
  const review = await prisma.review.create({
    data: {
      orderId,
      mealId,
      userId,
      providerId: meal.providerId,
      rating,
      feedback: feedback ?? null,
      images: []
    },
    include: {
      user: { select: { id: true, name: true, image: true } },
      meal: { select: { id: true, name: true, mainImageURL: true } }
    }
  });
  return review;
};
var getMyReviews = async (userId) => {
  const reviews = await prisma.review.findMany({
    where: { userId },
    include: {
      meal: { select: { id: true, name: true, mainImageURL: true } },
      provider: { select: { id: true, businessName: true, imageURL: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  return reviews;
};
var canReviewOrder = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, customerId: userId },
    select: { status: true }
  });
  if (!order) return { canReview: false, reason: "Order not found." };
  if (order.status !== "DELIVERED") {
    return { canReview: false, reason: "Order not yet delivered." };
  }
  const existing = await prisma.review.findUnique({
    where: { userId_orderId: { userId, orderId } },
    include: {
      meal: { select: { id: true, name: true } }
    }
  });
  if (existing) {
    return { canReview: false, reason: "Already reviewed.", existingReview: existing };
  }
  return { canReview: true };
};
var getProviderReviews = async (userId, query) => {
  const provider = await getProviderProfile(userId);
  const { page, limit, rating, mealId } = query;
  const skip = (page - 1) * limit;
  const where = {
    providerId: provider.id,
    ...rating && { rating: { gte: rating, lt: rating + 1 } },
    ...mealId && { mealId }
  };
  const [reviews, total, ratingStats] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, image: true } },
        meal: { select: { id: true, name: true, mainImageURL: true } },
        order: { select: { id: true, orderNumber: true } }
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.review.count({ where }),
    // Aggregate breakdown — always computed on full provider dataset, not filtered view
    prisma.review.aggregate({
      where: { providerId: provider.id },
      _avg: { rating: true },
      _count: { rating: true }
    })
  ]);
  const breakdown = await prisma.review.groupBy({
    by: ["rating"],
    where: { providerId: provider.id },
    _count: { rating: true }
  });
  const starBuckets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const b of breakdown) {
    const star = Math.ceil(b.rating);
    const clamped = Math.max(1, Math.min(5, star));
    starBuckets[clamped] = (starBuckets[clamped] ?? 0) + b._count.rating;
  }
  return {
    reviews,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: skip + limit < total,
      hasPrevPage: page > 1
    },
    stats: {
      averageRating: ratingStats._avg.rating ? Math.round(ratingStats._avg.rating * 10) / 10 : 0,
      totalReviews: ratingStats._count.rating,
      breakdown: starBuckets
    }
  };
};
var getPublicProviderReviews = async (providerId, query) => {
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(20, Math.max(1, query.limit ?? 6));
  const skip = (page - 1) * limit;
  const provider = await prisma.providerProfile.findUnique({
    where: { id: providerId },
    select: { id: true }
  });
  if (!provider) throw new NotFoundError("Provider not found.");
  const [reviews, total, agg] = await Promise.all([
    prisma.review.findMany({
      where: { providerId },
      include: {
        user: { select: { id: true, name: true, image: true } },
        meal: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.review.count({ where: { providerId } }),
    prisma.review.aggregate({
      where: { providerId },
      _avg: { rating: true }
    })
  ]);
  return {
    reviews,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: skip + limit < total,
      hasPrevPage: page > 1
    },
    averageRating: agg._avg.rating ? Math.round(agg._avg.rating * 10) / 10 : 0
  };
};
var getMealReviews = async (mealId, query) => {
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(20, Math.max(1, query.limit ?? 6));
  const skip = (page - 1) * limit;
  const [reviews, total, agg] = await Promise.all([
    prisma.review.findMany({
      where: { mealId },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.review.count({ where: { mealId } }),
    prisma.review.aggregate({
      where: { mealId },
      _avg: { rating: true }
    })
  ]);
  return {
    reviews,
    averageRating: agg._avg.rating ? Math.round(agg._avg.rating * 10) / 10 : 0,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};
var ReviewService = {
  createReview,
  getMyReviews,
  canReviewOrder,
  getProviderReviews,
  getPublicProviderReviews,
  getMealReviews
};

// src/modules/reviews/review.controller.ts
var createReview2 = async (req, res, next) => {
  try {
    const result = await ReviewService.createReview(
      req.user.id,
      req.body
    );
    sendResponse(res, {
      httpStatusCode: status12.CREATED,
      success: true,
      message: "Review submitted successfully. Thank you for your feedback!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getMyReviews2 = async (req, res, next) => {
  try {
    const result = await ReviewService.getMyReviews(req.user.id);
    sendResponse(res, {
      httpStatusCode: status12.OK,
      success: true,
      message: "Reviews fetched successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var canReviewOrder2 = async (req, res, next) => {
  try {
    const result = await ReviewService.canReviewOrder(
      req.user.id,
      req.params.orderId
    );
    sendResponse(res, {
      httpStatusCode: status12.OK,
      success: true,
      message: "Check complete.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getProviderReviews2 = async (req, res, next) => {
  try {
    const query = {
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 10),
      rating: req.query.rating ? Number(req.query.rating) : void 0,
      mealId: req.query.mealId
    };
    const result = await ReviewService.getProviderReviews(req.user.id, query);
    sendResponse(res, {
      httpStatusCode: status12.OK,
      success: true,
      message: "Reviews fetched successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getPublicProviderReviews2 = async (req, res, next) => {
  try {
    const result = await ReviewService.getPublicProviderReviews(
      req.params.providerId,
      {
        page: Number(req.query.page ?? 1),
        limit: Number(req.query.limit ?? 6)
      }
    );
    sendResponse(res, {
      httpStatusCode: status12.OK,
      success: true,
      message: "Reviews fetched successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getMealReviews2 = async (req, res, next) => {
  try {
    const result = await ReviewService.getMealReviews(req.params.mealId, {
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 6)
    });
    sendResponse(res, {
      httpStatusCode: status12.OK,
      success: true,
      message: "Meal reviews fetched successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var ReviewController = {
  createReview: createReview2,
  getMyReviews: getMyReviews2,
  canReviewOrder: canReviewOrder2,
  getProviderReviews: getProviderReviews2,
  getPublicProviderReviews: getPublicProviderReviews2,
  getMealReviews: getMealReviews2
};

// src/modules/reviews/review.validation.ts
import { z as z8 } from "zod";
var createReviewSchema = z8.object({
  orderId: z8.string().uuid("orderId must be a valid UUID"),
  mealId: z8.string().uuid("mealId must be a valid UUID"),
  rating: z8.number("Rating is required.").min(1, "Rating must be at least 1.").max(5, "Rating must be at most 5."),
  feedback: z8.string().max(1e3, "Feedback must be at most 1000 characters.").optional()
});
var getProviderReviewsQuerySchema = z8.object({
  page: z8.coerce.number().min(1).default(1),
  limit: z8.coerce.number().min(1).max(50).default(10),
  rating: z8.coerce.number().min(1).max(5).optional(),
  // filter by exact star
  mealId: z8.string().uuid().optional()
  // filter by meal
});

// src/modules/reviews/review.routes.ts
var router10 = Router10();
router10.post(
  "/",
  auth_middleware_default("CUSTOMER" /* CUSTOMER */),
  validateRequest_default(createReviewSchema),
  ReviewController.createReview
);
router10.get(
  "/my",
  auth_middleware_default("CUSTOMER" /* CUSTOMER */),
  ReviewController.getMyReviews
);
router10.get(
  "/can-review/:orderId",
  auth_middleware_default("CUSTOMER" /* CUSTOMER */),
  ReviewController.canReviewOrder
);
router10.get(
  "/provider",
  auth_middleware_default("PROVIDER" /* PROVIDER */),
  ReviewController.getProviderReviews
);
router10.get(
  "/public/provider/:providerId",
  ReviewController.getPublicProviderReviews
);
router10.get(
  "/public/meal/:mealId",
  ReviewController.getMealReviews
);
var ReviewRoutes = router10;

// src/modules/support/support.routes.ts
import { Router as Router11 } from "express";

// src/modules/support/support.service.ts
var createMessage = async (payload) => {
  const message = await prisma.supportMessage.create({
    data: {
      name: payload.name,
      email: payload.email,
      subject: payload.subject ?? null,
      category: payload.category,
      message: payload.message,
      status: "UNREAD"
    }
  });
  return message;
};
var getMessages = async (query) => {
  const { page, limit, status: status14, category, search } = query;
  const skip = (page - 1) * limit;
  const where = {
    ...status14 && { status: status14 },
    ...category && { category },
    ...search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } }
      ]
    }
  };
  const [messages, total] = await Promise.all([
    prisma.supportMessage.findMany({
      where,
      orderBy: [
        { status: "asc" },
        // UNREAD first (alphabetically before READ/RESOLVED)
        { createdAt: "desc" }
      ],
      skip,
      take: limit
    }),
    prisma.supportMessage.count({ where })
  ]);
  const [unreadCount, readCount, resolvedCount] = await Promise.all([
    prisma.supportMessage.count({ where: { status: "UNREAD" } }),
    prisma.supportMessage.count({ where: { status: "READ" } }),
    prisma.supportMessage.count({ where: { status: "RESOLVED" } })
  ]);
  return {
    messages,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    },
    counts: { unread: unreadCount, read: readCount, resolved: resolvedCount }
  };
};
var getMessageById = async (id) => {
  const message = await prisma.supportMessage.findUnique({ where: { id } });
  if (!message) throw new NotFoundError("Support message not found.");
  if (message.status === "UNREAD") {
    await prisma.supportMessage.update({
      where: { id },
      data: { status: "READ" }
    });
    return { ...message, status: "READ" };
  }
  return message;
};
var updateMessageStatus = async (id, payload) => {
  const message = await prisma.supportMessage.findUnique({ where: { id } });
  if (!message) throw new NotFoundError("Support message not found.");
  const updated = await prisma.supportMessage.update({
    where: { id },
    data: {
      status: payload.status,
      ...payload.note !== void 0 && { note: payload.note }
    }
  });
  return updated;
};
var deleteMessage = async (id) => {
  const message = await prisma.supportMessage.findUnique({ where: { id } });
  if (!message) throw new NotFoundError("Support message not found.");
  await prisma.supportMessage.delete({ where: { id } });
};
var SupportService = {
  createMessage,
  getMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage
};

// src/modules/support/support.validation.ts
import { z as z9 } from "zod";
var createSupportMessageSchema = z9.object({
  name: z9.string().min(2, "Name must be at least 2 characters.").max(80, "Name cannot exceed 80 characters."),
  email: z9.string().email("Please provide a valid email address.").max(150, "Email cannot exceed 150 characters."),
  subject: z9.string().max(150, "Subject cannot exceed 150 characters.").optional(),
  category: z9.enum(
    ["ORDER", "REFUND", "PROVIDER", "ACCOUNT", "PARTNERSHIP", "OTHER"],
    { error: "Please select a valid category." }
  ),
  message: z9.string().min(10, "Message must be at least 10 characters.").max(1e3, "Message cannot exceed 1000 characters.")
});
var supportMessageListQuerySchema = z9.object({
  page: z9.coerce.number().int().min(1).default(1),
  limit: z9.coerce.number().int().min(1).max(50).default(20),
  status: z9.enum(["UNREAD", "READ", "RESOLVED"]).optional(),
  category: z9.enum(["ORDER", "REFUND", "PROVIDER", "ACCOUNT", "PARTNERSHIP", "OTHER"]).optional(),
  search: z9.string().optional()
});
var updateSupportMessageStatusSchema = z9.object({
  status: z9.enum(["UNREAD", "READ", "RESOLVED"]),
  note: z9.string().max(500).optional()
});

// src/modules/support/support.controller.ts
import status13 from "http-status";
var createMessage2 = async (req, res, next) => {
  try {
    const result = await SupportService.createMessage(req.body);
    sendResponse(res, {
      httpStatusCode: status13.CREATED,
      success: true,
      message: "Your message has been received. We'll get back to you soon.",
      data: { id: result.id }
    });
  } catch (e) {
    next(e);
  }
};
var getMessages2 = async (req, res, next) => {
  try {
    const query = supportMessageListQuerySchema.parse(req.query);
    const result = await SupportService.getMessages(query);
    sendResponse(res, {
      httpStatusCode: status13.OK,
      success: true,
      message: "Support messages fetched.",
      data: result
    });
  } catch (e) {
    next(e);
  }
};
var getMessageById2 = async (req, res, next) => {
  try {
    const result = await SupportService.getMessageById(req.params.id);
    sendResponse(res, {
      httpStatusCode: status13.OK,
      success: true,
      message: "Support message fetched.",
      data: result
    });
  } catch (e) {
    next(e);
  }
};
var updateMessageStatus2 = async (req, res, next) => {
  try {
    const payload = updateSupportMessageStatusSchema.parse(req.body);
    const result = await SupportService.updateMessageStatus(
      req.params.id,
      payload
    );
    sendResponse(res, {
      httpStatusCode: status13.OK,
      success: true,
      message: "Message status updated.",
      data: result
    });
  } catch (e) {
    next(e);
  }
};
var deleteMessage2 = async (req, res, next) => {
  try {
    await SupportService.deleteMessage(req.params.id);
    sendResponse(res, {
      httpStatusCode: status13.OK,
      success: true,
      message: "Message deleted."
    });
  } catch (e) {
    next(e);
  }
};
var SupportController = {
  createMessage: createMessage2,
  getMessages: getMessages2,
  getMessageById: getMessageById2,
  updateMessageStatus: updateMessageStatus2,
  deleteMessage: deleteMessage2
};

// src/modules/support/support.routes.ts
var router11 = Router11();
router11.post(
  "/",
  validateRequest_default(createSupportMessageSchema),
  SupportController.createMessage
);
var SupportPublicRoutes = router11;
var adminRouter = Router11();
adminRouter.get("/", SupportController.getMessages);
adminRouter.get("/:id", SupportController.getMessageById);
adminRouter.patch("/:id", SupportController.updateMessageStatus);
adminRouter.delete("/:id", SupportController.deleteMessage);
var SupportAdminRoutes = adminRouter;

// src/routes/index.ts
var router12 = Router12();
router12.use("/auth", AuthRoutes);
router12.use("/public", PublicRoutes);
router12.use("/support", SupportPublicRoutes);
router12.use("/customers", CustomerRoutes);
router12.use("/cart", CartRoutes);
router12.use("/orders", OrderRoutes);
router12.use("/payments", PaymentRoutes);
router12.use("/reviews", ReviewRoutes);
router12.use("/provider/meals", MealRoutes);
router12.use("/providers", ProviderRoutes);
router12.use("/admins", auth_middleware_default("ADMIN" /* ADMIN */, "SUPER_ADMIN" /* SUPER_ADMIN */), adminGuard, AdminRoutes);
router12.use(
  "/admins/support",
  auth_middleware_default("ADMIN" /* ADMIN */, "SUPER_ADMIN" /* SUPER_ADMIN */),
  adminGuard,
  SupportAdminRoutes
);
var IndexRoutes = router12;

// src/app.ts
import { toNodeHandler } from "better-auth/node";
var app = express();
app.use(cookieParser());
app.use(cors({
  origin: [
    config_default.frontend_local_host,
    config_default.frontend_production_host,
    config_default.BETTER_AUTH_URL
  ].filter(Boolean),
  credentials: true
}));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/v1", IndexRoutes);
app.get("/", (req, res) => {
  res.send("Hello from Platera server side");
});
app.use(notFoundHandler_default);
app.use(globalErrorHandler_default);
var app_default = app;

// src/vercel.ts
var vercel_default = app_default;
export {
  vercel_default as default
};
