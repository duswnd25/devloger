// TODO 변경필요
const blogName = 'Line';
const rootUrl = 'https://engineering.linecorp.com/ko/blog';
const headerSrc = 'https://d.line-scdn.net/r/web/developers/img/vu_blog.jpg'; // 표시없음

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
            let articleItem = $('ul.blog_list').eq(0).children('li').eq(0);

            // Title
            let titleItem = articleItem.children('a.bl_title').eq(0);
            let parseTitle = titleItem.text();
            let parseLink = titleItem.attr('href');

            // Summary
            let parseSummary = articleItem.children('div.bl_content.frontstage.markdown-out').eq(0).text();

            // Date
            let parseDate = articleItem.children('div.bl_desc').eq(0).children('span.date').eq(0).text();

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