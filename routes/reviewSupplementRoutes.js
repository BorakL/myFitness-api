const express = require("express");
const { setSupplementUserIds, createReviewSupplement, getOneReviewSupplement, updateReviewSupplement, deleteReviewSupplement, getAllReviewsSupplement } = require("../controllers/reviewSupplementController");
const authController = require('./../controllers/authController')

const reviewSupplementRouter = express.Router({mergeParams:true});

reviewSupplementRouter.route("/").
    post(authController.protect, 
        setSupplementUserIds, 
        createReviewSupplement).
    get(getAllReviewsSupplement)

reviewSupplementRouter.route("/:id").
    get(getOneReviewSupplement).
    put(authController.protect, updateReviewSupplement).
    delete(authController.protect, deleteReviewSupplement)

module.exports = reviewSupplementRouter;