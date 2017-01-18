console.log(window.process);

var session = undefined;
if(window.process != undefined && window.process.type == "renderer") {
	session = require('electron').remote.session;
}

var cookieUrl = "https://kianbennett.github.io/tcg-collector/";

function setCookie(name, value) {
	if(session != undefined) {
		session.defaultSession.cookies.set(
			{ url: cookieUrl, name: name, value: value, expirationDate: 2147483647 }, 
			(error) => {
				if(error) console.error(error);
			}
		);
	} else {
		expiryDate = new Date(new Date().getTime() + 2147483647);
		Cookies.set(name, value, { domain: cookieUrl, expires: expiryDate });
	}
}

function getCookie(name, callback) {
	if(session != undefined) {
		session.defaultSession.cookies.get({ url: cookieUrl, name: name }, callback);
	} else {
		var cookie = Cookies.get(name, { domain: cookieUrl });
		var cookies = [];
		if(cookie != undefined) cookies.push(cookie);
		callback(undefined, cookies);
	}
}

function getAllCookies(callback) {
	if(session != undefined) {
		session.defaultSession.cookies.get({ url: cookieUrl }, callback);
	} else {
		callback(undefined, [Cookies.get({ domain: cookieUrl })])
	}
}

function removeCookie(name) {
	if(session != undefined) {
		session.defaultSession.cookies.remove(cookieUrl, name, () => {});
	} else {
		Cookies.remove(name, { domain: cookieUrl });
	}
}

// Usage:
// getCookie("testcookie1", (error, cookies) => {
	// if(error) console.log(error);
// })