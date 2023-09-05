

// const AWS = require('aws-sdk');
// module.exports.uploadImage = (files) => {
//     return new Promise(async (resolve, reject) => {
// const s3 = new AWS.S3({
//   accessKeyId: 'AKIAVXR24GDOSOSE75UD',
//   secretAccessKey: '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',
//   region: 'us-east-1', 
// });
// const bucketName = 'coolnowimage';
//   const { image, video } = files;

//   // Upload image to S3
//   const imageParams = {
//     Bucket: bucketName,
//     Key: 'images/' + image[0].originalname, 
//     Body: image[0].buffer,
//     ContentType: image[0].mimetype,
//   };
// s3.upload(imageParams, (err, data) => {
//     if (err) {
//     reject(err); 
//     return false
//     }else{
//     resolve(data.Location);
//     }
    
//    const videoParams = {
//       Bucket: bucketName,
//       Key: 'videos/' + video[0].originalname, 
//       Body: video[0].buffer,
//       ContentType: video[0].mimetype,
//     };

//     s3.upload(videoParams, (err, data) => {
//       if (err) {
//         reject(err); 
//         console.error('Video upload failed:', err);
//         return false
//       }
//       resolve(data.Location);
//       return data.Location

    
//     });
//   });
//     })

// };


const AWS = require('aws-sdk');
const util = require('util');

module.exports.uploadImageAndVideo = (files) => {
  return new Promise(async (resolve, reject) => {
    const s3 = new AWS.S3({
      accessKeyId: 'AKIAVXR24GDOSOSE75UD',  
  secretAccessKey: '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',
      region: 'us-east-1',
    });
    const bucketName = 'coolnowimage';
    const { image, video } = files;

    const uploadImagePromisified = util.promisify(s3.upload.bind(s3));
    const uploadVideoPromisified = util.promisify(s3.upload.bind(s3));

    try {
      const uploadData = {}; // Initialize an empty object to store upload results

      // Upload image to S3 if it exists
      if (image) {
        const imageParams = {
          Bucket: bucketName,
          Key: 'images/' + image[0].originalname,
          Body: image[0].buffer,
          ContentType: image[0].mimetype,
        };
        const imageUploadData = await uploadImagePromisified(imageParams);
        console.log('Image uploaded successfully:', imageUploadData.Location);
        uploadData.image = imageUploadData.Location;
      }

      // Upload video to S3 if it exists
      if (video) {
        const videoParams = {
          Bucket: bucketName,
          Key: 'videos/' + video[0].originalname,
          Body: video[0].buffer,
          ContentType: video[0].mimetype,
        };
        const videoUploadData = await uploadVideoPromisified(videoParams);
        console.log('Video uploaded successfully:', videoUploadData.Location);
        uploadData.video = videoUploadData.Location;
      }

      resolve(uploadData);
    } catch (err) {
      console.error('Upload failed:', err);
      reject(err);
    }
  });
};
