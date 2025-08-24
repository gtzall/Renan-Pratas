// Main JavaScript - Optimized Version
(function(){
    console.log('main.js loaded'); // Added for debugging

    // Helper function to get DOM elements
    function $(selector) {
        return document.querySelector(selector);
    }

    // Helper function to get all DOM elements
    function $$(selector) {
        return document.querySelectorAll(selector);
    }

    // Helper function to show toast notifications
    function showToast(message, type = 'info') {
        let toast = $('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.style.display = 'block';
        
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }

    try { // Wrap main logic in try-catch
        // Preloader removal
        window.addEventListener('load', () => {
            console.log('Window loaded, removing preloader'); // Added for debugging
            document.body.classList.add('ready');
            document.body.classList.remove('is-loading');
            
            // Fallback: force hide preloader after a delay
            setTimeout(() => {
                const preloader = $('.preloader');
                if (preloader && preloader.style.opacity !== '0') {
                    console.log('Fallback: forcing preloader to hide'); // Added for debugging
                    preloader.style.opacity = '0';
                    preloader.style.visibility = 'hidden';
                    preloader.style.pointerEvents = 'none';
                }
            }, 1000);
        });

        // DOM ready
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM ready, checking preloader'); // Added for debugging
            const preloader = $('.preloader');
            console.log('Preloader element:', preloader); // Added for debugging
            
            if (preloader) {
                console.log('Preloader found, will remove on window load'); // Added for debugging
                
                // Additional fallback: hide preloader if it takes too long
                setTimeout(() => {
                    if (document.body.classList.contains('is-loading')) {
                        console.log('Fallback: preloader taking too long, forcing removal'); // Added for debugging
                        document.body.classList.add('ready');
                        document.body.classList.remove('is-loading');
                    }
                }, 5000); // 5 second timeout
            } else {
                console.log('Preloader not found!'); // Added for debugging
            }
        });

        // Enhanced Mobile Navigation
        const toggle = $('.nav-toggle');
        const links = $('.nav-links');
        const body = document.body;
        
        if (toggle && links) {
            toggle.addEventListener('click', () => {
                const isActive = links.classList.contains('active');
                
                if (isActive) {
                    // Close menu
                    links.classList.remove('active');
                    toggle.classList.remove('active');
                    body.style.overflow = '';
                    
                    // Reset hamburger animation
                    const spans = toggle.querySelectorAll('span');
                    spans.forEach(span => {
                        span.style.transform = '';
                        span.style.opacity = '';
                    });
                } else {
                    // Open menu
                    links.classList.add('active');
                    toggle.classList.add('active');
                    body.style.overflow = 'hidden';
                    
                    // Animate hamburger menu
                    const spans = toggle.querySelectorAll('span');
                    spans.forEach((span, index) => {
                        if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                        if (index === 1) span.style.opacity = '0';
                        if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                    });
                }
            });
            
            // Close menu when clicking on a link
            links.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    setTimeout(() => {
                        links.classList.remove('active');
                        toggle.classList.remove('active');
                        body.style.overflow = '';
                        
                        const spans = toggle.querySelectorAll('span');
                        spans.forEach(span => {
                            span.style.transform = '';
                            span.style.opacity = '';
                        });
                    }, 300);
                }
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!toggle.contains(e.target) && !links.contains(e.target)) {
                    links.classList.remove('active');
                    toggle.classList.remove('active');
                    body.style.overflow = '';
                    
                    const spans = toggle.querySelectorAll('span');
                    spans.forEach(span => {
                        span.style.transform = '';
                        span.style.opacity = '';
                    });
                }
            });
            
            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && links.classList.contains('active')) {
                    links.classList.remove('active');
                    toggle.classList.remove('active');
                    body.style.overflow = '';
                    
                    const spans = toggle.querySelectorAll('span');
                    spans.forEach(span => {
                        span.style.transform = '';
                        span.style.opacity = '';
                    });
                }
            });
        }

        // Enhanced Scroll Progress Bar
        const progressEl = $('#scroll-progress');
        function updateProgress(){
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            if (progressEl) {
                progressEl.style.width = progress + '%';
                
                // Add glow effect based on scroll position
                if (progress > 50) {
                    progressEl.style.boxShadow = '0 0 20px rgba(138, 160, 255, 0.5)';
                } else {
                    progressEl.style.boxShadow = 'none';
                }
            }
        }
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();

        // Enhanced Parallax Effects
        const glow = $('.hero-bg-glow');
        if (glow) {
            window.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 20;
                glow.style.transform = `translate(${x}px, ${y}px)`;
            }, { passive: true });
        }

        // Enhanced Floating Elements Animation
        const floatingElements = $$('.float-element');
        floatingElements.forEach((element, index) => {
            const speed = parseFloat(element.dataset.speed) || 0.5;
            const delay = parseFloat(element.dataset.delay) || 0;
            
            // Add parallax effect to floating elements
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * speed * -0.5;
                element.style.transform = `translateY(${rate}px)`;
            }, { passive: true });
        });

        // Enhanced Constellation Lines
        function createConstellationLines() {
            const constellationGroup = $('.constellation-group');
            if (!constellationGroup) return;
            
            const numLines = 8;
            const lines = [];
            
            for (let i = 0; i < numLines; i++) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                const x1 = Math.random() * 100;
                const y1 = Math.random() * 100;
                const x2 = Math.random() * 100;
                const y2 = Math.random() * 100;
                
                line.setAttribute('x1', x1);
                line.setAttribute('y1', y1);
                line.setAttribute('x2', x2);
                line.setAttribute('y2', y2);
                line.setAttribute('class', 'constellation-line');
                
                constellationGroup.appendChild(line);
                lines.push(line);
            }
            
            // Animate constellation lines
            lines.forEach((line, index) => {
                const delay = index * 0.5;
                line.style.animationDelay = `${delay}s`;
            });
        }
        
        createConstellationLines();

        // Enhanced Card Interactions with 3D Effect
        $$('.card.hover-3d').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const dx = (e.clientX - rect.left) / rect.width - 0.5;
                const dy = (e.clientY - rect.top) / rect.height - 0.5;
                
                // Enhanced 3D rotation
                card.style.transform = `perspective(1000px) rotateX(${(-dy * 12).toFixed(2)}deg) rotateY(${(dx * 12).toFixed(2)}deg) translateZ(30px)`;
                
                // Dynamic shadow with color
                const shadowX = dx * 25;
                const shadowY = dy * 25;
                card.style.boxShadow = `${shadowX}px ${shadowY}px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)`;
                
                // Enhanced glow effect
                const glowIntensity = Math.abs(dx + dy) * 0.2;
                card.style.borderColor = `rgba(255,255,255,${0.2 + glowIntensity})`;
                card.style.boxShadow += `, 0 0 30px rgba(138, 160, 255, ${glowIntensity * 0.3})`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.boxShadow = '';
                card.style.borderColor = '';
            });
        });

        // Enhanced Product Cards
        $$('.product-card').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const dx = (e.clientX - rect.left) / rect.width - 0.5;
                const dy = (e.clientY - rect.top) / rect.height - 0.5;
                
                // Subtle 3D effect for product cards
                card.style.transform = `perspective(800px) rotateX(${(-dy * 6).toFixed(2)}deg) rotateY(${(dx * 6).toFixed(2)}deg) translateZ(15px)`;
                
                // Dynamic shadow
                const shadowX = dx * 15;
                const shadowY = dy * 15;
                card.style.boxShadow = `${shadowX}px ${shadowY}px 30px rgba(0,0,0,0.3)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });
        });

        // Populate featured products (with thumbnails)
        const featuredList = $('#featured-list');
        if (featuredList && window.PRODUCTS) {
            const featured = window.PRODUCTS.slice(0, 8);
            featuredList.innerHTML = featured.map(p => {
                const thumb = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '';
                const icon = p.type === 'ring' ? '💍' : p.type === 'bracelet' ? '💫' : '🔗';
                return `
                <div class="product-card hover-3d" data-product-id="${p.id}">
                    <div class="product-media shimmer" ${thumb ? '' : 'data-fallback-icon'}>
                        ${thumb ? `<img src="${thumb}" alt="${p.name}" loading="lazy" />` : `
                        <div class="card-overlay"><div class="card-icon">${icon}</div></div>`}
                    </div>
                    <div class="product-info">
                        <div class="name">${p.name}</div>
                        <div class="price">${p.price}</div>
                    </div>
                    <div class="product-actions">
                        <button class="btn-secondary" data-view-product data-id="${p.id}">Visualizar</button>
                        <button class="btn-primary glow-btn" data-add-to-cart data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-type="${p.type}">Comprar</button>
                    </div>
                </div>`;
            }).join('');
        }

        // Product Gallery Modal logic
        const modal = document.getElementById('product-modal');
        const modalMainImg = document.getElementById('modal-main-image');
        const modalTitle = document.getElementById('modal-title');
        const modalPrice = document.getElementById('modal-price');
        const modalThumbs = document.getElementById('modal-thumbs');
        let currentProduct = null;
        let currentImageIndex = 0;

        function openProductModal(productId){
            if (!window.PRODUCTS) return;
            const product = window.PRODUCTS.find(pr => pr.id === productId);
            if (!product) return;
            currentProduct = product;
            currentImageIndex = 0;
            const images = Array.isArray(product.images) && product.images.length ? product.images : [];

            modalTitle.textContent = product.name;
            modalPrice.textContent = product.price;
            if (images.length > 0) {
                modalMainImg.src = images[0];
                modalMainImg.alt = product.name;
            } else {
                modalMainImg.removeAttribute('src');
                modalMainImg.alt = '';
            }

            // Build thumbs
            modalThumbs.innerHTML = images.map((src, idx) => `
                <img src="${src}" data-idx="${idx}" ${idx===0 ? 'class="active"' : ''} alt="${product.name} ${idx+1}" />
            `).join('');

            // Show modal with enhanced animation
            modal.classList.add('visible');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Add entrance animation
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = 'scale(0.9) translateY(20px)';
                modalContent.style.opacity = '0';
                
                setTimeout(() => {
                    modalContent.style.transition = 'all 0.3s ease';
                    modalContent.style.transform = 'scale(1) translateY(0)';
                    modalContent.style.opacity = '1';
                }, 10);
            }
        }

        function closeProductModal(){
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = 'scale(0.9) translateY(20px)';
                modalContent.style.opacity = '0';
                
                setTimeout(() => {
                    modal.classList.remove('visible');
                    modal.setAttribute('aria-hidden', 'true');
                    document.body.style.overflow = '';
                    currentProduct = null;
                    currentImageIndex = 0;
                }, 300);
            } else {
                modal.classList.remove('visible');
                modal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
                currentProduct = null;
                currentImageIndex = 0;
            }
        }

        function showImageAt(index){
            if (!currentProduct || !Array.isArray(currentProduct.images)) return;
            const images = currentProduct.images;
            if (images.length === 0) return;
            const safeIndex = (index + images.length) % images.length;
            currentImageIndex = safeIndex;
            
            // Add fade transition
            modalMainImg.style.opacity = '0';
            setTimeout(() => {
                modalMainImg.src = images[safeIndex];
                modalMainImg.style.opacity = '1';
            }, 150);
            
            // Update thumbs active state
            Array.from(modalThumbs.querySelectorAll('img')).forEach((img, idx) => {
                if (idx === safeIndex) img.classList.add('active'); else img.classList.remove('active');
            });
        }

        // Delegated events: open modal
        document.addEventListener('click', (e) => {
            const viewBtn = e.target.closest('[data-view-product]');
            if (viewBtn) {
                e.preventDefault();
                openProductModal(viewBtn.getAttribute('data-id'));
                return;
            }

            // Open by clicking the media area
            const media = e.target.closest('.product-media');
            if (media && media.parentElement?.classList.contains('product-card')) {
                const productId = media.parentElement.getAttribute('data-product-id');
                if (productId) openProductModal(productId);
            }

            // Close modal
            if (e.target.matches('[data-close-modal]')) {
                closeProductModal();
            }
        });

        // Modal navigation
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-backdrop')) {
                    closeProductModal();
                }
                if (e.target.hasAttribute('data-prev')) {
                    showImageAt(currentImageIndex - 1);
                }
                if (e.target.hasAttribute('data-next')) {
                    showImageAt(currentImageIndex + 1);
                }
                if (e.target.parentElement && e.target.parentElement.hasAttribute && e.target.parentElement.hasAttribute('data-prev')) {
                    showImageAt(currentImageIndex - 1);
                }
                if (e.target.parentElement && e.target.parentElement.hasAttribute && e.target.parentElement.hasAttribute('data-next')) {
                    showImageAt(currentImageIndex + 1);
                }
            });

            // Thumbs click
            modalThumbs?.addEventListener('click', (e) => {
                const img = e.target.closest('img[data-idx]');
                if (!img) return;
                const idx = Number(img.getAttribute('data-idx'));
                if (!Number.isNaN(idx)) showImageAt(idx);
            });

            // Esc to close
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('visible')) {
                    closeProductModal();
                }
                if (e.key === 'ArrowLeft' && modal.classList.contains('visible')) {
                    showImageAt(currentImageIndex - 1);
                }
                if (e.key === 'ArrowRight' && modal.classList.contains('visible')) {
                    showImageAt(currentImageIndex + 1);
                }
            });
        }

        // Cart integration
        function updateCartCount(){
            const count = window.Cart?.getCount() || 0;
            const el = $('#cart-count');
            const heroCartCount = $('#hero-cart-count');
            const cartLink = $('.cart-link');
            
            if (el) el.textContent = String(count);
            if (heroCartCount) heroCartCount.textContent = String(count);
            
            // Add/remove has-items class for styling
            if (cartLink) {
                if (count > 0) {
                    cartLink.classList.add('has-items');
                } else {
                    cartLink.classList.remove('has-items');
                }
            }
        }

        // Add to cart functionality with event delegation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-add-to-cart]')) {
                const btn = e.target;
                const item = {
                    id: btn.getAttribute('data-id') || Math.random().toString(36).slice(2),
                    name: btn.getAttribute('data-name') || 'Joia de Prata',
                    price: btn.getAttribute('data-price') || 'R$ 0,00',
                    type: btn.getAttribute('data-type') || 'ring',
                    qty: 1
                };
                
                if (window.Cart) {
                    window.Cart.addItem(item);
                    showToast('✨ Adicionado ao carrinho!', 'success');
                    updateCartCount(); // Update cart count immediately
                    
                    // Add success animation to button
                    btn.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        btn.style.transform = 'scale(1)';
                    }, 150);
                    
                    // Redirect to checkout after a short delay
                    setTimeout(() => {
                        window.location.href = 'checkout.html';
                    }, 1500);
                } else {
                    showToast('❌ Carrinho não disponível', 'error');
                }
            }
        });

        // WhatsApp integration function
        function sendToWhatsApp(cartItems, customerInfo, total) {
            const phoneNumbers = ['+5511976888011', '+5511967431126'];
            const message = formatWhatsAppMessage(cartItems, customerInfo, total);
            
            // Try first number, if fails try second
            const firstNumber = phoneNumbers[0];
            const whatsappUrl = `https://wa.me/${firstNumber}?text=${encodeURIComponent(message)}`;
            
            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank');
            
            // Also try to send to second number
            setTimeout(() => {
                const secondNumber = phoneNumbers[1];
                const secondWhatsappUrl = `https://wa.me/${secondNumber}?text=${encodeURIComponent(message)}`;
                window.open(secondWhatsappUrl, '_blank');
            }, 1000);
        }

        // Format WhatsApp message
        function formatWhatsAppMessage(cartItems, customerInfo, total) {
            let message = `🛍️ *NOVO PEDIDO - RENAN PRATAS*\n\n`;
            message += `👤 *DADOS DO CLIENTE:*\n`;
            message += `Nome: ${customerInfo.name}\n`;
            message += `Email: ${customerInfo.email}\n`;
            message += `Telefone: ${customerInfo.phone}\n\n`;
            
            message += `📍 *ENDEREÇO DE ENTREGA:*\n`;
            message += `CEP: ${customerInfo.cep}\n`;
            message += `Rua: ${customerInfo.street}\n`;
            message += `Número: ${customerInfo.number}\n`;
            message += `Complemento: ${customerInfo.complement || 'N/A'}\n`;
            message += `Bairro: ${customerInfo.neighborhood}\n`;
            message += `Cidade: ${customerInfo.city}\n`;
            message += `Estado: ${customerInfo.state}\n\n`;
            
            message += `🛒 *ITENS DO PEDIDO:*\n`;
            cartItems.forEach((item, index) => {
                message += `${index + 1}. ${item.name} - ${item.price} x${item.qty}\n`;
            });
            
            message += `\n💰 *TOTAL DO PEDIDO:* ${total}\n`;
            message += `📅 Data: ${new Date().toLocaleDateString('pt-BR')}\n`;
            message += `⏰ Hora: ${new Date().toLocaleTimeString('pt-BR')}\n\n`;
            
            message += `✨ *Obrigado pela preferência!*\n`;
            message += `Em breve entraremos em contato para confirmar o pedido.`;
            
            return message;
        }

        // Make functions globally available
        window.sendToWhatsApp = sendToWhatsApp;
        window.formatWhatsAppMessage = formatWhatsAppMessage;

        // WhatsApp Support Function
        function openWhatsAppSupport() {
            const phoneNumber = '+5511976888011';
            const message = encodeURIComponent(`Olá! Gostaria de falar com o suporte da Renan Pratas. Tenho algumas dúvidas sobre os produtos.`);
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
            window.open(whatsappUrl, '_blank');
        }

        // Make WhatsApp function globally available
        window.openWhatsAppSupport = openWhatsAppSupport;

        // GSAP: Advanced animations
        if (window.gsap && window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
            
            // Hero entrance with enhanced stagger and easing
            gsap.from('.title-line', { 
                opacity: 0, 
                y: 60, 
                scale: 0.9,
                duration: 1.4, 
                stagger: 0.3, 
                ease: 'power3.out',
                clearProps: 'all'
            });
            
            gsap.from('.hero-subtitle', { 
                opacity: 0, 
                y: 40, 
                scale: 0.95,
                duration: 1.2, 
                delay: 1.2, 
                ease: 'power2.out',
                clearProps: 'all'
            });
            
            gsap.from('.hero-cta', { 
                opacity: 0, 
                y: 40, 
                scale: 0.95,
                duration: 1.2, 
                delay: 1.5, 
                ease: 'power2.out',
                clearProps: 'all'
            });

            // Floating jewel animation with enhanced movement
            gsap.to('.floating-jewel', {
                y: -40,
                rotation: 8,
                duration: 4,
                ease: 'power2.inOut',
                yoyo: true,
                repeat: -1
            });

            // Section reveals with enhanced effects
            $$('.section').forEach((sec, index) => {
                const elements = sec.querySelectorAll('.section-head, .grid, .about-inner');
                
                gsap.from(elements, {
                    opacity: 0,
                    y: 60,
                    scale: 0.95,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: { 
                        trigger: sec, 
                        start: 'top 85%',
                        end: 'bottom 15%',
                        toggleActions: 'play none none reverse'
                    },
                    clearProps: 'all'
                });
            });

            // Enhanced card entrance animations
            gsap.from('.card', {
                opacity: 0,
                y: 80,
                scale: 0.9,
                duration: 1,
                stagger: 0.15,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.grid-cards',
                    start: 'top 90%'
                },
                clearProps: 'all'
            });

            // Enhanced product grid entrance
            gsap.from('.product-card', {
                opacity: 0,
                y: 60,
                scale: 0.9,
                duration: 0.8,
                stagger: 0.08,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.products',
                    start: 'top 90%'
                },
                clearProps: 'all'
            });
        }

        // Small React CTA badge
        const ctaMount = document.getElementById('react-cta');
        if (ctaMount && window.React && window.ReactDOM) {
            const e = React.createElement;
            function CtaBadge(){
                const [hovered, setHovered] = React.useState(false);
                const [clicked, setClicked] = React.useState(false);
                
                return e('a', {
                    href: '#destaques',
                    className: 'btn-secondary glow-btn',
                    onMouseEnter: () => setHovered(true),
                    onMouseLeave: () => setHovered(false),
                    onClick: () => setClicked(true)
                }, clicked ? '✨ Explorando...' : hovered ? 'Conheça nossos destaques →' : 'Role para ver mais');
            }
            ReactDOM.createRoot(ctaMount).render(e(CtaBadge));
        }

        // Initialize cart if available
        if (window.Cart) {
            window.Cart.onChange(updateCartCount);
            updateCartCount();
        }

        // Performance optimization: Intersection Observer for lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            $$('img[data-src]').forEach(img => imageObserver.observe(img));
        }

        // Enhanced Smooth Scroll for Anchor Links
        $$('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = $(link.getAttribute('href'));
                if (target) {
                    // Smooth scroll with enhanced easing
                    const targetPosition = target.offsetTop - 80; // Account for header height
                    const startPosition = window.pageYOffset;
                    const distance = targetPosition - startPosition;
                    const duration = 1200;
                    let start = null;
                    
                    function enhancedAnimation(currentTime) {
                        if (start === null) start = currentTime;
                        const timeElapsed = currentTime - start;
                        const run = easeInOutQuart(timeElapsed, startPosition, distance, duration);
                        window.scrollTo(0, run);
                        if (timeElapsed < duration) requestAnimationFrame(enhancedAnimation);
                    }
                    
                    // Enhanced easing function
                    function easeInOutQuart(t, b, c, d) {
                        t /= d / 2;
                        if (t < 1) return c / 2 * t * t * t * t + b;
                        t -= 2;
                        return -c / 2 * (t * t * t * t - 2) + b;
                    }
                    
                    requestAnimationFrame(enhancedAnimation);
                }
            });
        });

        // Enhanced Smooth Scroll for Navigation Links
        $$('.nav-links a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = $(link.getAttribute('href'));
                if (target) {
                    // Close mobile menu if open
                    const navLinks = $('.nav-links');
                    if (navLinks && window.innerWidth <= 720) {
                        navLinks.classList.remove('active');
                        const toggle = $('.nav-toggle');
                        if (toggle) toggle.classList.remove('active');
                        body.style.overflow = '';
                    }
                    
                    // Smooth scroll with enhanced easing
                    const targetPosition = target.offsetTop - 100;
                    const startPosition = window.pageYOffset;
                    const distance = targetPosition - startPosition;
                    const duration = 1200;
                    let start = null;
                    
                    function enhancedAnimation(currentTime) {
                        if (start === null) start = currentTime;
                        const timeElapsed = currentTime - start;
                        const run = easeInOutQuart(timeElapsed, startPosition, distance, duration);
                        window.scrollTo(0, run);
                        if (timeElapsed < duration) requestAnimationFrame(enhancedAnimation);
                    }
                    
                    // Enhanced easing function
                    function easeInOutQuart(t, b, c, d) {
                        t /= d / 2;
                        if (t < 1) return c / 2 * t * t * t * t + b;
                        t -= 2;
                        return -c / 2 * (t * t * t * t - 2) + b;
                    }
                    
                    requestAnimationFrame(enhancedAnimation);
                }
            });
        });

        // Enhanced Button Loading Animation
        $$('.btn-primary, .btn-secondary').forEach(btn => {
            btn.addEventListener('click', function() {
                if (!this.classList.contains('loading')) {
                    this.classList.add('loading');
                    this.style.pointerEvents = 'none';
                    
                    // Add loading spinner
                    const originalText = this.innerHTML;
                    this.innerHTML = '<div class="spinner"></div>';
                    
                    setTimeout(() => {
                        this.classList.remove('loading');
                        this.style.pointerEvents = '';
                        this.innerHTML = originalText;
                    }, 1000);
                }
            });
        });

        // Enhanced Toast Notifications
        function showEnhancedToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.innerHTML = `
                <div class="toast-content">
                    <span class="toast-icon">${type === 'success' ? '✨' : type === 'error' ? '❌' : 'ℹ️'}</span>
                    <span class="toast-message">${message}</span>
                </div>
            `;
            
            document.body.appendChild(toast);
            
            // Animate in
            setTimeout(() => {
                toast.classList.add('show');
            }, 10);
            
            // Remove after delay
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }, 3000);
        }

        // Override showToast function
        window.showToast = showEnhancedToast;

    } catch (error) {
        console.error('Error in main.js:', error);
    }
})();
