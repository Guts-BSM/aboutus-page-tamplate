/**
 * API Club Website - Interactive JavaScript
 * Handles navigation, animations, form validation, and user interactions
 */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initSmoothScrolling();
    initAccessibility();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');

    if (hamburger && navList) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navList.classList.toggle('active');

            // Update aria-expanded
            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
        });

        // Close mobile menu when clicking on a link
        navList.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navList.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navList.contains(event.target)) {
                hamburger.classList.remove('active');
                navList.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Update active nav link on scroll
    updateActiveNavLink();
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll-triggered animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements that should animate in
    document.querySelectorAll('.activity-card, .contact-item').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Update active navigation link based on scroll position
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Update active nav link on scroll
window.addEventListener('scroll', updateActiveNavLink);

/**
 * Contact form validation and submission
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!validateForm()) return;

        // Show loading state
        submitBtn.disabled = true;
        btnText.style.opacity = '0';
        btnLoader.style.display = 'inline-block';

        try {
            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');

            // Reset form
            form.reset();

        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.opacity = '1';
            btnLoader.style.display = 'none';
        }
    });
}

/**
 * Validate individual form field
 */
function validateField(e) {
    const field = e.target;
    const errorElement = document.getElementById(`${field.name}-error`);

    if (!errorElement) return;

    let isValid = true;
    let errorMessage = '';

    switch (field.name) {
        case 'name':
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'Name is required';
            } else if (field.value.trim().length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters';
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'Email is required';
            } else if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;

        case 'subject':
            if (!field.value) {
                isValid = false;
                errorMessage = 'Please select a subject';
            }
            break;

        case 'message':
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'Message is required';
            } else if (field.value.trim().length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters';
            }
            break;
    }

    if (!isValid) {
        field.classList.add('invalid');
        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';
    } else {
        field.classList.remove('invalid');
        errorElement.style.display = 'none';
    }

    return isValid;
}

/**
 * Clear field error on input
 */
function clearFieldError(e) {
    const field = e.target;
    const errorElement = document.getElementById(`${field.name}-error`);

    if (errorElement && errorElement.style.display === 'block') {
        field.classList.remove('invalid');
        errorElement.style.display = 'none';
    }
}

/**
 * Validate entire form
 */
function validateForm() {
    const inputs = document.querySelectorAll('#contactForm input, #contactForm textarea, #contactForm select');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });

    return isValid;
}

/**
 * Show notification
 */
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                ${type === 'success' ? '✓' : '✕'}
            </div>
            <div class="notification-message">${message}</div>
        </div>
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/**
 * Accessibility enhancements
 */
function initAccessibility() {
    // Keyboard navigation for hamburger menu
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }

    // Focus management for mobile menu
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
        link.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown' && index < navLinks.length - 1) {
                e.preventDefault();
                navLinks[index + 1].focus();
            } else if (e.key === 'ArrowUp' && index > 0) {
                e.preventDefault();
                navLinks[index - 1].focus();
            }
        });
    });
}

/**
 * Performance optimizations
 */
function initPerformanceOptimizations() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize performance optimizations
initPerformanceOptimizations();