import express, { Request, Response } from 'express'
import path from 'path'
import { connectDB } from './app'

const router = express.Router()

// Rota de Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'Username and password are required' })
    }

    const database = await connectDB()

    const user = await database.get(
      `SELECT * FROM users WHERE email = ? AND password = ?`,
      email,
      password
    )
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: 'Invalid credentials' })
    }

    return res.json({ success: true, message: 'Login successful', user })
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

// Rota de Home
router.get('/home/:userId', async (req: Request, res: Response) => {
  try {
    const database = await connectDB()

    const userId = req.params.userId
    const userIdNumber = Number(userId)

    const classes = await database.all(
      `SELECT * FROM classes WHERE id IN (SELECT class_id FROM class_students WHERE student_id = ?)`,
      userIdNumber
    )
    return res.json({ success: true, classes })
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

// Rota para imagens
router.use('/images', express.static(path.join(__dirname, 'images')))

export default router
