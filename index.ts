import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
// import bodyParser from 'body-parser'
import { AdminRoutes, VendorRoutes } from './routes/index'
import { MONOG_URI } from './config'

const app = express()
app.use(express.json())
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/admin', AdminRoutes)
app.use('/Vendor', VendorRoutes)

mongoose
    .connect(MONOG_URI)
    .then((result) => {
        // console.log(result)
        console.log('connected')
    })
    .catch((err) => {
        console.log('Error: ' + err)
    })

app.get('/', (req, res) => res.json({ message: 'Aye mami' }))
app.listen(8000, () => {
    console.log('App is listening on PORT: 8000')
})
