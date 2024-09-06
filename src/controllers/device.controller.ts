import { NextFunction, Request, Response } from "express"
import { BaseResponse } from "../models"
import prisma from "../configs/prisma.config"
import { updateOrderDevice } from "../services"

export const findSlot = async (req: Request, res: Response<BaseResponse<string>>, next: NextFunction) => {
  try {
    const result = await prisma.machines.findUnique({
      where: { id: 'DEVICE-TEST' }
    })
    if (!result?.MachineSlot1) {
      return "R1"
    } else if (!result?.MachineSlot2) {
      return "R2"
    } else {
      return "R0"
    }
  } catch (error) {
    throw (error)
  }
}

// export const useSlot = async (req: Request, res: Response) => {
//   try {
//     const { machine_id } = req.params
//     const { machine_slot, order_id, value } = req.body
//     // const response = await updateOrderDevice(machine_id, machine_slot, order_id, value)
//     res.status(200).json({ status: 200, data: response })
//   } catch (error) {
//     res.status(400).json({ status: 400, error: error })
//   }
// }