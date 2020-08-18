const { MessageEmbed } = require("discord.js");
const { YOUTUBE_API_KEY } = require("../config.json");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);

module.exports = {
  name: "search",
  description: "再生したい曲を検索",
  async execute(message, args) {
    if (!args.length)
      return message.reply(`こんな感じに送信してください: ${message.client.prefix}${module.exports.name} <Video Name>`).catch(console.error);
    if (message.channel.activeCollector)
      return messagereply("> 現在実行中です");
    if (!message.member.voice.channel)
      return message.reply("> あなたがまずそのボイチャに入らないと私は入りません！").catch(console.error);

    const search = args.join(" ");

    let resultsEmbed = new MessageEmbed()
      .setTitle(`**曲の番号を返信してください**`)
      .setDescription(`検索結果: ${search}`)
      .setColor("#F8AA2A");

    try {
      const results = await youtube.searchVideos(search, 10);
      results.map((video, index) => resultsEmbed.addField(video.shortURL, `${index + 1}. ${video.title}`));

      var resultsMessage = await message.channel.send(resultsEmbed);

      function filter(msg) {
        const pattern = /(^[1-9][0-9]{0,1}$)/g;
        return pattern.test(msg.content) && parseInt(msg.content.match(pattern)[0]) <= 10;
      }

      message.channel.activeCollector = true;
      const response = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] });
      const choice = resultsEmbed.fields[parseInt(response.first()) - 1].name;

      message.channel.activeCollector = false;
      message.client.commands.get("play").execute(message, [choice]);
      resultsMessage.delete().catch(console.error);
    } catch (error) {
      console.error(error);
      message.channel.activeCollector = false;
    }
  }
};
