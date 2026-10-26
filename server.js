import http from 'node:http';
import { randomInt } from 'node:crypto';

const usuarios = [
  { usuario: 'astronauta_azul', email: 'astronauta.azul@example.com' },
  { usuario: 'pinguim_cosmico', email: 'pinguim.cosmico@example.com' },
  { usuario: 'robo_de_papel', email: 'robo.papel@example.com' },
  { usuario: 'nuvem_laranja', email: 'nuvem.laranja@example.com' },
  { usuario: 'cometa_verde', email: 'cometa.verde@example.com' },
  { usuario: 'dragao_de_algodao', email: 'dragao.algodao@example.com' },
  { usuario: 'planeta_bolacha', email: 'planeta.bolacha@example.com' },
  { usuario: 'cacto_galactico', email: 'cacto.galactico@example.com' }
];

function json(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;
  if (req.method === 'OPTIONS') {
    json(res, 204);
    return;
  }
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    json(res, 405, { erro: 'Método não permitido' });
    return;
  }
  if (path === '/health') {
    json(res, 200, { status: 'ok' });
    return;
  }
  if (path === '/') {
    json(res, 200, {
      mensagem: 'API de testes com dados fictícios',
      endpoint: '/user',
      espera: '120 a 180 segundos',
      health: '/health'
    });
    return;
  }
  if (path !== '/user') {
    json(res, 404, { erro: 'Rota não encontrada' });
    return;
  }

  // Espera assíncrona: outras requisições e o health check continuam funcionando.
  const atrasoMs = randomInt(120_000, 180_001);
  const inicio = Date.now();
  console.log(`GET /user: aguardando ${atrasoMs} ms`);
  const timer = setTimeout(() => {
    const usuario = usuarios[randomInt(usuarios.length)];
    json(res, 200, usuario);
    console.log(`GET /user: respondido em ${Date.now() - inicio} ms`);
  }, atrasoMs);

  res.on('close', () => clearTimeout(timer));
});

// Não encerrar a conexão durante a consulta simulada.
server.timeout = 0;
server.listen(Number(process.env.PORT || 3000), '0.0.0.0', () => {
  console.log(`API escutando na porta ${server.address().port}`);
});
