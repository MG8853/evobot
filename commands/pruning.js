const fs = require("fs");
const config = require("../config.json");

module.exports = {
  name: "pruning",
  description: "ボットのプランニングメッセージを切り替え",
  execute(message) {
    config.PRUNING = !config.PRUNING;

    fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => {
      if (err) {
        console.log(err);
        return message.channel.send("> ファイルへの書き込み中にエラーが発生しました").catch(console.error);
      }

      return message.channel
        .send(`> プランニングメッセージを ${config.PRUNING ? "**enabled**" : "**disabled**"} にしました`)
        .catch(console.error);
    });
  }
};
