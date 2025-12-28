import { userModel } from "../Models/userModel.js";
import { createAccessToken, createRefreshToken } from "../utils/createJwt.js";

/**
 * Handle Google OAuth callback
 * Creates or updates user, generates JWT tokens, sets cookies
 */
export const googleAuthCallback = async (req, res) => {
  try {
    const user = req.user;
   
    if (!user) {
      return res.status(401).json({
        message: "Authentication failed",
        authenticated: false,
      });
    }
 console.log("request for the google Auth callback received ",user)

    // Generate JWT tokens
    const accessToken = createAccessToken({
      userName: user.userName,
      email: user.email,
    });

    const refreshToken = createRefreshToken({
      userName: user.userName,
      email: user.email,
    });

    // Set tokens in cookies
    res.cookie("access_token", accessToken, {
      maxAge: 15 * 60 * 1000, // 15 minutes
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.cookie("refresh_token", refreshToken, {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Send response
    res.redirect(`${process.env.CLIENT_ORIGIN || "http://localhost:5173"}/dashboard`);
  } catch (error) {
    
    console.error("Google Auth Callback Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      authenticated: false,
      error: error.message,
    });
  }
};

/**
 * Handle Google authentication success
 * Used when frontend needs to verify OAuth success
 */
export const getAuthStatus = async (req, res) => {
  try {
    // Check if user is authenticated (from passport)
    if (!req.user) {
      return res.status(401).json({
        authenticated: false,
        message: "User not authenticated",
      });
    }

    return res.status(200).json({
      authenticated: true,
      user: {
        id: req.user._id,
        userName: req.user.userName,
        email: req.user.email,
        profilePicture: req.user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Get Auth Status Error:", error);
    return res.status(500).json({
      authenticated: false,
      message: "Internal server error",
    });
  }
};

/**
 * Logout user and clear cookies
 */
export const logout = async (req, res) => {
  try {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    return res.status(200).json({
      message: "Logout successful",
      authenticated: false,
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
