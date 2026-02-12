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
       AVATAR CHAT BUBBLE ATTRACTOR - Variables
       ============================================ */
    const CHAT_MESSAGES = [
        "OPEN AGENT DOSSIER",
        "ACCESS PROFILE // LEVEL 5",
        "VIEW CLASSIFIED SUMMARY",
        "CLICK AVATAR TO ENTER",
        "INTERACTIVE CARD AVAILABLE",
        "INITIALIZE DOSSIER PREVIEW",
        "UNLOCK ENGINEERING BRIEF",
        "ENTER IDENTITY CONSOLE"
    ];

    const chatBubble = document.getElementById('avatarChatBubble');
    const chatTextEl = document.getElementById('chatText');
    let chatInterval = null;
    let lastMessage = null;
    let chatHideTimeout = null;
    let chatStartTimeout = null;
    let chatResumeTimeout = null;

    /* ============================================
       Panel Control Functions
       ============================================ */
    function openPanel() {
        if (isOpen) return;

        // Stop chat bubble
        stopChatCycle();

        if (chatResumeTimeout) {
            clearTimeout(chatResumeTimeout);
            chatResumeTimeout = null;
        }

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

        // Resume chat bubble after delay
        if (chatResumeTimeout) clearTimeout(chatResumeTimeout);
        chatResumeTimeout = setTimeout(() => {
            if (!isOpen) {
                showChatBubble();
                startChatCycle();
            }
        }, 2000);
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

    /* ============================================
       AVATAR CHAT BUBBLE - Functions
       ============================================ */
    function showChatBubble() {
        if (isOpen || !chatBubble || !chatTextEl) return;

        // Pick random message (avoid repeating last one)
        let message;
        do {
            message = CHAT_MESSAGES[Math.floor(Math.random() * CHAT_MESSAGES.length)];
        } while (message === lastMessage && CHAT_MESSAGES.length > 1);
        lastMessage = message;

        // Show bubble
        chatTextEl.textContent = message;
        updateChatPlacement();
        chatBubble.classList.add('visible');

        // Hide after 4.4 seconds
        if (chatHideTimeout) clearTimeout(chatHideTimeout);
        chatHideTimeout = setTimeout(() => {
            if (chatBubble) chatBubble.classList.remove('visible');
        }, 4400);
    }

    function updateChatPlacement() {
        if (!chatBubble) return;

        const viewportPadding = 12;
        const pointerGap = 14;
        const avatarRect = avatar ? avatar.getBoundingClientRect() : null;

        if (!avatarRect) return;

        const wasVisible = chatBubble.classList.contains('visible');

        chatBubble.classList.remove('place-left', 'place-right', 'place-top');
        chatBubble.classList.add('place-top');

        // Temporarily make measurable without showing it to user
        chatBubble.style.visibility = 'hidden';
        chatBubble.classList.add('visible');

        const bubbleWidth = chatBubble.offsetWidth;
        const bubbleHeight = chatBubble.offsetHeight;

        let bubbleLeft = avatarRect.left + (avatarRect.width / 2) - (bubbleWidth / 2);
        let bubbleTop = avatarRect.top - bubbleHeight - pointerGap;

        let placement = 'place-top';

        if (bubbleTop < viewportPadding) {
            bubbleLeft = avatarRect.left - bubbleWidth - pointerGap;
            bubbleTop = avatarRect.top + (avatarRect.height * 0.4) - (bubbleHeight / 2);
            placement = 'place-left';

            if (bubbleLeft < viewportPadding) {
                bubbleLeft = avatarRect.right + pointerGap;
                placement = 'place-right';
            }
        }

        bubbleLeft = Math.min(
            Math.max(bubbleLeft, viewportPadding),
            window.innerWidth - bubbleWidth - viewportPadding
        );

        bubbleTop = Math.min(
            Math.max(bubbleTop, viewportPadding),
            window.innerHeight - bubbleHeight - viewportPadding
        );

        chatBubble.classList.remove('place-left', 'place-right', 'place-top');
        chatBubble.classList.add(placement);
        chatBubble.style.setProperty('--bubble-left', `${Math.round(bubbleLeft)}px`);
        chatBubble.style.setProperty('--bubble-top', `${Math.round(bubbleTop)}px`);

        chatBubble.style.visibility = '';

        if (!wasVisible) {
            chatBubble.classList.remove('visible');
        }
    }

    function startChatCycle() {
        if (chatInterval) return;
        chatInterval = setInterval(showChatBubble, 8200);
    }

    function stopChatCycle() {
        if (chatInterval) {
            clearInterval(chatInterval);
            chatInterval = null;
        }
        if (chatStartTimeout) {
            clearTimeout(chatStartTimeout);
            chatStartTimeout = null;
        }
        if (chatResumeTimeout) {
            clearTimeout(chatResumeTimeout);
            chatResumeTimeout = null;
        }
        if (chatHideTimeout) {
            clearTimeout(chatHideTimeout);
            chatHideTimeout = null;
        }
        if (chatBubble) chatBubble.classList.remove('visible');
    }

    // Start initial bubble after 3 seconds
    chatStartTimeout = setTimeout(() => {
        chatStartTimeout = null;
        showChatBubble();
        startChatCycle();
    }, 3000);

    window.addEventListener('resize', () => {
        if (!isOpen && chatBubble) {
            updateChatPlacement();
        }
    });

    window.addEventListener('scroll', () => {
        if (!isOpen && chatBubble && chatBubble.classList.contains('visible')) {
            updateChatPlacement();
        }
    }, { passive: true });

    console.log('Agent Dossier System: ONLINE v8.0 (Transform Matrix)');

})();
