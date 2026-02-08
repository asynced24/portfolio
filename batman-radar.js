/**
 * BATMAN-THEMED SYSTEM CAPABILITIES RADAR
 * A sleek, Gotham-inspired holographic radar visualization
 * Using D3.js for dynamic SVG manipulation
 */

class BatmanRadar {
    constructor(containerId, data) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.data = data || [
            { axis: 'CLOUD', value: 0.85 },
            { axis: 'FULLSTACK', value: 0.90 },
            { axis: 'ML', value: 0.75 },
            { axis: 'DEVOPS', value: 0.95 }
        ];

        // Configuration
        this.config = {
            w: 280,
            h: 280,
            margin: { top: 75, right: 85, bottom: 75, left: 85 }, // Further increased for "FULLSTACK"
            levels: 5,
            maxValue: 1,
            labelFactor: 1.35, // Pushed labels further out
            opacityArea: 0.15,
            dotRadius: 6,
            strokeWidth: 2,
            transitionDuration: 1500,
            sweepDuration: 3000,
            colors: {
                // We now use CSS variables where possible, but keep these as fallbacks or for specific JS calculations
                primary: '#00D9FF'
            }
        };

        this.particles = [];
        this.isHoveringCenter = false;
        this.isMobile = window.innerWidth <= 768;

