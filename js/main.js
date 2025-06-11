// Updated product data with more items in each category
const products = [
    // Phones
    { id: 1, name: 'Smartphone X', price: 699.99, category: 'phones', image: 'assets/images/smartphone.jpg' },
    { id: 2, name: 'Smartphone Y', price: 599.99, category: 'phones', image: 'assets/images/smartphone2.jpg' },
    { id: 3, name: 'Smartphone Z', price: 799.99, category: 'phones', image: 'assets/images/smartphone3.jpg' },
    // Laptops
    { id: 4, name: 'Laptop Pro', price: 1299.99, category: 'laptops', image: 'assets/images/laptop.jpg' },
    { id: 5, name: 'Laptop Air', price: 999.99, category: 'laptops', image: 'assets/images/laptop2.jpg' },
    { id: 6, name: 'Laptop Ultra', price: 1499.99, category: 'laptops', image: 'assets/images/laptop3.jpg' },
    // Clothes
    { id: 7, name: 'Men\'s T-Shirt', price: 29.99, category: 'clothes', image: 'assets/images/tshirt.jpg' },
    { id: 8, name: 'Women\'s Dress', price: 59.99, category: 'clothes', image: 'assets/images/dress.jpg' },
    { id: 9, name: 'Kids\' Hoodie', price: 39.99, category: 'clothes', image: 'assets/images/hoodie.jpg' },
    // Shoes
    { id: 10, name: 'Running Shoes', price: 89.99, category: 'shoes', image: 'assets/images/shoes.jpg' },
    { id: 11, name: 'Casual Sneakers', price: 69.99, category: 'shoes', image: 'assets/images/sneakers.jpg' },
    { id: 12, name: 'Formal Shoes', price: 99.99, category: 'shoes', image: 'assets/images/formal-shoes.jpg' },
    // Coffee Makers
    { id: 13, name: 'Coffee Maker', price: 79.99, category: 'coffee-makers', image: 'assets/images/coffee-maker.jpg' },
    { id: 14, name: 'Espresso Machine', price: 149.99, category: 'coffee-makers', image: 'assets/images/espresso.jpg' },
    { id: 15, name: 'French Press', price: 29.99, category: 'coffee-makers', image: 'assets/images/french-press.jpg' },
    // Blenders
    { id: 16, name: 'Blender', price: 49.99, category: 'blenders', image: 'assets/images/blender.jpg' },
    { id: 17, name: 'Smoothie Blender', price: 69.99, category: 'blenders', image: 'assets/images/smoothie-blender.jpg' },
    { id: 18, name: 'Food Processor', price: 89.99, category: 'blenders', image: 'assets/images/food-processor.jpg' }
];

// Load featured products on the home page
function loadFeaturedProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productGrid.appendChild(productCard);
    });
}

// Add to cart functionality
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedProducts();
    loadTrendingPosts();
    loadRecentPosts();
});

// Theme Management
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Initialize theme
const savedTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// Auth Modal Management
const authModal = document.getElementById('auth-modal');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const closeBtn = document.querySelector('.close');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

function showModal() {
    authModal.style.display = 'block';
}

function hideModal() {
    authModal.style.display = 'none';
}

loginBtn.addEventListener('click', () => {
    showModal();
    switchTab('login');
});

signupBtn.addEventListener('click', () => {
    showModal();
    switchTab('signup');
});

closeBtn.addEventListener('click', hideModal);

window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        hideModal();
    }
});

function switchTab(tabName) {
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    tabContents.forEach(content => {
        content.style.display = content.id === `${tabName}-tab` ? 'block' : 'none';
    });
}

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// User Authentication
let currentUser = null;

