import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button as MuiButton } from '@mui/material';
import { ref, set, update, push, onValue } from 'firebase/database';
import { database } from '../config/firebase';
import TextFieldComponent from '../components/TextField';
import SelectComponent from '../components/Select';
import { SelectChangeEvent } from '@mui/material/Select';

interface Subject {
  classLevel: string;
  subjectName: string;
}

interface SubjectFormProps {
  subject?: Subject;
  onSave: () => void;
}

const SubjectForm: React.FC<SubjectFormProps> = ({ subject: editingSubject, onSave }) => {
  const [subject, setSubject] = useState<Subject>({
    classLevel: '',
    subjectName: '',
  });
  const [classLevels, setClassLevels] = useState<string[]>([]);

  useEffect(() => {
    const classRef = ref(database, 'classes');
    onValue(classRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const levels = Object.keys(data);
        setClassLevels(levels);
      }
    });
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSubject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setSubject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const subjectRef = ref(database, `subjects/${subject.classLevel.replace(' ', '_')}/${subject.subjectName.replace(' ', '_')}`);

      if (editingSubject) {
        await update(subjectRef, subject);
      } else {
        await set(subjectRef, subject);
      }

      const classSubjectRef = push(ref(database, `classes/${subject.classLevel.replace(' ', '_')}/subjects`));
      await set(classSubjectRef, { subjectName: subject.subjectName });

      console.log('Subject saved:', subject);
      setSubject({
        classLevel: '',
        subjectName: '',
      });
      onSave();
    } catch (e) {
      console.error('Error saving subject: ', e);
    }
  };

  return (
    <div className="container mt-4" style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <h2>Add/Edit Subject</h2>
        <form>
          <div className="mb-3 row">
            <label htmlFor="classLevel" className="col-sm-2 col-form-label">Class Level</label>
            <div className="col-sm-10">
              <SelectComponent
                id="classLevel"
                name="classLevel"
                label="Class Level"
                value={subject.classLevel}
                onChange={handleSelectChange}
                options={[
                  { value: '', label: 'Select Class Level' },
                  ...classLevels.map(level => ({ value: level, label: level }))
                ]}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="subjectName" className="col-sm-2 col-form-label">Subject Name</label>
            <div className="col-sm-10">
              <TextFieldComponent
                id="subjectName"
                name="subjectName"
                label="Subject Name"
                value={subject.subjectName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <div className="col-sm-10 offset-sm-2">
              <MuiButton
                variant="contained"
                color="primary"
                onClick={handleSave}
                className="me-2"
              >
                Save
              </MuiButton>
              <MuiButton
                variant="contained"
                color="secondary"
                onClick={() =>
                  setSubject({
                    classLevel: '',
                    subjectName: '',
                  })
                }
                className="me-2"
              >
                Cancel
              </MuiButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectForm;
