import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import status from 'http-status';
import { PublicService } from './public.service';

const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await PublicService.getCategories();
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Categories fetched successfully.",
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getRestaurants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, city, categoryId, subcategory, businessCategory, page = "1", limit = "12" } = req.query as Record<string, string>;
    const result = await PublicService.getRestaurants({
      ...(search && { search }),
      ...(city && { city }),
      ...(categoryId && { categoryId }),
      ...(subcategory && { subcategory }),
      ...(businessCategory && { businessCategory }),
      page: parseInt(page),
      limit: parseInt(limit),
    });
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Restaurants fetched successfully.", data: result });
  } catch (error) { next(error); }
};

const getRestaurantById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { search, categoryId, subcategory, dietary, sortBy } = req.query as Record<string, string>;
    const result = await PublicService.getRestaurantById(id as string, {
      ...(search && { search }),
      ...(categoryId && { categoryId }),
      ...(subcategory && { subcategory }),
      ...(dietary && { dietary }),
      ...(sortBy && { sortBy }),
    });
    if (!result) {
      sendResponse(res, { httpStatusCode: status.NOT_FOUND, success: false, message: "Restaurant not found.", data: null });
      return;
    }
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Restaurant fetched successfully.", data: result });
  } catch (error) { next(error); }
};

const getFeaturedRestaurants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await PublicService.getFeaturedRestaurants();
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Featured restaurants fetched.", data: result });
  } catch (error) { next(error); }
};

export const PublicController = { getCategories, getRestaurants, getRestaurantById, getFeaturedRestaurants };