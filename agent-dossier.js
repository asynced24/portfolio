/* ============================================
   AGENT DOSSIER — Interactive Access Card
   Clean, Senior-Grade Implementation
   ============================================ */

(function () {
    'use strict';

    /* ── Story Content ── */
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

    /* ── Chat Bubble Messages — Fun, Human, Witty ── */
    const CHAT_MESSAGES = [
        "psst... click me 👀",
        "hey, wanna see something cool?",
        "I don't bite. usually.",
        "yes, I'm clickable ↗",
        "fun fact: I once hacked WiFi",
        "try clicking. I dare you.",
        "↑ this guy builds stuff",
        "open my dossier, I dare you 🔒"
    ];

    let isOpen = false;
    let typewriterInProgress = false;

    /* ── DOM References ── */
    let avatar = document.getElementById('agentAvatar');
    let panel = document.getElementById('agentDossierPanel');
    let closeBtn = document.getElementById('dossierClose');
    let dossierText = document.getElementById('dossierText');
    let backdrop = document.getElementById('dossierBackdrop');
    let photoFrame = document.getElementById('photoFrame');
    let transformBtn = document.getElementById('transformBtn');

    // Create backdrop if missing
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'dossier-backdrop';
        backdrop.id = 'dossierBackdrop';
        document.body.appendChild(backdrop);
    }

    /* ── Typewriter Effect ── */
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

            if (currentLine.trim() === '') {
                lineDiv.className += ' paragraph-break';
                lineDiv.innerHTML = '&nbsp;';
                container.appendChild(lineDiv);
                lineIndex++;
                setTimeout(typeLine, 120);
                return;
            }

            lineDiv.textContent = currentLine;
            container.appendChild(lineDiv);
            lineIndex++;

            // Natural typing rhythm
            const delay = 40 + Math.min(currentLine.length * 0.5, 30);
            setTimeout(typeLine, delay);
        }

        typeLine();
    }

    /* ── Chat Bubble State ── */
    const chatBubble = document.getElementById('avatarChatBubble');
    const chatTextEl = document.getElementById('chatText');
    let chatInterval = null;
    let lastMessage = null;
    let chatHideTimeout = null;
    let chatStartTimeout = null;
    let chatResumeTimeout = null;

    /* ── Panel Open/Close ── */
    function openPanel() {
        if (isOpen) return;
        stopChatCycle();
        if (chatResumeTimeout) { clearTimeout(chatResumeTimeout); chatResumeTimeout = null; }

        // Refresh DOM refs
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

        // Animate photo in
        if (photoFrame) {
            photoFrame.style.opacity = '0';
            photoFrame.style.transform = 'translateY(8px)';
            photoFrame.style.transition = 'all 0.4s ease 0.1s';
            requestAnimationFrame(() => {
                photoFrame.style.opacity = '1';
                photoFrame.style.transform = 'translateY(0)';
            });
            photoFrame.classList.remove('pixel-mode');
        }

        // Start typewriter
        setTimeout(() => {
            if (isOpen && dossierText) {
                typewriterEffect(DOSSIER_CONTENT, dossierText);
            }
        }, 400);

        document.addEventListener('keydown', handleEscapeKey);

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

        // Resume chat after delay
        if (chatResumeTimeout) clearTimeout(chatResumeTimeout);
        chatResumeTimeout = setTimeout(() => {
            if (!isOpen) {
                showChatBubble();
                startChatCycle();
            }
        }, 3000);
    }

    function togglePanel() {
        isOpen ? closePanel() : openPanel();
    }

    function toggleTransform(e) {
        e.stopPropagation();
        photoFrame = document.getElementById('photoFrame');
        if (photoFrame) {
            photoFrame.classList.toggle('pixel-mode');
        }
    }

    function handleEscapeKey(e) {
        if (e.key === 'Escape') closePanel();
    }

    /* ── Event Listeners ── */
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

    if (transformBtn) {
        transformBtn.addEventListener('click', toggleTransform);
        transformBtn.setAttribute('data-listening', 'true');
    }

    /* ── Chat Bubble Logic ── */
    function showChatBubble() {
        if (isOpen || !chatBubble || !chatTextEl) return;

        let message;
        do {
            message = CHAT_MESSAGES[Math.floor(Math.random() * CHAT_MESSAGES.length)];
        } while (message === lastMessage && CHAT_MESSAGES.length > 1);
        lastMessage = message;

        chatTextEl.textContent = message;
        updateChatPlacement();
        chatBubble.classList.add('visible');

        if (chatHideTimeout) clearTimeout(chatHideTimeout);
        chatHideTimeout = setTimeout(() => {
            if (chatBubble) chatBubble.classList.remove('visible');
        }, 4000);
    }

    function updateChatPlacement() {
        if (!chatBubble || !avatar) return;

        const pad = 12;
        const gap = 14;
        const rect = avatar.getBoundingClientRect();
        const wasVisible = chatBubble.classList.contains('visible');

        chatBubble.classList.remove('place-left', 'place-right', 'place-top');
        chatBubble.classList.add('place-top');

        // Measure
        chatBubble.style.visibility = 'hidden';
        chatBubble.classList.add('visible');

        const bw = chatBubble.offsetWidth;
        const bh = chatBubble.offsetHeight;

        let x = rect.left + (rect.width / 2) - (bw / 2);
        let y = rect.top - bh - gap;
        let placement = 'place-top';

        if (y < pad) {
            x = rect.left - bw - gap;
            y = rect.top + (rect.height * 0.4) - (bh / 2);
            placement = 'place-left';

            if (x < pad) {
                x = rect.right + gap;
                placement = 'place-right';
            }
        }

        x = Math.min(Math.max(x, pad), window.innerWidth - bw - pad);
        y = Math.min(Math.max(y, pad), window.innerHeight - bh - pad);

        chatBubble.classList.remove('place-left', 'place-right', 'place-top');
        chatBubble.classList.add(placement);
        chatBubble.style.setProperty('--bubble-left', `${Math.round(x)}px`);
        chatBubble.style.setProperty('--bubble-top', `${Math.round(y)}px`);

        chatBubble.style.visibility = '';
        if (!wasVisible) chatBubble.classList.remove('visible');
    }

    function startChatCycle() {
        if (chatInterval) return;
        chatInterval = setInterval(showChatBubble, 8000);
    }

    function stopChatCycle() {
        if (chatInterval) { clearInterval(chatInterval); chatInterval = null; }
        if (chatStartTimeout) { clearTimeout(chatStartTimeout); chatStartTimeout = null; }
        if (chatResumeTimeout) { clearTimeout(chatResumeTimeout); chatResumeTimeout = null; }
        if (chatHideTimeout) { clearTimeout(chatHideTimeout); chatHideTimeout = null; }
        if (chatBubble) chatBubble.classList.remove('visible');
    }

    // Kick off after 3s
    chatStartTimeout = setTimeout(() => {
        chatStartTimeout = null;
        showChatBubble();
        startChatCycle();
    }, 3000);

    window.addEventListener('resize', () => {
        if (!isOpen && chatBubble) updateChatPlacement();
    });

    window.addEventListener('scroll', () => {
        if (!isOpen && chatBubble && chatBubble.classList.contains('visible')) {
            updateChatPlacement();
        }
    }, { passive: true });

})();
