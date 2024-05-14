const { Mongoose } = require("mongoose");
const Order = require("../models/orderModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const setSortParam = require("../utils/setSortParam");
const { getOne, createOne, updateOne, deleteOne } = require("./handlerFactory")
const ObjectId = require('mongoose').Types.ObjectId;

exports.setUser = (req,res,next)=>{
    if(!req.body.user) req.body.user = req.user.id 
    next();
}

exports.getOneOrder = getOne(Order)
exports.createOrder = createOne(Order)
exports.updateOrder = updateOne(Order)
exports.deleteOrder = deleteOne(Order)

exports.getAllOrders = catchAsync(async (req,res,next)=>{
    let query={}
    let skip = req.query.skip*1 || 0
    let limit = req.query.limit*1 || 100
    let sort = {"_id":-1};
    if(req.query.sort) sort = setSortParam(req)
    if(req.query.user) query.user = new ObjectId(req.query.user)

    let orders = await Order.aggregate([
        {$match: query},
        {$skip: skip},
        {$limit: limit},
        {$sort:sort}
    ])

    const populateQuery = [
        {
            path: "order.item",
            select: "_id price name weight"
        }
    ]

    orders = await Order.populate(orders, populateQuery)

    res.status(200).json({
        status:"success",
        orders
    })
})