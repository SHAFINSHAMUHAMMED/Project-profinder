import jwt from 'jsonwebtoken'
import env from 'dotenv'
env.config()
export const generateToken = (user)=>{
    const token= jwt.sign({_id:user._id,name:user.name,email:user.email}, process.env.secretKey,{expiresIn:'2h'})
    return token
}
export const verifyToken = async (req, res, next) => {
    let token = req.headers.authorization;
    console.log(token,'ttttoooooooookkkkeeennnn Auth');
    try {
      if (!token) return res.json({ token: "Authentication failed: no token provided.", status: false });
  
      if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length).trimLeft();
      }
      const verified = jwt.verify(token, process.env.secretKey);
      // res.json({status: true });
      next();
    } catch (error) {
      console.log("Token Expired");
      return res.json({ status: false });
    }
  };
  