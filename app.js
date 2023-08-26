const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.use(express.static(__dirname+'/public'));

app.get("/", (req, res) => res.sendFile(__dirname + '/public/search.html'));
app.get("/search", (req, res) => {
  const fs = require("fs");
  const searchQuery = req.query.q;
  const data = searchQuery + " " + new Date() + "\n";
  // 書き込み
  fs.appendFile("public/queries.txt", data, (err) => {
    if (err) throw err;
    // console.log('正常に書き込みが完了しました');
  });
  res.redirect("https://www.google.co.jp/search?q=" + searchQuery + "&tbm=isch")
});
app.get("/admin", (req, res) => {
  const fs = require("fs");
  fs.readFile("public/queries.txt", "utf8", function(err, data){
    if(err) throw err;

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
