import express from 'express'
import connectDB from './db/connection'
import routes from './routes/index'
import dotenv from 'dotenv'

const server = express()
dotenv.config()

connectDB()

server.use(express.json())
server.use(routes)

export default server
