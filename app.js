const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');
const qs = require('querystring');

const index_page = fs.readFileSync('./index.ejs', 'utf8');
const other_page = fs.readFileSync('./other.ejs', 'utf8');
const style_css = fs.readFileSync('./style.css', 'utf8');

const getFromClient = (request, response) => {
  var url_parts = url.parse(request.url, true);
  switch (url_parts.pathname) {
    case '/index':
      response_index(request, response);
      break;
    case '/style.css':
      response.writeHead(200, { 'Content-Type': 'text/css' });
      response.end();
      break;
    case '/other':
      response_other(request, response);
      break;
    default:
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.end(('no page...'));
      break;
  }
};

var server = http.createServer(getFromClient)

const response_index = (request, response) => {
  const data = {
    Taro: '09-999-999',
    Hanako: '080-888-888',
    Sachiko: '070-777-777',
    Ichiro: '060-666-666'
  }
  const ejsVariable = {
    title: 'Indexページ',
    content: 'これはテンプレートを使ったサンプルページです。',
    data: data
  };
  var content = ejs.render(index_page, ejsVariable);
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(content);
  response.end();
}

const response_other = (request, response) => {
  if (request.method == 'POST') {
    var body = ''

    request.on('data', (data) => {
      body += data;
    })
    request.on('end', () => {
      var post_data = qs.parse(body);
      const intro = 'これはOtherページです'
      const msg = intro + 'あなたは、「' + post_data.msg + '」と書きました'
      const otherEjsVariable = {
        title: 'other',
        content: msg,
      };
      var content = ejs.render(other_page, otherEjsVariable);
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.write(content);
      response.end();
    })
  } else {
    var msg = "ページがありません"
    var content = ejs.render(other_page, {
      title: "Other",
      content: "msg"
    });
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(content);
    response.end();
  }
}

server.listen(3005);
console.log('Server start')


