const http = require("http"),
  fs = require("fs"),
  url = require("url");

//create server with http module

http.createServer((request, response) => {
    //parse url
    let address = request.url,
      parsedUrl = url.parse(address, true),
      filePath = "";

    //add requests to log
    fs.appendFile(
      "log.txt",
      `URL: ${address} 
        Timestamp: ${new Date()}
        
        `,
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Added to log");
        }
      }
    );

    //check for filePath and read file
    if (parsedUrl.pathname.includes("documentation")) {
      filePath = (__dirname + "/documentation.html");
    } else {
      filePath = "index.html";
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        throw err;
      }
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(data);
      response.end("Hello Node!\n");
    });
  })
  .listen(8080);

console.log("My first Node test server is running on Port 8080.");