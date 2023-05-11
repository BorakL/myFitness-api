const express = require('express');
const { getAllReviews, createReview, getReview, updateReview, deleteReview, setWorkoutUserIds } = require('../controllers/reviewController');
const authController = require('./../controllers/authController')

const reviewRouter = express.Router({mergeParams:true});

reviewRouter.route("/").
    get(getAllReviews).
    post(authController.protect,
         setWorkoutUserIds,
         createReview)

reviewRouter.route("/:id").
    get(getReview).
    put(authController.protect,updateReview).
    delete(authController.protect,deleteReview)

module.exports = reviewRouter;