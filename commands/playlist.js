const { MessageEmbed } = require("discord.js");
const { play } = require("../include/play");
const { YOUTUBE_API_KEY, MAX_PLAYLIST_SIZE, SOUNDCLOUD_CLIENT_ID } = require("../config.json");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const scdl = require("soundcloud-downloader")

module.exports = {
  name: "playlist",
  cooldown: 3,
  aliases: ["pl"],
  description: "YouTubeのプレイリストを再生",
  async execute(message, args) {
    const { PRUNING } = require("../config.json");
    const { channel } = message.member.voice;

    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message.reply(`> ${message.client.user} と同じチャンネルにいる必要があります`).catch(console.error);

    if (!args.length)
      return message
        .reply(`> こんな感じに送信してください: ${message.client.prefix}playlist <YouTube Playlist URL | Playlist Name>`)
        .catch(console.error);
    if (!channel) return messagereply("> あなたがまずそのボイチャに入らないと私は入りません！").catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.reply("> 私にそのボイチャに接続する権限がありません");
    if (!permissions.has("SPEAK"))
      return message.reply("> 私はこのボイチャで曲を流す権限を持っていません");

    const search = args.join(" ");
    const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
    const url = args[0];
    const urlValid = pattern.test(args[0]);

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };

    let song = null;
    let playlist = null;
    let videos = [];

    if (urlValid) {
      try {
        playlist = await youtube.getPlaylist(url, { part: "snippet" });
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
        return messagereply("> プレイリストが見つかりませんでした :(").catch(console.error);
      }
    } else if (scdl.isValidUrl(args[0])) {
      if (args[0].includes('/sets/')) {
        message.channel.send('⌛ fetching the playlist...')
        playlist = await scdl.getSetInfo(args[0], SOUNDCLOUD_CLIENT_ID)
        videos = playlist.tracks.map(track => ({
          title: track.title,
          url: track.permalink_url,
          duration: track.duration / 1000
        }))
      }
    } else {
      try {
        const results = await youtube.searchPlaylists(search, 1, { part: "snippet" });
        playlist = results[0];
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
        return messagereply("> プレイリストが見つかりませんでした :(").catch(console.error);
      }
    }

    videos.forEach((video) => {
      song = {
        title: video.title,
        url: video.url,
        duration: video.durationSeconds
      };

      if (serverQueue) {
        serverQueue.songs.push(song);
        if (!PRUNING)
          message.channel
            .send(`> ${message.author}　✅ **${song.title}** を再生キューに追加しました`)
            .catch(console.error);
      } else {
        queueConstruct.songs.push(song);
      }
    });

    let playlistEmbed = new MessageEmbed()
      .setTitle(`${playlist.title}`)
      .setURL(playlist.url)
      .setColor("#F8AA2A")
      .setTimestamp();

    if (!PRUNING) {
      playlistEmbed.setDescription(queueConstruct.songs.map((song, index) => `${index + 1}. ${song.title}`));
      if (playlistEmbed.description.length >= 2048)
        playlistEmbed.description =
          playlistEmbed.description.substr(0, 2007) + "\n > プレイリストの動画の数が多すぎます！";
    }

    message.channel.send(`> ${message.author} プレイリストの再生を開始します`, playlistEmbed);

    if (!serverQueue) message.client.queue.set(message.guild.id, queueConstruct);

    if (!serverQueue) {
      try {
        queueConstruct.connection = await channel.join();
        await queueConstruct.connection.voice.setSelfDeaf(true);
        play(queueConstruct.songs[0], message);
      } catch (error) {
        console.error(error);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send(`> チャンネルに入れませんでした: ${error}`).catch(console.error);
      }
    }
  }
};
