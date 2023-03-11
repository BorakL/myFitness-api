const mongoose = require("mongoose");
const TrainingPlan = require("../models/trainingPlan");
const catchAsync = require("../utils/catchAsync");
const { deleteOne, createOne, getOne, updateOne, getAll } = require("./handlerFactory");

exports.setAuthorId = (req,res,next)=>{
    if(!req.body.author)req.body.author = req.user.id;
    next();
}

exports.deleteTrainingPlan = deleteOne(TrainingPlan);
exports.createTrainingPlan = createOne(TrainingPlan);
exports.updateTrainingPlan = updateOne(TrainingPlan);
exports.getTrainingPlan = getOne(TrainingPlan, {path:'reviews'});
// exports.getAllTrainingPlans = getAll(TrainingPlan); 

exports.getAllTrainingPlans = catchAsync( async (req,res,next)=>{
    let limit = req.query.limit*1 || 24;
    let skip = req.query.skip*1 || 0;
    const reviews = await TrainingPlan.aggregate([
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