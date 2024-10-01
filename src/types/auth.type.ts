export type GenQr = {
  pinCode: string
}

export type jwtDecodeType = {
  userId: string,
  userLevel: string,
  displayName: string,
  userStatus: boolean,
  iat: number,
  exp: number
}