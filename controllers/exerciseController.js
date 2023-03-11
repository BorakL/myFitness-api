const Exercise = require("../models/exerciseModel");
const catchAsync = require("../utils/catchAsync");
const setSortParam = require("../utils/setSortParam");
const { createOne, deleteOne, updateOne, getOne, getAll } = require("./handlerFactory");
var fs = require('fs');


exports.deleteExercise = deleteOne(Exercise);
exports.createExercise = createOne(Exercise);
exports.updateExercise = updateOne(Exercise);
exports.getExercise = getOne(Exercise);
 

exports.getAllExercises = (catchAsync (async(req,res,next) => {
    
    let query = {};
    let sort = {"name":1}; 
    let limit = req.query.limit*1 || 24;
    let skip = req.query.skip*1 || 0;
 

    if(req.query.name) query.name = {$regex: req.query.name.trim(), $options:"i"}
    if(req.query.target_muscle) query.target_muscle = {$in: req.query.target_muscle.split("+")}
    if(req.query.equipment) query.equipment = {$in: req.query.equipment.split("+")}
    if(req.query.sort) sort = setSortParam(req)
    
    const data = await Exercise.aggregate([ 
        {
            $facet:{
                target_muscle:[
                    {$match:{"equipment":query.equipment || {$regex:/.*/}}}, 
                    {$group:
                        {
                            _id: "$target_muscle", 
                            count: {$count:{}}
                        }                
                    },
                    {$sort:{"_id":1}} 
                ],
                equipment:[
                    {$match:{"target_muscle":query.target_muscle || {$regex:/.*/}}},
                    {$group:{
                        _id:"$equipment",
                        count: {$count:{}},
                    }},
                    {$sort:{"_id":1}} 
                ],
                exercises:[
                    {$match: query},
                    {$sort:sort},
                    {$skip:skip},
                    {$limit:limit}
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
        data: data[0].exercises,
        total: data[0].total[0].count,
        stats: {
            target_muscle: data[0].target_muscle,
            equipment: data[0].equipment
        }
    })
}))
