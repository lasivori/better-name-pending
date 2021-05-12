var container = document.getElementById("thread-list");

for (let thread of threads) {
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
	var html = `
	<li class="row border m-2">
		<!-- title -->
		<a class="text-dark text-decoration-none" href="/thread/${thread.id}">
			<h4>${thread.title}</h4>
		</a>
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
	</li>
	`

	container.insertAdjacentHTML('beforeend', html);
}