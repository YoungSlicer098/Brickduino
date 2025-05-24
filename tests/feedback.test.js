/**
 * @jest-environment jsdom
 */

describe('Feedback System Tests', () => {
  let validateInput, containsProfanity, submitFeedback, fetchFeedback, 
      displayFeedbackBatch, startCooldownTimer, escapeHtml;

  beforeEach(() => {
    // Reset the DOM
    document.body.innerHTML = `
      <form id="feedbackForm">
        <input type="text" id="name" required>
        <textarea id="feedbackText" required></textarea>
        <button type="submit" id="submit-feedback">Submit Feedback</button>
      </form>
      <div id="feedbackList"></div>
    `;

    // Reset global variables
    global.lastSubmitTime = 0;
    global.visibleFeedbackCount = 5;

    // Mock console.error
    console.error = jest.fn();

    // Mock alert
    global.alert = jest.fn();

    // Mock fetch
    global.fetch = jest.fn((url) => {
      if (url.includes('?action=getFeedback')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(JSON.stringify([
            { name: 'Test User', feedback: 'Test Feedback', timestamp: new Date().toISOString() }
          ]))
        });
      } else {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('{"success": true}')
        });
      }
    });

    // Mock timers
    jest.useFakeTimers();

    // Clear all mocks
    jest.clearAllMocks();

    // Clear any existing intervals
    jest.clearAllTimers();

    // Load the feedback.js file
    jest.isolateModules(() => {
      require('../scripts/feedback.js');
    });

    // Initialize test environment
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Get function references
    validateInput = window.validateInput;
    containsProfanity = window.containsProfanity;
    submitFeedback = window.submitFeedback;
    fetchFeedback = window.fetchFeedback;
    displayFeedbackBatch = window.displayFeedbackBatch;
    startCooldownTimer = window.startCooldownTimer;
    escapeHtml = window.escapeHtml;
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    global.lastSubmitTime = 0;
    window.lastSubmitTime = 0;
  });

  describe('Input Validation', () => {
    test('validateInput accepts valid input', () => {
      expect(() => validateInput('John Doe', 'Great website!')).not.toThrow();
    });

    test('validateInput rejects long names', () => {
      const longName = 'a'.repeat(51);
      expect(() => validateInput(longName, 'Test')).toThrow(/Name must be/);
    });

    test('validateInput rejects long feedback', () => {
      const longFeedback = 'a'.repeat(501);
      expect(() => validateInput('Test', longFeedback)).toThrow(/Feedback must be/);
    });

    test('validateInput rejects invalid name format', () => {
      expect(() => validateInput('John@Doe', 'Test')).toThrow(/Name can only contain/);
    });

    test('validateInput rejects profanity in name', () => {
      expect(() => validateInput('fuck test', 'Good')).toThrow(/family-friendly/);
    });

    test('validateInput rejects profanity in feedback', () => {
      expect(() => validateInput('John', 'This is shit')).toThrow(/family-friendly/);
    });

    test('validateInput detects leet speak profanity', () => {
      expect(() => validateInput('John', 'This is sh1t')).toThrow(/family-friendly/);
    });
  });

  describe('Profanity Filter', () => {
    test('containsProfanity detects English profanity', () => {
      expect(containsProfanity('This is shit')).toBe(true);
    });

    test('containsProfanity detects Filipino profanity', () => {
      expect(containsProfanity('gago ka')).toBe(true);
    });

    test('containsProfanity detects leet speak', () => {
      expect(containsProfanity('sh1t')).toBe(true);
      expect(containsProfanity('g@go')).toBe(true);
    });

    test('containsProfanity allows clean text', () => {
      expect(containsProfanity('This is great')).toBe(false);
    });
  });

  describe('Feedback Submission', () => {
    test('submitFeedback enforces cooldown', async () => {
      const event = { preventDefault: jest.fn() };
      document.getElementById('name').value = 'Test User';
      document.getElementById('feedbackText').value = 'Test Feedback';
      
      // First submission
      await submitFeedback(event);
      expect(alert).toHaveBeenCalledWith('Thank you for your feedback!');
      
      // Second submission
      await submitFeedback(event);
      expect(alert).toHaveBeenLastCalledWith(expect.stringContaining('Please wait'));
    });

    test('submitFeedback handles successful submission', async () => {
      const event = { preventDefault: jest.fn() };
      document.getElementById('name').value = 'Test User';
      document.getElementById('feedbackText').value = 'Test Feedback';
      
      // Reset lastSubmitTime to allow submission
      global.lastSubmitTime = 0;
      
      await submitFeedback(event);
      expect(alert).toHaveBeenCalledWith('Thank you for your feedback!');
    });

    test('submitFeedback handles validation errors', async () => {
      const event = { preventDefault: jest.fn() };
      document.getElementById('name').value = '!!!';
      document.getElementById('feedbackText').value = 'Test Feedback';
      
      // Reset lastSubmitTime to allow submission
      global.lastSubmitTime = 0;
      
      await submitFeedback(event);
      expect(alert).toHaveBeenCalledWith(expect.stringContaining('Name can only contain'));
    });
  });

  describe('Feedback Display', () => {
    test('displayFeedbackBatch shows correct number of items', () => {
      const feedbackData = [
        { name: 'User1', feedback: 'Feedback1', timestamp: new Date().toISOString() },
        { name: 'User2', feedback: 'Feedback2', timestamp: new Date().toISOString() },
        { name: 'User3', feedback: 'Feedback3', timestamp: new Date().toISOString() }
      ];

      displayFeedbackBatch(feedbackData);
      expect(document.querySelectorAll('.feedback-item').length).toBe(3);
    });

    test('displayFeedbackBatch shows "Show More" button when needed', () => {
      const feedbackData = Array(10).fill().map((_, i) => ({
        name: `User${i}`,
        feedback: `Feedback${i}`,
        timestamp: new Date().toISOString()
      }));

      displayFeedbackBatch(feedbackData);
      expect(document.querySelector('.show-more-button')).not.toBeNull();
    });

    test('displayFeedbackBatch escapes HTML in feedback', () => {
      const feedbackData = [{
        name: '<script>alert("xss")</script>',
        feedback: '<img src="x" onerror="alert(1)">',
        timestamp: new Date().toISOString()
      }];

      displayFeedbackBatch(feedbackData);
      const item = document.querySelector('.feedback-item');
      expect(item.innerHTML).not.toContain('<script>');
      expect(item.innerHTML).not.toContain('<img');
    });
  });

  describe('Cooldown Timer', () => {
    test('startCooldownTimer updates button text', () => {
      jest.useFakeTimers();
      const button = document.getElementById('submit-feedback');
      
      startCooldownTimer(button);
      expect(button.textContent).toBe('Wait 30s');
      
      jest.advanceTimersByTime(1000);
      expect(button.textContent).toBe('Wait 29s');
      
      jest.advanceTimersByTime(29000);
      expect(button.textContent).toBe('Submit Feedback');
      expect(button.disabled).toBe(false);
      
      jest.useRealTimers();
    });
  });

  describe('API Integration', () => {
    test('fetchFeedback makes correct API call', async () => {
      await fetchFeedback();
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('?action=getFeedback'));
    });

    test('submitFeedback sends correct form data', async () => {
      const event = { preventDefault: jest.fn() };
      document.getElementById('name').value = 'Test User';
      document.getElementById('feedbackText').value = 'Test Feedback';
      
      // Reset lastSubmitTime to allow submission
      global.lastSubmitTime = 0;
      
      // Clear previous fetch calls
      fetch.mockClear();
      
      await submitFeedback(event);
      
      // Get the first fetch call (submission)
      const fetchCalls = fetch.mock.calls;
      expect(fetchCalls.length).toBeGreaterThan(0);
      
      const [url, options] = fetchCalls[0];
      expect(url).toBe(SCRIPT_URL);
      expect(options).toEqual(expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData)
      }));
    });

    test('handles API error gracefully', async () => {
      global.fetch = jest.fn(() =>
        Promise.reject(new Error('API Error'))
      );

      await fetchFeedback();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('Feedback Refresh', () => {
    beforeEach(() => {
        // Clear any existing intervals
        if (window.refreshInterval) {
            clearInterval(window.refreshInterval);
            window.refreshInterval = null;
        }
        jest.clearAllTimers();
    });

    afterEach(() => {
        // Clean up interval
        if (window.refreshInterval) {
            clearInterval(window.refreshInterval);
            window.refreshInterval = null;
        }
    });

    test('automatically refreshes feedback at intervals', () => {
        // Clear any previous fetch calls
        fetch.mockClear();
        
        // Re-initialize to trigger the interval setup
        document.dispatchEvent(new Event('DOMContentLoaded'));
        
        // Record the number of fetch calls after initialization
        const initialFetchCalls = fetch.mock.calls.length;
        
        // Fast forward time
        jest.advanceTimersByTime(10000); // 10 seconds

        // Verify that fetch was called at least once more during the interval
        expect(fetch.mock.calls.length).toBeGreaterThan(initialFetchCalls);
        
        // Verify the last fetch call was for getting feedback
        const lastCall = fetch.mock.calls[fetch.mock.calls.length - 1];
        expect(lastCall[0]).toBe(`${SCRIPT_URL}?action=getFeedback`);
    });

    test('sorts feedback by timestamp', async () => {
      const mockData = [
        { name: 'User 1', feedback: 'Feedback 1', timestamp: '2024-03-20T10:00:00Z' },
        { name: 'User 2', feedback: 'Feedback 2', timestamp: '2024-03-20T11:00:00Z' }
      ];

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          text: () => Promise.resolve(JSON.stringify(mockData))
        })
      );

      await fetchFeedback();
      const feedbackItems = document.querySelectorAll('.feedback-item');
      expect(feedbackItems[0].textContent).toContain('User 2');
      expect(feedbackItems[1].textContent).toContain('User 1');
    });
  });

  describe('HTML Escaping', () => {
    test('escapes HTML in feedback content', () => {
      const unsafeHtml = '<script>alert("xss")</script>';
      const escaped = escapeHtml(unsafeHtml);
      expect(escaped).not.toContain('<script>');
      expect(escaped).toContain('&lt;script&gt;');
    });

    test('escapes all dangerous characters', () => {
      const unsafe = '&<>"\'/';
      const escaped = escapeHtml(unsafe);
      expect(escaped).toBe('&amp;&lt;&gt;&quot;&#039;/');
    });
  });

  describe('Show More Functionality', () => {
    test('shows correct number of initial feedback items', async () => {
      const mockData = Array.from({ length: 10 }, (_, i) => ({
        name: `User ${i}`,
        feedback: `Feedback ${i}`,
        timestamp: new Date().toISOString()
      }));

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          text: () => Promise.resolve(JSON.stringify(mockData))
        })
      );

      await fetchFeedback();
      const feedbackItems = document.querySelectorAll('.feedback-item');
      expect(feedbackItems.length).toBe(5);
    });

    test('loads more items when show more is clicked', async () => {
      const mockData = Array.from({ length: 10 }, (_, i) => ({
        name: `User ${i}`,
        feedback: `Feedback ${i}`,
        timestamp: new Date().toISOString()
      }));

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          text: () => Promise.resolve(JSON.stringify(mockData))
        })
      );

      await fetchFeedback();
      const showMoreButton = document.querySelector('.show-more-button');
      showMoreButton.click();

      const feedbackItems = document.querySelectorAll('.feedback-item');
      expect(feedbackItems.length).toBe(10);
    });

    test('hides show more button when all items are displayed', async () => {
      const mockData = Array.from({ length: 5 }, (_, i) => ({
        name: `User ${i}`,
        feedback: `Feedback ${i}`,
        timestamp: new Date().toISOString()
      }));

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          text: () => Promise.resolve(JSON.stringify(mockData))
        })
      );

      await fetchFeedback();
      // Since we only have 5 items (equal to visibleFeedbackCount),
      // the show more button should not be present
      expect(document.querySelector('.show-more-button')).toBeNull();
    });
  });

  describe('Error Handling', () => {
    test('handles malformed JSON response', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          text: () => Promise.resolve('invalid json')
        })
      );
      
      await fetchFeedback();
      expect(console.error).toHaveBeenCalled();
    });

    test('handles network errors during submission', async () => {
      // Mock a failed fetch request
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          text: () => Promise.resolve('{"error": "Internal Server Error"}')
        })
      );

      const event = { preventDefault: jest.fn() };
      document.getElementById('name').value = 'Test User';
      document.getElementById('feedbackText').value = 'Test Feedback';
      
      // Reset lastSubmitTime to allow submission
      global.lastSubmitTime = 0;
      
      await submitFeedback(event);
      expect(alert).toHaveBeenCalledWith('Sorry, there was an error submitting your feedback. Please try again.');
    });

    test('handles invalid form data', async () => {
      const event = { preventDefault: jest.fn() };
      document.getElementById('name').value = '!!!';
      document.getElementById('feedbackText').value = '';
      
      // Reset lastSubmitTime to allow submission
      global.lastSubmitTime = 0;
      
      await submitFeedback(event);
      expect(alert).toHaveBeenCalledWith(expect.stringContaining('Name can only contain'));
    });
  });
}); 