import express from "express";
import userCtrl from "../controllers/user.controller.js";

const router = express.Router();
// router.route("/api/users").post(userCtrl.create);
router.route("/user").get(userCtrl.fetchUserDetails);

export default router;
