const express = require("express");
const { processTask } = require("../controllers/taskController");
const router = express.Router();

router.post("/", processTask);

module.exports = router;
