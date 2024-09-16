const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.json())

mongoose.connect('mongodb://localhost:27017/calendar')

const colorSchema = new mongoose.Schema({
    userId: String,
    date: String,
    color: String
})

const Color = mongoose.model('Color', colorSchema)

app.post('/save-color', async (req, res) => {
    const { userId, date, color } = req.body
    try {
        const existingEntry = await Color.findOne({ userId, date })
        if (existingEntry) {
            existingEntry.color = color
            await existingEntry.save()
        } else {
            const newColor = new Color({ userId, date, color })
            await newColor.save()
        }
        res.status(200).send('Color saved successfully')
    } catch (error) {
        res.status(500).send('Error saving color')
    }
})

app.get('/get-colors/:userId', async (req, res) => {
    const { userId } = req.params
    try {
        const colors = await Color.find({ userId })
        res.json(colors)
    } catch (error) {
        res.status(500).send('Error retrieving colors')
    }
})

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000')
})
