const mongoose = require("mongoose")
const Supplement = require("./supplementModel")

const reviewSupplementModelSchema = new mongoose.Schema({
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
    supplement: {
        type: mongoose.Schema.ObjectId,
        ref: "Supplement",
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
    toJSON:{
        virtuals: true
    },
    toObject:{
        virtuals: true
    }
})

reviewSupplementModelSchema.pre(/^find/, function(){
    this.populate({
        path: "user",
        select: "name"
    })
})

reviewSupplementModelSchema.statics.calcAverageRatings = async function(supplement) {
    const stat = await this.aggregate([
        {
            $match: {supplement: supplement}
        },
        {
            $group: {
                _id: "supplement",
                nRatings: {$sum:1},
                avgRatings: {$avg: "$rate"}
            }
        }
    ])

    if(stat.length>0){
        await Supplement.findByIdAndUpdate(supplement,{
            ratingsQuantity: stat[0].nRatings,
            ratingsAverage: stat[0].avgRatings
        })
    } else{
        await Supplement.findByIdAndUpdate(supplement, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        })
    }
}

reviewSupplementModelSchema.post('save', function(){
    this.constructor.calcAverageRatings(this.supplement)
})

reviewSupplementModelSchema.pre(/^findOneAnd/, async function(next){
    this.r = await this.findOne();
    next();
})

reviewSupplementModelSchema.post(/^findOneAnd/, async function(){
    await this.r.constructor.calcAverageRatings(this.r.supplement)
})

const ReviewSupplement = mongoose.model("ReviewSupplement", reviewSupplementModelSchema)

module.exports = ReviewSupplement;