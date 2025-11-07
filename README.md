# Entre Invite Bundle (Widget + API)

Este projeto entrega **duas peças** prontas para usar no Vercel:
1) **API serverless** segura: `POST /api/invite` (proxy para Zapisp, sem expor token no front).
2) **Widget standalone**: `GET /widget.html` — página pronta para embutir via `<iframe>` no Framer.

## Como usar (resumo)
1. **Importe** este repositório no Vercel (ou conecte via GitHub).
2. Configure as variáveis de ambiente:
   - `ZAPISP_API_TOKEN` = seu token
   - `ALLOWED_ORIGIN` = (opcional) origem autorizada do iFrame; em produção use `https://indique.entre.net.br`
3. Publique. Acesse:
   - `https://<seu-projeto>.vercel.app/widget.html`  ← use essa URL no `<iframe>` do Framer
   - `https://<seu-projeto>.vercel.app/api/invite`   ← endpoint usado pelo widget

> Dica: hospedando o **widget.html** e a **API** no mesmo domínio, o CORS deixa de ser problema, porque tudo roda **mesma origem**.

## Endpoint
`POST /api/invite`
Body JSON: `{ "cpf": "00000000000", "phone": "2299XXXXXXXX", "nick": "" }`

## Segurança e UX
- Token fica **somente no server** (variável de ambiente).
- Honeypot anti-bot (`nick`).
- Sanitização / normalização de CPF e telefone.
- Timeout de rede e mensagens amigáveis.
- Cache CDN leve (1 min).

## Framer (Embed via URL)
No Framer, adicione um bloco **Embed → Code** contendo:
```html
<iframe
  src="https://<seu-projeto>.vercel.app/widget.html"
  style="width:100%;height:640px;border:0;border-radius:20px;"
  loading="lazy"
  allow="clipboard-write"
></iframe>
```
Ajuste a altura conforme necessário.
