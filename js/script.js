var exec = require('child_process').exec;
var moment = require('moment');
var streamLink = "https://secure.twitch.tv/summit1g/v/57029754"
var cmd = 'livestreamer ' + streamLink + ' source --player-passthrough hls';
var testLink = document.getElementById('streamLink');
var nextList = document.getElementById('nextList');
var vod = document.querySelectorAll('.vod');
var nextListLink = '';
var prevListLink = null;
var kraken = 'https://api.twitch.tv/kraken/channels/'
var searchContents = 'summit1g'
var urlEnd = '/videos?limit=12&broadcasts=true&callback=?'
var jsonLink = kraken + searchContents + urlEnd
var vodList = document.getElementById('vodList');

// Add ability to grab JSON from the Twitch API
function getJSONP(url, success) {
    
    var ud = '_' + +new Date,
        script = document.createElement('script'),
        head = document.getElementsByTagName('head')[0] || document.documentElement;
    
    window[ud] = function(data) {
        head.removeChild(script);
        success && success(data);
    };
    
    script.src = url.replace('callback=?', 'callback=' + ud);
    head.appendChild(script);
}

function keyPress(event) {
    
    if (window.event) {
        return event.keyCode;
    }
    
}

function searchStreamer(event) {
    var searchForm = document.getElementById('searchBox');
    
    if (keyPress(event) === 13) {
        searchContents = searchForm.value;
        jsonLink = kraken + searchContents + urlEnd;
        jsonData();
        return false;
    }
    
}

// Shortcut function to append HTML into tags.
function appendInner(tag, data) {
    tag.innerHTML = tag.innerHTML + data;
}

// Grab JSON information from Twitch then send it to fillList to populate the VOD list.
function jsonData() {
    getJSONP(jsonLink, function(data) {
        fillList(data);
    });
}

// Process the JSON from Twitch and fill the list with VOD links.
function fillList(data) {
    // Clear HTML from vodlist div so that we may start fresh on each press of next and prev.
    vodList.innerHTML = "";
    if (data.error === "Not Found") appendInner(vodList, data.status + ' - ' + data.message);
    if (data._links.prev !== undefined) {
        prevListLink = data._links.prev + '&callback=?';
    } else {
        prevListLink = null;
    }
    nextListLink = data._links.next + '&callback=?';
    for (var x = 0; x < data.videos.length; x++) {
        var date = moment(data.videos[x].created_at).format('MMMM D, YYYY');
        var fullTitle = data.videos[x].title;
        var title = shortenTitle(fullTitle);
        appendInner(vodList,
                    '<div class="vodHolder"><a class="vod" href="' + data.videos[x].url + '" title="' + fullTitle + '"><img src=' + data.videos[x].preview + ' width=250 height=auto><br>' + title + '</a><br>' + date + '</div>') 
    }
    vod = document.querySelectorAll('.vod');
    for (var i = 0; i < vod.length; i++){
        vod[i].addEventListener("click", vodClick, false);
    }
}

function shortenTitle(title) {
    if (title.length > 32) {
        return title.slice(0,31) + '...';
    }
    return title;
}

nextList.onclick = function() {
    getJSONP(nextListLink, function(data) {
        fillList(data);
    })
    return false;
}

prevList.onclick = function() {
    if (prevListLink !== null) {
        getJSONP(prevListLink, function(data) {
            fillList(data);
        })
        return false;
    }
}

function vodClick(event) {
    streamLink = this.getAttribute('href');
    cmd = 'livestreamer ' + streamLink + ' source --player-passthrough hls';
    console.log(this.getAttribute('href'));
    console.log('Executing Command: ' + cmd);
    exec(cmd, function(error, stdout, stderr) {
        if (error) console.error(error);
    });
    event.preventDefault();
}
