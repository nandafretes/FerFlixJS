import estilos from './ListarFilmes.module.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export function ListarFilmes() {
  const [accessToken, setAccessToken] = useState(null);
  const [filmesCadastrados, setFilmesCadastrados] = useState([]);
  const [generosCache, setGenerosCache] = useState({});

  useEffect(() => {
    async function fetchFilmesCadastrados() {
      try {
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('accessToken');
        setAccessToken(token);
        
        if (!token) {
          console.error('Token não encontrado.');
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/filmes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setFilmesCadastrados(response.data);
      } catch (err) {
        console.error('Erro ao buscar filmes:', err);
      }
    }

    fetchFilmesCadastrados();
  }, []);

  // Função para buscar os gêneros de cada filme
  useEffect(() => {
    const fetchGeneros = async () => {
      const novosGenerosCache = { ...generosCache };
      for (let filme of filmesCadastrados) {
        if (!novosGenerosCache[filme.genre]) {
          try {
            const response = await axios.get(`http://localhost:8000/api/genero/${filme.genre}`, {
              headers: {
                'Authorization': `Bearer ${accessToken}`  // Substituído token por accessToken
              }
            });
            novosGenerosCache[filme.genre] = response.data.genre;
          } catch (error) {
            console.error('Erro ao buscar gênero:', error);
          }
        }
      }
      setGenerosCache(novosGenerosCache);
    };

    if (filmesCadastrados.length > 0 && accessToken) {  
      fetchGeneros();
    }
  }, [filmesCadastrados, accessToken]);

  return (
    <div className={estilos.conteiner}>
      <h2>Lista de Filmes Favoritos</h2>
      <table className={estilos.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Gênero</th>
            <th>Ano</th>
            <th>Idioma</th>
            <th>Classificação</th>
            <th>Alterar Dados</th>
          </tr>
        </thead>
        <tbody>
          {filmesCadastrados.map((filme) => (
            <tr key={filme.id}>
              <td>{filme.id}</td>
              <td>{filme.titulo}</td>
              <td>{generosCache[filme.genre] || 'Carregando...'}</td>
              <td>{filme.ano}</td>
              <td>{filme.idioma}</td>
              <td>{filme.classif}</td>
              <td>
                <Link to={`/inicial/filme/${filme.id}`} className={estilos.alterarLink}>
                  Alterar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}