import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import estilos from './AlterarFilme.module.css';

export function AlterarFilme() {
  const { id } = useParams();
  const [accessToken, setAccessToken] = useState(null);
  const [filme, setFilme] = useState({
    titulo: '',
    ano: '',
    idioma: '',
    genero: '',
    classif: ''
  });
  const [generos, setGeneros] = useState([]);
  const [loadingGeneros, setLoadingGeneros] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('accessToken');
    if (token) setAccessToken(token);
    else console.error('Token não encontrado.');
  }, []);

  useEffect(() => {
    if (accessToken) {
      const fetchFilme = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/filme/${id}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          });
          setFilme(response.data);
        } catch (error) {
          setError('Erro ao buscar dados do filme.');
        }
      };
      fetchFilme();
    }
  }, [accessToken, id]);


  // Busca a lista de gêneros
  useEffect(() => {
    const buscarGeneros = async () => {
      const generosList = [];
      const generoIds = [1, 2, 3, 4, 5, 6, 7, 8]; // IDs conhecidos dos gêneros

      try {
        for (let id of generoIds) {
          const response = await axios.get(`http://127.0.0.1:8000/api/genero/${id}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          if (response.status === 200) {
            generosList.push(response.data);
          } else {
            console.error(`Erro ao buscar gênero com ID ${id}:`, response.statusText);
          }
        }
        setGeneros(generosList);
      } catch (error) {
        console.error('Erro ao buscar gêneros:', error);
      } finally {
        setLoadingGeneros(false);
      }
    };

    if (accessToken) {
      buscarGeneros();
    }
  }, [accessToken]);

//Pega os eventos 
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilme({ ...filme, [name]: value });
    setError(''); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const errors = []; // Array para armazenar mensagens de erro

    // Validações
    if (!filme.titulo.trim()) {
      errors.push('O título não pode estar vazio.');
    } else if (filme.titulo.length < 2 || filme.titulo.length > 100) {
      errors.push('O título deve ter entre 2 e 100 caracteres.');
    }

    if (!filme.ano) {
      errors.push('O ano é obrigatório.');
    } else if (parseInt(filme.ano) < 1900 || parseInt(filme.ano) > 2050) {
      errors.push('O ano deve estar entre 1900 e 2050.');

    }

    if (!filme.idioma.trim()) {
      errors.push('O idioma não pode estar vazio.');
    }

    if (!filme.genero) {
      errors.push('O gênero deve ser selecionado.');
    }

    // Se houver erros, exibe-os e interrompe o envio
    if (errors.length > 0) {
      setError(errors.join(' | ')); 
      console.log("Erros acumulados:", errors.join(' | '));
      //alert("Erros acumulados: " + errors.join(' | '));
      setLoading(false);
      return;
    }

    try {
      await axios.put(`http://localhost:8000/api/filme/${id}`, filme, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      alert('Filme atualizado com sucesso!');
    } catch (error) {
      setError('Erro ao atualizar o filme.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={estilos.conteiner}>
      <form onSubmit={handleSubmit} className={estilos.formulario}>
        <h2>Alterar Dados do Filme</h2>
        <label className={estilos.mensagem}>{error}</label>
        <input
          type="text"
          className={estilos.campo}
          name="titulo"
          value={filme.titulo}
          onChange={handleInputChange}
          placeholder="Título"
        />
        <input
          type="number"
          className={estilos.campo}
          name="ano"
          value={filme.ano}
          onChange={handleInputChange}
          placeholder="Ano"
        />
        <input
          type="text"
          className={estilos.campo}
          name="idioma"
          value={filme.idioma}
          onChange={handleInputChange}
          placeholder="Idioma"
        />
        <select
          name="genero"
          className={estilos.campo}
          value={filme.genero}
          onChange={handleInputChange}
        >
          <option value="">Selecione um gênero</option>
          {loadingGeneros ? (
            <option value="">Carregando gêneros...</option>
          ) : (
            generos.map((genero) => (
              <option key={genero.id} value={genero.id}>
                {genero.genre}
              </option>
            ))
          )}
        </select>
        <input
          type="text"
          className={estilos.campo}
          name="classif"
          value={filme.classif}
          onChange={handleInputChange}
          placeholder="Classificação"
        />
        <button type="submit" className={estilos.botao}>
          Alterar
        </button>
        <p />

      </form>
    </div>
  );
}
