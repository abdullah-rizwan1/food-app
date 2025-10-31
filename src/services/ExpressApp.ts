import express, { Application } from 'express'
import path from 'path'
import {
    AdminRoutes,
    VendorRoutes,
    ShoppingRoutes,
    CustomerRoutes,
} from '../routes'

export default async (app: Application) => {
    app.use(express.json())
    app.use('/images', express.static(path.join(__dirname, 'images')))

    app.use('/admin', AdminRoutes)
    app.use('/Vendor', VendorRoutes)
    app.use('/customer', CustomerRoutes)
    app.use(ShoppingRoutes)
    return app
}
