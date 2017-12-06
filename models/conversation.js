
const mongoose = require('mongoose'),  
      Schema = mongoose.Schema;

// Schema defines how chat messages will be stored in MongoDB
const ConversationSchema = new Schema({  
  participants: [{ 
  	type: Schema.Types.ObjectId,
  	ref: 'User'}
      // .populate([{ path: 'User', select: 'email FirstName LastName' }
      // ])
  ]
});

module.exports = mongoose.model('Conversation', ConversationSchema);