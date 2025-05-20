// ==========================
// DOMContentLoaded Handler
// ==========================
document.addEventListener('DOMContentLoaded', function () {
    // Run animations and UI setup
    animateHero();
    highlightActiveNavLink();
    animateTitle();

    // Only apply library page-specific logic if it exists
    if (document.querySelector('.libraries-page')) {
        setupLevelFiltering();
        setupSearch();
        setupFilters(); // 🔥 Filters now enabled
    }

    try {
        setupCryptoAnimation();
    } catch (e) {
        console.error("Animation failed:", e);
    }
});

// ==========================
// 1. Hero Section Animation
// ==========================
function animateHero() {
    const hero = document.querySelector('.hero, .hero-content');
    if (!hero) return;

    hero.style.opacity = '0';
    hero.style.transform = 'translateY(30px)';
    hero.style.transition = 'none';

    setTimeout(() => {
        hero.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';

        animateElement(hero.querySelector('h1'), 0.2);
        animateElement(hero.querySelector('.tagline'), 0.4);
        animateElement(hero.querySelector('.cta-button'), 0.6);
    }, 100);
}

function animateElement(element, delay) {
    if (!element) return;
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    setTimeout(() => {
        element.style.transition = `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`;
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, 100);
}

// ==========================
// 2. Highlight Active Nav
// ==========================
function highlightActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentPath = window.location.pathname.replace(/^\.\.?\//, '');

    navLinks.forEach(link => {
        const cleanLinkPath = link.getAttribute('href').replace(/^\.\.?\//, '');
        if (currentPath.includes(cleanLinkPath)) {
            link.classList.add('active');
        }
    });
}

// ==========================
// 3. Typing Animation Title
// ==========================
function animateTitle() {
    const title = document.getElementById('animated-title');
    const text = title?.querySelector('.animated-text');
    if (!text) return;

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

// ==========================
// 4. Filter by Knowledge Level
// ==========================
function setupLevelFiltering() {
    const levelButtons = document.querySelectorAll('.level-btn');
    const featureCards = document.querySelectorAll('.feature-card');

    levelButtons.forEach(button => {
        button.addEventListener('click', () => {
            levelButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const level = button.dataset.level;

            featureCards.forEach(card => {
                card.style.display = (level === 'all' || card.dataset.level === level) ? 'block' : 'none';
            });
        });
    });
}

// ==========================
// 5. Search Functionality
// ==========================
export function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const featureCards = document.querySelectorAll('.feature-card');

    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();

        featureCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            card.style.display = cardText.includes(searchTerm) ? 'block' : 'none';
        });
    });
}


// ==========================
// 6. Advanced Filtering (Algo/Type/Lang)
// ==========================
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const featureCards = document.querySelectorAll('.feature-card');
    const clearFiltersBtn = document.querySelector('.clear-filters');

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

            card.style.display = (matchAlgorithm && matchType && matchLanguage) ? 'block' : 'none';
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.filter;

            // Toggle active filter buttons by category
            filterButtons.forEach(b => {
                const sameCategory = (
                    (['kyber', 'dilithium', 'sphincs'].includes(category) && ['kyber', 'dilithium', 'sphincs'].includes(b.dataset.filter)) ||
                    (['pqc', 'classic', 'hybrid'].includes(category) && ['pqc', 'classic', 'hybrid'].includes(b.dataset.filter)) ||
                    (!['kyber', 'dilithium', 'sphincs', 'pqc', 'classic', 'hybrid'].includes(category) &&
                        !['kyber', 'dilithium', 'sphincs', 'pqc', 'classic', 'hybrid'].includes(b.dataset.filter))
                );
                if (sameCategory) b.classList.remove('active');
            });

            btn.classList.toggle('active');
            applyFilters();
        });
    });

    clearFiltersBtn?.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        featureCards.forEach(card => card.style.display = 'block');
    });

    const filterToggleBtn = document.querySelector('.filter-toggle-btn');
    const filterPanel = document.getElementById('filterPanel');

    filterToggleBtn?.addEventListener('click', () => {
        filterPanel?.classList.toggle('open');
    });
}

// ==========================
// 7. Background Crypto Canvas Animation
// ==========================
function setupCryptoAnimation() {
    const container = document.getElementById('cryptoCanvas');
    if (!container) return;

    const canvas = document.createElement('canvas');
    container.innerHTML = '';
    container.appendChild(canvas);

    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;

    const ctx = canvas.getContext('2d');
    const particleCount = 50;
    const particles = [];

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

        particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    });

    animate();
}
