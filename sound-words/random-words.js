fetch('words.json')
    .then(response => response.json())
    .then(data => {
        const words = data.words;

        const getRandomWord = () => {
            const randomIndex = Math.floor(Math.random() * words.length);
            return words[randomIndex];
        };

        console.log('Random Word:', getRandomWord());
    })
    .catch(error => {
        console.error('Error fetching the JSON file:', error);
    });
