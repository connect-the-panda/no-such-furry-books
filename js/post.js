// Individual Blog Post Display

document.addEventListener('DOMContentLoaded', function() {
    loadPost();
});

async function loadPost() {
    // Get post slug from URL
    const urlParams = new URLSearchParams(window.location.search);
    const postSlug = urlParams.get('post');

    if (!postSlug) {
        showError('No post specified');
        return;
    }

    try {
        // Fetch the post markdown file
        const response = await fetch(`/posts/${postSlug}.md`);

        if (!response.ok) {
            throw new Error('Post not found');
        }

        const content = await response.text();
        const post = parsePost(content);

        if (!post) {
            throw new Error('Failed to parse post');
        }

        // Display the post
        displayPost(post);

        // Update page title
        document.title = `${post.title} | No Such Furry Books`;

        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && post.excerpt) {
            metaDesc.setAttribute('content', post.excerpt);
        }

    } catch (error) {
        console.error('Error loading post:', error);
        showError('Unable to load this post. Please try again later.');
    }
}

function parsePost(content) {
    // Parse frontmatter
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
        console.error('Could not parse frontmatter');
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

    return {
        title: frontmatter.title,
        date: frontmatter.date,
        author: frontmatter.author,
        category: frontmatter.category || 'reading-together',
        featured_image: frontmatter.featured_image,
        excerpt: frontmatter.excerpt,
        body: body,
        tags: frontmatter.tags || []
    };
}

function displayPost(post) {
    // Category labels
    const categoryLabels = {
        'book-buzz': 'Book Buzz',
        'reading-together': 'Reading Together',
        'classroom': 'In the Classroom',
        'activities': 'Activities & Freebies',
        'behind-pages': 'Behind the Pages',
        'heart-to-heart': 'Heart-to-Heart'
    };

    // Display category
    const categoryEl = document.getElementById('post-category');
    if (categoryEl) {
        categoryEl.textContent = categoryLabels[post.category] || 'Reading Nook';
    }

    // Display title
    const titleEl = document.getElementById('post-title');
    if (titleEl) {
        titleEl.textContent = post.title;
    }

    // Display date
    const dateEl = document.getElementById('post-date');
    if (dateEl && post.date) {
        const date = new Date(post.date);
        dateEl.textContent = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Display author
    const authorEl = document.getElementById('post-author');
    if (authorEl) {
        authorEl.textContent = post.author || 'No Such Furry Books';
    }

    // Display featured image
    const imageEl = document.getElementById('post-featured-image');
    if (imageEl && post.featured_image) {
        imageEl.innerHTML = `<img src="${post.featured_image}" alt="${post.title}">`;
    } else if (imageEl) {
        imageEl.style.display = 'none';
    }

    // Display content (convert markdown to HTML)
    const contentEl = document.getElementById('post-content');
    if (contentEl && post.body) {
        contentEl.innerHTML = marked.parse(post.body);
    }

    // Display tags
    const tagsEl = document.getElementById('post-tags');
    if (tagsEl && post.tags && post.tags.length > 0) {
        tagsEl.innerHTML = '<h4>Tags:</h4>' + post.tags.map(tag =>
            `<span class="tag">${tag}</span>`
        ).join('');
    }
}

function showError(message) {
    const contentEl = document.getElementById('post-content');
    if (contentEl) {
        contentEl.innerHTML = `
            <div class="error-message">
                <h2>Oops!</h2>
                <p>${message}</p>
                <a href="reading-nook.html" class="primary-button">← Back to The Reading Nook</a>
            </div>
        `;
    }
}
