const Workout = require("../models/workoutModel");
const catchAsync = require("../utils/catchAsync");
const setSortParam = require("../utils/setSortParam");
const { deleteOne, createOne, updateOne, getAll, getOne } = require("./handlerFactory");
 
exports.setAuthorId = (req,res,next)=>{
    if(!req.body.authorId) req.body.author = req.user.id
    next();
}

exports.deleteWorkout = deleteOne(Workout);
exports.createWorkout = createOne(Workout);
exports.updateWorkout = updateOne(Workout);
exports.getWorkout = getOne(Workout,{path:'reviews'}); 
 
exports.getAllWorkout = catchAsync(async (req,res,next)=>{ 
    let query = {};
    let sort = {"_id":-1}; 
    let skip = req.query.skip*1 || 0;
    let limit = req.query.limit*1 || 12;

    if(req.query.level) query.level = {$in: req.query.level.split("+")};
    if(req.query.category) query.category = {$in: req.query.category.split("+")};
    if(req.query.sort) sort = setSortParam(req) 
    if(req.query.name) { query.muscleGroups = {$regex: req.query.name.trim(), $options:"i"}
} 
    const data = await Workout.aggregate([ 

        // {
        //     $unwind: "$exercises"
        // },
        // {
        //     $lookup: {
        //         from: "exercises",  
        //         localField: "exercises.exercise",
        //         foreignField: "_id",
        //         as: "exercises.exercise"
        //     }
        // }, 
        // {
        //     $unwind: "$exercises.exercise"
        // },
        //   {
        //     $addFields: {
        //         "data.exercise": "$exercises"
        //     }
        // }, 
        // {
        //     $group: {
        //         _id:"$_id",
        //         exercises: {$push: "$exercises"},
        //         category: {$first:"$category"},
        //         difficulty: {$first:"$difficulty"},
        //         description: {$first:"$description"},
        //         ratingsAverage: {$first:"$ratingsAverage"},
        //         ratingsQuantity: {$first:"$ratingsQuantity"}
        //     }
        // }, 
        {
            $facet:{
                level:[
                    {$match: {...query, level:{$regex:/.*/} }},
                    {$group: {
                        _id: "$level",
                        count: {$count:{}}
                    }},
                    {$sort:{"_id":1}}
                ],
                category:[
                    {$match: {...query, category:{$regex:/.*/} }},
                    {$group: {
                        _id: "$category",
                        count: {$count:{}}
                    }},
                    {$sort:{"_id":1}}
                ],
                workouts:[
                    {$match:query},
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
        data: data[0].workouts,
        total: data[0].total[0].count,
        stats: {
            level: data[0].level,
            category: data[0].category
        }
    })
})


exports.getTopWorkout = (catchAsync(async(req,res,next)=>{
    const workouts = await Workout.aggregate([
        {
            $facet:{
                mostPopular:[
                    {$match:{}},
                    {$sort: {"ratingsAverage":-1}},
                    {$limit: 6}
                ],
                mostCommented:[
                    {$sort: {"ratingsQuantity":-1}},
                    {$limit:6}
                ],
                newest:[
                    {$sort:{"createdAt":-1}},
                    {$limit:6}
                ]
            }
        }
    ])
    res.status(200).json({
        status:"success",
        data: {
            mostPopular: workouts[0].mostPopular,
            mostCommented: workouts[0].mostCommented,
            newest: workouts[0].newest
        }
    })
}))