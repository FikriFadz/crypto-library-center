import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import firebaseConfig from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get library ID from URL
const urlParams = new URLSearchParams(window.location.search);
const libraryId = urlParams.get('id');

// Reference to container
const detailsContainer = document.getElementById('library-details');

// Fetch and display library data
async function fetchLibraryDetails(id) {
  try {
    const docRef = doc(db, 'libraries', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      detailsContainer.innerHTML = `
        <h2>${data.name}</h2>
        <p><strong>Developer:</strong> ${data.developer}</p>
        <p><strong>Languages:</strong> ${data.language}</p>
        <p><strong>Latest Version:</strong> ${data['latest-version']}</p>
        <p><strong>Latest Release:</strong> ${data['latest-release']}</p>
        <p><strong>License:</strong> ${data.license}</p>
        <p><strong>Open Source:</strong> ${data['open-source'] ? 'Yes' : 'No'}</p>
        <p><strong>PQC Algorithms:</strong> ${
          Array.isArray(data['pqc-algorithm'])
            ? data['pqc-algorithm'].join(', ')
            : data['pqc-algorithm'] || 'None'
        }</p>
      `;
    } else {
      detailsContainer.textContent = 'Library not found.';
    }
  } catch (error) {
    console.error('Error fetching library details:', error);
    detailsContainer.textContent = 'An error occurred while loading the library details.';
  }
}

if (libraryId) {
  fetchLibraryDetails(libraryId);
} else {
  detailsContainer.textContent = 'No library ID provided.';
}
