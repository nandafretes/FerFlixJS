import React, { useState } from 'react';
import estilos from './Login.module.css';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }
    if (username.length < 5 || username.length > 20) {
        setError('O nome de usuário deve ter entre 5 e 20 caracteres.');
        setLoading(false);
        return;
      }

    if (password.length < 5 || password.length > 20) {
        setError('A senha deve ter entre 5 e 20 caracteres.');
        setLoading(false);
        return;
      }

    try {

      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { access, refresh } = data;
        console.log('Access Token:', access);
        console.log('Refresh Token:', refresh);
        alert('Login realizado com sucesso!');
        navigate('/inicial');

        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
      } else {
        setError(data.message || 'Credenciais inválidas.');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={estilos.container}>
     
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
          <input type="text"
            id="username"
            className={estilos.inputGroup}
            value={username}
            onChange={(e) => setUsername(e.target.value)}            
          />

          <input
            type="password"
            id="password"
            className={estilos.inputGroup}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
       
        <button
          type="submit"
          className ={estilos.loginBtn}
          disabled={loading}
               
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}


