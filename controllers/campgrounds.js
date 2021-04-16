
const Campground=require('../models/campground');
const {cloudinary}=require("../cloudinary")
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding({accessToken:mapBoxToken});
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}
module.exports.renderNewForm=async(req,res)=>{

    res.render('campgrounds/new');
}
module.exports.showCampground = async (req, res) => {

    const campground = await Campground.findById(req.params.id).
        populate({
            path: 'reviews',
            populate: { path: 'author' }
        }).populate('author');
        console.log(campground)
    if (!campground) {
        req.flash('error', 'This campground cannot be found!');
        res.redirect(`/campgrounds`);
    }
    res.render('campgrounds/show', { campground });
}
module.exports.create = async (req, res,next) => {
   const geoData=await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send();
  
    const newCamp = new Campground(req.body.campground);
    newCamp.geometry=geoData.body.features[0].geometry;
    newCamp.images=req.files.map(f=>({url:f.path,filename:f.filename}));
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success', 'successfully made a campground');

    res.redirect(`/campgrounds/${newCamp._id}`);

}

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'This campground cannot be found!');
        res.redirect(`/campgrounds`);
    }
    res.render('campgrounds/edit', { campground });
}
module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs=req.files.map(f=>({url:f.path,filename:f.filename}));
    console.log(req.body)
    campground.images.push(...imgs)
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            cloudinary.uploader.destroy(filename)
        }
       await campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    console.log(campground)
    }
    
    await  campground.save();
    req.flash('success', 'successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`);
}
module.exports.delete = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted campground');

    res.redirect(`/campgrounds`);

}