        this.init();
    }

    init() {
        this.createSVG();
        this.createDefs();
        this.createHexBackground();
        this.createScanlines();
        this.createGrid();
        this.createAxes();
        this.createDataPolygon();
        this.createDataPoints();
        this.createLabels();
        this.createSweepLine();
        this.createParticles();
        this.createCenterPoint();
        this.startAnimations();
        this.setupEventListeners();
    }

    createSVG() {
        // Clear existing content
        this.container.innerHTML = '';

        const { w, h, margin } = this.config;
        const totalWidth = w + margin.left + margin.right;
        const totalHeight = h + margin.top + margin.bottom;

        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('class', 'batman-radar-svg');
        this.svg.setAttribute('viewBox', `0 0 ${totalWidth} ${totalHeight}`);
        this.svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

        this.container.appendChild(this.svg);

        // Main group with margin offset
        this.mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.mainGroup.setAttribute('transform', `translate(${margin.left + w / 2}, ${margin.top + h / 2})`);
        this.svg.appendChild(this.mainGroup);

        this.radius = Math.min(w, h) / 2;
        this.angleSlice = (Math.PI * 2) / this.data.length;
    }

    createDefs() {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

        // Glow filter for neon effect
        const glowFilter = `
            <filter id="batGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            <filter id="batGlowStrong" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            <linearGradient id="dataGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" class="radar-gradient-start">
                    <animate attributeName="offset" values="0;1;0" dur="3s" repeatCount="indefinite"/>
                </stop>
                <stop offset="50%" class="radar-gradient-mid"/>
                <stop offset="100%" class="radar-gradient-end">
                    <animate attributeName="offset" values="1;0;1" dur="3s" repeatCount="indefinite"/>
                </stop>
            </linearGradient>
            <radialGradient id="sweepGradient">
                <stop offset="0%" class="radar-sweep-start"/>
                <stop offset="100%" class="radar-sweep-end"/>
            </radialGradient>
        `;

        defs.innerHTML = glowFilter;
        this.svg.insertBefore(defs, this.svg.firstChild);
    }

    createHexBackground() {
        const hexGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        hexGroup.setAttribute('class', 'hex-background');

        const hexSize = 15;
        const hexHeight = hexSize * Math.sqrt(3);

        for (let row = -5; row <= 5; row++) {
            for (let col = -5; col <= 5; col++) {
                const x = col * hexSize * 1.5;
                const y = row * hexHeight + (col % 2 ? hexHeight / 2 : 0);

                if (Math.sqrt(x * x + y * y) < this.radius * 1.1) {
                    const hex = this.createHexagon(x, y, hexSize * 0.9);
                    hex.setAttribute('class', 'hex-cell');
                    hex.style.animationDelay = `${Math.random() * 2}s`;
                    hexGroup.appendChild(hex);
                }
            }
        }

        this.mainGroup.appendChild(hexGroup);
    }

    createHexagon(cx, cy, size) {
        const points = [];
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            points.push(`${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`);
        }

        const hex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        hex.setAttribute('points', points.join(' '));
        return hex;
    }

    createScanlines() {
        const scanGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        scanGroup.setAttribute('class', 'scanlines');

        const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clipPath.setAttribute('id', 'radarClip');
        const clipCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        clipCircle.setAttribute('r', this.radius);
        clipPath.appendChild(clipCircle);
        this.svg.querySelector('defs').appendChild(clipPath);

        scanGroup.setAttribute('clip-path', 'url(#radarClip)');

        for (let y = -this.radius; y < this.radius; y += 4) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', -this.radius);
            line.setAttribute('y1', y);
            line.setAttribute('x2', this.radius);
            line.setAttribute('y2', y);
            line.setAttribute('class', 'scanline');
            scanGroup.appendChild(line);
        }

        this.mainGroup.appendChild(scanGroup);
    }

    createGrid() {
        const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        gridGroup.setAttribute('class', 'radar-grid-group');

        // Create concentric grid levels
        for (let level = 1; level <= this.config.levels; level++) {
            const levelRadius = (this.radius * level) / this.config.levels;
            const points = [];

            for (let i = 0; i < this.data.length; i++) {
                const angle = this.angleSlice * i - Math.PI / 2;
                const x = levelRadius * Math.cos(angle);
                const y = levelRadius * Math.sin(angle);
                points.push(`${x},${y}`);
            }

            const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            polygon.setAttribute('points', points.join(' '));
            polygon.setAttribute('class', 'radar-grid-level');
            polygon.style.opacity = '0';
            polygon.style.animationDelay = `${level * 0.1}s`;
            gridGroup.appendChild(polygon);

            // Percentage label
            if (level < this.config.levels) {
                const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label.setAttribute('x', 5);
                label.setAttribute('y', -levelRadius);
                label.setAttribute('class', 'grid-percent-label');
                label.textContent = `${level * 20}%`;
                gridGroup.appendChild(label);
            }
        }

        this.mainGroup.appendChild(gridGroup);
    }

    createAxes() {
        const axisGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        axisGroup.setAttribute('class', 'radar-axes-group');

        this.data.forEach((d, i) => {
            const angle = this.angleSlice * i - Math.PI / 2;
            const x = this.radius * Math.cos(angle);
            const y = this.radius * Math.sin(angle);

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', 0);
            line.setAttribute('y1', 0);
            line.setAttribute('x2', x);
            line.setAttribute('y2', y);
            line.setAttribute('class', 'radar-axis-line');
            line.setAttribute('data-axis', d.axis);
            axisGroup.appendChild(line);
        });

        this.mainGroup.appendChild(axisGroup);
    }

    createDataPolygon() {
        const polygonGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        polygonGroup.setAttribute('class', 'radar-data-group');

        // Calculate data points
        const dataPoints = this.data.map((d, i) => {
            const angle = this.angleSlice * i - Math.PI / 2;
            const r = (this.radius * d.value) / this.config.maxValue;
            return {
                x: r * Math.cos(angle),
                y: r * Math.sin(angle)
            };
        });

        // Create polygon stroke (glowing outline)
        const polygonStroke = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygonStroke.setAttribute('class', 'radar-data-stroke');
        polygonStroke.setAttribute('points', '0,0 0,0 0,0 0,0'); // Start from center
        polygonStroke.setAttribute('filter', 'url(#batGlow)');
        polygonGroup.appendChild(polygonStroke);

        // Create polygon fill
        const polygonFill = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygonFill.setAttribute('class', 'radar-data-fill');
        polygonFill.setAttribute('points', '0,0 0,0 0,0 0,0'); // Start from center
        polygonGroup.appendChild(polygonFill);

        this.dataPolygon = { stroke: polygonStroke, fill: polygonFill, points: dataPoints };
        this.mainGroup.appendChild(polygonGroup);
    }

    createDataPoints() {
        const pointsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        pointsGroup.setAttribute('class', 'radar-points-group');

        this.dataPoints = this.data.map((d, i) => {
            const angle = this.angleSlice * i - Math.PI / 2;
            const r = (this.radius * d.value) / this.config.maxValue;
            const x = r * Math.cos(angle);
            const y = r * Math.sin(angle);

            // Outer pulsing ring
            const outerRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            outerRing.setAttribute('cx', x);
            outerRing.setAttribute('cy', y);
            outerRing.setAttribute('r', this.config.dotRadius + 4);
            outerRing.setAttribute('class', 'radar-point-outer');
            outerRing.style.opacity = '0';
            pointsGroup.appendChild(outerRing);

            // Inner solid circle
            const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            innerCircle.setAttribute('cx', x);
            innerCircle.setAttribute('cy', y);
            innerCircle.setAttribute('r', this.config.dotRadius);
            innerCircle.setAttribute('class', 'radar-point-inner');
            innerCircle.setAttribute('data-axis', d.axis);
            innerCircle.setAttribute('data-value', Math.round(d.value * 100));
            innerCircle.setAttribute('filter', 'url(#batGlow)');
            innerCircle.style.opacity = '0';
            pointsGroup.appendChild(innerCircle);

            return { outer: outerRing, inner: innerCircle, x, y, data: d };
        });

        this.mainGroup.appendChild(pointsGroup);
    }

    createLabels() {
        const labelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        labelGroup.setAttribute('class', 'radar-labels-group');

        this.data.forEach((d, i) => {
            const angle = this.angleSlice * i - Math.PI / 2;
            const labelRadius = this.radius * this.config.labelFactor;
            const x = labelRadius * Math.cos(angle);
            const y = labelRadius * Math.sin(angle);

            // Connecting line
            const lineEnd = this.radius * 1.08;
            const connectorLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            connectorLine.setAttribute('x1', lineEnd * Math.cos(angle));
            connectorLine.setAttribute('y1', lineEnd * Math.sin(angle));
            connectorLine.setAttribute('x2', x * 0.95);
            connectorLine.setAttribute('y2', y * 0.95);
            connectorLine.setAttribute('class', 'label-connector');
            labelGroup.appendChild(connectorLine);

            // Label text
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', x);
            label.setAttribute('y', y);
            label.setAttribute('class', 'radar-axis-label');
            label.setAttribute('data-axis', d.axis);

            // Adjust text anchor based on position
            if (Math.abs(x) < 10) {
                label.setAttribute('text-anchor', 'middle');
            } else if (x > 0) {
                label.setAttribute('text-anchor', 'start');
            } else {
                label.setAttribute('text-anchor', 'end');
            }

            if (y > this.radius * 0.5) {
                label.setAttribute('dy', '1.2em');
            } else if (y < -this.radius * 0.5) {
                label.setAttribute('dy', '-0.5em');
            } else {
                label.setAttribute('dy', '0.35em');
            }

            label.textContent = d.axis;
            label.style.opacity = '0';
            labelGroup.appendChild(label);
        });

        this.mainGroup.appendChild(labelGroup);
    }

    createSweepLine() {
        const sweepGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        sweepGroup.setAttribute('class', 'radar-sweep-group');

        // Create sweep arc with gradient trail
        const sweepPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        sweepPath.setAttribute('class', 'radar-sweep');
        sweepPath.setAttribute('d', this.describeSweepArc(0, 45));
        sweepPath.setAttribute('filter', 'url(#batGlow)');
        sweepGroup.appendChild(sweepPath);

        // Sweep line
        const sweepLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        sweepLine.setAttribute('x1', 0);
        sweepLine.setAttribute('y1', 0);
        sweepLine.setAttribute('x2', this.radius);
        sweepLine.setAttribute('y2', 0);
        sweepLine.setAttribute('class', 'radar-sweep-line');
        sweepLine.setAttribute('filter', 'url(#batGlow)');
        sweepGroup.appendChild(sweepLine);

        this.sweepGroup = sweepGroup;
        this.mainGroup.appendChild(sweepGroup);
    }

    describeSweepArc(startAngle, endAngle) {
        const start = this.polarToCartesian(0, 0, this.radius * 0.95, endAngle);
        const end = this.polarToCartesian(0, 0, this.radius * 0.95, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

        return [
            'M', 0, 0,
            'L', start.x, start.y,
            'A', this.radius * 0.95, this.radius * 0.95, 0, largeArcFlag, 0, end.x, end.y,
            'Z'
        ].join(' ');
    }

    polarToCartesian(cx, cy, r, angleDeg) {
        const angleRad = (angleDeg - 90) * Math.PI / 180;
        return {
            x: cx + r * Math.cos(angleRad),
            y: cy + r * Math.sin(angleRad)
        };
    }

    createParticles() {
        const particleGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        particleGroup.setAttribute('class', 'radar-particles');

        const particleCount = this.isMobile ? 10 : 25;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * this.radius * 0.9;

            particle.setAttribute('cx', distance * Math.cos(angle));
            particle.setAttribute('cy', distance * Math.sin(angle));
            particle.setAttribute('r', Math.random() * 2 + 0.5);
            particle.setAttribute('class', 'radar-particle');
            particle.style.animationDelay = `${Math.random() * 3}s`;
            particle.style.animationDuration = `${3 + Math.random() * 2}s`;

            particleGroup.appendChild(particle);
            this.particles.push({
                element: particle,
                angle,
                distance,
                speed: 0.001 + Math.random() * 0.002
            });
        }

        this.mainGroup.appendChild(particleGroup);
    }

    createCenterPoint() {
        const centerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        centerGroup.setAttribute('class', 'radar-center');

        // Outer ring
        const outerRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        outerRing.setAttribute('r', 12);
        outerRing.setAttribute('class', 'center-outer-ring');
        centerGroup.appendChild(outerRing);

        // Inner core
        const innerCore = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        innerCore.setAttribute('r', 6);
        innerCore.setAttribute('class', 'center-inner-core');
        innerCore.setAttribute('filter', 'url(#batGlowStrong)');
        centerGroup.appendChild(innerCore);

        // Wayne Enterprises text (hidden by default)
        const wayneText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        wayneText.setAttribute('y', 30);
        wayneText.setAttribute('class', 'wayne-easter-egg');
        wayneText.setAttribute('text-anchor', 'middle');
        wayneText.textContent = '';
        centerGroup.appendChild(wayneText);

        this.centerGroup = centerGroup;
        this.wayneText = wayneText;
        this.mainGroup.appendChild(centerGroup);
    }

    startAnimations() {
        // Delayed start for page load sequence
        setTimeout(() => {
            this.animateGridIn();
        }, 500);

        setTimeout(() => {
            this.animateDataPolygon();
        }, 1000);

        setTimeout(() => {
            this.animateDataPoints();
        }, 1800);

        setTimeout(() => {
            this.animateLabels();
            this.startSweepAnimation();
            this.startParticleAnimation();
        }, 2200);
    }

    animateGridIn() {
        const gridLevels = this.svg.querySelectorAll('.radar-grid-level');
        gridLevels.forEach((level, i) => {
            setTimeout(() => {
                level.style.opacity = '1';
                level.classList.add('animate-in');
            }, i * 100);
        });

        const axisLines = this.svg.querySelectorAll('.radar-axis-line');
        axisLines.forEach((line, i) => {
            setTimeout(() => {
                line.classList.add('animate-in');
            }, i * 150);
        });
    }

    animateDataPolygon() {
        const pointsStr = this.dataPolygon.points.map(p => `${p.x},${p.y}`).join(' ');

        // Animate using CSS transitions
        this.dataPolygon.stroke.style.transition = `all ${this.config.transitionDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1)`;
        this.dataPolygon.fill.style.transition = `all ${this.config.transitionDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1)`;

        requestAnimationFrame(() => {
            this.dataPolygon.stroke.setAttribute('points', pointsStr);
            this.dataPolygon.fill.setAttribute('points', pointsStr);
        });
    }

    animateDataPoints() {
        this.dataPoints.forEach((point, i) => {
            setTimeout(() => {
                point.outer.style.opacity = '1';
                point.inner.style.opacity = '1';
                point.outer.classList.add('pulse');
            }, i * 150);
        });
    }

    animateLabels() {
        const labels = this.svg.querySelectorAll('.radar-axis-label');
        labels.forEach((label, i) => {
            setTimeout(() => {
                label.style.opacity = '1';
                label.classList.add('animate-in');
            }, i * 100);
        });

        const connectors = this.svg.querySelectorAll('.label-connector');
        connectors.forEach((conn, i) => {
            setTimeout(() => {
                conn.classList.add('animate-in');
            }, i * 100);
        });
    }

    startSweepAnimation() {
        let angle = 0;
        let lastTime = performance.now();
        const rotationSpeed = 360 / (this.config.sweepDuration); // degrees per ms

        const animate = (currentTime) => {
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            // Smooth rotation based on elapsed time
            angle = (angle + rotationSpeed * deltaTime) % 360;
            this.sweepGroup.style.transform = `rotate(${angle}deg)`;

            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }

    startParticleAnimation() {
        const animate = () => {
            this.particles.forEach(p => {
                p.angle += p.speed;
                p.element.setAttribute('cx', p.distance * Math.cos(p.angle));
                p.element.setAttribute('cy', p.distance * Math.sin(p.angle));
            });
            requestAnimationFrame(animate);
        };
        animate();
    }

    setupEventListeners() {
        // Data point hover effects
        this.dataPoints.forEach(point => {
            point.inner.addEventListener('mouseenter', (e) => this.handlePointHover(e, point, true));
            point.inner.addEventListener('mouseleave', (e) => this.handlePointHover(e, point, false));
            point.inner.addEventListener('touchstart', (e) => this.handlePointHover(e, point, true));
            point.inner.addEventListener('touchend', (e) => this.handlePointHover(e, point, false));
        });

        // Center point Easter egg
        const centerElements = this.centerGroup.querySelectorAll('circle');
        centerElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.showWayneEasterEgg());
            el.addEventListener('mouseleave', () => this.hideWayneEasterEgg());
        });

        // Resize handler
        window.addEventListener('resize', this.debounce(() => {
            this.isMobile = window.innerWidth <= 768;
        }, 250));
    }

    handlePointHover(e, point, isEntering) {
        if (isEntering) {
            point.inner.classList.add('hover');
            point.outer.classList.add('hover');
            this.showTooltip(point);
            this.intensifyAxisLine(point.data.axis);
            this.createSparkEffect(point.x, point.y);
        } else {
            point.inner.classList.remove('hover');
            point.outer.classList.remove('hover');
            this.hideTooltip();
            this.normalizeAxisLine(point.data.axis);
        }
    }

    showTooltip(point) {
        // Remove existing tooltip
        this.hideTooltip();

        const tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        tooltip.setAttribute('class', 'radar-tooltip');

        // Background
        const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bg.setAttribute('x', point.x - 35);
        bg.setAttribute('y', point.y - 45);
        bg.setAttribute('width', 70);
        bg.setAttribute('height', 30);
        bg.setAttribute('rx', 4);
        tooltip.appendChild(bg);

        // Text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', point.x);
        text.setAttribute('y', point.y - 25);
        text.setAttribute('text-anchor', 'middle');
        text.innerHTML = `<tspan class="tooltip-label">${point.data.axis}</tspan><tspan x="${point.x}" dy="1.2em" class="tooltip-value">${Math.round(point.data.value * 100)}%</tspan>`;
        tooltip.appendChild(text);

        this.tooltip = tooltip;
        this.mainGroup.appendChild(tooltip);
    }

    hideTooltip() {
        if (this.tooltip && this.tooltip.parentNode) {
            this.tooltip.parentNode.removeChild(this.tooltip);
            this.tooltip = null;
        }
    }

    intensifyAxisLine(axis) {
        const line = this.svg.querySelector(`.radar-axis-line[data-axis="${axis}"]`);
        if (line) {
            line.classList.add('intensified');
        }
    }

    normalizeAxisLine(axis) {
        const line = this.svg.querySelector(`.radar-axis-line[data-axis="${axis}"]`);
        if (line) {
            line.classList.remove('intensified');
        }
    }

    createSparkEffect(x, y) {
        const sparkGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        sparkGroup.setAttribute('class', 'spark-effect');

        for (let i = 0; i < 8; i++) {
            const spark = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            const angle = (Math.PI * 2 * i) / 8;
            spark.setAttribute('cx', x);
            spark.setAttribute('cy', y);
            spark.setAttribute('r', 1.5);
            spark.setAttribute('class', 'spark');
            spark.style.setProperty('--angle', `${angle}rad`);
            sparkGroup.appendChild(spark);
        }

        this.mainGroup.appendChild(sparkGroup);

        setTimeout(() => {
            if (sparkGroup.parentNode) {
                sparkGroup.parentNode.removeChild(sparkGroup);
            }
        }, 600);
    }

    showWayneEasterEgg() {
        if (this.isHoveringCenter) return;
        this.isHoveringCenter = true;

        const text = 'WAYNE_ENTERPRISES';
        let index = 0;

        this.wayneText.textContent = '';
        this.wayneText.style.opacity = '1';

        const typeWriter = () => {
            if (index < text.length && this.isHoveringCenter) {
                this.wayneText.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 50);
            }
        };

        typeWriter();
    }

    hideWayneEasterEgg() {
        this.isHoveringCenter = false;
        this.wayneText.style.opacity = '0';
        setTimeout(() => {
            if (!this.isHoveringCenter) {
                this.wayneText.textContent = '';
            }
        }, 300);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Wait for boot sequence
    setTimeout(() => {
        const radar = new BatmanRadar('batman-radar-container', [
            { axis: 'CLOUD', value: 0.85 },
            { axis: 'FULLSTACK', value: 0.90 },
            { axis: 'ML', value: 0.75 },
            { axis: 'DEVOPS', value: 0.95 }
        ]);

        // Make accessible globally for debugging
        window.batmanRadar = radar;
    }, 2500);
});
