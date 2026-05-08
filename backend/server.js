import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import pdfParse from 'pdf-parse/lib/pdf-parse.js'
import Groq from 'groq-sdk'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

const upload = multer({ storage: multer.memoryStorage() })

app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' })
})

app.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    const pdfData = await pdfParse(req.file.buffer)
    const resumeText = pdfData.text

    const response = await groq.chat.completions.create({
     model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `Analyze this resume and give feedback:\n\n${resumeText}`
        }
      ]
    })

    const feedback = response.choices[0].message.content
    res.json({ feedback })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})