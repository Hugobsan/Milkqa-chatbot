const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')
const app = express()
const port = 5000
require('dotenv').config()


// Middleware to parse JSON data
app.use(bodyParser.json())
app.use(express.json())
app.use(cors())

const config = {
  headers: {
    'x-api-key': process.env.API_KEY,
    'Content-Type': 'application/json',
  },
}

app.post('/api/questions', async (req, res) => {
  try {
    const { question } = req.body
    console.log('Received question:', question)
    const data = {
      sourceId: process.env.PDF_ID,
      messages: [
        {
          role: 'user',
          content: question,
        },
      ],
    }

    console.log('Sending request to ChatPDF API with data:', data)

    const response = await axios.post(
      'https://api.chatpdf.com/v1/chats/message',
      data,
      config,
    )

    console.log('Received response from ChatPDF API:', response.data)

    return res.status(200).json({
      message: 'Data received successfully',
      result: response.data.content,
    })
  } catch (error) {
    console.error('Error:', error.message)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
