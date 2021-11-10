const Q = require('q');

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

exports.getProductDetails = async function (body) {
	var deferred = Q.defer();
    console.log('inside getProductDetails service');
    console.log(body.searchKey);
    let searchResults = await scrapeData(body.searchKey);

    if (searchResults) {
        deferred.resolve(searchResults);
    } else {
        deferred.resolve({ message: 'Error while scraping' });
    }
    
    return deferred.promise;
}

async function scrapeData(searchKey) {
    const browser = await puppeteer.launch({
        defaultViewport: false,
        slowMo: 250
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