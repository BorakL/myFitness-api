const mongoose = require("mongoose");
const Workout = require("./workoutModel");

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    workout: {
        type: mongoose.Schema.ObjectId,
        ref: "Workout",
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
},{
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})


reviewSchema.statics.calcAverageRatings = async function(workoutId){
    const stats = await this.aggregate([
        {
            $match:{
                workout: workoutId
            }
        },
        {
            $group: {
                _id: "$workout",
                nRating: {$sum:1},
                avgRate: {$avg: "$rate"}
            }
        }
    ])
    if(stats.length>0){
        await Workout.findByIdAndUpdate(workoutId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRate
        })
    }
}

reviewSchema.post('save', function(){
    this.constructor.calcAverageRatings(this.workout)
}) 

//NIJE MOGUĆE TRAŽITI SA /^findOne/
reviewSchema.pre(/^findOneAnd/, async function(next){
    this.r = await this.findOne();
    next();
})

reviewSchema.post(/^findOneAnd/, async function(){
    await this.r.constructor.calcAverageRatings(this.r.workout);
})

reviewSchema.index({workout:1, user:1},{unique:true})

reviewSchema.pre(/^find/, function(){
    this.populate({
        path:"user",
        select:"name"
    })
}) 

const Review = mongoose.model("Review", reviewSchema)

module.exports = Review;
