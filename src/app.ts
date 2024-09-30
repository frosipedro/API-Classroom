import cors from 'cors'
import express, { Express } from 'express'
import path from 'path'
import router from './routes'
import { open, Database } from 'sqlite'
import sqlite3 from 'sqlite3'

const app: Express = express()

app.use(cors())
app.use(express.json())
app.use(router)
app.use('/images', express.static(path.join(__dirname, '../images')))

app.listen(3000, () => {
  console.log('API started on port 3000')
})

let database: Database<sqlite3.Database, sqlite3.Statement> | null = null

const connectDB = async () => {
  if (!database) {
    database = await open({
      filename: path.resolve(__dirname, './database.db'),
      driver: sqlite3.Database,
    })
  }
  return database
}

export { app, connectDB }
