const mongoose = require('mongoose');

function connectDatabase(mongoUri) {
  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('✅ Đã kết nối MongoDB');
  }).catch(err => {
    console.error('❌ Lỗi kết nối MongoDB:', err);
  });
}

module.exports = { connectDatabase };

