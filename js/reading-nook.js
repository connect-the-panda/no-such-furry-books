// Reading Nook - Blog Posts Loading and Category Filtering

document.addEventListener('DOMContentLoaded', function() {
    // Load blog posts first
    loadBlogPosts();

    // Get filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Load blog posts from posts folder
    async function loadBlogPosts() {
        const postsGrid = document.querySelector('.posts-grid');
        if (!postsGrid) {
            console.error('Posts grid not found');
            return;
        }

        // Show loading message
        postsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">Loading blog posts...</p>';

        try {
            // Fetch the posts index
            const response = await fetch('/posts/posts-index.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const postFiles = await response.json();
            console.log('Loaded post files:', postFiles);

            // Fetch all posts
            const posts = await Promise.all(
                postFiles.map(async (filename) => {
                    const postResponse = await fetch(`/posts/${filename}`);
                    const content = await postResponse.text();
                    return parsePost(content, filename);
                })
            );

            // Sort posts by date (newest first)
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Render posts
            renderPosts(posts);

            // Set up filtering after posts are loaded
            setupFiltering();
        } catch (error) {
            console.error('Error loading blog posts:', error);
            const postsGrid = document.querySelector('.posts-grid');
            if (postsGrid) {
                postsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #e74c3c;">Error loading blog posts. Please refresh the page.</p>';
            }
        }
    }

    function parsePost(content, filename) {
        // Parse frontmatter
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = content.match(frontmatterRegex);

        if (!match) {
            console.error('Could not parse frontmatter for:', filename);
            return null;
        }

        const frontmatter = {};
        const frontmatterLines = match[1].split('\n');
        let currentKey = null;
        let currentArray = [];

        frontmatterLines.forEach(line => {
            if (line.trim().startsWith('-')) {
                // Array item
                currentArray.push(line.trim().substring(1).trim());
            } else if (line.includes(':')) {
                // Save previous array if exists
                if (currentKey && currentArray.length > 0) {
                    frontmatter[currentKey] = currentArray;
                    currentArray = [];
                }

                // New key-value pair
                const [key, ...valueParts] = line.split(':');
                const value = valueParts.join(':').trim();
                currentKey = key.trim();

                if (value) {
                    frontmatter[currentKey] = value;
                }
            }
        });

        // Save last array if exists
        if (currentKey && currentArray.length > 0) {
            frontmatter[currentKey] = currentArray;
        }

        const body = match[2].trim();
        const slug = filename.replace('.md', '');

        // Extract excerpt if not provided
        const excerpt = frontmatter.excerpt || body.substring(0, 200) + '...';

        return {
            title: frontmatter.title,
            date: frontmatter.date,
            author: frontmatter.author,
            featured_image: frontmatter.featured_image,
            excerpt: excerpt,
            body: body,
            tags: frontmatter.tags || [],
            published: frontmatter.published === 'true' || frontmatter.published === true,
            slug: slug
        };
    }

    function renderPosts(posts) {
        const postsGrid = document.querySelector('.posts-grid');
        if (!postsGrid) return;

        // Clear existing posts
        postsGrid.innerHTML = '';

        // Render each post
        posts.forEach(post => {
            if (!post || !post.published) return;

            const article = document.createElement('article');
            article.className = 'blog-card';
            article.setAttribute('data-category', 'reading-together'); // Default category

            // Format date
            const date = new Date(post.date);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            article.innerHTML = `
                <div class="blog-card-image">
                    ${post.featured_image ?
                        `<img src="${post.featured_image}" alt="${post.title}">` :
                        '<div class="placeholder-image">📚</div>'
                    }
                    <span class="blog-category">Reading Nook</span>
                </div>
                <div class="blog-card-content">
                    <h4>${post.title}</h4>
                    <p class="blog-date">${formattedDate}</p>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <a href="post.html?post=${post.slug}" class="read-more">Read More →</a>
                </div>
            `;

            postsGrid.appendChild(article);
        });
    }

    function setupFiltering() {
        const blogCards = document.querySelectorAll('.blog-card');

        // Add click event to each filter button
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.getAttribute('data-category');

                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Filter blog cards
                filterBlogPosts(category, blogCards);
            });
        });

        // Initialize animation states
        blogCards.forEach(card => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        });
    }

    function filterBlogPosts(category, blogCards) {
        blogCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');

            if (category === 'all' || cardCategory === category) {
                // Show the card with fade-in effect
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                // Hide the card with fade-out effect
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
});
