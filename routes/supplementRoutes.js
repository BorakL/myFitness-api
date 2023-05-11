const express = require("express");
const { createSupplement, getOneSupplement, updateSupplement, deleteSupplement, getAllSupplements } = require("../controllers/supplementController");
const reviewSupplementRouter = require("./reviewSupplementRoutes");
const authController = require("./../controllers/authController");
const { setAuthorId } = require("../controllers/workoutController");

const supplementRouter = express.Router();

supplementRouter.use("/:supplementId/reviews",reviewSupplementRouter)

supplementRouter.
    route("/"). 
    get(getAllSupplements).
    post(
        authController.protect,
        setAuthorId,
        createSupplement
    )

supplementRouter.
    route("/:id").
    get(getOneSupplement).
    put(
        authController.protect,
        authController.restrictTo("admin"),
        updateSupplement
    ).
    delete(
        authController.protect,
        authController.restrictTo("admin"),
        deleteSupplement
    )

module.exports = supplementRouter;