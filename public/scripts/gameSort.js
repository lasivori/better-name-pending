function search() {
	var input, keywords, container, games, i, title, txtValue;

	input = document.getElementById('search');
	keywords = input.value.toLowerCase();

	container = document.getElementById('game-container-row');
	games = container.getElementsByClassName('bg-secondary text-center col-sm-4');
	console.log(games);
	for (i = 0; i < games.length; i++) {
		title = games[i].getElementsByTagName('h5');
		txtValue = title[0].textContent || title[0].innerText;
		if(txtValue.toLowerCase().indexOf(keywords) > -1) {
			games[i].style.display = "";
		} else {
			games[i].style.display = "none";
		}
	}
}