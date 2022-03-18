const cheerio = require("cheerio");
const request = require("request");
const scobj = require("./scorecard");


function getallmatcheslink(url){
    request(url,function(err,response,html){
        if(err){
            console.log(err);
        }
        else{
            extractalllink(html);

    
        }

    })
}
function extractalllink(html){
    let abc = cheerio.load(html);
    let scorecardelem = abc("a[data-hover='Scorecard']");
    for(let i=0; i< scorecardelem.length; i++){
        let link = abc(scorecardelem[i]).attr("href");
        // console.log(link);
        let fulllink = "https://www.espncricinfo.com"+link;
        console.log(fulllink);
        scobj.ps(fulllink);
        
        
    }
    

}
module.exports = {
    galmatches : getallmatcheslink
}