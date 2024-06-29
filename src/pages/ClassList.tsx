import React, { useEffect, useState } from 'react';
import { ref, onValue, DataSnapshot } from 'firebase/database';
import { database } from '../config/firebase'; // Ensure this path is correct
import { Container, Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const ClassList: React.FC = () => {
  const [classList, setClassList] = useState<any[]>([]);

  useEffect(() => {
    const classesRef = ref(database, 'classes');

    onValue(classesRef, (snapshot: DataSnapshot) => {
      const classes: any[] = [];
      snapshot.forEach((childSnapshot) => {
        const classData = childSnapshot.val();
        classes.push({
          id: childSnapshot.key,
          classLevel: classData.classLevel,
          classTeacher: classData.classTeacher,
          description: classData.description,
        });
      });
      setClassList(classes);
    });

    return () => {

    };
  }, []);

  return (
    <Container className="mt-4">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Class List
        </Typography>
        <List>
          {classList.map((classItem) => (
            <ListItem key={classItem.id}>
              <ListItemText
                primary={`Class Level: ${classItem.classLevel}`}
                secondary={`Teacher: ${classItem.classTeacher}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default ClassList;
