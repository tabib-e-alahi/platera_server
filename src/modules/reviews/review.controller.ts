// src/modules/review/review.controller.ts

import { Request, Response, NextFunction } from "express";
import status from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { ReviewService } from "./review.service";
import { TCreateReview, TGetProviderReviewsQuery } from "./review.validation";

const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await ReviewService.createReview(
      req.user.id,
      req.body as TCreateReview
    );
    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "Review submitted successfully. Thank you for your feedback!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMyReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await ReviewService.getMyReviews(req.user.id);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Reviews fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const canReviewOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await ReviewService.canReviewOrder(
      req.user.id,
      req.params.orderId as string
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Check complete.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getProviderReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query: TGetProviderReviewsQuery = {
      page:   Number(req.query.page  ?? 1),
      limit:  Number(req.query.limit ?? 10),
      rating: req.query.rating ? Number(req.query.rating) : undefined,
      mealId: req.query.mealId as string | undefined,
    };
    const result = await ReviewService.getProviderReviews(req.user.id, query);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Reviews fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getPublicProviderReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await ReviewService.getPublicProviderReviews(
      req.params.providerId as string,
      {
        page:  Number(req.query.page  ?? 1),
        limit: Number(req.query.limit ?? 6),
      }
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Reviews fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMealReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await ReviewService.getMealReviews(req.params.mealId as string, {
      page:  Number(req.query.page  ?? 1),
      limit: Number(req.query.limit ?? 6),
    });
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Meal reviews fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const ReviewController = {
  createReview,
  getMyReviews,
  canReviewOrder,
  getProviderReviews,
  getPublicProviderReviews,
  getMealReviews,
};