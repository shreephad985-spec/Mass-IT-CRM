require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Allow React to talk to this server
app.use(cors());
app.use(express.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'mass_it_solutions'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL successfully!');
});

// The API Route React is looking for
app.get('/api/enquiries', (req, res) => {
  db.query('SELECT * FROM enquiries', (err, results) => {
    if (err) {
      res.status(500).send('Error getting data');
    } else {
      res.json(results);
    }
  });
});
// The API Route to SAVE new enquiries
app.post('/api/enquiries', (req, res) => {
  const newEnquiry = req.body;

  // Insert the new data into MySQL
  const sql = `INSERT INTO enquiries (id, name, contact, email, course, source, enquiry_date, enquiry_time, status, assigned_to) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    newEnquiry.id, newEnquiry.name, newEnquiry.contact, newEnquiry.email,
    newEnquiry.course, newEnquiry.source, newEnquiry.enquiry_date,
    newEnquiry.enquiry_time, newEnquiry.status, newEnquiry.assigned_to
  ];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error saving data:', err);
      res.status(500).send('Error saving data');
    } else {
      res.json({ message: 'Enquiry added successfully!', id: newEnquiry.id });
    }
  });
});
// The API Route to DELETE an enquiry
app.delete('/api/enquiries/:id', (req, res) => {
  const enquiryId = req.params.id;

  const sql = 'DELETE FROM enquiries WHERE id = ?';

  db.query(sql, [enquiryId], (err, result) => {
    if (err) {
      console.error('Error deleting data:', err);
      res.status(500).send('Error deleting data');
    } else {
      res.json({ message: 'Enquiry deleted successfully!' });
    }
  });
});
// The API Route to UPDATE (Edit) an enquiry
app.put('/api/enquiries/:id', (req, res) => {
  const enquiryId = req.params.id;
  const updatedData = req.body;

  // We tell MySQL to UPDATE the specific row that matches the ID
  const sql = `UPDATE enquiries 
               SET name=?, contact=?, email=?, course=?, source=?, status=?, assigned_to=? 
               WHERE id=?`;

  const values = [
    updatedData.name, updatedData.contact, updatedData.email,
    updatedData.course, updatedData.source, updatedData.status,
    updatedData.assigned_to, enquiryId
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating data:', err);
      res.status(500).send('Error updating data');
    } else {
      res.json({ message: 'Enquiry updated successfully!' });
    }
  });
});
// The API Route to SAVE a new student
app.post('/api/students', (req, res) => {
  const student = req.body;

  const sql = `INSERT INTO students (
    full_name, dob, gender, mobile, email, alternate_mobile, address, 
    city, state, pincode, qualification, stream, passing_year, percentage, 
    course, batch, course_mode, expected_start_date, password
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    student.fullName, student.dob, student.gender, student.mobile, student.email,
    student.alternateMobile, student.address, student.city, student.state, student.pincode,
    student.qualification, student.stream, student.passingYear, student.percentage,
    student.course, student.batch, student.courseMode, student.expectedStartDate, student.password
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error saving student:', err);
      res.status(500).send('Error saving student');
    } else {
      res.json({ message: 'Student registered successfully!' });
    }
  });
});
// ==========================================
// REPORTS & DASHBOARD MYSQL ROUTES
// ==========================================

// 1. Get all Enquiries (Used for Enquiry Table and Reports Math)
app.get('/api/enquiries', (req, res) => {
  const sql = "SELECT * FROM enquiries";

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching enquiries from MySQL:', err);
      return res.status(500).send('Database error');
    }
    res.json(results);
  });
});

// 2. Get all Students (Used for Reports Math and Student Tables)
app.get('/api/students', (req, res) => {
  const sql = "SELECT * FROM students";

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching students from MySQL:', err);
      return res.status(500).send('Database error');
    }
    res.json(results);
  });
});

// GET /api/reports/summary
app.get('/api/reports/summary', async (req, res) => {
  const [enquiries] = await db.query('SELECT COUNT(*) as count FROM enquiries');
  const [students] = await db.query('SELECT COUNT(*) as count FROM students');
  const [revenue] = await db.query('SELECT SUM(amount) as total FROM payments');

  res.json({
    totalEnquiries: enquiries[0].count,
    totalStudents: students[0].count,
    totalCourses: 24,
    totalRevenue: revenue[0].total || 1245000,
    conversionRate: ((students[0].count / (enquiries[0].count || 1)) * 100).toFixed(1) + '%'
  });
});

// Express.js Backend Routes
app.get('/api/enquiries', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM enquiries ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/students', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM students ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Backend server running on port 5000');
});