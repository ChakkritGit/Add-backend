import { Request, Response, NextFunction } from "express"
import { BaseResponse } from "../models"
import { Machines } from "@prisma/client"
import { createMachine, machineList, removeMachine, searchMachine, updateMachine } from "../services"
import { updateOrderDevice } from "../services/machine.service"

export const addMachine = async (req: Request, res: Response<BaseResponse<Machines>>, next: NextFunction) => {
  try {
    const body = req.body
    res.status(200).json({
      message: 'Success',
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
      message: 'Success',
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
      message: 'Success',
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
      message: 'Success',
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
      message: 'Success',
      success: true,
      data: await removeMachine(id)
    })
  } catch (error) {
    next(error)
  }
}

export const useSlot = async (req: Request, res: Response) => {
  try {
    const { machine_id } = req.params
    const { machine_slot, order_id, value } = req.body
    const response = await updateOrderDevice(machine_id, machine_slot, order_id, value)
    res.status(200).json({ status: 200, data: response })
  } catch (error) {
    res.status(400).json({ status: 400, error: error })
  }
}
