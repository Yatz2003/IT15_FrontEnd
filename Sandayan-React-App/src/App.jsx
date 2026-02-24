import { useState } from 'react';
import './App.css'
import Dashboard from './components/Dashboard';
import ProgramList from './components/ProgramList';
import ProgramDetails from './components/ProgramDetails';
import SubjectList from './components/SubjectList';
import SubjectDetails from './components/SubjectDetails';
import { programsData, subjectsData } from './services/mockData';

function App(){
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedId, setSelectedId] = useState(null);

  const navigateTo = (page, id = null) => {
    setCurrentPage(page);
    setSelectedId(id);
    window.scrollTo(0, 0);
  };

  const handleProgramClick = (programId) => {
    navigateTo('program-detail', programId);
  };

  const handleSubjectClick = (subjectId) => {
    navigateTo('subject-detail', subjectId);
  };

  return (
    <div className="App">
      <nav className="app-navbar">
        <div className="navbar-container">
          <div className="logo" onClick={() => navigateTo('dashboard')}>
            <span className="logo-icon">📚</span>
            <span className="logo-text">Sandayan Academy</span>
          </div>
          <div className="nav-links">
            <button 
              className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => navigateTo('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`nav-link ${currentPage === 'programs' ? 'active' : ''}`}
              onClick={() => navigateTo('programs')}
            >
              Programs
            </button>
            <button 
              className={`nav-link ${currentPage === 'subjects' ? 'active' : ''}`}
              onClick={() => navigateTo('subjects')}
            >
              Subjects
            </button>
          </div>
        </div>
      </nav>

      <main className="app-main">
        {currentPage === 'dashboard' && (
          <Dashboard onNavigate={navigateTo} />
        )}
        
        {currentPage === 'programs' && (
          <ProgramList 
            programs={programsData}
            onProgramClick={handleProgramClick}
            onNavigate={navigateTo}
          />
        )}
        
        {currentPage === 'program-detail' && selectedId && (
          <ProgramDetails 
            programId={selectedId}
            onNavigate={navigateTo}
          />
        )}
        
        {currentPage === 'subjects' && (
          <SubjectList 
            subjects={subjectsData}
            onSubjectClick={handleSubjectClick}
            onNavigate={navigateTo}
          />
        )}
        
        {currentPage === 'subject-detail' && selectedId && (
          <SubjectDetails 
            subjectId={selectedId}
            onNavigate={navigateTo}
          />
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-container">
          <p>&copy; 2026 Sandayan Academy. All rights reserved.</p>
          <p>Frontend Demo - Programs and Subjects Management System</p>
        </div>
      </footer>
    </div>
  )
}

export default App