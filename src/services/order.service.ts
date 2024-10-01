import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import prisma from "../configs/prisma.config"
import { jwtDecodeType, OrderType, Prescription, PrescriptionList } from "../types"
import { HttpError } from "../error"
import { Orders } from "@prisma/client"
import { getDateFormat } from "../utils"
import { statusPrescription } from "./prescription.service"
import { io } from "../configs"
import { jwtDecode } from "jwt-decode"

export const findPrescription = async () => {
  try {
    const result = await prisma.prescription.findFirst({
      where: { PresStatus: { in: ["0", "1"] } },
      include: { Order: true },
      orderBy: { CreatedAt: 'asc' }
    })
    return result
  } catch (error) {
    throw error
  }
}

export const createPresService = async (pres: Prescription, token?: string): Promise<OrderType[]> => {
  const splitToken = token?.split(' ')[1]
    const decoded: jwtDecodeType = jwtDecode(String(splitToken))
  try {
    const presList: PrescriptionList[] = pres.Prescription.filter((item) => item.Machine === "ADD")
    if (presList.length > 0) {
      const order: Orders[] = presList.map((item) => {
        return {
          id: `ORD-${item.RowID}`,
          PrescriptionId: item.f_prescriptionno,
          OrderItemId: item.f_orderitemcode,
          OrderItemName: item.f_orderitemname,
          OrderQty: item.f_orderqty,
          OrderUnitcode: item.f_orderunitcode,
          Machine: item.Machine,
          Command: item.command,
          OrderStatus: "0",
          Slot: null,
          CreatedAt: getDateFormat(new Date()),
          UpdatedAt: getDateFormat(new Date())
        }
      })
      await prisma.$transaction([
        prisma.prescription.create({
          data: {
            id: presList[0].f_prescriptionno,
            PrescriptionDate: presList[0].f_prescriptiondate,
            Hn: presList[0].f_hn,
            An: presList[0].f_an,
            PatientName: presList[0].f_patientname,
            WardCode: presList[0].f_wardcode,
            WardDesc: presList[0].f_warddesc,
            PriorityCode: presList[0].f_prioritycode,
            PriorityDesc: presList[0].f_prioritydesc,
            PresStatus: "0",
            UsedBy: {
              connect: { id: decoded.userId }
            },
            CreatedAt: getDateFormat(new Date()),
            UpdatedAt: getDateFormat(new Date()),
          }
        }),
        prisma.orders.createMany({ data: order })
      ])
      return order as OrderType[]
    } else {
      throw new HttpError(404, "Order not found on ADD")
    }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      throw new HttpError(400, "This order has already been placed")
    } else {
      throw error
    }
  }
}

export const getOrderService = async (token: string | undefined): Promise<Orders[]> => {
  try {
    const splitToken = token?.split(' ')[1]
    const decoded: jwtDecodeType = jwtDecode(String(splitToken))
    const result = await prisma.orders.findMany({
      include: { DrugInfo: { select: { DrugImage: true } } },
      where: { Prescription: { UsedBy: { id: decoded.userId } } }
    })
    if (result.length > 0) return result
    throw new HttpError(404, 'Orders not found')
  } catch (error) {
    throw (error)
  }
}

export const received = async (drugId: string, presId: string): Promise<Orders> => {
  try {
    const result = await prisma.orders.findFirst({
      where: {
        id: drugId,
        OrderItemId: presId
      },
      include: { DrugInfo: { include: { Inventory: { include: { Machines: true } } } } }
    })
    if (result?.OrderStatus === "2" || result?.OrderStatus === "3") {
      await updateOrder(result.id, "4")
      await updateOrderDevice(result.DrugInfo.Inventory?.Machines.id, result.Slot, result.id, Number(result.DrugInfo.Inventory?.InventoryQty) - result.OrderQty, String(result.DrugInfo.Inventory?.id), false)
      const value = await findOrders(['0', '1', '2', '3'])
      if (value.length === 0) await statusPrescription(result.PrescriptionId, "2")
      io.sockets.emit("res_message", `Receive Order : ${result.id}`)
    } else {
      throw "This item is not in a ready to receive drug"
    }
    return result
  } catch (error) {
    throw (error)
  }
}

export const updateOrder = async (orderId: string, orderStatus: string): Promise<Orders | undefined> => {
  try {
    const result: Orders = await prisma.orders.update({
      where: { id: orderId },
      data: { OrderStatus: orderStatus }
    })
    return result
  } catch (error) {
    throw error
  }
}

export const updateOrderDevice = async (machineId: string | undefined, machineSlot: string | null, orderId: string, orderQty: number, inventoryId: string, value: boolean) => {
  try {
    await prisma.machines.update({
      where: { id: machineId },
      data: machineSlot === "R1"
        ? {
          MachineSlot1: value,
          Inventory: {
            update: {
              where: { id: inventoryId },
              data: { InventoryQty: orderQty }
            }
          }
        }
        : {
          MachineSlot2: value,
          Inventory: {
            update: {
              where: { id: inventoryId },
              data: { InventoryQty: orderQty }
            }
          }
        }
    })

    if (value) {
      await prisma.orders.update({
        where: { id: orderId },
        data: { Slot: machineSlot }
      })
    }
  } catch (error) {
    throw error
  }
}

export const findOrders = async (condition: string[]): Promise<Orders[]> => {
  try {
    const result: Orders[] = await prisma.orders.findMany({
      where: { OrderStatus: { in: condition } }
    })
    return result
  } catch (error) {
    throw error
  }
}