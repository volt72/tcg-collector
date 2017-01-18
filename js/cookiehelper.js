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
		Cookies.set(name, value, { domain: cookieUrl });
	}
}

function getCookie(name, callback) {
	if(session != undefined) {
		session.defaultSession.cookies.get({ url: cookieUrl, name: name }, callback);
	} else {
		callback(undefined, Cookies.get(name, { domain: cookieUrl }))
	}
}

function getAllCookies(callback) {
	if(session != undefined) {
		session.defaultSession.cookies.get({ url: cookieUrl }, callback);
	} else {
		callback(undefined, Cookies.get({ domain: cookieUrl }))
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