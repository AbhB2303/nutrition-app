import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function SelectSmall({ unit, setUnit, options, setUnitName }) {
  const handleChange = (event) => {
    setUnit(event.target.value);
    console.log("event.target.value", event.target.value);
    // set unit name to the label of the selected option
    setUnitName(
      options.find((option) => option._id["Gm_Wgt"] === event.target.value)._id[
        "Msre_Desc"
      ]
    );
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
        {options.map((option) => (
          <MenuItem
            value={option._id["Gm_Wgt"]}
            label={option._id["Msre_Desc"]}
          >
            {option._id["Msre_Desc"]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
