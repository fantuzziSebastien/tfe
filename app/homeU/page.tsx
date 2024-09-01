"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Prestation {
  id: number;
  remarque: string;
  date: string;
}

const HomeU = () => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [prestations, setPrestations] = useState<Prestation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();


  useEffect(() => {
    const email = localStorage.getItem('userEmail');

    if (email) {
      const fetchUserDetails = async () => {
        try {
          const res = await axios.get('/api/getUserDetails', { params: { email } });
          setFirstName(res.data.firstName);

          fetchPrestations(email);
        } catch (err) {
          console.error('Erreur lors de la récupération des détails de l\'utilisateur:', err);
          setError('Impossible de récupérer les informations de l\'utilisateur.');
          setLoading(false);
        }
      };

      fetchUserDetails();
    } else {
      setError('Aucun utilisateur trouvé. Veuillez vous reconnecter.');
      setLoading(false);
    }
  }, []);

  const fetchPrestations = async (email: string) => {
    try {
      const res = await axios.get('/api/getPrestationsUser', { params: { email } });
      setPrestations(res.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des prestations:', err);
      setError('Erreur lors de la récupération des prestations.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const email = localStorage.getItem('userEmail');
      if (!email) throw new Error('Utilisateur non trouvé.');

      const res = await axios.post('/api/createPrestation', {
        email,
        description,
        date
      });

      setSuccessMessage('Prestation créée avec succès.');
      setDescription('');
      setDate('');


      fetchPrestations(email);
    } catch (err) {
      console.error('Erreur lors de la création de la prestation:', err);
      setError('Erreur lors de la création de la prestation.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    router.push('/');
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Bienvenue, {firstName}!</h1>

      <h2>Créer une nouvelle prestation</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Créer</button>
      </form>

      {successMessage && <p>{successMessage}</p>}

      <h2>Vos Prestations</h2>
      <ul>
        {prestations.map((prestation) => (
          <li key={prestation.id}>
            <p>Description: {prestation.remarque}</p>
            <p>Date: {new Date(prestation.date).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
      <button onClick={handleLogout}>Déconnexion</button>
    </div>
  );
};

export default HomeU;


