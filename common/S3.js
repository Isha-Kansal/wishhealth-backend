var AWS = require("aws-sdk");
var fs = require("fs");
const config = require("../config/environment");

module.exports = {
  uploadImage: async function (args) {
    console.log("[-] Trying to upload image...", config.S3Keys.bucket);
    AWS.config.update({
      accessKeyId: config.S3Keys.accessKeyId,
      secretAccessKey: config.S3Keys.secretAccessKey,
    });
    var s3bucket = new AWS.S3({ params: { Bucket: config.S3Keys.bucket } });
    return new Promise(function (resolve, reject) {
      new Promise(function (resolve, reject) {
        fs.readFile(args.image, function (err, file) {
          if (err) {
            return reject(err);
          }
          resolve(file);
        });
      })
        .then(function (data) {
          var fileBuffer = data;
          var params = {
            Key: args.key,
            Body: fileBuffer,
            ContentType: args.imgType,
            ACL: "public-read",
          };

          return new Promise(function (resolve, reject) {
            s3bucket.putObject(params, function (err, imgUrl) {
              if (err) {
                return reject(err);
              } else {
                resolve(imgUrl);
                console.log("imgUrlimgUrl=======>>>>>>>>>", imgUrl);
              }
            });
          });
        })
        .then(function (imgUrl) {
          return resolve(args.image);
        })
        .catch(function (err) {
          console.log("Error in image upload : ", err);
          return reject(err);
        });
    });
  },
};
