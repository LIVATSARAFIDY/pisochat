const Message = require('../models/messageModel')

module.exports.addMessage = async (req,res) => {
    try {
        const {from, to, message} = req.body
        const data = await Message.create({
            message: { text: message },
            users:[from,to],
            sender: from
        })
        if(data) return res.status(200).json({msg:"Message added successfully"})
        return res.status(500).json({msg:"Failed to add message to the database"})
    } catch (error) {
        return res.status(500).json({error:error})

    }
}
module.exports.getAllMessage = async (req,res) => {
    try {
        const { from, to } = req.query
        const messages = await Message.find({
            users: { $all: [from,to] }
        })
        const projectMessages = messages.map(msg => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text
            }
        })
        return res.status(200).json({msg:"ok",projectMessages})
    } catch (error) {
        
    }
}