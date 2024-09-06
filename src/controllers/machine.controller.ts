import { Request, Response, NextFunction } from "express"
import { BaseResponse } from "../models"
import { Machines } from "@prisma/client"
import { createMachine, machineList, removeMachine, searchMachine, updateMachine } from "../services"

export const addMachine = async (req: Request, res: Response<BaseResponse<Machines>>, next: NextFunction) => {
  try {
    const body = req.body
    res.status(200).json({
      message: 'Create Machine Success',
      success: true,
      data: await createMachine(body)
    })
  } catch (error) {
    next(error)
  }
}

export const getMachine = async (req: Request, res: Response<BaseResponse<Machines[]>>, next: NextFunction) => {
  try {
    res.status(200).json({
      message: 'Get Machine Success',
      success: true,
      data: await machineList()
    })
  } catch (error) {
    next(error)
  }
}

export const findMachine = async (req: Request, res: Response<BaseResponse<Machines | null>>, next: NextFunction) => {
  try {
    const { id } = req.params
    res.status(200).json({
      message: 'Get Machine Success',
      success: true,
      data: await searchMachine(id)
    })
  } catch (error) {
    next(error)
  }
}

export const editMachine = async (req: Request, res: Response<BaseResponse<Machines | null>>, next: NextFunction) => {
  try {
    const { id } = req.params
    const body = req.body
    res.status(200).json({
      message: 'Updated Machine Successfully',
      success: true,
      data: await updateMachine(id, body)
    })
  } catch (error) {
    next(error)
  }
}

export const deleteMachine = async (req: Request, res: Response<BaseResponse<Machines | null>>, next: NextFunction) => {
  try {
    const { id } = req.params
    res.status(200).json({
      message: 'Deleted Machine Successfully',
      success: true,
      data: await removeMachine(id)
    })
  } catch (error) {
    next(error)
  }
}