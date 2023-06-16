const express = require("express");
const router = express.Router();
const cors = require("cors");
const userController = require("../controllers/userController");
const imgUser = require("../middlewares/multerMiddleware");
const validateCreateUsers = require("../middlewares/validateCreateUsers")
const validateUpdateUsers = require("../middlewares/validateUpdateUsers")
const validateLoginUser = require("../middlewares/validateLoginUser");
const userLoggedMiddleware = require('../middlewares/userLoggedMiddleware');
const checkApiKey = require('../middlewares/auth.handler');

router.get('/', cors(),userController.list);
router.post('/', cors(),userLoggedMiddleware,checkApiKey,imgUser.single('image'),validateCreateUsers,userController.create);
router.get('/:id', cors(),userController.detail);
router.put('/:id', cors(),userLoggedMiddleware,checkApiKey,imgUser.single('image'),validateUpdateUsers,userController.update);
router.delete('/:id', cors(),userLoggedMiddleware,checkApiKey,userController.delete);
router.post("/login", cors(), validateLoginUser, userController.login);
router.get("/logout", cors(), userController.logout);

module.exports = router;
