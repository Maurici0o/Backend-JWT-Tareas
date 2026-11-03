const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')
const User = require('../models/usersModel.js')

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

// POST /api/users  -> crear usuario
const crearUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    if (!name) {
        res.status(400)
        throw new Error('Please include a name')
    }
    if (!email) {
        res.status(400)
        throw new Error('Please include an email')
    }
    if (!password) {
        res.status(400)
        throw new Error('Please include a password')
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
    })
})

// POST /api/users/login  -> iniciar sesión y devolver el JWT
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400)
        throw new Error('Please include email and password')
    }

    const user = await User.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

// GET /api/users/datos  -> datos del usuario dueño del token
const datosUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        _id: req.user.id,
        name: req.user.name,
        email: req.user.email
    })
})

module.exports = { crearUser, loginUser, datosUser }
