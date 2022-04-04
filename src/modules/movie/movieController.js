const redis = require("../../config/redis");
const helperWrapper = require("../../helpers/wrapper");
const movieModel = require("./movieModel");
const cloudinary = require("../../config/cloudinary");

module.exports = {
  getHello: async (request, response) => {
    try {
      //   response.status(200);
      //   response.send("Hello World");
      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        "Hello World"
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getAllMovie: async (request, response) => {
    try {
      let { searchName, sort, page, releaseDate, limit } = request.query;

      if (!page) {
        page = 1;
      }

      if (!limit) {
        limit = 10;
      }

      if (!searchName) {
        searchName = "";
      }

      if (!sort) {
        sort = "id ASC";
      }

      if (!releaseDate) {
        releaseDate = "";
      }

      // searchName = String(searchName);
      // sort = String(sort);
      page = Number(page); // 2
      limit = Number(limit); // 3
      const offset = page * limit - limit; // 2 * 3 - 3 = 3
      const totalData = await movieModel.getCountMovie();
      const totalPage = Math.ceil(totalData / limit);
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };

      const result = await movieModel.getAllMovie(
        searchName,
        sort,
        limit,
        releaseDate,
        offset
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

      // Proses menyimpan data ke redis
      redis.setEx(`getMovie:${id}`, 3600, JSON.stringify(result));

      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  createMovie: async (request, response) => {
    try {
      console.log(
        `${request.file.filename}.${request.file.mimetype.split("/")[1]}`
      );
      // console.log(request.file);
      const {
        name,
        category,
        director,
        casts,
        releaseDate,
        duration,
        synopsis,
      } = request.body;

      const setData = {
        name,
        category,
        image: request.file ? request.file.filename : "",
        director,
        casts,
        releaseDate,
        duration,
        synopsis,
      };

      const result = await movieModel.createMovie(setData);

      return helperWrapper.response(
        response,
        200,
        "Success create data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
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
