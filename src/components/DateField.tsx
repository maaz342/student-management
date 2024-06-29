import React, { ChangeEvent } from 'react';
import { TextField } from '@mui/material';

interface DateFieldComponentProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
  margin?: 'none' | 'dense' | 'normal';
  InputLabelProps?: any;
}

const DateFieldComponent: React.FC<DateFieldComponentProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  fullWidth = true,
  margin = 'normal',
  InputLabelProps = { shrink: true }
}) => {
  return (
    <TextField
      id={id}
      name={name}
      label={label}
      type="date"
      value={value}
      onChange={onChange}
      fullWidth={fullWidth}
      margin={margin}
      InputLabelProps={InputLabelProps}
    />
  );
};

export default DateFieldComponent;