// Check if user is logged in
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        currentUser = user;
        updateUIForLoggedInUser(user);
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    const navLinks = document.querySelector('.nav-links');
    navLinks.innerHTML = `
        <a href="write.html" class="nav-link">Write</a>
        <a href="#" class="nav-link" id="theme-toggle"><i class="fas fa-moon"></i></a>
        <div class="user-menu">
            <img src="${user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}" alt="${user.name}" class="avatar">
            <div class="dropdown-menu">
                <a href="/profile">My Profile</a>
                <a href="/my-blogs">My Blogs</a>
                <a href="/settings">Settings</a>
                <a href="#" id="logout-btn">Logout</a>
            </div>
        </div>
    `;

    // Add event listeners for the new elements
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    currentUser = null;
    location.reload();
}

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.querySelector('#login-form input[type="email"]').value;
    const password = document.querySelector('#login-form input[type="password"]').value;

    try {
        const user = await loginUser(email, password);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', user.token);
        currentUser = user;
        updateUIForLoggedInUser(user);
        hideModal();
        showNotification('Successfully logged in');
    } catch (error) {
        showError('Invalid email or password');
    }
});

// Handle signup form submission
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.querySelector('#signup-form input[type="text"]').value;
    const email = document.querySelector('#signup-form input[type="email"]').value;
    const password = document.querySelector('#signup-form input[type="password"]').value;
    const confirmPassword = document.querySelectorAll('#signup-form input[type="password"]')[1].value;

    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }

    try {
        const user = await registerUser(name, email, password);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', user.token);
        currentUser = user;
        updateUIForLoggedInUser(user);
        hideModal();
        showNotification('Successfully registered');
    } catch (error) {
        showError('Registration failed. Please try again.');
    }
});

// Blog Management
async function loadUserBlogs() {
    if (!currentUser) return;
    
    try {
        const blogs = await fetchUserBlogs(currentUser.id);
        displayUserBlogs(blogs);
    } catch (error) {
        showError('Failed to load your blogs');
    }
}

