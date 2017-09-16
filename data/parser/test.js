// 파서는 구글 Feed Burner에 등록한 주소를 서버에 저장 후
// 별도의 스케줄러로 가져온다.

const Cheerio = require('cheerio');
const Request = require('request');

let requestOptions = {
    method: 'GET',
    uri: 'http://tech.lezhin.com/rss/',
    headers: {
        'User-Agent': 'Mozilla/5.0'
    },
    encoding: 'UTF-8'
};

Request(requestOptions, function (error, response, body) {
    if (error) {
        console.error('PARSER : REQUEST ERROR = ' + error.code);
        console.error(error.message);
    } else {
        console.log('PARSER : REQUEST SUCCESS');
    }

    let $ = Cheerio.load(body, {
        xmlMode: true
    });

    // Blog Data
    let info = $('channel').eq(0);
    let blogTitle = info.children('title').eq(0).text();

    // Post Data
    let post = $('item').eq(0);
    let postTitle = post.children('title').eq(0).text();
    let postLink = post.children('link').eq(0).text();
    let postContent = post.children('description').eq(0).text();

    if (postContent.length > 250) {
        postContent = postContent.substring(0, 250);
    }

    console.log('PARSER : BLOG TITLE = ' + blogTitle);\
    console.log('PARSER : POST TITLE = ' + postTitle);
    console.log('PARSER : POST LINK = ' + postLink);
    console.log('PARSER : POST CONTENT = ' + postContent);
});