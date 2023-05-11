const ReviewSupplement = require("../models/reviewSupplementModel")
const { getOne, createOne, updateOne, deleteOne, getAll } = require("./handlerFactory")

exports.setSupplementUserIds = (req,res,next) => {
    if(!req.body.supplement) req.body.supplement = req.params.supplementId
    if(!req.body.user) req.body.user = req.user.id;
    next();
}

exports.getOneReviewSupplement = getOne(ReviewSupplement)
exports.createReviewSupplement = createOne(ReviewSupplement)
exports.updateReviewSupplement = updateOne(ReviewSupplement)
exports.deleteReviewSupplement = deleteOne(ReviewSupplement)
exports.getAllReviewsSupplement = getAll(ReviewSupplement)