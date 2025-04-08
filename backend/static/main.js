async function loadHighscores() {

  const container = document.querySelector('.highscore__container');
    const res = await fetch('/api/highscore');
    const data = await res.json();

    const resultSorted = data.sort((a, b) => b.score - a.score);

    resultSorted.forEach((result, index) => {
      const listItem = document.createElement('li');
      listItem.className = 'highscore__item';

      if (index === 0) {
        listItem.classList.add('top1');
      }
      if (index === 1) {
        listItem.classList.add('top2');
      }
      if (index === 2) {
        listItem.classList.add('top3');
      }

      listItem.textContent = `${index+1}: ${result.user}: 
                              Score: ${result.score} -
                              Time: ${result.time}s -
                              Attempts: ${result.attemps} -
                              Length: ${result.length} -
                              Unique: ${result.unique}`;
      container.appendChild(listItem);
    });
}

loadHighscores();