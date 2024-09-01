"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';


interface Client {
  id: number;
  denomination: string;
  ville: string;
}

function ViewClients() {

  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get<Client[]>('/api/getClients');
        setClients(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des clients', error);
      }
    };

    fetchClients();
  }, []);

  return (
    <div>
      <h1>Liste des clients</h1>
      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            {client.denomination} - {client.ville}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewClients;
