const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: 'AKIAVXR24GDOSOSE75UD ',
    secretAccessKey: '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',
  });

const s3 = new AWS.S3();

module.exports.uploadImages = (files) => {
  const uploadPromises = [];

  files.forEach((file) => {
    const params = {
      Bucket: 'coolnowimage',
      Key: file.originalname,
      Body: file.buffer,
    };

    const uploadPromise = new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          console.error('Error uploading image:', err);
          reject(err);
        } else {
          console.log('Image uploaded successfully. S3 URL:', data.Location);
          resolve(data.Location);
        }
      });
    });

    uploadPromises.push(uploadPromise);
  });

  // Use Promise.all to wait for all uploads to complete
  return Promise.all(uploadPromises);
};
