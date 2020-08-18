const { canModifyQueue } = require("../util/EvobotUtil");


module.exports = {
  name: "stop",
  description: "音楽をストップ",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    
    if (!queue) return messagereply("> 何も再生してないよ～...").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.songs = [];
    queue.connection.dispatcher.end();
    queue.textChannel.send(`> ${message.author} ⏹ 音楽をストップしました`).catch(console.error);
  }
};
