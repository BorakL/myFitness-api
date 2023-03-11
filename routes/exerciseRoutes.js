const express = require("express");
const { restrictTo, protect } = require("../controllers/authController");
const { getAllExercises, createExercise, getExercise, updateExercise, deleteExercise } = require("../controllers/exerciseController");

const exerciseRouter = express.Router();
 

exerciseRouter.
    route("/").
    get(getAllExercises).
    post(protect,restrictTo("admin"), createExercise)

exerciseRouter.
    route("/:id").
    get(getExercise).
    put(protect, restrictTo("admin"), updateExercise).
    delete(protect, restrictTo("admin"), deleteExercise)

module.exports = exerciseRouter;