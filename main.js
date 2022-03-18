const cheerio = require("cheerio");
const request = require("request");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const allmatobj = require("./allmatch");
 
const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const iplpath = path.join(__dirname,"ipl");
dirCreator(iplpath);
request(url, cb);
function cb(err, request, html){
    if(err){
        console.log(err);
    }
    else {
        extractlink(html);
    }
}
function extractlink(html){
    let $ = cheerio.load(html);
    let anchorelem = $("a[data-hover='View All Results']");
    let link = anchorelem.attr("href");
    // console.log(link)
    let fulllink = "https://www.espncricinfo.com"+link;
    // console.log(fulllink);
    // getallmatcheslink(fulllink);
    allmatobj.galmatches(fulllink);
    
    

}
function dirCreator(filePath){
    if(fs.existsSync(filePath)==false){
        fs.mkdirSync(filePath);
    }
}

