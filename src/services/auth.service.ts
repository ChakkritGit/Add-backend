import prisma from "../configs/prisma.config"
import fs from "node:fs"
import path from "node:path"
import { Users } from "@prisma/client"
import { hashPassword, hashPasswordCompare } from "../constants"
import { v4 as uuidv4 } from 'uuid'
import { sign } from "jsonwebtoken"
import { getDateFormat } from "../utils"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { HttpError } from "../error"

export const userRegister = async (body: Users, pic?: Express.Multer.File): Promise<Users | undefined> => {
  try {
    const UUID = `UID-${uuidv4()}`
    const result = await prisma.users.create({
      select: {
        id: true,
        UserName: true,
        DisplayName: true,
        UserImage: true,
        UserRole: true,
        UserStatus: true,
        CreateBy: true,
        CreatedAt: true,
        UpdatedAt: true
      },
      data: {
        id: UUID,
        UserName: body.UserName,
        UserPassword: await hashPassword(body.UserPassword),
        DisplayName: body.DisplayName,
        UserImage: !pic ? null : `/img/users/${pic.filename}`,
        UserRole: body.UserRole,
        UserStatus: String(body.UserStatus) == "1" ? true : false,
        CreateBy: body.CreateBy,
        CreatedAt: getDateFormat(new Date()),
        UpdatedAt: getDateFormat(new Date())
      }
    })
    return result as unknown as Users
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        if (pic) fs.unlinkSync(path.join('public/images/users', String(pic.filename)))
        throw new HttpError(400, 'Username already exists')
      }
    }
    throw (error)
  }
}

export const userLogin = async (body: Users): Promise<Users> => {
  try {
    const result = await prisma.users.findFirst({
      where: { UserName: body.UserName }
    })
    if (result) {
      if (!result.UserStatus) throw new HttpError(403, 'User is inactive')
      const match = await hashPasswordCompare(body.UserPassword, result.UserPassword)
      if (match) {
        const { id: userId, UserRole: userLevel, UserImage: userPic, DisplayName: userName, UserStatus: userStatus } = result
        const token: string = sign({ userId, userLevel, userName, userStatus }, String(process.env.JWT_SECRET), { expiresIn: '7d' })
        return { token, userId, userLevel, userStatus, userName, userPic } as unknown as Users
      } else {
        throw new HttpError(403, 'Password incorrect')
      }
    } else {
      throw new HttpError(404, 'User not found')
    }
  } catch (error) {
    throw error
  }
}