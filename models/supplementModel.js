const mongoose = require('mongoose');
const { supplementBrands, supplementMeassures } = require('../definitions/definitions');

const nutritionSchema = new mongoose.Schema({ 
    calories: Number,
    fat: Number,
    carbohydrate: Number,
    protein: Number 
})

const weightSchema = new mongoose.Schema({
    measure: {
        type: String,
        required: true,
        enum: supplementMeassures
    },
    weight: {
        type: Number,
        required: true
    }
})

const supplementSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    weight: weightSchema,
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
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    photo: {
        type: String
    },
    brand: {
        type: String,
        enum: supplementBrands,
        required: true
    },
    vegan: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    flavour: {
        type: String
    },
    nutrition: nutritionSchema, 
    ratingsAverage: Number,
    ratingsQuantity: Number,
    quantity: {
        type: Number,
        default: 1
    }
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})


supplementSchema.virtual("supplementReviews", {
    ref:"ReviewSupplement",
    foreignField: "supplement",
    localField: "_id"
})

const Supplement = mongoose.model("Supplement", supplementSchema)

module.exports = Supplement