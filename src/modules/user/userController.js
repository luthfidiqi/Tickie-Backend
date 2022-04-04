const bcrypt = require("bcrypt");
const userModel = require("./userModel");
const helperWrapper = require("../../helpers/wrapper");
const deleteFile = require("../../helpers/upload/deleteFile");

module.exports = {
  getUserById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await userModel.getUserById(id);
      if (result.length < 1) {
        return helperWrapper.response(
          response,
          404,
          `UserID with id ${id} is not found`,
          null
        );
      }

      return helperWrapper.response(
        response,
        200,
        `Success get data user !`,
        result
      );
    } catch (error) {
      return helperWrapper.response(
        response,
        404,
        `Bad Request ${error.message}`,
        null
      );
    }
  },
  updateProfile: async (request, response) => {
    try {
      const { id } = request.params;
      const checkId = await userModel.getUserById(id);

      if (checkId.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      const { firstName, lastName, email, noTelp } = request.body;
      const setUpdateData = {
        firstName,
        lastName,
        email,
        noTelp,
        updatedAt: new Date(Date.now()),
      };

      for (const data in setUpdateData) {
        if (!setUpdateData[data]) {
          delete setUpdateData[data];
        }
      }

      const result = await userModel.updateProfile(setUpdateData, id);
      return helperWrapper.response(
        response,
        200,
        `Success Update Profile`,
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  updateAvatar: async (request, response) => {
    try {
      const { id } = request.params;

      const image = request.file ? request.file.filename : null;

      if (!image) {
        return helperWrapper.response(response, 400, "Image Cant Empty");
      }

      const getUser = await userModel.getUserById(id);

      if (image && getUser[0].image) {
        deleteFile(`public/upload/user/${getUser[0].image}`, getUser[0].image);
      }

      const setData = {
        image,
        updatedAt: new Date(Date.now()),
      };

      let result;
      result = await userModel.updateAvatar(id, setData);
      return helperWrapper.response(
        response,
        200,
        `Success Update Image`,
        result
      );
    } catch (error) {
      return helperWrapper.response(
        response,
        400,
        `Bad Request ${error.message}`,
        null
      );
    }
  },
  updatePassword: async (request, response) => {
    try {
      const { id } = request.params;
      const { newPassword, confirmPassword } = request.body;

      const cekId = await userModel.cekId(id);
      if (cekId.length < 1) {
        return helperWrapper.response(response, 404, `User Not-Found`, null);
      }

      if (newPassword !== confirmPassword) {
        return helperWrapper.response(
          response,
          400,
          `New Password and Confirm Password must be the same`
        );
      }

      const password = await bcrypt.hash(newPassword, 10);

      const result = await userModel.updatePassword(id, password);
      return helperWrapper.response(
        response,
        200,
        `Password has changed`,
        request.params
      );
    } catch (error) {
      return helperWrapper.response(
        response,
        400,
        `Bad Request ${error.message}`,
        null
      );
    }
  },
};
