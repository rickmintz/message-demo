var loopHandle = null;

// The messageSystem object is where you should do all of your work
// Use any combination of javascript, HTML and CSS that you feel
// is appropriate
messageSystem = {
	// Counter of messages shown (used to uniquely identify each message)
	counter: 0,
	// Array of the messages currently being shown
	msgs: [],
    showMessage: function(msg) {
	
		// Create a box at the top of the page to hold our messages
		var messageBoxId = "messageBox";
		if (this.counter == 0) {
			// Create a box pegged to the top right to keep it as much out of the way as possible.
			// Set its opacity to handle cases when it potentially overwrites page content.
			var messageBox = '<div id="' + messageBoxId + '" style="position:absolute;top:12px;right:12px;background:rgb(54, 25, 25);background:rgba(54, 25, 25, .5);"></div>';
			$(document.body).prepend(messageBox);
		}
		
		// Add the new message to the message box, but below all messages already showing.
		
		this.counter++;
		var divId = "div" + this.counter;
		var spanId = "span" + this.counter;
		var btnId = "btn" + this.counter;
		var newElement = '<div id="' + divId + '" style="display:none;margin-left:auto;margin-right:auto;border:1px solid; width:800px;overflow:hidden;">' +
			'<span id="' + spanId + '" style="width:600px;float:left">' + msg + '</span>' +
			'<button id="' + btnId + '"  style="float:right" onclick="messageSystem.clearMessage(event.target.parentNode)">Delete</button></div>';
		if (this.msgs.length == 0) {
			$("#" + messageBoxId).prepend(newElement);
		} else {
			var lastMsg = _.last(this.msgs);
			$("#" + lastMsg).after(newElement);
		}
		// Keep track of the new bottom most message and set a timer so that it'll fade-out after showing for 3 seconds
		this.msgs.push(divId);
		$("#" + divId).slideDown('slow');
		setTimeout(messageSystem.fadeOutMessage, 3000, this.counter);
	},
	fadeOutMessage: function(idCounter) {
		// When the timer goes off, begin the fade-out of the message (this will be a no-op if it was already deleted) and
		// then clear it once the fade out completes (also fade out the delete button as the message clears)
		var divId = "div" + idCounter;
		var spanId = "span" + idCounter;
		var btnId = "btn" + idCounter;
		$("#" + spanId).fadeOut(2000, function() {
 		  $("#" + btnId).fadeOut(2000);
		  $("#" + divId).slideUp(1000, function() {
			  messageSystem.clearMessage(this);
		  })
		});
    },
	
    clearMessage: function(divElement) {
		// Either the user requested that the message get deleted or it has faded out, so take it out of the DOM tree
		// and from our list of messages being shown.
		var index = _.indexOf(this.msgs, divElement.id);
		if (index != -1) {
			this.msgs.splice(index, 1);
		}
		divElement.remove();
	},
	
    clearAllMessages: function() {
		// Called when the user asks to stop messages.
		// This will immediately delete all remaining visible messages.
		for (var i = 0; i < this.msgs.length; i++) {
			$("#" + this.msgs[i]).remove();
		}
		this.msgs = [];
	}	
}



function showMsg() {
    quotes = [
    "What we've got here is failure to communicate.",
    'Go ahead, make my day.',
    "I've got a bad feeling about this.",
    "I don't know half of you half as well as I should like; and I like less than half of you half as well as you deserve.",
    "I find your lack of faith disturbing.",
    "You're gonna need a bigger boat.",
    "Tell Mike it was only business.",
    "I have come here to chew bubble gum and kick ass, and I'm all out of bubble gum."
    ];
    messageSystem.showMessage(_.sample(quotes));
    
}

function loop() {
    showMsg();
    var rand = Math.round(Math.random() * (3000 - 500)) + 500;
    loopHandle = setTimeout(loop, rand);
}


$(function() {
   $('#msgButton').click(function() {
       var btn = $(this),
      btnTxt = btn.text();
       if (btnTxt === 'Start Messages') {
           btn.text('Stop Messages');
           loopHandle = setTimeout(loop, 500);
       } else {
           btn.text('Start Messages');
           clearTimeout(loopHandle);
           loopHandle = null;
		   messageSystem.clearAllMessages();
       }
   } );
});
