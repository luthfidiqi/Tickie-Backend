# Beginer Backend

## Collection Postman & Database

- Collection Postman [[here](https://documenter.getpostman.com/view/20144301/UVsSN3i8)]
- Database [[here](https://github.com/FazztrackWebClass/BeginerBackend/blob/main/tickitz.sql)]

## References

- Add Eslint Pretitier & Air Bnb [[here](https://dev.to/saurabhggc/add-eslint-prettier-and-airbnb-to-your-project-3mo8)]
- SQL Injection in Node.js [[here](https://www.veracode.com/blog/secure-development/how-prevent-sql-injection-nodejs)]
- Multiple Statement SQL [[here](https://stackoverflow.com/questions/23266854/node-mysql-multiple-statements-in-one-query)]

## Installation

- `npm i express body-parser cors morgan mysql2 helmet xss-clean compression`
- `npm i nodemon -D`
- `npx eslint --init`
- `npm i eslint prettier eslint-config-prettier eslint-plugin-prettier -D`

## Extensions

- `Eslint` - Dirk Baeumer
- `Path Intellisense` - Christian Kohler
- `Prettier` - Prettier

## Package

- `express` [[here](https://www.npmjs.com/package/express)]
- `body-parser` [[here](https://www.npmjs.com/package/body-parser)]
- `cors` [[here](https://www.npmjs.com/package/cors)]
- `morgan` [[here](https://www.npmjs.com/package/morgan)]
- `mysql2` [[here](https://www.npmjs.com/package/mysql2)]
- `helmet` [[here](https://www.npmjs.com/package/helmet)]
- `xss-clean` [[here](https://www.npmjs.com/package/xss-clean)]
- `compression` [[here](https://www.npmjs.com/package/compression)]
- `nodemon` [[here](https://www.npmjs.com/package/nodemon)]

## Modularisasi

- Public = untuk menyimpan file upload / file yang nntinya bsa diakses secara public oleh user
- Src = untuk menyimpan code dari project backend yang dibuat
  - index.js = file root untuk mengkonfigurasi beberapa library/framework untuk nantinya digunakan di dalam project
  - Config = untuk menyimpan konfigurasi
  - Helpers = untuk menyimpan suatu fungsi yang bsa digunakan di file berbeda
  - Routes = untuk menampung semua path route yang ada di dalam module / sebagai route navigation
  - Modules = untuk mengelompokkan suatu fitur di dalam request
    - Routes = menyimpan path dari tiap request / method
    - Controller = Logic / menyimpan data hasil request / mengeluarkan response
    - Model = database
