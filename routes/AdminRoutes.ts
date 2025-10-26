import express, { Request, Response, NextFunction } from 'express'
import { CreateVendor, GetVendorById, GetVendors } from '../controllers'

const router = express.Router()

router.post('/Vendor', CreateVendor)
router.get('/Vendors', GetVendors)
router.get('/Vendor/:id', GetVendorById)

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: 'Hello from Admin' })
})

export { router as AdminRoutes }
