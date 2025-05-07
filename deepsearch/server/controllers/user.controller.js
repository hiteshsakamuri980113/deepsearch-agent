// import User from "../models/user.model.js";
import extend from "lodash/extend.js";

import { spotifyApi } from "../../server.js";

const fetchUserDetails = async (req, res) => {
  try {
    const accessToken = req.query.access_token;

    if (!accessToken) {
      return res.status(400).json({ error: "Access token is required" });
    }

    spotifyApi.setAccessToken(accessToken);

    const userDetails = await spotifyApi.getMe();

    console.log("userDetails: ", userDetails);

    res.status(200).json(userDetails.body);
  } catch (error) {
    console.error("Error fetching Spotify user details:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch user details from Spotify" });
  }
};

// const create = async (req, res) => {
//   const user = new User(req.body);
//   try {
//     console.log(req.body);
//     console.log(user);
//     await user.save();
//     return res.status(200).json({
//       message: "Successfully signed up!",
//     });
//   } catch (err) {
//     return res.status(400).json({
//       error: errorHandler.getErrorMessage(err),
//     });
//   }
// };

// const list = async (req, res) => {
//   try {
//     // console.log("this is Get");
//     let users = await User.find().select("name email updated created");
//     // console.log(users);
//     res.json(users);
//   } catch (err) {
//     console.log(err);
//     return res.status(400).json({
//       error: errorHandler.getErrorMessage(err),
//     });
//   }
// };

// const userByID = async (req, res, next, id) => {
//   try {
//     let user = await User.findById(id);
//     if (!user)
//       return res.status("400").json({
//         error: "User not found",
//       });
//     req.profile = user;
//     next();
//   } catch (err) {
//     return res.status("400").json({
//       error: "Could not retrieve user",
//     });
//   }
// };

// const read = (req, res) => {
//   req.profile.hashed_password = undefined;
//   req.profile.salt = undefined;
//   return res.json(req.profile);
// };

// const update = async (req, res) => {
//   try {
//     let user = req.profile;
//     user = extend(user, req.body);
//     user.updated = Date.now();
//     await user.save();
//     user.hashed_password = undefined;
//     user.salt = undefined;
//     res.json(user);
//   } catch (err) {
//     return res.status(400).json({
//       error: errorHandler.getErrorMessage(err),
//     });
//   }
// };

// const remove = async (req, res) => {
//   try {
//     let user = req.profile;
//     let deletedUser = await user.remove();
//     deletedUser.hashed_password = undefined;
//     deletedUser.salt = undefined;
//     res.json(deletedUser);
//   } catch (err) {
//     return res.status(400).json({
//       error: errorHandler.getErrorMessage(err),
//     });
//   }
// };

export default { fetchUserDetails };
