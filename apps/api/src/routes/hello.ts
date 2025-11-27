import { Router } from 'express'
const router = Router()

// GET /api/hello
router.get('/hello', (_req, res) => {
  res.json({ message: 'Hello from SafeOps API' })
})

export default router