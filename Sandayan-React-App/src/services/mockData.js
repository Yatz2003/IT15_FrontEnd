// Mock data for Programs and Subjects

export const programsData = [
  {
    id: 1,
    code: 'BSIT',
    name: 'Bachelor of Science in Information Technology',
    type: 'Bachelor\'s Degree',
    duration: '4 years',
    totalUnits: 124,
    status: 'active',
    description: 'Comprehensive program covering software development, database management, and IT systems.',
    yearLevels: [
      { year: 1, subjects: [1, 2, 3, 4] },
      { year: 2, subjects: [5, 6, 7, 8] },
      { year: 3, subjects: [9, 10, 11, 12] },
      { year: 4, subjects: [13, 14, 15, 16] }
    ]
  },
  {
    id: 2,
    code: 'BSCS',
    name: 'Bachelor of Science in Computer Science',
    type: 'Bachelor\'s Degree',
    duration: '4 years',
    totalUnits: 120,
    status: 'active',
    description: 'Advanced program in computer science with focus on algorithms, theory, and artificial intelligence.',
    yearLevels: [
      { year: 1, subjects: [1, 2, 17, 18] },
      { year: 2, subjects: [19, 20, 21, 22] },
      { year: 3, subjects: [23, 24, 25, 26] },
      { year: 4, subjects: [27, 28, 29, 30] }
    ]
  },
  {
    id: 3,
    code: 'DIPLOMA-IT',
    name: 'Diploma in Information Technology',
    type: 'Diploma',
    duration: '2 years',
    totalUnits: 64,
    status: 'active',
    description: 'Short-term program focusing on practical IT skills and industry-ready competencies.',
    yearLevels: [
      { year: 1, subjects: [1, 2, 3, 31] },
      { year: 2, subjects: [5, 6, 32, 33] }
    ]
  },
  {
    id: 4,
    code: 'BSCS-EXTENDED',
    name: 'Bachelor of Science in Computer Science (Extended)',
    type: 'Bachelor\'s Degree',
    duration: '4 years',
    totalUnits: 140,
    status: 'under review',
    description: 'Extended computer science program with additional electives and specializations.',
    yearLevels: [
      { year: 1, subjects: [1, 2, 17, 34] },
      { year: 2, subjects: [19, 20, 21, 35] },
      { year: 3, subjects: [23, 24, 36, 37] },
      { year: 4, subjects: [27, 28, 38, 39] }
    ]
  },
  {
    id: 5,
    code: 'BSCOE',
    name: 'Bachelor of Science in Computer Engineering',
    type: 'Bachelor\'s Degree',
    duration: '4 years',
    totalUnits: 128,
    status: 'phased out',
    description: 'Integrated program combining computer science and electrical engineering principles.',
    yearLevels: [
      { year: 1, subjects: [1, 2, 40, 41] },
      { year: 2, subjects: [5, 42, 43, 44] },
      { year: 3, subjects: [9, 45, 46, 47] },
      { year: 4, subjects: [13, 48, 49, 50] }
    ]
  }
];

