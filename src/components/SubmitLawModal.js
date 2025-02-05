import React, { useState } from 'react';
import { z } from 'zod';

const lawSchema = z.object({
  description: z.string().nonempty("La description est obligatoire"),
  ipfsHash: z.string().nonempty("Le lien IPFS est obligatoire")
});

function SubmitLawModal({ closeModal }) {
  const [formData, setFormData] = useState({ description: "", ipfsHash: "" });
  const [errors, setErrors] = useState({ description: "", ipfsHash: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      lawSchema.parse(formData);
      setErrors({ description: "", ipfsHash: "" });
      // Simulation d'ajout de loi, par exemple un ajout à un state global ou log
      console.log("Loi soumise:", formData);
      closeModal();
    } catch (err) {
      const fieldErrors = { description: "", ipfsHash: "" };
      err.errors.forEach(error => {
        const key = error.path[0];
        fieldErrors[key] = error.message;
      });
      setErrors(fieldErrors);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-gray-100 p-6 rounded shadow-lg max-w-sm w-full">
        <h2 className="mb-4 text-center text-lg">Soumettre une loi</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-gray-800">Description:</label>
            <input 
              type="text" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              className="mt-1 w-full border p-2" 
              placeholder="Description de la loi" 
            />
            {errors.description && <p className="text-red-600 text-xs">{errors.description}</p>}
          </div>
          <div className="mb-2">
            <label className="block text-gray-800">Lien IPFS:</label>
            <input 
              type="text" 
              name="ipfsHash" 
              value={formData.ipfsHash} 
              onChange={handleChange} 
              className="mt-1 w-full border p-2" 
              placeholder="Lien IPFS" 
            />
            {errors.ipfsHash && <p className="text-red-600 text-xs">{errors.ipfsHash}</p>}
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={closeModal} className="bg-gray-300 text-gray-800 p-2 rounded">
              Annuler
            </button>
            <button type="submit" className="bg-gray-300 text-gray-800 p-2 rounded">
              Soumettre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubmitLawModal;
