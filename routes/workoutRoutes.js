const express = require("express");
const { uploadImages, resizeImages } = require("../controllers/handlerFactory");
const { getWorkout, createWorkout, updateWorkout, deleteWorkout, getAllWorkout, setAuthorId, getTopWorkout } = require("../controllers/workoutController");
const authController = require("./../controllers/authController");
const reviewRouter = require("./reviewRoutes");

const workoutRouter = express.Router();

workoutRouter.use("/:workoutId/reviews",reviewRouter);

workoutRouter.
    route("/topWorkouts").
    get(getTopWorkout)

workoutRouter.
    route("/").
    get(getAllWorkout).
    post(authController.protect,setAuthorId,createWorkout)

workoutRouter.
    route("/:id").
    get(getWorkout).
    put(
        authController.protect, 
        authController.restrictTo("admin"),
        uploadImages,
        resizeImages({path:'public/img/workouts',extension:"png",quality:90}),        
        updateWorkout
    ).
    delete(
        authController.protect, 
        authController.restrictTo("admin"),
        deleteWorkout
    )

module.exports = workoutRouter;