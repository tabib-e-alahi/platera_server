import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { sendResponse } from '../../utils/sendResponse';
import status from 'http-status';



const registerCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;

    const result = await AuthService.registerCustomer(payload);

    return sendResponse(res, { httpStatusCode: status.CREATED, success: true, message: "Customer registered successfully", data: result })

  } catch (error) {
    next(error)
  }
}

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;

    const result = await AuthService.loginUser(payload);

    return sendResponse(res, { httpStatusCode: status.OK
      , success: true, message: "Login successful", data: result })

  } catch (error) {
    next(error)
  }
}


export const AuthControler = {
  registerCustomer,
  loginUser
}