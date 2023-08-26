const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.use(express.static(__dirname+'/public'));

const fs = require("fs");

app.get("/", (req, res) => {
  const path = "public/isPeeking.txt";

  fs.readFile(path, "utf8", function(err, data){
    if(err) {
      res.send("isPeeking.txtの読み込み中にエラーが発生しました。");
      return;
    }
    console.log(data.trim());
    if (data.trim() == "true") {
      res.sendFile(__dirname + '/public/search.html');
    } else {
      res.redirect("https://images.google.co.jp/");
    }
  });
});

app.get("/search", (req, res) => {
  const searchQuery = req.query.q;
  const data = searchQuery + " " + new Date() + "\n";
  // 書き込み
  fs.appendFile("public/queries.txt", data, (err) => {
    if (err) {
      res.send("クエリの記録に失敗しました。");
      return;
    }
  });
  res.redirect("https://www.google.co.jp/search?q=" + searchQuery + "&tbm=isch")
});

app.get("/admin", (req, res) => res.sendFile(__dirname + '/public/admin.html'));
app.get("/admin/peek", (req, res) => res.sendFile(__dirname + '/public/peek-check.html'));
app.get("/admin/peek/able", (req, res) => {
  fs.writeFile("public/isPeeking.txt", "true", () => {});
    res.send("ok");
  });
app.get("/admin/peek/disable", (req, res) => {
  fs.writeFile("public/isPeeking.txt", "false", () => {});
  res.send("/で本物のgoogle画像検索にリダイレクトされます");
});

app.get("/admin/queries", (req, res) => {
  const fs = require("fs");
  fs.readFile("public/queries.txt", "utf8", function(err, data){
    if(err) {
      res.send("queries.txtの読み込み中にエラーが発生しました。");
      return;
    }

    var lines = data.toString().split('\n');

    var resData = "";
    for (var idx = 0; idx < lines.length; idx++) {
      resData += "<p>" + lines[idx] + "</p>";
    }

    res.send(resData);
  });
});

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));
app.use(express.static(__dirname+'/public'));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
