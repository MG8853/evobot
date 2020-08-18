const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "loop",
  aliases: ['l'],
  description: "ループ再生の切り替え",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return messagereply("> 何も再生してないよ～...").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    // toggle from false to true and reverse
    queue.loop = !queue.loop;
    return queue.textChannel
      .send(`> ループを ${queue.loop ? "**on**" : "**off**"} に設定しました`)
      .catch(console.error);
  }
};
