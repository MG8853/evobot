const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "skip",
  aliases: ["s"],
  description: "音楽をスキップ",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return messagereply("> スキップできません！").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.playing = true;
    queue.connection.dispatcher.end();
    queue.textChannel.send(`> ${message.author} ⏭ 音楽をスキップしました`).catch(console.error);
  }
};
