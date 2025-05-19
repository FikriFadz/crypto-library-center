document.addEventListener('DOMContentLoaded', function () {
    animateHero();
    highlightActiveNavLink();
    animateTitle();
    if (document.querySelector('.libraries-page')) {
        setupLevelFiltering();
        setupSearch();
        setupFilters(); // 🔥 New line here
        try {
            setupCryptoAnimation();
        } catch (e) {
            console.error("Animation failed:", e);
        }
    } else {
        try {
            setupCryptoAnimation();
        } catch (e) {
            console.error("Animation failed:", e);
        }
    }

    // 1. Hero Animation - Modified version
    function animateHero() {
        const hero = document.querySelector('.hero, .hero-content'); // Targets both hero classes
        if (!hero) return;

        // Initial state
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(30px)';
        hero.style.transition = 'none';

        // Animate after short delay
        setTimeout(() => {
            hero.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';

            // Animate children separately if they exist
            const title = hero.querySelector('h1');
            const tagline = hero.querySelector('.tagline');
            const button = hero.querySelector('.cta-button');

            if (title) {
                title.style.opacity = '0';
                title.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    title.style.transition = 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s';
                    title.style.opacity = '1';
                    title.style.transform = 'translateY(0)';
                }, 100);
            }

            if (tagline) {
                tagline.style.opacity = '0';
                tagline.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    tagline.style.transition = 'opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s';
                    tagline.style.opacity = '1';
                    tagline.style.transform = 'translateY(0)';
                }, 100);
            }

            if (button) {
                button.style.opacity = '0';
                button.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    button.style.transition = 'opacity 0.6s ease 0.6s, transform 0.6s ease 0.6s';
                    button.style.opacity = '1';
                    button.style.transform = 'translateY(0)';
                }, 100);
            }
        }, 100);
    }

    // 2. Highlight Active Navigation Link - Modified version
    function highlightActiveNavLink() {
        const navLinks = document.querySelectorAll('.nav-links a');
        const currentPath = window.location.pathname;

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            // Remove '../' or './' from paths for comparison
            const cleanLinkPath = linkPath.replace(/^\.\.?\//, '');
            const cleanCurrentPath = currentPath.replace(/^\.\.?\//, '');

            if (cleanCurrentPath.includes(cleanLinkPath)) {
                link.classList.add('active');
            }
        });
    }

    // 3. Typing Animation for Title
    function animateTitle() {
        const title = document.getElementById('animated-title');
        const text = title.querySelector('.animated-text');
        const originalText = text.textContent;
        text.textContent = '';

        let i = 0;
        const typingEffect = setInterval(() => {
            if (i < originalText.length) {
                text.textContent += originalText.charAt(i);
                i++;
            } else {
                clearInterval(typingEffect);
            }
        }, 50);
    }

    // 4. Knowledge Level Filtering
    function setupLevelFiltering() {
        const levelButtons = document.querySelectorAll('.level-btn');
        const featureCards = document.querySelectorAll('.feature-card');

        levelButtons.forEach(button => {
            button.addEventListener('click', () => {
                levelButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const level = button.dataset.level;

                featureCards.forEach(card => {
                    if (level === 'all' || card.dataset.level === level) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 5. Search Functionality
    function setupSearch() {
        const searchInput = document.getElementById('search-input');
        const featureCards = document.querySelectorAll('.feature-card');

        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();

            featureCards.forEach(card => {
                const cardText = card.textContent.toLowerCase();
                if (cardText.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // 7. Filter Functionality
    function setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const featureCards = document.querySelectorAll('.feature-card');
        const clearFiltersBtn = document.querySelector('.clear-filters');

        // Helper function to get active filters
        function getActiveFilters() {
            const filters = {
                algorithms: [],
                types: [],
                languages: []
            };

            filterButtons.forEach(btn => {
                if (btn.classList.contains('active')) {
                    const category = btn.dataset.filter;
                    if (['kyber', 'dilithium', 'sphincs'].includes(category)) {
                        filters.algorithms.push(category);
                    } else if (['pqc', 'classic', 'hybrid'].includes(category)) {
                        filters.types.push(category);
                    } else {
                        filters.languages.push(category);
                    }
                }
            });

            return filters;
        }

        // Filter cards based on active filters
        function applyFilters() {
            const filters = getActiveFilters();

            featureCards.forEach(card => {
                const cardAlgorithms = [];
                if (card.dataset.kyber === 'true') cardAlgorithms.push('kyber');
                if (card.dataset.dilithium === 'true') cardAlgorithms.push('dilithium');
                if (card.dataset.sphincs === 'true') cardAlgorithms.push('sphincs');

                const cardType = card.dataset.type;
                const cardLanguage = card.dataset.language.toLowerCase();

                const matchAlgorithm = filters.algorithms.length === 0 || filters.algorithms.some(algo => cardAlgorithms.includes(algo));
                const matchType = filters.types.length === 0 || filters.types.includes(cardType);
                const matchLanguage = filters.languages.length === 0 || filters.languages.includes(cardLanguage);

                if (matchAlgorithm && matchType && matchLanguage) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        // Toggle active class on filter buttons
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('active')) {
                    btn.classList.remove('active');
                } else {
                    // Optional: allow multiple selections in different categories
                    const currentCategory = btn.dataset.filter;

                    filterButtons.forEach(b => {
                        const category = b.dataset.filter;
                        if (
                            ['kyber', 'dilithium', 'sphincs'].includes(currentCategory) &&
                            ['kyber', 'dilithium', 'sphincs'].includes(category)
                        ) {
                            b.classList.remove('active');
                        } else if (
                            ['pqc', 'classic', 'hybrid'].includes(currentCategory) &&
                            ['pqc', 'classic', 'hybrid'].includes(category)
                        ) {
                            b.classList.remove('active');
                        } else if (
                            !['kyber', 'dilithium', 'sphincs', 'pqc', 'classic', 'hybrid'].includes(currentCategory) &&
                            !['kyber', 'dilithium', 'sphincs', 'pqc', 'classic', 'hybrid'].includes(category)
                        ) {
                            b.classList.remove('active');
                        }
                    });

                    btn.classList.add('active');
                }

                applyFilters();
            });
        });

        // Clear all filters
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                featureCards.forEach(card => card.style.display = 'block');
            });
        }

        // Toggle filter panel visibility
        const filterToggleBtn = document.querySelector('.filter-toggle-btn');
        const filterPanel = document.getElementById('filterPanel');

        if (filterToggleBtn && filterPanel) {
            filterToggleBtn.addEventListener('click', () => {
                filterPanel.classList.toggle('open');
            });
        }
    }

    // 6. Cryptographic Animation
    function setupCryptoAnimation() {
        const container = document.getElementById('cryptoCanvas');
        const canvas = document.createElement('canvas');
        container.innerHTML = ''; // Clear existing content
        container.appendChild(canvas);;

        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;

        const ctx = canvas.getContext('2d');

        // Resize canvas when window resizes
        window.addEventListener('resize', () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        });

        // Create particles for animation
        const particles = [];
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                color: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 255, ${Math.random() * 0.5 + 0.3})`
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connecting lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.strokeStyle = `rgba(200, 200, 255, ${1 - distance / 100})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw and update particles
            particles.forEach(particle => {
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();

                particle.x += particle.speedX;
                particle.y += particle.speedY;

                // Bounce off edges
                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    // Call all functions
    animateHero();
    highlightActiveNavLink();
    animateTitle();
    if (document.querySelector('.libraries-page')) {
        setupLevelFiltering();
        setupSearch();
        try {
            setupCryptoAnimation();
        } catch (e) {
            console.error("Animation failed:", e);
        }
    } else {
        try {
            setupCryptoAnimation();
        } catch (e) {
            console.error("Animation failed:", e);
        }
    }
});