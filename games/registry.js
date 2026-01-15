/**
 * Game Registry - Đăng ký và quản lý tất cả các game
 */

const games = new Map();

// Đăng ký game mới
function registerGame(gameId, gameModule) {
  games.set(gameId, gameModule);
}

// Lấy game theo ID
function getGame(gameId) {
  return games.get(gameId);
}

// Lấy tất cả game đã đăng ký
function getAllGames() {
  return games;
}

// Lấy danh sách game cho menu
function getGameMenuOptions() {
  const options = [];
  games.forEach((game, id) => {
    options.push({
      label: game.name,
      description: game.description,
      value: id,
      emoji: game.emoji,
      disabled: !game.enabled
    });
  });
  return options;
}

// Đăng ký các game
const noiTuGame = require('./noitu');
registerGame('noitu', noiTuGame);

// Thêm game mới ở đây:
// const doanSoGame = require('./doanso');
// registerGame('doanso', doanSoGame);

module.exports = {
  registerGame,
  getGame,
  getAllGames,
  getGameMenuOptions
};
