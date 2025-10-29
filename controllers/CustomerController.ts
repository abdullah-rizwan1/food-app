import express, { Request, Response, NextFunction } from 'express'
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'
import {
    CreateCustomerInputs,
    CustomerLoginInputs,
    EditCustomerProfileInputs,
} from '../dto/Customer.dto'
import {
    GenerateHashedPassword,
    GenerateOTP,
    GenerateSalt,
    GenerateToken,
    onRequestOTP,
    ValidatePassword,
} from '../utility'
import { Customer } from '../models'

export const CustomerSignUp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const customerInputs = plainToClass(CreateCustomerInputs, req.body)
    const inputErrors = await validate(customerInputs, {
        validationError: { target: true },
    })

    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors)
    }

    const { email, phone, password } = customerInputs

    const alreadyExists = await Customer.findOne({ email })

    if (alreadyExists) {
        return res
            .status(409)
            .json({ message: 'Customer with the email already exists' })
    }

    const salt = await GenerateSalt()
    const userPassword = await GenerateHashedPassword(password, salt)

    const { otp, expiry } = GenerateOTP()

    const result = await Customer.create({
        email: email,
        password: userPassword,
        phone: phone,
        salt: salt,
        otp: otp,
        otp_expiry: expiry,
        firstname: '',
        lastname: '',
        lat: 0,
        lng: 0,
    })

    if (result) {
        // send the OTP to customer
        await onRequestOTP(otp, phone)

        const token = GenerateToken({
            _id: result.id,
            email: result.email,
            verified: result.verified,
        })

        return res.status(201).json({
            token: token,
            verified: result.verified,
            email: result.email,
        })
    }

    return res.status(400).json({ message: 'Error with signup' })
}

export const CustomerLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const loginInputs = plainToClass(CustomerLoginInputs, req.body)
    const loginErrors = await validate(loginInputs, {
        validationError: { target: false },
    })

    if (loginErrors.length > 0) {
        return res.status(400).json(loginErrors)
    }

    const { email, password } = loginInputs
    const customer = await Customer.findOne({ email: email })

    if (customer) {
        const isPasswordValid = await ValidatePassword(
            password,
            customer.password,
            customer.salt
        )
        if (isPasswordValid) {
            const token = GenerateToken({
                _id: customer.id,
                email: customer.email,
                verified: customer.verified,
            })

            return res.status(201).json({
                token: token,
                verified: customer.verified,
                email: customer.email,
            })
        }
    }

    return res.status(404).json({ message: 'Login Error' })
}

export const CustomerVerify = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { otp } = req.body

    const customer = req.user

    if (customer) {
        const profile = await Customer.findById(customer._id)

        if (profile) {
            if (
                profile.otp === parseInt(otp) &&
                profile.otp_expiry >= new Date()
            ) {
                profile.verified = true

                const updatedCustomerResponse = await profile.save()
                const token = GenerateToken({
                    _id: updatedCustomerResponse.id,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified,
                })

                return res.status(201).json({
                    token: token,
                    verified: updatedCustomerResponse.verified,
                    email: updatedCustomerResponse.email,
                })
            }
        }
    }
    return res.status(400).json({ message: 'Error with otp validation' })
}

export const RequestOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const customer = req.user

    if (customer) {
        const profile = await Customer.findById(customer._id)
        if (profile) {
            const { otp, expiry } = GenerateOTP()

            profile.otp = otp
            profile.otp_expiry = expiry

            await profile.save()

            await onRequestOTP(otp, profile.phone)

            res.status(200).json({
                message: 'OTP sent to registered mobile number',
            })
        }
    }
    res.status(400).json({ message: 'Error with OTP request' })
}

export const GetCustomerProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const customer = req.user

    if (customer) {
        const profile = await Customer.findById(customer._id)
        if (profile) {
            res.status(200).json(profile)
        }
    }
    res.status(400).json({ message: 'Unable to get profile' })
}

export const EditCustomerProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const customer = req.user
    const customerEditInputs = plainToClass(EditCustomerProfileInputs, req.body)
    const inputErrors = await validate(customerEditInputs, {
        validationError: { target: true },
    })

    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors)
    }

    const { firstname, lastname, address } = req.body

    if (customer) {
        const profile = await Customer.findById(customer._id)
        if (profile) {
            profile.firstname = firstname
            profile.lastname = lastname
            profile.address = address
            const editedProfile = await profile.save()

            res.status(200).json(editedProfile)
        }
    }
    res.status(400).json({ message: 'Unable to edit profile' })
}
