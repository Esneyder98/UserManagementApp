const express = require("express");
const router = express.Router();
const cors = require("cors");
const userController = require("../controllers/userController");
const imgUser = require("../middlewares/multerMiddleware");
const validateCreateUsers = require("../middlewares/validateCreateUsers")
const validateUpdateUsers = require("../middlewares/validateUpdateUsers")

router.get('/', cors(),userController.list);
router.post('/', cors(),imgUser.single('image'),validateCreateUsers,userController.create);
router.get('/:id', cors(),userController.detail);
router.put('/:id', cors(),imgUser.single('image'),validateUpdateUsers,userController.update);
router.delete('/:id', cors(),userController.delete);

module.exports = router;
