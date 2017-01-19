var sectionSelected = 0;
var numberSections = 4;

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
	// for(var d = 0; d < 3; d++) {
	// 	$("#list-section2-" + d).removeClass("active");
	// }
	$("#list-section" + i /*+ (i == 2 ? "-" + deckSelected : "")*/).addClass("active");
	$("#cards-container" + i).css("display", "");

	if(i == 0) $('#search-box').val(searchDatabase);
	if(i == 1) $('#search-box').val(searchCollection);

	searchForCards(1);
}

function clearSearchBox() {
	$('#search-box').val("");
	searchForCards(1);
}