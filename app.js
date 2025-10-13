class CyberpunkPortfolio {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.particles = [];
        this.cursorTrails = [];
        this.maxTrails = 20;
        this.isTyping = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createParticles();
        this.startTypingAnimation();
        this.setupScrollAnimations();
        this.setupThemeToggle();
        this.setupSmoothScroll();
        this.updateCustomCursor();
    }

    setupEventListeners() {
        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.createCursorTrail();
        });

        // Resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Scroll handler
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Navigation active states
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Project card interactions
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateProjectCard(card, 'enter');
            });
            card.addEventListener('mouseleave', () => {
                this.animateProjectCard(card, 'leave');
            });
        });

        // Skill badge hover effects
        document.querySelectorAll('.skill-badge').forEach(badge => {
            badge.addEventListener('mouseenter', () => {
                this.animateSkillBadge(badge, 'enter');
            });
            badge.addEventListener('mouseleave', () => {
                this.animateSkillBadge(badge, 'leave');
            });
        });
    }

    // Particle System
    createParticles() {
        const container = document.getElementById('particles-container');
        
        // Create initial particles
        for (let i = 0; i < 50; i++) {
            this.createParticle(container);
        }

        // Continuously create new particles
        setInterval(() => {
            if (this.particles.length < 100) {
                this.createParticle(container);
            }
        }, 200);
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 4 + 1;
        const startX = Math.random() * window.innerWidth;
        const duration = Math.random() * 4 + 4;
        const delay = Math.random() * 2;
        
        // Random color
        const colors = ['#00FFFF', '#FF00FF', '#9B59B6', '#3498DB'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${startX}px;
            background: ${color};
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            box-shadow: 0 0 ${size * 2}px ${color};
        `;
        
        container.appendChild(particle);
        this.particles.push(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                const index = this.particles.indexOf(particle);
                if (index > -1) {
                    this.particles.splice(index, 1);
                }
            }
        }, (duration + delay) * 1000);
    }

    // Cursor Trail Effect
    createCursorTrail() {
        const trail = document.createElement('div');
        trail.className = 'cursor-particle';
        trail.style.left = this.mouseX + 'px';
        trail.style.top = this.mouseY + 'px';
        
        document.getElementById('cursor-trail').appendChild(trail);
        this.cursorTrails.push(trail);
        
        // Remove old trails
        if (this.cursorTrails.length > this.maxTrails) {
            const oldTrail = this.cursorTrails.shift();
            if (oldTrail.parentNode) {
                oldTrail.parentNode.removeChild(oldTrail);
            }
        }
        
        // Remove trail after animation
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 800);
    }

    // Update custom cursor position
    updateCustomCursor() {
        document.addEventListener('mousemove', (e) => {
            document.body.style.setProperty('--cursor-x', e.clientX + 'px');
            document.body.style.setProperty('--cursor-y', e.clientY + 'px');
        });

        // Update cursor position via CSS custom properties
        const updateCursor = () => {
            document.documentElement.style.setProperty('--cursor-x', this.mouseX + 'px');
            document.documentElement.style.setProperty('--cursor-y', this.mouseY + 'px');
            requestAnimationFrame(updateCursor);
        };
        updateCursor();
    }

    // Typing Animation
    startTypingAnimation() {
        const text = "AI-driven DevOps & Software Engineer | Learning how systems think - and helping them think better";
        const element = document.getElementById('typed-tagline');
        const cursor = document.querySelector('.cursor');
        let index = 0;
        this.isTyping = true;
        
        const typeChar = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(typeChar, Math.random() * 100 + 50);
            } else {
                this.isTyping = false;
                // Optional: restart typing after delay
                setTimeout(() => {
                    element.textContent = '';
                    index = 0;
                    this.startTypingAnimation();
                }, 5000);
            }
        };
        
        // Clear and start typing
        element.textContent = '';
        setTimeout(typeChar, 1000);
    }

    // Scroll Animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    
                    // Animate skill badges with stagger
                    if (entry.target.classList.contains('skill-category')) {
                        const badges = entry.target.querySelectorAll('.skill-badge');
                        badges.forEach((badge, index) => {
                            setTimeout(() => {
                                badge.style.animation = 'fadeInUp 0.6s ease-out forwards';
                            }, index * 100);
                        });
                    }
                    
                    // Animate project cards with stagger
                    if (entry.target.classList.contains('projects-grid')) {
                        const cards = entry.target.querySelectorAll('.project-card');
                        cards.forEach((card, index) => {
                            setTimeout(() => {
                                card.style.animation = 'fadeInUp 0.8s ease-out forwards';
                            }, index * 150);
                        });
                    }
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.skill-category, .project-card, .contact-link, .projects-grid').forEach(el => {
            observer.observe(el);
        });
    }

    // Theme Toggle
    setupThemeToggle() {
        const toggle = document.getElementById('theme-toggle');
        let currentTheme = 'default';
        
        toggle.addEventListener('click', () => {
            if (currentTheme === 'default') {
                document.body.classList.add('theme-purple');
                currentTheme = 'purple';
                toggle.querySelector('.theme-icon').textContent = '🟣';
            } else {
                document.body.classList.remove('theme-purple');
                currentTheme = 'default';
                toggle.querySelector('.theme-icon').textContent = '🌓';
            }
            
            // Add click animation
            toggle.style.transform = 'scale(0.9) rotate(180deg)';
            setTimeout(() => {
                toggle.style.transform = 'scale(1) rotate(360deg)';
            }, 150);
        });
    }

    // Smooth Scrolling
    setupSmoothScroll() {
        // Add smooth scrolling behavior
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Update navigation active states on scroll
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.pageYOffset;
            
            sections.forEach(section => {
                const top = section.offsetTop - 100;
                const bottom = top + section.offsetHeight;
                const id = section.getAttribute('id');
                
                if (scrollPos >= top && scrollPos < bottom) {
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }

    // Project Card Animations
    animateProjectCard(card, type) {
        const icon = card.querySelector('.project-icon');
        const techBadges = card.querySelectorAll('.tech-badge');
        
        if (type === 'enter') {
            // Scale and rotate icon
            icon.style.transform = 'scale(1.2) rotate(10deg)';
            icon.style.filter = 'drop-shadow(0 0 20px var(--neon-cyan))';
            
            // Animate tech badges
            techBadges.forEach((badge, index) => {
                setTimeout(() => {
                    badge.style.transform = 'translateY(-3px)';
                    badge.style.boxShadow = '0 5px 15px rgba(0, 255, 255, 0.2)';
                }, index * 50);
            });
            
            // Add glow effect
            card.style.boxShadow = `
                0 20px 40px rgba(0, 0, 0, 0.3),
                0 0 30px rgba(0, 255, 255, 0.3),
                inset 0 0 30px rgba(255, 0, 255, 0.1)
            `;
        } else {
            // Reset animations
            icon.style.transform = '';
            icon.style.filter = '';
            
            techBadges.forEach(badge => {
                badge.style.transform = '';
                badge.style.boxShadow = '';
            });
            
            card.style.boxShadow = '';
        }
    }

    // Skill Badge Animations
    animateSkillBadge(badge, type) {
        if (type === 'enter') {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(255, 0, 255, 0.3), transparent);
                transform: translate(-50%, -50%);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 1;
            `;
            
            badge.style.position = 'relative';
            badge.appendChild(ripple);
            
            // Add ripple animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes ripple {
                    0% {
                        width: 0;
                        height: 0;
                        opacity: 1;
                    }
                    100% {
                        width: 100px;
                        height: 100px;
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
            
            // Remove ripple after animation
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
                if (style.parentNode) {
                    style.parentNode.removeChild(style);
                }
            }, 600);
        }
    }

    // Handle Resize
    handleResize() {
        // Update particle positions if needed
        this.particles.forEach(particle => {
            const currentLeft = parseInt(particle.style.left);
            if (currentLeft > window.innerWidth) {
                particle.style.left = Math.random() * window.innerWidth + 'px';
            }
        });
    }

    // Handle Scroll
    handleScroll() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        // Update navigation transparency
        const nav = document.querySelector('.nav');
        if (nav) {
            const opacity = Math.min(scrolled / 100, 0.95);
            nav.style.background = `rgba(10, 10, 10, ${opacity})`;
        }
    }

    // Add glitch effect to text elements
    addGlitchEffect(element) {
        const text = element.textContent;
        element.setAttribute('data-text', text);
        
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        let isGlitching = false;
        
        element.addEventListener('mouseenter', () => {
            if (isGlitching) return;
            isGlitching = true;
            
            let iterations = 0;
            const maxIterations = 10;
            
            const glitchInterval = setInterval(() => {
                if (iterations >= maxIterations) {
                    element.textContent = text;
                    isGlitching = false;
                    clearInterval(glitchInterval);
                    return;
                }
                
                element.textContent = text
                    .split('')
                    .map((char, index) => {
                        if (index < iterations) {
                            return text[index];
                        }
                        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    })
                    .join('');
                
                iterations++;
            }, 50);
        });
    }

    // Initialize Easter Eggs
    initEasterEggs() {
        // Konami Code Easter Egg
        const konamiCode = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        let konamiIndex = 0;
        
        document.addEventListener('keydown', (e) => {
            if (e.code === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    this.activateEasterEgg();
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        });
    }

    activateEasterEgg() {
        // Create matrix rain effect
        const matrixContainer = document.createElement('div');
        matrixContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            background: rgba(0, 0, 0, 0.8);
        `;
        
        document.body.appendChild(matrixContainer);
        
        // Add matrix characters
        for (let i = 0; i < 50; i++) {
            this.createMatrixChar(matrixContainer);
        }
        
        // Remove after 5 seconds
        setTimeout(() => {
            document.body.removeChild(matrixContainer);
        }, 5000);
    }

    createMatrixChar(container) {
        const char = document.createElement('div');
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        
        char.textContent = chars[Math.floor(Math.random() * chars.length)];
        char.style.cssText = `
            position: absolute;
            top: -20px;
            left: ${Math.random() * 100}%;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            font-size: ${Math.random() * 20 + 10}px;
            animation: matrixFall ${Math.random() * 3 + 2}s linear infinite;
        `;
        
        container.appendChild(char);
        
        // Add CSS animation
        if (!document.getElementById('matrix-style')) {
            const style = document.createElement('style');
            style.id = 'matrix-style';
            style.textContent = `
                @keyframes matrixFall {
                    0% {
                        transform: translateY(-20px);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new CyberpunkPortfolio();
    
    // Add some additional interactive features
    
    // Audio feedback for interactions (optional)
    const playHoverSound = () => {
        // Create a subtle beep sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    };
    
    // Add hover sounds to interactive elements
    document.querySelectorAll('.social-link, .contact-link, .nav-link').forEach(element => {
        element.addEventListener('mouseenter', () => {
            // Uncomment to enable hover sounds
            // playHoverSound();
        });
    });
    
    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
    
    // Initialize Easter eggs
    portfolio.initEasterEggs();
    
    console.log('🚀 Cyberpunk Portfolio Initialized');
    console.log('💡 Try the Konami Code for a surprise!');
});