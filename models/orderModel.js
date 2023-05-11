const mongoose = require('mongoose')
const Supplement = require('./supplementModel')

const orderSchema = new mongoose.Schema({
    order:{
        type: [{
            item: {
                type: mongoose.Schema.ObjectId,
                ref: "Supplement",
                required: true
            },
            amount: {
                type: Number,
                default: 1
            }
        }],
        required: true,
        validate: {
            validator: async function(element){
                let results = [];
                for await (const e of element) {
                    const supplement = await Supplement.findById(e.item)
                    results.push(supplement.quantity > e.amount)
                }
                return !results.includes(false)
            },
            message: "Out of stock"
        }
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    shipmentData: {
        type: {
            country: String,
            city: String,
            deliveryAddress: String,
            paymentMethod: String,
            phoneNumber: String,
            postalCode: String
        },
        required: true
    },
    realised: {
        type: Boolean,
        default: false
    }
},{
    toJSON: {virtuals:true},
    toObject: {virtuals: true}
})


orderSchema.pre(/^find/, function(){
    this.populate({
            path: "order.item",
            select: "name weight price discount" 
        }).
        populate({
            path: "user"
        }) 
}) 

orderSchema.post('save', function(){
    this.order.forEach(async (o) => {
        await Supplement.findByIdAndUpdate(o.item, {$inc: {quantity: -o.amount}})
    })  
})

const Order = mongoose.model("Order", orderSchema)

module.exports = Order;