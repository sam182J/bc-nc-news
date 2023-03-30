function errorHandlerPSQL(err, req, res, next) {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid ID" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "ID not found" });
  }
  next(err);
}
module.exports = errorHandlerPSQL;
