/* ============================================
   AGENT DOSSIER - Interactive Access Card
   (Transform Edition)
   ============================================ */

(function () {
    'use strict';

    // THE FULL ORIGINAL STORY
    const DOSSIER_CONTENT = [
        "I've always liked building things.",
        "",
        "One of the first things I hacked together was back in 6th grade. We had wired broadband, but no router.",
        "So I used USB tethering on my mom's phone to turn it into a high-speed hotspot.",
        "",
        "It worked perfectly.",
        "Well... until she got a call.",
        "",
        "That curiosity stuck. Now I build software, systems, and pipelines that actually scale.",
        "",
        "Outside of code? I train MMA & hit the Gym.",
        "Because sometimes, you just want to hit something that isn't a keyboard."
    ];

    let isOpen = false;
    let typewriterInProgress = false;

    // DOM Elements
    let avatar = document.getElementById('agentAvatar');
    let panel = document.getElementById('agentDossierPanel');
    let closeBtn = document.getElementById('dossierClose');
    let dossierText = document.getElementById('dossierText');
    let backdrop = document.getElementById('dossierBackdrop');
    let photoFrame = document.getElementById('photoFrame');
    let transformBtn = document.getElementById('transformBtn');

    // Create backdrop element if it doesn't exist
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'dossier-backdrop';
        backdrop.id = 'dossierBackdrop';
        document.body.appendChild(backdrop);
    }

    /* ============================================
       Typewriter Effect
       ============================================ */
    function typewriterEffect(lines, container, callback) {
        container.innerHTML = '';

        if (typewriterInProgress) return;
        typewriterInProgress = true;

        let lineIndex = 0;

        function typeLine() {
            if (!isOpen) {
                typewriterInProgress = false;
                return;
            }

            if (lineIndex >= lines.length) {
                typewriterInProgress = false;
                if (callback) callback();
                return;
            }

            const currentLine = lines[lineIndex];
            const lineDiv = document.createElement('div');
            lineDiv.className = 'dossier-line';

            // Handle empty lines for spacing
            if (currentLine.trim() === '') {
                lineDiv.className += ' paragraph-break';
                lineDiv.innerHTML = '&nbsp;';
                container.appendChild(lineDiv);
                lineIndex++;
                setTimeout(typeLine, 150);
                return;
            }

            lineDiv.textContent = currentLine;
            container.appendChild(lineDiv);

            lineIndex++;

            const baseDelay = 30;
            const lengthFactor = Math.min(currentLine.length, 60);
            setTimeout(typeLine, baseDelay + lengthFactor);
        }

        typeLine();
    }

    /* ============================================
       Panel Control Functions
       ============================================ */
    function openPanel() {
        if (isOpen) return;

        // Refresh DOM elements
        avatar = document.getElementById('agentAvatar');
        panel = document.getElementById('agentDossierPanel');
        closeBtn = document.getElementById('dossierClose');
        dossierText = document.getElementById('dossierText');
        photoFrame = document.getElementById('photoFrame');
        transformBtn = document.getElementById('transformBtn');

        isOpen = true;

        if (avatar) avatar.setAttribute('aria-expanded', 'true');
        if (backdrop) backdrop.classList.add('active');
        if (panel) panel.classList.add('active');

        document.body.style.overflow = 'hidden';

        // Animate Photo Reveal
        if (photoFrame) {
            photoFrame.style.opacity = '0';
            photoFrame.style.transform = 'translateY(10px)';
            photoFrame.style.transition = 'all 0.4s ease 0.1s';
            requestAnimationFrame(() => {
                photoFrame.style.opacity = '1';
                photoFrame.style.transform = 'translateY(0)';
            });
            // Reset to real photo on open
            photoFrame.classList.remove('pixel-mode');
        }

        // Start Typewriter
        setTimeout(() => {
            if (isOpen && dossierText) {
                typewriterEffect(DOSSIER_CONTENT, dossierText);
            }
        }, 500);

        document.addEventListener('keydown', handleEscapeKey);

        // Re-attach transform listener if needed (though global one should work if element persists)
        if (transformBtn && !transformBtn.hasAttribute('data-listening')) {
            transformBtn.addEventListener('click', toggleTransform);
            transformBtn.setAttribute('data-listening', 'true');
        }
    }

    function closePanel() {
        if (!isOpen) return;

        isOpen = false;

        if (avatar) avatar.setAttribute('aria-expanded', 'false');
        if (backdrop) backdrop.classList.remove('active');
        if (panel) panel.classList.remove('active');

        document.body.style.overflow = '';
        typewriterInProgress = false;
        if (dossierText) dossierText.innerHTML = '';

        document.removeEventListener('keydown', handleEscapeKey);
    }

    function togglePanel() {
        isOpen ? closePanel() : openPanel();
    }

    function toggleTransform(e) {
        e.stopPropagation();
        photoFrame = document.getElementById('photoFrame');
        if (photoFrame) {
            photoFrame.classList.toggle('pixel-mode');

            // Optional: Log transform
            const isPixel = photoFrame.classList.contains('pixel-mode');
            console.log(`IDENTITY MATRIX: ${isPixel ? '8-BIT AVATAR' : 'REAL PHOTO'}`);
        }
    }

    function handleEscapeKey(e) {
        if (e.key === 'Escape') closePanel();
    }

    // Initial Event Listeners
    if (avatar) {
        avatar.addEventListener('click', togglePanel);
        avatar.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                togglePanel();
            }
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closePanel(); });
    if (backdrop) backdrop.addEventListener('click', closePanel);
    if (panel) panel.addEventListener('click', (e) => e.stopPropagation());

    // Attach to transform button immediately if present
    if (transformBtn) {
        transformBtn.addEventListener('click', toggleTransform);
        transformBtn.setAttribute('data-listening', 'true');
    }

    console.log('Agent Dossier System: ONLINE v8.0 (Transform Matrix)');

})();
