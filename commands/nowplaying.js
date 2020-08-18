const createBar = require("string-progressbar");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "np",
  description: "現在再生中の曲の詳細を表示",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return messagereply("> 何も再生してないよ～...").catch(console.error);
    const song = queue.songs[0];
    const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
    const left = song.duration - seek;

    let nowPlaying = new MessageEmbed()
      .setTitle("再生中の曲...")
      .setDescription(`${song.title}\n${song.url}`)
      .setColor("#F8AA2A")
      .setAuthor("EvoBot")
      .addField("\u200b", new Date(seek * 1000).toISOString().substr(11, 8) + "[" + createBar((song.duration == 0 ? seek : song.duration), seek, 20)[0] + "]" + (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)), false)
      .setTimestamp();

    if (song.duration > 0) nowPlaying.setFooter("Time Remaining: " + new Date(left * 1000).toISOString().substr(11, 8));

    return message.channel.send(nowPlaying);
  }
};
