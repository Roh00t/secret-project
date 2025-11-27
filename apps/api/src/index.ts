import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import helloRouter from './routes/hello' // Linking to /api/src/routes/hello.ts


const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/api', helloRouter) // Mounting the helloRouter at /api
app.get('/health', (_req, res) => res.json({status: 'ok'}))

const port = process.env.PORT || 4000
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`SafeOps API running on http://localhost:${port}`)
})
