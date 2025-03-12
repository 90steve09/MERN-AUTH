import userModel from "../models/userModel";

export const getUserDate = async (req, res) =>{
    
    const {userId} = req.body;

    try {
        const user = await userModel.findOne(userId);
        if(!user){
            return res.json({success: false, message: "User not found!"})
        }

        res.json({success:true, userData:{
            name: user.name,
            isAccountVefified: user.isAccountVefified
        }})

    } catch (error) {
         res.json({success: false, message: error.message})
    }
}