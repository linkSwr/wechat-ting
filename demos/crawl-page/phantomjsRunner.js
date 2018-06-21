var page = require('webpage').create(),
  system = require('system'),
  t, address;

if (system.args.length === 1) {
    // console.log('Usage: loadspeed.js <some URL>');
    phantom.exit();
}

address = system.args[1];
phantom.outputEncoding = "utf-8";
page.open(address, function(status) {
    if (status === 'success') {
        // 通过这种方式给父进程发送数据
        console.log(page.frameContent);
    }

    phantom.exit();
});