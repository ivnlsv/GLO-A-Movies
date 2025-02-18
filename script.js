document.addEventListener('DOMContentLoaded', async () => {
	const movieFilter = document.getElementById('movieFilter');
	const cardsBlock = document.getElementById('heroCards');

	const renderHeroes = (heroes) => {
		cardsBlock.innerHTML = '';
		heroes.forEach((hero) => {
			const card = document.createElement('div');
			card.classList.add('hero-card');
			card.innerHTML = `
                <img src="${hero.photo}" alt="${hero.name}">
                <h2>${hero.name}</h2>
                <p><strong>Актер / Актриса:</strong> ${hero.actors}</p>
                <p><strong>Фильмы:</strong> ${hero.movies}</p>
                <p><strong>Статус:</strong> ${hero.status}</p>
            `;
			cardsBlock.appendChild(card);
		});
	};

	const getData = async () => {
		try {
			const response = await fetch('./dbHeroes.json');
			if (!response.ok) {
				throw new Error('Ошибка сети');
			}
			return await response.json();
		} catch (error) {
			console.error('Ошибка загрузки данных:', error);
			return [];
		}
	};

	const data = await getData();
	const movies = new Set();

	data.forEach((hero) => {
		if (Array.isArray(hero.movies)) {
			hero.movies.forEach((movie) => movies.add(movie));
		} else {
			console.log(`У героя "${hero.name}" нет списка фильмов.`);
		}
	});

	movies.forEach((movie) => {
		const option = document.createElement('option');
		option.value = movie;
		option.textContent = movie;
		movieFilter.appendChild(option);
	});

	renderHeroes(data);

	movieFilter.addEventListener('change', (e) => {
		const selectedMovie = e.target.value;
		cardsBlock.innerHTML = '';
		const filteredHeroes =
			selectedMovie === 'all'
				? data
				: data.filter(
						(hero) =>
							Array.isArray(hero.movies) && hero.movies.includes(selectedMovie)
				  );

		renderHeroes(filteredHeroes);
	});
});
