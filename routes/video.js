var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/video', function(req, res) {
  console.log('first');
  const path = 'videos/SampleVideo_720x480_30mb.mp4'
  console.log('second');
  var stat;
  try {
    stat = fs.statSync(path)
  } catch (err) {
    console.log(err);
  }

  console.log('third');
  const fileSize = stat.size
  const range = req.headers.range
  console.log('fourth');
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    console.log('obj');
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
});

module.exports = router;
