// MongoDB initialization script - runs on first container startup
db = db.getSiblingDB('neurolab');

// Create app user
db.createUser({
  user: 'neurolab_app',
    pwd: process.env.MONGO_APP_PASSWORD || 'neurolab_app_CHANGEME',
  roles: [{ role: 'readWrite', db: 'neurolab' }],
});

// Create collections
db.createCollection('metrics');
db.createCollection('publications');
db.createCollection('team');
db.createCollection('contacts');

// Seed metrics
db.metrics.insertMany([
  { label: 'EEG Subjects Processed', value: 1247, unit: 'subjects', category: 'pipeline', trend: '+12%', updatedAt: new Date() },
  { label: 'Sleep Spindles Detected', value: 98432, unit: 'events', category: 'pipeline', trend: '+8%', updatedAt: new Date() },
  { label: 'TDA Features Extracted', value: 3891, unit: 'features', category: 'model', trend: '+15%', updatedAt: new Date() },
  { label: 'Model Accuracy', value: 94.7, unit: '%', category: 'model', trend: '+2.3%', updatedAt: new Date() },
  { label: 'Nights of EEG Data', value: 4102, unit: 'nights', category: 'data', trend: '+23%', updatedAt: new Date() },
  { label: 'Publications', value: 12, unit: 'papers', category: 'research', trend: '+3', updatedAt: new Date() },
]);

// Seed publications
db.publications.insertMany([
  {
    title: 'Persistent Homology of Sleep EEG Reveals Memory Consolidation Signatures',
    authors: ['Wang Y.', 'Chen L.', 'Mueller T.'],
    journal: 'Nature Neuroscience',
    year: 2024,
    doi: '10.1038/s41593-024-00001-0',
    abstract: 'Topological data analysis of overnight PSG recordings to identify homological features correlating with declarative memory consolidation during slow-wave sleep.',
    tags: ['TDA', 'sleep spindles', 'memory', 'persistent homology'],
    featured: true,
    createdAt: new Date(),
  },
  {
    title: 'Phase-Amplitude Coupling During NREM Sleep: A Medallion Architecture Pipeline',
    authors: ['Wang Y.', 'Schmidt K.', 'Benedetti F.'],
    journal: 'Journal of Neuroscience Methods',
    year: 2024,
    doi: '10.1016/j.jneumeth.2024.00001',
    abstract: 'Scalable Bronze-Silver-Gold Delta Lake pipeline for multi-site EEG with automated spindle detection and cross-frequency coupling analysis.',
    tags: ['pipeline', 'PAC', 'Delta Lake', 'EEG'],
    featured: true,
    createdAt: new Date(),
  },
  {
    title: 'Slow Oscillation-Spindle Coupling Predicts Overnight Memory Retention',
    authors: ['Chen L.', 'Wang Y.', 'Stickgold R.'],
    journal: 'Sleep',
    year: 2023,
    doi: '10.1093/sleep/zsad001',
    abstract: 'Timing of sleep spindles nested in slow oscillation up-states predicts next-day retention of declarative memories across healthy adults.',
    tags: ['slow oscillations', 'coupling', 'memory', 'NREM'],
    featured: false,
    createdAt: new Date(),
  },
]);

// Seed team
db.team.insertMany([
  {
    name: 'Yuhao Wang',
    role: 'Principal Investigator',
    affiliation: 'NeuroLab, Synaping Institute',
    bio: 'Computational neuroscientist specializing in TDA of sleep EEG, Databricks lakehouse architectures, and ML for personalized medicine.',
    expertise: ['Topological Data Analysis', 'Sleep EEG', 'Databricks', 'Python', 'Azure'],
    email: 'y.wang@synaping.com',
    github: 'wang-yuhao',
    order: 1,
    createdAt: new Date(),
  },
]);

// Create indexes
db.metrics.createIndex({ category: 1 });
db.publications.createIndex({ year: -1 });
db.publications.createIndex({ featured: 1 });
db.publications.createIndex({ tags: 1 });
db.team.createIndex({ order: 1 });
db.contacts.createIndex({ createdAt: -1 });

print('NeuroLab MongoDB initialization complete.');
