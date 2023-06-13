const http = require('http'),
    url = require('url'),
    fs = require('fs');

//create server with http module

http.createServer((request, response) => {
    //parse url
    let address = request.url;
    parsedUrl = new URL(address, true);
    filePath = '';

    //check for filePath and read file
    if (parsedUrl.pathname.includes('documentation')) {
        filePath = (__dirname + './documentation.html');
    } else {
        filePath = 'index.html';
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            throw err;
        }
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write(data);
        response.end('Hello Node!\n');
    });
    
}).listen(8080);

console.log('My first Node test server is running on Port 8080.');