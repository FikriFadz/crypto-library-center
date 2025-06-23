import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import firebaseConfig from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get library ID from URL
const urlParams = new URLSearchParams(window.location.search);
const libraryId = urlParams.get('id');

// Tab functionality
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
}

// Format installation steps from the database
function formatInstallationSteps(installationText) {
  if (!installationText) return '';

  // Split steps by comma (as shown in the image)
  const steps = installationText.split(', ');
  return steps.map((step, index) => `
        <div class="installation-step">
            <h4>Step ${index + 1}</h4>
            <code>${step}</code>
            <p>Short explanation for this step.</p>
        </div>
    `).join('');
}

// Fetch and display library data
async function fetchLibraryDetails(id) {
  try {
    // Fetch basic info from libraries collection
    const libRef = doc(db, 'libraries', id);
    const libSnap = await getDoc(libRef);

    // Fetch detailed content from articles collection
    const articleRef = doc(db, 'articles', id);
    const articleSnap = await getDoc(articleRef);

    if (libSnap.exists() || articleSnap.exists()) {
      const libData = libSnap.exists() ? libSnap.data() : {};
      const articleData = articleSnap.exists() ? articleSnap.data() : {};

      // Combine data with article content taking priority
      const data = {
        ...libData,
        ...articleData,
        name: libData.name || articleData.name || 'libogs'
      };

      // Header
      document.getElementById('library-details').insertAdjacentHTML('afterbegin', `
                <div class="library-header">
                    <h1>${data.name}</h1>
                    <p class="subtitle">Open-source library for quantum-resistant cryptography</p>
                </div>
            `);

      // Overview
      document.getElementById('overview').innerHTML = `
                <div class="overview-content">
                    <p>${data.overview || 'No overview available.'}</p>
                </div>
            `;

      // Details
      document.getElementById('details').innerHTML = `
                <div class="details-grid">
                    <div class="detail-item">
                        <h3>Developer</h3>
                        <p>${data.developer || 'Not specified'}</p>
                        <h3>Languages</h3>
                        <p>${data.language || 'Not specified'}</p>
                    </div>
                    <div class="detail-item">
                        <h3>Latest Version</h3>
                        <p>${data['latest-version'] || 'Not specified'}</p>
                        <h3>Latest Release</h3>
                        <p>${data['latest-release'] || 'Not specified'}</p>
                    </div>
                    <div class="detail-item">
                        <h3>License</h3>
                        <p>${data.license || 'Not specified'}</p>
                        <h3>Open Source</h3>
                        <p>${data['open-source'] ? 'Yes' : 'No'}</p>
                    </div>
                </div>
                <div class="github-section">
        <h3>GitHub Repository</h3>
        ${data.github ?
          `<a href="${data.github}" target="_blank" class="github-link">
                <svg class="github-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                ${data.github.replace('https://github.com/', '')}
            </a>`
          : '<p>No GitHub repository specified</p>'
        }
    </div>
                <div class="algorithms-section">
                    <h3>PQC Algorithms</h3>
                    <div class="algorithms-list">
                        ${Array.isArray(data['pqc-algorithm'])
          ? data['pqc-algorithm'].map(alg => `<span class="algorithm-tag">${alg}</span>`).join('')
          : (data['pqc-algorithm']
            ? `<span class="algorithm-tag">${data['pqc-algorithm']}</span>`
            : '<span>None</span>')
        }
                    </div>
                </div>
            `;

      // Limitations
      document.getElementById('limitations').innerHTML = `
                <div class="limitation-content">
                    <p>${data.limitation || 'No limitations information available.'}</p>
                </div>
            `;

      // Format installation steps from the database
      function formatInstallationSteps(installationText) {
        if (!installationText) return '';

        // Split steps by comma followed by space (to avoid splitting commands with commas)
        const steps = installationText.split(/,\s(?=\w)/);
        return steps.map((step, index) => {
          // Split each step into command and explanation if they exist
          const parts = step.split(/\s-\s/); // Assuming explanations are separated by " - "
          const command = parts[0];
          const explanation = parts[1] || 'Short explanation for this step.';

          return `
            <div class="installation-step">
                <h4>Step ${index + 1}</h4>
                <code>${command}</code>
                <p>${explanation}</p>
            </div>
        `;
        }).join('');
      }

      // Installation section in fetchLibraryDetails
      document.getElementById('installation').innerHTML = `
    <div class="installation-steps">
        ${data['installation-step'] ? formatInstallationSteps(data['installation-step']) : 'No installation instructions available.'}
    </div>
`;

      // Initialize tabs after content is loaded
      setupTabs();
    } else {
      document.getElementById('library-details').textContent = 'Library not found.';
    }
  } catch (error) {
    console.error('Error fetching library details:', error);
    document.getElementById('library-details').textContent = 'An error occurred while loading the library details.';
  }
}

if (libraryId) {
  fetchLibraryDetails(libraryId);
}