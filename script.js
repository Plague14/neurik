// Neurik Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initScrollReveal();
    initSmoothScroll();
    initMobileMenu();
    initCarousel();
    initTimelineDots();
    initHeaderScroll();
    initCurrentYear();
});

// Set current year in footer
function initCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Scroll Reveal Animation
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.benefit-card, .protocol-card, .routine-card, .testimonial-card'
    );

    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    };

    // Initial check
    revealOnScroll();

    // Check on scroll
    window.addEventListener('scroll', revealOnScroll);
}

// Smooth Scroll for anchor links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const nav = document.querySelector('.nav');
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                }
            }
        });
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const header = document.querySelector('.header');

    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');

            // Animate hamburger to X
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Add mobile nav styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .nav.active {
                display: flex;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: rgba(10, 10, 15, 0.98);
                padding: 20px;
                border-bottom: 1px solid var(--border-color);
                gap: 16px;
            }

            .nav.active .nav-link {
                padding: 12px 0;
                border-bottom: 1px solid rgba(39, 39, 42, 0.5);
            }
        }
    `;
    document.head.appendChild(style);
}

// Testimonials Carousel
function initCarousel() {
    const track = document.querySelector('.testimonials-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    const totalCards = cards.length;
    let cardsToShow = 3;

    // Update cards to show based on screen size
    const updateCardsToShow = () => {
        if (window.innerWidth < 768) {
            cardsToShow = 1;
        } else if (window.innerWidth < 1024) {
            cardsToShow = 2;
        } else {
            cardsToShow = 3;
        }
    };

    updateCardsToShow();
    window.addEventListener('resize', updateCardsToShow);

    // Navigate carousel
    const goToSlide = (index) => {
        const maxIndex = Math.max(0, totalCards - cardsToShow);
        currentIndex = Math.max(0, Math.min(index, maxIndex));

        const cardWidth = cards[0].offsetWidth + 24; // card width + gap
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        track.style.transition = 'transform 0.5s ease';
    };

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
        });
    }

    // Add swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(currentIndex - 1);
            }
        }
    };
}

// Timeline dots interaction
function initTimelineDots() {
    const dots = document.querySelectorAll('.timeline-dot');
    const cards = document.querySelectorAll('.routine-card');

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            // Update active dot
            dots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');

            // Highlight corresponding card
            cards.forEach((card, cardIndex) => {
                if (cardIndex === index) {
                    card.style.borderColor = 'var(--primary)';
                    card.style.transform = 'translateY(-4px)';
                } else {
                    card.style.borderColor = 'var(--border-color)';
                    card.style.transform = 'translateY(0)';
                }
            });
        });

        // Also add hover effect linking cards and dots
        dot.addEventListener('mouseenter', () => {
            if (cards[index]) {
                cards[index].style.borderColor = 'var(--primary)';
            }
        });

        dot.addEventListener('mouseleave', () => {
            if (!dot.classList.contains('active') && cards[index]) {
                cards[index].style.borderColor = 'var(--border-color)';
            }
        });
    });
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add black background when scrolled (minimum scroll)
        if (currentScroll > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show header on scroll direction
        if (currentScroll > lastScroll && currentScroll > 300) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    // Add transition for smooth hide/show
    header.style.transition = 'transform 0.3s ease';
}

// Parallax effect for hero background
function initParallax() {
    const glows = document.querySelectorAll('.glow');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        glows.forEach((glow, index) => {
            const speed = index === 0 ? 0.3 : 0.2;
            glow.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Button hover effects
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mouseenter', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.style.setProperty('--x', x + 'px');
        this.style.setProperty('--y', y + 'px');
    });
});

// Count up animation for stats
function animateCountUp(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const updateCount = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString();
            requestAnimationFrame(updateCount);
        } else {
            element.textContent = target.toLocaleString();
        }
    };

    updateCount();
}

// Initialize count up when testimonials section is visible
const testimonialsSection = document.querySelector('.testimonials');
if (testimonialsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statElement = document.querySelector('.section-title');
                if (statElement && statElement.textContent.includes('25.000')) {
                    // Animation already in text, could be enhanced with JS
                }
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(testimonialsSection);
}

// Lazy loading for images (when actual images are added)
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Form validation (for future forms)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    return isValid;
}

// Utility: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Utility: Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Console welcome message
console.log('%cNeurik', 'font-size: 24px; font-weight: bold; color: #2563EB;');
console.log('%cSuplementos para Performance Cognitiva', 'font-size: 14px; color: #A1A1AA;');
