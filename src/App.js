import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login.tsx'; // Si el archivo tiene extensión .tsx, no es necesario agregarla
import Dashboard from './components/dashboar.tsx';
import NewContract from './components/newcontract.tsx';
import ClausulaLibrary from './components/clausulalibrary.tsx';
import ContractAssistant from './components/contractassistent.tsx';
import ContractListExport from './components/ContractListExport.tsx';


const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Dashboard/>} />
      <Route path="/newcontract" element={<NewContract/>} /> 
      <Route path="/clausulas" element={<ClausulaLibrary/>} />
      <Route path="/assitente" element={<ContractAssistant/>} />
      <Route path='/export' element={<ContractListExport/>}/>

    </Routes>
  </Router>
);

export default App;
