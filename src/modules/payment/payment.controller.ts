import { Request, Response, NextFunction } from "express";
import { PaymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const initiatePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.body;

    const result = await PaymentService.initiatePayment(
      req.user.id,
      orderId
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Payment initiated",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const ipnHandler = async (req: Request, res: Response) => {
  await PaymentService.handleIPN(req.body);
  res.send("OK");
};

export const PaymentController = {
  initiatePayment,
  ipnHandler,
};