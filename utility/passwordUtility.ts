import bcrypt from 'bcrypt'
import { Request } from 'express'
import jwt from 'jsonwebtoken'
import { VendorPayload } from '../dto'
import { AuthPayload } from '../dto/Auth.dto'

const APP_SECRET = process.env.APP_SECRET!

export const GenerateSalt = async () => {
    return await bcrypt.genSalt()
}

export const GenerateHashedPassword = async (
    password: string,
    salt: string
) => {
    return await bcrypt.hash(password, salt)
}

export const ValidatePassword = async (
    enteredPassword: string,
    savedPassword: string,
    salt: string
) => {
    return (
        (await GenerateHashedPassword(enteredPassword, salt)) === savedPassword
    )
}

export const GenerateToken = (payload: VendorPayload) => {
    return jwt.sign(payload, APP_SECRET, { expiresIn: '30m' })
}

export const ValidateToken = async (req: Request) => {
    const token = req.get('Authorization')
    if (!token) return false
    const tokenValue = token.split(' ')[1]
    if (tokenValue)
        if (token) {
            const payload = (await jwt.verify(
                tokenValue,
                APP_SECRET
            )) as AuthPayload

            req.user = payload

            return true
        }
    return false
}
