import React from 'react';
import { programsData, subjectsData, getRecentlyAdded } from '../services/mockData';
import '../styles/Dashboard.css';

const Dashboard = ({ onNavigate }) => {
  // Calculate statistics
  const totalPrograms = programsData.length;
  const totalSubjects = subjectsData.length;
  const activePrograms = programsData.filter(p => p.status === 'active').length;
  const inactivePrograms = programsData.filter(p => p.status !== 'active').length;
  
  // Calculate subjects with prerequisites
  const subjectsWithPrerequisites = subjectsData.filter(s => s.prerequisite !== 'none').length;
  
  // Get recently added items
  const recent = getRecentlyAdded();
  
  // Count subjects per semester
  const firstSemesterCount = subjectsData.filter(s => s.semester === 'first' || s.semester === 'both').length;
  const secondSemesterCount = subjectsData.filter(s => s.semester === 'second' || s.semester === 'both').length;
  
  // Group subjects by program
  const subjectsByProgram = {};
  subjectsData.forEach(subject => {
    subject.programs.forEach(programId => {
      if (!subjectsByProgram[programId]) {
        subjectsByProgram[programId] = 0;
      }
      subjectsByProgram[programId]++;
    });
  });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Academic Programs and Subjects Overview</p>
      </div>

      {/* Statistics Grid */}
      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <p className="stat-label">Total Programs</p>
            <p className="stat-value">{totalPrograms}</p>
          </div>
        </div>

        <div className="stat-card stat-secondary">
          <div className="stat-icon">📖</div>
          <div className="stat-content">
            <p className="stat-label">Total Subjects</p>
            <p className="stat-value">{totalSubjects}</p>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <p className="stat-label">Active Programs</p>
            <p className="stat-value">{activePrograms}</p>
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-icon">⚠</div>
          <div className="stat-content">
            <p className="stat-label">Inactive Programs</p>
            <p className="stat-value">{inactivePrograms}</p>
          </div>
        </div>
      </div>

      {/* Overview Sections */}
      <div className="dashboard-sections">
        {/* Semester Distribution */}
        <div className="dashboard-section">
          <h2>Subjects by Semester</h2>
          <div className="semester-stats">
            <div className="semester-item">
              <span className="semester-label">First Semester</span>
              <div className="semester-bar">
                <div 
                  className="semester-fill semester-first" 
                  style={{ width: `${(firstSemesterCount / totalSubjects) * 100}%` }}
                >
                  {firstSemesterCount}
                </div>
              </div>
            </div>
            <div className="semester-item">
              <span className="semester-label">Second Semester</span>
              <div className="semester-bar">
                <div 
                  className="semester-fill semester-second" 
                  style={{ width: `${(secondSemesterCount / totalSubjects) * 100}%` }}
                >
                  {secondSemesterCount}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects with Prerequisites */}
        <div className="dashboard-section">
          <h2>Subject Prerequisites</h2>
          <div className="info-box">
            <p className="info-value">{subjectsWithPrerequisites}</p>
            <p className="info-label">Subjects with Prerequisites</p>
            <p className="info-percentage">({((subjectsWithPrerequisites / totalSubjects) * 100).toFixed(1)}% of total)</p>
          </div>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="dashboard-detailed">
        {/* Program Status Overview */}
        <div className="detailed-section">
          <h2>Program Status Overview</h2>
          <div className="status-list">
            {programsData.map(program => (
              <div key={program.id} className="status-item">
                <div className="status-info">
                  <h4>{program.name}</h4>
                  <p className="status-code">{program.code}</p>
                </div>
                <div className={`status-badge status-${program.status}`}>
                  {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subjects per Program */}
        <div className="detailed-section">
          <h2>Subjects per Program</h2>
          <div className="program-subjects-list">
            {programsData.map(program => (
              <div key={program.id} className="program-subject-item">
                <span className="program-code">{program.code}</span>
                <span className="subject-count">{subjectsByProgram[program.id] || 0} subjects</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recently Added Items */}
      <div className="recent-section">
        <h2>Recently Added Programs</h2>
        <div className="recent-items">
          {recent.programs.map(program => (
            <div key={program.id} className="recent-item recent-program">
              <div className="recent-content">
                <h4>{program.name}</h4>
                <p className="recent-code">{program.code}</p>
                <span className="recent-type">{program.type}</span>
              </div>
              <button 
                className="recent-btn"
                onClick={() => onNavigate('program-detail', program.id)}
              >
                View →
              </button>
            </div>
          ))}
        </div>

        <h2 style={{ marginTop: '2rem' }}>Recently Added Subjects</h2>
        <div className="recent-items">
          {recent.subjects.map(subject => (
            <div key={subject.id} className="recent-item recent-subject">
              <div className="recent-content">
                <h4>{subject.title}</h4>
                <p className="recent-code">{subject.code}</p>
                <span className="recent-units">{subject.units} units</span>
              </div>
              <button 
                className="recent-btn"
                onClick={() => onNavigate('subject-detail', subject.id)}
              >
                View →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button 
          className="action-btn primary"
          onClick={() => onNavigate('programs')}
        >
          View All Programs
        </button>
        <button 
          className="action-btn secondary"
          onClick={() => onNavigate('subjects')}
        >
          View All Subjects
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
