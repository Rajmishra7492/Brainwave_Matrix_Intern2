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

// Load Post Content
async function loadPost() {
    const postId = new URLSearchParams(window.location.search).get('id');
    if (!postId) {
        showError('Post not found');
        return;
    }

    try {
        const post = await fetchPost(postId);
        updatePostContent(post);
        loadRelatedPosts(post.category);
        loadComments(postId);
    } catch (error) {
        showError('Failed to load post');
    }
}

function updatePostContent(post) {
    document.title = `${post.title} - BlogHub`;
    document.querySelector('.post-title').textContent = post.title;
    document.querySelector('.author-name').textContent = post.author.name;
    document.querySelector('.post-date').textContent = formatDate(post.publishedAt);
    document.querySelector('.post-body').innerHTML = post.content;

    // Update tags
    const tagsContainer = document.querySelector('.post-tags');
    tagsContainer.innerHTML = post.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

    // Update author bio
    document.querySelector('.bio-content p').textContent = post.author.bio;
    document.querySelector('.author-bio .author-avatar').src = post.author.avatar;
}

// Comments
const commentForm = document.querySelector('.comment-form');
const commentInput = document.getElementById('comment-input');
const commentsList = document.querySelector('.comments-list');

commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = commentInput.value.trim();
    if (!content) return;

    try {
        const comment = await addComment(content);
        addCommentToDOM(comment);
        commentInput.value = '';
    } catch (error) {
        showError('Failed to post comment');
    }
});

function addCommentToDOM(comment) {
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.innerHTML = `
        <img src="${comment.author.avatar}" alt="${comment.author.name}" class="author-avatar">
        <div class="comment-content">
            <div class="comment-header">
                <span class="comment-author">${comment.author.name}</span>
                <span class="comment-date">${formatDate(comment.createdAt)}</span>
            </div>
            <p class="comment-text">${comment.content}</p>
            <div class="comment-actions">
                <a href="#" class="comment-action like-comment">
                    <i class="far fa-heart"></i> Like
                </a>
                <a href="#" class="comment-action reply-comment">
                    <i class="far fa-comment"></i> Reply
                </a>
            </div>
        </div>
    `;
    commentsList.prepend(commentElement);
}

// Likes and Bookmarks
const likeButton = document.querySelector('.btn-like');
const bookmarkButton = document.querySelector('.btn-bookmark');

likeButton.addEventListener('click', async () => {
    try {
        const isLiked = await toggleLike();
        updateLikeButton(isLiked);
    } catch (error) {
        showError('Failed to update like');
    }
});

bookmarkButton.addEventListener('click', async () => {
    try {
        const isBookmarked = await toggleBookmark();
        updateBookmarkButton(isBookmarked);
    } catch (error) {
        showError('Failed to update bookmark');
    }
});

function updateLikeButton(isLiked) {
    const icon = likeButton.querySelector('i');
    icon.className = isLiked ? 'fas fa-heart' : 'far fa-heart';
    likeButton.classList.toggle('active', isLiked);
}

function updateBookmarkButton(isBookmarked) {
    const icon = bookmarkButton.querySelector('i');
    icon.className = isBookmarked ? 'fas fa-bookmark' : 'far fa-bookmark';
    bookmarkButton.classList.toggle('active', isBookmarked);
}

// Social Sharing
const shareButtons = document.querySelectorAll('.btn-share');

shareButtons.forEach(button => {
    button.addEventListener('click', () => {
        const platform = button.dataset.platform;
        sharePost(platform);
    });
});

function sharePost(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.querySelector('.post-title').textContent);
    let shareUrl;

    switch (platform) {
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
            break;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
}

// Related Posts
async function loadRelatedPosts(category) {
    try {
        const posts = await fetchRelatedPosts(category);
        const relatedPostsContainer = document.querySelector('.related-posts');
        relatedPostsContainer.innerHTML = posts.map(post => `
            <a href="/post.html?id=${post.id}" class="related-post">
                <img src="${post.coverImage}" alt="${post.title}">
                <div class="related-post-content">
                    <h4>${post.title}</h4>
                    <p>${post.excerpt}</p>
                </div>
            </a>
        `).join('');
    } catch (error) {
        console.error('Failed to load related posts:', error);
    }
}

