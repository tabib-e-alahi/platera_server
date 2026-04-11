// src/modules/meal/meal.controller.ts

import { Request, Response, NextFunction } from "express";
import { MealService } from "./meal.service";
import {
  TCreateMeal,
  TUpdateMeal,
  TToggleAvailability,
} from "./meal.validation";
import status from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { extractMealImages } from "../../utils/extractFiles";

const getMyMeals = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const isAvailable =
      req.query.isAvailable !== undefined
        ? req.query.isAvailable === "true"
        : undefined;
    const categoryId = req.query.categoryId as string | undefined;
    const search = req.query.search as string | undefined;

    const filterObject: {
      page: number;
      limit: number;
      isAvailable?: boolean;
      categoryId?: string;
      search?: string;
    } = {
      page,
      limit,
    };

    if (isAvailable !== undefined) filterObject.isAvailable = isAvailable;
    if (categoryId !== undefined) filterObject.categoryId = categoryId;
    if (search !== undefined) filterObject.search = search;

    const result = await MealService.getMyMeals(req.user.id, filterObject);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Meals fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMyMealById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await MealService.getMyMealById(
      req.params.id as string,
      req.user.id
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Meal fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const createMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = req.body as TCreateMeal;
    const images = extractMealImages(req);

    const result = await MealService.createMeal(
      req.user.id,
      payload,
      images
    );

    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "Meal created successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = req.body as TUpdateMeal;
    const images = extractMealImages(req);

    const result = await MealService.updateMeal(
      req.params.id as string, 
      req.user.id,
      payload,
      images
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Meal updated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const toggleAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { isAvailable } = req.body as TToggleAvailability;

    const result = await MealService.toggleAvailability(
      req.params.id as string,
      req.user.id,
      isAvailable
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: `Meal marked as ${isAvailable ? "available" : "unavailable"}.`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await MealService.deleteMeal(req.params.id as string, req.user.id);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Meal deleted successfully.",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const deleteGalleryImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { imageURL } = req.body as { imageURL: string };

    const result = await MealService.deleteGalleryImage(
      req.params.id as string,
      req.user.id,
      imageURL
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Gallery image deleted successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const MealController = {
  getMyMeals,
  getMyMealById,
  createMeal,
  updateMeal,
  toggleAvailability,
  deleteMeal,
  deleteGalleryImage,
};