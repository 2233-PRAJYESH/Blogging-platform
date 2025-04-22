 // Main Application Logic
 document.addEventListener('DOMContentLoaded', function() {
  // Application State
  const state = {
    posts: [],
    currentPost: null,
    currentPage: 'post-list'
  };

  // DOM Elements
  const pages = {
    postList: document.getElementById('post-list-page'),
    postDetail: document.getElementById('post-detail-page'),
    postForm: document.getElementById('post-form-page')
  };

  const elements = {
    postsContainer: document.getElementById('posts-container'),
    postDetailContainer: document.getElementById('post-detail-container'),
    blogForm: document.getElementById('blog-form'),
    postTitle: document.getElementById('post-title'),
    postAuthor: document.getElementById('post-author'),
    postContent: document.getElementById('post-content'),
    postId: document.getElementById('post-id'),
    formTitle: document.getElementById('form-title'),
    alertContainer: document.getElementById('alert-container')
  };

  // Navigation Elements
  const homeLink = document.getElementById('home-link');
  const homeNav = document.getElementById('home-nav');
  const newPostNav = document.getElementById('new-post-nav');
  const backToPostsButton = document.getElementById('back-to-posts');
  const cancelPostButton = document.getElementById('cancel-post');

  // Event Listeners for Navigation
  homeLink.addEventListener('click', navigateToHome);
  homeNav.addEventListener('click', navigateToHome);
  newPostNav.addEventListener('click', navigateToNewPost);
  backToPostsButton.addEventListener('click', navigateToHome);
  cancelPostButton.addEventListener('click', navigateToHome);

  // Event Listeners for Forms
  elements.blogForm.addEventListener('submit', handlePostSubmit);

  // Initialize the app
  initializeApp();

  // Functions
  function initializeApp() {
    loadPostsFromStorage();
    navigateToHome();
    renderPosts();
  }

  function loadPostsFromStorage() {
    const storedPosts = localStorage.getItem('blogPosts');
    if (storedPosts) {
      state.posts = JSON.parse(storedPosts);
    } else {
      // Add some sample posts if none exist
      state.posts = [
        {
          id: 1,
          title: 'Welcome to SimpleBlog',
          content: 'This is your first post on SimpleBlog! Start sharing your thoughts with the world.',
          author: 'Admin',
          date: new Date().toISOString(),
          likes: 5
        },
        {
          id: 2,
          title: 'Getting Started with Blogging',
          content: 'Blogging is a great way to share your ideas and connect with others. Here are some tips to get started...',
          author: 'Admin',
          date: new Date().toISOString(),
          likes: 3
        }
      ];
      savePostsToStorage();
    }
  }

  function savePostsToStorage() {
    localStorage.setItem('blogPosts', JSON.stringify(state.posts));
  }

  function showPage(pageId) {
    state.currentPage = pageId;
    
    // Hide all pages
    for (const key in pages) {
      pages[key].classList.add('hidden');
    }
    
    // Show the requested page
    pages[pageId].classList.remove('hidden');
  }

  function navigateToHome(e) {
    if (e) e.preventDefault();
    showPage('postList');
    renderPosts();
  }

  function navigateToPostDetail(postId) {
    state.currentPost = state.posts.find(post => post.id === postId);
    showPage('postDetail');
    renderPostDetail();
  }

  function navigateToNewPost(e) {
    if (e) e.preventDefault();
    
    // Reset form for a new post
    elements.postId.value = '';
    elements.postTitle.value = '';
    elements.postAuthor.value = 'Guest';
    elements.postContent.value = '';
    elements.formTitle.textContent = 'Create New Post';
    
    showPage('postForm');
  }

  function navigateToEditPost(postId) {
    const post = state.posts.find(post => post.id === postId);
    if (post) {
      state.currentPost = post;
      elements.postId.value = post.id;
      elements.postTitle.value = post.title;
      elements.postAuthor.value = post.author;
      elements.postContent.value = post.content;
      elements.formTitle.textContent = 'Edit Post';
      
      showPage('postForm');
    }
  }

  function renderPosts() {
    elements.postsContainer.innerHTML = '';
    
    if (state.posts.length === 0) {
      elements.postsContainer.innerHTML = '<p>No posts yet. Be the first to create one!</p>';
      return;
    }
    
    // Sort posts by date (newest first)
    const sortedPosts = [...state.posts].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    sortedPosts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.className = 'blog-post post-preview';
      
      const date = new Date(post.date);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // Create a preview of the content (first 150 characters)
      const contentPreview = post.content.length > 150 
        ? post.content.substring(0, 150) + '...' 
        : post.content;
        
      postElement.innerHTML = `
        <h2 class="blog-title">${post.title}</h2>
        <div class="blog-meta">By ${post.author} on ${formattedDate} • ${post.likes} likes</div>
        <div class="blog-content">${contentPreview}</div>
        <button class="btn">Read More</button>
      `;
      
      postElement.addEventListener('click', () => navigateToPostDetail(post.id));
      elements.postsContainer.appendChild(postElement);
    });
  }

  function renderPostDetail() {
    if (!state.currentPost) return;
    
    const post = state.currentPost;
    const date = new Date(post.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    elements.postDetailContainer.innerHTML = `
      <h1 class="blog-title">${post.title}</h1>
      <div class="blog-meta">
        By ${post.author} on ${formattedDate} • ${post.likes} likes
        <button id="like-button" class="btn">👍 Like</button>
      </div>
      <div class="blog-content">${post.content.replace(/\n/g, '<br>')}</div>
      <div class="post-controls">
        <div class="action-buttons">
          <button id="edit-post" class="btn">Edit Post</button>
          <button id="delete-post" class="btn btn-danger">Delete Post</button>
        </div>
      </div>
    `;
    
    // Add event listeners for edit and delete
    document.getElementById('edit-post').addEventListener('click', () => 
      navigateToEditPost(post.id)
    );
    
    document.getElementById('delete-post').addEventListener('click', () => 
      handleDeletePost(post.id)
    );
    
    // Add like functionality
    document.getElementById('like-button').addEventListener('click', (e) => {
      e.stopPropagation();
      handleLikePost(post.id);
    });
  }

  function handlePostSubmit(e) {
    e.preventDefault();
    
    const title = elements.postTitle.value.trim();
    const author = elements.postAuthor.value.trim() || 'Anonymous';
    const content = elements.postContent.value.trim();
    const postId = elements.postId.value;
    
    if (!title || !content) {
      showAlert('Please fill in all required fields', 'danger');
      return;
    }
    
    if (postId) {
      // Update existing post
      const index = state.posts.findIndex(post => post.id === parseInt(postId));
      if (index !== -1) {
        state.posts[index].title = title;
        state.posts[index].author = author;
        state.posts[index].content = content;
        state.posts[index].lastEdited = new Date().toISOString();
        
        showAlert('Post updated successfully!', 'success');
      }
    } else {
      // Create new post
      const newPost = {
        id: Date.now(),
        title,
        author,
        content,
        date: new Date().toISOString(),
        likes: 0
      };
      
      state.posts.push(newPost);
      showAlert('Post published successfully!', 'success');
    }
    
    savePostsToStorage();
    navigateToHome();
  }

  function handleDeletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
      state.posts = state.posts.filter(post => post.id !== postId);
      savePostsToStorage();
      showAlert('Post deleted successfully!', 'success');
      navigateToHome();
    }
  }

  function handleLikePost(postId) {
    const index = state.posts.findIndex(post => post.id === postId);
    if (index !== -1) {
      state.posts[index].likes++;
      savePostsToStorage();
      
      // Update the UI
      const likeButton = document.getElementById('like-button');
      const likeCount = state.posts[index].likes;
      likeButton.previousSibling.textContent = ` • ${likeCount} likes`;
      
      // Show a little animation
      likeButton.textContent = '👍 Liked!';
      likeButton.style.backgroundColor = '#28a745';
      setTimeout(() => {
        likeButton.textContent = '👍 Like';
        likeButton.style.backgroundColor = '';
      }, 1000);
    }
  }

  function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    elements.alertContainer.innerHTML = '';
    elements.alertContainer.appendChild(alertDiv);
    
    // Clear the alert after 3 seconds
    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }
});