import React from 'react';
import { getProgramById, getSubjectsByYear } from '../services/mockData';
import '../styles/ProgramDetails.css';

const ProgramDetails = ({ programId, onNavigate }) => {
  const program = getProgramById(programId);

  if (!program) {
    return (
      <div className="program-details-container">
        <p>Program not found.</p>
        <button onClick={() => onNavigate('programs')}>Back to Programs</button>
      </div>
    );
  }

  return (
    <div className="program-details-container">
      <div className="details-header">
        <button 
          className="back-btn"
          onClick={() => onNavigate('programs')}
        >
          ← Back to Programs
        </button>
        <h1>{program.name}</h1>
      </div>

      {/* Program Overview */}
      <div className="program-overview">
        <div className="overview-card">
          <h3>Program Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Code:</label>
              <p>{program.code}</p>
            </div>
            <div className="info-item">
              <label>Duration:</label>
              <p>{program.duration}</p>
            </div>
            <div className="info-item">
              <label>Total Units Required:</label>
              <p>{program.totalUnits}</p>
            </div>
            <div className="info-item">
              <label>Status:</label>
              <p className={`status-badge status-${program.status}`}>
                {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
              </p>
            </div>
            <div className="info-item full-width">
              <label>Program Type:</label>
              <p>{program.type}</p>
            </div>
          </div>
        </div>

        <div className="overview-card">
          <h3>Description</h3>
          <p className="description-text">{program.description}</p>
        </div>
      </div>

      {/* Year Levels and Subjects */}
      <div className="year-levels">
        <h2>Curriculum by Year Level</h2>
        
        {program.yearLevels.map((yearLevel) => {
          const subjects = getSubjectsByYear(program.id, yearLevel.year);
          const totalYearUnits = subjects.reduce((sum, subject) => sum + subject.units, 0);

          return (
            <div key={yearLevel.year} className="year-level-section">
              <div className="year-level-header">
                <h3>Year {yearLevel.year}</h3>
                <div className="year-stats">
                  <span className="stat">{subjects.length} subjects</span>
                  <span className="stat">{totalYearUnits} units</span>
                </div>
              </div>

              <div className="subjects-list">
                {subjects.length > 0 ? (
                  <div className="subjects-table">
                    <div className="subjects-header">
                      <div className="col-code">Code</div>
                      <div className="col-title">Subject Title</div>
                      <div className="col-units">Units</div>
                      <div className="col-semester">Semester</div>
                      <div className="col-prereq">Prerequisites</div>
                    </div>
                    {subjects.map(subject => (
                      <div key={subject.id} className="subject-row">
                        <div className="col-code">
                          <strong>{subject.code}</strong>
                        </div>
                        <div className="col-title">
                          <p>{subject.title}</p>
                        </div>
                        <div className="col-units">
                          <span className="units-badge">{subject.units}</span>
                        </div>
                        <div className="col-semester">
                          <span className={`semester-badge semester-${subject.semester}`}>
                            {subject.semester === 'both' ? 'Both' : 
                             subject.semester === 'first' ? '1st' : '2nd'}
                          </span>
                        </div>
                        <div className="col-prereq">
                          {subject.prerequisite === 'none' ? (
                            <span className="none-text">None</span>
                          ) : (
                            <span className="prereq-text">{subject.prerequisite}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-subjects">No subjects assigned to this year level.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Statistics */}
      <div className="program-stats">
        <h2>Program Statistics</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Year Levels:</span>
            <span className="stat-value">{program.yearLevels.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Required Units:</span>
            <span className="stat-value">{program.totalUnits}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Subject Count:</span>
            <span className="stat-value">
              {program.yearLevels.reduce((sum, yl) => sum + yl.subjects.length, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="program-actions">
        <button 
          className="action-btn edit-btn"
          onClick={() => alert('Edit feature coming soon!')}
        >
          Edit Program
        </button>
        <button 
          className="action-btn print-btn"
          onClick={() => window.print()}
        >
          Print Curriculum
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

export default ProgramDetails;
