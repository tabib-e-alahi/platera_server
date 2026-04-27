// src/modules/support/support.controller.ts

import { Request, Response, NextFunction } from "express";
import { SupportService } from "./support.service";
import {
  supportMessageListQuerySchema,
  updateSupportMessageStatusSchema,
} from "./support.validation";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

// POST /public/support — called by the contact form (no auth required)
const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await SupportService.createMessage(req.body);
    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "Your message has been received. We'll get back to you soon.",
      data: { id: result.id },
    });
  } catch (e) {
    next(e);
  }
};

// GET /admins/support — list with filters
const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = supportMessageListQuerySchema.parse(req.query);
    const result = await SupportService.getMessages(query);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Support messages fetched.",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

// GET /admins/support/:id — single message (auto-marks READ)
const getMessageById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await SupportService.getMessageById(req.params.id as string);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Support message fetched.",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

// PATCH /admins/support/:id — update status / note
const updateMessageStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = updateSupportMessageStatusSchema.parse(req.body);
    const result = await SupportService.updateMessageStatus(
      req.params.id as string,
      payload
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Message status updated.",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

// DELETE /admins/support/:id
const deleteMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await SupportService.deleteMessage(req.params.id as string);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Message deleted.",
    });
  } catch (e) {
    next(e);
  }
};

export const SupportController = {
  createMessage,
  getMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
};
