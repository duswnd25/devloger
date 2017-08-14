// TODO 변경필요
const rootUrl = 'http://add2paper.github.io/';
const headerSrc = rootUrl + '/images/blog-cover.png'; // 표시 없음

// Module
const cheerio = require('cheerio');
const request = require('request');

const resultItem = require('../result_item');

exports.getData = function (rootCallback) {
    request(rootUrl, function (error, response, body) {

        if (error) {
            console.error(error);
        }

        let $ = cheerio.load(body);

        // Title
        let blogName = $('title').eq(0).text().substring(0, 20);

        // Article
        let articleItem = $('section.index').eq(0)
            .children('div').eq(0);

        // Title
        let titleItem = articleItem.children('h2.title').eq(0)
            .children('a').eq(0);
        let parseTitle = titleItem.text();
        let parseLink = titleItem.attr('href');

        // Summary
        let parseSummary = articleItem.children('p').eq(0).text();

        // Result
        let result = resultItem.getResultItem();
        result.blog_name = blogName;
        result.blog_favicon_src = 'https://www.google.com/s2/favicons?domain=' + rootUrl;
        result.blog_header_src = headerSrc;
        result.article_title = parseTitle;
        result.article_link = rootUrl + parseLink;
        result.article_summary = parseSummary.length > 200 ? parseSummary.substring(0, 200) : parseSummary;
        result.blog_type = 'C';

        rootCallback(result);
    });
};