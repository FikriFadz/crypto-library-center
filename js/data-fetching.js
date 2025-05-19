// import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
// import { getFirestore, collection, onSnapshot, enableIndexedDbPersistence } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
// import firebaseConfig from './firebase-config.js';  // Changed to default import

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// // Move your data fetching logic here temporarily for testing
// export function fetchAndDisplayData() {
//     const dataList = document.getElementById('data-list');

//     if (!dataList) {
//         console.error('Data list element not found');
//         return;
//     }

//     enableIndexedDbPersistence(db)
//         .catch((err) => {
//             if (err.code === 'failed-precondition') {
//                 console.error('Multiple tabs open. Offline persistence can only be enabled in one tab at a time.');
//             } else if (err.code === 'unimplemented') {
//                 console.error('The current browser does not support offline persistence.');
//             }
//         });

//     const collectionRef = collection(db, 'libraries');
//     onSnapshot(collectionRef, (snapshot) => {
//         dataList.innerHTML = '';

//         snapshot.forEach((doc) => {
//             const data = doc.data();
//             const dataItem = document.createElement('div');
//             dataItem.classList.add('data-item');
//             dataItem.textContent = `ID: ${doc.id}, Name: ${data.name}, Developer: ${data.developer}`;
//             dataList.appendChild(dataItem);
//         });
//     });
// }

// fetchAndDisplayData(); // Run function when script loads

//line baru

import {
  getFirestore, collection, getDocs, enableIndexedDbPersistence
} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import firebaseConfig from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Enable offline caching
enableIndexedDbPersistence(db).catch(err => console.warn(err));

export async function fetchAndDisplayLibraries() {
  const container = document.querySelector('.features');
  if (!container) return;

  try {
    const snapshot = await getDocs(collection(db, 'libraries'));
    container.innerHTML = ''; // Clear existing static cards

    snapshot.forEach(doc => {
      const data = doc.data();

      // Create card
      const card = document.createElement('div');
      card.className = 'feature-card';

      // Set data attributes based on your actual Firestore fields
      card.dataset.kyber = data['pqc-algorithm']?.includes('Kyber') || false;
      card.dataset.dilithium = data['pqc-algorithm']?.includes('Dilithium') || false;
      card.dataset.sphincs = data['pqc-algorithm']?.includes('SPHINCS+') || false;
      card.dataset.type = data['pqc-algorithm'] ? 'pqc' : 'classic';
      card.dataset.language = data.language || '';
      card.dataset.name = data.name.toLowerCase();

      const title = document.createElement('h3');
      title.textContent = data.name;

      const desc = document.createElement('div');
      desc.className = 'library-details';

      // Add all the details from your Firestore document
      desc.innerHTML = `
        <p><strong>Developer:</strong> ${data.developer}</p>
        <p><strong>Languages:</strong> ${data.language}</p>
        <p><strong>Latest Version:</strong> ${data['latest-version']} (${data['latest-release']})</p>
        <p><strong>License:</strong> ${data.license}</p>
        <p><strong>Open Source:</strong> ${data['open-source'] ? 'Yes' : 'No'}</p>
      `;

      // Add algorithm badges if supported
      const badges = document.createElement('div');
      badges.className = 'algorithm-badges';

      if (card.dataset.kyber === 'true') {
        badges.appendChild(createBadge('Kyber'));
      }
      if (card.dataset.dilithium === 'true') {
        badges.appendChild(createBadge('Dilithium'));
      }
      if (card.dataset.sphincs === 'true') {
        badges.appendChild(createBadge('SPHINCS+'));
      }

      card.appendChild(title);
      card.appendChild(desc);
      if (badges.hasChildNodes()) {
        card.appendChild(badges);
      }
      container.appendChild(card);
    });

    // Initialize filter functionality after cards are loaded
    setupFilters();
    setupSearch(); // Make sure search works with the new structure
  } catch (err) {
    console.error('Error loading libraries:', err);
  }
}

function createBadge(name) {
  const badge = document.createElement('span');
  badge.className = 'algorithm-badge';
  badge.textContent = name;
  return badge;
}