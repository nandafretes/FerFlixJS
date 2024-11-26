import estilos from './Cabecalho.module.css';
import Profs from '../assets/Profs.jpeg'

export function Cabecalho(){
    return(
    <header className={estilos.conteiner}>
        <img className={estilos.avatar} src={Profs} />
        <h1>FerFlix</h1>
    </header>
    )
}