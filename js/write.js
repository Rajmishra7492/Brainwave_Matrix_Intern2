// Initialize Quill Editor
const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['blockquote', 'code-block'],
            ['link', 'image', 'video'],
            ['clean']
        ]
    }
});

// Auto-save functionality
let autoSaveInterval;
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

function startAutoSave() {
    autoSaveInterval = setInterval(saveDraft, AUTO_SAVE_INTERVAL);
}

function stopAutoSave() {
    clearInterval(autoSaveInterval);
}

function saveDraft() {
    const postData = {
        title: document.getElementById('post-title').value,
        content: quill.root.innerHTML,
        category: document.getElementById('post-category').value,
        tags: Array.from(document.querySelectorAll('.tag')).map(tag => tag.textContent.trim()),
        coverImage: document.querySelector('#image-preview img')?.src,
        settings: {
            allowComments: document.getElementById('allow-comments').checked,
            featured: document.getElementById('featured-post').checked
        },
        lastSaved: new Date().toISOString()
    };

    localStorage.setItem('draft_post', JSON.stringify(postData));
    showNotification('Draft saved');
}

// Load draft if exists
function loadDraft() {
    const draft = localStorage.getItem('draft_post');
    if (draft) {
        const postData = JSON.parse(draft);
        document.getElementById('post-title').value = postData.title || '';
        quill.root.innerHTML = postData.content || '';
        document.getElementById('post-category').value = postData.category || '';
        
        // Load tags
        const tagsContainer = document.getElementById('tags-container');
        tagsContainer.innerHTML = '';
        (postData.tags || []).forEach(tag => addTag(tag));

        // Load cover image
        if (postData.coverImage) {
            const imagePreview = document.getElementById('image-preview');
            imagePreview.innerHTML = `<img src="${postData.coverImage}" alt="Cover">`;
        }

        // Load settings
        document.getElementById('allow-comments').checked = postData.settings?.allowComments || false;
        document.getElementById('featured-post').checked = postData.settings?.featured || false;

        showNotification('Draft loaded');
    }
}

// Tags functionality
const tagInput = document.getElementById('tag-input');
const tagsContainer = document.getElementById('tags-container');

function addTag(tagText) {
    if (!tagText.trim()) return;
    
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.innerHTML = `
        ${tagText}
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    tagsContainer.appendChild(tag);
    tagInput.value = '';
}

tagInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addTag(tagInput.value);
    }
});

// Image upload functionality
const coverUpload = document.getElementById('cover-upload');
const coverImageInput = document.getElementById('cover-image');
const imagePreview = document.getElementById('image-preview');

coverUpload.addEventListener('click', () => {
    coverImageInput.click();
});

coverImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Cover">`;
        };
        reader.readAsDataURL(file);
    }
});

// Publish functionality
document.getElementById('publish-post').addEventListener('click', async () => {
    const title = document.getElementById('post-title').value;
    const content = quill.root.innerHTML;
    const category = document.getElementById('post-category').value;

    if (!title || !content || !category) {
        showError('Please fill in all required fields');
        return;
    }

    const postData = {
        title,
        content,
        category,
        tags: Array.from(document.querySelectorAll('.tag')).map(tag => tag.textContent.trim()),
        coverImage: document.querySelector('#image-preview img')?.src,
        settings: {
            allowComments: document.getElementById('allow-comments').checked,
            featured: document.getElementById('featured-post').checked
        },
        publishedAt: new Date().toISOString()
    };

    try {
        // TODO: Replace with actual API call
        await publishPost(postData);
        localStorage.removeItem('draft_post');
        showNotification('Post published successfully');
        window.location.href = '/my-blogs.html'; // Redirect to my blogs page
    } catch (error) {
        showError('Failed to publish post. Please try again.');
    }
});

// Save draft button
document.getElementById('save-draft').addEventListener('click', () => {
    saveDraft();
});

// Notification system
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

// Dummy API function
async function publishPost(postData) {
    // TODO: Replace with actual API endpoint
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 1000);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadDraft();
    startAutoSave();

    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            color: white;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        }

        .notification.success {
            background-color: #10b981;
        }

        .notification.error {
            background-color: #ef4444;
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}); 