// TODO 변경필요
const rootUrl = 'https://blog.outsider.ne.kr/category';
const parseHeaderSrc = 'https://blog.outsider.ne.kr/skin/blog/anti_verbose/images/main-bg.jpg.pagespeed.ce.0KiEbhhP7k.jpg'; // 표시 없음

// Module
const cheerio = require('cheerio');
const requestPromise = require('request-promise');

const resultItem = require('../result_item');

exports.getData = function (rootCallback) {
    requestPromise(rootUrl)
        .then(function (htmlString) {
            let $ = cheerio.load(htmlString);

            // Title
            let blogName = $('title').eq(0).text().substring(0, 20);

            // Article
            let articleItem = $('dl.post').eq(0);

            // Title
            let titleItem = articleItem.children('dt').eq(0).children('a');
            let parseTitle = titleItem.text();
            let parseLink = titleItem.attr('href');

            // Date
            let parseDate = articleItem.children('dd.postmetadata').eq(0).text().split('\|')[0];

            // Summary
            let parseSummary = ''; // 표시 없음

            // Result
            let result = resultItem.getResultItem();
            result.blog_name = blogName;
            result.blog_favicon_src = 'https://www.google.com/s2/favicons?domain=' + rootUrl;
            result.blog_header_src = parseHeaderSrc;
            result.article_title = parseTitle;
            result.article_date = parseDate;
            result.article_link = parseLink;
            result.article_summary = parseSummary.length > 200 ? parseSummary.substring(0, 200) : parseSummary;
            result.blog_type = 'P';

            rootCallback(result);
        })
        .catch(function (err) {
            console.log(err);
        });
};