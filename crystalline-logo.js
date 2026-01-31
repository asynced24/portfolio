// ============================================
// WAYNE ENTERPRISES CRYSTALLINE LOGO
// Abstract Sci-Fi Corporate Identity System
// Interactive 3D Floating Crystal with Energy Core
// ============================================

class CrystallineLogo {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.crystals = [];
        this.energyRings = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetRotation = { x: 0, y: 0 };
        this.currentRotation = { x: 0, y: 0 };
        this.time = 0;
        this.isHovered = false;
        this.pulsePhase = 0;

        this.init();
    }

    init() {
        this.createCanvas();
        this.createCrystals();
        this.createParticles();
        this.createEnergyRings();
        this.bindEvents();
        this.animate();
    }

    createCanvas() {
        // Use existing canvas from HTML or create new one
        this.canvas = this.container.querySelector('.crystalline-canvas');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.className = 'crystalline-canvas';
            this.container.appendChild(this.canvas);
        }
        // Set canvas dimensions for compact logo
        this.canvas.width = 60;
        this.canvas.height = 60;
        this.ctx = this.canvas.getContext('2d');

        // Center point - crystal centered in canvas
        this.centerX = 30;
        this.centerY = this.canvas.height / 2;
    }

    // Create 3D crystal geometry points
    createCrystals() {
        // Main crystal - hexagonal prism structure
        const mainCrystal = {
            vertices: this.generateHexCrystal(0, 0, 0, 14, 22),
            color: 'rgba(0, 150, 255, 0.95)',
            glowColor: 'rgba(0, 180, 255, 0.7)',
            rotation: { x: 0, y: 0, z: 0 },
            floatOffset: 0,
            floatSpeed: 0.025
        };

        // Orbiting smaller crystals
        const orbitingCrystals = [];
        for (let i = 0; i < 3; i++) {
            orbitingCrystals.push({
                vertices: this.generateHexCrystal(0, 0, 0, 5, 10),
                color: 'rgba(0, 200, 255, 0.8)',
                glowColor: 'rgba(0, 220, 255, 0.5)',
                orbitRadius: 22,
                orbitAngle: (i * Math.PI * 2) / 3,
                orbitSpeed: 0.018 + (i * 0.004),
                rotation: { x: Math.random() * Math.PI, y: Math.random() * Math.PI, z: 0 },
                floatOffset: Math.random() * Math.PI * 2,
                floatSpeed: 0.035
            });
        }

        this.crystals = {
            main: mainCrystal,
            orbiting: orbitingCrystals
        };
    }

    // Generate hexagonal crystal vertices
    generateHexCrystal(cx, cy, cz, radius, height) {
        const vertices = [];
        const sides = 6;

        // Top point
        vertices.push({ x: cx, y: cy - height / 2, z: cz, type: 'peak' });

        // Upper ring
        for (let i = 0; i < sides; i++) {
            const angle = (i / sides) * Math.PI * 2;
            vertices.push({
                x: cx + Math.cos(angle) * radius * 0.7,
                y: cy - height / 4,
                z: cz + Math.sin(angle) * radius * 0.7,
                type: 'upper'
            });
        }

        // Middle ring (widest)
        for (let i = 0; i < sides; i++) {
            const angle = (i / sides) * Math.PI * 2 + Math.PI / sides;
            vertices.push({
                x: cx + Math.cos(angle) * radius,
                y: cy,
                z: cz + Math.sin(angle) * radius,
                type: 'middle'
            });
        }

        // Lower ring
        for (let i = 0; i < sides; i++) {
            const angle = (i / sides) * Math.PI * 2;
            vertices.push({
                x: cx + Math.cos(angle) * radius * 0.7,
                y: cy + height / 4,
                z: cz + Math.sin(angle) * radius * 0.7,
                type: 'lower'
            });
        }

        // Bottom point
        vertices.push({ x: cx, y: cy + height / 2, z: cz, type: 'peak' });

        return vertices;
    }

    // Create particle system
    createParticles() {
        for (let i = 0; i < 25; i++) {
            this.particles.push({
                x: (Math.random() - 0.5) * 60,
                y: (Math.random() - 0.5) * 40,
                z: (Math.random() - 0.5) * 30,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                vz: (Math.random() - 0.5) * 0.08,
                size: Math.random() * 1.5 + 0.3,
                alpha: Math.random() * 0.4 + 0.25,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }

    // Create energy rings
    createEnergyRings() {
        for (let i = 0; i < 3; i++) {
            this.energyRings.push({
                radius: 18 + i * 6,
                rotation: { x: Math.PI / 4 + i * 0.3, y: 0, z: i * Math.PI / 6 },
                rotationSpeed: { x: 0.012, y: 0.025 + i * 0.006, z: 0.006 },
                opacity: 0.35 - i * 0.08,
                dashOffset: 0,
                dashSpeed: 2.5 + i
            });
        }
    }

    bindEvents() {
        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            this.mouseX = (e.clientX - rect.left) / rect.width - 0.5;
            this.mouseY = (e.clientY - rect.top) / rect.height - 0.5;
        });

        this.container.addEventListener('mouseenter', () => {
            this.isHovered = true;
        });

        this.container.addEventListener('mouseleave', () => {
            this.isHovered = false;
            this.mouseX = 0;
            this.mouseY = 0;
        });
    }

    // 3D rotation transformation
    rotatePoint(point, rotation) {
        let { x, y, z } = point;

        // Rotate around X axis
        const cosX = Math.cos(rotation.x);
        const sinX = Math.sin(rotation.x);
        const y1 = y * cosX - z * sinX;
        const z1 = y * sinX + z * cosX;

        // Rotate around Y axis
        const cosY = Math.cos(rotation.y);
        const sinY = Math.sin(rotation.y);
        const x2 = x * cosY + z1 * sinY;
        const z2 = -x * sinY + z1 * cosY;

        // Rotate around Z axis
        const cosZ = Math.cos(rotation.z || 0);
        const sinZ = Math.sin(rotation.z || 0);
        const x3 = x2 * cosZ - y1 * sinZ;
        const y3 = x2 * sinZ + y1 * cosZ;

        return { x: x3, y: y3, z: z2 };
    }

    // Project 3D to 2D with perspective
    project(point, offsetX = 0, offsetY = 0) {
        const fov = 200;
        const scale = fov / (fov + point.z);
        return {
            x: this.centerX + (point.x + offsetX) * scale,
            y: this.centerY + (point.y + offsetY) * scale,
            scale: scale
        };
    }

    // Draw glowing effect
    drawGlow(x, y, radius, color, intensity = 1) {
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, color.replace(/[\d.]+\)$/, `${0.8 * intensity})`));
        gradient.addColorStop(0.4, color.replace(/[\d.]+\)$/, `${0.3 * intensity})`));
        gradient.addColorStop(1, 'transparent');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // Draw a single crystal
    drawCrystal(crystal, offsetX = 0, offsetY = 0, scale = 1) {
        const rotation = {
            x: crystal.rotation.x + this.currentRotation.x * 0.5,
            y: crystal.rotation.y + this.currentRotation.y,
            z: crystal.rotation.z || 0
        };

        // Float animation
        const floatY = Math.sin(this.time * crystal.floatSpeed + crystal.floatOffset) * 3;

        const rotatedVertices = crystal.vertices.map(v => {
            const scaled = { x: v.x * scale, y: v.y * scale, z: v.z * scale };
            return this.rotatePoint(scaled, rotation);
        });

        const projectedVertices = rotatedVertices.map(v =>
            this.project(v, offsetX, offsetY + floatY)
        );

        // Draw crystal glow
        const centerProj = this.project({ x: 0, y: floatY, z: 0 }, offsetX, offsetY);
        this.drawGlow(centerProj.x, centerProj.y, 25 * scale, crystal.glowColor, this.isHovered ? 1.5 : 1);

        // Draw edges with gradient
        this.ctx.strokeStyle = crystal.color;
        this.ctx.lineWidth = this.isHovered ? 1.5 : 1;
        this.ctx.lineCap = 'round';

        // Connect vertices to form crystal faces
        const sides = 6;

        // Top pyramid edges
        for (let i = 1; i <= sides; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(projectedVertices[0].x, projectedVertices[0].y);
            this.ctx.lineTo(projectedVertices[i].x, projectedVertices[i].y);
            this.ctx.stroke();
        }

        // Upper ring edges
        for (let i = 1; i <= sides; i++) {
            const next = i === sides ? 1 : i + 1;
            this.ctx.beginPath();
            this.ctx.moveTo(projectedVertices[i].x, projectedVertices[i].y);
            this.ctx.lineTo(projectedVertices[next].x, projectedVertices[next].y);
            this.ctx.stroke();
        }

        // Connect upper to middle
        for (let i = 0; i < sides; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(projectedVertices[i + 1].x, projectedVertices[i + 1].y);
            this.ctx.lineTo(projectedVertices[i + sides + 1].x, projectedVertices[i + sides + 1].y);
            this.ctx.stroke();

            // Cross connections
            const nextMiddle = ((i + 1) % sides) + sides + 1;
            this.ctx.beginPath();
            this.ctx.moveTo(projectedVertices[i + 1].x, projectedVertices[i + 1].y);
            this.ctx.lineTo(projectedVertices[nextMiddle].x, projectedVertices[nextMiddle].y);
            this.ctx.stroke();
        }

        // Middle ring edges
        for (let i = sides + 1; i <= sides * 2; i++) {
            const next = i === sides * 2 ? sides + 1 : i + 1;
            this.ctx.beginPath();
            this.ctx.moveTo(projectedVertices[i].x, projectedVertices[i].y);
            this.ctx.lineTo(projectedVertices[next].x, projectedVertices[next].y);
            this.ctx.stroke();
        }

        // Connect middle to lower
        for (let i = 0; i < sides; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(projectedVertices[i + sides + 1].x, projectedVertices[i + sides + 1].y);
            this.ctx.lineTo(projectedVertices[i + 2 * sides + 1].x, projectedVertices[i + 2 * sides + 1].y);
            this.ctx.stroke();
        }

        // Lower ring edges
        for (let i = 2 * sides + 1; i <= 3 * sides; i++) {
            const next = i === 3 * sides ? 2 * sides + 1 : i + 1;
            this.ctx.beginPath();
            this.ctx.moveTo(projectedVertices[i].x, projectedVertices[i].y);
            this.ctx.lineTo(projectedVertices[next].x, projectedVertices[next].y);
            this.ctx.stroke();
        }

        // Bottom pyramid edges
        const lastIndex = projectedVertices.length - 1;
        for (let i = 2 * sides + 1; i <= 3 * sides; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(projectedVertices[lastIndex].x, projectedVertices[lastIndex].y);
            this.ctx.lineTo(projectedVertices[i].x, projectedVertices[i].y);
            this.ctx.stroke();
        }

        // Draw energy core
        if (scale > 0.5) {
            const coreIntensity = 0.5 + Math.sin(this.time * 0.05) * 0.3;
            this.drawGlow(centerProj.x, centerProj.y, 8 * scale, 'rgba(100, 200, 255, 0.8)', coreIntensity);

            // Core sparkle
            this.ctx.fillStyle = `rgba(255, 255, 255, ${0.8 + Math.sin(this.time * 0.1) * 0.2})`;
            this.ctx.beginPath();
            this.ctx.arc(centerProj.x, centerProj.y, 2 * scale, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    // Draw energy rings
    drawEnergyRings() {
        this.energyRings.forEach(ring => {
            ring.rotation.x += ring.rotationSpeed.x;
            ring.rotation.y += ring.rotationSpeed.y;
            ring.rotation.z += ring.rotationSpeed.z;
            ring.dashOffset += ring.dashSpeed;

            const segments = 36;
            const points = [];

            for (let i = 0; i <= segments; i++) {
                const angle = (i / segments) * Math.PI * 2;
                const point = {
                    x: Math.cos(angle) * ring.radius,
                    y: 0,
                    z: Math.sin(angle) * ring.radius
                };
                const rotated = this.rotatePoint(point, {
                    x: ring.rotation.x + this.currentRotation.x * 0.3,
                    y: ring.rotation.y + this.currentRotation.y * 0.3,
                    z: ring.rotation.z
                });
                points.push(this.project(rotated));
            }

            this.ctx.strokeStyle = `rgba(0, 150, 255, ${ring.opacity * (this.isHovered ? 1.5 : 1)})`;
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([4, 8]);
            this.ctx.lineDashOffset = ring.dashOffset;

            this.ctx.beginPath();
            points.forEach((p, i) => {
                if (i === 0) this.ctx.moveTo(p.x, p.y);
                else this.ctx.lineTo(p.x, p.y);
            });
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        });
    }

    // Draw floating particles
    drawParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.z += particle.vz;

            // Boundary wrap
            if (particle.x > 30) particle.x = -30;
            if (particle.x < -30) particle.x = 30;
            if (particle.y > 20) particle.y = -20;
            if (particle.y < -20) particle.y = 20;
            if (particle.z > 15) particle.z = -15;
            if (particle.z < -15) particle.z = 15;

            // Pulse animation
            const pulse = Math.sin(this.time * 0.03 + particle.pulsePhase) * 0.3 + 0.7;

            const rotated = this.rotatePoint(particle, {
                x: this.currentRotation.x * 0.2,
                y: this.currentRotation.y * 0.2,
                z: 0
            });
            const projected = this.project(rotated);

            const alpha = particle.alpha * pulse * (this.isHovered ? 1.3 : 1);
            this.ctx.fillStyle = `rgba(100, 200, 255, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(projected.x, projected.y, particle.size * projected.scale, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    // Draw connecting energy lines
    drawEnergyConnections() {
        if (!this.isHovered) return;

        const mainCenter = this.project({ x: 0, y: 0, z: 0 });

        this.crystals.orbiting.forEach(crystal => {
            const orbitX = Math.cos(crystal.orbitAngle) * crystal.orbitRadius;
            const orbitY = Math.sin(crystal.orbitAngle * 0.5) * 5;
            const orbitZ = Math.sin(crystal.orbitAngle) * crystal.orbitRadius * 0.5;

            const rotated = this.rotatePoint({ x: orbitX, y: orbitY, z: orbitZ }, {
                x: this.currentRotation.x * 0.3,
                y: this.currentRotation.y * 0.3,
                z: 0
            });
            const orbitalCenter = this.project(rotated);

            const gradient = this.ctx.createLinearGradient(
                mainCenter.x, mainCenter.y,
                orbitalCenter.x, orbitalCenter.y
            );
            gradient.addColorStop(0, 'rgba(0, 150, 255, 0.6)');
            gradient.addColorStop(0.5, 'rgba(0, 200, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 150, 255, 0.1)');

            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(mainCenter.x, mainCenter.y);
            this.ctx.lineTo(orbitalCenter.x, orbitalCenter.y);
            this.ctx.stroke();
        });
    }

    animate() {
        this.time++;

        // Smooth rotation following mouse
        this.targetRotation.x = this.mouseY * 0.5;
        this.targetRotation.y = this.mouseX * 0.8;

        this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.08;
        this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.08;

        // Auto-rotation when not hovered
        if (!this.isHovered) {
            this.currentRotation.y += 0.005;
        }

        // Update orbiting crystals
        this.crystals.orbiting.forEach(crystal => {
            crystal.orbitAngle += crystal.orbitSpeed;
            crystal.rotation.x += 0.01;
            crystal.rotation.y += 0.015;
        });

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background glow
        this.drawGlow(this.centerX, this.centerY, 45, 'rgba(0, 100, 200, 0.15)', this.isHovered ? 1.2 : 0.8);

        // Draw elements in order (back to front)
        this.drawParticles();
        this.drawEnergyRings();
        this.drawEnergyConnections();

        // Draw orbiting crystals
        this.crystals.orbiting.forEach(crystal => {
            const orbitX = Math.cos(crystal.orbitAngle) * crystal.orbitRadius;
            const orbitY = Math.sin(crystal.orbitAngle * 0.5) * 5;
            const orbitZ = Math.sin(crystal.orbitAngle) * crystal.orbitRadius * 0.5;

            // Only draw if in front
            const rotated = this.rotatePoint({ x: orbitX, y: orbitY, z: orbitZ }, {
                x: this.currentRotation.x * 0.3,
                y: this.currentRotation.y * 0.3,
                z: 0
            });

            if (rotated.z < 0) {
                this.drawCrystal(crystal, orbitX, orbitY, 0.5);
            }
        });

        // Draw main crystal
        this.drawCrystal(this.crystals.main, 0, 0, 1);

        // Draw front orbiting crystals
        this.crystals.orbiting.forEach(crystal => {
            const orbitX = Math.cos(crystal.orbitAngle) * crystal.orbitRadius;
            const orbitY = Math.sin(crystal.orbitAngle * 0.5) * 5;
            const orbitZ = Math.sin(crystal.orbitAngle) * crystal.orbitRadius * 0.5;

            const rotated = this.rotatePoint({ x: orbitX, y: orbitY, z: orbitZ }, {
                x: this.currentRotation.x * 0.3,
                y: this.currentRotation.y * 0.3,
                z: 0
            });

            if (rotated.z >= 0) {
                this.drawCrystal(crystal, orbitX, orbitY, 0.5);
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if the logo container exists
    const logoContainer = document.querySelector('.nav-logo');
    if (logoContainer) {
        logoContainer.id = 'crystalline-logo-container';
        new CrystallineLogo('crystalline-logo-container');
    }
});
