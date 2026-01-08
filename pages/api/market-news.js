export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const apiKey = process.env.NEXT_PUBLIC_MARKETAUX_API_KEY;
    if (!apiKey) {
        console.error('MARKETAUX_API_KEY not found in environment');
        return res.status(500).json({
            error: "API key not configured",
            headlines: ["CONFIGURATION ERROR"]
        });
    }

    try {
        const response = await fetch(
            `https://api.marketaux.com/v1/news/all?symbols=XAUUSD,WTI,USD&language=en&api_token=${apiKey}`
        );


        if (!response.ok) {
            const errorText = await response.text();
            console.error('Marketaux API error:', response.status, errorText);
            throw new Error(`Marketaux API failed: ${response.status}`);
        }

        const data = await response.json();
        console.log('Marketaux API response received:', data.data?.length || 0, 'articles');

        const headlines = (data.data || [])
            .slice(0, 10)
            .map(item => item.title.toUpperCase());

        res.status(200).json({ headlines });
    } catch (error) {
        console.error('Market news handler error:', error.message);
        res.status(500).json({
            headlines: ["GOLD MARKET UPDATES LOADING..."],
        });
    }
}