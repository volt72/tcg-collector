var sectionSelected = 0;
var deckSelected = undefined;
var numberSections = 5;

$(document).ready(function() {
	// removeCookie("card_collection");
	$('#search-form').submit(function() {
		try {
			searchForCards(1);
		} catch(e) {
			console.log("Error", e.stack);
    		console.log("Error", e.name);
    		console.log("Error", e.message);
		}
		return false;
	}).on('focus', 'input', function() {
		this.select();
	})

	$('#sort-select').on('change', function() {
		searchForCards(1, $('search-form').val());
	});

	$.when(getCardList()).done(function() {
		loadCollection();
		// loadDecks();
		changeSection(0);
	});

	// getAllCookies((error, cookies) => {
	// 	console.log(cookies);
	// })
});

function changeSection(i) {
	sectionSelected = i;
	for(var s = 0; s < numberSections; s++) {
		$("#list-section" + s).removeClass("active");
		$("#cards-container" + s).css("display", "none");
	}
	$("#list-section" + i).addClass("active");
	$("#cards-container" + i).css("display", "");

	// if(i == 2) {
	// 	deckSelected = undefined;
	// }

	if(i == 3) {
		$('#cards-container3').html(getStatisticsHtml());
	} else if(i == 4) {
		// $('#cards-container4').html('About page');
	} else {
		$('#search-box').val(searchSection[i]);
		searchForCards(1);
	}
}

function getStatisticsHtml() {
	var html = "";

	html += 'Total cards in collection: ' + cardCollection.length + '<br>';

	html += 'Unique cards: ' + getNumberUniqueCards() + '<br>';

	var monster = 0, spell = 0, trap = 0;
	for(var i = 0; i < cardCollection.length; i++) {
		if(cardCollection[i].card.attribute == "Spell") {
			spell++;	
		} else if(cardCollection[i].card.attribute == "Trap") {
			trap++;
		} else {
			monster++;
		}
	}

	html += 'Monster cards: ' + monster + '<br>';
	html += 'Spell cards: ' + spell + '<br>';
	html += 'Trap cards: ' + trap + '<br>';

	html += 'Total collection value: <span id="prices-total">...</span><br>';

	getCollectionPrice();

	return html;
}

function clearSearchBox() {
	$('#search-box').val("");
	searchForCards(1);
}