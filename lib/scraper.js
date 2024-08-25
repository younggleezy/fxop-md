const axios = require('axios')
const file_type = require('file-type')
const fs = require('fs')

class Scrape {
    constructor() {
        async function facebook(url) {
            return new Promise(async (resolve, reject) => {
                axios.get(url)
                    .then(async res => {
                        const $ = cheerio.load(res.data)
                        const data = []
                        $('div[class="mb3"]').each(function (a, b) {
                            data.push({
                                url: $(b).find('a').attr('href')
                            })
                        })
                        const result = {
                            status: 200,
                            author: 'Astro',
                            data: data
                        }
                        resolve(result)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        }
    }
}

module.exports = Scrape;
