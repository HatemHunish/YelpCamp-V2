if(process.env.NODE_ENV!=="production"){
    require('dotenv').config();
}

const express =require('express');
const app=express();
const path = require('path');
const mongoose=require('mongoose');
const methodOverride = require('method-override');
const morgan=require('morgan');
const ejsMate=require('ejs-mate') ;
const AppError=require("./utils/AppError");
const campgroundsRoutes=require('./routes/campgrounds')
const reviewsRoutes=require('./routes/reviews');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require("./models/user")
const userRoutes=require('./routes/users');
const mongoSanitize=require('express-mongo-sanitize')
const  helmet = require('helmet');
const MongoDBStore=require("connect-mongo");
const dbUrl=process.env.DB_URL||'mongodb://localhost:27017/yelp-camp'
const secret=process.env.SECRET||"yellowblueno"
// const scriptSrcUrls = [
    
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://api.mapbox.com/",
//     "https://kit.fontawesome.com/",
//     "https://cdnjs.cloudflare.com/",
//     "https://cdn.jsdelivr.net",
// ];
// const styleSrcUrls = [
//     "https://kit-free.fontawesome.com/",
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.mapbox.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://fonts.googleapis.com/",
//     "https://use.fontawesome.com/",
// ];
// const connectSrcUrls = [
//     "https://api.mapbox.com/",
//     "https://a.tiles.mapbox.com/",
//     "https://b.tiles.mapbox.com/",
//     "https://events.mapbox.com/",
// ];
// const fontSrcUrls = [];
app.use(helmet({contentSecurityPolicy:false}))
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: [],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//             workerSrc: ["'self'", "blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://res.cloudinary.com/dl3bndv4j/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
//                 "https://images.unsplash.com/",
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//         },
//     })
// );

mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
})
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
})
app.engine('ejs',ejsMate)
app.use(morgan('tiny'))
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))
app.use(mongoSanitize({replaceWith:"_"}))
app.use(express.static(path.join(__dirname,'public')))
const store=MongoDBStore.create({
    mongoUrl:dbUrl,
    crypto: {
        secret:secret,
     },
    touchAfter:24*3600
})

store.on('error',function(e){
    console.log("SESSOION STORE ERROR",e)
})
const sessionConfig={
    store:store,
    name:'session',
    secret:secret,
    resave:false,
    // secure:true,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expire:Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
    }
}
app.use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    
    next();
})
app.use('/campgrounds',campgroundsRoutes);
app.use('/campgrounds/:id/reviews',reviewsRoutes)
app.use('/',userRoutes)
app.get('/',(req,res)=>{
    res.render('home')
})

app.all('*',(req,res,next)=>{
    next(new AppError('Page Not Found',404))
 })
app.use((err,req,res,next)=>{
    const {statusCode=500,message="Something Went Wrong"}=err;
    res.status(statusCode).render('error',{err});
    console.log("*****************ERROR******************");
})
const port=process.env.PORT||3000
app.listen(port,()=>{
    console.log(`Serving on port ${port}`);
    
})