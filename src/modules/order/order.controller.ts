import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { OrderService } from "./order.service";
import {
  TCheckoutPreviewPayload,
  TCreateOrderPayload,
  TUpdateOrderStatusPayload,
} from "./order.validation";
import { orderEventBus } from "./order.event";

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
    const result = await OrderService.getMyOrders(req.user.id, {
      ...(req.query.status && { status: req.query.status as string }),
      ...(req.query.page && { page: Number(req.query.page) }),
      ...(req.query.limit && { limit: Number(req.query.limit) }),
      ...(req.query.search && { search: req.query.search as string }),
    });
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Orders fetched successfully.",
      data: {
        orders: result.orders,
        pagination: result.pagination,
      },
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

const cancelMyOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await OrderService.cancelMyOrder(
      req.user.id,
      req.params.id as string
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Order cancelled successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getProviderOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await OrderService.getProviderOrders(req.user.id, {
      ...(req.query.status && { status: req.query.status as string }),
      ...(req.query.page && { page: Number(req.query.page) }),
      ...(req.query.limit && { limit: Number(req.query.limit) }),
    });
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Provider orders fetched successfully.",
      data: {
        orders: result.orders,
        pagination: result.pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateProviderOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = req.body as TUpdateOrderStatusPayload;
    const result = await OrderService.updateProviderOrderStatus(
      req.user.id,
      req.params.id as string,
      payload
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Order status updated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getOrderTracking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await OrderService.getOrderTracking(
      req.user.id,
      req.params.id as string
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Order tracking fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * SSE endpoint for real-time order status updates.
 * The client connects here and receives push events whenever
 * the order's status changes.
 */
const streamOrderTracking = async (
  req: Request,
  res: Response
): Promise<void> => {
  const orderId = req.params.id as string;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // disable nginx buffering

  const send = (payload: unknown) => {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  // Send initial connection acknowledgement
  send({
    type: "CONNECTED",
    orderId,
    at: new Date().toISOString(),
  });

  const listener = (payload: any) => {
    send({ type: "ORDER_UPDATED", ...payload });
  };

  orderEventBus.subscribe(orderId, listener);

  // Heartbeat to keep the connection alive through proxies
  const heartbeat = setInterval(() => {
    res.write(
      `event: ping\ndata: ${JSON.stringify({ at: new Date().toISOString() })}\n\n`
    );
  }, 15000);

  req.on("close", () => {
    clearInterval(heartbeat);
    orderEventBus.unsubscribe(orderId, listener);
    res.end();
  });
};

export const OrderController = {
  getCheckoutPreview,
  createOrder,
  getMyOrders,
  getMyOrderDetail,
  cancelMyOrder,
  getProviderOrders,
  updateProviderOrderStatus,
  getOrderTracking,
  streamOrderTracking,
};