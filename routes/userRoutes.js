import express from "express";
import userAuth from "../middlewares/authMIddleware.js";
import {
  // getUserController,
  updateUserController,
} from "./../controllers/userController.js";

const router = express.Router();

// get users|| get
// router.get("/get-user", getUserController);
// update user || put
router.put("/update-user", userAuth, updateUserController);

export default router;
