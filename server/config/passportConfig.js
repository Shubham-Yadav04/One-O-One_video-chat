import passport  from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { userModel } from '../Models/userModel.js';
import { configDotenv } from 'dotenv';
// Configure Google OAuth Strategy
configDotenv();
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/user/auth/google/callback',
    },
    
    async (accessToken, refreshToken, profile, done) => {
        
      try {
        // Check if user exists with this email (from previous local signup)
        console.log("user " ,profile)
        const user = await userModel.findOne({ email: profile.emails[0].value });

        if (user) {
          if (!user.profilePicture && profile.photos[0]) {
            user.profilePicture = profile.photos[0].value;
          }
          await user.save();
          return done(null, user);
        }
console.log("user found ",user)
        // Create new user with Google OAuth
        const newUser = new userModel({
          userName: profile.displayName || profile.emails[0].value.split('@')[0],
          email: profile.emails[0].value,
          googleId: profile.id,
          profilePicture: profile.photos[0]?.value || null,
          // Password is not required for OAuth users
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        console.error('Google Auth Error:', error);
        return done(error, null);
      }
    }
  )
);

// // Serialize user to session
// passport.serializeUser((user, done) => {
//   done(null, user._id);
// });

// // Deserialize user from session
// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await userModel.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// });

export default passport;
