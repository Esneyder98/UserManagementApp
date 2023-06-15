const res = require("express/lib/response");
const db = require("../database/models");
const e = require("cors");

const usersModel = {
  // seleccina todos los registos existentes en la tabla users
  findAll: async () => {
    try {
      const list = await db.users.findAll({
        attributes: ["name","email","image"],
      });
      return list;
    } catch (error) {
      throw new Error("users not found"+error.message);
    }
  },
  // selecciona un usuario por su id
  findByPk: async (id) => {
    try {
      const user = await db.users.findByPk(id,{
        attributes: ["name","email","image","addres","phone","occupation"]
      });
      return user;
    } catch (error) {
      throw new Error("detalle de usuario no encontrado "+error.message);
    }
  },
  // creacion de usuarios con sus datos e imagen
  create: async (dates, file) => {
    try {
      const { filename } = file;
      const create = await db.users.create({
        ...dates,
        image: filename,
      });
      return create;
    } catch (error) {
      throw new Error("usuario no creado " + error.message);
    }
  },
// actualizacion de datos de usuario o imagen
  update: async (id, dates) => {
    try {
      let update;
      update = await db.users.update(
        {
          ...dates,
        },
        {
          where: { id: id },
        }
      );
      return update;
    } catch (error) {
      throw new Error("usuario no actualizado "+error.message);
    }
  },
// eliminacion de usuario por su id
  delete: async (id) => {
    try {
      const deletee = await db.users.destroy({
        where: {
          id: id,
        },
      });
      return deletee;
    } catch (error) {
      throw new Error("Error usuario no eliminado: "+error.message)
    }
  },
  // seleccion de email usuario para validar si ya existe ese email
    findByEmail: async function (email) {
    try {
      const user = await db.users.findOne({
        where: {
          email: email,
        },
        attributes: ["email"], // Selecciona solo el campo 'email'
      });
      return user;
    } catch (err) {
      throw new Error("Error al buscar usuario por email: " + err.message);
    }
  },
};
module.exports = usersModel;
