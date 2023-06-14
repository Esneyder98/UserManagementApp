const res = require("express/lib/response");
const db = require("../database/models");

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
      // }
    } catch (error) {
      throw new Error("User not update");
    }
  },

  delete: async (id) => {
    try {
      const deletee = await db.users.destroy({
        where: {
          id: id,
        },
      });
      return deletee;
    } catch (error) {
      console.log(error.message);
    }
  },
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
