const { addMessage, getAllMessage } = require('../controllers/messages.controller')

const router = require('express').Router()

router.post('/addmsg',addMessage)
router.get('/getmsg',getAllMessage)

module.exports = router