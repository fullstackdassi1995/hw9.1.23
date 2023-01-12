const express = require('express')
const router = express.Router()
const path = require('path')
const url = require('url')
const cors = require('cors')
const knex = require('knex')
const config = require('config')
const { json } = require('body-parser')
const { response } = require('express')


const testRouter = require('./routes/test')
const test_repo = require('./dal/test_repo')
const logger = require('./logger/my_logger')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express') 
const app = express()


const connectedKnex = knex({
    client: 'pg',
    version: config.db.version, 
    connection: {
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database
    }
})


const port = config.express.port

app.use(express.static(path.join('.', '/static/'))) // /static/index.html
// page1.html

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})


const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Library API",
        version: "1.0.0",
        description:"A simple Express Library API",
      },
      servers: [
        {
          url: "http://localhost:8080/",
        },
      ],
    },
    apis: ["./routes/*.js"],
  };
  
const specs = swaggerJsdoc(options);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
  );

  app.use('/test', testRouter)
