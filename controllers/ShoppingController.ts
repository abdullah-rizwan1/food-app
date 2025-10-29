import express, { Request, Response, NextFunction } from 'express'
import { Vendor } from '../models'
import { FoodDoc } from '../models/Food'

export const GetFoodAvailability = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const pincode = req.params.pincode
    const result = await Vendor.find({
        pincode: pincode,
        serviceAvailable: false,
    })
        .sort([['rating', 'descending']])
        .populate('foods')

    if (result.length > 0) {
        return res.status(200).json(result)
    }

    return res.status(400).json({ message: 'Data not found!' })
}

export const GetTopRestaurants = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const pincode = req.params.pincode
    const result = await Vendor.find({
        pincode: pincode,
        serviceAvailable: false,
    })
        .sort([['rating', 'descending']])
        .limit(10)

    if (result.length > 0) {
        return res.status(200).json(result)
    }

    return res.status(400).json({ message: 'Data not found!' })
}

export const GetFoodsIn30Min = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const pincode = req.params.pincode
    const result = await Vendor.find({
        pincode: pincode,
        serviceAvailable: false,
    }).populate('foods')

    if (result.length > 0) {
        let foodResult: any = []
        result.map((vendor) => {
            const foods = vendor.foods as [FoodDoc]
            foodResult.push(...foods.filter((food) => food.readyTime <= 30))
        })
        return res.status(200).json(foodResult)
    }

    return res.status(400).json({ message: 'Data not found!' })
}

export const SearchFoods = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const pincode = req.params.pincode
    const result = await Vendor.find({
        pincode: pincode,
        serviceAvailable: false,
    }).populate('foods')

    if (result.length > 0) {
        let foodResult: any = []
        result.map((item) => {
            foodResult.push(...item.foods)
        })
        return res.status(200).json(result)
    }

    return res.status(400).json({ message: 'Data not found!' })
}

export const RestaurantById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const id = req.params.id
    const vendor = await Vendor.findById({ _id: id })

    if (vendor !== null) {
        return res.status(200).json(vendor)
    }

    return res.status(400).json({ message: 'Data not found!' })
}
