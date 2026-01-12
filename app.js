// ============================================
// WAYNE ENTERPRISES TACTICAL DASHBOARD
// JavaScript Functionality
// ============================================

class TacticalDashboard {
    constructor() {
        this.init();
    }

    init() {
        this.showBootSequence();
        this.initTypingAnimation();
        this.initStatCounters();
        this.initDownloadClearance();
        this.initSmoothScroll();
        this.initCustomCursor();
        this.initTacticalDuality();
        this.initMobileNav();
    }

    // ============================================
    // BOOT SEQUENCE
    // ============================================
    showBootSequence() {
        const bootScreen = document.createElement('div');
        bootScreen.className = 'boot-screen';
        bootScreen.innerHTML = `
            <div class="boot-text">
                WAYNE ENT. APPLIED SCIENCES<br>
                AUTHORIZING ACCESS...
            </div>
        `;
        document.body.appendChild(bootScreen);

        // Remove boot screen after 2.5 seconds
        setTimeout(() => {
            bootScreen.remove();
        }, 2500);
    }

    // ============================================
    // TYPING ANIMATION
    // ============================================
    initTypingAnimation() {
        const roles = [
            'SOFTWARE ENGINEER INTERN @ TD BANK',
            'DEVOPS ENGINEER'
        ];

        const typedElement = document.getElementById('typed-role');
        if (!typedElement) return;

        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        const type = () => {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typedElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typedElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                // Pause at end
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 500;
            }

            setTimeout(type, typingSpeed);
        };

