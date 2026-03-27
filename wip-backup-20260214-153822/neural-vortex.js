// ============================================
// NEURAL VORTEX WEBGL BACKGROUND
// Interactive Shader-Based Ambient Background
// PlayStation Blue / Cyan Palette Integration
// ============================================

class NeuralVortex {
    constructor() {
        this.canvas = null;
        this.gl = null;
        this.program = null;
        this.vertexShader = null;
        this.fragmentShader = null;
        this.animationId = null;
        this.pointer = { x: 0, y: 0, tX: 0, tY: 0 };
        this.isRunning = true;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.uniforms = {
            uTime: null,
            uRatio: null,
            uPointerPosition: null,
            uScrollProgress: null,
            uThemeBlend: null
        };

        this.init();
    }

    init() {
        this.createCanvas();
        if (!this.initWebGL()) return;
        this.bindEvents();
        this.animate();
    }

    // ---- Canvas Creation ----

    createCanvas() {
        this.canvas = document.getElementById('neural-vortex');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'neural-vortex';
            document.body.prepend(this.canvas);
        }
    }

    // ---- WebGL Setup ----

    initWebGL() {
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        if (!this.gl) {
            console.warn('NeuralVortex: WebGL not supported');
            return false;
        }

        const gl = this.gl;

        // --- Vertex Shader ---
        const vsSource = `
            precision mediump float;
            attribute vec2 a_position;
            varying vec2 vUv;
            void main() {
                vUv = .5 * (a_position + 1.);
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

        // --- Fragment Shader ---
        // Colors retuned to PlayStation blue (#00439C) / cyan (#00D9FF) palette
        const isMobile = window.innerWidth < 768;
        const loopCount = isMobile ? 10 : 15;

        const fsSource = `
            precision mediump float;
            varying vec2 vUv;
            uniform float u_time;
            uniform float u_ratio;
            uniform vec2 u_pointer_position;
            uniform float u_scroll_progress;
            uniform float u_theme_blend;

            vec2 rotate(vec2 uv, float th) {
                return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
            }

            float neuro_shape(vec2 uv, float t, float p) {
                vec2 sine_acc = vec2(0.);
                vec2 res = vec2(0.);
                float scale = 8.;
                for (int j = 0; j < ${loopCount}; j++) {
                    uv = rotate(uv, 1.);
                    sine_acc = rotate(sine_acc, 1.);
                    vec2 layer = uv * scale + float(j) + sine_acc - t;
                    sine_acc += sin(layer) + 2.4 * p;
                    res += (.5 + .5 * cos(layer)) / scale;
                    scale *= (1.2);
                }
                return res.x + res.y;
            }

            void main() {
                vec2 uv = .5 * vUv;
                uv.x *= u_ratio;

                vec2 pointer = vUv - u_pointer_position;
                pointer.x *= u_ratio;
                float p = clamp(length(pointer), 0., 1.);
                p = .5 * pow(1. - p, 2.);

                float t = .001 * u_time;

                float noise = neuro_shape(uv, t, p);
                noise = 1.2 * pow(noise, 3.);
                noise += pow(noise, 10.);
                noise = max(.0, noise - .5);
                noise *= (1. - length(vUv - .5));

                // PlayStation blue base: #00439C → vec3(0.0, 0.263, 0.612)
                vec3 darkColor = vec3(0.0, 0.263, 0.612);

                // Mix toward cyan accent: #00D9FF → vec3(0.0, 0.851, 1.0)
                darkColor = mix(darkColor, vec3(0.0, 0.851, 1.0), 0.32 + 0.16 * sin(2.0 * u_scroll_progress + 1.2));

                // Subtle dark-blue undertone shift on scroll
                darkColor += vec3(0.0, 0.1, 0.4) * sin(2.0 * u_scroll_progress + 1.5);

                // Light mode: deeper indigo/blue that contrasts against white
                vec3 lightColor = vec3(0.0, 0.18, 0.55);
                lightColor = mix(lightColor, vec3(0.0, 0.45, 0.75), 0.3 + 0.15 * sin(2.0 * u_scroll_progress + 1.2));
                lightColor += vec3(0.05, 0.0, 0.35) * sin(2.0 * u_scroll_progress + 1.5);

                vec3 color = mix(darkColor, lightColor, u_theme_blend);

                color = color * noise;

                float alpha = noise;

                gl_FragColor = vec4(color, alpha);
            }
        `;

        // --- Shader Compilation ---
        this.vertexShader = this.compileShader(gl, vsSource, gl.VERTEX_SHADER);
        this.fragmentShader = this.compileShader(gl, fsSource, gl.FRAGMENT_SHADER);
        if (!this.vertexShader || !this.fragmentShader) return false;

        // --- Program ---
        this.program = gl.createProgram();
        gl.attachShader(this.program, this.vertexShader);
        gl.attachShader(this.program, this.fragmentShader);
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error('NeuralVortex: Program link error:', gl.getProgramInfoLog(this.program));
            return false;
        }

        gl.useProgram(this.program);

        // --- Geometry (full-screen quad) ---
        const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(this.program, 'a_position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // --- Uniforms ---
        this.uniforms.uTime = gl.getUniformLocation(this.program, 'u_time');
        this.uniforms.uRatio = gl.getUniformLocation(this.program, 'u_ratio');
        this.uniforms.uPointerPosition = gl.getUniformLocation(this.program, 'u_pointer_position');
        this.uniforms.uScrollProgress = gl.getUniformLocation(this.program, 'u_scroll_progress');
        this.uniforms.uThemeBlend = gl.getUniformLocation(this.program, 'u_theme_blend');

        // --- Enable alpha blending ---
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // --- Initial resize ---
        this.resizeCanvas();

        return true;
    }

    compileShader(gl, source, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('NeuralVortex: Shader error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    // ---- Resize ----

    resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio, 1.5);
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.uniform1f(this.uniforms.uRatio, this.canvas.width / this.canvas.height);
    }

    // ---- Event Binding ----

    bindEvents() {
        // Resize
        this._onResize = () => this.resizeCanvas();
        window.addEventListener('resize', this._onResize);

        // Pointer
        this._onPointerMove = (e) => {
            this.pointer.tX = e.clientX;
            this.pointer.tY = e.clientY;
        };
        window.addEventListener('pointermove', this._onPointerMove);

        // Touch
        this._onTouchMove = (e) => {
            if (e.touches[0]) {
                this.pointer.tX = e.touches[0].clientX;
                this.pointer.tY = e.touches[0].clientY;
            }
        };
        window.addEventListener('touchmove', this._onTouchMove, { passive: true });

        // Visibility – pause when tab is hidden
        this._onVisibility = () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        };
        document.addEventListener('visibilitychange', this._onVisibility);

        // Theme changes via MutationObserver
        this._themeObserver = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.attributeName === 'data-theme') {
                    this.updateTheme();
                }
            }
        });
        this._themeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });

        // Reduced motion preference change
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        motionQuery.addEventListener('change', (e) => {
            this.reducedMotion = e.matches;
            if (this.reducedMotion) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }

    // ---- Theme ----

    updateTheme() {
        const theme = document.body.getAttribute('data-theme');
        const isLight = theme === 'light';
        this.canvas.style.opacity = isLight ? '0.45' : '0.55';
    }

    // ---- Animation ----

    animate() {
        if (!this.isRunning) return;

        const gl = this.gl;
        const now = performance.now();

        // Smooth pointer lerp
        this.pointer.x += (this.pointer.tX - this.pointer.x) * 0.2;
        this.pointer.y += (this.pointer.tY - this.pointer.y) * 0.2;

        // Set uniforms
        gl.uniform1f(this.uniforms.uTime, now);
        gl.uniform2f(
            this.uniforms.uPointerPosition,
            this.pointer.x / window.innerWidth,
            1 - this.pointer.y / window.innerHeight
        );

        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        gl.uniform1f(this.uniforms.uScrollProgress, window.pageYOffset / maxScroll);

        const theme = document.body.getAttribute('data-theme');
        gl.uniform1f(this.uniforms.uThemeBlend, theme === 'light' ? 1.0 : 0.0);

        // Clear & draw
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        // Reduced motion: render one frame then stop
        if (this.reducedMotion) {
            this.isRunning = false;
            return;
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    pause() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resume() {
        if (this.isRunning || this.reducedMotion) return;
        this.isRunning = true;
        this.animate();
    }

    // ---- Cleanup ----

    destroy() {
        this.pause();
        window.removeEventListener('resize', this._onResize);
        window.removeEventListener('pointermove', this._onPointerMove);
        window.removeEventListener('touchmove', this._onTouchMove);
        document.removeEventListener('visibilitychange', this._onVisibility);
        if (this._themeObserver) this._themeObserver.disconnect();

        const gl = this.gl;
        if (gl) {
            gl.deleteProgram(this.program);
            gl.deleteShader(this.vertexShader);
            gl.deleteShader(this.fragmentShader);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new NeuralVortex();
});
