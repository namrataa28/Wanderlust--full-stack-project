const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");

main().then(() => {
    console.log("Connected to DB")
}).catch((err) => {
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
}

const initDB = async() => {
    initData.data = initData.data.map((obj) => ({...obj,owner:"66d14e3a315ec690f53364bf"}));
    let data = await listing.insertMany(initData.data);
    console.log("Data was initialized");
}
initDB();