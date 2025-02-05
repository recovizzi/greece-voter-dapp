import React, { useState } from 'react';
import { z } from 'zod';

const addressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Adresse de portefeuille invalide");

function Profile() {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      addressSchema.parse(address);
      setError("");
      // ...traitement de l'adresse validée...
      console.log("Adresse validée:", address);
    } catch (err) {
      setError(err.errors ? err.errors[0].message : "Erreur de validation");
    }
  };

  return (
    <div className="absolute bottom-0 left-0 p-4">
      <div className="rounded p-4 bg-gray-200">
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-800">Adresse :</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 block w-full border p-2"
            placeholder="0x..."
          />
          {error && <p className="text-red-600 mt-1">{error}</p>}
          <button type="submit" className="mt-2 bg-gray-300 text-gray-800 p-2 rounded">
            Valider
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
