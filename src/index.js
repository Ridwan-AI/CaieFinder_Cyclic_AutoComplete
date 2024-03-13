// ESM
import Fastify from 'fastify'
const fastify = Fastify({
    logger: true
})

fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
})


fastify.get('/places', async (request, reply) => {
    // return request.query.q;
    const q = request.query.q,
        lat = request.query.lat,
        long = request.query.long;

    const data = await fetch("https://www.uber.com/api/loadTSSuggestions?localeCode=en", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-GB,en-GB-oxendict;q=0.9,en;q=0.8",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-csrf-token": "x",
            "Referer": "https://www.uber.com/bd/en/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": `{"q":"${q}","type":"pickup","locale":"en","lat":${lat},"long":${long}}`,
        "method": "POST"
    }).then(async (res) => {
        const responseJSON = (await res.json()).data.candidates;
        // console.log(responseJSON);
        return (responseJSON);
    });
    return { google_places: data }
})

/**
 * Run the server!
 */
const start = async () => {
    try {
        await fastify.listen({ port: 3000 })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()