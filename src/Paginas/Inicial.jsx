import { Cabecalho } from '../Componentes/Cabecalho';
import { BarraNavegacao } from '../Componentes/BarraNavegacao';
import { Outlet } from 'react-router-dom';

export function Inicial(){
    return(
        <>
        <Cabecalho />
        <BarraNavegacao/>
        <Outlet />
        </>
    )

}