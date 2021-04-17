const mongoose=require('mongoose');
const Campground=require('../models/campground');
const cities=require('./cities');
const {places,descriptors}=require('./seedhelper');
const images=[
   {
     
      url: 'https://res.cloudinary.com/dl3bndv4j/image/upload/v1618617674/YelpCamp/lfwxdrsu0ijxjihht8bk.jpg',
      filename: 'YelpCamp/lfwxdrsu0ijxjihht8bk'},
   {
     
      url: 'https://res.cloudinary.com/dl3bndv4j/image/upload/v1618555423/YelpCamp/qy9jl5ia8vsmbxmrpinj.png',
      filename: 'YelpCamp/qy9jl5ia8vsmbxmrpinj'}
  ]
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
})
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
})
const sample=array=>array[Math.floor(Math.random()*array.length)];
const seedDB=async()=>{
await Campground.deleteMany({});
for(let i=0;i<200;i++){
    const random1000=Math.floor(Math.random()*1000);
    const price=Math.floor(Math.random()*20)+10
    const camp=new Campground({
        author:'6070b3f0fbf3fe6490a1d6fe',
        location:`${cities[random1000].city},${cities[random1000].state}`,
        title:`${sample(descriptors)} ${sample(places)}`,
        geometry: { coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude
         ], type: 'Point' },
        images:images,
        description:"Vero elitr est sanctus est ipsum ut aliquyam. Diam ipsum justo ut aliquyam et sit rebum diam, accusam lorem eirmod.",
        price:price
    })
    await camp.save();
}

}

seedDB().then(()=>{
    mongoose.connection.close()
})