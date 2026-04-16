import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import status from 'http-status';
import { PublicService } from './public.service';

const getCategories = async(req: Request, res: Response, next:NextFunction) =>{
  try {
    const result = await PublicService.getCategories();
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message:"Categories fetched successfully.",
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const PublicController = {
  getCategories
}