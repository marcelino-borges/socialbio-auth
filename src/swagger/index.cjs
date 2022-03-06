const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./src/routes/index.ts"];
const doc = {
  info: {
    version: "1.0.0",
    title: "SocialBio Authentication Service",
    description: "Authentication service for the application in react",
  },
  host: "http://www.localhost:5000",
  basePath: "/",
  consumes: ["application/json"],
  produces: ["application/json"],

  definitions: {
    Token: {
      accessToken: "asd123asd-asd12asd",
      refreshToken: "a1zasf23asd-hjyqw1567asd",
      expiresIn: 3600,
    },
    AppResult: {
      message: "Message result of the request",
      errorDetails: "In case of error, here goes the details",
      statusCode: 400,
    },
  },
};
swaggerAutogen(outputFile, endpointsFiles, doc);
