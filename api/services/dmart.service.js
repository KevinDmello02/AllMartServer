const Q = require('q');

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const request = require('request'); 

exports.getProductDetails = async function (body) {
	var deferred = Q.defer();
    console.log('inside getProductDetails service');

    request.get({
        headers: { 'Access-Control-Allow-Origin': '*'},
        url: `https://digital.dmart.in/api/v1/search/${body.searchKey}?page=1&size=40`
      }, function(error, response, body){
        if (error) {
            deferred.resolve({ message: 'Error getProductDetails Dmart' });
        } else {
            deferred.resolve(body);
        }
      });
    
    return deferred.promise;
}

async function scrapeData(searchKey) {
    const browser = await puppeteer.launch({
        // defaultViewport: false,
        // slowMo: 250,
        // args: ['--no-sandbox']
        headless: true,
        slowMo: 1,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-gpu",
          "--disable-dev-shm-usage",
          "--no-first-run",
          "--no-zygote",
          "--start-fullscreen",
        ],
    });

    const page = await browser.newPage();
    await page.goto('https://www.dmart.in/searchResult?searchTerm='+searchKey);

    // await page.screenshot({ path: 'image.png' });

    const pageData = await page.evaluate(() => {
        return {
            html: document.documentElement.innerHTML,
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        }
    })

    const $ = cheerio.load(pageData.html);
    let list = [];
    let price = [];
    let images = [];
    const element = $('.MuiGrid-container').find('div > div > a').each(function (index, element) {
        if ($(element).attr('title')) {
            list.push($(element).attr('title'));
        }
    });
    const newElement = $('.MuiGrid-container').find('div > div > section').each(function (index, element) {
        price.push(($(element).children('p').text()).trim())
    });
    const newElement2 = $('.MuiGrid-container').find('div > div > a > div').each(function (index, element) {
        images.push($(element).attr('style'))
    });
    console.log(list)
    console.log(price)
    console.log(images)
    // console.log(element.text());
    // console.log(newElement.text());

    let formatedData = formatArray(list, price, images);

    await browser.close();

    return formatedData;
}

function formatArray(list, price, images) {
    let formatedData = [];
    let titleArray = list;
    let priceArray = price;
    let imagesArray = images;
    
    titleArray.forEach(element => {
        let obj = {};
        let price = priceArray.splice(0, 3);
        let img = imagesArray.splice(0, 1);
        obj = {
            product_title: element,
            mrp_price: price[0],
            dmart_price: price[1],
            save_price: price[2],
            product_image: img[0].split('"')[1]

        }
        formatedData.push(obj);
    })

    return formatedData;
}