const { canModifyQueue } = require("../util/EvobotUtil");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "pause",
  description: "現在再生中の曲を一時停止",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return messagereply("> 何も再生してないよ～...").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      return queue.textChannel.send(`> ${message.author} ⏸ 曲を一時停止しました/n > ${song.title} `).catch(console.error);
    }
  }
};
