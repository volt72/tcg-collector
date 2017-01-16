var session = require('electron').remote.session;

loadCollection();

var cardCollection = [];

function loadCollection() {
	// try cookie with url 'file://'
	var cookie = {
		url: "github.io/",
		name: "testcookie",
		value: "ilovecookies"
	}
	session.defaultSession.cookies.set(cookie, (error) => {
		if(error) console.error(error);
	});
	console.log(session.defaultSession.cookies);
}

function addToCollection(title) {
	var card = getCardFromTitle(title);
	cardCollection.push(card);
	updateCollectionBadge();
}

function updateCollectionBadge() {
	$("#collection-badge").html(cardCollection.length);
}