let userChat = document.getElementById("chatInput");

const responses = [

	"How are you?",
	"How was your day?",
	"What emotions are coming up for you lately?",
	"How are you coping at the moment?",
	"In terms of your emotional behavior, how would you describe yourself?",
	"What is your mood right now? Why?", 
	"Describe your emotions these past couple of days. How have you been feeling?"

];
	

const transitions = ["Ok. ", "Alright. ", "Oh. ", "I see. ", "Oh alright. ", "Interesting. "];

function scrollIntoView() {
	document.getElementById("scrollAnchor").scrollIntoView();
}

function addUserChat(text) {
	$("#scrollAnchor").before(`<div class="userChat">${text}</div> <br>`);
	/*
	var userchatDiv = document.createElement('div');
	userchatDiv.classList.add('userChat');
	userchatDiv.innerText = text;
	$("#scrollAnchor").before(document.createElement('div').appendChild(userchatDiv));
	*/
	scrollIntoView();
}

function addBotChat(text) {

	$("#scrollAnchor").before(`<div class="botchat">${text}</div> <br>`);
	/*
	var botchatDiv = document.createElement('div');
	botchatDiv.classList.add('botchat');
	botchatDiv.innerText = text;
	$("#scrollAnchor").before(document.createElement('div').appendChild(botchatDiv));
	*/
	scrollIntoView();
}

function respondToChat(query) {
	// $.get(`/query?chat=${query}`, function(data) {
	// 	addBotChat(data);
	// });
}

function escapeHTML(text) {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}
let lastQuestion = "";
let inputText="";

userChat.addEventListener("keyup", function(event) {
	if (event.key == 'Enter' || event.code == 'Enter') {
		event.preventDefault();

		const chatText = userChat.value;

		//escapeHTML strips out all the bad stuff (to avoid xss)
		addUserChat(escapeHTML(chatText))
		inputText += chatText+' ';

		if (inputText.length >= 100){

			fetch("/", {
     
				// Adding method type
				method: "POST",
				// Adding body or contents to send
				body: JSON.stringify( {'body': inputText} ),
				
				// Adding headers to the request
				headers: {
					"Content-type": "application/json; charset=UTF-8"
				}
			})
 
			// Converting to JSON
			.then(response => response.json())
			
			// Displaying results to console
			.then(json => {
				console.log(json)
				window.location.href = `/results.html?disease=${JSON.stringify(json)}`;
			});


		} else{
			const randQuestion = responses[Math.floor(Math.random() * responses.length)];
			const randTransition = transitions[Math.floor(Math.random() * transitions.length)];
			
			if (randQuestion !== lastQuestion){
				addBotChat(randTransition+randQuestion);
				lastQuestion=randQuestion;
			}
			else{
				addBotChat(randTransition+"Can you elaborate more?");
			}
			setTimeout(
				function() {
					respondToChat(
						chatText.toLowerCase()
							.replace(/[^A-Z0-9\s]/ig, "")
							.replace(/\s+/g, " ")
							.trim()
					);
				}, 500)
	
	
			userChat.value = "";
		}



	}
});

setTimeout(
	function() {
		addBotChat("How are you?");
	}, 500);
