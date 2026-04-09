export default async function handler(req, res) {
    // Configurar encabezados CORS para el navegador
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )

    // Responder rápido al preflight OPTIONS de CORS
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }

    try {
        const url = 'https://n8n-production-c420.up.railway.app/webhook/nexus-leads';

        // Ensure body is a string for fetch
        const bodyStr = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

        const response = await fetch(url, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: bodyStr
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        console.error('[PROXY ERROR]:', error);
        return res.status(502).json({
            error: 'Proxy Error',
            message: error.message,
            tip: 'Verifica que el webhook de n8n esté activo en Railway.'
        });
    }
}
