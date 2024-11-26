import {Routes,Route} from 'react-router-dom';
import { Login } from '../Paginas/Login';
import { Inicial } from '../Paginas/Inicial';
import { Lista } from '../Componentes/Lista';
import { ListarFilmes } from '../Paginas/ListarFilmes';
import { AlterarFilme } from '../Paginas/AlterarFilme';
import { CadFilmes } from '../Paginas/CadFilmes';


export function Rotas(){

    return (
        <Routes>
            <Route path='/' element={<Login  />} />
            <Route path ='inicial' element={<Inicial/>}>
                <Route index element={<Lista/>}/>
                <Route path='listarfilmes' element={<ListarFilmes/>}/>
                <Route path='filme/:id' element={<AlterarFilme />} />      
                <Route path='cadastro' element={<CadFilmes/>}/> 
                <Route path='filme/:id' element={<AlterarFilme />} />  
                        
            </Route>
        </Routes>
    );

}