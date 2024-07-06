import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../config/firebase'; // Assuming database is imported from Firebase
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Link, Routes, Route, useNavigate, Outlet,useLocation } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import StudentList from '../pages/StudentList';
import StudentForm from '../pages/StudentAdd';
import TransferStudent from '../pages/TransferStudent';
import TeacherAdd from '../pages/TeacherAdd';
import TeacherList from '../pages/TeacherList';
import ClassAllocationForm from '../pages/ClassAllocationForm';
import SubjectForm from '../pages/SubjectAdd';
import SubjectList from '../pages/SubjectList';
import SyllabusForm from '../pages/SyllabusForm';
import SyllabusList from '../pages/SyllabusDetails';
import FeeStructure from '../pages/FeeStructure';
import FeeStructureForm from '../pages/FeesAdd';
import ClassAddForm from '../pages/ClassForm';
import ClassList from '../pages/ClassList';
import FeesVoucher from '../pages/FeesVoucher';
import AddExam from '../pages/ExamAdd';
import ExamSchedule from '../pages/ExamSchedule';
import AddResultDialog from '../pages/ExamResult';
import AdmissionForm from '../pages/AdmissionForm';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const data = [
  [
    { name: 'Jan', students: 4000, fee: 2400 },
    { name: 'Feb', students: 3000, fee: 1398 },
    { name: 'Mar', students: 2000, fee: 9800 },
    { name: 'Apr', students: 2780, fee: 3908 },
    { name: 'May', students: 1890, fee: 4800 },
    { name: 'Jun', students: 2390, fee: 3800 },
    { name: 'Jul', students: 3490, fee: 4300 },
  ],
  [
    { name: 'Jan', students: 4500, fee: 2600 },
    { name: 'Feb', students: 3200, fee: 1500 },
    { name: 'Mar', students: 2100, fee: 9900 },
    { name: 'Apr', students: 2900, fee: 4000 },
    { name: 'May', students: 2000, fee: 5000 },
    { name: 'Jun', students: 2500, fee: 3900 },
    { name: 'Jul', students: 3600, fee: 4400 },
  ],
  [
    { name: 'Jan', students: 4200, fee: 2500 },
    { name: 'Feb', students: 3100, fee: 1400 },
    { name: 'Mar', students: 2200, fee: 9700 },
    { name: 'Apr', students: 2800, fee: 3800 },
    { name: 'May', students: 1900, fee: 4700 },
    { name: 'Jun', students: 2400, fee: 3700 },
    { name: 'Jul', students: 3500, fee: 4200 },
  ],
];

interface Exam {
  class: string;
  subject: string;
  type: string;
  date: string;
  maxMarks: number;
}

