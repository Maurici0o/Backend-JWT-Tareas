const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const Tarea = require('../models/tareaModel.js')


const buscarTareaPropia = async (id, userId) => {
    if (!mongoose.isValidObjectId(id)) return null
    return Tarea.findOne({ _id: id, user: userId })
}

const getTareas = asyncHandler(async (req, res) => {
    const tareas = await Tarea.find({ user: req.user.id })
    res.status(200).json(tareas)
})

const createTareas = asyncHandler(async (req, res) => {
    if (!req.body.descripcion) {
        res.status(400)
        throw new Error('Please add a descripcion field')
    }

    const tarea = await Tarea.create({
        descripcion: req.body.descripcion,
        user: req.user.id
    })
    res.status(201).json(tarea)
})

const updateTareas = asyncHandler(async (req, res) => {
    const tarea = await buscarTareaPropia(req.params.id, req.user.id)
    if (!tarea) {
        res.status(404)
        throw new Error('Tarea not found')
    }

    if (!req.body.descripcion) {
        res.status(400)
        throw new Error('Please add a descripcion field')
    }

    tarea.descripcion = req.body.descripcion
    const tareaUpdated = await tarea.save()
    res.status(200).json(tareaUpdated)
})

const deleteTareas = asyncHandler(async (req, res) => {
    const tarea = await buscarTareaPropia(req.params.id, req.user.id)
    if (!tarea) {
        res.status(404)
        throw new Error('Tarea not found')
    }

    await tarea.deleteOne()
    res.status(200).json({ id: req.params.id })
})

module.exports = { getTareas, createTareas, updateTareas, deleteTareas }
