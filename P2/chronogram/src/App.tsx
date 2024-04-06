import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/authentication/LoginPage';
import RegisterPage from './components/authentication/RegisterPage';
import AccountEditPage from './components/authentication/AccountEditPage';
import MainPage from './components/mainPage/MainPage';
import ManageContacts from './components/contacts/ManageContacts';
import Header from './components/breadcrumbs/Header';
import Footer from './components/breadcrumbs/Footer';
import ManageSchedules from './components/schedules/ManageSchedules';
import InviteeLandingPage from './components/invitees/InviteeLandingPage';
import ContactPage from './components/breadcrumbs/contactus';

const App: React.FC = () => {
  
  const currentUrl = window.location.href;
  const parsedUrl = new URL(currentUrl);
  const pathname = parsedUrl.pathname;
  const parts = pathname.split("/");
  const token = parts[2];

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<LoginPage  />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/contact-us" element={<ContactPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/contacts/list/all" element={<ManageContacts />} />
          <Route path={`/invitee/${token}`} element={<InviteeLandingPage token= {token}/>} />
          <Route path="/schedules/list/all" element={<ManageSchedules />} />
          <Route path="/account/edit" element={<AccountEditPage />} />
          {/* Add more routes as needed */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
