const helperWrapper = require("../../helpers/wrapper");
const movieModel = require("./movieModel");

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
      let { searchName, searchRelease, sort, page, limit } = request.query;

      if (!page) {
        page = 1;
      }

      if (!limit) {
        limit = 10;
      }

      if (!searchName) {
        searchName = "";
      }

      if (!searchRelease) {
        searchRelease = "";
      }

      if (!sort) {
        page = "id ASC";
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
        searchRelease,
        sort,
        limit,
        offset
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
      // 1. tangkap id
      // 2. proses pengecekan apakah id berada di dalam database
      // 3. buat model dengan query = DELETE FROM movie where id = ?
      // 4. resolve(id)
      // 5. set response
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
        updatedAt: new Date(Date.now()),
      };

      const result = await movieModel.deleteMovie(id, setData);
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
