const mongoose = require("mongoose");
const { mainGoals } = require("../definitions/definitions");


const trainingPlanSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description: String,
    weeks: {
        type: Number,
        min:1,
        required: true
    }, 
    plan:{
        type: [String],
        required: true,
        validate:[
            {
                validator: function(val){
                    return val[0]!=="" 
                },
                message: "First day cannot be rest day"
            },
            {
                validator: function(val){
                    return val.length===7
                },
                message: "This is weekly plan, so the number of days must be 7"
            }
        ]
    },
    workouts: { 
        type:[
            {
                type: mongoose.Schema.ObjectId,
                ref: "Workout"
            }
        ],
        required:true
    },
    created:{
        type: Date,
        default: new Date()
    },
    mainGoal:{
        type: String,
        enum: mainGoals,
        default: "Build Muscle",
        required: true
    },
    averageRating: Number,
    nRating: Number
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

trainingPlanSchema.pre("save",function(){ 
    this.workouts = [...new Set(this.plan.filter(p=>p))]
})

trainingPlanSchema.pre(/^find/,function(){
    this.populate({
        path:"workouts",
        select: "-description"
    })
})

trainingPlanSchema.virtual("reviews",{
    ref:"TrainingPlanReview",
    foreignField:"trainingPlan",
    localField:"_id"
})

const TrainingPlan = mongoose.model("TrainingPlan",trainingPlanSchema)

module.exports = TrainingPlan;