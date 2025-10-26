import { Request, Response, NextFunction } from 'express'
import { EditVendorInputs, VendorLoginInputs } from '../dto'
import { FindVendor } from './AdminController'
import { GenerateToken, ValidatePassword } from '../utility'

export const VendorLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, password } = <VendorLoginInputs>req.body

    const existingVendor = await FindVendor('', email)

    if (existingVendor !== null) {
        const validation = await ValidatePassword(
            password,
            existingVendor.password,
            existingVendor.salt
        )

        if (validation) {
            const token = GenerateToken({
                _id: existingVendor.id,
                email: existingVendor.email,
                name: existingVendor.name,
                foodType: existingVendor.foodType,
            })
            return res.json(token)
        }
    }

    return res.json({ message: 'Login credentials not valid' })
}

export const GetVendorProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = req.user

    if (user) {
        const existingVendor = await FindVendor(user._id)
        return res.json(existingVendor)
    }

    return res.json({ message: 'Vendor information not found' })
}

export const UpdateVendorProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { foodType, name, address, phone } = <EditVendorInputs>req.body
    const user = req.user

    if (user) {
        const existingVendor = await FindVendor(user._id)
        if (existingVendor) {
            existingVendor.name = name
            existingVendor.address = address
            existingVendor.phone = phone
            existingVendor.foodType = foodType

            const savedResult = await existingVendor.save()
            return res.json(savedResult)
        }
    }

    return res.json({ message: 'Vendor Information not found' })
}

export const UpdateVendorService = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = req.user

    if (user) {
        const existingVendor = await FindVendor(user._id)
        if (existingVendor) {
            existingVendor.serviceAvailable = !existingVendor.serviceAvailable
            const savedResult = await existingVendor.save()
            return res.json(savedResult)
        }
    }

    return res.json({ message: 'Vendor Information not found' })
}
