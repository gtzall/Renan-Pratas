// Enhanced Mobile Navigation
(function() {
    console.log('mobile-nav.js loaded');

    // Helper function to get DOM elements
    function $(selector) {
        return document.querySelector(selector);
    }

    // Helper function to get all DOM elements
    function $$(selector) {
        return document.querySelectorAll(selector);
    }

    // Mobile Navigation Enhancement
    function initMobileNav() {
        const toggle = $('.nav-toggle');
        const links = $('.nav-links');
        const body = document.body;
        
        if (!toggle || !links) return;

        // Enhanced toggle functionality
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = links.classList.contains('active');
            
            if (isActive) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close menu when clicking on links
        links.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                setTimeout(() => {
                    closeMobileMenu();
                }, 300);
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !links.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && links.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        // Close menu on window resize (if screen becomes larger)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 720 && links.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        function openMobileMenu() {
            links.classList.add('active');
            toggle.classList.add('active');
            body.style.overflow = 'hidden';
            
            // Animate hamburger menu
            const spans = toggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                span.style.transition = 'all 0.3s ease';
                if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            });

            // Add entrance animation to menu items
            const menuItems = links.querySelectorAll('a');
            menuItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.3s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }

        function closeMobileMenu() {
            links.classList.remove('active');
            toggle.classList.remove('active');
            body.style.overflow = '';
            
            // Reset hamburger animation
            const spans = toggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '';
            });

            // Reset menu items
            const menuItems = links.querySelectorAll('a');
            menuItems.forEach(item => {
                item.style.opacity = '';
                item.style.transform = '';
            });
        }
    }

    // Enhanced Touch Interactions
    function initTouchInteractions() {
        // Add touch feedback to buttons
        $$('.btn-primary, .btn-secondary, .nav-links a').forEach(button => {
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            }, { passive: true });

            button.addEventListener('touchend', function() {
                this.style.transform = '';
            }, { passive: true });

            button.addEventListener('touchcancel', function() {
                this.style.transform = '';
            }, { passive: true });
        });

        // Enhanced scroll behavior for mobile
        let isScrolling = false;
        let scrollTimeout;

        window.addEventListener('scroll', () => {
            isScrolling = true;
            clearTimeout(scrollTimeout);
            
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 150);
        }, { passive: true });

        // Prevent scroll when mobile menu is open
        document.addEventListener('touchmove', (e) => {
            const links = $('.nav-links');
            if (links && links.classList.contains('active')) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    // Enhanced Mobile Gestures
    function initMobileGestures() {
        let startY = 0;
        let startX = 0;
        let isDragging = false;

        // Swipe to close mobile menu
        document.addEventListener('touchstart', (e) => {
            const links = $('.nav-links');
            if (links && links.classList.contains('active')) {
                startY = e.touches[0].clientY;
                startX = e.touches[0].clientX;
                isDragging = true;
            }
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const currentY = e.touches[0].clientY;
            const currentX = e.touches[0].clientX;
            const deltaY = currentY - startY;
            const deltaX = currentX - startX;

            // If swiping down or right, close menu
            if (Math.abs(deltaY) > 50 || Math.abs(deltaX) > 50) {
                const links = $('.nav-links');
                if (links && links.classList.contains('active')) {
                    links.classList.remove('active');
                    const toggle = $('.nav-toggle');
                    if (toggle) toggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
                isDragging = false;
            }
        }, { passive: true });

        document.addEventListener('touchend', () => {
            isDragging = false;
        }, { passive: true });
    }

    // Enhanced Mobile Performance
    function initMobilePerformance() {
        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }

        // Optimize for mobile devices
        if (window.innerWidth <= 720) {
            document.body.classList.add('mobile-device');
            
            // Reduce particle count on mobile for better performance
            const canvas = document.getElementById('particle-canvas');
            if (canvas) {
                canvas.style.opacity = '0.5';
            }
        }

        // Lazy load images for better mobile performance
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });

            $$('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Initialize all mobile enhancements
    function init() {
        initMobileNav();
        initTouchInteractions();
        initMobileGestures();
        initMobilePerformance();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