function displayUserBlogs(blogs) {
    const blogsContainer = document.querySelector('.user-blogs');
    if (!blogsContainer) return;

    blogsContainer.innerHTML = blogs.map(blog => `
        <div class="blog-card">
            <img src="${blog.coverImage || 'https://via.placeholder.com/300x200'}" alt="${blog.title}">
            <div class="blog-content">
                <h3>${blog.title}</h3>
                <p>${blog.excerpt}</p>
                <div class="blog-meta">
                    <span><i class="fas fa-calendar"></i> ${formatDate(blog.publishedAt)}</span>
                    <span><i class="fas fa-eye"></i> ${blog.views}</span>
                    <span><i class="fas fa-comment"></i> ${blog.comments}</span>
                </div>
                <div class="blog-actions">
                    <a href="edit.html?id=${blog.id}" class="btn-secondary">Edit</a>
                    <button onclick="deleteBlog(${blog.id})" class="btn-danger">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

async function deleteBlog(blogId) {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
        await deleteBlogPost(blogId);
        showNotification('Blog deleted successfully');
        loadUserBlogs();
    } catch (error) {
        showError('Failed to delete blog');
    }
}

// API Functions
async function loginUser(email, password) {
    // TODO: Replace with actual API endpoint
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: 1,
                name: 'John Doe',
                email: email,
                avatar: 'https://ui-avatars.com/api/?name=John+Doe',
                token: 'dummy-token'
            });
        }, 1000);
    });
}

async function registerUser(name, email, password) {
    // TODO: Replace with actual API endpoint
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: 1,
                name: name,
                email: email,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
                token: 'dummy-token'
            });
        }, 1000);
    });
}

async function fetchUserBlogs(userId) {
    // TODO: Replace with actual API endpoint
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    title: 'My First Blog Post',
                    excerpt: 'This is my first blog post on BlogHub...',
                    coverImage: 'https://via.placeholder.com/300x200',
                    publishedAt: '2024-03-15T10:00:00Z',
                    views: 150,
                    comments: 5
                },
                {
                    id: 2,
                    title: 'Another Blog Post',
                    excerpt: 'Here\'s another interesting post...',
                    coverImage: 'https://via.placeholder.com/300x200',
                    publishedAt: '2024-03-14T15:30:00Z',
                    views: 75,
                    comments: 3
                }
            ]);
        }, 1000);
    });
}

async function deleteBlogPost(blogId) {
    // TODO: Replace with actual API endpoint
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 1000);
    });
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showError(message) {
    showNotification(message, 'error');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadUserBlogs();
});

// Mobile Menu
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.createElement('div');
mobileMenu.className = 'mobile-menu';
mobileMenu.innerHTML = `
    <div class="mobile-menu-header">
        <h2>Menu</h2>
        <button class="close-menu"><i class="fas fa-times"></i></button>
    </div>
    <div class="mobile-menu-links">
        <a href="/">Home</a>
        <a href="/categories">Categories</a>
        <a href="/write">Write</a>
        <a href="/profile">Profile</a>
        <a href="/settings">Settings</a>
    </div>
`;
document.body.appendChild(mobileMenu);

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
});

mobileMenu.querySelector('.close-menu').addEventListener('click', () => {
    mobileMenu.classList.remove('active');
});

// Load trending and recent posts
document.addEventListener('DOMContentLoaded', () => {
    loadTrendingPosts();
    loadRecentPosts();
});

// Load trending posts
async function loadTrendingPosts() {
    try {
        const posts = await fetchTrendingPosts();
        displayPosts(posts, '.trending .post-grid');
    } catch (error) {
        console.error('Error loading trending posts:', error);
        showError('Failed to load trending posts');
    }
}

// Load recent posts
async function loadRecentPosts() {
    try {
        const posts = await fetchRecentPosts();
        displayPosts(posts, '.recent .post-grid');
    } catch (error) {
        console.error('Error loading recent posts:', error);
        showError('Failed to load recent posts');
    }
}

// Display posts in a specific container
function displayPosts(posts, containerSelector) {
    const container = document.querySelector(containerSelector);
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

// Dummy API functions (replace with actual API calls)
async function fetchTrendingPosts() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Dummy data for trending posts
    return [
        {
            id: '1',
            title: 'The Future of AI in Healthcare',
            author: 'Dr. Sarah Chen',
            date: '2024-03-15',
            excerpt: 'Exploring how artificial intelligence is revolutionizing healthcare delivery and patient care.',
            coverImage: 'https://source.unsplash.com/random/800x600?healthcare',
            likes: 156
        },
        {
            id: '2',
            title: 'Sustainable Living: A Complete Guide',
            author: 'Emma Thompson',
            date: '2024-03-14',
            excerpt: 'Practical tips and strategies for reducing your environmental footprint and living sustainably.',
            coverImage: 'https://source.unsplash.com/random/800x600?sustainability',
            likes: 142
        },
        {
            id: '3',
            title: 'The Art of Mindful Productivity',
            author: 'James Wilson',
            date: '2024-03-13',
            excerpt: 'Learn how to be more productive while maintaining mental well-being and work-life balance.',
            coverImage: 'https://source.unsplash.com/random/800x600?productivity',
            likes: 128
        }
    ];
}

async function fetchRecentPosts() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Dummy data for recent posts
    return [
        {
            id: '4',
            title: 'Getting Started with React Hooks',
            author: 'Alex Johnson',
            date: '2024-03-16',
            excerpt: 'A comprehensive guide to understanding and implementing React Hooks in your applications.',
            coverImage: 'https://source.unsplash.com/random/800x600?coding',
            likes: 89
        },
        {
            id: '5',
            title: 'The Ultimate Travel Photography Guide',
            author: 'Maria Garcia',
            date: '2024-03-16',
            excerpt: 'Master the art of travel photography with these essential tips and techniques.',
            coverImage: 'https://source.unsplash.com/random/800x600?photography',
            likes: 76
        },
        {
            id: '6',
            title: 'Healthy Meal Prep for Busy Professionals',
            author: 'David Kim',
            date: '2024-03-15',
            excerpt: 'Simple and nutritious meal prep ideas that will save you time and keep you healthy.',
            coverImage: 'https://source.unsplash.com/random/800x600?food',
            likes: 92
        }
    ];
} 