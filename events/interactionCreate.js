const { Events, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const config = require('../config/config');
const { getGame } = require('../games/registry');
const { createWaitingEmbed } = require('../commands/start');

module.exports = (client, activeGames, waitingGames) => {
  client.on(Events.InteractionCreate, async interaction => {
    // Chỉ xử lý button
    if (!interaction.isButton()) return;

    // Kiểm tra server/channel
    if (config.serverId && interaction.guild.id !== config.serverId) {
      return interaction.reply({
        embeds: [new EmbedBuilder().setColor(0xED4245).setDescription('⚠️ Bot chỉ hoạt động trong server được chỉ định!')],
        ephemeral: true
      });
    }

    if (config.channelId && interaction.channel.id !== config.channelId) {
      return interaction.reply({
        embeds: [new EmbedBuilder().setColor(0xED4245).setDescription('⚠️ Bot chỉ hoạt động trong channel được chỉ định!')],
        ephemeral: true
      });
    }

    const gameId = interaction.channel.id;
    const waitingGame = waitingGames.get(gameId);

    if (!waitingGame && ['join_game', 'leave_game', 'force_start'].includes(interaction.customId)) {
      return interaction.reply({
        embeds: [new EmbedBuilder().setColor(0xED4245).setDescription('⚠️ Không có game nào đang chờ!')],
        ephemeral: true
      });
    }

    const gameType = waitingGame?.gameType || 'noitu';
    const gameModule = getGame(gameType);

    // Xử lý nút tham gia
    if (interaction.customId === 'join_game') {
      if (waitingGame.players.some(p => p.userId === interaction.user.id)) {
        return interaction.reply({
          embeds: [new EmbedBuilder().setColor(0xFEE75C).setDescription('⚠️ Bạn đã tham gia game rồi!')],
          ephemeral: true
        });
      }

      waitingGame.players.push({
        userId: interaction.user.id,
        id: interaction.user.id,
        username: interaction.user.username,
        isActive: true
      });

      const updatedEmbed = createWaitingEmbed(waitingGame.players, waitingGame.minPlayers);
      await interaction.update({ embeds: [updatedEmbed] });

      if (waitingGame.players.length >= waitingGame.minPlayers) {
        if (waitingGame.startTimer) clearTimeout(waitingGame.startTimer);

        waitingGame.startTimer = setTimeout(async () => {
          if (waitingGames.has(gameId)) {
            await startGameAndCleanup(waitingGame, interaction, activeGames, waitingGames, gameId, gameModule);
          }
        }, config.game.startDelay);
      }
    }

    // Xử lý nút rời phòng
    if (interaction.customId === 'leave_game') {
      const playerIndex = waitingGame.players.findIndex(p => p.userId === interaction.user.id);

      if (playerIndex === -1) {
        return interaction.reply({
          embeds: [new EmbedBuilder().setColor(0xFEE75C).setDescription('⚠️ Bạn chưa tham gia game!')],
          ephemeral: true
        });
      }

      waitingGame.players.splice(playerIndex, 1);

      if (waitingGame.players.length < waitingGame.minPlayers && waitingGame.startTimer) {
        clearTimeout(waitingGame.startTimer);
        waitingGame.startTimer = null;
      }

      const updatedEmbed = createWaitingEmbed(waitingGame.players, waitingGame.minPlayers);
      await interaction.update({ embeds: [updatedEmbed] });
    }

    // Xử lý nút bắt đầu ngay
    if (interaction.customId === 'force_start') {
      const isCreator = waitingGame.creatorId === interaction.user.id;
      const isAdmin = interaction.member.permissions.has('Administrator');

      if (!isCreator && !isAdmin) {
        return interaction.reply({
          embeds: [new EmbedBuilder().setColor(0xED4245).setDescription('⚠️ Chỉ chủ phòng hoặc admin mới có thể bắt đầu game!')],
          ephemeral: true
        });
      }

      if (waitingGame.players.length < waitingGame.minPlayers) {
        return interaction.reply({
          embeds: [new EmbedBuilder().setColor(0xFEE75C).setDescription(`⚠️ Cần tối thiểu **${waitingGame.minPlayers}** người chơi!`)],
          ephemeral: true
        });
      }

      if (waitingGame.startTimer) clearTimeout(waitingGame.startTimer);

      await interaction.deferUpdate();
      await startGameAndCleanup(waitingGame, interaction, activeGames, waitingGames, gameId, gameModule);
    }
  });
};

// Helper function
async function startGameAndCleanup(waitingGame, interaction, activeGames, waitingGames, gameId, gameModule) {
  try {
    const channel = interaction.channel;
    const message = await channel.messages.fetch(waitingGame.messageId);

    const disabledRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder().setCustomId('join_game').setLabel('Game đã bắt đầu').setStyle(ButtonStyle.Secondary).setDisabled(true),
        new ButtonBuilder().setCustomId('leave_game').setLabel('Rời phòng').setStyle(ButtonStyle.Secondary).setDisabled(true),
        new ButtonBuilder().setCustomId('force_start').setLabel('Đã bắt đầu').setStyle(ButtonStyle.Secondary).setDisabled(true)
      );

    const startingEmbed = new EmbedBuilder()
      .setColor(0x57F287)
      .setTitle(`🎮 ${gameModule.name.toUpperCase()}`)
      .setDescription('✅ **Game đang bắt đầu...**')
      .setTimestamp();

    await message.edit({ embeds: [startingEmbed], components: [disabledRow] });
  } catch (err) {
    console.error('Lỗi khi disable button:', err);
  }

  await gameModule.startGame(waitingGame, interaction.channel, activeGames);
  waitingGames.delete(gameId);
}
