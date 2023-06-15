const { check, body } = require("express-validator");
const path = require("path");

const validateUpdateUsers = [
  check("name")
    .optional()
    .isLength({ min: 4, max: 45 })
    .withMessage("El nombre de usuario debe tener min:4 max:45 caracteres"),
  check("email")
    .optional()
    .isLength({ min: 6, max: 45 })
    .withMessage("El email debe tener min:6 max:45 caracteres")
    .isEmail()
    .withMessage("Debe ingresar un email válido"),
  body("image").optional().custom((value, { req }) => {
    let file = req?.file;
    let acceptedExtensions = [".jpg", ".png", ".gif", ".jpeg"];

    if (file) {
      let fileExtension = path.extname(file.originalname);
      if (!acceptedExtensions.includes(fileExtension)) {
        throw new Error(
          `Las extensiones de archivo permitidas son ${acceptedExtensions.join(
            ","
          )}`
        );
      }
    }
    return true;
  }),
  check("addres")
    .optional()
    .isLength({ min: 6, max: 100 })
    .withMessage("La dirección debe tener min:6 max:100 caracteres"),
  check("phone")
    .optional()
    .isLength({ min: 5, max: 13 })
    .withMessage("El rango de caracteres permitido es min:5 max:13")
    .isInt()
    .withMessage("Solo se permiten números"),
  check("occupation")
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage("Debes agregar una profesión de al menos 3 caracteres y máximo 20"),
  check("password")
    .optional()
    .isLength({ min: 8, max: 400 })
    .withMessage("La contraseña debe tener min:8 max:400 caracteres"),
];

module.exports = validateUpdateUsers;