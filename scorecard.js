const cheerio = require("cheerio");
const request = require("request");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

// const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
function processscorecrd(url){
    request(url, cb);
}
function cb(err, request, html){
    if(err){
        console.log(err);
    }
    else {
        extractMatchdetails(html);
    }
}
function extractMatchdetails(html){
    let $ = cheerio.load(html);
    let descelem = $(".description");
    let result = $(".event .status-text");
    let stringarr = descelem.text().split(",");
    let venue = stringarr[1].trim();
    let date = stringarr[2].trim();

    result = result.text();
    let innings = $(".card.content-block.match-scorecard-table>.Collapsible");
    for(let i=0; i< innings.length;i++){
        let teamname = $(innings[i]).find("h5").text();
        teamname = teamname.split("INNINGS")[0].trim();
        let oppindexx = i==0? 1:0;
        let oppteamname = $(innings[oppindexx]).find("h5").text();
        oppteamname = oppteamname.split("INNINGS")[0].trim();
        let cinning = $(innings[i]);
        let allrows = cinning.find(".table.batsman tbody tr");
        for(let j =0; j< allrows.length; j++){
            let allcols = $(allrows[j]).find("td");
            let isworthy = $(allcols[0]).hasClass("batsman-cell");
            if(isworthy==true){
                let playername = $(allcols[0]).text().trim();
                let runs = $(allcols[2]).text().trim();
                let balls = $(allcols[3]).text().trim();
                let fours = $(allcols[5]).text().trim();
                let sixes = $(allcols[6]).text().trim();
                let sr = $(allcols[7]).text().trim();
                console.log(playername+" "+runs+" "+balls+" "+fours+" "+sixes+" "+sr)
                processPlayer(teamname,playername,runs,balls,fours,sixes,sr,oppteamname,venue,date,result);

            }

        }
        // console.log(venue +" "+ date+" " + teamname+" " + oppteamname);

    }
    

}
function processPlayer(teamname,playername,runs,balls,fours,sixes,sr,oppteamname,venue,date,result){
    let teampath = path.join(__dirname,"ipl", teamname);
    dirCreator(teampath);
    let filePath = path.join(teampath, playername +".xlsx");
    let content = excelreader(filePath,playername);
    let playerobj = {
        teamname,
        playername,
        runs,balls,fours,sixes,sr,
        oppteamname,
        venue,date,
        result
    }
    content.push(playerobj);
    excelwriter(filePath,content,playername);


}
function dirCreator(filePath){
    if(fs.existsSync(filePath)==false){
        fs.mkdirSync(filePath);
    }
}
function excelwriter(filePath, json, sheetname){
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB,newWS,sheetname);
    xlsx.writeFile(newWB,filePath);
}

function excelreader(filePath,sheetname){
    if (fs.existsSync(filePath)==false){
        return [];
    }
    let WB = xlsx.readFile(filePath);
    let exceldata = WB.Sheets[sheetname];
    let ans = xlsx.utils.sheet_to_json(exceldata);
    return ans;

}
module.exports ={
    ps : processscorecrd
}