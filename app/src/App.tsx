import React, { useState ,useEffect}  from 'react';
import {BrowserRouter as Router,Route,Routes, Link } from "react-router-dom";
import {  WalletMultiButton } from '@solana/wallet-adapter-react-ui';

//import logo from './logo.svg';
import './App.css';
import AirdropToken from "./component/AirdropToken";
import Home from "./component/Home";

// Header Component
const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src="/logo.svg" alt="Logo" />
      </div>
      <nav>
        {/* Add header navigation links here if needed */}
      </nav>
      <div className="flex-none space-x-2">
        
            <WalletMultiButton />
      
          
        </div>
    </header>
  );
};

// Sidebar Component
const Sidebar = () => {

  const [isSidebarMinimized, setSidebarMinimized] = useState(false);

  const toggleSidebar = () => {
    setSidebarMinimized((prevState) => !prevState);
  };
  
  return (
    <div className={`sidebar ${isSidebarMinimized ? 'minimized' : ''}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isSidebarMinimized ? 'Expand' : 'Minimize'}
      </button>
      <nav style={{display: isSidebarMinimized ? 'none' : 'block' }}>
        <ul>
          <li><Link className="nav-link" to="/">Mint Token</Link></li>
          <li><Link className="nav-link" to="/airdroptoken">Airdrop Token</Link></li>
          <li>Contact</li>
          {/* Add other sidebar links here */}
        </ul>
      </nav>
    </div>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="footer">
      <p>© 2024 Your Company</p>
    </footer>
  );
};



function App() {
  


  return (
    <Router>
    <div className="app">
      <Header />
      <div className="main-content">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/airdropToken"  element={<AirdropToken/>}></Route>
        </Routes>
            
        
      </div>
      <Footer />
    </div>
    </Router>
  );
}

export default App;
