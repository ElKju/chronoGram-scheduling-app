import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/authentication/LoginPage';
import RegisterPage from './components/authentication/RegisterPage';
import AccountEditPage from './components/authentication/AccountEditPage';
import MainPage from './components/mainPage/MainPage';
import ManageContacts from './components/contacts/ManageContacts';
import Header from './components/breadcrumbs/Header';
import Footer from './components/breadcrumbs/Footer';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/contacts/list/all" element={<ManageContacts />} />
          <Route path="/account/edit" element={<AccountEditPage />} />
          {/* Add more routes as needed */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
