const usersModel = require("../models/usersModel");
const bcryptjs = require('bcryptjs');
const path = require("path");
const fs = require("fs");
const { validationResult } = require("express-validator");

const userController = {
  create: async (req, res) => {
    imagePath=path.join(__dirname, "../../public/img/" + req?.file?.filename)
    try {
      const resultValidation = validationResult(req);
      if (resultValidation.errors.length > 0) {
        fs.existsSync(imagePath)? fs.unlinkSync(imagePath):null
        res.status(400).json({
          errors: resultValidation.mapped(),
        });
      }else{
        let emailInDB = await usersModel.findByEmail(req.body.email);
        if (emailInDB) {
            fs.existsSync(imagePath)? fs.unlinkSync(imagePath):null
            res.status(400).json({
              message: "Email ya existe",
              user: emailInDB,
            });
        }else{
            let {
                name,
                email,
                addres,
                phone,
                occupation,
                password
            }= req.body
            let file = req?.file;
            file ? file : (file = { filename: "default-user.png" });
            password = bcryptjs.hashSync(password, 10);

            const create = await usersModel.create({
                name,email,addres,phone,occupation,password
            },file)
            res.status(201).json({
                messaje: "User created successfully",
              });
        }
      }
    } catch (error) {
        fs.existsSync(imagePath)? fs.unlinkSync(imagePath):null
        res.status(400).json({
            error: error.message,
          });
    }
  },
};

module.exports = userController;
