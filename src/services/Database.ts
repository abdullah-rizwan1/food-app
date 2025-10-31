import mongoose from 'mongoose'

export default async () => {
    try {
        mongoose
            .connect(process.env.MONGO_URI!)
            .then((result) => {
                console.log('connected')
            })
            .catch((err) => {
                console.log('Error: ' + err)
            })
    } catch (err) {
        console.log(err)
    }
}
