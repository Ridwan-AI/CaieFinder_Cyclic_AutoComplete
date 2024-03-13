await fetch("https://www.uber.com/api/loadTSSuggestions?localeCode=en", {
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
                "body": `{"q":"${q}","type":"pickup","locale":"en","lat":23.8687353744,"long":90.3794959669}`,
                "method": "POST"
            }).then(async (res) => {
                const responseJSON = await JSON.stringify(await res.json());
                console.log(responseJSON);
                return (responseJSON);
            }))