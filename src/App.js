import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FamilyTreeProvider } from './contexts/FamilyTreeContext';
import Settings from './pages/Settings';
import FamilyTree from './pages/FamilyTree';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&family=Nanum+Gothic:wght@400;700&family=Nanum+Myeongjo:wght@400;700&family=Poor+Story&family=Sunflower:wght@500&display=swap');
`;

function App() {
  return (
    <FamilyTreeProvider>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<Settings />} />
          <Route path="/tree" element={<FamilyTree />} />
        </Routes>
      </Router>
    </FamilyTreeProvider>
  );
}

export default App;
