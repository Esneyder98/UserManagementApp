const express = require("express");
const router = express.Router();
const cors = require("cors");
const userController = require("../controllers/userController");
const imgUser = require("../middlewares/multerMiddleware");
const validateCreateUsers = require("../middlewares/validateCreateUsers")

router.post('/', cors(),imgUser.single('image'),validateCreateUsers,userController.create);

module.exports = router;
