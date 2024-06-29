import React, { useState, useEffect } from 'react';
import { ref, onValue, set, push, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../config/firebase';
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
} from '@mui/material';

interface Student {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  currentClass: string;
  enrollmentDate: string;
  promotionDate?: string;
  classHistory: ClassHistory[];
}

interface ClassHistory {
  classLevel: string;
  startDate: string;
  endDate?: string;
}

interface Fee {
  id: string;
  classLevel: string;
  tuitionFee: number;
  libraryFee: number;
  sportsFee: number;
  totalFee: number;
}

const FeesVoucher: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [classLevels, setClassLevels] = useState<string[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [voucherDetails, setVoucherDetails] = useState<Fee | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [paymentConfirmed, setPaymentConfirmed] = useState<boolean>(false);

  useEffect(() => {
    const classesRef = ref(database, 'classes');
    onValue(classesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedClassLevels = Object.keys(data).map((key) => key.replace('_', ' '));
        setClassLevels(loadedClassLevels);
      }
    });

    const studentsRef = ref(database, 'students');
    onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedStudents: Student[] = Object.values(data);
        setStudents(loadedStudents);
      }
    });

    const feesRef = ref(database, 'fees');
    onValue(feesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedFees: Fee[] = [];
        for (let id in data) {
          loadedFees.push({ id, ...data[id] });
        }
        setFees(loadedFees);
      }
    });
  }, []);

  const handleClassChange = (event: SelectChangeEvent<string>) => {
    const selectedClass = event.target.value;
    setSelectedClass(selectedClass);

    const filtered = students.filter((student) => student.currentClass === selectedClass);
    setFilteredStudents(filtered);
  };

  const generateVoucher = (student: Student) => {
    setSelectedStudent(student);

    const feeDetails = fees.find((fee) => fee.classLevel === student.currentClass);
    setVoucherDetails(feeDetails || null);
  };

  const handlePayFee = () => {
    if (selectedStudent && voucherDetails) {
      const paymentsRef = ref(database, 'payments');
      const feeQuery = query(
        paymentsRef,
        orderByChild('studentId_classLevel'),
        equalTo(`${selectedStudent.email}_${voucherDetails.classLevel}`)
      );

      onValue(feeQuery, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Fee already paid
          setPaymentStatus('Fee already paid');
          setPaymentConfirmed(false);
        } else {
          setPaymentStatus('Processing');

          setTimeout(() => {
            setPaymentStatus('Paid');
            setPaymentConfirmed(true);

            const paymentRef = ref(database, 'payments');
            const newPaymentRef = push(paymentRef);
            set(newPaymentRef, {
              studentId: selectedStudent.email, 
              classLevel: voucherDetails.classLevel,
              totalFee: voucherDetails.totalFee,
              paymentDate: new Date().toISOString(),
              studentId_classLevel: `${selectedStudent.email}_${voucherDetails.classLevel}`
            });
          }, 2000);
        }
      }, { onlyOnce: true });
    }
  };

  const confirmPayment = () => {
    if (selectedStudent && voucherDetails && paymentConfirmed) {
      const confirmationRef = ref(database, 'feeConfirmations');
      const newConfirmationRef = push(confirmationRef);
      set(newConfirmationRef, {
        studentId: selectedStudent.email,
        classLevel: voucherDetails.classLevel,
        paymentStatus: paymentStatus,
        confirmationDate: new Date().toISOString(),
      });
    }
  };

  return (
    <Container className="mt-4">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Fees Voucher
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="filter-class-label">Select Class</InputLabel>
          <Select
            labelId="filter-class-label"
            id="filter-class"
            value={selectedClass}
            onChange={handleClassChange}
          >
            <MenuItem value="">All Classes</MenuItem>
            {classLevels.map((classLevel, index) => (
              <MenuItem key={index} value={classLevel}>
                Class {classLevel}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TableContainer component={Paper} className="mt-4">
          <Table sx={{ minWidth: 650 }} aria-label="students table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student, index) => (
                <TableRow key={index}>
                  <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => generateVoucher(student)}
                    >
                      Generate Voucher
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {selectedStudent && voucherDetails && (
          <Box mt={4}>
            <Typography variant="h5">Voucher Details for {selectedStudent.firstName} {selectedStudent.lastName}</Typography>
            <TableContainer component={Paper} className="mt-2">
              <Table sx={{ minWidth: 650 }} aria-label="fee details table">
                <TableHead>
                  <TableRow>
                    <TableCell>Class Level</TableCell>
                    <TableCell align="right">Tuition Fee</TableCell>
                    <TableCell align="right">Library Fee</TableCell>
                    <TableCell align="right">Sports Fee</TableCell>
                    <TableCell align="right">Total Fee</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{voucherDetails.classLevel}</TableCell>
                    <TableCell align="right">${voucherDetails.tuitionFee}</TableCell>
                    <TableCell align="right">${voucherDetails.libraryFee}</TableCell>
                    <TableCell align="right">${voucherDetails.sportsFee}</TableCell>
                    <TableCell align="right">${voucherDetails.totalFee}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePayFee}
                disabled={paymentStatus === 'Paid' || paymentStatus === 'Fee already paid'}
              >
                Pay Fee
              </Button>
              {paymentStatus && (
                <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
                  {paymentStatus}
                </Typography>
              )}
              {paymentConfirmed && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={confirmPayment}
                  sx={{ mt: 2 }}
                >
                  Confirm Pay
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default FeesVoucher;
