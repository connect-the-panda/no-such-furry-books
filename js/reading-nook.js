// Reading Nook - Category Filtering

document.addEventListener('DOMContentLoaded', function() {
    // Get filter buttons and blog cards
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    // Add click event to each filter button
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter blog cards
            filterBlogPosts(category);
        });
    });

    function filterBlogPosts(category) {
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

        // Show message if no posts match filter
        checkForNoPosts(category);
    }

    function checkForNoPosts(category) {
        const visibleCards = Array.from(blogCards).filter(card => {
            const cardCategory = card.getAttribute('data-category');
            return category === 'all' || cardCategory === category;
        });

        // This is just for future use when you have actual posts
        // For now, all sample posts will be visible
        if (visibleCards.length === 0) {
            console.log('No posts in this category yet');
        }
    }

    // Initialize animation states
    blogCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
});
