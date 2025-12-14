import { userModel } from "../Models/userModel.js";
import { createAccessToken, createRefreshToken } from "./createJwt.js";
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      message: "all the field are required",
    });
  try {
    const user = await userModel.findOne({ email });
    console.log(user);
    if (!user)
      return res.status(404).json({
        message: "no such user exist",
      });
const iscorrect=await user.comparePassword(password)
    if (iscorrect) {
      res.cookie(
        "access_token",
        createAccessToken({
          userName: user.userName,
          email: user.email,
        }),
        {
          maxAge: 15 * 60 * 1000,
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        }
      );
      console.log(createRefreshToken({
          userName: user.userName,
          email: user.email,
        }))
      res.cookie(
        "refresh_token",
        createRefreshToken({
          userName: user.userName,
          email: user.email,
        }),
        {
          maxAge: 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        }
      );

      req.user = {
        userName: user.userName,
        email: user.email,
        id: user._id,
      };
      return res.status(200).json({
        success: true,
        user: {
          userName: user.userName,
          email: user.email,
          id: user._id,
        },
      });
    }
    return res.status(403).json({
      message: "unauthorized ",
    });
  } catch (error) {
    console.log("some error occured during the loggin ", error.message);
    return res.status(500).json({
      messsage: "internal server error ",
    });
  }
};
