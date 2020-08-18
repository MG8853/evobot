const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "skipto",
  aliases: ["st"],
  description: "スキップする曲の数を指定",
  execute(message, args) {
    if (!args.length)
      return message
        .reply(`こんな感じに送信してください: ${message.client.prefix}${module.exports.name} <Queue Number>`)
        .catch(console.error);

    if (isNaN(args[0]))
      return message
        .reply(`こんな感じに送信してください: ${message.client.prefix}${module.exports.name} <Queue Number>`)
        .catch(console.error);

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("> キューが空だよ～...").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (args[0] > queue.songs.length)
      return message.reply(`> ${queue.songs.length} 個までキューに追加できます`).catch(console.error);

    queue.playing = true;
    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }
    queue.connection.dispatcher.end();
    queue.textChannel.send(`> ${message.author} ⏭ ${args[0] - 1} 個スキップしました`).catch(console.error);
  }
};
