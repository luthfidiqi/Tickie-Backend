const redis = require("../../config/redis");
const helperWrapper = require("../../helpers/wrapper");
const movieModel = require("./movieModel");
const cloudinary = require("../../config/cloudinary");

module.exports = {
  getAllMovie: async (request, response) => {
    try {
      let { page, limit, search, month, sort } = request.query;

      page = Number(page) || 1;
      limit = Number(limit) || 10;
      search = search || "";
      sort = sort || "id ASC";
      month = month || "";

      let offset = page * limit - limit;
      const totalData = await movieModel.getCountMovie(search);
      const totalPage = Math.ceil(totalData / limit);

      if (totalPage < page) {
        offset = 0;
        page = 1;
      }

      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };

      const result = await movieModel.getAllMovie(
        limit,
        offset,
        search,
        month,
        sort
      );

      redis.setEx(
        `getMovie:${JSON.stringify(request.query)}`,
        3600,
        JSON.stringify({ result, pageInfo })
      );

      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        result,
        pageInfo
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getMovieById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await movieModel.getMovieById(id);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      // PROSES UNTUK MENYIMPAN DATA KE DALAM REDIS
      redis.setEx(`getMovie:${id}`, 3600, JSON.stringify(result));

      return helperWrapper.response(
        response,
        200,
        "Success get data by id !",
        result
      );
    } catch (error) {
      return helperWrapper.response(
        response,
        400,
        `Bad Request (${error.message})`,
        null
      );
    }
  },
  createMovie: async (request, response) => {
    try {
      const {
        name,
        category,
        releaseDate,
        casts,
        director,
        duration,
        synopsis,
      } = request.body;

      const setData = {
        name,
        category,
        releaseDate,
        casts,
        director,
        duration,
        synopsis,
        image: request.file ? request.file.filename : "",
      };

      const result = await movieModel.createMovie(setData);

      return helperWrapper.response(
        response,
        200,
        "Success create data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(
        response,
        400,
        `Bad Request (${error.message})`,
        null
      );
    }
  },
  updateMovie: async (request, response) => {
    try {
      const { id } = request.params;
      const checkId = await movieModel.getMovieById(id);

      if (checkId.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      console.log(
        `${request.file.filename}.${request.file.mimetype.split("/")[1]}`
      );

      const {
        name,
        category,
        releaseDate,
        casts,
        director,
        duration,
        synopsis,
      } = request.body;

      const setData = {
        name,
        category,
        image: request.file ? request.file.filename : undefined,
        releaseDate,
        casts,
        director,
        duration,
        synopsis,
        updatedAt: new Date(Date.now()),
      };

      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        // console.log(data); // property
        // console.log(setData[data]); // value
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const result = await movieModel.updateMovie(id, setData);

      cloudinary.uploader.destroy(checkId[0].image, (result) => {
        console.log(result);
      });

      return helperWrapper.response(
        response,
        200,
        "Success update data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  deleteMovie: async (request, response) => {
    try {
      const { id } = request.params;
      const checkId = await movieModel.getMovieById(id);

      if (checkId.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      // console.log(checkId[0].image);

      const result = await movieModel.deleteMovie(id);

      cloudinary.uploader.destroy(checkId[0].image, (result) => {
        console.log(result);
      });

      return helperWrapper.response(
        response,
        200,
        "Success delete data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
