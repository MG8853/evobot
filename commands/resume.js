const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "resume",
  aliases: ["r"],
  description: "現在再生中の曲を再開",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return messagereply("> 何も再生してないよ～...").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      return queue.textChannel.send(`> ${message.author} ▶ 曲の再生を再開しました`).catch(console.error);
    }

    return messagereply("> まだ一時停止されてないよ～...").catch(console.error);
  }
};
