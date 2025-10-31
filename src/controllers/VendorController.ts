import { Request, Response, NextFunction } from 'express'
import { EditVendorInputs, VendorLoginInputs } from '../dto'
import { FindVendor } from './AdminController'
import { GenerateToken, ValidatePassword } from '../utility'
import { CreateFoodInputs } from '../dto'
import { Food } from '../models/Food'

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

export const UpdateVendorCoverImage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = req.user

    if (user) {
        const vendor = await FindVendor(user._id)

        if (vendor !== null) {
            const files = req.files as [Express.Multer.File]
            const images = files.map(
                (file: Express.Multer.File) => file.filename
            )
            vendor.coverImages.push(...images)
            const result = await vendor.save()

            return res.json(result)
        }
    }

    return res.json({
        message: 'Something went wrong updating vendor cover image',
    })
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

export const AddFood = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = req.user

    if (user) {
        const files = req.files as [Express.Multer.File]
        const images = files.map((file: Express.Multer.File) => file.filename)
        const { name, description, category, foodType, readyTime, price } = <
            CreateFoodInputs
        >req.body

        const vendor = await FindVendor(user._id)

        if (vendor !== null) {
            const createFood = await Food.create({
                vendorId: vendor._id,
                name: name,
                description: description,
                category: category,
                foodType: foodType,
                images: images,
                readyTime: readyTime,
                price: price,
                rating: 0,
            })

            vendor.foods.push(createFood)
            const result = await vendor.save()

            return res.json(result)
        }
    }

    return res.json({ message: 'Something went wrong when adding food' })
}

export const GetFoods = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = req.user

    if (user) {
        const foods = await Food.find({ vendorId: user._id })

        if (foods != null) {
            return res.json(foods)
        }
    }

    return res.json({ message: 'No food found' })
}
