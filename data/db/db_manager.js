const fs = require("fs");
const defaultOptions = {encoding: 'utf-8'};
const path = process.cwd() + '/data/db/log/';

// 새 데이터인지 확인하는 함수
exports.isNewData = function (tagName, parseTitle, rootCallback) {
    fs.readFile(path + tagName + '.txt', 'utf8', function (err, dataOrigin) {
        if (err) {
            console.error(err);
        }
        let temp = JSON.parse(dataOrigin);
        rootCallback(!(temp.article_title === parseTitle));
    });
};


// 새 데이터로 덮어쓰는 함수
exports.saveNewData = function (tagName, data) {
    let tempJson = data;
    tempJson.article_date = Date.now();
    fs.unlinkSync(path + tagName + '.txt');
    fs.writeFile(path + tagName + '.txt', JSON.stringify(tempJson), defaultOptions, function (err) {
        if (err) {
            console.log(err);
        }
    });
};


// 최근 값 가져오기
exports.getRecentData = function (type, rootCallback) {

    if (type === 'all') {

        let blogList = fs.readdirSync(process.cwd() + '/data/db/log/');
        let result = '[';
        let counter = 1;

        blogList.forEach(file => {
            fs.readFile(path + file, 'utf8', function (err, dataOrigin) {
                if (err) {
                    console.error(err);
                }
                if (counter !== 1) {
                    result += ',';
                }

                let tempJson = JSON.parse(dataOrigin);
                tempJson.article_date = new Date(tempJson.article_date).getCustomType();
                result += JSON.stringify(tempJson);

                if (counter === blogList.length) {
                    result += ']';
                    let tempJson = JSON.parse(result);
                    tempJson.sort(function (a, b) {
                        return (b.article_date > a.article_date) ? 1 : ((b.article_date < a.article_date) ? -1 : 0);
                    });
                    rootCallback(tempJson);
                }
                counter++;
            });
        });
    } else {
        fs.readFile(path + type + '.txt', 'utf8', function (err, dataOrigin) {
            if (err) {
                console.error(err);
            }

            let tempJson = JSON.parse(dataOrigin);
            let tempDate = new Date(Number.parseInt(tempJson.article_date));
            tempJson.article_date = tempDate.getCustomType();
            rootCallback(tempJson);
        });
    }
};

Date.prototype.getCustomType = function () {
    let yyyy = this.getFullYear().toString();
    let mm = (this.getMonth() + 1).toString();
    let dd = this.getDate().toString();
    return yyyy + '년 ' + mm + '월' + dd + '일';
};
