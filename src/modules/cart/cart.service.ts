
import { prisma } from "../../lib/prisma";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../../errors/AppError";
import { computeDiscount } from "../../utils/discount.util";
import { TAddCartItem, TUpdateCartItemQuantity } from "./cart.validation";
import { Prisma } from "../../../generated/prisma/client";

const normalizeCity = (city: string) => city.trim().toUpperCase();

type TCartWithRelations = Awaited<ReturnType<typeof getCartWithRelations>>;

const getCartWithRelations = async (cartId: string) => {
  return prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      provider: {
        select: {
          id: true,
          businessName: true,
          city: true,
          imageURL: true,
        },
      },
      items: {
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
              isActive: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
};

const getCustomerProfileOrThrow = async (userId: string) => {
  const customerProfile = await prisma.customerProfile.findUnique({
    where: { userId },
  });

  if (!customerProfile) {
    throw new ForbiddenError(
      "Please complete your customer profile before using the cart."
    );
  }

  return customerProfile;
};

const recalculateCartTotals = async (
  tx: Prisma.TransactionClient,
  cartId: string
): Promise<TCartWithRelations> => {
  const items = await tx.cartItem.findMany({
    where: { cartId },
    include: {
      meal: {
        select: {
          deliveryFee: true,
        },
      },
    },
  });

  const subtotal = items.reduce(
    (sum: number, item: any) => sum + Number(item.totalPrice),
    0
  );

  const discountAmount = items.reduce(
    (sum: number, item: any) =>
      sum + (Number(item.baseUnitPrice) - Number(item.unitPrice)) * item.quantity,
    0
  );

  const deliveryFee =
    items.length > 0
      ? Math.max(...items.map((item: any) => Number(item.meal.deliveryFee || 0)))
      : 0;

  const totalAmount = subtotal + deliveryFee;

  await tx.cart.update({
    where: { id: cartId },
    data: {
      subtotal,
      discountAmount,
      deliveryFee,
      totalAmount,
    },
  });

  const updatedCart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      provider: {
        select: {
          id: true,
          businessName: true,
          city: true,
          imageURL: true,
        },
      },
      items: {
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
              isActive: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!updatedCart) {
    throw new NotFoundError("Cart not found after recalculation.");
  }

  return updatedCart;
};

const getMyCart = async (userId: string) => {
  const customerProfile = await getCustomerProfileOrThrow(userId);

  const cart = await prisma.cart.findUnique({
    where: {
      customerId: customerProfile.id,
    },
    include: {
      provider: {
        select: {
          id: true,
          businessName: true,
          city: true,
          imageURL: true,
        },
      },
      items: {
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
              isActive: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return cart;
};

const addItem = async (userId: string, payload: TAddCartItem) => {
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
          isActive: true,
        },
      },
    },
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

  const customerCity = normalizeCity(customerProfile.city);
  const providerCity = normalizeCity(meal.provider.city);

  if (customerCity !== providerCity) {
    throw new ForbiddenError(
      `This provider only serves customers in ${meal.provider.city}.`
    );
  }

  const quantity = payload.quantity ?? 1;

  const discountInfo = computeDiscount({
    basePrice: Number(meal.basePrice),
    discountPrice:
      meal.discountPrice !== null && meal.discountPrice !== undefined
        ? Number(meal.discountPrice)
        : null,
    discountStartDate: meal.discountStartDate,
    discountEndDate: meal.discountEndDate,
  });

  const unitPrice = discountInfo.effectivePrice;
  const baseUnitPrice = Number(meal.basePrice);
  const totalPrice = unitPrice * quantity;

  const result = await prisma.$transaction(async (tx) => {
    let cart = await tx.cart.findUnique({
      where: { customerId: customerProfile.id },
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
          totalAmount: 0,
        },
      });
    }

    const existingItem = await tx.cartItem.findUnique({
      where: {
        cartId_mealId: {
          cartId: cart.id,
          mealId: meal.id,
        },
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      await tx.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: newQuantity,
          baseUnitPrice,
          unitPrice,
          totalPrice: unitPrice * newQuantity,
        },
      });
    } else {
      await tx.cartItem.create({
        data: {
          cartId: cart.id,
          mealId: meal.id,
          quantity,
          baseUnitPrice,
          unitPrice,
          totalPrice,
        },
      });
    }

    return recalculateCartTotals(tx, cart.id);
  });

  return result;
};

const updateItemQuantity = async (
  userId: string,
  itemId: string,
  payload: TUpdateCartItemQuantity
) => {
  const customerProfile = await getCustomerProfileOrThrow(userId);

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: {
      cart: true,
      meal: true,
    },
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
    discountPrice:
      item.meal.discountPrice !== null && item.meal.discountPrice !== undefined
        ? Number(item.meal.discountPrice)
        : null,
    discountStartDate: item.meal.discountStartDate,
    discountEndDate: item.meal.discountEndDate,
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
        totalPrice,
      },
    });

    return recalculateCartTotals(tx, item.cartId);
  });

  return result;
};

const removeItem = async (userId: string, itemId: string) => {
  const customerProfile = await getCustomerProfileOrThrow(userId);

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: {
      cart: true,
    },
  });

  if (!item) {
    throw new NotFoundError("Cart item not found.");
  }

  if (item.cart.customerId !== customerProfile.id) {
    throw new ForbiddenError("You cannot modify another customer's cart.");
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.cartItem.delete({
      where: { id: item.id },
    });

    const remainingCount = await tx.cartItem.count({
      where: { cartId: item.cartId },
    });

    if (remainingCount === 0) {
      await tx.cart.delete({
        where: { id: item.cartId },
      });

      return null;
    }

    return recalculateCartTotals(tx, item.cartId);
  });

  return result;
};

const clearCart = async (userId: string) => {
  const customerProfile = await getCustomerProfileOrThrow(userId);

  const cart = await prisma.cart.findUnique({
    where: { customerId: customerProfile.id },
    select: { id: true },
  });

  if (!cart) {
    return null;
  }

  await prisma.cart.delete({
    where: { id: cart.id },
  });

  return null;
};

export const CartService = {
  getMyCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
};