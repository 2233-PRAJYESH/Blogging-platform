document.addEventListener('DOMContentLoaded', function() {
  // Initialize Quill editor
  const quill = new Quill('#editor', {
    theme: 'snow',
    placeholder: 'Write your post content here...',
    modules: {
      toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'color': [] }, { 'background': [] }],
        ['link', 'image', 'code-block'],
        ['clean']
      ]
    }
  });
  
  // Set some initial content for the editor
  quill.setContents([
    { insert: 'React is a popular JavaScript library for building user interfaces, particularly single-page applications. It\'s used for handling the view layer in web and mobile apps. React allows us to create reusable UI components.\n\n' },
    { insert: 'Why Learn React?\n', attributes: { header: 2 } },
    { insert: 'There are several compelling reasons to learn React:\n' },
    { insert: 'It\'s maintained by Facebook and used by thousands of companies\n', attributes: { list: 'bullet' } },
    { insert: 'It has a strong community and ecosystem\n', attributes: { list: 'bullet' } },
    { insert: 'It uses a virtual DOM which improves performance\n', attributes: { list: 'bullet' } },
    { insert: 'It\'s component-based, making code reusable and maintainable\n\n', attributes: { list: 'bullet' } },
    { insert: 'Getting Started\n', attributes: { header: 2 } },
    { insert: 'To get started with React, you need to have Node.js installed. Then you can create a new React application using Create React App:\n\n' },
    { insert: 'npx create-react-app my-app\ncd my-app\nnpm start\n\n', attributes: { 'code-block': true } },
    { insert: 'This will create a new React application and start a development server.\n' }
  ]);
  
  // AI Assistant Toggle
  const aiAssistant = document.querySelector('.ai-assistant');
  const aiHeader = document.querySelector('.ai-header');
  
  aiHeader.addEventListener('click', function() {
    aiAssistant.classList.toggle('open');
    const icon = this.querySelector('.fas');
    icon.classList.toggle('fa-chevron-up');
    icon.classList.toggle('fa-chevron-down');
  });
  
  // Preview Toggle
  const previewBtn = document.querySelector('.editor-btn.preview');
  const editor = document.querySelector('.post-editor');
  const preview = document.querySelector('.post-preview');
  
  previewBtn.addEventListener('click', function() {
    if (editor.style.display !== 'none') {
      showLoading('Generating preview...');
      
      setTimeout(() => {
        editor.style.display = 'none';
        preview.style.display = 'block';
        hideLoading();
      }, 800);
    } else {
      editor.style.display = 'block';
      preview.style.display = 'none';
    }
  });
  
  // Tag Input Functionality
  const tagInput = document.querySelector('.tag-input');
  const tagContainer = document.querySelector('.tag-input-container');
  
  tagInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && this.value.trim()) {
      e.preventDefault();
      
      const tagText = this.value.trim();
      const tagElement = document.createElement('div');
      tagElement.className = 'tag';
      tagElement.innerHTML = `
        <span>${tagText}</span>
        <i class="fas fa-times tag-remove"></i>
      `;
      
      tagContainer.insertBefore(tagElement, this);
      this.value = '';
      
      // Add event listener to remove tag
      tagElement.querySelector('.tag-remove').addEventListener('click', function() {
        tagElement.remove();
      });
    }
  });
  
  // Add event listeners to existing tag remove buttons
  document.querySelectorAll('.tag-remove').forEach(button => {
    button.addEventListener('click', function() {
      this.parentElement.remove();
    });
  });
  
  // Media Uploader Click
  const mediaUploader = document.querySelector('.media-uploader');
  
  mediaUploader.addEventListener('click', function() {
    // In a real app, this would open a file selector
    // For this prototype, we'll show a toast notification
    showToast('File upload will be implemented in the full version');
  });
  
  // Publish Button
  const publishBtn = document.querySelector('.editor-btn.publish');
  
  publishBtn.addEventListener('click', function() {
    showLoading('Publishing your post...');
    
    // Simulate API call
    setTimeout(() => {
      hideLoading();
      showToast('Post published successfully!', 'success');
    }, 1500);
  });
  
  // Save Draft Button
  const saveDraftBtn = document.querySelector('.editor-btn.save-draft');
  
  saveDraftBtn.addEventListener('click', function() {
    showLoading('Saving draft...');
    
    // Simulate API call
    setTimeout(() => {
      hideLoading();
      showToast('Draft saved successfully!', 'success');
    }, 1000);
  });
  
  // Delete Button Handlers
  const deleteButtons = document.querySelectorAll('.action-btn.delete');
  const deleteModal = document.getElementById('deleteModal');
  const closeModalBtn = document.querySelector('.modal-close');
  const cancelDeleteBtn = document.querySelector('.modal-btn.cancel');
  const confirmDeleteBtn = document.querySelector('.modal-btn.delete');
  
  deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
      deleteModal.classList.add('active');
    });
  });
  
  function closeModal() {
    deleteModal.classList.remove('active');
  }
  
  closeModalBtn.addEventListener('click', closeModal);
  cancelDeleteBtn.addEventListener('click', closeModal);
  
  confirmDeleteBtn.addEventListener('click', function() {
    showLoading('Deleting post...');
    
    // Simulate API call
    setTimeout(() => {
      hideLoading();
      closeModal();
      showToast('Post deleted successfully!', 'success');
    }, 1000);
  });
  
  // New Post Button
  const newPostBtn = document.querySelector('.create-post-btn');
  
  newPostBtn.addEventListener('click', function() {
    showLoading('Creating new post...');
    
    // Simulate API call
    setTimeout(() => {
      // Clear editor
      quill.setText('');
      document.getElementById('title').value = '';
      
      // Remove all tags except the input
      const tags = document.querySelectorAll('.tag');
      tags.forEach(tag => tag.remove());
      
      hideLoading();
      showToast('New post created!', 'success');
    }, 1000);
  });
  
  // AI Assistant Button Handlers
  const acceptAIBtn = document.querySelector('.ai-btn.accept');
  const ignoreAIBtn = document.querySelector('.ai-btn.ignore');
  
  acceptAIBtn.addEventListener('click', function() {
    showLoading('Applying AI suggestions...');
    
    // Simulate API call
    setTimeout(() => {
      hideLoading();
      showToast('AI suggestions applied!', 'success');
      
      // Close AI assistant
      aiAssistant.classList.remove('open');
    }, 1200);
  });
  
  ignoreAIBtn.addEventListener('click', function() {
    // Close AI assistant
    aiAssistant.classList.remove('open');
    showToast('AI suggestions ignored', 'info');
  });
  
  // Share Buttons
  const shareButtons = document.querySelectorAll('.share-btn');
  
  shareButtons.forEach(button => {
    button.addEventListener('click', function() {
      showToast('Sharing functionality will be implemented in the full version');
    });
  });
  
  // Helper Functions
  function showLoading(message = 'Loading...') {
    const loadingContainer = document.querySelector('.loading-container');
    const loadingText = document.querySelector('.loading-text');
    
    loadingText.textContent = message;
    loadingContainer.classList.add('active');
  }
  
  function hideLoading() {
    const loadingContainer = document.querySelector('.loading-container');
    loadingContainer.classList.remove('active');
  }
  
  function showToast(message, type = 'info') {
    const bgColors = {
      success: 'linear-gradient(to right, #10b981, #059669)',
      error: 'linear-gradient(to right, #ef4444, #dc2626)',
      info: 'linear-gradient(to right, #4f46e5, #4338ca)',
      warning: 'linear-gradient(to right, #f59e0b, #d97706)'
    };
    
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "right",
      style: {
        background: bgColors[type],
        borderRadius: "8px",
        fontFamily: "'Inter', sans-serif",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
      }
    }).showToast();
  }
});