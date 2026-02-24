import React, { useState } from 'react';
import { subjectsData } from '../services/mockData';
import '../styles/SubjectList.css';

const SubjectCard = ({ subject, onClick }) => {
  const hasPrerequisite = subject.prerequisite !== 'none';
  
  return (
    <div className="subject-card" onClick={onClick}>
      <div className="subject-card-header">
        <div className="subject-code">{subject.code}</div>
        <div className={`semester-badge semester-${subject.semester}`}>
          {subject.semester === 'both' ? '1st & 2nd' : 
           subject.semester === 'first' ? '1st Sem' : '2nd Sem'}
        </div>
      </div>
      
      <div className="subject-card-body">
        <h3 className="subject-title">{subject.title}</h3>
        <p className="subject-description">{subject.description.substring(0, 80)}...</p>
        
        <div className="subject-details">
          <div className="detail-item">
            <span className="detail-label">Units:</span>
            <span className="detail-value">{subject.units}</span>
          </div>
          {hasPrerequisite && (
            <div className="detail-item">
              <span className="detail-label">Has Prerequisites</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="subject-card-footer">
        <button className="view-details-btn">View Details →</button>
      </div>
    </div>
  );
};

const SubjectList = ({ subjects = subjectsData, onSubjectClick, onNavigate }) => {
  const [filteredSubjects, setFilteredSubjects] = useState(subjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [unitsFilter, setUnitsFilter] = useState('all');
  const [prereqFilter, setPrereqFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterSubjects(term, semesterFilter, unitsFilter, prereqFilter);
  };

  const handleSemesterFilter = (semester) => {
    setSemesterFilter(semester);
    filterSubjects(searchTerm, semester, unitsFilter, prereqFilter);
  };

  const handleUnitsFilter = (units) => {
    setUnitsFilter(units);
    filterSubjects(searchTerm, semesterFilter, units, prereqFilter);
  };

  const handlePrereqFilter = (prereq) => {
    setPrereqFilter(prereq);
    filterSubjects(searchTerm, semesterFilter, unitsFilter, prereq);
  };

  const filterSubjects = (search, semester, units, prereq) => {
    let filtered = subjects;

    if (search) {
      filtered = filtered.filter(s => 
        s.code.toLowerCase().includes(search) || 
        s.title.toLowerCase().includes(search)
      );
    }

    if (semester !== 'all') {
      filtered = filtered.filter(s => 
        s.semester === semester || s.semester === 'both'
      );
    }

    if (units !== 'all') {
      const numUnits = parseInt(units);
      filtered = filtered.filter(s => s.units === numUnits);
    }

    if (prereq === 'with') {
      filtered = filtered.filter(s => s.prerequisite !== 'none');
    } else if (prereq === 'without') {
      filtered = filtered.filter(s => s.prerequisite === 'none');
    }

    setFilteredSubjects(filtered);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSemesterFilter('all');
    setUnitsFilter('all');
    setPrereqFilter('all');
    setFilteredSubjects(subjects);
  };

  const uniqueUnits = [...new Set(subjects.map(s => s.units))].sort((a, b) => a - b);

  return (
    <div className="subject-list-container">
      <div className="subject-list-header">
        <div>
          <h1>Subject Offerings</h1>
          <p className="subtitle">Browse all available subjects and courses</p>
        </div>
        <button 
          className="back-btn"
          onClick={() => onNavigate('dashboard')}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="filter-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by subject code or title..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label>Semester:</label>
            <div className="filter-options">
              <button
                className={`filter-btn ${semesterFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleSemesterFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-btn ${semesterFilter === 'first' ? 'active' : ''}`}
                onClick={() => handleSemesterFilter('first')}
              >
                1st Sem
              </button>
              <button
                className={`filter-btn ${semesterFilter === 'second' ? 'active' : ''}`}
                onClick={() => handleSemesterFilter('second')}
              >
                2nd Sem
              </button>
            </div>
          </div>

          <div className="filter-group">
            <label>Units:</label>
            <div className="filter-options">
              <button
                className={`filter-btn ${unitsFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleUnitsFilter('all')}
              >
                All
              </button>
              {uniqueUnits.map(unit => (
                <button
                  key={unit}
                  className={`filter-btn ${unitsFilter === String(unit) ? 'active' : ''}`}
                  onClick={() => handleUnitsFilter(String(unit))}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Prerequisites:</label>
            <div className="filter-options">
              <button
                className={`filter-btn ${prereqFilter === 'all' ? 'active' : ''}`}
                onClick={() => handlePrereqFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-btn ${prereqFilter === 'with' ? 'active' : ''}`}
                onClick={() => handlePrereqFilter('with')}
              >
                With Prerequisites
              </button>
              <button
                className={`filter-btn ${prereqFilter === 'without' ? 'active' : ''}`}
                onClick={() => handlePrereqFilter('without')}
              >
                No Prerequisites
              </button>
            </div>
          </div>

          <button className="reset-btn" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>

        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            ⊞ Grid
          </button>
          <button
            className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Table View"
          >
            ≡ Table
          </button>
        </div>
      </div>

      {/* Results Info */}
      <div className="results-info">
        <p>Showing <strong>{filteredSubjects.length}</strong> of <strong>{subjects.length}</strong> subjects</p>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="subjects-grid">
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map(subject => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onClick={() => onSubjectClick(subject.id)}
              />
            ))
          ) : (
            <div className="no-results">
              <p>No subjects found matching your filters.</p>
            </div>
          )}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="subjects-table-container">
          {filteredSubjects.length > 0 ? (
            <table className="subjects-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Title</th>
                  <th>Units</th>
                  <th>Semester</th>
                  <th>Prerequisites</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.map(subject => (
                  <tr key={subject.id}>
                    <td><strong>{subject.code}</strong></td>
                    <td>{subject.title}</td>
                    <td className="center">{subject.units}</td>
                    <td className="center">
                      <span className={`semester-badge semester-${subject.semester}`}>
                        {subject.semester === 'both' ? '1st & 2nd' : 
                         subject.semester === 'first' ? '1st' : '2nd'}
                      </span>
                    </td>
                    <td>
                      {subject.prerequisite === 'none' ? (
                        <span className="none-text">None</span>
                      ) : (
                        <span className="prereq-text">{subject.prerequisite}</span>
                      )}
                    </td>
                    <td className="description-col">{subject.description}</td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => onSubjectClick(subject.id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-results">
              <p>No subjects found matching your filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubjectList;
