const axios = require("axios");
const cheerio = require("cheerio");

async function fetchTitle(url) {
    try{
        const response = await axios.get(url, {
            timeout: 5000,
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        });
        const $ = cheerio.load(response.data);
        let title = $('title').text().trim();

        if(!title){
            title = $('meta[property="og:title"]').attr('content');
        }
        if (!title) {
            title = $('meta[name="twitter:title"]').attr('content');
        }
        if(!title){
            title = $('h1').first().text().trim();
        }
        return title || "Untitled Page";
    }
    catch(error){
        throw new Error("Unable to fetch page title")
    }
};

module.exports = {fetchTitle};