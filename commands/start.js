const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, UserSelectMenuBuilder } = require('discord.js');
const config = require('../config/config');
const { getGame } = require('../games/registry');

// Tạo embed phòng chờ
function createWaitingEmbed(players, minPlayers) {
  const playerList = players.length > 0
    ? players.map((p, i) => `\`${i + 1}.\` ${p.username}`).join('\n')
    : '_Chưa có ai tham gia_';

  const timeoutSeconds = config.game.turnTimeout / 1000;

  return new EmbedBuilder()
    .setColor(0x9B59B6)
    .setTitle('🔗 GAME NỐI TỪ - PHÒNG CHỜ')
    .addFields(
      {
        name: `👥 Người chơi (${players.length}/${minPlayers}+)`,
        value: playerList,
        inline: true
      },
      {
        name: '📋 Thông tin',
        value: [
          `⏱️ Thời gian: **${timeoutSeconds}s**/lượt`,
          `👤 Tối thiểu: **${minPlayers}** người`,
          `🏆 Điểm theo thứ hạng`
        ].join('\n'),
        inline: true
      }
    )
    .setDescription('Nhấn **🎮 Tham gia** để vào game!')
    .setFooter({
      text: players.length >= minPlayers
        ? '✅ Đủ người! Game sẽ bắt đầu trong 5 giây...'
        : `⏳ Đang chờ thêm ${minPlayers - players.length} người...`
    })
    .setTimestamp();
}

// Tạo buttons và menu
function createComponents() {
  const joinButton = new ButtonBuilder()
    .setCustomId('join_game')
    .setLabel('Tham gia')
    .setStyle(ButtonStyle.Success)
    .setEmoji('🎮');

  const leaveButton = new ButtonBuilder()
    .setCustomId('leave_game')
    .setLabel('Rời phòng')
    .setStyle(ButtonStyle.Danger)
    .setEmoji('🚪');

  const startButton = new ButtonBuilder()
    .setCustomId('force_start')
    .setLabel('Bắt đầu ngay')
    .setStyle(ButtonStyle.Primary)
    .setEmoji('▶️');

  const inviteMenu = new UserSelectMenuBuilder()
    .setCustomId('invite_players')
    .setPlaceholder('📨 Mời người chơi...')
    .setMinValues(1)
    .setMaxValues(10);

  const buttonRow = new ActionRowBuilder().addComponents(joinButton, leaveButton, startButton);
  const inviteRow = new ActionRowBuilder().addComponents(inviteMenu);

  return [buttonRow, inviteRow];
}

async function execute(message, activeGames, waitingGames) {
  const gameId = message.channel.id;

  if (activeGames.has(gameId) || waitingGames.has(gameId)) {
    const errorEmbed = new EmbedBuilder()
      .setColor(0xED4245)
      .setDescription('⚠️ Đã có game đang chạy hoặc đang chờ người chơi trong channel này!');
    return message.reply({ embeds: [errorEmbed] });
  }

  // Tạo phòng chờ
  const waitingGame = {
    channelId: message.channel.id,
    gameType: 'noitu',
    players: [],
    minPlayers: config.game.minPlayers,
    messageId: null,
    creatorId: message.author.id
  };

  waitingGames.set(gameId, waitingGame);

  const waitingEmbed = createWaitingEmbed(waitingGame.players, waitingGame.minPlayers);
  const components = createComponents();

  const reply = await message.reply({
    embeds: [waitingEmbed],
    components: components
  });

  waitingGame.messageId = reply.id;
}

module.exports = {
  name: 'start',
  aliases: ['noitu', 'game', 'play'],
  execute,
  createWaitingEmbed,
  createComponents
};
