// ESM
import Fastify from 'fastify'
const fastify = Fastify({
    logger: true
})

fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
})
fastify.get('/routes', async (request, reply) => {
    const Dest_Lat = request.query.destlat, Dest_Long = request.query.destlong;
    const Origin_Lat = request.query.originlat, Origin_Long = request.query.originlong;

    const google_routes = (await fetch("https://m.uber.com/go/custom-api/navigation/route", {
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
            "cookie": "sid=QA.CAESEJaHp1r7VUithJ6_SEgyS9EYl8HjsAYiATEqJDZiOGUzOWIxLTQ1MGUtNDE3Zi05YzMxLTc4OWMwYTlkNGY0MDI8MqHYXTXy7AE6X4Q3O5BAGcjVkS-etWsi6urdFX55UzRfBNjrkpZwUwZvvMXF8X1ciT5R582zQ6hTTsyBOgExQgh1YmVyLmNvbQ.uxdOAwMTT3ObRNV5Zs6sNIXMep83qPHfLoNE4pnsedk; csid=1.1712906391743.NrpKgRnQLukzqPFL/UFTh0LdC4frCuPbHSjOrY/bwhU=",
        },
        "body": `{"destinations":[{"latitude":${Dest_Lat},"longitude":${Dest_Long}}],"origin":{"latitude":${Origin_Lat},"longitude":${Origin_Long}}}`,
        "method": "POST"
    }).then(async (res) => {
        const responseJSON = (await res.json());
        // console.log(responseJSON);
        // const results = responseJSON.map((item) => {
        //     return (item.addressLine1 + ", " + item.addressLine2);
        // })
        return (responseJSON);
    }))
    reply.headers({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    })
    return { google_routes }
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
        const results = responseJSON.map((item) => {
            return ({ "Name": item.addressLine1 + ", " + item.addressLine2, "ID": item.id });
        })
        return (results);
    });
    reply.headers({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    })
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