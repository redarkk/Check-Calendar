const jwt= require("jsonwebtoken");
const statusCode = require("../Constants/statusCode")

const verifyToken=async (req,res,next)=>{
   try{
    let token=req.headers.authorization;
    
    if(!token){
        return res.status(statusCode.ACCESS_DENIED).send({message:"Access Denied"});
    }
    const verified=jwt.verify(token,process.env.JWT_SECRET);
    if(verified){
        return next();
    }
   }catch(err){
    console.log(err.message)
    return res.status(statusCode.ACCESS_DENIED).send({message:"Access Denied"});
   }
};

module.exports=verifyToken;

