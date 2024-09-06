import { NextFunction, Request, Response } from "express"
import { BaseResponse } from "../models"
import { cancelQueueAmqp, createPresService, deletePrescription, findOrders, findPrescription, getOrderService, received, sendOrder, statusPrescription, updateOrder } from "../services"
import { HttpError } from "../error"
import { getPharmacyPres } from "../interfaces"
import { Orders } from "@prisma/client"
import { io } from "../configs"
import { QueueList } from "../types"

export const dispenseOrder = async (req: Request, res: Response<BaseResponse<Orders[]>>, next: NextFunction) => {
  try {
    const rfid = req.params.rfid
    const uid = req.params.uid
    const order = await findPrescription()
    if (!!order) {
      throw new HttpError(409, 'Order already exists')
    } else {
      const response = await getPharmacyPres(rfid)
      const value = await createPresService(response, uid)
      const cmd: QueueList[] = value.map((item) => { return { cmd: item.Machine, orderId: item.id } })
      await sendOrder(cmd, 'orders')
      await statusPrescription(response.PrescriptionNo, "1")
      io.sockets.emit("res_message", `Create : ${response.PrescriptionNo}`)
      res.status(200).json({
        message: 'Create Prescription and Orders Success',
        success: true,
        data: value
      })
    }
  } catch (error) {
    next(error)
  }
}

export const getOrder = async (req: Request, res: Response<BaseResponse<Orders[]>>, next: NextFunction) => {
  try {
    const { id } = req.params
    res.status(200).json({
      message: 'Get order success',
      success: true,
      data: await getOrderService(id)
    })
  } catch (error) {
    next(error)
  }
}

export const receiveOrder = async (req: Request, res: Response<BaseResponse<Orders>>, next: NextFunction) => {
  try {
    const { sticker } = req.params
    const drugId = sticker.split("|")[0]
    const presId = sticker.split("|")[1]
    res.status(200).json({
      message: 'Receive order success',
      success: true,
      data: await received(drugId, presId)
    })
  } catch (error) {
    next(error)
  }
}

export const cancelOrder = async (req: Request, res: Response<BaseResponse<string>>, next: NextFunction) => {
  try {
    const { prescriptionId } = req.params
    await deletePrescription(prescriptionId)
    await cancelQueueAmqp('orders')
    io.sockets.emit("res_message", `Delete Order Success!!`)
    res.status(200).json({
      message: 'Delete order success',
      success: true,
      data: 'Delete Order Success'
    })
  } catch (error) {
    throw (error)
  }
}

export const updateOrderList = async (req: Request, res: Response) => {
  const { order_status } = req.body
  const { order_id } = req.params
  try {
    const response = await updateOrder(order_id, order_status)
    if (response?.OrderStatus === '1') {
      io.sockets.emit("res_message", `Dispensing : ${order_id}`)
    } else if (response?.OrderStatus === '2') {
      const order: Orders[] = await findOrders(['0', '1'])
      if (order.length === 0) {
        io.sockets.emit("res_message", `Complete & Done : ${response.PrescriptionId}`)
      } else {
        io.sockets.emit("res_message", `Complete : ${order_id}`)
      }
    }
    res.status(200).json({ status: 200, msg: "Update Suscess!!", data: response })
  } catch (error) {
    res.status(400).json({ status: 400, error: error })
  }
}