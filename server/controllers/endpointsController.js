const { fetchEndpoints } = require("../models/index");
getEndpoints = (req, res, next) => {
  fetchEndpoints()
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })
    .catch(next);
};

module.exports = getEndpoints;
