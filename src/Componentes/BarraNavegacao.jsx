import estilos from './BarraNavegacao.module.css';
import { Link } from 'react-router-dom'; 

export function BarraNavegacao(){

    return(
        <nav className={estilos.conteiner}>
            <ul>
            <Link to='/inicial'><li>Home</li></Link>               
            <Link to='/inicial/cadastro'><li>Cadastro Filmes</li></Link> 
            <Link to='/inicial/listarFilmes'><li>Listar Filmes</li></Link>    
            
            </ul>
        </nav>
        
    )
}