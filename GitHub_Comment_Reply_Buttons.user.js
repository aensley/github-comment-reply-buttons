// ==UserScript==
// @name        GitHub Comment Reply Buttons
// @namespace   https://github.com/aensley/github-comment-reply-buttons
// @description Easily reply to comments on GitHub. Originally derived from "Github Reply Comments" by @jerone
// @author      aensley
// @license     GNU GPLv3
// @homepage    https://github.com/aensley/github-comment-reply-buttons/
// @homepageURL https://github.com/aensley/github-comment-reply-buttons/
// @downloadURL https://github.com/aensley/github-comment-reply-buttons/raw/master/GitHub_Comment_Reply_Buttons.user.js
// @updateURL   https://github.com/aensley/github-comment-reply-buttons/raw/master/GitHub_Comment_Reply_Buttons.user.js
// @supportURL  https://github.com/aensley/github-comment-reply-buttons/issues
// @version     1.0.0
// @icon        https://github.com/fluidicon.png
// @grant       none
// @include     https://github.com/*
// @include     https://gist.github.com/*
// ==/UserScript==
(function() {
	function getCommentTextarea(replyBtn) {
		var newComment = replyBtn;
		while (newComment && !newComment.classList.contains('js-quote-selection-container')) {
			newComment = newComment.parentNode;
		}

		if (newComment) {
			var lastElementChild = newComment.lastElementChild;
			lastElementChild.classList.add('open');
			newComment = lastElementChild.querySelector(".comment-form-textarea");
		} else {
			newComment = document.querySelector(".timeline-new-comment .comment-form-textarea");
		}

		return newComment;
	}

	function addReplyButtons() {
		Array.prototype.forEach.call(document.querySelectorAll(".comment"), function(comment) {
			var oldReply = comment.querySelector(".GithubReplyComments, .GithubCommentEnhancerReply");
			if (oldReply) {
				oldReply.parentNode.removeChild(oldReply);
			}

			var header = comment.querySelector(".timeline-comment-header"),
				actions = comment.querySelector(".timeline-comment-actions");
			if (!header) {
				return;
			}

			if (!actions) {
				actions = document.createElement("div");
				actions.classList.add("timeline-comment-actions");
				header.insertBefore(actions, header.firstElementChild);
			}

			var reply = document.createElement("button");
			reply.setAttribute("type", "button");
			reply.setAttribute("title", "Reply to this comment");
			reply.setAttribute("aria-label", "Reply to this comment");
			reply.classList.add("GithubReplyComments", "btn-link", "timeline-comment-action", "tooltipped", "tooltipped-ne");
			reply.addEventListener("click", function(e) {
				e.preventDefault();
				var newComment = getCommentTextarea(this),
					timestamp = comment.querySelector(".timestamp");
				newComment.value += (newComment.value.length > 0 ? "\n" : "")
					+ '_Replying to ' + timestamp.href + ' by @' + comment.querySelector(".author").textContent
					+ ':_\n\n';
				newComment.setSelectionRange(newComment.value.length, newComment.value.length);
				newComment.focus();
			});

			var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			svg.classList.add("octicon", "octicon-mail-reply");
			svg.setAttribute("height", "16");
			svg.setAttribute("width", "16");
			reply.appendChild(svg);
			var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
			path.setAttribute("d", "M6 2.5l-6 4.5 6 4.5v-3c1.73 0 5.14 0.95 6 4.38 0-4.55-3.06-7.05-6-7.38v-3z");
			svg.appendChild(path);
			actions.appendChild(reply);
		});
	}

	// init;
	addReplyButtons();

	// on pjax;
	document.addEventListener('pjax:end', addReplyButtons);
})();
