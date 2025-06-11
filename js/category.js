// Get category from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const categorySlug = urlParams.get('category');

// Category data (replace with API call)
const categories = {
    'technology': {
        name: 'Technology',
        description: 'Explore the latest in tech, programming, and digital innovation.'
    },
    'travel': {
        name: 'Travel',
        description: 'Discover amazing destinations, travel tips, and adventure stories.'
    },
    'lifestyle': {
        name: 'Lifestyle',
        description: 'Tips and insights for living your best life.'
    },
    'food': {
        name: 'Food & Cooking',
        description: 'Recipes, cooking tips, and food adventures.'
    },
    'health': {
        name: 'Health & Fitness',
        description: 'Wellness tips, fitness advice, and healthy living guides.'
    },
    'personal': {
        name: 'Personal',
        description: 'Personal stories, experiences, and reflections.'
    },
    'career': {
        name: 'Career',
        description: 'Career advice, professional development, and workplace insights.'
    }
};

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Set category information
    const category = categories[categorySlug] || {
        name: 'All Categories',
        description: 'Browse all blog posts across different categories.'
    };
    
    document.getElementById('category-title').textContent = category.name;
    document.getElementById('category-description').textContent = category.description;
    document.title = `${category.name} - BlogHub`;

    // Load posts
    loadPosts();

    // Set up filter buttons
    setupFilters();

    // Set up pagination
    setupPagination();
});

// Load posts for the category
async function loadPosts(filter = 'all', page = 1) {
    try {
        const posts = await fetchPosts(categorySlug, filter, page);
        displayPosts(posts);
    } catch (error) {
        console.error('Error loading posts:', error);
        showError('Failed to load posts. Please try again later.');
    }
}

// Display posts in the grid
function displayPosts(posts) {
    const container = document.getElementById('posts-container');
    container.innerHTML = '';

    posts.forEach(post => {
        const postElement = createPostElement(post);
        container.appendChild(postElement);
    });
}

// Create post element
function createPostElement(post) {
    const article = document.createElement('article');
    article.className = 'post-card';
    
    article.innerHTML = `
        <img src="${post.coverImage}" alt="${post.title}" class="post-image">
        <div class="post-content">
            <h2 class="post-title">${post.title}</h2>
            <div class="post-meta">
                <span><i class="fas fa-user"></i> ${post.author}</span>
                <span><i class="fas fa-calendar"></i> ${formatDate(post.date)}</span>
            </div>
            <p class="post-excerpt">${post.excerpt}</p>
            <div class="post-actions">
                <button onclick="likePost('${post.id}')">
                    <i class="fas fa-heart"></i> ${post.likes}
                </button>
                <button onclick="bookmarkPost('${post.id}')">
                    <i class="fas fa-bookmark"></i>
                </button>
                <button onclick="sharePost('${post.id}')">
                    <i class="fas fa-share"></i>
                </button>
            </div>
        </div>
    `;

    // Add click event to navigate to post
    article.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
            window.location.href = `post.html?id=${post.id}`;
        }
    });

    return article;
}

// Set up filter buttons
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Load posts with selected filter
            const filter = button.dataset.filter;
            loadPosts(filter);
        });
    });
}

// Set up pagination
function setupPagination() {
    const prevButton = document.querySelector('.prev-page');
    const nextButton = document.querySelector('.next-page');
    const pageNumbers = document.querySelectorAll('.page-number');
    let currentPage = 1;

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            loadPosts(getCurrentFilter(), currentPage);
        }
    });

    nextButton.addEventListener('click', () => {
        currentPage++;
        updatePagination();
        loadPosts(getCurrentFilter(), currentPage);
    });

    pageNumbers.forEach(button => {
        button.addEventListener('click', () => {
            currentPage = parseInt(button.textContent);
            updatePagination();
            loadPosts(getCurrentFilter(), currentPage);
        });
    });

    function updatePagination() {
        // Update page numbers
        pageNumbers.forEach(button => {
            button.classList.remove('active');
            if (parseInt(button.textContent) === currentPage) {
                button.classList.add('active');
            }
        });

        // Update prev/next buttons
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === pageNumbers.length;
    }
}

// Get current filter
function getCurrentFilter() {
    const activeFilter = document.querySelector('.filter-btn.active');
    return activeFilter ? activeFilter.dataset.filter : 'all';
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Post interaction functions
function likePost(postId) {
    // Implement like functionality
    console.log('Like post:', postId);
}

function bookmarkPost(postId) {
    // Implement bookmark functionality
    console.log('Bookmark post:', postId);
}

function sharePost(postId) {
    // Implement share functionality
    console.log('Share post:', postId);
}

// Dummy API function (replace with actual API call)
async function fetchPosts(category, filter, page) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Dummy data
    return [
        {
            id: '1',
            title: 'Getting Started with Web Development',
            author: 'John Doe',
            date: '2024-03-15',
            excerpt: 'Learn the basics of web development and start your journey as a developer.',
            coverImage: 'https://source.unsplash.com/random/800x600?web',
            likes: 42
        },
        {
            id: '2',
            title: 'The Future of Artificial Intelligence',
            author: 'Jane Smith',
            date: '2024-03-14',
            excerpt: 'Exploring the latest developments in AI and their impact on our lives.',
            coverImage: 'https://source.unsplash.com/random/800x600?ai',
            likes: 38
        },
        {
            id: '3',
            title: 'Building Responsive Websites',
            author: 'Mike Johnson',
            date: '2024-03-13',
            excerpt: 'A comprehensive guide to creating websites that work on all devices.',
            coverImage: 'https://source.unsplash.com/random/800x600?responsive',
            likes: 29
        }
    ];
}

// Show error notification
function showError(message) {
    // Implement error notification
    console.error(message);
} 