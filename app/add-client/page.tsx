"use client";
import React, { useState } from 'react';
import axios from 'axios';

const AddClient: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post('/api/add-client', { name, location });
      alert('Client ajouté avec succès');
      setName('');
      setLocation('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du client', error);
    }
  };

  return (
    <div>
      <h1>Ajouter un client</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nom:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="location">Location:</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default AddClient;
