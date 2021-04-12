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
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
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
app.use(express.static(path.join(__dirname,'public')))
const sessionConfig={
    secret:'thishouldbebetter',
    resave:false,
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

app.listen(3000,()=>{
    console.log('Serving on port 3000');
    
})