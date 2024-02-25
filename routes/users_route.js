const { Users } = require('../controllers/users_ctrll.js')
const express = require('express')


const ManagerUsers = new Users()

const routeUser = express.Router()

routeUser.get(['/', '/all'], async (req, res) => {
    try {
        await ManagerUsers.getUsers(res)
    } catch (error) {
        if (error) throw error
    }
})

routeUser.get(['/:id', '/all/:id'], async (req, res) => {
    try {
        await ManagerUsers.getById(req, res)
    } catch (error) {
        if (error) throw error
    }
})
routeUser.post(['/login'], async (req, res) => {
    try {
        await ManagerUsers.createUsers(req, res)
    } catch (error) {
        if (error) throw error
    }
})

module.exports = routeUser