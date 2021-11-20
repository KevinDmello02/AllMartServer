const Q = require('q');

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const request = require('request'); 

exports.getProductDetails = async function (body) {
	var deferred = Q.defer();
    console.log('inside getProductDetails service');
    // console.log(body.searchKey);
    // let searchResults = await scrapeData(body.searchKey);

    let bigBazzarBody = {
        "filters": [],
        "pageNo": "1",
        "perPage": "16",
        "searchTerm": "sugar",
        "storeCode": "5538"
    }
    let searchResults;

    // request.post('https://express.shop.bigbazaar.com/express/product/search/lite', bigBazzarBody)
    // .on('response', function(res) {
    //     console.log(res);
    //     searchResults = res;
    // })

    // request.get('https://digital.dmart.in/api/v1/search/sugar?page=1&size=40')
    // .on('response', function(res) {
    //     console.log(res.body);
    //     searchResults = res;
    // })

    request.post({
        headers: { 'Access-Control-Allow-Origin': '*'},
        url: 'https://express.shop.bigbazaar.com/express/product/search/lite',
        json: bigBazzarBody
      }, function(error, response, body){
        console.log(body);
        searchResults = body;
      });

    if (searchResults) {
        deferred.resolve(searchResults);
    } else {
        deferred.resolve({ message: 'Error while scraping' });
    }
    
    return deferred.promise;
}

async function scrapeData(searchKey) {
    const browser = await puppeteer.launch({
        // defaultViewport: false,
        // headless: false,
        // args: ['--no-sandbox', '--disable-setuid-sandbox'],
        // args: ["--disable-setuid-sandbox"],
        // args: ['--no-sandbox']
        headless: true,
        slowMo: 250,
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
    await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36");
    // await page.setDefaultNavigationTimeout(0);
    await page.goto('https://www.jiomart.com/catalogsearch/result?q='+searchKey, {
        waitUntil: 'networkidle2',
        // timeout: 0
    });
    // await page.waitForSelector('.ais-InfiniteHits > .ais-InfiniteHits-list > .ais-InfiniteHits-item > div');

    const pages = page.content();

    const pageData = await page.evaluate(() => {
        return {
            html: document.documentElement.innerHTML,
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        }
    });
    console.log('Page Data =====================>', pageData.width);
    console.log('Page Data =====================>', pageData.height);
    // console.log('Page Data =====================>', pageData.html);

    const $ = cheerio.load(pageData.html);
    let list = [];
    let price = [];
    let images = [];

    const element = $('.ais-InfiniteHits > .ais-InfiniteHits-list > .ais-InfiniteHits-item > div, a').find('a').each(function (index, element) {
        console.log($(element).children('.clsgetname').text());
        console.log('data1')
        // list.push($(element).attr('title'));
        list.push($(element).children('span.clsgetname').text());
    });
    // console.log($('.ais-InfiniteHits-list')[0].children[0].children);
    console.log('data')
    const element1 = $('.ais-InfiniteHits > .ais-InfiniteHits-list > .ais-InfiniteHits-item > div, a').find('.cat-img').each(function (index, element) {
        // console.log($(element));
        // list.push($(element).attr('title'));
        console.log('data2')
        console.log($(element).children('img').attr('src'));
        images.push($(element).children('img').attr('src'));
    });
    const element3 = $('.ais-InfiniteHits > .ais-InfiniteHits-list > .ais-InfiniteHits-item, div').find('.price-box').each(function (index, element) {
        console.log($(element).children('#final_price').text());
        // console.log($(element).children('#price').text());
        console.log('data3')
        price.push($(element).children('#final_price').text());
        price.push($(element).children('#price').text());
    });
    
    // const newElement2 = $('.MuiGrid-container').find('div > div > ol > li > div > span > img').each(function (index, element) {
    //     images.push($(element).attr('src'))
    // });
    // console.log(list)
    // console.log(price)
    // console.log(images)
    // console.log(element.text());
    // console.log(newElement.text());

    let formatedData = formatArray(list, price, images);

    console.log(formatedData);

    return pages;
}

function formatArray(list, price, images) {
    let formatedData = [];
    let titleArray = list;
    let priceArray = price;
    let imagesArray = images;
    
    titleArray.forEach(element => {
        let obj = {};
        let price = priceArray.splice(0, 2);
        let img = imagesArray.splice(0, 1);
        let savePrice = parseInt(price[1].replace('₹ ', '')) - parseInt(price[0].replace('₹ ', ''))
        obj = {
            product_title: element,
            mrp_price: price[1],
            jiomart_price: price[0],
            save_price: ('₹ ' + savePrice + '.00').toString(),
            product_image: img[0]

        }
        formatedData.push(obj);
    });
    

    return formatedData;
}