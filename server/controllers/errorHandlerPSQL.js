function errorHandlerPSQL(err, req, res, next) {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid ID" });
  }
  next(err);
}
module.exports = errorHandlerPSQL;
