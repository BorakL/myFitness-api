const mongoose = require("mongoose");
const TrainingPlanReview = require("../models/trainingPlanReviewModel");
const catchAsync = require("../utils/catchAsync");
const { getAll, getOne, createOne, deleteOne, updateOne } = require("./handlerFactory");

exports.setUserTrainingPlanIds = (req,res,next) => {
    if(!req.body.user)req.body.user = req.user.id;
    if(!req.body.trainingPlan)req.body.trainingPlan = req.params.trainingPlanId
    next();
}

exports.getTrainingPlanReview = getOne(TrainingPlanReview);
exports.createTrainingPlanReview = createOne(TrainingPlanReview);
exports.deleteTrainingPlanReview = deleteOne(TrainingPlanReview);
exports.updateTrainingPlanReview = updateOne(TrainingPlanReview);

exports.getAllTrainingPlanReviews = catchAsync( async (req,res,next)=>{
    let limit = req.query.limit*1 || 24;
    let skip = req.query.skip*1 || 0;
    const reviews = await TrainingPlanReview.aggregate([
        {
            $match:{trainingPlan: mongoose.Types.ObjectId(req.params.trainingPlanId)}
        },
        {
            $facet:{
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