
const Campground=require('../models/campground');

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
    if (!campground) {
        req.flash('error', 'This campground cannot be found!');
        res.redirect(`/campgrounds`);
    }
    res.render('campgrounds/show', { campground });
}
module.exports.create = async (req, res) => {

    const newCamp = new Campground(req.body.campground)

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
    req.flash('success', 'successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`);
}
module.exports.delete = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted campground');

    res.redirect(`/campgrounds`);

}