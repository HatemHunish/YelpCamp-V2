const mongoose=require('mongoose');
const Campground=require('../models/campground');
const cities=require('./cities');
const {places,descriptors}=require('./seedhelper');
const images=[
    {
      url: 'https://res.cloudinary.com/dl3bndv4j/image/upload/v1618264886/YelpCamp/zzthufe2u3ndiq8kc52a.jpg',
      filename: 'YelpCamp/zzthufe2u3ndiq8kc52a'
    },
    {
      url: 'https://res.cloudinary.com/dl3bndv4j/image/upload/v1618264887/YelpCamp/fzq8wtn7gywiqghezzrh.jpg',
      filename: 'YelpCamp/fzq8wtn7gywiqghezzrh'
    },
    {
      url: 'https://res.cloudinary.com/dl3bndv4j/image/upload/v1618264887/YelpCamp/uqhy1wh0z30pbqudvrj5.jpg',
      filename: 'YelpCamp/uqhy1wh0z30pbqudvrj5'
    }
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