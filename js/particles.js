// Interactive WebGL Constellation Background
(function() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!ctx) {
        console.warn('WebGL not supported, falling back to 2D canvas');
        return;
    }

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Vertex shader for stars
    const vertexShaderSource = `
        attribute vec2 a_position;
        attribute vec2 a_velocity;
        attribute float a_size;
        attribute float a_brightness;
        
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        
        varying float v_brightness;
        
        void main() {
            vec2 position = a_position + a_velocity * u_time;
            
            // Wrap around screen
            position = mod(position + u_resolution * 0.5, u_resolution) - u_resolution * 0.5;
            
            // Mouse interaction - stars are attracted to mouse
            vec2 toMouse = u_mouse - position;
            float mouseDistance = length(toMouse);
            if (mouseDistance < 200.0) {
                float attraction = (200.0 - mouseDistance) / 200.0;
                position += toMouse * attraction * 0.1;
            }
            
            // Convert to clip space
            vec2 clipSpace = position / u_resolution * 2.0;
            
            gl_Position = vec4(clipSpace, 0.0, 1.0);
            gl_PointSize = a_size * (1.0 + sin(u_time * 2.0) * 0.2);
            v_brightness = a_brightness;
        }
    `;

    // Fragment shader for stars with enhanced glow
    const fragmentShaderSource = `
        precision mediump float;
        
        varying float v_brightness;
        
        void main() {
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            
            // Create star shape with soft edges
            if (dist > 0.5) discard;
            
            // Enhanced star glow effect
            float star = 1.0 - smoothstep(0.0, 0.5, dist);
            star = pow(star, 1.5); // Softer glow
            
            // Enhanced twinkling effect
            float twinkle = 0.7 + 0.3 * sin(gl_PointCoord.x * 15.0 + gl_PointCoord.y * 15.0);
            
            // Add color variation for some stars
            vec3 baseColor = vec3(0.9, 0.95, 1.0);
            vec3 warmColor = vec3(1.0, 0.9, 0.7);
            vec3 coolColor = vec3(0.7, 0.9, 1.0);
            
            // Mix colors based on position for variety
            vec3 starColor = mix(baseColor, mix(warmColor, coolColor, sin(gl_PointCoord.x * 20.0)), 0.3);
            
            // Enhanced brightness and glow
            float finalBrightness = v_brightness * star * twinkle;
            vec3 finalColor = starColor * finalBrightness;
            
            // Add outer glow
            float outerGlow = 1.0 - smoothstep(0.3, 0.5, dist);
            outerGlow = pow(outerGlow, 3.0) * 0.5;
            
            gl_FragColor = vec4(finalColor + vec3(outerGlow), star * v_brightness * 0.9);
        }
    `;

    // Compile shader
    function compileShader(source, type) {
        const shader = ctx.createShader(type);
        ctx.shaderSource(shader, source);
        ctx.compileShader(shader);
        
        if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
            console.error('Shader compilation error:', ctx.getShaderInfoLog(shader));
            ctx.deleteShader(shader);
            return null;
        }
        return shader;
    }

    // Create program
    const vertexShader = compileShader(vertexShaderSource, ctx.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, ctx.FRAGMENT_SHADER);
    
    if (!vertexShader || !fragmentShader) return;

    const program = ctx.createProgram();
    ctx.attachShader(program, vertexShader);
    ctx.attachShader(program, fragmentShader);
    ctx.linkProgram(program);

    if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
        console.error('Program linking error:', ctx.getProgramInfoLog(program));
        return;
    }

    // Get attribute and uniform locations
    const positionLocation = ctx.getAttribLocation(program, 'a_position');
    const velocityLocation = ctx.getAttribLocation(program, 'a_velocity');
    const sizeLocation = ctx.getAttribLocation(program, 'a_size');
    const brightnessLocation = ctx.getAttribLocation(program, 'a_brightness');
    const timeLocation = ctx.getUniformLocation(program, 'u_time');
    const resolutionLocation = ctx.getUniformLocation(program, 'u_resolution');
    const mouseLocation = ctx.getUniformLocation(program, 'u_mouse');

    // Create star data - Enhanced for better visual effects
    const starCount = 200; // Increased star count
    const positions = new Float32Array(starCount * 2);
    const velocities = new Float32Array(starCount * 2);
    const sizes = new Float32Array(starCount);
    const brightness = new Float32Array(starCount);

    // Initialize stars with enhanced variety
    for (let i = 0; i < starCount; i++) {
        positions[i * 2] = (Math.random() - 0.5) * canvas.width * 2;
        positions[i * 2 + 1] = (Math.random() - 0.5) * canvas.height * 2;
        
        // Enhanced velocity with different speed ranges
        const speed = Math.random() * 15 + 5;
        const angle = Math.random() * Math.PI * 2;
        velocities[i * 2] = Math.cos(angle) * speed;
        velocities[i * 2 + 1] = Math.sin(angle) * speed;
        
        // Enhanced size variation
        sizes[i] = Math.random() * 4 + 0.5;
        
        // Enhanced brightness with more variation
        brightness[i] = Math.random() * 0.7 + 0.3;
    }

    // Create buffers
    const positionBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, positionBuffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, positions, ctx.DYNAMIC_DRAW);

    const velocityBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, velocityBuffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, velocities, ctx.STATIC_DRAW);

    const sizeBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, sizeBuffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, sizes, ctx.STATIC_DRAW);

    const brightnessBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, brightnessBuffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, brightness, ctx.STATIC_DRAW);

    // Enable blending
    ctx.enable(ctx.BLEND);
    ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);

    // Mouse tracking
    let mouseX = 0, mouseY = 0;
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) * window.devicePixelRatio - canvas.width * 0.5;
        mouseY = (e.clientY - rect.top) * window.devicePixelRatio - canvas.height * 0.5;
    }, { passive: true });

    // Animation loop
    let startTime = Date.now();
    function animate() {
        const currentTime = (Date.now() - startTime) * 0.001;
        
        // Clear canvas
        ctx.clearColor(0, 0, 0, 0);
        ctx.clear(ctx.COLOR_BUFFER_BIT);

        // Use program
        ctx.useProgram(program);

        // Set uniforms
        ctx.uniform1f(timeLocation, currentTime);
        ctx.uniform2f(resolutionLocation, canvas.width, canvas.height);
        ctx.uniform2f(mouseLocation, mouseX, mouseY);

        // Set up attributes
        ctx.bindBuffer(ctx.ARRAY_BUFFER, positionBuffer);
        ctx.enableVertexAttribArray(positionLocation);
        ctx.vertexAttribPointer(positionLocation, 2, ctx.FLOAT, false, 0, 0);

        ctx.bindBuffer(ctx.ARRAY_BUFFER, velocityBuffer);
        ctx.enableVertexAttribArray(velocityLocation);
        ctx.vertexAttribPointer(velocityLocation, 2, ctx.FLOAT, false, 0, 0);

        ctx.bindBuffer(ctx.ARRAY_BUFFER, sizeBuffer);
        ctx.enableVertexAttribArray(sizeLocation);
        ctx.vertexAttribPointer(sizeLocation, 1, ctx.FLOAT, false, 0, 0);

        ctx.bindBuffer(ctx.ARRAY_BUFFER, brightnessBuffer);
        ctx.enableVertexAttribArray(brightnessLocation);
        ctx.vertexAttribPointer(brightnessLocation, 1, ctx.FLOAT, false, 0, 0);

        // Draw stars
        ctx.drawArrays(ctx.POINTS, 0, starCount);

        requestAnimationFrame(animate);
    }

    // Start animation
    animate();

})();
