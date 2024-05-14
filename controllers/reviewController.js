const mongoose = require("mongoose");
const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const { deleteOne, createOne, getOne, updateOne, getAll } = require("./handlerFactory");

exports.setWorkoutUserIds = (req,res,next)=>{
    if(!req.body.workout) req.body.workout = req.params.workoutId;
    if(!req.body.user) req.body.user = req.user.id;
    next();
}

exports.deleteReview = deleteOne(Review);
exports.createReview = createOne(Review);
exports.updateReview = updateOne(Review);
exports.getReview = getOne(Review);

exports.getAllReviews = catchAsync( async (req,res,next)=>{
    let limit = req.query.limit*1 || 24;
    let skip = req.query.skip*1 || 0;
    const reviews = await Review.aggregate([
        {
            $match: {workout: mongoose.Types.ObjectId(req.params.workoutId)}
        },
        {
            $facet: {
                data:[
                    {$skip:skip},
                    {$limit:limit}
                ],
                total: [
                    {$count:"count"}
                ] 
            }
            
        }
    ])
    res.status(200).json({
        status:"success",
        reviews
    })

})