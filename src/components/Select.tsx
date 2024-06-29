import React from 'react';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';

export interface SelectComponentProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: SelectChangeEvent<string>) => void;
  options: { value: string; label: string }[];
  fullWidth?: boolean;
  margin?: 'none' | 'dense' | 'normal';
}

const SelectComponent: React.FC<SelectComponentProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  fullWidth = true,
  margin = 'normal'
}) => {
  return (
    <FormControl fullWidth={fullWidth} margin={margin}>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        labelId={`${id}-label`}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectComponent;
