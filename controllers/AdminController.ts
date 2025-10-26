import { Request, Response, NextFunction } from 'express'
import { CreateVendorInput } from '../dto'
import { Vendor, VendorDoc } from '../models'
import { GenerateHashedPassword, GenerateSalt } from '../utility'

export const FindVendor = async (
    id: string | undefined,
    email?: string
): Promise<VendorDoc | null> => {
    if (email) {
        return await Vendor.findOne({ email: email })
    } else {
        return await Vendor.findById({ _id: id })
    }
}

export const CreateVendor = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const {
        name,
        ownerName,
        foodType,
        pincode,
        address,
        phone,
        email,
        password,
    } = <CreateVendorInput>req.body

    const existingVendor = await FindVendor('', email)

    if (existingVendor !== null) {
        return res.json({
            message: 'A Vendor with this email id Already exists',
        })
    }
    const salt = await GenerateSalt()
    const hashedPassword = await GenerateHashedPassword(password, salt)

    const createVendor = await Vendor.create({
        name: name,
        address: address,
        pincode: pincode,
        foodType: foodType,
        email: email,
        password: hashedPassword,
        salt: salt,
        ownerName: ownerName,
        phone: phone,
        rating: 0,
        serviceAvailable: false,
        coverImages: [],
    })

    return res.json(createVendor)
}

export const GetVendors = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const vendors = await Vendor.find()

    if (vendors !== null) {
        return res.json(vendors)
    }

    return res.json({ message: 'No vendors available' })
}

export const GetVendorById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const vendorId = req.params.id
    const vendor = await FindVendor(vendorId)

    if (vendor !== null) {
        return res.json(vendor)
    }

    return res.json({ message: "Vendor with the following id doesn't exist" })
}
