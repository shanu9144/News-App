const apiKey = 'c0aa14167ad38b4b8707ec1c426f1c24'; // Your API key
const newsContainer = document.getElementById('news-container');
const searchInput = document.getElementById('search-input');
const languageSelect = document.getElementById('language');
const searchInSelect = document.getElementById('searchIn');
const fromInput = document.getElementById('from');
const toInput = document.getElementById('to');
const maxResults = 50; // Adjust this as needed

// Change background color on page load (lighter colors)
function getRandomColor() {
    const letters = 'BCDEF'; // Lighter color range
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}

function changeBackgroundColor() {
    document.body.style.backgroundColor = getRandomColor();
}

window.onload = async function () {
    changeBackgroundColor();
    loadNews(); // Load default news data on page load
};

// Load news with filters
async function loadNews() {
    const query = searchInput.value.trim() || "technology"; // Default to "technology" news
    const language = languageSelect.value || 'en';
    const searchIn = searchInSelect.value || 'title,description';
    const fromDate = fromInput.value;
    const toDate = toInput.value;

    // Validate date format (GNews API expects 'YYYY-MM-DDThh:mm:ssZ')
    const isValidDate = (dateStr) => /^\d{4}-\d{2}-\d{2}$/.test(dateStr);

    // Construct the URL with new API filters
    let url = `https://gnews.io/api/v4/search?apikey=${apiKey}&q=${encodeURIComponent(query)}&lang=${language}&in=${searchIn}&max=${maxResults}`;

    // Optional date filters
    if (fromDate && isValidDate(fromDate)) url += `&from=${fromDate}T00:00:00Z`;
    if (toDate && isValidDate(toDate)) url += `&to=${toDate}T23:59:59Z`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.articles) {
            displayNews(data.articles);
        } else if (data.message) {
            newsContainer.innerHTML = `<p>${data.message}</p>`; // Show API error message if available
        } else {
            newsContainer.innerHTML = '<p>No news found</p>';
        }
    } catch (error) {
        console.error('Error fetching the news:', error);
        newsContainer.innerHTML = '<p>Error fetching the news.</p>';
    }
}

// Display the news
function displayNews(articles) {
    newsContainer.innerHTML = ''; // Clear the previous results

    articles.forEach(article => {
        if (article.image) {
            const card = document.createElement('div');
            card.classList.add('card');

            card.innerHTML = `
                <div class="source">${article.source.name}</div>
                <img src="${article.image}" alt="News Image">
                <h2>${article.title}</h2>
                <p>${article.description}</p>
                <a href="${article.url}" target="_blank">Read more</a>
            `;

            newsContainer.appendChild(card);
        }
    });
}

// Event listeners for search input and filters
searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the form from reloading the page
        loadNews();
    }
});

// Adding event listeners to other filters
languageSelect.addEventListener('change', loadNews);
searchInSelect.addEventListener('change', loadNews);
fromInput.addEventListener('change', loadNews);
toInput.addEventListener('change', loadNews);

// Search icon click event
document.querySelector('.search-icon').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form submission or page reload
    loadNews();
});
