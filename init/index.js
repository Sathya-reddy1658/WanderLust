const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../MOD/listing.js");
const Review = require("../MOD/reviews.js");
const MONGO_URL = 'mongodb://127.0.0.1:27017/AIR_BNB';

async function MAIN() {
    await mongoose.connect(MONGO_URL);
}
MAIN().then(() => { console.log("conneted to DB"); }).catch((err) => { console.log(err) });

 const initDB = async ()=>{
    await Review.deleteMany({});
    await Listing.deleteMany({});
     await   Listing.insertMany(initData.data);
     console.log("data was saved succesfully ");
 }
 initDB();