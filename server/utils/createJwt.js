import jwt from 'jsonwebtoken'
export const createAccessToken= (payload)=>{
    const token=jwt.sign(payload,process.env.JWT_SECRET_ACCESS_KEY,{
        expiresIn:15*60*1000,
    })
    return token;
}

export const createRefreshToken= (payload)=>{
    const token=jwt.sign(payload,process.env.JWT_SECRET_REFRESH_KEY,{
        expiresIn:24*60*60*1000,
    })
    return token;
}