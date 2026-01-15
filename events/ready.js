module.exports = (client) => {
  client.once('clientReady', () => {
    console.log(`✅ Bot đã đăng nhập với tên: ${client.user.tag}`);
    client.user.setActivity('Game nối từ | !start', { type: 'PLAYING' });
  });
};

