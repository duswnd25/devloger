// TODO 변경필요
const blogName = 'Spoqa';
const rootUrl = 'https://spoqa.github.io/';
const headerSrc = 'https://spoqa.github.io/images/logo.png';

// Module
const cheerio = require('cheerio');
const requestPromise = require('request-promise');

const rootPath = process.cwd();
const resultItem = require(rootPath + '/data/parser/result_item');

exports.getData = function (rootCallback) {
    requestPromise(rootUrl)
        .then(function (htmlString) {
            let $ = cheerio.load(htmlString);

            // Article
            let articleItem = $('li.post-item').eq(0).children('div.post-author-info').eq(0);

            // Title
            let titleItem = articleItem.children('h2.post-title').eq(0).children('a').eq(0);
            let parseTitle = titleItem.children('span.post-title-words').eq(0).text();
            let parseLink = titleItem.attr('href');

            // Date
            let parseDate = articleItem.children('span.post-date').eq(0).text();

            // Summary
            let parseSummary = articleItem.children('p.post-description').eq(0).text();

            // Result
            let result = resultItem.getResultItem();
            result.blog_name = blogName;
            result.blog_favicon_src = 'https://www.google.com/s2/favicons?domain=' + rootUrl;
            result.blog_header_src = headerSrc;
            result.article_title = parseTitle;
            result.article_date = parseDate;
            result.article_link = rootUrl + parseLink;
            result.article_summary = parseSummary;

            rootCallback(result);
        })
        .catch(function (err) {
            console.log(err);
        });
};