import { IsEmail, IsEmpty, Length } from 'class-validator'

export class CreateCustomerInputs {
    @IsEmail()
    email: string

    @Length(11, 14)
    phone: string

    @Length(8, 132)
    password: string
}

export class CustomerLoginInputs {
    @IsEmail()
    email: string

    @Length(8, 132)
    password: string
}

export class EditCustomerProfileInputs {
    @Length(6, 10)
    firstname: string

    @Length(6, 10)
    lastname: string

    @Length(6, 10)
    address: string
}

export interface CustomerPayload {
    _id: string
    email: string
    verified: boolean
}
