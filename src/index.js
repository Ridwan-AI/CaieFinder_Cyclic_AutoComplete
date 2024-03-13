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
        // const results = responseJSON.map(async(item) => {
        //     const ItemData = (await PlaceID_Resolver(item.id)).data
        //     // console.log(ItemData);
        //     return ({ "Name": item.addressLine1 + ", " + item.addressLine2, "ID": item.id });
        // })
        const results = await Promise.all(
            responseJSON.map(async (element) => {
                const ItemData = (await PlaceID_Resolver(element.id))
                // console.log(ItemData);
                return (ItemData);
            })
        )

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

async function PlaceID_Resolver(PlaceID) {
    return (fetch("https://www.uber.com/api/loadTSPlaceDetails?localeCode=en", {
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
            "cookie": "_ua={\"session_id\":\"5e8e7252-f83c-40ca-b660-930efc0385df\",\"session_time_ms\":1710237066941}; marketing_vistor_id=9429fb60-5422-4187-a914-495c09eb6718; uber_sites_geolocalization={%22best%22:{%22localeCode%22:%22en%22%2C%22countryCode%22:%22BD%22%2C%22territoryId%22:1107%2C%22territorySlug%22:%22dhaka%22%2C%22territoryName%22:%22Dhaka%22}%2C%22url%22:{%22localeCode%22:%22en%22%2C%22countryCode%22:%22BD%22}%2C%22user%22:{%22countryCode%22:%22BD%22%2C%22territoryId%22:1107%2C%22territoryGeoJson%22:[[{%22lat%22:25.4320412%2C%22lng%22:89.6431732}%2C{%22lat%22:25.4320412%2C%22lng%22:91.5833893}%2C{%22lat%22:22.0772209%2C%22lng%22:91.5833893}%2C{%22lat%22:22.0772209%2C%22lng%22:89.6431732}]]%2C%22territoryGeoPoint%22:{%22latitude%22:23.8687353744%2C%22longitude%22:90.3794959669}%2C%22territorySlug%22:%22dhaka%22%2C%22territoryName%22:%22Dhaka%22%2C%22localeCode%22:%22en%22}}; UBER_CONSENTMGR=1710237068511|consent:true; segmentCookie=a; utag_main_segment=a; utag_geo_code=GB; utag_main_optimizely_segment=b; _hjSessionUser_960703=eyJpZCI6ImJkZTVhMWIyLWM5NjktNTY4OS04OTQ0LWNjNTQ0OGZmNTBiOSIsImNyZWF0ZWQiOjE3MTAyMzcwNzAxODAsImV4aXN0aW5nIjp0cnVlfQ==; udi-id=bnOZUb/CgLqXfE+2CUAiG8dP0+k7dRxyXSfaUQJ2jw4oTYOtul28SHNmqHD4Se8DEkmGm/mrmR8iI/97AgTR7BsDnXcgZCSsHqsZUi18bnPBTh2xyOxKHcXYfN9XlR3+r1SeXmriG7+p9D85jPx/qS/MEtFLL5gSYKl0Y/cbhiBqxNx+9dcJqXvXdU3DsWkOCaK0qPSEy4f8YSM7uZ2ndA==VdhZl2yCPERzDOmxNGagPQ==BZJ8OHJY53cq75HWg8A/iFFHoGvxLPuOyR11ns1yBC0=; sid=QA.CAESEJaHp1r7VUithJ6_SEgyS9EYl8HjsAYiATEqJDZiOGUzOWIxLTQ1MGUtNDE3Zi05YzMxLTc4OWMwYTlkNGY0MDI8MqHYXTXy7AE6X4Q3O5BAGcjVkS-etWsi6urdFX55UzRfBNjrkpZwUwZvvMXF8X1ciT5R582zQ6hTTsyBOgExQgh1YmVyLmNvbQ.uxdOAwMTT3ObRNV5Zs6sNIXMep83qPHfLoNE4pnsedk; CONSENTMGR=1710237068512:undefined%7Cconsent:true; _tt_enable_cookie=1; _ttp=NCuWi1eT9BgqwOR8qwVkoQ505Vp; udi-fingerprint=rgLVROmvfyAufzytnpjiTfjV8SKN3P41Ht4/rH0c5x+qPOxNr852df0R/vee522e8v3oQ/ETIKFky53VBR59fg==onpi7h1qOXssGc6x0FtE02h0xfuVCQH+u5BnLcovoJY=; x-uber-analytics-session-id=e7480144-94f2-4d3e-a3b6-0ef728eae5ba; csid=1.1712928556201.ijbxCpl0YjlgCKwbALavua8dgn3qCOdToMRzwam1kUk=; jwt-session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTAzMzY1NTYsImV4cCI6MTcxMDQyMjk1Nn0.FAi8fY4_KqbkycgSQp5B6Yw73978k8XrNB-qvXnk4dA; mp_adec770be288b16d9008c964acfba5c2_mixpanel=%7B%22distinct_id%22%3A%20%225f46dadf-9a00-4f97-9ac3-035b4331e51d%22%2C%22%24device_id%22%3A%20%2218e3212ae54edc-0c3ec37aa4266e-15462c6f-193a0c-18e3212ae551593%22%2C%22%24search_engine%22%3A%20%22google%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fwww.google.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22www.google.com%22%2C%22%24user_id%22%3A%20%225f46dadf-9a00-4f97-9ac3-035b4331e51d%22%7D; utag_main__sn=4; utag_main__se=1%3Bexp-session; utag_main__ss=1%3Bexp-session; utag_main__st=1710338358353%3Bexp-session; utag_main_ses_id=1710336558353%3Bexp-session; utag_main__pn=1%3Bexp-session; _hjSession_960703=eyJpZCI6ImJjMTI2YzNjLTFhNjAtNDA2Yi04OWIzLWUzYWIxNmJkMGI1OCIsImMiOjE3MTAzMzY1NjAyNzUsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=",
            "Referer": "https://www.uber.com/bd/en/?_csid=SlnQCicJNpOAXrdMPtS73w&state=pfREKAn-7BXvrj6miDm6BDJtE7q5PYDSXZ-qqVTF9-8%3D&effect=",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": `{"type":"pickup","locale":"en","id":"${PlaceID}","provider":"google_places"}`,
        "method": "POST"
    }).then(async (res) => {
        const responseJSON = (await res.json()).data
        return ({
            "Name": responseJSON.title + ", " + responseJSON.fullAddress,
            "Lat": responseJSON.lat,
            "Lng": responseJSON.long
        })
    }));
}

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