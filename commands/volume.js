const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "volume",
  aliases: ["v"],
  description: "音量を設定",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return messagereply("> 何も再生してないよ～...").catch(console.error);
    if (!canModifyQueue(message.member))
      return message.reply("> あなたがまずそのボイチャに入らないと私は入りません！").catch(console.error);

    if (!args[0]) return message.reply(`> 🔊 現在のボリューム: **${queue.volume}%**`).catch(console.error);
    if (isNaN(args[0])) return messagereply("> 英数字を使ってボリュームを設定してください").catch(console.error);
    if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
      return messagereply("> 0 - 100 までの英数字で設定できます").catch(console.error);

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    return queue.textChannel.send(`> ボリュームを設定しました: **${args[0]}%**`).catch(console.error);
  }
};
