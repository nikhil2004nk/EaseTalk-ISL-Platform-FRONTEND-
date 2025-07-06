// User authentication state
let isUserLoggedIn = false;
let currentUser = null;


// Check if user is already logged in (using localStorage)
function checkAuthStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isUserLoggedIn = true;
        updateUIForLoggedInUser();
    } else {
        // Show login prompt if user is not logged in
        showLoginPrompt();
    }
}

// Update UI based on authentication state
function updateUIForLoggedInUser() {
    // Hide auth buttons, show user section
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('user-section').style.display = 'flex';
    
    // Show the navigation bar
    document.getElementById('main-navigation').style.display = 'flex';
    
    // Update welcome message with user's name
    if (currentUser && currentUser.name) {
        document.getElementById('welcome-message').textContent = `Welcome, ${currentUser.name}!`;
    }
    
    // Unlock feature cards
    updateFeatureCardsLock();
    
    // Hide login prompt section
    hideLoginPrompt();
}

// Update feature cards lock status
function updateFeatureCardsLock() {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        if (isUserLoggedIn) {
            card.classList.remove('locked');
        } else {
            card.classList.add('locked');
        }
    });
}

// Hide login prompt section when user is logged in
function hideLoginPrompt() {
    const loginPromptSection = document.querySelector('.login-prompt-section');
    if (loginPromptSection) {
        loginPromptSection.style.display = 'none';
    }
}

// Show login prompt section when user logs out
function showLoginPrompt() {
    const loginPromptSection = document.querySelector('.login-prompt-section');
    if (loginPromptSection) {
        loginPromptSection.style.display = 'block';
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    // Get form data
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-pin').value;
    
    // In a real app, you would validate credentials against a server
    // For demo purposes, we'll just simulate successful login
    currentUser = {
        email: email,
        name: email.split('@')[0] // Extract name from email for demo
    };
    
    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    isUserLoggedIn = true;
    
    // Update UI
    updateUIForLoggedInUser();
    
    // Close the login modal
    closeLogin();
    
    // Redirect to intended page if exists
    const intendedPage = localStorage.getItem('intendedPage');
    if (intendedPage) {
        localStorage.removeItem('intendedPage');
        showPage(intendedPage);
    }
    
    return false;
}

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('signup-email').value;
    // Get other form fields as needed
    
    // In a real app, you would send this data to your server
    // For demo purposes, we'll just simulate successful signup
    currentUser = {
        name: name,
        email: email
    };
    
    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    isUserLoggedIn = true;
    
    // Update UI
    updateUIForLoggedInUser();
    
    // Close the signup modal
    closeSignup();
    
    // Redirect to intended page if exists
    const intendedPage = localStorage.getItem('intendedPage');
    if (intendedPage) {
        localStorage.removeItem('intendedPage');
        showPage(intendedPage);
    }
    
    return false;
}

// Handle logout
function logoutUser() {
    // Clear user data
    localStorage.removeItem('currentUser');
    currentUser = null;
    isUserLoggedIn = false;
    
    // Update UI: show auth buttons, hide user section and navigation
    document.getElementById('auth-section').style.display = 'flex';
    document.getElementById('user-section').style.display = 'none';
    document.getElementById('main-navigation').style.display = 'none';
    
    // Lock feature cards
    updateFeatureCardsLock();
    
    // Show login prompt section
    showLoginPrompt();
    
    // Return to landing page
    showPage('landing');
}

// Modal Functions
function openLogin() {
    const modal = document.getElementById('loginModal');
    modal.style.display = "block";
    setTimeout(() => {
        modal.classList.add('modal-active');
    }, 10);
}

function closeLogin() {
    const modal = document.getElementById('loginModal');
    modal.classList.remove('modal-active');
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
}

function openSignup() {
    const modal = document.getElementById('signupModal');
    modal.style.display = "block";
    setTimeout(() => {
        modal.classList.add('modal-active');
    }, 10);
}

function closeSignup() {
    const modal = document.getElementById('signupModal');
    modal.classList.remove('modal-active');
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
}

