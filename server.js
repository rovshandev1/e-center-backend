const express = require('express')
const app = express()
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const profileRoutes = require('./routes/profileRoutes')
const groupRoutes = require('./routes/groupRoutes')
const materialRoutes = require('./routes/materialRoutes')
const homeworkRoutes = require('./routes/homeworkRoutes')
const studentRoutes = require('./routes/studentRoutes')
const teacherRoutes = require('./routes/teacherRoutes')
const cors = require('cors')
const path = require('path')

dotenv.config()
connectDB()

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api', authRoutes)
app.use('/api', profileRoutes)
app.use('/api', groupRoutes)
app.use('/api', materialRoutes)
app.use('/api', homeworkRoutes)
app.use('/api', studentRoutes)
app.use('/api', teacherRoutes)

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger-output.json')

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
