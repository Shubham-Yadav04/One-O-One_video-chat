import { createAccessToken ,createRefreshToken} from "../utils/createJwt.js";
import jwt from 'jsonwebtoken'
const authChecker = async (req, res, next) => {
  console.log("Auth Checker Middleware Invoked");
  if(req.user) return next()
  try {

    let { access_token, refresh_token } = req.cookies;
    if (!access_token && !refresh_token) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (access_token) { 
      try {
        const payload = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS_KEY);
        req.user = payload;
        return next();
      } catch (err) {
        console.log("error verifying the access token")
        return res.status(403).json({"message": "unauthorized"})
      }
    }

    if (refresh_token) {
      try {
        const payload = jwt.verify(refresh_token, process.env.JWT_SECRET_REFRESH_KEY);
        const newAccessToken = createAccessToken(payload);
        res.cookie("access_token", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
          maxAge: 15*60* 1000, 
        });
 
        req.user = payload;
        return next();
      } catch (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }
    }

    return res.status(403).json({ message: "Unauthorized" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default authChecker;
