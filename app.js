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