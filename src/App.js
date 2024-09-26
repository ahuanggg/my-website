import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import Projects from './pages/projects';
import Contact from './pages/contact';
import './App.css';

function App() {
    return (
        <Router basename='/my-website'>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/about' element={<About />} />
                <Route path='/portfolio' element={<Projects />} />
                <Route path='/contact' element={<Contact />} />
            </Routes>
        </Router>
    );
}

export default App;
