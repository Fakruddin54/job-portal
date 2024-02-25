// error middleware

const errorMiddleware = (err, req, res, next) => {
  const defaultErrors = {
    statusCode: 500,
    message: err,
    // message: "somthing went wrong",
  };
  // res.status(500).send({
  //   success: false,
  //   message: "Something went wrong",
  //   err,
  // });
  // code missing field type
  if (err.name === "validation") {
    defaultErrors.statusCode = 400;
    defaultErrors.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
  }
  // duplicate error
  if (err.code && err.code === 11000) {
    defaultErrors.statusCode = 400;
    defaultErrors.message = `${Object.keys(
      err.keyValue
    )} field should be unique`;
  }
  res.status(defaultErrors.statusCode).json({ message: defaultErrors.message });
};

export default errorMiddleware;
