const result = {};

result[Symbol.for('36kr.com/p')] = {
	pageParser: (html, url) => {
		return {
			title: html.find('.mobile_article h1').text(),
			url: url,
			content: html.find('.textblock').text()
		};
	}
};

module.exports = result;