import { getFirestore, collection, getDocs, enableIndexedDbPersistence } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import firebaseConfig from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { setLibraries } from './filter.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Enable offline caching
enableIndexedDbPersistence(db).catch(err => console.warn(err));

export async function fetchAndDisplayLibraries() {
  try {
    const snapshot = await getDocs(collection(db, 'libraries'));
    const librariesData = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      data.id = doc.id;

      // Normalize data for filtering
      data.normalizedName = data.name.toLowerCase();
      const rawAlgos = data['pqc-algorithm'];
      data.pqcAlgorithms = Array.isArray(rawAlgos)
        ? rawAlgos.map(a => a.trim())
        : typeof rawAlgos === 'string'
          ? rawAlgos.split(',').map(a => a.trim())
          : [];

      librariesData.push(data);
    });

    // Send the data to filter.js
    setLibraries(librariesData);

  } catch (err) {
    console.error('Error loading libraries:', err);
  }
}