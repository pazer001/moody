

var fetch = require('node-fetch');
// var $ = require('jquery');
let cheerio = require('cheerio')

fetch('http://images.search.yahoo.com/search/images;_ylt=AwrB8pRaQQFY400AU2mJzbkF?p=michael+jackson+ben&ei=UTF-8&y=Search&fr=sfp&imgsz=large&fr2=p%3As%2Cv%3Ai')
    .then(function(res) {
        return res.text();
    }).then(function(body) {
    let $ = cheerio.load(body);
    let queryUrl    =   `http://images.search.yahoo.com/${$('#res-cont').find('a').first().prop('href')}`;
    fetch(queryUrl)
        .then(function(res) {
            return res.text();
        }).then(function(body) {
        let $ = cheerio.load(body);
        var backgroundCover     =   JSON.parse($('#data-cntr script').first().html().replace('jsData =', '')).results[0].oi;
    });
});
