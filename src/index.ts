import './config/env'
import express from 'express'
import App from './services/ExpressApp'
import dbConnection from './services/Database'

const StartServer = async () => {
    const app = express()
    await dbConnection()

    await App(app)

    app.listen(process.env.PORT!, () =>
        console.log(`Listening to PORT on Herkou: ${process.env.PORT!}`)
    )
}

StartServer()