        // Start typing after boot sequence
        setTimeout(type, 2500);
    }

    // ============================================
    // STAT COUNTERS
    // ============================================
    initStatCounters() {
        const statValues = document.querySelectorAll('.stat-value');

        const animateCounter = (element) => {
            const target = parseFloat(element.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            const isDecimal = target % 1 !== 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    element.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
                }
            };

            updateCounter();
        };

        // Observe stat cards and animate when visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statValues.forEach(stat => observer.observe(stat));
    }

    // ============================================
    // DOWNLOAD CLEARANCE (PS5 PROGRESS BAR)
    // ============================================
    initDownloadClearance() {
        const downloadBtn = document.getElementById('download-resume');
        const progressContainer = document.getElementById('download-progress');

        if (!downloadBtn || !progressContainer) return;

        downloadBtn.addEventListener('click', () => {
            // Hide button, show progress
            downloadBtn.style.opacity = '0';
            downloadBtn.style.pointerEvents = 'none';
            progressContainer.classList.add('active');

            const progressFill = progressContainer.querySelector('.progress-bar-fill');
            const progressPercentage = progressContainer.querySelector('.progress-percentage');
            const progressLabel = progressContainer.querySelector('.progress-label');
            const progressStatus = progressContainer.querySelector('.progress-status');

            let progress = 0;
            const duration = 2000; // 2 seconds
            const interval = 20; // Update every 20ms
            const increment = (100 / duration) * interval;

            const statusMessages = [
                'DECRYPTING PERSONNEL DATA',
                'VALIDATING CLEARANCE LEVEL',
                'COMPILING MISSION RECORDS',
                'GENERATING SECURE FILE',
                'FINALIZING DOCUMENT'
            ];

            const progressInterval = setInterval(() => {
                progress += increment;

                if (progress >= 100) {
                    progress = 100;
                    clearInterval(progressInterval);

                    // Update final status
                    progressLabel.textContent = 'DOWNLOAD AUTHORIZED';
                    progressStatus.textContent = 'FILE READY';
                    progressPercentage.textContent = '100%';
                    progressFill.style.width = '100%';

                    // Trigger actual download
                    setTimeout(() => {
                        // Replace with actual resume path
                        window.open('Aryan_S_Resume.pdf', '_blank');

                        // Reset UI after download
                        setTimeout(() => {
                            progressContainer.classList.remove('active');
                            downloadBtn.style.opacity = '1';
                            downloadBtn.style.pointerEvents = 'all';
                            progress = 0;
                            progressFill.style.width = '0%';
                            progressPercentage.textContent = '0%';
                            progressLabel.textContent = 'GENERATING SECURE FILE...';
                            progressStatus.textContent = 'DECRYPTING PERSONNEL DATA';
                        }, 1000);
                    }, 500);
                } else {
                    // Update progress
                    progressFill.style.width = progress + '%';
                    progressPercentage.textContent = Math.floor(progress) + '%';

                    // Update status message based on progress
                    const statusIndex = Math.floor((progress / 100) * statusMessages.length);
                    if (statusIndex < statusMessages.length) {
                        progressStatus.textContent = statusMessages[statusIndex];
                    }
                }
            }, interval);
        });
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ============================================
    // CUSTOM CURSOR
    // ============================================
    initCustomCursor() {
        const cursor = document.querySelector('.tactical-cursor');
        const cursorTrail = document.querySelector('.cursor-trail');

        if (!cursor) return;

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let trailX = 0, trailY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth cursor animation
        const animateCursor = () => {
            // Main cursor - fast follow
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';

            // Trail - slower follow
            if (cursorTrail) {
                trailX += (mouseX - trailX) * 0.1;
                trailY += (mouseY - trailY) * 0.1;
                cursorTrail.style.left = trailX + 'px';
                cursorTrail.style.top = trailY + 'px';
            }

            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Hover effects on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .access-card, .dossier-node, .timeline-node, .tech-badge');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.querySelector('::before')?.style?.setProperty('background', '#00FF00');
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
            });
        });
    }

    // ============================================
    // TACTICAL DUALITY NAVIGATION & CARDS
    // 10ms Glitch Jitter Micro-Interaction
    // ============================================
    initTacticalDuality() {
        // Select both nav links and bento cards with duality effect
        const dualityElements = document.querySelectorAll('.duality-link, .duality-card');

        if (!dualityElements.length) return;

        dualityElements.forEach(element => {
            let glitchInterval = null;

            element.addEventListener('mouseenter', () => {
                // Trigger initial 10ms glitch jitter
                this.triggerGlitchJitter(element, 3); // 3 rapid jitters

                // Random micro-glitches during hover (simulates faulty monitor)
                glitchInterval = setInterval(() => {
                    if (Math.random() > 0.7) { // 30% chance of random glitch
                        this.triggerMicroGlitch(element);
                    }
                }, 500);

                // Log tactical context (for the Bat-Computer aesthetic)
                const context = element.getAttribute('data-context');
                if (context) {
                    console.log(`🦇 TACTICAL LAYER: ${context.toUpperCase()}`);
                }
            });

            element.addEventListener('mouseleave', () => {
                // Clear random glitch interval
                if (glitchInterval) {
                    clearInterval(glitchInterval);
                    glitchInterval = null;
                }

                // Quick exit glitch
                this.triggerGlitchJitter(element, 1);
            });
        });
    }

    // Rapid 10ms glitch jitter effect
    triggerGlitchJitter(element, count = 2) {
        // Support both nav links (.glitch-text) and cards (.glitch-label)
        const glitchText = element.querySelector('.glitch-text') || element.querySelector('.glitch-label');
        const batWatermark = element.querySelector('.bat-watermark') || element.querySelector('.bat-watermark-card');

        if (!glitchText) return;

        let iterations = 0;
        const jitterDuration = 10; // 10ms per jitter

        const jitter = () => {
            if (iterations >= count) {
                // Reset to normal
                glitchText.style.transform = '';
                glitchText.style.textShadow = '';
                if (batWatermark) {
                    batWatermark.style.transform = 'translate(-50%, -50%)';
                }
                return;
            }

            // Random offset values for authentic glitch feel
            const offsetX = (Math.random() - 0.5) * 4;
            const offsetY = (Math.random() - 0.5) * 2;
            const skewX = (Math.random() - 0.5) * 3;

            // Apply glitch transform
            glitchText.style.transform = `translate(${offsetX}px, ${offsetY}px) skewX(${skewX}deg)`;
            glitchText.style.textShadow = `
                ${-offsetX}px 0 rgba(0, 67, 156, 0.8),
                ${offsetX}px 0 rgba(0, 102, 204, 0.6),
                0 0 10px rgba(0, 67, 156, 0.9)
            `;

            // Also glitch the bat watermark occasionally
            if (batWatermark && Math.random() > 0.5) {
                batWatermark.style.transform = `translate(calc(-50% + ${offsetX * 0.5}px), calc(-50% + ${offsetY * 0.5}px))`;
            }

            iterations++;
            setTimeout(jitter, jitterDuration);
        };

        jitter();
    }

    // Subtle micro-glitch for continuous hover effect
    triggerMicroGlitch(element) {
        // Support both nav links and cards
        const corporateLayer = element.querySelector('.corporate-layer') || element.querySelector('.corporate-card');
        const batmanLayer = element.querySelector('.batman-layer') || element.querySelector('.batman-card');

        if (!corporateLayer && !batmanLayer) return;

        // Brief opacity flicker
        if (batmanLayer) {
            const originalOpacity = batmanLayer.style.opacity;
            batmanLayer.style.opacity = '0.7';

            setTimeout(() => {
                batmanLayer.style.opacity = originalOpacity || '1';
            }, 30);
        }

        // Add subtle filter distortion
        element.style.filter = 'brightness(1.1) contrast(1.05)';
        setTimeout(() => {
            element.style.filter = '';
        }, 20);
    }

    // ============================================
    // MOBILE NAVIGATION
    // ============================================
    initMobileNav() {
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.getElementById('navLinks');

        if (!navToggle || !navLinks) return;

        // Toggle mobile menu
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');

            // Log for Bat-Computer aesthetic
            const isOpen = navLinks.classList.contains('active');
            console.log(`🦇 NAV_PANEL: ${isOpen ? 'EXPANDED' : 'COLLAPSED'}`);
        });

        // Close menu when clicking a link
        const links = navLinks.querySelectorAll('.nav-link, .duality-link');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close menu on resize if viewport becomes large
        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
}

// ============================================
// INITIALIZE ON DOM LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new TacticalDashboard();
    console.log('🎯 TACTICAL DASHBOARD INITIALIZED');
    console.log('🔒 SECURITY CLEARANCE: LEVEL-5');
    console.log('✅ ALL SYSTEMS OPERATIONAL');
});