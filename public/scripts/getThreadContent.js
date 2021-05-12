// var id = window.location.pathname.slice(8);
// var thread = threads.find(t => t.id == id);

var thread = '';

thread = document.getElementById("data").dataset.threaddata;
thread = JSON.parse(thread.split("_").join(" "));

var threadStart = document.getElementById("threadStart");


var commentCount = 0;
for(let comment of thread.comments){
	commentCount++;
	replyCount(comment);
}

function replyCount(comment) {
	if (comment.comments) {
		for (let reply of comment.comments) {
			commentCount++;
			replyCount(reply)
		}
	}
}

// need to figure out how to get image data for profile pic
var threadStartHTML = `
	<h2 id="title" class="mt-4">${thread.title}</h2>
	<hr>
	<div class="d-flex">
		<!-- comment count -->
		<p class="mx-2">
			${commentCount} comments
		</p>
		<!-- timestamp -->
		<p class="ml-auto mr-3">
			${new Date(thread.date).toLocaleString()}
		</p>
	</div>
	<div class="row border m-2">
		<div class="w-25 text-center">
			<img class="img-fluid img-thumbnail float-left" src="/public/assets/profilepic.PNG">
			<p class="text-muted"> ${thread.author} </p>
		</div>
		<p class="border w-75">
			${thread.content}
		</p>
	</div>
`

threadStart.insertAdjacentHTML('beforeend', threadStartHTML);

function addComment(comment) {
	var commentHTML = `
	<div id="comment-${comment.id}" class="row border-start border-dark border-3 m-2">
		<div class="w-25 text-center">
			<img class="img-fluid img-thumbnail float-left" src="/public/assets/profilepic.PNG">
			<p class="text-muted"> ${comment.author} </p>
		</div>
		<div class="border w-75">
			<p class="border-bottom"> ${new Date(comment.date).toLocaleString()}
			<p>
				${comment.content}
			</p>
			<button class="btn btn-primary btn-sm float-end" type="button" data-toggle="collapse" data-target="#collapse-${comment.id}"> reply </button>
		</div>
		<div class="collapse" id="collapse-${comment.id}">
			<form action='/addreply' method='POST'>
				<input type="hidden" name="thread_id" value=${thread.id}>
				<input type="hidden" name="parent_id" value=${comment.id}>
				<textarea class="w-100" name="text" placeholder="Want to reply? Type it here!"></textarea>
				<button class="btn btn-primary btn-sm float-end" type="submit"> submit </button>
			</form>
		</div>
	</div>
	`

	comments.insertAdjacentHTML('beforeend', commentHTML);
}

var comments = document.getElementById("comments");
for(let comment of thread.comments) {
	addComment(comment);
	addNested(comment);
}

function addNested(comment){
	if(comment.comments) {
		var replies = document.getElementById(`comment-${comment.id}`);
		for(let reply of comment.comments) {
			addReply(replies, reply);
			addNested(reply);
		}
	}
}

function addReply(parent, reply) {
	var replyHTML = `
	<div id="comment-${reply.id}" class="row border-start border-dark border-3 m-2">
		<div class="w-25 text-center">
			<img class="img-fluid img-thumbnail float-left" src="/public/assets/profilepic.PNG">
			<p class="text-muted"> ${reply.author} </p>
		</div>
		<div class="border w-75">
			<p class="border-bottom"> ${new Date(reply.date).toLocaleString()}
			<p>
				${reply.content}
			</p>
			<button class="btn btn-primary btn-sm float-end" type="button" data-toggle="collapse" data-target="#collapse-${reply.id}"> reply </button>
		</div>
		<div class="collapse" id="collapse-${reply.id}">
		<form action='/addreply' method='POST'>
			<input type="hidden" name="thread_id" value=${thread.id}>
			<input type="hidden" name="parent_id" value=${reply.id}>
			<textarea class="w-100" name="text" placeholder="Want to reply? Type it here!"></textarea>
			<button class="btn btn-primary btn-sm float-end" type="submit"> submit </button>
		</form>
		</div>
	</div>
	`

	parent.insertAdjacentHTML('beforeend', replyHTML);
}

// var addBtn = document.getElementById("submitComment");
// addBtn.addEventListener("click", function() {
// 	var txt = document.getElementById("commentTxt");
// 	var comment = {
// 		id: commentCount + 1,
// 		content: txt.value,
// 		date: Date.now(),
// 		author: 'This User',
// 		comments: []
// 	}

// 	addComment(comment);
// 	txt.value = '';
// 	thread.comments.push(comment);
// 	localStorage.setItem('threads', JSON.stringify(threads));
// 	window.location.reload();
// })
	
function replyFunction(element) {
	var txt = element.parentElement.firstElementChild;
	var comment = {
		id: commentCount + 1,
		content: txt.value,
		date: Date.now(),
		author: 'This User',
		comments: []
	}

	addReply(element.parentElement.parentElement, comment);
	txt.value = '';
	
	// need to figure out how to get reply to where it should be in json...
	// it being able to nest makes this difficult...
	var i = 0;
	thread.comments[i].comments.push(comment)
}
