import mongoose, { Schema, Document } from 'mongoose'

export interface CustomerDoc extends Document {
    email: string
    password: string
    salt: string
    firstname: string
    lastname: string
    address: string
    phone: string
    verified: boolean
    otp: number
    otp_expiry: Date
    lat: number
    lng: number
}

const CustomerSchema = new Schema(
    {
        email: { type: String, require: true },
        password: { type: String, require: true },
        salt: { type: String, require: true },
        firstname: { type: String },
        lastname: { type: String },
        address: { type: String },
        phone: { type: String, require: true },
        verified: { type: Boolean, require: true },
        otp: { type: Number, require: true },
        otp_expiry: { type: Date, require: true },
        lat: { type: Number },
        lng: { type: Number },
    },
    {
        toJSON: {
            transform(doc, ret: any) {
                delete ret.password
                delete ret.salt
                delete ret.createdAt
                delete ret.updatedAt
                delete ret.__v
            },
        },
        timestamps: true,
    }
)

export const Customer = mongoose.model<CustomerDoc>('customer', CustomerSchema)
