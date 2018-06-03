var page = require('webpage').create(),
  system = require('system'),
  t, address;
// var websiteOpts = require(phantom.libraryPath + '/websiteOpts.js');
// var {URL} = require('url');

if (system.args.length === 1) {
  console.log('Usage: loadspeed.js <some URL>');
  phantom.exit();
}

t = Date.now();
address = system.args[1];
phantom.outputEncoding = "utf-8";
page.open(address, function(status) {
  if (status === 'success') {
    console.log(page.frameContent);
 //    console.log(page.evaluate(function(){
 //    	// let url = new URL(reqUrl);
 //    	// let opt = websiteOpts[Symbol.for('36kr.com/p')];
	//   // return opt.pageParser(document);
	//   return page.frameContent || document.body.innerText;
	// }));//输出网页标题
  } else {
    // t = Date.now() - t;
    // console.log('Loading ' + system.args[1]);
    // console.log('Loading time ' + t + ' msec');
  }
  phantom.exit();
});