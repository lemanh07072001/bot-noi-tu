async function execute(message, activeGames, waitingGames) {
  const gameId = message.channel.id;
  
  if (!activeGames.has(gameId) && !waitingGames.has(gameId)) {
    return message.reply('⚠️ Không có game nào đang chạy!');
  }

  if (activeGames.has(gameId)) {
    const game = activeGames.get(gameId);
    if (game.creatorId !== message.author.id) {
      return message.reply('⚠️ Chỉ người tạo game mới có thể kết thúc!');
    }
    if (game.timer) clearTimeout(game.timer);
    activeGames.delete(gameId);
  }
  
  if (waitingGames.has(gameId)) {
    const waitingGame = waitingGames.get(gameId);
    if (waitingGame.creatorId !== message.author.id) {
      return message.reply('⚠️ Chỉ người tạo game mới có thể kết thúc!');
    }
    if (waitingGame.startTimer) clearTimeout(waitingGame.startTimer);
    waitingGames.delete(gameId);
  }

  message.reply('✅ Game đã kết thúc!');
}

module.exports = {
  name: 'stop',
  aliases: ['ketthuc'],
  execute
};

