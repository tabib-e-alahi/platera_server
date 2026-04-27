// src/modules/order/order.controller.ts  — FULL REPLACEMENT

import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { OrderService } from "./order.service";
import { TCheckoutPreviewPayload, TCreateOrderPayload, TUpdateOrderStatusPayload } from "./order.validation";
import { orderEventBus } from "./order.event";

const getCheckoutPreview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await OrderService.getCheckoutPreview(req.user.id, req.body as TCheckoutPreviewPayload);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Checkout preview generated.", data: result });
  } catch (e) { next(e); }
};

const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await OrderService.createOrder(req.user.id, req.body as TCreateOrderPayload);
    sendResponse(res, { httpStatusCode: status.CREATED, success: true, message: "Order created successfully.", data: result });
  } catch (e) { next(e); }
};

const getMyOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await OrderService.getMyOrders(req.user.id, {
      ...(req.query.status && { status: req.query.status as string }),
      ...(req.query.page   && { page:   Number(req.query.page) }),
      ...(req.query.limit  && { limit:  Number(req.query.limit) }),
      ...(req.query.search && { search: req.query.search as string }),
    });
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Orders fetched.", data: result });
  } catch (e) { next(e); }
};

const getMyOrderDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await OrderService.getMyOrderDetail(req.user.id, req.params.id as string);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Order detail fetched.", data: result });
  } catch (e) { next(e); }
};

/* ─── cancelMyOrder ───────────────────────────────────────────────────────
   Returns full refund info in `data.refund` so the frontend can:
   - Show a green "Refund of ৳X initiated" if refund.attempted === true
   - Show "No charge made" for COD / unpaid orders
   - Show a useful message from the server in `message`
   ─────────────────────────────────────────────────────────────────────── */
const cancelMyOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await OrderService.cancelMyOrder(req.user.id, req.params.id as string);

    // Build a clear human-readable message based on what happened
    let message: string;
    const refund = result.refund;

    if (!refund.attempted) {
      // COD or unpaid order
      message =
        refund.reason === "Cash on Delivery order — no payment to refund."
          ? "Order cancelled. No charge was made."
          : "Order cancelled. The order was unpaid — no charge was made.";
    } else {
      // Online paid order — sandbox simulation always succeeds
      const amt = refund.amount.toFixed(2);
      message = `Order cancelled. Refund of ৳${amt} has been initiated (Ref: ${refund.refundRefId}).`;
    }

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message,
      data: result,
    });
  } catch (e) { next(e); }
};

const getProviderOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await OrderService.getProviderOrders(req.user.id, {
      ...(req.query.status && { status: req.query.status as string }),
      ...(req.query.page   && { page:   Number(req.query.page) }),
      ...(req.query.limit  && { limit:  Number(req.query.limit) }),
    });
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Provider orders fetched.", data: result });
  } catch (e) { next(e); }
};

const updateProviderOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await OrderService.updateProviderOrderStatus(req.user.id, req.params.id as string, req.body as TUpdateOrderStatusPayload);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Order status updated.", data: result });
  } catch (e) { next(e); }
};

const getOrderTracking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await OrderService.getOrderTracking(req.user.id, req.params.id as string);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Order tracking fetched.", data: result });
  } catch (e) { next(e); }
};

/** SSE real-time order stream */
const streamOrderTracking = async (req: Request, res: Response): Promise<void> => {
  const orderId = req.params.id as string;
  res.setHeader("Content-Type",  "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection",    "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  const send = (p: unknown) => res.write(`data: ${JSON.stringify(p)}\n\n`);
  send({ type: "CONNECTED", orderId, at: new Date().toISOString() });

  const listener = (p: any) => send({ type: "ORDER_UPDATED", ...p });
  orderEventBus.subscribe(orderId, listener);

  const hb = setInterval(() => {
    res.write(`event: ping\ndata: ${JSON.stringify({ at: new Date().toISOString() })}\n\n`);
  }, 15000);

  req.on("close", () => { clearInterval(hb); orderEventBus.unsubscribe(orderId, listener); res.end(); });
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