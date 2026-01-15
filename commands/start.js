const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config/config');
const { getGameMenuOptions, getGame } = require('../games/registry');

// Tạo embed menu game
function createGameMenuEmbed() {
  return new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle('🎮 MENU GAME')
    .setDescription('Chọn game bạn muốn chơi!')
    .addFields(
      {
        name: '🔗 Nối Từ',
        value: 'Nối từ theo âm tiết cuối\nVí dụ: `con cá` → `cá kho` → `kho hàng`',
        inline: true
      },
      {
        name: '🔜 Sắp ra mắt',
        value: 'Đoán số, Đuổi hình bắt chữ...',
        inline: true
      }
    )
    .setFooter({ text: 'Chọn game từ menu bên dưới' })
    .setTimestamp();
}

async function execute(message, activeGames, waitingGames) {
  const gameId = message.channel.id;

  if (activeGames.has(gameId) || waitingGames.has(gameId)) {
    const errorEmbed = new EmbedBuilder()
      .setColor(0xED4245)
      .setDescription('⚠️ Đã có game đang chạy hoặc đang chờ người chơi trong channel này!');
    return message.reply({ embeds: [errorEmbed] });
  }

  // Lấy options từ registry
  const gameOptions = getGameMenuOptions();

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('select_game')
    .setPlaceholder('🎮 Chọn game...')
    .addOptions(gameOptions.length > 0 ? gameOptions : [
      {
        label: 'Nối Từ',
        description: 'Nối từ theo âm tiết cuối',
        value: 'noitu',
        emoji: '🔗'
      }
    ]);

  const row = new ActionRowBuilder().addComponents(selectMenu);
  const menuEmbed = createGameMenuEmbed();

  await message.reply({
    embeds: [menuEmbed],
    components: [row]
  });
}

module.exports = {
  name: 'start',
  aliases: ['game', 'play'],
  execute
};
