// ============================================
// WAYNE ENTERPRISES TACTICAL DASHBOARD
// JavaScript Functionality
// ============================================

class TacticalDashboard {
    constructor() {
        this.batSwarmActive = false;
        this.init();
    }

    init() {
        this.initThemeToggle(); // Initialize theme first for immediate visual setup
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
    // GLITCH REVEAL ANIMATION
    // ============================================
    initTypingAnimation() {
        const roles = [
            'SOFTWARE ENGINEER INTERN @ TD BANK',
            'DEVOPS ENGINEER',
            'ML ENGINEER'
        ];

        const typedElement = document.getElementById('typed-role');
        if (!typedElement) return;

        let roleIndex = 0;

        const glitchReveal = () => {
            const currentRole = roles[roleIndex];

            // Add glitch animation class
            typedElement.classList.remove('glitch-role');
            void typedElement.offsetWidth; // Force reflow

            // Set the text and trigger animation
            typedElement.textContent = currentRole;
            typedElement.classList.add('glitch-role');

            // Move to next role after display duration
            roleIndex = (roleIndex + 1) % roles.length;
        };

        // Initial reveal after boot sequence
        setTimeout(() => {
            glitchReveal();
            // Cycle through roles every 4 seconds
            setInterval(glitchReveal, 4000);
        }, 1500);
    }

    // ============================================
    // STAT COUNTERS
    // ============================================
    initStatCounters() {
        const statValues = document.querySelectorAll('.stat-value[data-target]');

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
            this.triggerBatSwarm();
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

    triggerBatSwarm() {
        if (this.batSwarmActive) return;
        this.batSwarmActive = true;

        const swarm = document.createElement('div');
        swarm.className = 'bat-swarm';

        const batCount = 84;
        let maxDuration = 0;
        let maxDelay = 0;
        const layers = ['bat--near', 'bat--mid', 'bat--far'];

        for (let i = 0; i < batCount; i++) {
            const bat = document.createElement('div');
            const layer = layers[i % layers.length];
            bat.className = `bat ${layer}`;

            const pattern = i % 4;
            let startX;
            let startY;
            let endX;
            let endY;
            let midX;
            let midY;

            if (pattern === 0) {
                startX = 40 + Math.random() * 20;
                startY = 85 + Math.random() * 15;
                endX = Math.random() * 100;
                endY = Math.random() * 35;
                midX = 30 + Math.random() * 40;
                midY = 45 + Math.random() * 20;
            } else if (pattern === 1) {
                startX = -10 + Math.random() * 20;
                startY = 55 + Math.random() * 40;
                endX = 90 + Math.random() * 20;
                endY = Math.random() * 40;
                midX = 40 + Math.random() * 25;
                midY = 25 + Math.random() * 25;
            } else if (pattern === 2) {
                startX = 90 + Math.random() * 20;
                startY = 55 + Math.random() * 40;
                endX = -10 + Math.random() * 20;
                endY = Math.random() * 45;
                midX = 60 + Math.random() * 25;
                midY = 25 + Math.random() * 25;
            } else {
                startX = Math.random() * 30;
                startY = 80 + Math.random() * 20;
                endX = 60 + Math.random() * 40;
                endY = Math.random() * 30;
                midX = 35 + Math.random() * 30;
                midY = 40 + Math.random() * 20;
            }

            const rotation = (Math.random() * 90) - 45;
            const sizeBase = layer === 'bat--near' ? 30 : layer === 'bat--mid' ? 22 : 16;
            const size = sizeBase + Math.random() * 18;
            const duration = 3 + Math.random() * 2;
            const delay = Math.random() * 0.9;
            const opacity = layer === 'bat--near' ? 0.85 : layer === 'bat--mid' ? 0.65 : 0.45;
            const blur = layer === 'bat--near' ? 0 : layer === 'bat--mid' ? 0.6 : 1.1;
            const flap = 0.22 + Math.random() * 0.18;

            maxDelay = Math.max(maxDelay, delay);
            maxDuration = Math.max(maxDuration, duration);

            bat.style.setProperty('--x-start', `${startX}vw`);
            bat.style.setProperty('--y-start', `${startY}vh`);
            bat.style.setProperty('--x-mid', `${midX}vw`);
            bat.style.setProperty('--y-mid', `${midY}vh`);
            bat.style.setProperty('--x-end', `${endX}vw`);
            bat.style.setProperty('--y-end', `${endY}vh`);
            bat.style.setProperty('--rotation', `${rotation}deg`);
            bat.style.setProperty('--size', `${size}px`);
            bat.style.setProperty('--duration', `${duration}s`);
            bat.style.setProperty('--delay', `${delay}s`);
            bat.style.setProperty('--opacity', opacity);
            bat.style.setProperty('--blur', `${blur}px`);
            bat.style.setProperty('--flap', `${flap}s`);

            bat.innerHTML = `
                <svg viewBox="0 0 100 40" aria-hidden="true">
                    <use href="#bat-silhouette"></use>
                </svg>
            `;

            swarm.appendChild(bat);
        }

        document.body.appendChild(swarm);

        const removeAfter = (maxDuration + maxDelay) * 1000;
        setTimeout(() => {
            swarm.remove();
            this.batSwarmActive = false;
        }, removeAfter);
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
    // THEME TOGGLE (LIGHT/DARK MODE) - Tactical Power Coupling
    // ============================================
    initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        const PULSE_CLASS = 'system-pulse-active';

        // Check for saved theme preference or default to 'tactical' (dark)
        const savedTheme = localStorage.getItem('theme') || 'tactical';

        // Apply saved theme immediately (before page fully loads)
        if (savedTheme === 'light') {
            body.setAttribute('data-theme', 'light');
        } else {
            body.setAttribute('data-theme', 'tactical');
        }

        if (!themeToggle) return;

        // Function to trigger the whole-body scanline pulse
        const triggerBodyPulse = () => {
            // Remove class if it exists to restart animation
            body.classList.remove(PULSE_CLASS);
            // Trigger reflow to ensure animation restarts
            void body.offsetWidth;
            // Add the class that contains the animation
            body.classList.add(PULSE_CLASS);

            // Clean up class after animation finishes (600ms matching CSS)
            setTimeout(() => {
                body.classList.remove(PULSE_CLASS);
            }, 600);
        };

        // Toggle theme on button click
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'tactical' : 'light';

            // Apply new theme immediately
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            // Fire the tactical pulse effect across the screen
            triggerBodyPulse();

            // Add transition class for smooth animation
            body.classList.add('theme-transitioning');
            setTimeout(() => {
                body.classList.remove('theme-transitioning');
            }, 300);

            // Log for tactical aesthetic
            console.log(`⚡ COUPLING: ${newTheme === 'light' ? 'VENT_MODE' : 'ARMED'}`);
        });

        // Dark mode (tactical) is always the default
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

            // Add body class for CSS targeting of theme toggle
            document.body.classList.toggle('mobile-menu-open');

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
                document.body.classList.remove('mobile-menu-open');
            });
        });

        // Close menu on resize if viewport becomes large
        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
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