const express = require("express");
const { getTrainingPlanReview, createTrainingPlanReview, getAllTrainingPlanReviews, updateTrainingPlanReview, deleteTrainingPlanReview, setUserTrainingPlanIds } = require("../controllers/trainingPlanReviewController");
const authController = require("./../controllers/authController")

const trainingPlanReviewRouter = express.Router({mergeParams:true});
 

trainingPlanReviewRouter.route("/").
    get(getAllTrainingPlanReviews).
    post(authController.protect, 
        setUserTrainingPlanIds, 
        createTrainingPlanReview)

trainingPlanReviewRouter.route("/:id").
    get(getTrainingPlanReview).
    put(authController.protect, updateTrainingPlanReview).
    delete(authController.protect, deleteTrainingPlanReview)

module.exports = trainingPlanReviewRouter;