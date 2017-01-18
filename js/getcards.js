var cardList = [];

function getCardList() {
	cardList = [];

	return $.getJSON("res/cards.json", function(data) {
		for(i = 0; i < data.cards.length; i++) {
			cardList.push(data.cards[i]);
		}
		console.log("Read " + cardList.length + " cards");
	});
}

function getCardListFromUrl(url) {
	var getCardPages = $.getJSON(getYqlFromUrl(url), function(data) {
		for(i = 0; i < data.cards.length; i++) {
			var card = {};
			card.id = data.cards[i].id;
			card.title = data.cards[i].title;
			cardList.push(card);
		}
		console.log("Downloaded " + cardList.length + " cards");
	});

	// $.when(getCardPages).done(function() { // Wait until the inital page query is done before checking the indivial card info queries
	// 	$.when.apply($, jsonRequests).done(function() {
	// 		displayCards();
	// 	});
	// });
}

function getYqlFromUrl(url) {
	return "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D'" + 
		encodeURIComponent(url) + "'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
}

function getCardFromTitle(title) {
	for(i = 0; i < cardList.length; i++) {
		if(cardList[i].title == title) {
			return cardList[i];
		}
	}
}