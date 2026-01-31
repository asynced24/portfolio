document.addEventListener('DOMContentLoaded', () => {
    const timeline = document.getElementById('lamp-timeline');
    if (!timeline) return;

    const nodes = Array.from(timeline.querySelectorAll('.lamp-node--exp'));

    const clearAll = (exceptNode) => {
        nodes.forEach(node => {
            if (node !== exceptNode) {
                node.classList.remove('is-lit');
            }
        });
    };

    const activateNode = (node) => {
        const beam = node.dataset.beam;
        if (!beam) return;
        clearAll(node);
        timeline.dataset.active = beam;
        node.classList.add('is-lit');
    };

    const deactivateNode = (node) => {
        const beam = node.dataset.beam;
        if (!beam) return;
        if (timeline.dataset.active === beam) {
            timeline.dataset.active = '';
        }
        node.classList.remove('is-lit');
    };

    nodes.forEach(node => {
        node.addEventListener('mouseenter', () => activateNode(node));
        node.addEventListener('mouseleave', () => deactivateNode(node));
        node.addEventListener('focus', () => activateNode(node));
        node.addEventListener('blur', () => deactivateNode(node));
        node.addEventListener('click', () => {
            const beam = node.dataset.beam;
            if (!beam) return;
            const isActive = timeline.dataset.active === beam;
            if (isActive) {
                deactivateNode(node);
            } else {
                activateNode(node);
            }
        });
    });
});
