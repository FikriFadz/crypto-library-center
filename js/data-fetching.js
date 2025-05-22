import { getFirestore, collection, getDocs, enableIndexedDbPersistence } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import firebaseConfig from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { setupSearch } from './main.js'; // <-- this line is added
import { setLibraries } from './filter.js';
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let librariesData = []; // Store raw library data
const container = document.querySelector('.features');

// Enable offline caching
enableIndexedDbPersistence(db).catch(err => console.warn(err));

// Fetch and render all libraries
export async function fetchAndDisplayLibraries() {
  if (!container) return;

  try {
    const snapshot = await getDocs(collection(db, 'libraries'));
    librariesData = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      data.id = doc.id;

      // Normalize for filtering
      data.normalizedName = data.name.toLowerCase();
      const rawAlgos = data['pqc-algorithm'];
      data.normalizedAlgorithms = Array.isArray(rawAlgos)
        ? rawAlgos.map(a => a.toLowerCase())
        : typeof rawAlgos === 'string'
          ? [rawAlgos.toLowerCase()]
          : [];


      librariesData.push(data);
    });

    applyFilters(); // Initial render with full data
    setupSearchAndFilterEvents();

  } catch (err) {
    console.error('Error loading libraries:', err);
  }
}

// Re-render libraries based on current search/filter
function applyFilters() {
  const searchQuery = document.getElementById('search-input').value.toLowerCase();
  const selectedAlgorithms = Array.from(document.querySelectorAll('.pqc-filter:checked')).map(cb => cb.value.toLowerCase());

  const filtered = librariesData.filter(lib => {
    const matchesSearch = lib.normalizedName.includes(searchQuery);
    const matchesFilter = selectedAlgorithms.length === 0 ||
      selectedAlgorithms.some(alg => lib.normalizedAlgorithms.includes(alg));

    return matchesSearch && matchesFilter;
  });

  renderLibraryCards(filtered);
}

// Render DOM elements for filtered libraries
function renderLibraryCards(dataArray) {
  container.innerHTML = '';

  dataArray.forEach(data => {
    const card = document.createElement('div');
    card.className = 'feature-card';

    card.dataset.kyber = data['pqc-algorithm']?.includes('Kyber') || false;
    card.dataset.dilithium = data['pqc-algorithm']?.includes('Dilithium') || false;
    card.dataset.sphincs = data['pqc-algorithm']?.includes('SPHINCS+') || false;
    card.dataset.falcon = data['pqc-algorithm']?.includes('Falcon') || false;
    card.dataset.type = data['pqc-algorithm'] ? 'pqc' : 'classic';
    card.dataset.language = data.language || '';
    card.dataset.name = data.normalizedName;

    const title = document.createElement('h3');
    title.textContent = data.name;

    const desc = document.createElement('div');
    desc.className = 'library-details';
    desc.innerHTML = `
      <p><strong>Developer:</strong> ${data.developer}</p>
      <p><strong>Languages:</strong> ${data.language}</p>
      <p><strong>Latest Version:</strong> ${data['latest-version']} (${data['latest-release']})</p>
      <p><strong>License:</strong> ${data.license}</p>
      <p><strong>Open Source:</strong> ${data['open-source'] ? 'Yes' : 'No'}</p>
    `;

    const badges = document.createElement('div');
    badges.className = 'algorithm-badges';
    if (card.dataset.kyber === 'true') badges.appendChild(createBadge('Kyber'));
    if (card.dataset.dilithium === 'true') badges.appendChild(createBadge('Dilithium'));
    if (card.dataset.sphincs === 'true') badges.appendChild(createBadge('SPHINCS+'));
    if (card.dataset.falcon === 'true') badges.appendChild(createBadge('Falcon'));

    card.appendChild(title);
    card.appendChild(desc);
    if (badges.hasChildNodes()) card.appendChild(badges);
    container.appendChild(card);
  });
}

// Create visual badge for algorithm
function createBadge(text) {
  const span = document.createElement('span');
  span.className = 'badge';
  span.textContent = text;
  return span;
}

// Attach input + checkbox events
function setupSearchAndFilterEvents() {
  const searchInput = document.getElementById('search-input');
  const checkboxes = document.querySelectorAll('.pqc-filter');

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  checkboxes.forEach(cb => cb.addEventListener('change', applyFilters));
}