// Enhanced page transition
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
        page.classList.add('page-exit');
    });

    const pageToShow = document.getElementById(pageId);
    if (pageToShow) {
        setTimeout(() => {
            pages.forEach(page => page.classList.remove('page-exit'));
            pageToShow.classList.add('active');
            // Reinitialize AOS for new content
            AOS.refresh();
        }, 300);
    }

    // Update nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === pageId) {
            item.classList.add('active');
        }
    });

    // If interaction page is shown, initialize quiz components
    if (pageId === 'interaction') {
        initializeQuiz();
    }
}

// Check authentication before navigating to features
function checkAuthAndNavigate(pageId) {
    if (!isUserLoggedIn) {
        // Show login prompt modal or redirect to login
        openLogin();
        // Store the intended destination
        localStorage.setItem('intendedPage', pageId);
        return;
    }
    
    // User is logged in, proceed to the page
    showPage(pageId);
}

// Initialize quiz components
function initializeQuiz() {
    // Reset all quiz sections to initial state
    document.getElementById('mainMenu').style.display = 'block';
    document.getElementById('mcqSection').style.display = 'none';
    document.getElementById('practicalSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';
    
    // Reset scores and counters
    document.getElementById('pointsCounter').textContent = '0';
    document.getElementById('currentQuestion').textContent = '1';
}

// Filter gestures in learning page
function filterGestures() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const gestureCards = document.querySelectorAll('.gesture-card');
    let visibleCards = 0;

    gestureCards.forEach(card => {
        const gestureName = card.getAttribute('data-name').toLowerCase();
        if (gestureName.includes(searchInput)) {
            card.classList.remove('hidden');
            visibleCards++;
        } else {
            card.classList.add('hidden');
        }
    });

    // Show "No Results Found" message
    const noResultsMessage = document.getElementById('noResultsMessage');
    if (visibleCards === 0) {
        if (!noResultsMessage) {
            const message = document.createElement('p');
            message.id = 'noResultsMessage';
            message.textContent = 'No gestures found. Try another search!';
            document.querySelector('.gallery-grid').appendChild(message);
        }
    } else if (noResultsMessage) {
        noResultsMessage.remove();
    }

    // Reorder cards to show search results first
    const galleryGrid = document.querySelector('.gallery-grid');
    const cardsArray = Array.from(gestureCards);
    cardsArray.sort((a, b) => {
        const aVisible = !a.classList.contains('hidden');
        const bVisible = !b.classList.contains('hidden');
        return bVisible - aVisible; // Show visible cards first
    });

    // Append sorted cards back to the grid
    cardsArray.forEach(card => galleryGrid.appendChild(card));
}

// Speech Recognition Setup
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    const startBtn = document.getElementById('start-btn');
    const outputText = document.getElementById('output-text');

    startBtn.addEventListener('click', () => {
        recognition.start();
        outputText.textContent = 'Listening...';
        startBtn.disabled = true;
        startBtn.textContent = 'Listening...';
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        outputText.textContent = transcript;
        startBtn.disabled = false;
        startBtn.textContent = 'Start Listening';
    };

    recognition.onerror = (event) => {
        outputText.textContent = 'Error occurred: ' + event.error;
        startBtn.disabled = false;
        startBtn.textContent = 'Start Listening';
    };

    recognition.onend = () => {
        if (outputText.textContent === 'Listening...') {
            outputText.textContent = 'No speech detected. Try again.';
        }
        startBtn.disabled = false;
        startBtn.textContent = 'Start Listening';
    };
} else {
    console.warn('Web Speech API not supported in this browser');
}

// Footer section handling
document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".footer-link");
    const sections = document.querySelectorAll(".section-content");

    // Hide all sections initially
    sections.forEach(section => section.style.display = "none");

    links.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            // Get the target section ID from the data-section attribute
            const targetSectionId = this.getAttribute("data-section");
            const targetSection = document.getElementById(targetSectionId);

            // Hide all sections
            sections.forEach(section => section.style.display = "none");

            // Show the target section
            if (targetSection) {
                targetSection.style.display = "block";
            }
        });
    });
});

// Initialize all functionality on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    checkAuthStatus();
    
    // Initialize AOS Animation Library
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true
    });
    
    // Show landing page by default
    showPage('landing');
    
    // Initialize form event listeners
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
    
    // Set initial feature cards lock status
    updateFeatureCardsLock();
    
    // Add scroll-based animations
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
});

// Close modal on outside click
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    
    if (event.target === loginModal) {
        closeLogin();
    }
    if (event.target === signupModal) {
        closeSignup();
    }
};