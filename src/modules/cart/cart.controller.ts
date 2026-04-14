import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { CartService } from "./cart.service";
import { TAddCartItem, TUpdateCartItemQuantity } from "./cart.validation";

const getMyCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await CartService.getMyCart(req.user.id);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: result ? "Cart fetched successfully." : "Cart is empty.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const addItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = req.body as TAddCartItem;

    const result = await CartService.addItem(req.user.id, payload);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Item added to cart successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateItemQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemId } = req.params as { itemId: string };
    const payload = req.body as TUpdateCartItemQuantity;

    const result = await CartService.updateItemQuantity(
      req.user.id,
      itemId,
      payload
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Cart item quantity updated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const removeItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemId } = req.params as { itemId: string };

    const result = await CartService.removeItem(req.user.id, itemId);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: result ? "Cart item removed successfully." : "Cart cleared successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await CartService.clearCart(req.user.id);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Cart cleared successfully.",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const CartController = {
  getMyCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
};