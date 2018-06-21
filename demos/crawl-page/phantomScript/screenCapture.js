var page = require('webpage').create();

page.viewportSize = {
	width: 768,
	height: 1000
};

page.onLoadFinished = function() {
    console.log("page.onLoadFinished");

    // var ua = page.evaluate(function() {
    // 	window.scrollTo(0, document.body.scrollHeight);
    // });

    // console.log('ua', ua);
    setTimeout(function () {
    	page.evaluate(function() {
	    	window.scrollTo(0, document.body.scrollHeight);
	    });
	    page.render('36kr.png');
	    phantom.exit();
	}, 3000)
};

page.open('http://36kr.com/', function() {

	// phantom.exit();
});