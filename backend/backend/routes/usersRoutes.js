const express = require('express')
const router = express.Router()
const { crearUser, loginUser, datosUser } = require('../controllers/usersControllers.js')
const { protect } = require('../middleware/authMiddleware.js')

router.post('/', crearUser)
router.post('/login', loginUser)
router.get('/datos', protect, datosUser)

module.exports = router
