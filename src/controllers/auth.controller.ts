import { NextFunction, Request, Response } from "express"
import { BaseResponse } from "../models/response-model"
import { Users } from "@prisma/client"
import { userRegister, userLogin } from "../services/auth.service"

export const createUser = async (req: Request, res: Response<BaseResponse<Users>>, next: NextFunction) => {
  try {
    const body = req.body
    const pic = req.file
    res.status(200).json({
      message: 'Success',
      success: true,
      data: await userRegister(body, pic)
    })
  } catch (error) {
    next(error)
  }
}

export const checkLogin = async (req: Request, res: Response<BaseResponse<Users>>, next: NextFunction) => {
  try {
    const body = req.body
    res.status(200).json({
      message: 'Success',
      success: true,
      data: await userLogin(body)
    })
  } catch (error) {
    next(error)
  }
}