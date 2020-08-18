const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "remove",
  description: "曲をキューから削除します",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("キューが空だよ～...").catch(console.error);
    if (!canModifyQueue(message.member)) return;
    
    if (!args.length) return message.reply(`> こんな感じに送信してください: ${message.client.prefix}remove <Queue Number>`);
    if (isNaN(args[0])) return message.reply(`> こんな感じに送信してください:: ${message.client.prefix}remove <Queue Number>`);

    const song = queue.songs.splice(args[0] - 1, 1);
    queue.textChannel.send(`${message.author} ❌ **${song[0].title}** をキューから削除しました`);
  }
};
