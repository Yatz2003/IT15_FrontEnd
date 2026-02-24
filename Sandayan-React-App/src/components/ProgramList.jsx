import React, { useState } from 'react';
import '../styles/ProgramList.css';

const ProgramCard = ({ program, onClick }) => {
  return (
    <div className="program-card" onClick={onClick}>
      <div className="program-card-header">
        <div className="program-code">{program.code}</div>
        <div className={`program-status status-${program.status}`}>
          {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
        </div>
      </div>
      
      <div className="program-card-body">
        <h3 className="program-name">{program.name}</h3>
        <p className="program-type">{program.type}</p>
        
        <div className="program-details">
          <div className="detail-item">
            <span className="detail-label">Duration:</span>
            <span className="detail-value">{program.duration}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Units:</span>
            <span className="detail-value">{program.totalUnits}</span>
          </div>
        </div>
      </div>
      
      <div className="program-card-footer">
        <button className="view-details-btn">View Details →</button>
      </div>
    </div>
  );
};

const ProgramList = ({ programs = [], onProgramClick, onNavigate }) => {
  const [filteredPrograms, setFilteredPrograms] = useState(programs);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or table

  // Get unique types
  const programTypes = [...new Set(programs.map(p => p.type))];
  const programStatuses = ['active', 'under review', 'phased out'];

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterPrograms(term, statusFilter, typeFilter);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    filterPrograms(searchTerm, status, typeFilter);
  };

  const handleTypeFilter = (type) => {
    setTypeFilter(type);
    filterPrograms(searchTerm, statusFilter, type);
  };

  const filterPrograms = (search, status, type) => {
    let filtered = programs;

    if (search) {
      filtered = filtered.filter(p => 
        p.code.toLowerCase().includes(search) || 
        p.name.toLowerCase().includes(search)
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter(p => p.status === status);
    }

    if (type !== 'all') {
      filtered = filtered.filter(p => p.type === type);
    }

    setFilteredPrograms(filtered);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setFilteredPrograms(programs);
  };

  return (
    <div className="program-list-container">
      <div className="program-list-header">
        <div>
          <h1>Program Offerings</h1>
          <p className="subtitle">Browse and manage academic programs</p>
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
            placeholder="Search by program code or name..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label>Status:</label>
            <div className="filter-options">
              <button
                className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleStatusFilter('all')}
              >
                All
              </button>
              {programStatuses.map(status => (
                <button
                  key={status}
                  className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
                  onClick={() => handleStatusFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Type:</label>
            <div className="filter-options">
              <button
                className={`filter-btn ${typeFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleTypeFilter('all')}
              >
                All
              </button>
              {programTypes.map(type => (
                <button
                  key={type}
                  className={`filter-btn ${typeFilter === type ? 'active' : ''}`}
                  onClick={() => handleTypeFilter(type)}
                >
                  {type}
                </button>
              ))}
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
        <p>Showing <strong>{filteredPrograms.length}</strong> of <strong>{programs.length}</strong> programs</p>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="programs-grid">
          {filteredPrograms.length > 0 ? (
            filteredPrograms.map(program => (
              <ProgramCard
                key={program.id}
                program={program}
                onClick={() => onProgramClick(program.id)}
              />
            ))
          ) : (
            <div className="no-results">
              <p>No programs found matching your filters.</p>
            </div>
          )}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="programs-table-container">
          {filteredPrograms.length > 0 ? (
            <table className="programs-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Program Name</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Units</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrograms.map(program => (
                  <tr key={program.id}>
                    <td><strong>{program.code}</strong></td>
                    <td>{program.name}</td>
                    <td>{program.type}</td>
                    <td>{program.duration}</td>
                    <td>{program.totalUnits}</td>
                    <td>
                      <span className={`status-badge status-${program.status}`}>
                        {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => onProgramClick(program.id)}
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
              <p>No programs found matching your filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgramList;
