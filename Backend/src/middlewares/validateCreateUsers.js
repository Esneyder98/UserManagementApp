const { check, body } = require("express-validator");
const path = require("path");
const validateCreateUsers = [
  check("name")
    .notEmpty()
    .withMessage("Debes completar el campo nombre de usuario")
    .bail()
    .isLength({ min: 4, max: 45 })
    .withMessage("El nombre de usuario debe tener min:4 max:45 caracteres"),
  check("email")
    .notEmpty()
    .withMessage("¡Debes ingresar un email!")
    .bail()
    .isLength({ min: 6, max: 45 })
    .withMessage("El email debe tener min:6 max:45 caracteres")
    .bail()
    .isEmail()
    .withMessage("Debe ingresar un email valido"),
  body("image").custom((value, { req }) => {
    let file = req.file;
    let acceptedExtensions = [".jpg", ".png", ".gif", ".jpeg"];

    if (!file) {
      // se cargara imagen por defecto
    } else {
      let fileExtension = path.extname(file.originalname);
      if (!acceptedExtensions.includes(fileExtension)) {
        throw new Error(
          `Las extenciones de archivo permitidas son ${acceptedExtensions.join(
            ","
          )}`
        );
      }
    }
    return true;
  }),
  check("addres")
    .notEmpty()
    .withMessage("Debes completar el campo numero de documento")
    .bail()
    .isLength({ min: 6, max: 100 })
    .withMessage("La dirección debe tener min:6 max:100 caracteres"),
  check("phone")
    .notEmpty()
    .withMessage("Debes ingresar un telefono")
    .isLength({ min: 5, max: 13 })
    .withMessage("El rango de caracteres permitido es min:5 max:13")
    .bail()
    .isInt()
    .withMessage("Solo se permiten numeros"),

  check("occupation")
    .notEmpty()
    .withMessage("Debes ingresar una profesión")
    .bail()
    .isLength({ min: 3, max: 20 })
    .withMessage("Debes agregar una profesion de al min 3 caracteres max 20")
    .bail(),
  check("password")
    .notEmpty()
    .withMessage("Debes completar el campo contraseña")
    .bail()
    .isLength({ min: 8, max: 400 })
    .withMessage("El contraseña debe tener min:4 max:400 caracteres"),
];

module.exports = validateCreateUsers;
