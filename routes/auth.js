const express = require("express");
const router = express.Router();
const {getList} = require("../controllers/login.controller");
const apicache = require("apicache");
let cache = apicache.middleware;
const path = require("path");
const helmet = require('helmet')
const rateLimit = require('express-rate-limit');

router.use(helmet())

router.post("/getList",getList)


module.exports = router;
