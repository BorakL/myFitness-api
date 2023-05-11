const  mongoose  = require("mongoose")
const Supplement = require("../models/supplementModel")
const catchAsync = require("../utils/catchAsync")
const setSortParam = require("../utils/setSortParam")
const { getOne, createOne, updateOne, deleteOne } = require("./handlerFactory")

exports.getOneSupplement = getOne(Supplement,{path:'supplementReviews'})
exports.createSupplement = createOne(Supplement)
exports.updateSupplement = updateOne(Supplement)
exports.deleteSupplement = deleteOne(Supplement)

exports.getAllSupplements = (catchAsync (async(req,res,next) => {
    let query={}
    let sort = {"name":1}
    let skip = req.query.skip*1 || 0
    let limit = req.query.limit*1 || 24

    if(req.query.name) query.name = {$regex: req.query.name.trim(), $options:"i"}
    if(req.query.brand) query.brand = {$in: req.query.brand.split("+")}
    if(req.query.category) query.category = {$in: req.query.category.split("+")}
    if(req.query.id) query._id = { $in:  req.query.id.split("+").map(i=>new mongoose.Types.ObjectId(i)) }
    if(req.query.sort) sort = setSortParam(req)

    const data = await Supplement.aggregate([
        {
            $facet:{
                brand:[
                    {$match: {...query, brand:{$regex:/.*/}}},
                    {$group:{
                        _id: "$brand",
                        count: {$count:{}}
                    }},
                    {$sort:{"_id":1}}
                ],
                category:[
                    {$match: {...query, category:{$regex:/.*/}}},
                    {$group:{
                        _id:"$category",
                        count:{$count:{}}
                    }},
                    {$sort:{"_id":1}}
                ],
                supplements: [
                    {$match: query},
                    {$sort: sort},
                    {$skip: skip},
                    {$limit: limit}
                ],
                total:[
                    {$match: query},
                    {$count:"count"}
                ]
            }
        }
    ]) 

    res.status(200).json({
        status:"success",
        data: data[0].supplements,
        total: data[0].total.length>0 ? data[0].total[0].count : 0,
        stats: {
            brand: data[0].brand,
            category: data[0].category
        }
    })
}))