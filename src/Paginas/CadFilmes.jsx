import React, { useState, useEffect } from 'react';
import estilos from './CadFilmes.module.css';

export function CadFilmes() {
  const [accessToken, setAccessToken] = useState(null);
  const [generos, setGeneros] = useState([]);
  const [loadingGeneros, setLoadingGeneros] = useState(true);

  const [titulo, setTitulo] = useState('');
  const [ano, setAno] = useState('');
  const [idioma, setIdioma] = useState('');
  const [genero, setGenero] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('access_token');
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
      console.log("Token recuperado:", storedAccessToken);
    } else {
      console.error("Token de acesso não encontrado");
    }
  }, []);

  useEffect(() => {
    const buscarGeneros = async () => {
      if (!accessToken) return;

      const generoIds = [1, 2, 3, 4, 5, 6, 7, 8];
      try {
        const generosList = [];
        for (let id of generoIds) {
          console.log(`Buscando gênero ID ${id}`);

          const response = await fetch(`http://127.0.0.1:8000/api/genero/${id}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          });

          if (response.ok) {
            const genero = await response.json();
            generosList.push(genero);
          } else {
            console.error(`Erro ao buscar gênero com ID ${id}:`, response.statusText);
          }
        }
        setGeneros(generosList);
        console.log("Gêneros carregados:", generosList);
      } catch (error) {
        console.error('Erro ao buscar gêneros:', error);
      } finally {
        setLoadingGeneros(false);
      }
    };

    buscarGeneros();
  }, [accessToken]);


  const handleCadFilme = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
  
    console.log("Tentando cadastrar o filme com os dados:");
    console.log({ titulo, ano, idioma, genero });
  
    const errors = []; // Array para armazenar mensagens de erro

    // Validações dos campos do formulário
    if (!titulo || !ano || !idioma || !genero) {
      errors.push('Por favor, preencha todos os campos.');
      console.log("Erro: Campo(s) vazio(s)");
    }
    
    if (ano < 1900 || ano > 2050) {
      errors.push('Por favor, informe um ano válido entre 1900 e 2050.');
      console.log("Erro: Ano inválido");
    }
    
    // Verifique os erros acumulados antes de retornar
    if (errors.length > 0) {
      console.log("Erros acumulados:", errors.join(' | '));  
      setError(errors.join(' | ')); 
      setLoading(false);
      return;  
    }
    try {
      const formData = { 
        titulo, 
        ano, 
        idioma, 
        genre: parseInt(genero),  
        classif: "PG-13" 
      };
    
      console.log("Enviando dados para a API:", formData);
    
      const response = await fetch('http://127.0.0.1:8000/api/filmes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(formData)
      });
    
      const data = await response.json();
      console.log("Resposta da API:", data);
    
      if (response.ok) {
        alert("Filme cadastrado com sucesso!");
        // Limpa o formulário
        setTitulo('');
        setAno('');
        setIdioma('');
        setGenero('');
      } else {
        // Exibe a mensagem de erro retornada pela API
        setError(data.message || 'Erro ao cadastrar o filme.');
        console.error('Erro retornado pela API:', data);
      }
    } catch (error) {
      console.error("Erro ao conectar ao servidor:", error);
      setError('Erro ao conectar ao servidor.');
    }
  }

  return (
    <div className={estilos.conteiner}>
      <form className={estilos.formulario} onSubmit={handleCadFilme}>
        <h2>Cadastro de Filmes</h2>
        <label className={estilos.mensagem}>{error}</label>
        <input
          type="text"
          className={estilos.campo}
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <input
          type="number"
          className={estilos.campo}
          placeholder="Ano"
          value={ano}
          onChange={(e) => setAno(e.target.value)}
        />

        <input
          type="text"
          className={estilos.campo}
          placeholder="Idioma"
          value={idioma}
          onChange={(e) => setIdioma(e.target.value)}
        />

        <select
          className={estilos.campo}
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
        >
          <option value="">Selecione um gênero</option>
          {loadingGeneros ? (
            <option value="">Carregando gêneros...</option>
          ) : (
            generos.map((gen) => (
              <option key={gen.id} value={gen.id}>
                {gen.nome || gen.genre} {/* Ajuste conforme o campo retornado */}
              </option>
            ))
          )}
        </select>

        <button type="submit" className={estilos.botao} d>
          Cadastrar
        </button>
      </form>
    </div>
  );
}