const Dashboard: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [exams, setExams] = useState<Exam[]>([]);
  const { isAdmin, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDrawer = (open: boolean) => () => {
    setIsDrawerOpen(open);
  };

  const adminDrawerRoutes = (
    <>
      <ListItem button component={Link} to="/dashboard/fee-voucher" onClick={toggleDrawer(false)}>
        <ListItemText primary="Fee Voucher" />
      </ListItem>
      <ListItem button component={Link} to="/dashboard/exam-add" onClick={toggleDrawer(false)}>
        <ListItemText primary="Exam Add" />
      </ListItem>
      <ListItem button component={Link} to="/dashboard/students" onClick={toggleDrawer(false)}>
        <ListItemText primary="Students List" />
      </ListItem>
      <ListItem button component={Link} to="/dashboard/students/add" onClick={toggleDrawer(false)}>
        <ListItemText primary="Add Student" />
      </ListItem>
      <ListItem button component={Link} to="/dashboard/subject-list" onClick={toggleDrawer(false)}>
        <ListItemText primary="List Subject" />
      </ListItem>
      <ListItem button component={Link} to="/dashboard/fee-add" onClick={toggleDrawer(false)}>
        <ListItemText primary="Add Fees" />
      </ListItem>
      <ListItem button component={Link} to="/dashboard/subject-add" onClick={toggleDrawer(false)}>
        <ListItemText primary="Add Subject" />
      </ListItem>
      <ListItem button component={Link} to="/dashboard/syllabus-add" onClick={toggleDrawer(false)}>
        <ListItemText primary="Add Syllabus" />
      </ListItem>
      <ListItem button component={Link} to="/dashboard/add-teacher" onClick={toggleDrawer(false)}>
        <ListItemText primary="Add Teacher" />
      </ListItem>
      <ListItem button component={Link} to="/dashboard/list-teacher" onClick={toggleDrawer(false)}>
        <ListItemText primary="List Teacher" />
      </ListItem>
      <ListItem button component={Link} to="/dashboard/exam-result" onClick={toggleDrawer(false)}>
        <ListItemText primary="Add Result" />
      </ListItem>
      <ListItem button component={Link} to="/dashboard/transfer-student" onClick={toggleDrawer(false)}>
        <ListItemText primary="Transfer Student" />
      </ListItem>
    </>
  );

  useEffect(() => {
    const examsRef = ref(database, 'results');
    const loadExams = onValue(examsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedExams: Exam[] = Object.keys(data).map((key) => data[key]);
        setExams(loadedExams);
      }
    });

    return () => {
      loadExams(); // Unsubscribe from the Firebase listener when component unmounts
    };
  }, []);

  useEffect(() => {
    // Reset charts or any other data when activeIndex changes
    // For example, reset `exams` state here if needed
    return () => {
      // Cleanup any data or state
    };
  }, [activeIndex]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // Uncomment if not redirected automatically
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            School Management System
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <List>
          <ListItem button component={Link} to="/dashboard/fee-structure" onClick={toggleDrawer(false)}>
            <ListItemText primary="Fee Structure" />
          </ListItem>
          <ListItem button component={Link} to="/dashboard/class-list" onClick={toggleDrawer(false)}>
            <ListItemText primary="Class List" />
          </ListItem>
          <ListItem button component={Link} to="/dashboard/exam-schedule" onClick={toggleDrawer(false)}>
            <ListItemText primary="Exam Schedule" />
          </ListItem>
          <ListItem button component={Link} to="/dashboard/syllabus-list" onClick={toggleDrawer(false)}>
            <ListItemText primary="Syllabus List" />
          </ListItem>
          {isAdmin && adminDrawerRoutes}
        </List>
      </Drawer>

      {location.pathname === '/dashboard' && (
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Students Overview</h5>
                  <LineChart width={500} height={300} data={data[activeIndex]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="students" stroke="#8884d8" />
                    <Line type="monotone" dataKey="fee" stroke="#82ca9d" />
                  </LineChart>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Fee Collection</h5>
                  <BarChart width={500} height={300} data={data[activeIndex]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="fee" fill="#8884d8" />
                  </BarChart>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Exam Results</h5>
                  <LineChart width={500} height={300} data={exams}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="maxMarks" stroke="#8884d8" />
                  </LineChart>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Attendance</h5>
                  <BarChart width={500} height={300} data={data[activeIndex]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="students" fill="#82ca9d" />
                  </BarChart>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
     
    

      <Routes>
        <Route path="/students" element={<StudentList />} />
        <Route path="/students/add" element={<StudentForm onSave={() => {}} />} />
        <Route path="/students/edit/:id" element={<StudentForm onSave={() => {}} />} />
        <Route path="/transfer-student" element={<TransferStudent />} />
        <Route path="/subject-list" element={<SubjectList />} />
        <Route path="/syllabus-list" element={<SyllabusList />} />
        <Route path="/fee-structure" element={<FeeStructure />} />
        <Route path="/fee-add" element={<FeeStructureForm />} />
        <Route path="/class-add" element={<ClassAddForm />} />
        <Route path="/class-list" element={<ClassList />} />
        <Route path="/exam-schedule" element={<ExamSchedule />} />
        <Route path="/exam-add" element={<AddExam />} />
        <Route path="/exam-result" element={<AddResultDialog />} />
        <Route path="/admission-form" element={<AdmissionForm />} />
        <Route path="/transfer-student" element={<TransferStudent />} />


        {isAdmin && (
          <>
            <Route path="/add-teacher" element={<TeacherAdd onSave={() => {}} />} />
            <Route path="/list-teacher" element={<TeacherList />} />
            <Route path="/allocate-class/:email" element={<ClassAllocationForm />} />
            <Route path="/subject-add" element={<SubjectForm onSave={() => {}} />} />
            <Route path="/syllabus-add" element={<SyllabusForm onSave={() => {}} onClose={() => {}} />} />
            <Route path="/fee-voucher" element={<FeesVoucher />} />
          </>
        )}

        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Outlet />
    </>
  );
};

export default Dashboard;
