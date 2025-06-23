let libraries = [];
const libraryCardsContainer = document.getElementById('library-cards');

export function setLibraries(data) {
    libraries = data;
    applyFilters(); // Initial render
}

function applyFilters() {
    const searchInput = document.getElementById('search-input');
    const filterCheckboxes = document.querySelectorAll('.pqc-filter');
    
    const query = searchInput ? searchInput.value.toLowerCase() : '';
    const selectedFilters = Array.from(filterCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value.toLowerCase());

    const filtered = libraries.filter(lib => {
        const nameMatch = lib.normalizedName?.includes(query) || 
                         lib.name.toLowerCase().includes(query);
        
        const algoMatch = selectedFilters.length === 0 ||
            selectedFilters.some(filter => 
                lib.pqcAlgorithms?.some(alg => 
                    alg.toLowerCase().includes(filter)
                )
            );

        return nameMatch && algoMatch;
    });

    renderLibraries(filtered);
}

function renderLibraries(libs) {
    if (!libraryCardsContainer) return;
    
    libraryCardsContainer.innerHTML = libs.map(lib => `
        <div class="feature-card" 
             data-kyber="${lib.pqcAlgorithms?.includes('Kyber') || false}"
             data-dilithium="${lib.pqcAlgorithms?.includes('Dilithium') || false}"
             data-sphincs="${lib.pqcAlgorithms?.includes('SPHINCS+') || false}"
             data-falcon="${lib.pqcAlgorithms?.includes('Falcon') || false}"
             data-type="${lib.pqcAlgorithms?.length ? 'pqc' : 'classic'}"
             data-language="${lib.language || ''}"
             data-name="${lib.normalizedName || lib.name.toLowerCase()}">
            
            <h3>${lib.name}</h3>
            <div class="library-details">
                <p><strong>Developer:</strong> ${lib.developer || 'N/A'}</p>
                <p><strong>Languages:</strong> ${lib.language || 'N/A'}</p>
                <p><strong>Latest Version:</strong> ${lib['latest-version'] || 'N/A'} (${lib['latest-release'] || 'N/A'})</p>
                <p><strong>License:</strong> ${lib.license || 'N/A'}</p>
                <p><strong>Open Source:</strong> ${lib['open-source'] ? 'Yes' : 'No'}</p>
            </div>
            ${lib.pqcAlgorithms?.length ? `
                <div class="algorithm-badges">
                    ${lib.pqcAlgorithms.map(alg => 
                        `<span class="algorithm-badge">${alg}</span>`
                    ).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');

    // Add click event to cards
    document.querySelectorAll('.feature-card').forEach(card => {
        const libId = libraries.find(lib => 
            lib.name === card.querySelector('h3').textContent
        )?.id;
        
        if (libId) {
            card.addEventListener('click', () => {
                window.location.href = `details.html?id=${libId}`;
            });
        }
    });
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const filterCheckboxes = document.querySelectorAll('.pqc-filter');

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    filterCheckboxes.forEach(checkbox => checkbox.addEventListener('change', applyFilters));
});