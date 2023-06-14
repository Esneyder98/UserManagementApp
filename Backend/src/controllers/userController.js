const usersModel = require("../models/usersModel");
const bcryptjs = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const { validationResult } = require("express-validator");

const userController = {
  list: async(req,res)=>{
    try {
      let users = await usersModel.findAll();
      let protocol = req.protocol;
      let host = req.headers.host;
      if (users?.length > 0) {
        let result = users.map(user =>{
          let img = `${protocol}://${host}/img/${user.image}`
          return{
            name: user.name,
            email: user.email,
            image: img
          }
        })
        res.status(200).json({users:result})
      }else{
        res.status(400).json({
          error: 'lista de usuarios vacia'
        });
      }
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  },
  create: async (req, res) => {
    imagePath = path.join(__dirname, "../../public/img/" + req?.file?.filename);
    try {
      const resultValidation = validationResult(req);
      if (resultValidation.errors.length > 0) {
        fs.existsSync(imagePath) ? fs.unlinkSync(imagePath) : null;
        res.status(400).json({
          errors: resultValidation.mapped(),
        });
      } else {
        let emailInDB = await usersModel.findByEmail(req.body.email);
        if (emailInDB) {
          fs.existsSync(imagePath) ? fs.unlinkSync(imagePath) : null;
          res.status(400).json({
            message: "Email ya existe",
            user: emailInDB,
          });
        } else {
          let { name, email, addres, phone, occupation, password } = req.body;
          let file = req?.file;
          file ? file : (file = { filename: "default-user.png" });
          password = bcryptjs.hashSync(password, 10);

          const create = await usersModel.create(
            {
              name,
              email,
              addres,
              phone,
              occupation,
              password,
            },
            file
          );
          res.status(201).json({
            messaje: "User created successfully",
          });
        }
      }
    } catch (error) {
      fs.existsSync(imagePath) ? fs.unlinkSync(imagePath) : null;
      res.status(400).json({
        error: error.message,
      });
    }
  },
  detail: async (req, res) => {
    try {
      let {id}= req?.params;
      let protocol = req.protocol;
      let host = req.headers.host;
      if (!isNaN(id)) {
        let userDetail = await usersModel.findByPk(id);
        if (userDetail !== null && userDetail !== "undefined" && userDetail !== "") {
          let img = `${protocol}://${host}/img/${userDetail.image}`
          let result ={
            name: userDetail.name,
            email: userDetail.email,
            image:img,
            addres: userDetail.addres,
            phone:userDetail.phone,
            occupation:userDetail.occupation
          }
          res.status(200).json({
            userDetail:result,
          });
        }else{
          res.status(404).json({
            error: "no exite usuario con el parametro enviado",
          });
        }
      }else{
        res.status(404).json({
          error: "parametro invalido",
        });
      }
    
    } catch (error) {
      
    }
  }
};

module.exports = userController;
