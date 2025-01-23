const cloudinary = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    cloud_key : process.env.CLOUD_API_KEY,
    cloud_secret: process.env.CLOUD_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'Wanderlust_DEV',
      allowedFormats: ["jpg","png","jpeg"], // supports promises as well
    //   public_id: (req, file) => 'computed-filename-using-request',
    },
  });

  module.exports = {
    cloudinary,storage
  }