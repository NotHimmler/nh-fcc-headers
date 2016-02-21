var express = require('express')
var fs = require('fs')

var app = express()
app.use(express.static('static'))

app.get('/',function(req,res){
	fs.createReadStream('index.html').pipe(res)
})

app.get('/api', function(req,res){
    var address = req.ips;
    
    if (address.length === 0){
        address = req.ip;
    }
    
    var user = extractOS(req.headers['user-agent']);
    var lang = extractLang(req.headers['accept-language']);
    
    var result = { 'ipaddress':address,'software':user,'language':lang };
    res.end(JSON.stringify(result))
})

function extractOS(string){
    var regex = new RegExp(/\(/);
    var first = string.search(regex);
    regex = new RegExp(/\)/);
    var second = string.search(regex);
    
    if (first > -1 && second > -1) {
        return string.substring(first+1,second-1);
    } else {
        return null;
    }
}

function extractLang(string){
    var comma = string.search(new RegExp(/,/))
    
    if (comma > -1) {
        return string.substring(0,comma);
    } else {
        return null
    }
}

app.listen(5000,function(){
	console.log("Server listening on port 5000")
})