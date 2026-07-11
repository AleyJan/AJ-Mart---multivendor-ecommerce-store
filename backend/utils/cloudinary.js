const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadBuffer = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (err, result) => {
        if (err) return reject(err);
        resolve({ public_id: result.public_id, url: result.secure_url });
      }
    );
    stream.end(buffer);
  });

const destroy = (publicId) => cloudinary.uploader.destroy(publicId);

module.exports = { cloudinary, uploadBuffer, destroy };
