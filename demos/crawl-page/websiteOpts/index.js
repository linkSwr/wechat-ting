const $ = require('cheerio');

const result = {};

result[Symbol.for('36kr.com/p')] = {
	pageType: 'detail',
	pageParser: (html, url) => {
		return {
			title: html.find('.mobile_article h1').text(),
			url: url,
			content: html.find('.textblock').text()
		};
	}
};

// 校验当前地址是否为一个完整的规范的地址
// 如果不是的话就通过host补全
function urlParser(proto, hostname, href) {
	if (!~href.indexOf(`${proto}://${hostname}`)) {
		return `${proto}://${hostname}${href}`;
	}

	return href;
}

result[Symbol.for('36kr.com')] = {
	pageType: 'listPage',
	pageParser: (html, url) => {
		// 获取banner地址list
		let banners = [];
		Array.prototype.forEach.call(html.find('.banner_cell'), item => {

			let href = urlParser('https', '36kr.com', $(item).find('a').attr('href'));

			banners.push({
				href: href,
				title: $(item).find('.abstract').text()
			})
		});

		let detailList = [];
		Array.prototype.forEach.call(html.find('.inner_li > a'), item => {
			let href = urlParser('https', '36kr.com', $(item).attr('href'));

			detailList.push({
				href: href,
				title: $(item).find('h3').text()
			})
		});

		return banners.concat(detailList);
	},
	// pageParser: (html, url) => {
	// 	// 获取列表页的地址列表
	// 	return {
	// 		title: html.find('.mobile_article h1').text(),
	// 		url: url,
	// 		content: html.find('.textblock').text()
	// 	};
	// }
};

module.exports = result;