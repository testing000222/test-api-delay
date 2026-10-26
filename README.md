# API de usuário fictício

API Node.js sem dependências externas. `GET /user` mantém a requisição
aberta por um período aleatório de 120 a 180 segundos e retorna HTTP 200:

```json
{"usuario":"pinguim_cosmico","email":"pinguim.cosmico@example.com"}
```

Os nomes são inventados e os emails usam `example.com`. O usuário é sorteado
de uma lista fixa; repetições são possíveis. A espera simula uma consulta
lenta, sem acessar banco de dados e sem bloquear outras requisições.

## Executar localmente

Requer Node.js 18 ou superior:

```bash
npm start
```

Em outro terminal:

```bash
curl --max-time 240 http://localhost:3000/user
```

`GET /health` responde imediatamente e `GET /` mostra as rotas disponíveis.

## Publicar gratuitamente no Render

1. Envie estes arquivos para um repositório no GitHub.
2. No Render, selecione **New > Blueprint**, conecte o repositório e use o
   `render.yaml` incluído, que seleciona o plano **Free**.
3. Após o deploy, use `https://SEU-SERVICO.onrender.com/user`.

Também é possível criar **New > Web Service**, conectar o repositório e definir:

- Runtime: Node
- Build Command: `npm install --ignore-scripts --no-audit --no-fund`
- Start Command: `npm start`
- Instance Type: Free
- Health Check Path: `/health`

A aplicação usa `PORT` fornecida pelo Render e escuta em `0.0.0.0`.
Documentação: https://render.com/docs/web-services

## Tempo de resposta

O atraso é intencional: a API responde com sucesso após a espera, em vez de
retornar um erro de timeout. Configure o cliente HTTP para aguardar mais de
180 segundos. Por exemplo:

```bash
curl --max-time 300 https://SEU-SERVICO.onrender.com/user
```

No plano Free, o Render hiberna após 15 minutos sem tráfego e pode levar
cerca de um minuto para reativar. Essa inicialização pode se somar à espera
da API. Para medir apenas a consulta simulada, acesse `/health` primeiro.
Documentação: https://render.com/docs/free
