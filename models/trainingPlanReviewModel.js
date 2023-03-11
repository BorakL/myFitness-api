const mongoose = require("mongoose");
const TrainingPlan = require("./trainingPlan");

const trainingPlanReviewSchema = new mongoose.Schema(
    {
        trainingPlanReview: {
            type: String,
            required: true
        },
        rate: {
            type: Number,
            min:1,
            max:5,
            required: true
        },
        trainingPlan: {
            type: mongoose.Schema.ObjectId,
            ref:"TrainingPlan"
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref:"User"
        }
    }
)

trainingPlanReviewSchema.statics.calcAverageRatings = async function(trainingPlanId){
    const stats = await this.aggregate([
        {
            $match: {trainingPlan: trainingPlanId}
        },
        {
            $group: {
                _id: "$trainingPlan",
                nRating: {$sum:1},
                avgRating: {$avg: "$rate"}
            }
        }
    ])
    if(stats.length>0){
        await TrainingPlan.findByIdAndUpdate(trainingPlanId,{
            nRating: stats[0].nRating,
            averageRating: stats[0].avgRating
        })
    }
}

trainingPlanReviewSchema.post('save',function(){
    this.constructor.calcAverageRatings(this.trainingPlan)
})

trainingPlanReviewSchema.pre(/^findOneAnd/, async function(next){
    this.r = await findOne();
    next();
})

trainingPlanReviewSchema.post(/^findOneAnd/, async function(){
    await this.r.constructor.calcAverageRatings(this.r.trainingPlan)
})


const TrainingPlanReview = mongoose.model("TrainingPlanReview",trainingPlanReviewSchema)

module.exports = TrainingPlanReview;