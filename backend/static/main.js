async function loadHighscores() {

  const container = document.querySelector('.highscore__container');
    const res = await fetch('/api/highscore');
    const data = await res.json();

    data.forEach((result) => {
      const listItem = document.createElement('li');
      listItem.className = 'highscore__item';
      listItem.textContent = `User - ${result.user} -
                              Time: ${result.time}s -
                              Attempts: ${result.attemps} -
                              Length: ${result.length} -
                              Unique: ${result.unique}`;
      container.appendChild(listItem);
    });
}

loadHighscores();