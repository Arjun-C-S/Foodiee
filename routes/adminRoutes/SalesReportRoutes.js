
const express = require("express");

const salesReportController = require("../../controller/adminController/salesReportController");

const router = express.Router();

router.get("/salesReportToday", salesReportController.salesReporTodaytGet);
router.get("/salesReportWeek", salesReportController.salesReportWeekGet);
router.get("/salesReportYear", salesReportController.salesReportYearGet);

module.exports = router;