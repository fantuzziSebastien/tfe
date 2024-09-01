"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface User {
  id: string;
  courriel: string;
}

interface Service {
  id: string;
  description: string;
  date: string;
  intervention: string;
}

const AdminHome = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');
  const [services, setServices] = useState<Service[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const servicesPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>('/api/getUsers'); 
        setUsers(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get<Service[]>(`/api/getPrestations/${selectedUser}?sort=${sortOrder}`);
      setServices(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error('Erreur lors de la récupération des prestations', error);
    }
  };

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = services.slice(indexOfFirstService, indexOfLastService);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <h1>Accueil Admin</h1>
      <div>
        <h2>Clients</h2>
        <button><Link href="/add-client">Ajouter un client</Link></button>
        <button><Link href="/view-clients">Voir les clients</Link></button>
      </div>
      <div>
        <h2>Utilisateurs</h2>
        <button><Link href="/add-user">Ajouter un utilisateur</Link></button>
      </div>
      <div>
        <h2>Afficher les prestations d'un utilisateur</h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
            <option value="">Sélectionner un utilisateur</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.courriel}</option>
            ))}
          </select>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'recent' | 'oldest')}>
            <option value="recent">Trier par le plus récent au plus ancien</option>
            <option value="oldest">Trier par le plus ancien au plus récent</option>
          </select>
          <button onClick={handleSearch}>Rechercher</button>
        </div>
        <div>
          {currentServices.map((service) => (
            <div key={service.id}>
              <p>{service.intervention}</p>
{/*               <p>{new Date(service.date).toLocaleDateString()}</p> */}
            </div>
          ))}
          <div>
            {Array.from({ length: Math.ceil(services.length / servicesPerPage) }, (_, index) => (
              <button key={index} onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
