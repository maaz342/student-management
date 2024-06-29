import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import Dashboard from '../pages/Dashboard';
import NavBar from '../components/Navbar';
import Login from '../pages/LoginForm';
import { useAuth } from '../context/AuthContext';
import AdmissionForm from '../pages/AdmissionForm';
import Footer from '../components/Footer';

const AppRouter: React.FC = () => {
  const { isAdmin } = useAuth();

  return (
    <Router>
      <NavBar />
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

        <Route path="/" element={<Login />} />
      </Routes>
      <Footer/>
    </Router>
  );
};

export default AppRouter;
