$(document).ready(function() {
    // Initialize variables and state
    let counterValue = localStorage.getItem('counterValue') ? parseInt(localStorage.getItem('counterValue')) : 0;
    let darkMode = localStorage.getItem('darkMode') === 'true';
    
    // Sample data for search functionality
    const searchData = [
      { id: 1, title: 'Dashboard Overview', subtitle: 'Main dashboard page' },
      { id: 2, title: 'User Profile', subtitle: 'User settings and preferences' },
      { id: 3, title: 'Analytics', subtitle: 'Data visualization and reports' },
      { id: 4, title: 'Task Management', subtitle: 'Create and manage tasks' },
      { id: 5, title: 'Calendar', subtitle: 'Schedule events and reminders' },
      { id: 6, title: 'Messages', subtitle: 'Inbox and communication' },
      { id: 7, title: 'Settings', subtitle: 'Application configuration' },
      { id: 8, title: 'Team Members', subtitle: 'Manage team and roles' }
    ];
    
    // Timeline data (will be fetched from API)
    const timelineData = [
      { id: 1, title: 'Project Created', time: '2 hours ago', icon: 'fas fa-plus-circle' },
      { id: 2, title: 'New Team Member Added', time: 'Yesterday', icon: 'fas fa-user-plus' },
      { id: 3, title: 'Client Meeting', time: '3 days ago', icon: 'fas fa-handshake' },
      { id: 4, title: 'Task Completed', time: 'Last week', icon: 'fas fa-check-circle' },
      { id: 5, title: 'Project Milestone Reached', time: '2 weeks ago', icon: 'fas fa-flag' }
    ];
    
    // Apply dark mode if set
    if (darkMode) {
      $('body').addClass('dark-mode');
      $('#theme-toggle i').removeClass('fa-moon').addClass('fa-sun');
    }
    
    // Set initial counter value
    $('#counter-value').text(counterValue);
    
    // Initialize Chart
    const ctx = document.getElementById('dataChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Monthly Performance',
          data: [65, 59, 80, 81, 56, 90],
          backgroundColor: '#6c5ce7',
          borderColor: '#6c5ce7',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    
    // Counter functionality
    $('#increment-btn').on('click', function() {
      counterValue++;
      updateCounter();
    });
    
    $('#decrement-btn').on('click', function() {
      if (counterValue > 0) {
        counterValue--;
        updateCounter();
      }
    });
    
    $('#reset-btn').on('click', function() {
      counterValue = 0;
      updateCounter();
    });
    
    function updateCounter() {
      $('#counter-value').text(counterValue);
      localStorage.setItem('counterValue', counterValue);
    }
    
    // Theme toggle functionality
    $('#theme-toggle').on('click', function() {
      $('body').toggleClass('dark-mode');
      const isDarkMode = $('body').hasClass('dark-mode');
      
      if (isDarkMode) {
        $(this).find('i').removeClass('fa-moon').addClass('fa-sun');
      } else {
        $(this).find('i').removeClass('fa-sun').addClass('fa-moon');
      }
      
      localStorage.setItem('darkMode', isDarkMode);
    });
    
    // Search functionality
    $('#search-input').on('keyup', function() {
      const searchTerm = $(this).val().toLowerCase();
      
      if (searchTerm.length === 0) {
        $('#search-results').empty();
        return;
      }
      
      const filteredResults = searchData.filter(item => 
        item.title.toLowerCase().includes(searchTerm) || 
        item.subtitle.toLowerCase().includes(searchTerm)
      );
      
      displaySearchResults(filteredResults);
    });
    
    function displaySearchResults(results) {
      const $searchResults = $('#search-results');
      $searchResults.empty();
      
      if (results.length === 0) {
        $searchResults.append('<div class="search-item">No results found</div>');
        return;
      }
      
      results.forEach(result => {
        const $searchItem = $(`
          <div class="search-item scale-in">
            <div class="search-item-title">${result.title}</div>
            <div class="search-item-subtitle">${result.subtitle}</div>
          </div>
        `);
        
        $searchResults.append($searchItem);
      });
    }
    
    // Form validation and interaction
    $('#interactive-form').on('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      
      // Username validation
      const username = $('#username').val();
      if (username.length < 3) {
        $('#username').addClass('is-invalid');
        isValid = false;
      } else {
        $('#username').removeClass('is-invalid');
      }
      
      // Email validation
      const email = $('#email').val();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        $('#email').addClass('is-invalid');
        isValid = false;
      } else {
        $('#email').removeClass('is-invalid');
      }
      
      if (isValid) {
        // Save form data to localStorage
        const formData = {
          username: username,
          email: email,
          interest: $('#interest').val(),
          emailNotifications: $('#email-notifications').is(':checked'),
          smsNotifications: $('#sms-notifications').is(':checked'),
          frequency: $('#frequency').val()
        };
        
        localStorage.setItem('formData', JSON.stringify(formData));
        
        // Show success message
        alert('Settings saved successfully!');
      }
    });
    
    // Conditional display based on checkbox state
    $('#email-notifications, #sms-notifications').on('change', function() {
      if ($('#email-notifications').is(':checked') || $('#sms-notifications').is(':checked')) {
        $('#additional-settings').addClass('active');
      } else {
        $('#additional-settings').removeClass('active');
      }
    });
    
    // Load form data from localStorage if available
    if (localStorage.getItem('formData')) {
      const formData = JSON.parse(localStorage.getItem('formData'));
      
      $('#username').val(formData.username);
      $('#email').val(formData.email);
      $('#interest').val(formData.interest);
      $('#email-notifications').prop('checked', formData.emailNotifications);
      $('#sms-notifications').prop('checked', formData.smsNotifications);
      $('#frequency').val(formData.frequency);
      
      // Show conditional section if needed
      if (formData.emailNotifications || formData.smsNotifications) {
        $('#additional-settings').addClass('active');
      }
    }
    
    // Simulate loading timeline data (would be an API call)
    setTimeout(function() {
      $('#timeline-spinner').hide();
      $('#timeline-content').show();
      
      // Populate timeline
      timelineData.forEach(item => {
        const timelineItem = `
          <div class="search-item fade-in">
            <div class="search-item-title">
              <i class="${item.icon}" style="color: var(--primary); margin-right: 10px;"></i>
              ${item.title}
            </div>
            <div class="search-item-subtitle">${item.time}</div>
          </div>
        `;
        
        $('#timeline-content').append(timelineItem);
      });
    }, 1500);
  });