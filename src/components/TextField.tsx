import React, { ChangeEvent } from 'react';
import { TextField } from '@mui/material';

interface TextFieldComponentProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
  margin?: 'none' | 'dense' | 'normal';
}

const TextFieldComponent: React.FC<TextFieldComponentProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  fullWidth = true,
  margin = 'normal'
}) => {
  return (
    <TextField
      id={id}
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      fullWidth={fullWidth}
      margin={margin}
    />
  );
};

export default TextFieldComponent;
