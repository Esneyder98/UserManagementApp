const express = require("express");
const router = express.Router();
const cors = require("cors");
const userController = require("../controllers/userController");
const imgUser = require("../middlewares/multerMiddleware");
const validateCreateUsers = require("../middlewares/validateCreateUsers")

router.get('/', cors(),userController.list)
router.post('/', cors(),imgUser.single('image'),validateCreateUsers,userController.create);
router.get('/:id', cors(),userController.detail)

module.exports = router;
