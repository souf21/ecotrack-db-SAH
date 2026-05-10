import { useState } from 'react';
import Login from './pages/Login';
import GestionnaireLayout from './components/layout/GestionnaireLayout';
import AgentLayout from './components/layout/AgentLayout';
import CitoyenLayout from './components/layout/CitoyenLayout';

export default function App() {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem('user'));
  });

  if (!user) return <Login onLogin={setUser} />;
  if (user.role === 'gestionnaire') return <GestionnaireLayout user={user} />;
  if (user.role === 'agent')        return <AgentLayout user={user} />;
  if (user.role === 'citoyen')      return <CitoyenLayout user={user} onUserUpdate={setUser} />;

  // Unknown or missing role — clear session and return to login
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  return <Login onLogin={setUser} />;
}