const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Workout = require('../../models/workoutModel');
const Review = require('../../models/reviewModel')
const TrainingPlan = require('../../models/trainingPlan');
 
 
// const Exercise = require('./../../models/exerciseModel');
// const User = require('../../models/userModel');

dotenv.config({ path: './../../config.env' });

const DB = process.env.DATABASE

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

// READ JSON FILE 
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));  
// const exercises = JSON.parse(fs.readFileSync(`${__dirname}/exercises.json`,'utf-8'))
const workouts = JSON.parse(fs.readFileSync(`${__dirname}/workouts.json`, 'utf-8'))
const trainingPlan = JSON.parse(fs.readFileSync(`${__dirname}/trainingPlan.json`, 'utf-8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'))

// IMPORT DATA INTO DB
const importData = async () => {
  try { 
    // await User.create(users, { validateBeforeSave: false }); 
    // await Exercise.create(exercises)
    //await Workout.create(workouts, {validateBeforeSave: false})
    // await TrainingPlan.create(trainingPlan, {validateBeforeSave:false})
    await Review.create(reviews,{validateBeforeSave:false})
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    // await Tour.deleteMany();
    // await User.deleteMany();
    // await Review.deleteMany();
    await Workout.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
