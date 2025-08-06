// 📁 main.js (or index.js or app.js)
const mongoose = require('mongoose');
const User = require('./models/notes');
const mongoUrl=process.env.MONGO_URL
// ✅ Connect to MongoDB
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Fetch data
const getData = async () => {
  try {
    const users = await User.find().lean(); // fetch all documents
     return users
  } catch (error) {
    console.error('❌ Error fetching users:', error);
  }
};

module.exports =getData