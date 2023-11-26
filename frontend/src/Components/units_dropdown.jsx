import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectSmall({ unit, setUnit }) {
  const handleChange = (event) => {
    setUnit(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small-label">Unit</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={unit} // Change this to use setUnit instead of unit
        label="Unit"
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={"Cups"}>Cups</MenuItem>
        <MenuItem value={"Ounces"}>Ounces</MenuItem>
        <MenuItem value={"Grams"}>Grams</MenuItem>
      </Select>
    </FormControl>
  );
}