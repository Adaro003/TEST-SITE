// ============================================
// TRANSFORM PILATES - JAVASCRIPT
// ============================================

// Form Submission Handler
const bookingForm = document.getElementById('bookingForm');
const formMessage = document.getElementById('formMessage');

bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        experience: document.getElementById('experience').value,
        message: document.getElementById('message').value,
        submittedAt: new Date().toLocaleString()
    };
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.service || !formData.date || !formData.time || !formData.experience) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    // Validate email format
    if (!isValidEmail(formData.email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Validate date is in the future
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showMessage('Please select a future date.', 'error');
        return;
    }
    
    // Store booking in localStorage (for demo purposes)
    const existingBookings = JSON.parse(localStorage.getItem('pilatesBookings')) || [];
    existingBookings.push(formData);
    localStorage.setItem('pilatesBookings', JSON.stringify(existingBookings));
    
    // Log booking data (in production, this would be sent to a server)
    console.log('New Booking:', formData);
    
    // Show success message
    showMessage('Booking request submitted! We\'ll confirm within 24 hours. Check your email for details.', 'success');
    
    // Reset form
    bookingForm.reset();
    
    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth' });
    
    // Clear message after 5 seconds
    setTimeout(() => {
        formMessage.classList.remove('success', 'error');
        formMessage.textContent = '';
    }, 5000);
});

// Show message function
function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ============================================
// Smooth Scrolling for Navigation
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// ============================================
// Set minimum date to today
// ============================================

const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${year}-${month}-${day}`;
}

// ============================================
// Booking Management (for instructor/admin view)
// ============================================

function getBookings() {
    return JSON.parse(localStorage.getItem('pilatesBookings')) || [];
}

function displayBookings() {
    const bookings = getBookings();
    console.log('Current Bookings:', bookings);
    return bookings;
}

function deleteBooking(index) {
    const bookings = getBookings();
    bookings.splice(index, 1);
    localStorage.setItem('pilatesBookings', JSON.stringify(bookings));
    console.log('Booking deleted. Remaining bookings:', bookings);
}

function confirmBooking(index) {
    const bookings = getBookings();
    if (bookings[index]) {
        bookings[index].status = 'confirmed';
        localStorage.setItem('pilatesBookings', JSON.stringify(bookings));
        console.log('Booking confirmed:', bookings[index]);
    }
}

// ============================================
// Page Load Animation
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Add animation to elements as they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe service cards, pricing cards
    document.querySelectorAll('.service-card, .pricing-card, .contact-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
});

// ============================================
// Mobile Navigation Toggle (if needed)
// ============================================

function initMobileMenu() {
    // Add mobile menu functionality if you want to expand nav on mobile
    const navMenu = document.querySelector('.nav-menu');
    const logo = document.querySelector('.logo');
    
    // This can be expanded to include a hamburger menu
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.style.display = 'flex';
        }
    });
}

initMobileMenu();

// ============================================
// Analytics (optional - remove if not needed)
// ============================================

function trackEvent(eventName, eventData) {
    console.log(`Event: ${eventName}`, eventData);
    // In production, send this to Google Analytics or similar
}

// Track button clicks
document.querySelectorAll('.cta-button, .booking-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        trackEvent('booking_click', {
            buttonText: this.textContent,
            timestamp: new Date()
        });
    });
});

// ============================================
// Export Functions for Admin Dashboard
// ============================================

window.PilatesAdmin = {
    getBookings: getBookings,
    displayBookings: displayBookings,
    deleteBooking: deleteBooking,
    confirmBooking: confirmBooking,
    exportBookingsCSV: exportBookingsCSV
};

function exportBookingsCSV() {
    const bookings = getBookings();
    if (bookings.length === 0) {
        console.log('No bookings to export');
        return;
    }
    
    // Create CSV header
    const headers = Object.keys(bookings[0]);
    let csv = headers.join(',') + '\n';
    
    // Add booking data
    bookings.forEach(booking => {
        const row = headers.map(header => {
            const value = booking[header];
            // Escape commas and quotes in values
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csv += row.join(',') + '\n';
    });
    
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pilates-bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}