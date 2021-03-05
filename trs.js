var fs = require('fs');
var path = require('path');
const twitch = require("twitch-m3u8");
const nconf = require("nconf");
var FfmpegCommand = require('fluent-ffmpeg');
const ytdl = require('ytdl-core');

// config variables
// const config = require('./config.js');
nconf.file({
    file: 'appconfig.json'
});

// for windows users u need to setup correct full path to ffmpeg executable if it's not in PATH reach.
process.env['FFMPEG_PATH'] = nconf.get('FFMPEG_PATH');

var input = nconf.get('input');
var inputOptions = input.inputOptions;
var output = nconf.get('output');
var outputOptions = output.outputOptions;
var outputUrl = output.outputUrl;
var debug = nconf.get('debug');
/*
console.log(outputUrl);
process.exit(1);
*/

function runStream(streamUrl) {

    var ffmpeg = new FfmpegCommand().input(streamUrl).inputOptions(inputOptions).outputOptions(outputOptions).output(outputUrl)
        .on('start', function(commandLine) {
            console.log('Spawned Ffmpeg with command:\n\n' + commandLine);
        })
        .on('stderr', function(stderrLine) {
            if (debug)
                console.log('FFMPEG Stderr output: ' + stderrLine);
        });

    ffmpeg.run();

}


if (input.type == "twitch-vod") {
    var streamId = input.streamId;
    console.log("Getting stream for twitch VOD id " + streamId);
    // returns a JSON object containing available streams of a VOD
    twitch.getVod(streamId)
        .then(data => {
            console.log("Got info about stream");
            //		console.log(data);
            var selectedStream = data[0];
            console.log("Selecting TOP quality: " + selectedStream.quality + " @ " + selectedStream.resolution);
            console.log(selectedStream.url);
            runStream(selectedStream.url);
        })
        .catch(err => {
            console.error("!!!!!!!!!!!! Unable to get TWITCH video stream !!!!!!!!!!!!!");
            console.error(err);
        });
} else if (input.type == "twitch-live") {
    var streamId = input.streamId;
    console.log("Getting stream for twitch LIVE id " + streamId);
    // returns a JSON object containing available streams of a VOD
    twitch.getStream(streamId)
        .then(data => {
            console.log("Got info about stream");
            //		console.log(data);
            var selectedStream = data[0];
            console.log("Selecting TOP quality: " + selectedStream.quality + " @ " + selectedStream.resolution);
            console.log(selectedStream.url);
            runStream(selectedStream.url);
        })
        .catch(err => {
            console.error("!!!!!!!!!!!! Unable to get TWITCH video stream !!!!!!!!!!!!!");
            console.error(err);
        });
} else if (input.type == "youtube") {
    console.log("YOUTUBE Work in progress");
    var streamId = input.streamId;
    ytdl.getInfo(streamId).then(info => {
            console.log("Got info about stream");
            console.log('title:', info.videoDetails.title);
            console.log('rating:', info.player_response.videoDetails.averageRating);
            console.log('uploaded by:', info.videoDetails.author.name);
            console.log(info.player_response.streamingData.hlsManifestUrl);
            //		console.log(info);
            var selectedStream = "";
            if (info.player_response.streamingData.hasOwnProperty('hlsManifestUrl')) {
                console.log("Found HLS m3u8 streaming format");
                selectedStream = info.player_response.streamingData.hlsManifestUrl;
                runStream(selectedStream);
            } else if (info.player_response.streamingData.hasOwnProperty('dashManifestUrl')) {
                console.log("Found DASH streaming format");
                selectedStream = info.player_response.streamingData.dashManifestUrl;
                runStream(selectedStream);
            }
            //		console.log("Selecting TOP quality: "+selectedStream.quality+" @ "+selectedStream.resolution);
            //		runStream(selectedStream);
        })
        .catch(err => {
            console.error("!!!!!!!!!!!! Unable to get Youtube video stream !!!!!!!!!!!!!");
            console.error(err);
        });


} else {
    console.log("Unknown input type - ".input.type);
}
