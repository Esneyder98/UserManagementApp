const usersModel = require("../models/usersModel");
const bcryptjs = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require("../database/config/config");

const userController = {
  list: async (req, res) => {
    try {
      let users = await usersModel.findAll();
      let protocol = req.protocol;
      let host = req.headers.host;
      if (users?.length > 0) {
        let result = users.map((user) => {
          let img = `${protocol}://${host}/img/${user.image}`;
          return {
            name: user.name,
            email: user.email,
            image: img,
          };
        });
        res.status(200).json({ users: result });
      } else {
        res.status(400).json({
          error: "lista de usuarios vacia",
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
      let { id } = req?.params;
      let protocol = req.protocol;
      let host = req.headers.host;
      if (!isNaN(id)) {
        let userDetail = await usersModel.findByPk(id);
        if (
          userDetail !== null &&
          userDetail !== "undefined" &&
          userDetail !== ""
        ) {
          let img = `${protocol}://${host}/img/${userDetail.image}`;
          let result = {
            name: userDetail.name,
            email: userDetail.email,
            image: img,
            addres: userDetail.addres,
            phone: userDetail.phone,
            occupation: userDetail.occupation,
          };
          res.status(200).json({
            userDetail: result,
          });
        } else {
          res.status(404).json({
            error: "no exite usuario con el parametro enviado",
          });
        }
      } else {
        res.status(404).json({
          error: "parametro invalido",
        });
      }
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  },
  update: async (req, res) => {
    try {
      let { id } = req.params;
      if (!isNaN(id)) {
        const resultValidation = validationResult(req);
        if (resultValidation.errors.length > 0) {
          fs.existsSync(
            path.join(__dirname, "../../public/img/" + req?.file?.filename)
          )
            ? fs.unlinkSync(
                path.join(__dirname, "../../public/img/" + req?.file?.filename)
              )
            : null;

          res.status(400).json({
            errors: resultValidation.mapped(),
          });
        } else {
          let update;
          let body = req?.body;
          const file = req?.file;
          let detail = await usersModel.findByPk(id);
          let oldImage = detail?.image;
          if (req?.body?.password) {
            // si no se realizaron los cambios eliminamos la imagen cargada
            fs.existsSync(
              path.join(__dirname, "../../public/img/" + req?.file?.filename)
            )
              ? fs.unlinkSync(
                  path.join(
                    __dirname,
                    "../../public/img/" + req?.file?.filename
                  )
                )
              : null;
            res.status(401).json({
              error:
                "No esta permitido actualizar la contraseña de esta manera",
            });
          } else {
            if (detail == null || detail == undefined) {
              res.status(404).json({
                error: "Usuario no encontrado",
              });
            } else {
              file
                ? (update = await usersModel.update(id, {
                    ...body,
                    image: file.filename,
                  }))
                : (update = await usersModel.update(id, { ...body }));
              if (update[0] == 1) {
                // eliminamos la imagen antigua
                let validation = [null, undefined, "", "default-user.png"];
                if (!validation.includes(oldImage) && file) {
                  //validamos si existe la imagen antigua; si existe la eliminamos
                  fs.existsSync(
                    path.join(__dirname, "../../public/img/" + oldImage)
                  )
                    ? fs.unlinkSync(
                        path.join(__dirname, "../../public/img/" + oldImage)
                      )
                    : null;
                }
                let protocol = req.protocol;
                let host = req.headers.host;
                detail = await usersModel.findByPk(id);
                let img = `${protocol}://${host}/img/${detail.image}`;
                let result = {
                  name: detail.name,
                  email: detail.email,
                  image: img,
                  addres: detail.addres,
                  phone: detail.phone,
                  occupation: detail.occupation,
                };
                res.status(200).json({
                  message: "Update",
                  data: result,
                });
              } else {
                // si no se realizaron los cambios eliminamos la imagen cargada
                fs.existsSync(
                  path.join(
                    __dirname,
                    "../../public/img/" + req?.file?.filename
                  )
                )
                  ? fs.unlinkSync(
                      path.join(
                        __dirname,
                        "../../public/img/" + req?.file?.filename
                      )
                    )
                  : null;

                res.status(404).json({
                  error: "No se encontraron datos a actualizar",
                });
              }
            }
          }
        }
      } else {
        fs.existsSync(
          path.join(__dirname, "../../public/img/" + req?.file?.filename)
        )
          ? fs.unlinkSync(
              path.join(__dirname, "../../public/img/" + req?.file?.filename)
            )
          : null;

        res.status(404).json({
          error: "parametro invalido",
        });
      }
    } catch (error) {
      // si hay un error interno del servidor eliminamos la imagen cargada
      fs.existsSync(
        path.join(__dirname, "../../public/img/" + req?.file?.filename)
      )
        ? fs.unlinkSync(
            path.join(__dirname, "../../public/img/" + req?.file?.filename)
          )
        : null;
      res.status(500).json({
        error: error.message,
      });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      if (!isNaN(id)) {
        let user = await usersModel.findByPk(id);
        if (user == null || user == undefined || user == "") {
          res.status(404).json({
            error: "Usuario no encontrado",
          });
        } else {
          let image = user.image;
          let deleteUser = await usersModel.delete(id);
          if (deleteUser > 0) {
            // si el usuario tenia una imagen asociada diferente a la por defecto la elimina
            if (user?.image != "default-user.png") {
              fs.existsSync(path.join(__dirname, "../../public/img/" + image))
                ? fs.unlinkSync(
                    path.join(__dirname, "../../public/img/" + image)
                  )
                : null;
            }

            res.status(200).json({
              message: "Usuario Eliminado Correctamente",
            });
          } else {
            res.status(404).json({
              error: "Usuario no eliminado",
            });
          }
        }
      } else {
        res.status(404).json({
          error: "parametro invalido",
        });
      }
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  },
  login: async (req, res) => {
    try {
      const resultValidation = validationResult(req);
      if (resultValidation.errors.length > 0) {
        return res.status(400).json({
          errors: resultValidation.mapped(),
        });
      }
      let userToLogin = await usersModel.findByLogin(req.body.email);
      if (userToLogin) {
        let isOkThePassword = bcryptjs.compareSync(
          req.body.password,
          userToLogin.password
        );
        if (isOkThePassword) {
          // Eliminar la clave por seguridad
          delete userToLogin.password;
          // Conservar la sesión del usuario
          req.session.userLogged = userToLogin;

          const userJWT = req.session.userLogged;
          const payload = {
            sub: userJWT.id,
            role: "admin",
          };
          const token = await jwt.sign(payload, config.development.jwtSecret);
          req.session.token = token;

          return res.status(200).json({
            email: userToLogin.email,
            access_token: token,
          });
        } else {
          return res.status(404).json({
            error: "Credenciales inválidas",
          });
        }
      } else {
        return res.status(404).json({
          error: "Email no existe",
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },
  logout: (req, res) => {
    try {
      // borro lo que este en sesion
      if (req.session.userLogged) {
        if (req.session.destroy()) {
          return res.status(200).json({
            message: "session ended",
            logout: true,
          });
        }
      } else {
        return res.status(404).json({
          message: "No hay sesion activa",
        });
      }
    } catch (error) {
      return error.message;
    }
  },
  pagination: async (req, res) => {
    let { page } = req.params;
    let protocol = req.protocol;
    let host = req.headers.host;
    if (!isNaN(page)) {
      let amount = await usersModel.findAll();
      if (amount.length > 0) {
        let users = await usersModel.findPage(page);
        if (users.length > 0) {
          let result = users.map((user) => {
            let img = `${protocol}://${host}/img/${user.image}`;
            return {
              name: user.name,
              email: user.email,
              image: img,
            };
          });
          res.status(200).json({ 
            length: amount.length,
            users: result 
          });
        }else{
          res.status(404).json({
            error: "no hay mas usuarios por mostrar",
          });
        }
      } else {
        res.status(404).json({
          error: "no hay usuarios registrados",
        });
      }
    } else {
      res.status(404).json({
        error: "parametro invalido",
      });
    }
  },
};
module.exports = userController;