export const subjectsData = [
  { id: 1, code: 'IT101', title: 'Introduction to Programming', units: 3, semester: 'both', prerequisite: 'none', corequisite: 'none', description: 'Fundamentals of programming including variables, control structures, and functions.', programs: [1, 2, 3] },
  { id: 2, code: 'IT102', title: 'Web Development Basics', units: 3, semester: 'first', prerequisite: 'IT101', corequisite: 'none', description: 'Introduction to HTML, CSS, and JavaScript for web development.', programs: [1, 2, 3] },
  { id: 3, code: 'IT103', title: 'Database Design I', units: 4, semester: 'first', prerequisite: 'IT101', corequisite: 'none', description: 'Fundamentals of relational databases and SQL.', programs: [1, 2, 3] },
  { id: 4, code: 'IT104', title: 'Computer Systems', units: 4, semester: 'second', prerequisite: 'none', corequisite: 'none', description: 'Hardware components, operating systems, and system architecture.', programs: [1, 3] },
  { id: 5, code: 'IT201', title: 'Object-Oriented Programming', units: 4, semester: 'first', prerequisite: 'IT101', corequisite: 'none', description: 'Advanced programming with classes, inheritance, and polymorphism.', programs: [1, 2] },
  { id: 6, code: 'IT202', title: 'Web Development Advanced', units: 3, semester: 'second', prerequisite: 'IT102', corequisite: 'none', description: 'Advanced web development with frameworks and responsive design.', programs: [1, 2] },
  { id: 7, code: 'IT203', title: 'Database Design II', units: 4, semester: 'first', prerequisite: 'IT103', corequisite: 'none', description: 'Advanced database concepts including normalization and optimization.', programs: [1, 2] },
  { id: 8, code: 'IT204', title: 'Systems Administration', units: 3, semester: 'second', prerequisite: 'IT104', corequisite: 'none', description: 'Network administration and server management fundamentals.', programs: [1] },
  { id: 9, code: 'IT301', title: 'Software Engineering', units: 4, semester: 'first', prerequisite: 'IT201, IT203', corequisite: 'none', description: 'Software development lifecycle, design patterns, and project management.', programs: [1, 2] },
  { id: 10, code: 'IT302', title: 'Mobile Development', units: 4, semester: 'second', prerequisite: 'IT202', corequisite: 'none', description: 'Cross-platform mobile application development.', programs: [1, 2] },
  { id: 11, code: 'IT303', title: 'Data Analytics', units: 3, semester: 'first', prerequisite: 'IT103, IT201', corequisite: 'none', description: 'Data analysis techniques, visualization, and business intelligence.', programs: [1, 2] },
  { id: 12, code: 'IT304', title: 'Cybersecurity Fundamentals', units: 3, semester: 'second', prerequisite: 'IT104', corequisite: 'none', description: 'Security principles, encryption, and threat management.', programs: [1, 2] },
  { id: 13, code: 'IT401', title: 'Capstone Project I', units: 3, semester: 'first', prerequisite: 'IT301', corequisite: 'none', description: 'Final year project planning and initial development.', programs: [1, 2] },
  { id: 14, code: 'IT402', title: 'Capstone Project II', units: 3, semester: 'second', prerequisite: 'IT401', corequisite: 'none', description: 'Continuation and completion of final year project.', programs: [1, 2] },
  { id: 15, code: 'IT403', title: 'Professional Practice', units: 2, semester: 'both', prerequisite: 'none', corequisite: 'none', description: 'Ethics, professional development, and industry standards.', programs: [1, 2] },
  { id: 16, code: 'IT404', title: 'Elective - Emerging Technologies', units: 3, semester: 'first', prerequisite: 'none', corequisite: 'none', description: 'Study of cutting-edge technologies and innovations.', programs: [1, 2] },
  { id: 17, code: 'CS101', title: 'Discrete Mathematics', units: 4, semester: 'first', prerequisite: 'none', corequisite: 'none', description: 'Mathematical foundations for computer science.', programs: [2, 4] },
  { id: 18, code: 'CS102', title: 'Data Structures', units: 4, semester: 'second', prerequisite: 'IT101', corequisite: 'none', description: 'Arrays, linked lists, trees, graphs, and algorithms.', programs: [2, 4] },
  { id: 19, code: 'CS201', title: 'Algorithms', units: 4, semester: 'first', prerequisite: 'CS102', corequisite: 'none', description: 'Algorithm analysis, complexity, and design techniques.', programs: [2, 4] },
  { id: 20, code: 'CS202', title: 'Artificial Intelligence', units: 3, semester: 'second', prerequisite: 'CS201', corequisite: 'none', description: 'AI concepts, machine learning, and neural networks.', programs: [2, 4] },
  { id: 21, code: 'CS203', title: 'Compiler Design', units: 4, semester: 'first', prerequisite: 'CS102', corequisite: 'none', description: 'Language design, parsing, and code generation.', programs: [2, 4] },
  { id: 22, code: 'CS204', title: 'Operating Systems', units: 4, semester: 'second', prerequisite: 'IT104', corequisite: 'none', description: 'Process management, memory, and file systems.', programs: [2, 4] },
  { id: 23, code: 'CS301', title: 'Advanced Algorithms', units: 4, semester: 'first', prerequisite: 'CS201', corequisite: 'none', description: 'Complex algorithm design and optimization techniques.', programs: [2, 4] },
  { id: 24, code: 'CS302', title: 'Machine Learning', units: 3, semester: 'second', prerequisite: 'CS202', corequisite: 'none', description: 'Supervised and unsupervised learning algorithms.', programs: [2, 4] },
  { id: 25, code: 'CS303', title: 'Natural Language Processing', units: 3, semester: 'first', prerequisite: 'CS202, CS301', corequisite: 'none', description: 'Text processing, language models, and computational linguistics.', programs: [2, 4] },
  { id: 26, code: 'CS304', title: 'Computer Vision', units: 3, semester: 'second', prerequisite: 'CS202', corequisite: 'none', description: 'Image processing, object detection, and computer vision algorithms.', programs: [2, 4] },
  { id: 27, code: 'CS401', title: 'Research Methods', units: 3, semester: 'first', prerequisite: 'none', corequisite: 'none', description: 'Scientific research methodologies and academic writing.', programs: [2, 4] },
  { id: 28, code: 'CS402', title: 'Thesis/Capstone', units: 6, semester: 'both', prerequisite: 'CS401', corequisite: 'none', description: 'Independent research project or capstone development.', programs: [2, 4] },
  { id: 29, code: 'CS403', title: 'Advanced AI', units: 3, semester: 'first', prerequisite: 'CS303, CS304', corequisite: 'none', description: 'Deep learning, reinforcement learning, and advanced applications.', programs: [2, 4] },
  { id: 30, code: 'CS404', title: 'Elective - Specialization', units: 3, semester: 'second', prerequisite: 'none', corequisite: 'none', description: 'Advanced topics in specialized areas of computer science.', programs: [2, 4] },
  { id: 31, code: 'DIP201', title: 'IT Support and Troubleshooting', units: 3, semester: 'both', prerequisite: 'IT104', corequisite: 'none', description: 'Practical IT support and customer service skills.', programs: [3] },
  { id: 32, code: 'DIP202', title: 'Network Basics', units: 3, semester: 'first', prerequisite: 'IT104', corequisite: 'none', description: 'Networking fundamentals and practical configuration.', programs: [3] },
  { id: 33, code: 'DIP203', title: 'Practical Project', units: 4, semester: 'second', prerequisite: 'IT201, DIP202', corequisite: 'none', description: 'Real-world IT project application and portfolio building.', programs: [3] },
  { id: 34, code: 'CSE101', title: 'Digital Logic', units: 4, semester: 'first', prerequisite: 'none', corequisite: 'none', description: 'Boolean algebra, logic gates, and digital circuits.', programs: [4, 5] },
  { id: 35, code: 'CSE102', title: 'Electronics', units: 4, semester: 'second', prerequisite: 'CSE101', corequisite: 'none', description: 'Analog and digital electronics fundamentals.', programs: [4, 5] },
  { id: 36, code: 'CSE201', title: 'Microprocessors', units: 4, semester: 'first', prerequisite: 'CSE102', corequisite: 'none', description: 'Microprocessor architecture and assembly language.', programs: [4, 5] },
  { id: 37, code: 'CSE202', title: 'Embedded Systems', units: 4, semester: 'second', prerequisite: 'CSE201', corequisite: 'none', description: 'Embedded system design and real-time programming.', programs: [4, 5] },
  { id: 38, code: 'CSE301', title: 'VLSI Design', units: 4, semester: 'first', prerequisite: 'CSE202', corequisite: 'none', description: 'Very Large Scale Integration circuit design.', programs: [4, 5] },
  { id: 39, code: 'CSE302', title: 'Advanced Embedded Systems', units: 3, semester: 'second', prerequisite: 'CSE202', corequisite: 'none', description: 'Advanced topics in embedded systems and IoT.', programs: [4, 5] },
  { id: 40, code: 'ENG101', title: 'Electrical Fundamentals', units: 4, semester: 'first', prerequisite: 'none', corequisite: 'none', description: 'Electrical circuits, Ohm\'s law, and circuit analysis.', programs: [5] },
  { id: 41, code: 'ENG102', title: 'Signals and Systems', units: 4, semester: 'second', prerequisite: 'ENG101', corequisite: 'none', description: 'Signal processing and systems theory.', programs: [5] },
  { id: 42, code: 'ENG201', title: 'Power Systems', units: 3, semester: 'first', prerequisite: 'ENG102', corequisite: 'none', description: 'Power generation, distribution, and management.', programs: [5] },
  { id: 43, code: 'ENG202', title: 'Control Systems', units: 4, semester: 'second', prerequisite: 'ENG102', corequisite: 'none', description: 'Control theory and system design.', programs: [5] },
  { id: 44, code: 'ENG203', title: 'Digital Systems', units: 4, semester: 'first', prerequisite: 'CSE101', corequisite: 'none', description: 'Digital design and FPGA programming.', programs: [5] },
  { id: 45, code: 'ENG301', title: 'Communication Systems', units: 4, semester: 'first', prerequisite: 'ENG102', corequisite: 'none', description: 'Communication theory, modulation, and transmission.', programs: [5] },
  { id: 46, code: 'ENG302', title: 'RF and Microwave Engineering', units: 4, semester: 'second', prerequisite: 'ENG102', corequisite: 'none', description: 'Radio frequency and microwave circuit design.', programs: [5] },
  { id: 47, code: 'ENG303', title: 'Power Electronics', units: 4, semester: 'first', prerequisite: 'ENG102', corequisite: 'none', description: 'Power conversion and power electronic device applications.', programs: [5] },
  { id: 48, code: 'ENG401', title: 'Senior Design Project', units: 4, semester: 'both', prerequisite: 'ENG301, ENG302, ENG303', corequisite: 'none', description: 'Capstone engineering design project.', programs: [5] },
  { id: 49, code: 'ENG402', title: 'Professional Practice', units: 2, semester: 'both', prerequisite: 'none', corequisite: 'none', description: 'Professional development and engineering ethics.', programs: [5] },
  { id: 50, code: 'ENG403', title: 'Elective - Advanced Topics', units: 3, semester: 'first', prerequisite: 'none', corequisite: 'none', description: 'Advanced topics in electrical and computer engineering.', programs: [5] }
];

export const getSubjectById = (id) => subjectsData.find(s => s.id === id);
export const getSubjectsByProgram = (programId) => subjectsData.filter(s => s.programs.includes(programId));
export const getProgramById = (id) => programsData.find(p => p.id === id);

export const getSubjectsByYear = (programId, year) => {
  const program = getProgramById(programId);
  if (!program) return [];
  const yearLevel = program.yearLevels.find(yl => yl.year === year);
  if (!yearLevel) return [];
  return yearLevel.subjects.map(subjectId => getSubjectById(subjectId));
};

export const getRecentlyAdded = (type = 'all') => {
  if (type === 'programs') {
    return programsData.slice(-3).reverse();
  }
  if (type === 'subjects') {
    return subjectsData.slice(-3).reverse();
  }
  return {
    programs: programsData.slice(-3).reverse(),
    subjects: subjectsData.slice(-3).reverse()
  };
};
