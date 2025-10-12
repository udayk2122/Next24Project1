document.addEventListener('DOMContentLoaded', () => {
    console.log("Portfolio script loaded."); // You should see this message.

    const isMobile = window.innerWidth <= 768;
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenuBtn = document.getElementById('close-menu-btn'); // Find the close button
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const body = document.body;
    
    // Check if the button was actually found
    if (closeMenuBtn) {
        console.log("Success: Close button was found in the HTML.", closeMenuBtn);
    } else {
        console.error("ERROR: Close button with id 'close-menu-btn' was NOT FOUND. Check your index.html file.");
        return; // Stop the script if the button doesn't exist
    }

    const openMenu = () => {
        navMenu.classList.add('is-active');
        body.classList.add('menu-open');
    };

    const closeMenu = () => {
        navMenu.classList.remove('is-active');
        body.classList.remove('menu-open');
    };

    // Event Listeners
    menuToggle.addEventListener('click', openMenu);
    
    closeMenuBtn.addEventListener('click', () => {
        console.log("Close button was clicked!"); // This message should appear on click
        closeMenu();
    });

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // The rest of your script...
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.5 };
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    const linkHref = link.getAttribute('href');
                    if (linkHref && linkHref.includes(id)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.content-section, .hero');
    sections.forEach(section => sectionObserver.observe(section));

    const headingElements = document.querySelectorAll('.content-section');
    const headingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
    }, { threshold: 0.1 });
    headingElements.forEach(el => headingObserver.observe(el));

    const modal = document.getElementById('resume-modal');
    if (modal) {
        const viewResumeBtn = document.getElementById('view-resume-btn');
        const closeBtn = modal.querySelector('.close-btn');
        if (viewResumeBtn) viewResumeBtn.onclick = () => modal.style.display = "block";
        if (closeBtn) closeBtn.onclick = () => modal.style.display = "none";
        window.onclick = (event) => {
            if (event.target == modal) modal.style.display = "none";
        };
    }

    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = isMobile ? 35 : 70;
        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.color = `rgba(100, 255, 218, ${Math.random() * 0.5 + 0.2})`;
            }
            update() {
                this.x += this.speedX; this.y += this.speedY;
                if (this.size > 0.1) this.size -= 0.02;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.fillStyle = this.color; ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
            }
        }
        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) particles.push(new Particle());
        };
        const connectParticles = () => {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = Math.hypot(particles[a].x - particles[b].x, particles[a].y - particles[b].y);
                    if (distance < 120) {
                        let opacityValue = 1 - (distance / 120);
                        ctx.strokeStyle = `rgba(100, 255, 218, ${opacityValue * 0.5})`;
                        ctx.lineWidth = 1; ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y); ctx.stroke();
                    }
                }
            }
        };
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            if (!isMobile) connectParticles();
            requestAnimationFrame(animate);
        };
        setCanvasSize(); initParticles(); animate();
        window.addEventListener('resize', () => { setCanvasSize(); initParticles(); });
    }
});