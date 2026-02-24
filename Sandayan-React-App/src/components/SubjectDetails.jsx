import React from 'react';
import { getSubjectById, programsData } from '../services/mockData';
import '../styles/SubjectDetails.css';

const SubjectDetails = ({ subjectId, onNavigate }) => {
  const subject = getSubjectById(subjectId);

  if (!subject) {
    return (
      <div className="subject-details-container">
        <p>Subject not found.</p>
        <button onClick={() => onNavigate('subjects')}>Back to Subjects</button>
      </div>
    );
  }

  // Get programs that offer this subject
  const programsOffering = programsData.filter(p => subject.programs.includes(p.id));

  return (
    <div className="subject-details-container">
      <div className="details-header">
        <button 
          className="back-btn"
          onClick={() => onNavigate('subjects')}
        >
          ← Back to Subjects
        </button>
        <h1>{subject.title}</h1>
      </div>

      {/* Subject Overview */}
      <div className="subject-overview">
        <div className="overview-card primary">
          <h3>Subject Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Subject Code:</label>
              <p className="code-text">{subject.code}</p>
            </div>
            <div className="info-item">
              <label>Credits/Units:</label>
              <p>
                <span className="units-badge">{subject.units}</span>
              </p>
            </div>
            <div className="info-item">
              <label>Semester/Term Offered:</label>
              <p>
                <span className={`semester-indicator semester-${subject.semester}`}>
                  {subject.semester === 'both' ? 'Both Semesters' : 
                   subject.semester === 'first' ? 'First Semester' : 'Second Semester'}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="overview-card">
          <h3>Description</h3>
          <p className="description-text">{subject.description}</p>
        </div>
      </div>

      {/* Prerequisites and Corequisites */}
      <div className="requirements-section">
        <div className="requirement-card">
          <h3>Prerequisites</h3>
          {subject.prerequisite === 'none' ? (
            <div className="requirement-item no-requirement">
              <span className="none-label">None</span>
              <p>This subject has no prerequisites and can be taken independently.</p>
            </div>
          ) : (
            <div className="requirement-item">
              <span className="requirement-label">Required Before Taking This Subject:</span>
              <div className="requirement-list">
                {subject.prerequisite.split(',').map((prereq, idx) => (
                  <div key={idx} className="requirement-badge prerequisite-badge">
                    {prereq.trim()}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="requirement-card">
          <h3>Co-requisites</h3>
          {subject.corequisite === 'none' ? (
            <div className="requirement-item no-requirement">
              <span className="none-label">None</span>
              <p>No co-requisite subjects are required.</p>
            </div>
          ) : (
            <div className="requirement-item">
              <span className="requirement-label">Can Be Taken With:</span>
              <div className="requirement-list">
                {subject.corequisite.split(',').map((coreq, idx) => (
                  <div key={idx} className="requirement-badge corequisite-badge">
                    {coreq.trim()}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Programs Offering This Subject */}
      <div className="programs-section">
        <h2>Offered in These Programs</h2>
        {programsOffering.length > 0 ? (
          <div className="programs-list">
            {programsOffering.map(program => (
              <div key={program.id} className="program-item">
                <div className="program-info">
                  <h4>{program.name}</h4>
                  <p className="program-code">{program.code}</p>
                  <span className={`status-badge status-${program.status}`}>
                    {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                  </span>
                </div>
                <button 
                  className="view-program-btn"
                  onClick={() => onNavigate('program-detail', program.id)}
                >
                  View Program →
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-programs">This subject is not currently offered in any program.</p>
        )}
      </div>

      {/* Subject Statistics */}
      <div className="subject-stats">
        <h2>Subject Details</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Credits/Units:</span>
            <span className="stat-value">{subject.units}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Offered In:</span>
            <span className="stat-value">{programsOffering.length} program(s)</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Has Prerequisites:</span>
            <span className="stat-value">{subject.prerequisite === 'none' ? 'No' : 'Yes'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Semester Type:</span>
            <span className="stat-value">
              {subject.semester === 'both' ? 'Both Semesters' : 
               subject.semester === 'first' ? '1st Semester' : '2nd Semester'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="subject-actions">
        <button 
          className="action-btn edit-btn"
          onClick={() => alert('Edit feature coming soon!')}
        >
          Edit Subject
        </button>
        <button 
          className="action-btn print-btn"
          onClick={() => window.print()}
        >
          Print Details
        </button>
        <button 
          className="action-btn back-btn-secondary"
          onClick={() => onNavigate('dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SubjectDetails;
