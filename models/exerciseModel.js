const mongoose = require("mongoose");
const { muscleGroups, exerciseTypes, equipments } = require("../definitions/definitions");

const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    tips: {
        type: String,
        required: true
    },
    target_muscle: {
        type: String,
        enum: muscleGroups,
        required: true
    },
    type: {
        type: String,
        enum: exerciseTypes,
        required: true
    },
    equipment: {
        type: String,
        enum: equipments,
        required: true
    },
    img: String,
    youtube_id: String
})

const Exercise = mongoose.model("Exercise",exerciseSchema)

module.exports = Exercise;