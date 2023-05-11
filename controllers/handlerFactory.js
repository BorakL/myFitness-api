const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const multer = require('multer');
const sharp = require("sharp");

exports.deleteOne = Model =>
    catchAsync(async (req,res,next)=>{
        const doc = await Model.findByIdAndDelete(req.params.id)
        if(!doc){
            return next(new AppError('No document found with that ID',404))
        }
        res.status(204).json({
            status:'success',
            data:null
        })
    })

exports.updateOne = Model =>
    catchAsync(async (req,res,next)=>{
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if(!doc){
            return next(new AppError('No document found with that ID',404))
        }
        res.status(200).json({
            status:'success',
            doc
        })
    })

exports.createOne = Model =>
    catchAsync(async (req,res,next) => {
        const doc = await Model.create(req.body); 
        res.status(201).json({
            status:'success',
            doc
        })
    })

exports.getOne = (Model,populateOptions) =>
    catchAsync(async (req,res,next)=>{
        let doc;
        const query = Model.findById(req.params.id) 
        //Za virtuelne reference
        if(populateOptions){
            let skip = req.query.skip*1 || 0;
            let limit = req.query.limit*1 || 100; 
            query.populate({...populateOptions, options:{skip, limit} })
        }
        doc = await query;
        if(!doc){
            console.log("no document")
            return next(new AppError('No doc found with that ID',404))
        }
        res.status(200).json({
            status:'success',
            doc
        })
    })

exports.getAll = (Model) => 
    catchAsync(async (req,res,next)=>{    
        
        //Za reviewe 
        const filter = {};
        if(req.params.workoutId){
            filter.workout = req.params.workoutId
        }
        if(req.params.trainingPlanId){
            filter.trainingPlan = req.params.trainingPlanId
        }
        if(req.params.supplementId){
            filter.supplement = req.params.supplementId
        }

        const docs = await Model.find(filter);
        res.status(200).json({
            status:'success',
            result: docs.length,
            docs
        }) 
    }) 


const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);




exports.resizeImages = ({path,extension,quality})=>catchAsync(async (req, res, next) => {
    if (!req.files.imageCover) return next(); 
    //image
    req.body.imageCover = `${req.params.id}-${Date.now()}-cover.${extension}`;
    
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: quality })
      .toFile(`${path}/${req.body.imageCover}`);
  
    next();
  });