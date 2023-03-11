const mongoose = require("mongoose");
const { levels, muscleGroups, workoutCategories } = require("../definitions/definitions");

const workoutSchema = new mongoose.Schema({
    level: {
        type: String,
        enum: levels,
        required: true
    },
    shortDescription: {
        type: String,
        required: true,
        max: 150
    },
    longDescription: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: workoutCategories
    },  
    muscleGroups: {
        type: [String],
        required: true,
        enum: muscleGroups
    },
    exercises: [{
        exercise:{
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: "Exercise"
        },
        sets: Number,
        reps: Number
    }], 
    ratingsAverage: Number,
    ratingsQuantity: Number,
    author: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    isVisible:{
        type:Boolean,
        default: true,
        select: false
    },
    image: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

workoutSchema.pre(/^find/,function(){
    this.populate({
        path:"author",
        select:"name"
    })
})

workoutSchema.pre(/^find/,function(){
    this.populate({
        path:"exercises.exercise",
        select:"name img equipment"
    })
})

workoutSchema.virtual("name").get(function(){ 
     return  `${this.muscleGroups.join(" and ")} workout ${this.id.slice(-5)}`
 })

workoutSchema.virtual("reviews",{
    ref:"Review",
    foreignField:"workout",
    localField:"_id"
})

const Workout = mongoose.model("Workout",workoutSchema);

module.exports = Workout;