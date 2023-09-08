
// const AWS = require('aws-sdk');
// AWS.config.update({
//   accessKeyId: 'AKIAVXR24GDOSOSE75UD ',
//   secretAccessKey: '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',
// });

// const s3 = new AWS.S3();
// module.exports.uploadImage = (files) => {
//   const file = files;
//   const params = {
//     Bucket: 'coolnowimage',
//     Key: file.originalname,
//     Body: file.buffer,
//   };
// s3.upload(params, (err, data) => {
//     if (err) {
//       return false
//     }
//     console.log("image upload",data);
//     return true
//   });
// }

const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: 'AKIAVXR24GDOSOSE75UD ',
  secretAccessKey: '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',
});

const s3 = new AWS.S3();

module.exports.uploadImage = (files) => {
  return new Promise((resolve, reject) => {
    const file = files;
    const params = {
      Bucket: 'coolnowimage',
      Key: file.originalname,
      Body: file.buffer,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading image:', err);
        reject(err); 
        return false
      } else {
        console.log('Image uploaded successfully. S3 URL:', data.Location);
        resolve(data.Location);
        return data.Location 
      }
    });
  });
};
