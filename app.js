const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');

const index_page = fs.readFileSync('./index.ejs', 'utf8');
const other_page = fs.readFileSync('./other.ejs', 'utf8');
const style_css = fs.readFileSync('./style.css', 'utf8');

const getFromClient = (request, response) => {
  var url_parts = url.parse(request.url);
  switch (url_parts.path) {
    case '/index':
      const ejsVariable = {
        title: 'Indexページ',
        content: 'これはテンプレートを使ったサンプルページです。'
      };
      var content = ejs.render(index_page, ejsVariable);
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.write(content);
      response.end();
      break;
    case '/style.css':
      response.writeHead(200, { 'Content-Type': 'text/css' });
      response.end();
      break;
    case '/other':
      const otherEjsVariable = {
        title: 'other',
        content: 'これは新しく用意したページです'
      };
      var content = ejs.render(other_page, otherEjsVariable);
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.write(content);
      response.end();
      break;
    default:
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.end(('no page...'));
      break;
  }
};

var server = http.createServer(getFromClient)

server.listen(3000);
console.log('Server start')


