const express = require("express");

const addCategoryController = require("../../controller/adminController/addCategoryController");

const deleteCategoryController = require("../../controller/adminController/deleteCategoryController");

const editCategoryController = require("../../controller/adminController/editCategoryController");


const router = express.Router();

router.get("/category", addCategoryController.addCategoryGet);

router.post("/category", addCategoryController.addCategoryPost);

router.get("/deleteCategory", deleteCategoryController.deletecategoryGet);

router.post("/editCategory", editCategoryController.editCategoryPost);

module.exports = router;