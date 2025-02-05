import React, { useState, useEffect } from 'react';

const sampleLaws = [
  // Exemple de lois simulées
  { id: 1, ipfsHash: "0xabc123", description: "Loi concernant la redistribution des terres", timestamp: Date.now() - 2 * 60 * 1000 },
  { id: 2, ipfsHash: "0xdef456", description: "Loi sur la protection des citoyens", timestamp: Date.now() - 5 * 60 * 1000 },
  { id: 3, ipfsHash: "0xghi789", description: "Loi relative au commerce équitable", timestamp: Date.now() - 1 * 60 * 1000 },
  { id: 4, ipfsHash: "0xjkl012", description: "Loi sur la réglementation des assemblées", timestamp: Date.now() - 8 * 60 * 1000 },
  { id: 5, ipfsHash: "0xmno345", description: "Loi concernant l'éducation civique", timestamp: Date.now() - 10 * 60 * 1000 },
  { id: 6, ipfsHash: "0xpqr678", description: "Loi sur l'égalité devant la loi", timestamp: Date.now() - 3 * 60 * 1000 },
];

function LawCarousel() {
  const [laws] = useState(sampleLaws);
  const total = laws.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(600); // in seconds
  
  // New votes state: map law.id to vote counts.
  const [votes, setVotes] = useState(() => {
    const initial = {};
    laws.forEach(law => {
      initial[law.id] = { pour: 0, contre: 0 };
    });
    return initial;
  });

  // Update timer for the focused law.
  useEffect(() => {
    const law = laws[currentIndex];
    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - law.timestamp) / 1000);
      const remaining = 600 - elapsed;
      setTimer(remaining > 0 ? remaining : 0);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [currentIndex, laws]);

  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60).toString().padStart(2, '0');
    const seconds = (sec % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const finished = timer === 0;

  // Build a fixed window of 5 indices using offsets -2, -1, 0, 1, 2.
  const offsets = [-2, -1, 0, 1, 2];
  const windowItems = offsets.map(offset => (currentIndex + offset + total) % total);

  // Vote button handlers for focused law.
  const handleVotePour = () => {
    const lawId = laws[currentIndex].id;
    setVotes(prev => ({
      ...prev,
      [lawId]: { ...prev[lawId], pour: prev[lawId].pour + 1 }
    }));
    setTimer(0); // simulate finish
  };

  const handleVoteContre = () => {
    const lawId = laws[currentIndex].id;
    setVotes(prev => ({
      ...prev,
      [lawId]: { ...prev[lawId], contre: prev[lawId].contre + 1 }
    }));
    setTimer(0); // simulate finish
  };

  // Render item based on its offset.
  const renderItem = (offset, itemIndex) => {
    const law = laws[itemIndex];
    if(itemIndex === currentIndex) {
      // Focused law.
      return (
        <div key={law.id}
          className="border bg-gray-50 p-4 flex flex-col items-center justify-center transition-all duration-300"
          style={{ minWidth: '250px', margin: '0 10px' }}
        >
          <h2 className="text-center text-xl text-gray-800">{law.ipfsHash}</h2>
          <div className="my-4 p-2 bg-gray-300 w-full">
            <p className="text-center text-gray-800">{law.description}</p>
          </div>
          { !finished ? (
            <>
              <p className="text-center text-gray-800">Temps restant: {formatTime(timer)}</p>
              <div className="flex justify-around mt-4 w-full">
                <button onClick={handleVotePour} className="bg-gray-300 text-gray-800 p-2 rounded">Vote Pour</button>
                <button onClick={handleVoteContre} className="bg-gray-300 text-gray-800 p-2 rounded">Vote Contre</button>
              </div>
            </>
          ) : (
            <>
              <p className="text-center text-gray-800">finish</p>
              <div className="flex justify-around mt-4 w-full">
                <div className="bg-gray-300 text-gray-800 p-2 rounded">{votes[law.id].pour}</div>
                <div className="bg-gray-300 text-gray-800 p-2 rounded">
                  {votes[law.id].pour > votes[law.id].contre ? "Pass" : "Not Pass"}
                </div>
                <div className="bg-gray-300 text-gray-800 p-2 rounded">{votes[law.id].contre}</div>
              </div>
            </>
          )}
          <div className="mt-2 text-sm text-gray-600">ID: {law.id}</div>
        </div>
      );
    } else {
      // Preview: small fixed box with hash, description and timer/finish.
      return (
        <div key={law.id}
          className="border bg-gray-100 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer"
          style={{ minWidth: '80px', margin: '0 5px', padding: '4px' }}
          onClick={() => setCurrentIndex(itemIndex)}
        >
          <span className="text-xs text-gray-800 font-bold">{law.ipfsHash}</span>
          <span className="text-[10px] text-gray-600 text-center">{law.description}</span>
          <span className="text-[10px] text-gray-600 text-center mt-1">{ finished ? "finish" : formatTime(timer) }</span>
        </div>
      );
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      {/* Display fixed container with 5 items */}
      <div className="flex items-center">
        { offsets.map((offset, idx) => renderItem(offset, windowItems[idx]) ) }
      </div>
      {/* Navigation Buttons */}
      <div className="flex mt-4 space-x-4">
        <button onClick={() => setCurrentIndex((currentIndex - 1 + total) % total)}
          className="bg-gray-300 text-gray-800 p-2 rounded">
          &larr;
        </button>
        <button onClick={() => setCurrentIndex((currentIndex + 1) % total)}
          className="bg-gray-300 text-gray-800 p-2 rounded">
          &rarr;
        </button>
      </div>
    </div>
  );
}

export default LawCarousel;
