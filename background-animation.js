document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('backgroundCanvas');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Unable to get 2D context');
        return;
    }

    let width, height;

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    resizeCanvas();

    let mouse = {
        x: undefined,
        y: undefined,
        radius: 100
    };

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.z = Math.random() * 200;
            this.size = this.mapSize();
            this.speedX = (Math.random() - 0.5) * 2;
            this.speedY = (Math.random() - 0.5) * 2;
            this.speedZ = Math.random() * 1 - 0.5;
        }

        mapSize() {
            return this.z / 200 * 2 + 0.5;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.z += this.speedZ;

            if (this.x > width || this.x < 0) this.speedX *= -1;
            if (this.y > height || this.y < 0) this.speedY *= -1;
            if (this.z > 200 || this.z < 0) this.speedZ *= -1;

            if (mouse.x !== undefined && mouse.y !== undefined) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x -= Math.cos(angle) * force * 2;
                    this.y -= Math.sin(angle) * force * 2;
                }
            }

            this.size = this.mapSize();
        }

        draw() {
            const opacity = this.z / 200 * 0.8 + 0.2;
            ctx.fillStyle = `rgba(0, 100, 255, ${opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const particlesArray = [];
    let particleCount;

    function calculateParticleCount() {
        const area = width * height;
        const baseCount = 200;
        const scaleFactor = Math.min(1, area / (1920 * 1080));
        return Math.floor(baseCount * scaleFactor);
    }

    function init() {
        particlesArray.length = 0;
        particleCount = calculateParticleCount();
        for (let i = 0; i < particleCount; i++) {
            particlesArray.push(new Particle());
        }
    }

    function connectParticles() {
        const maxDistance = 150;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const dz = particlesArray[a].z - particlesArray[b].z;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.5;
                    ctx.strokeStyle = `rgba(0, 150, 255, ${opacity})`;
                    ctx.lineWidth = (200 - (particlesArray[a].z + particlesArray[b].z) / 2) / 100;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function drawGrid() {
        ctx.strokeStyle = 'rgba(0, 100, 255, 0.1)';
        ctx.lineWidth = 0.5;
        const gridSize = Math.max(50, Math.floor(Math.min(width, height) / 20));

        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgb(0, 10, 30)';
        ctx.fillRect(0, 0, width, height);

        drawGrid();

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        connectParticles();

        requestAnimationFrame(animate);
    }

    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            resizeCanvas();
            init();
        }, 250);
    });

    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('touchmove', function(event) {
        if (event.touches.length > 0) {
            mouse.x = event.touches[0].clientX;
            mouse.y = event.touches[0].clientY;
        }
    });

    window.addEventListener('mouseout', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    window.addEventListener('touchend', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    init();
    animate();
});