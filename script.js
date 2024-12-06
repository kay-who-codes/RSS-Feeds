const feedContainer = document.getElementById("feed-container");

// Fetch RSS feeds from feeds.json and display them
function loadFeeds() {
    fetch('feeds.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not load feeds.json");
            }
            return response.json();
        })
        .then(data => {
            const { feeds } = data;

            if (!feeds || feeds.length === 0) {
                feedContainer.innerHTML = "<p>No feeds available.</p>";
                return;
            }

            feedContainer.innerHTML = ""; // Clear loading message
            feeds.forEach(feed => displayFeed(feed.name, feed.url));
        })
        .catch(error => {
            feedContainer.innerHTML = `<p>Error: ${error.message}</p>`;
        });
}

// Fetch and display a single feed with a limit of 4 articles
function displayFeed(sourceName, feedUrl) {
    const sourceContainer = document.createElement("div");
    sourceContainer.classList.add("feed-source");
    sourceContainer.innerHTML = `<h2>${sourceName}</h2><p>Loading...</p>`;
    feedContainer.appendChild(sourceContainer);

    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch feed: ${sourceName}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.items && data.items.length > 0) {
                const limitedItems = data.items.slice(0, 4); // Limit to 4 articles
                const feedHtml = limitedItems.map(item => `
                    <div class="feed-item">
                        <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                        <p><strong>Published:</strong> ${item.pubDate}</p>
                        <p>${item.description}</p>
                        <a href="mailto:test@hotmail.co.uk?subject=${encodeURIComponent(item.title)}&body=${encodeURIComponent(item.link)}"
                           class="email-button">
                           Email to Self
                        </a>
                    </div>
                `).join('');
                sourceContainer.innerHTML = feedHtml;
            } else {
                sourceContainer.innerHTML += "<p>No items found in this feed.</p>";
            }
        })
        .catch(error => {
            sourceContainer.innerHTML += `<p>Error: ${error.message}</p>`;
        });
}

// Load all feeds when the app starts
loadFeeds();
