// Servidor customizado para hospedagem Node.js da GoDaddy (cPanel).
// O cPanel injeta a variável PORT e espera um arquivo de entrada (startup file)
// que escute nessa porta. Este arquivo atende exatamente esse requisito.
//
// Uso:  npm start  (ou "node server.js")

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(port, () => {
      console.log(`> EXPRESS BEBIDAS pronto em http://${hostname}:${port}`);
    });
  })
  .catch((err) => {
    console.error('Falha ao iniciar o servidor:', err);
    process.exit(1);
  });
