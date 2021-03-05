# TheReStreamer

### requirements
 * nodejs

### install
```
git clone http://git.rsnet.sk:3000/RSNET/TwitchGrab
npm install
```

### prepare

editacia parametrov v appconfig.json **streamId** z url Napriklad z: https://www.twitch.tv/videos/905126438


### run
``node trs.js``

### Stream Tweak

### linux specific buffers optimization
```
sudo sysctl -w net.core.rmem_max=26214400
sudo sysctl -w net.core.wmem_max=26214400
```

### ffmpeg 

```
   "outputUrl":"udp://239.1.70.50:1234?localaddr=10.111.112.112&ttl=128&pkt_size=1316&fifo_size=1000000&overrun_nonfatal=1&buffer_size=26214400",
{
   "debug": true,
   "FFMPEG_PATH":"D:/ffmpeg-20190529-d903c09-win64-static/bin/ffmpeg.exe",
   "streamId":"905126438",
   "outputUrl":"udp://239.1.70.50:1234?localaddr=10.111.112.112&ttl=128&pkt_size=1316&fifo_size=1000000&overrun_nonfatal=1&buffer_size=26214400",
   "inputOptions":[
      "-re",
      "-v","verbose",
      "-stream_loop","-1"
   ],
   "outputOptions":[
      "-c:v","copy",
      "-c:a","copy",
      "-maxrate","8000k",
      "-bufsize","16000k",
      "-metadata","service_provider=\"RSNET\"",
      "-metadata","service_name=\"WTCR-League\"",
      "-f","mpegts"
   ]
```

### TODO ###
tu toho este bude ;)