// Newsletter Subscription
const newsletterForm = document.querySelector('.newsletter-form');

newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;

    try {
        await subscribeToNewsletter(email);
        showNotification('Successfully subscribed to newsletter');
        newsletterForm.reset();
    } catch (error) {
        showError('Failed to subscribe to newsletter');
    }
});

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

// Dummy API Functions
async function fetchPost(id) {
    // TODO: Replace with actual API endpoint
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: 1,
                title: 'Getting Started with React: A Comprehensive Guide',
                content: `
                    <p>React has revolutionized the way we build user interfaces. In this comprehensive guide, we'll explore the fundamentals of React and how to get started with this powerful library.</p>
                    <h2>What is React?</h2>
                    <p>React is a JavaScript library for building user interfaces, particularly single-page applications. It's maintained by Facebook and a community of individual developers and companies.</p>
                    <h2>Key Features</h2>
                    <ul>
                        <li>Component-based architecture</li>
                        <li>Virtual DOM for efficient rendering</li>
                        <li>One-way data flow</li>
                        <li>JSX syntax</li>
                    </ul>
                    <h2>Getting Started</h2>
                    <p>To start using React, you'll need to have Node.js installed on your system. Then, you can create a new React project using Create React App:</p>
                    <pre><code>npx create-react-app my-app
cd my-app
npm start</code></pre>
                `,
                author: {
                    name: 'John Doe',
                    avatar: 'https://ui-avatars.com/api/?name=John+Doe',
                    bio: 'John Doe is a passionate web developer with over 5 years of experience in React and modern JavaScript frameworks.'
                },
                publishedAt: '2024-03-15T10:00:00Z',
                tags: ['React', 'JavaScript', 'Web Development'],
                category: 'tech'
            });
        }, 1000);
    });
}

async function fetchComments(postId) {
    // TODO: Replace with actual API endpoint
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    content: 'Great article! This really helped me understand React better.',
                    author: {
                        name: 'Jane Smith',
                        avatar: 'https://ui-avatars.com/api/?name=Jane+Smith'
                    },
                    createdAt: '2024-03-15T11:00:00Z'
                },
                {
                    id: 2,
                    content: 'I would love to see more examples of React hooks in action.',
                    author: {
                        name: 'Mike Johnson',
                        avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson'
                    },
                    createdAt: '2024-03-15T12:00:00Z'
                }
            ]);
        }, 1000);
    });
}

async function addComment(content) {
    // TODO: Replace with actual API endpoint
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: Date.now(),
                content,
                author: {
                    name: 'Current User',
                    avatar: 'https://ui-avatars.com/api/?name=Current+User'
                },
                createdAt: new Date().toISOString()
            });
        }, 1000);
    });
}

async function toggleLike() {
    // TODO: Replace with actual API endpoint
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(Math.random() > 0.5);
        }, 500);
    });
}

async function toggleBookmark() {
    // TODO: Replace with actual API endpoint
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(Math.random() > 0.5);
        }, 500);
    });
}

async function fetchRelatedPosts(category) {
    // TODO: Replace with actual API endpoint
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 2,
                    title: 'Advanced React Patterns',
                    excerpt: 'Learn about advanced patterns and techniques in React development.',
                    coverImage: 'https://via.placeholder.com/80x80'
                },
                {
                    id: 3,
                    title: 'React Performance Optimization',
                    excerpt: 'Tips and tricks for optimizing your React applications.',
                    coverImage: 'https://via.placeholder.com/80x80'
                }
            ]);
        }, 1000);
    });
}

async function subscribeToNewsletter(email) {
    // TODO: Replace with actual API endpoint
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 1000);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPost();
}); 