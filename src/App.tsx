import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Templates from './pages/Templates';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Editor from './pages/Editor';
import Auth from './pages/Auth';
import Invitation from './pages/Invitation';
import Workspace from './pages/Workspace';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/templates" element={<Templates />} />
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/editor" element={<Editor />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/workspace" element={<Workspace />} />
      <Route path="/i/:slug" element={<Invitation />} />
    </Routes>
  );
}
