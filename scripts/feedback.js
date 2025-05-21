// Google Sheets API configuration
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby19NIvXrm4iJ_eKfayLJZ7kvySFO7ubReeGwrTn8MAh9x1Sw5KjepZHGBVs3hz1NVx-g/exec';

// Cooldown configuration (in milliseconds)
const SUBMIT_COOLDOWN = 30000; // 30 seconds cooldown
const REFRESH_INTERVAL = 10000; // 10 seconds refresh interval
let lastSubmitTime = 0;

// Input validation configuration
const MAX_NAME_LENGTH = 50;
const MAX_FEEDBACK_LENGTH = 500;
const NAME_REGEX = /^[a-zA-Z0-9\s._-]{2,}$/; // Allows letters, numbers, spaces, dots, underscores, and hyphens

// Profanity filter - Combined English and Filipino curse words
const PROFANITY_LIST = [
    // English profanity
    'fuck', 'shit', 'ass', 'bitch', 'dick', 'pussy', 'cock', 'bastard', 'suck',
    // Filipino profanity
    'putang', 'puta', 'tangina', 'gago', 'gaga', 'putangina', 'tanga', 'bobo', 'ulol',
    'inutil', 'kupal', 'tarantado', 'siraulo', 'pakyu', 'lintik', 'leche', 'pakshet',
    'punyeta', 'hinayupak', 'hayop', 'kingina'
];

// Function to check for profanity
function containsProfanity(text) {
    const normalizedText = text.toLowerCase().replace(/[^\w\s]/g, '');
    const words = normalizedText.split(/\s+/);
    
    // Check each word against the profanity list
    for (const word of words) {
        if (PROFANITY_LIST.some(profanity => word.includes(profanity))) {
            return true;
        }
    }
    
    // Check for common letter substitutions (e.g., @ for a, 1 for i)
    const leetText = normalizedText
        .replace(/[@4]/g, 'a')
        .replace(/[1!|]/g, 'i')
        .replace(/[3]/g, 'e')
        .replace(/[0]/g, 'o')
        .replace(/[5]/g, 's')
        .replace(/[$]/g, 's')
        .replace(/[+]/g, 't');
    
    return PROFANITY_LIST.some(profanity => leetText.includes(profanity));
}

// Function to validate input
function validateInput(name, feedback) {
    // Check name length
    if (name.length > MAX_NAME_LENGTH) {
        throw new Error(`Name must be ${MAX_NAME_LENGTH} characters or less`);
    }
    
    // Check feedback length
    if (feedback.length > MAX_FEEDBACK_LENGTH) {
        throw new Error(`Feedback must be ${MAX_FEEDBACK_LENGTH} characters or less`);
    }
    
    // Check name format
    if (!NAME_REGEX.test(name)) {
        throw new Error('Name can only contain letters, numbers, spaces, dots, underscores, and hyphens');
    }
    
    // Check for profanity in both name and feedback
    if (containsProfanity(name) || containsProfanity(feedback)) {
        throw new Error('Please keep your feedback family-friendly and respectful');
    }
    
    return true;
}

// Function to submit feedback
async function submitFeedback(event) {
    event.preventDefault();
    
    // Check cooldown
    const currentTime = Date.now();
    const timeSinceLastSubmit = currentTime - lastSubmitTime;
    
    if (timeSinceLastSubmit < SUBMIT_COOLDOWN) {
        const remainingTime = Math.ceil((SUBMIT_COOLDOWN - timeSinceLastSubmit) / 1000);
        alert(`Please wait ${remainingTime} seconds before submitting another feedback.`);
        return;
    }
    
    const submitButton = document.getElementById('submit-feedback');
    const name = document.getElementById('name').value.trim();
    const feedback = document.getElementById('feedbackText').value.trim();
    
    try {
        // Validate input before submission
        validateInput(name, feedback);
        
        submitButton.disabled = true;
        const timestamp = new Date().toISOString();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('feedback', feedback);
        formData.append('timestamp', timestamp);

        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: formData
        });

        // Update last submit time
        lastSubmitTime = currentTime;
        
        // Clear the form
        document.getElementById('feedbackForm').reset();
        
        // Add the new feedback to the display immediately
        addFeedbackToDisplay(name, feedback, timestamp);
        
        // Start cooldown timer display
        startCooldownTimer(submitButton);
        
        alert('Thank you for your feedback!');
        
        // Refresh feedback list to ensure synchronization
        await fetchFeedback();
        
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Sorry, there was an error submitting your feedback. Please try again.');
        submitButton.disabled = false;
    }
}

// Function to display cooldown timer
function startCooldownTimer(button) {
    let timeLeft = SUBMIT_COOLDOWN / 1000;
    
    button.textContent = `Wait ${timeLeft}s`;
    
    const timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            button.disabled = false;
            button.textContent = 'Submit Feedback';
        } else {
            button.textContent = `Wait ${timeLeft}s`;
        }
    }, 1000);
}

// Function to fetch existing feedback
async function fetchFeedback() {
    try {
        const response = await fetch(`${SCRIPT_URL}?action=getFeedback`);
        const text = await response.text();  // Get response as text first
        
        try {
            const data = JSON.parse(text);  // Try to parse as JSON
            const feedbackList = document.getElementById('feedbackList');
            feedbackList.innerHTML = ''; // Clear existing feedback
            
            if (Array.isArray(data)) {
                // Sort feedback by timestamp, newest first
                data.sort((a, b) => {
                    const dateA = new Date(a.timestamp).getTime();
                    const dateB = new Date(b.timestamp).getTime();
                    return dateA - dateB; // This will put newest first
                });
                
                data.forEach(item => {
                    addFeedbackToDisplay(item.name, item.feedback, item.timestamp);
                });
            }
        } catch (parseError) {
            console.error('Error parsing feedback data:', parseError);
        }
    } catch (error) {
        console.error('Error fetching feedback:', error);
    }
}

// Function to add feedback to the display
function addFeedbackToDisplay(name, feedback, timestamp) {
    const feedbackList = document.getElementById('feedbackList');
    const feedbackItem = document.createElement('div');
    feedbackItem.className = 'feedback-item';
    
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    
    feedbackItem.innerHTML = `
        <h4>${escapeHtml(name)}</h4>
        <p>${escapeHtml(feedback)}</p>
        <div class="feedback-date">${formattedDate}</div>
    `;
    
    feedbackList.insertBefore(feedbackItem, feedbackList.firstChild);
}

// Helper function to escape HTML and prevent XSS
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('feedbackForm').addEventListener('submit', submitFeedback);
    fetchFeedback(); // Initial load of feedback
    
    // Set up periodic refresh of feedback
    setInterval(fetchFeedback, REFRESH_INTERVAL);
}); 