const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host:   'localhost',
    user:   'root',
    password: '',
    database: 'EPMS'
});
db.connect((err) => {
    if (err) {
        console.log('Database connection error:', err);
    } else {
        console.log('Connected to the database');
    }
});

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err, result) => {
            if (err) {
                console.log(err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: 'User already exists' });
                }
                return res.status(500).json({ error: 'Failed to register user' });
            }
            res.json({ message: 'User created successfully' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    db.query('SELECT id, email, password FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Login failed' });
        }

        if (!results || results.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '8h' });
        res.json({ token, user: { id: user.id, email: user.email } });
    });
});

app.post('/api/salary', (req, res) => {
         db.query('insert into salary (salaryId, employeeNumber, grossSalary, totalDeduction, netSalary, month) values (?, ?, ?, ?, ?, ?)',
            [req.body.salaryId, req.body.employeeNumber, req.body.grossSalary, req.body.totalDeduction, req.body.netSalary, req.body.month], (err, result) => {
               if(err){
                   console.log(err);
                   res.status(500).json({ error: 'Failed to insert salary data' });
               } else {
                   res.json(result);
               }    
            });
});

app.get('/api/salary', (req, res) => {
    db.query('select * from salary', (err, result) => {
        if(err){
            console.log(err);
            res.status(500).json({ error: 'Failed to fetch salary data' });
        } else {
            res.json(result);
        }
    });
});

app.delete('/api/salary/:id', (req, res) => {
    const id = req.params.id;
    db.query('delete from salary where salaryId = ?', id, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Failed to delete salary data' });        
        } else {
            res.json(result);
        }
    });
});

app.put('/api/salary/:id', (req, res) => {
    const id = req.params.id;
    db.query('update salary set employeeNumber = ?, grossSalary = ?, totalDeduction = ?, netSalary = ?, month = ? where salaryId = ?',
        [req.body.employeeNumber, req.body.grossSalary, req.body.totalDeduction, req.body.netSalary, req.body.month, id], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: 'Failed to update salary data' });
            } else {
                res.json(result);
            }   
    });
});
app.post('/api/department', (req, res) => {
         db.query('insert into department (departmentCode, departmentName, grossSalary) values (?, ?, ?)',
            [req.body.departmentCode, req.body.departmentName, req.body.grossSalary], (err, result) => {
               if(err){
                   console.log(err);
                   res.status(500).json({ error: 'Failed to insert department data' });
               } else {
                   res.json(result);
               }    
            });
});

app.get('/api/department', (req, res) => {
    db.query('select * from department', (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Failed to fetch department data' });
        }
        res.json(result);
    });
});

// Employee endpoints
app.post('/api/employee', (req, res) => {
    const { employeeNumber, firstName, lastName, departmentCode, email, position, address, telephone, gender, hiredDate } = req.body;
    db.query('insert into employee (employeeNumber, firstName, lastName, departmentCode, email, position, address, telephone, gender, hiredDate) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [employeeNumber, firstName, lastName, departmentCode, email, position, address, telephone, gender, hiredDate], (err, result) => {
           if(err){
               console.log(err);
               res.status(500).json({ error: 'Failed to insert employee data' });
           } else {
               res.json({ id: result.insertId, affectedRows: result.affectedRows });
           }    
        });
});

app.get('/api/employee', (req, res) => {
    db.query('select * from employee', (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Failed to fetch employee data' });
        }
        res.json(result);
    });
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the existing server or set PORT to a free port.`);
    } else {
        console.error(err);
    }
});
