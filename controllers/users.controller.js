const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const { isEmailValid } = require('../helpers/helper')

module.exports.register = async (req, res) => {
    const { username, email, password } = req.body
    
    try {
        const usernameCheck = await User.findOne({username})
        if(usernameCheck) return res.status(409).json({ msg: "Username already used", type: "userName", status: false })
        
        const emailCheck = await User.findOne({email})
        if(emailCheck) return res.status(409).json({ msg: "Email already used", type: "userEmail", status: false })
    
        const hashedPassword = await bcrypt.hash(password,10)
        const user = await User.create({
            email:email,
            username:username,
            password: hashedPassword
        })

        return res.json({ status: true, user: {
                _id: user._id,
                avatarImage: user.avatarImage,
                email: user.email,
                isAvatarImageSet: user.isAvatarImageSet,
                username: user.username
            }
        
        })

    } 
    catch (error) {
        console.log(error)
        res.status(500).json({msg: "error server", status:false})
    }

}

module.exports.login = async (req,res) => {
    const { username, password } = req.body
    const field = isEmailValid(username) ? "email":"username"
    
    const userChecked = await User.findOne({[field]:username})
    if(!userChecked) return res.status(404).json({msg:"L'utilisateur n'existe pas", status: false})

    const isPasswordValid = await bcrypt.compare(password,userChecked.password)
    if(!isPasswordValid) return res.status(401).json({msg:"Mot de passe incorrect", status: false})

    return res.json({msg:'ok',status:true,user:{
        _id: userChecked._id,
        avatarImage: userChecked.avatarImage,
        email: userChecked.email,
        isAvatarImageSet: userChecked.isAvatarImageSet,
        username: userChecked.username
    }})
}

module.exports.setAvatar = async (req,res)=>{
    const _id = req.params._id
    const {image} = req.body
    try {
        const user = await User.findByIdAndUpdate(_id,{ isAvatarImageSet: true, avatarImage: image})
        if (!user) {
            return res.status(404).json({
                msg: "Utilisateur non trouvé",
                status: false,
            });
        }
    
        return res.status(200).json({msg:"ok",status:true, user:user})
    } 
    catch (error) {
        
        return res.status(500).json({msg: error, status: false})        
    }
}

module.exports.getAllUsers = async (req,res) => {
    try{
        const users = await User.find({_id:{$ne: req.params._id}}).select([
            "email","username","avatarImage","_id","isAvatarImageSet"
        ])
        return res.status(200).json({msg:"okok", users})
    }
    catch(error){

    }
}

 