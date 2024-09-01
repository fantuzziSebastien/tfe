"use client";
import React, { useState, FormEvent } from 'react';
import axios from 'axios';

const AddUser: React.FC = () => {

  const [email, setEmail] = useState<string>('');


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {

      await axios.post('/api/add-user', { email });
      alert('Utilisateur ajouté avec succès. Un email a été envoyé.');
      setEmail('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur', error);
    }
  };

  return (
    <div>
      <h1>Ajouter un utilisateur</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
}

export default AddUser;
