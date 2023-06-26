const mongoose        = require('mongoose');
const Schema          = mongoose.Schema;
let finalSurveySchema = new Schema({
    finalresult:[{surveyquestionId:{type: Schema.Types.ObjectId,ref:'surveyQuestion'} , title:String , answer:Number }],
    user_id : {type: Schema.Types.ObjectId, ref: 'User'},
    surveyCat_id : {type: Schema.Types.ObjectId, ref: 'surveyCategory'},
    status : {type: String, enum: ['active', 'deleted'],default:'active'},
}, {collection: 'finalSurvey', timestamps: true});
module.exports = mongoose.model('finalSurvey', finalSurveySchema);
