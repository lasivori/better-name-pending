var gamepage = '';

gamepage = document.getElementById("data").dataset.gamedata;
gamepage = JSON.parse(gamepage.split("_").join(" "));

var gamepageBody = document.getElementById("container");

var path = encodeURIComponent(gamepage.gamefile.toLowerCase().replace(/[^a-z0-9 _-]+/gi, '-'));

var content = `
	<h2 id="title" class="mt-4">${gamepage.title}</h2>
	<hr>
	<div class="d-flex">
		<img class="img-fluid img-thumbnail w-50" src="/public/assets/randomgame.PNG">
		<p class="px-2">
			Description:
			<br> ${gamepage.description}
		</p>
	</div>
	<br>
	<div class="d-flex">
		More Images:
		<div>
			<img class="img-fluid img-thumbnail w-25" src="/public/assets/randomgame.PNG">
			<img class="img-fluid img-thumbnail w-25" src="/public/assets/randomgame.PNG">
			<img class="img-fluid img-thumbnail w-25" src="/public/assets/randomgame.PNG">
		</div>
	</div>

	<form action="/downloadgame/?path=${path}&author=${gamepage.author}" method="POST">
		<button> DOWNLOAD </button>
	</form>
`

gamepageBody.insertAdjacentHTML('afterbegin', content);

var reviews = document.getElementById("reviews");

for(let review of gamepage.reviews.contents){
	addReview(review);
}

function addReview(review) {
	var reviewHTML = `
		<div class="row border-start border-dark border-2 m-2">
			<div class="w-25 text-center">
				<img class="img-fluid img-thumbnail float-begin" src="/public/assets/profilepic.PNG">
				<p class="text-muted">	${review.author} </p>
			</div>
			<div class="border w-75">
				<!-- timestamp -->
				<p class="border-bottom"> ${review.date} </p>
				<p> ${review.content} </p>
			</div>
		</div>
	`

	reviews.insertAdjacentHTML('afterbegin', reviewHTML);
}