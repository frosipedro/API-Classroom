import express, { Request, Response } from 'express'
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
      console.log('Usuário não encontrado')
      return res.status(401).json({ success: false })
    }

    return res.json({ success: true, user })
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
    const teacherIds = classes.map((classItem: any) => classItem.teacher_id)
    const uniqueTeacherIds = [...new Set(teacherIds)]

    const teachers = await database.all(
      `SELECT * FROM users WHERE id IN (${uniqueTeacherIds
        .map(() => '?')
        .join(',')})`,
      ...uniqueTeacherIds
    )
    const data = classes.map((classItem: any) => {
      const teacher = teachers.find(
        (teacher: any) => teacher.id === classItem.teacher_id
      )

      const { teacher_id, ...classWithoutTeacherId } = classItem

      return {
        ...classWithoutTeacherId,
        teacher,
      }
    })

    return res.json({ success: true, data })
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

export default router
