const http = require('http');

const server = http.createServer((req, res) => {
    res.end('Voilà la réponse du serveur !');
});


console.log("hello projet 6");

server.listen(process.env.PORT || 3000);