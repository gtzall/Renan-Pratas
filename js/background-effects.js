// Enhanced Background Effects with Animated Elements
(function() {
    console.log('background-effects.js loaded');

    // Helper function to get DOM elements
    function $(selector) {
        return document.querySelector(selector);
    }

    // Create animated background elements
    function createBackgroundElements() {
        const body = document.body;
        
        // Create container for background effects
        const bgContainer = document.createElement('div');
        bgContainer.className = 'animated-background';
        bgContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -2;
            overflow: hidden;
        `;
        
        body.appendChild(bgContainer);

        // Create smoke circles
        createSmokeCircles(bgContainer);
        
        // Create floating orbs
        createFloatingOrbs(bgContainer);
        
        // Create subtle particles
        createSubtleParticles(bgContainer);
    }

    // Create smoke-like circles that move organically
    function createSmokeCircles(container) {
        const smokeCount = 12;
        
        for (let i = 0; i < smokeCount; i++) {
            const smoke = document.createElement('div');
            smoke.className = 'smoke-circle';
            smoke.style.cssText = `
                position: absolute;
                width: ${Math.random() * 120 + 80}px;
                height: ${Math.random() * 120 + 80}px;
                background: radial-gradient(circle, 
                    rgba(180, 180, 180, 0.08) 0%, 
                    rgba(160, 160, 160, 0.05) 30%, 
                    rgba(140, 140, 140, 0.03) 60%, 
                    transparent 100%);
                border-radius: 50%;
                filter: blur(8px);
                animation: smokeFloat ${Math.random() * 40 + 30}s ease-in-out infinite;
                animation-delay: ${Math.random() * 20}s;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            
            container.appendChild(smoke);
        }
    }

    // Create floating orbs with smoke-like appearance
    function createFloatingOrbs(container) {
        const orbCount = 8;
        
        for (let i = 0; i < orbCount; i++) {
            const orb = document.createElement('div');
            orb.className = 'floating-orb';
            orb.style.cssText = `
                position: absolute;
                width: ${Math.random() * 60 + 40}px;
                height: ${Math.random() * 60 + 40}px;
                background: radial-gradient(circle, 
                    rgba(200, 200, 200, 0.06) 0%, 
                    rgba(180, 180, 180, 0.04) 50%, 
                    transparent 100%);
                border-radius: 50%;
                filter: blur(4px);
                animation: orbFloat ${Math.random() * 35 + 25}s ease-in-out infinite;
                animation-delay: ${Math.random() * 15}s;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            
            container.appendChild(orb);
        }
    }

    // Create subtle particles for detail
    function createSubtleParticles(container) {
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'subtle-particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 2}px;
                height: ${Math.random() * 3 + 2}px;
                background: rgba(170, 170, 170, 0.4);
                border-radius: 50%;
                filter: blur(1px);
                animation: particleFloat ${Math.random() * 50 + 40}s linear infinite;
                animation-delay: ${Math.random() * 25}s;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            
            container.appendChild(particle);
        }
    }

    // Add CSS animations to the document
    function addAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes smokeFloat {
                0%, 100% { 
                    transform: translateY(0px) translateX(0px) scale(1); 
                    opacity: 0.03; 
                }
                25% { 
                    transform: translateY(-30px) translateX(25px) scale(1.1); 
                    opacity: 0.06; 
                }
                50% { 
                    transform: translateY(-50px) translateX(-20px) scale(0.9); 
                    opacity: 0.08; 
                }
                75% { 
                    transform: translateY(-25px) translateX(35px) scale(1.05); 
                    opacity: 0.04; 
                }
            }

            @keyframes orbFloat {
                0%, 100% { 
                    transform: translateY(0px) translateX(0px) scale(1); 
                    opacity: 0.04; 
                }
                33% { 
                    transform: translateY(-35px) translateX(20px) scale(1.1); 
                    opacity: 0.06; 
                }
                66% { 
                    transform: translateY(-45px) translateX(-15px) scale(0.95); 
                    opacity: 0.05; 
                }
            }

            @keyframes particleFloat {
                0% { 
                    transform: translateY(0px) translateX(0px); 
                    opacity: 0; 
                }
                10% { opacity: 0.4; }
                90% { opacity: 0.4; }
                100% { 
                    transform: translateY(-70vh) translateX(20px); 
                    opacity: 0; 
                }
            }

            /* Enhanced floating elements for checkout */
            .checkout-floating .float-element {
                background: radial-gradient(circle, 
                    rgba(180, 180, 180, 0.06) 0%, 
                    rgba(160, 160, 160, 0.03) 50%, 
                    transparent 80%);
                animation: floatCheckout 25s ease-in-out infinite;
            }

            @keyframes floatCheckout {
                0%, 100% { 
                    transform: translateY(0px) scale(1); 
                    opacity: 0.3; 
                }
                50% { 
                    transform: translateY(-30px) scale(1.05); 
                    opacity: 0.5; 
                }
            }

            /* Responsive adjustments */
            @media (max-width: 720px) {
                .smoke-circle { 
                    width: 60px !important; 
                    height: 60px !important; 
                    filter: blur(6px) !important;
                }
                .floating-orb { 
                    width: 30px !important; 
                    height: 30px !important; 
                    filter: blur(3px) !important;
                }
                .smoke-circle { animation-duration: 45s !important; }
                .floating-orb { animation-duration: 40s !important; }
                .subtle-particle { animation-duration: 55s !important; }
            }

            /* Reduced motion support */
            @media (prefers-reduced-motion: reduce) {
                .smoke-circle, .floating-orb, .subtle-particle {
                    animation: none !important;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    // Initialize background effects
    function init() {
        createBackgroundElements();
        addAnimations();
        
        console.log('Background effects initialized');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
