import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useEffect } from "react";

import "./Modal.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxHeight: "70%",
  bgcolor: "background.paper",
  borderRadius: "15px",
  boxShadow: 24,
  p: 4,
  overflow: "scroll",
};
export const RecordModal = ({ open, setOpen }) => {
  const handleClose = () => setOpen(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [value, setValue] = useState(new Date());
  const [mealType, setMealType] = useState("");
  const [listOfMeals, setListOfMeals] = useState([]);
  const { user } = useAuth0();

  const onBackClick = () => {
    handleClose();
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_SERVER_URL}/get_meals/${user.email}`)
      .then((res) => {
        setListOfMeals(res.data);
      });
  }, [open]);

  const handleDateChange = (newValue) => {
    if (newValue === null) {
      return;
    } else if (newValue > new Date()) {
      return;
    }
    setSelectedDate(newValue);
  };

  const handleTimeChange = (newValue) => {
    setValue(newValue);
  };

  const onSubmit = () => {
    let formData = new FormData();
    formData.append("email", user.email);
    formData.append("meal_id", mealType);
    formData.append("date", selectedDate);
    formData.append("time", value);
    axios.post(
      `${process.env.REACT_APP_API_SERVER_URL}/record_meal`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    ).then(
      window.location.reload()
    )
    handleClose();
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <div>
              <div>
                <h2 className="modal-title">Record a new meal</h2>
                <p className="modal-subtitle">Enter the meal details below.</p>
              </div>
              <Button
                style={{position: "absolute", margin: "20px 10px"}}
                className="closeButton"
                onClick={() => {
                  setOpen(false);
                }}
              >
                X
              </Button>
            </div>
            <div style={{display: "block", textAlign: "center"}}>
              <div
                style={{
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                  marginBottom: "25px"
                }}
              >
                <Select
                  value={mealType}
                  label="Meal Type"
                  onChange={(e) => {
                    setMealType(e.target.value);
                  }}
                >
                  {listOfMeals &&
                    listOfMeals.map((meal) => (
                      <MenuItem value={meal._id}>{meal.MealName}</MenuItem>
                    ))}
                </Select>
                <LocalizationProvider style={{display: "inline-block"}} dateAdapter={AdapterDayjs}>
                  <DatePicker
                    onChange={(newValue) => {
                      handleDateChange(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <TimeField
                    onChange={(newValue) => {
                      handleTimeChange(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>
              <Button
                variant="contained"
                  onClick={() => {
                    onSubmit();
                  }}
                >
                  Submit
                </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
export default RecordModal;
