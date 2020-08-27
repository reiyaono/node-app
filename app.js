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

var setCookie = (key, value, response) => {
  const cookie = escape(value)
  response.setHeader('Set-Cookie', [key + '=' + cookie])
}

var getCookie = (key, request) => {
  const cookie = request.headers.cookie
  var cookie_data = cookie != undefined ? cookie : '';
  var data = cookie_data.split(';');
  for (var i in data) {
    if (data[i].trim().startsWith(key + '=')) {
      var result = data[i].trim().substring(key.length + 1)
      return unescape(result)
    }
  }
  return '';
}

var server = http.createServer(getFromClient)

var write_index = (request, response, data) => {
  var msg = "伝言を表示します"
  const cookie_data = getCookie('msg', request)
  const ejsVariable = {
    title: 'Indexページ',
    content: msg,
    data: data,
    filename: 'data_item',
    cookie_data: cookie_data
  };
  var content = ejs.render(index_page, ejsVariable);
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(content);
  response.end();
}

const response_index = (request, response) => {
  var data = {
    Taro: '09-999-999',
    Hanako: '080-888-888',
    Sachiko: '070-777-777',
    Ichiro: '060-666-666',
    msg: 'no message'
  }
  if (request.method == 'POST') {
    var body ='';
    request.on('data', (data) => {
      body +=  data;
    })
    request.on('end', () => {
      data = qs.parse(body)
      setCookie('msg', data.msg, response)
      write_index(request, response, data)
    })
  } else {
    write_index(request, response, data)
  }
}

const response_other = (request, response) => {
  const data2 = {
    Taro: ['taro@yamada', '09-999-999', 'Tokyo'],
    Hanako: ['hanako@flower', '080-888-888', 'Yokohama'],
    Sachiko: ['sachi@happy', '070-777-777', 'Nagoya'],
    Ichiro: ['ichi@baseball', '060-666-666', 'USA']
  }
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
    var msg = "これはOtherページです"
    var content = ejs.render(other_page, {
      title: "Other",
      content: msg,
      data: data2,
      filename: 'data_item'
    });
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(content);
    response.end();
  }
}

server.listen(3005);
console.log('Server start')
