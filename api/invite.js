// api/invite.js — Vercel Serverless Function (Node 18+)
export default async function handler(req, res) {
  // Origin do navegador NÃO inclui path. Ex.: https://indique.entre.net.br
  const defaultAllowed = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://indique.entre.net.br";
  const allowedOrigin = process.env.ALLOWED_ORIGIN || defaultAllowed;

  res.setHeader("Vary", "Origin");
  if (req.headers.origin === allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { cpf, phone, nick } = req.body || {};

    // Honeypot anti-bot
    if (typeof nick === "string" && nick.trim() !== "") {
      return res.status(400).json({ error: "Requisição inválida." });
    }

    // Sanitização
    const digits = (s) => String(s || "").replace(/\D+/g, "");
    const cpfDigits = digits(cpf);
    let phoneDigits = digits(phone);

    if (cpfDigits.length !== 11) {
      return res.status(400).json({ error: "CPF deve ter 11 dígitos." });
    }

    // Normaliza telefone: 55 + DDD(2) + 9 + número(8)
    if (phoneDigits.length === 11) phoneDigits = "55" + phoneDigits;
    if (!(phoneDigits.length === 13 && phoneDigits.startsWith("55"))) {
      return res.status(400).json({ error: "Telefone deve estar no padrão 55 + DDD + 9 + número (8 dígitos)." });
    }

    const apiToken = process.env.ZAPISP_API_TOKEN;
    if (!apiToken) {
      return res.status(500).json({ error: "API token não configurado no servidor." });
    }

    const url = `https://zapisp.com.br/api/invitations?apiToken=${encodeURIComponent(apiToken)}&telefone=${encodeURIComponent(phoneDigits)}`;

    const resp = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(12000),
    });

    const payload = await resp.json().catch(() => ({}));
    if (!resp.ok || payload.error) {
      return res.status(404).json({ error: payload.error || "Não encontrado." });
    }

    const data = payload?.success || {};
    const cliente = data?.cliente || {};
    const resposta = {
      cliente: {
        id: cliente.client_id,
        nome: cliente.client_name,
        email: cliente.client_email,
        telefone: cliente.client_phone,
        clicks: Number(cliente.client_invite_clicks || 0),
        criadoEm: cliente.created_at,
      },
      convite: data?.convite || null,
      convidados: Array.isArray(data?.convidados) ? data.convidados.length : 0,
    };

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
    return res.status(200).json(resposta);
  } catch (err) {
    return res.status(500).json({ error: "Falha ao consultar. Tente novamente." });
  }
}
