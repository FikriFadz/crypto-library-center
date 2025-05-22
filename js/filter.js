// Sample structure of a library item
let libraries = [];

const searchInput = document.getElementById('search-input');
const filterCheckboxes = document.querySelectorAll('.pqc-filter');
const libraryCardsContainer = document.getElementById('library-cards');

// Event listeners
searchInput.addEventListener('input', applyFilters);
filterCheckboxes.forEach(checkbox => checkbox.addEventListener('change', applyFilters));

export function setLibraries(data) {
    libraries = data;
    applyFilters();
}

function applyFilters() {
    const query = searchInput.value.toLowerCase();
    const selectedFilters = Array.from(filterCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    const filtered = libraries.filter(lib => {
        const matchesQuery = lib.name.toLowerCase().includes(query) ||
                             lib.description.toLowerCase().includes(query);

        const matchesFilter = selectedFilters.length === 0 ||
            selectedFilters.some(filter => lib.pqcAlgorithms.includes(filter));

        return matchesQuery && matchesFilter;
    });

    renderLibraries(filtered);
}

function renderLibraries(libs) {
    libraryCardsContainer.innerHTML = libs.map(lib => `
        <div class="library-card">
            <h3>${lib.name}</h3>
            <p>${lib.description}</p>
            <p><strong>Algorithms:</strong> ${lib.pqcAlgorithms.join(', ')}</p>
        </div>
    `).join('');
}