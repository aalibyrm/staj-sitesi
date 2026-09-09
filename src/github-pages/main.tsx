import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../../app/globals.css';
import { GitHubPagesApp } from './GitHubPagesApp';

const root = document.getElementById('root');
if (!root) throw new Error('Uygulama kök öğesi bulunamadı.');

createRoot(root).render(
  <StrictMode>
    <GitHubPagesApp />
  </StrictMode>,
);
