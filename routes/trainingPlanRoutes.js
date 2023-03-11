const express = require("express");
const { getAllTrainingPlans, createTrainingPlan, getTrainingPlan, updateTrainingPlan, deleteTrainingPlan, setAuthorId } = require("../controllers/trainingPlanController");
const authController = require("./../controllers/authController");
const trainingPlanReviewRouter = require("./trainingPlanReviewRoutes");

const trainingPlanRouter = express.Router();

trainingPlanRouter.use("/:trainingPlanId/reviews",trainingPlanReviewRouter)

trainingPlanRouter.
    route("/").
    get(getAllTrainingPlans).
    post(authController.protect,
        setAuthorId,
        createTrainingPlan)

trainingPlanRouter.
    route("/:id").
    get(getTrainingPlan).
    put(authController.protect, 
        updateTrainingPlan).
    delete(authController.protect, 
        deleteTrainingPlan)

module.exports = trainingPlanRouter