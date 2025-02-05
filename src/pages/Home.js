import React, { useState } from 'react';
import Title from '../components/Title';
import Profile from '../components/Profile';
import SubmitLawModal from '../components/SubmitLawModal';
import LawCarousel from '../components/LawCarousel';

function Home() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden" style={{ fontFamily: "'Kaushan Script', cursive" }}>
      <Title />
      <Profile />
      <LawCarousel />
      {/* Bouton soumettre loi en bas à droite */}
      <button 
        className="absolute bottom-0 right-0 m-4 bg-gray-300 text-gray-800 p-2 rounded"
        onClick={() => setShowModal(true)}
      >
        Soumettre une loi
      </button>
      {showModal && <SubmitLawModal closeModal={() => setShowModal(false)} />}
      {/* ...other components if necessary... */}
    </div>
  );
}

export default Home;
