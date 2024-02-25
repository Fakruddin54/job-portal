import express from "express";
import { testPostController } from "./../controllers/testControlers.js";
import userAuth from "./../middlewares/authMIddleware.js";

// route
const router = express.Router();
router.post("/test-post", userAuth, testPostController);

export default router;
