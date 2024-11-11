const API_KEY = "4de1261b3ff04d659d00e457b93aad3e";  // Ensure this API key is correct and not exposed in production
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    try {
        // Make the API request
        const response = await fetch(new Request(`${url}${query}&apiKey=${API_KEY}`));

        // Log response status for debugging
        console.log("Response Status:", response.status);

        // Check if response is valid (200 OK)
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        // Parse the response data
        const data = await response.json();

        // Log the API response data for debugging
        console.log("API Response Data:", data);

        // Check if articles exist in the response
        if (!data.articles || data.articles.length === 0) {
            throw new Error("No articles found for the query");
        }

        // Bind data to UI
        bindData(data.articles);
    } catch (error) {
        console.error("Error fetching news:", error);
        document.getElementById("cards-container").innerHTML = "<p>Failed to load news. Please try again later.</p>";
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    // Clear existing articles
    cardsContainer.innerHTML = "";

    // Loop through articles and append to UI
    articles.forEach((article) => {
        if (!article.urlToImage) return;  // Skip articles without images

        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    // Open article in a new tab when clicked
    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});
