const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

// import { fileURLToPath } from "url";

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
// const configRouter = require('./routes/configRouter')


const userRouter = require('./routes/userRoutes');
const exerciseRouter = require('./routes/exerciseRoutes');
const workoutRouter = require('./routes/workoutRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const trainingPlanRouter = require('./routes/trainingPlanRoutes');
const trainingPlanReviewRouter = require('./routes/trainingPlanReviewRoutes');
const supplementRouter = require('./routes/supplementRoutes');
const orderRouter = require('./routes/orderRoutes');
const reviewSupplementRouter = require('./routes/reviewSupplementRoutes');



const app = express();
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename) 
dotenv.config({ path: `${__dirname}/config.env` });

const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Serving static files 
app.use(express.static(path.join(__dirname, "public")));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES 
app.use('/api/v1/users',userRouter);
app.use('/api/v1/exercises',exerciseRouter)
app.use('/api/v1/workouts',workoutRouter)
app.use('/api/v1/reviews',reviewRouter)
app.use('/api/v1/trainingPlans',trainingPlanRouter);
app.use('/api/v1/trainingPlansReviews',trainingPlanReviewRouter)
app.use('/api/v1/supplements',supplementRouter)
app.use('/api/v1/orders',orderRouter)
app.use('/api/v1/supplementReviews', reviewSupplementRouter)
 

app.get("*", (req,res)=>{
  res.status(200).json({
    message: "Hello World"
  })
})

app.use(globalErrorHandler);

module.exports = app;