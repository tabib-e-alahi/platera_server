import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { OrderService } from "./order.service";
import {
  TCheckoutPreviewPayload,
  TCreateOrderPayload,
} from "./order.validation";

const getCheckoutPreview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = req.body as TCheckoutPreviewPayload;
    const result = await OrderService.getCheckoutPreview(req.user.id, payload);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Checkout preview generated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = req.body as TCreateOrderPayload;
    const result = await OrderService.createOrder(req.user.id, payload);

    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "Order created successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await OrderService.getMyOrders(req.user.id);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Orders fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrderDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await OrderService.getMyOrderDetail(
      req.user.id,
      req.params.id as string
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Order detail fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const OrderController = {
  getCheckoutPreview,
  createOrder,
  getMyOrders,
  getMyOrderDetail,
};