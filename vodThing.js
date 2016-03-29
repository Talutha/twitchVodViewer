var exec = require('child_process').exec;
var cmd = 'livestreamer https://secure.twitch.tv/summit1g/v/57029754 source --player-passthrough hls';

exec(cmd, function(error, stdout, stderr) {
    if (error) console.error(error);
});