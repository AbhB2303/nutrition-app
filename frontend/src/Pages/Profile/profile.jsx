import axios from "axios";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Label from "@mui/material/FormLabel";
import { TextareaAutosize } from "@mui/material";
import { Unstable_NumberInput as NumberInput } from "@mui/base/Unstable_NumberInput";

const Profile = () => {
  const [formData, setFormData] = useState({});
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      // get user data from backend if it exists
      axios
        .get(`${process.env.REACT_APP_API_SERVER_URL}/get_user/${user.email}`)
        .then((res) => {
          if (res.data !== null) {
            setFormData(res.data);
            console.log("User data retrieved:", res.data);
          } else {
            setFormData({ username: user.name, email: user.email });
          }
        });
    }
  }, [isAuthenticated]);

  const handleChange = (e) => {
    // regex to only allow number inputs
    if (
      e.target.name === "age" ||
      e.target.name === "height" ||
      e.target.name === "weight"
    ) {
      if (e.target.value < 0) {
        e.target.value = 0;
      }

      const numeric = e.target.value.replace(/[^0-9]/g, "");
      setFormData({ ...formData, [e.target.name]: numeric });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newformData = new FormData();
    newformData.append("username", formData.username);
    newformData.append("email", formData.email);
    newformData.append("age", formData.age);
    newformData.append("location", formData.location);
    newformData.append("weight", formData.weight);
    newformData.append("height", formData.height);
    newformData.append("goals", formData.goals);

    console.log("Form data submitted:", newformData);
    axios.post(
      `${process.env.REACT_APP_API_SERVER_URL}/create_user`,
      newformData
    );
  };

  return (
    <div>
      <h1>User Profile</h1>
      <p>Welcome to your profile page!</p>
      <div className="form-container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            margin: "10px",
          }}
        >
          {/* fields: username, email, age, location, weight, height */}
          <Label classname="label" htmlFor="Username">
            Username
          </Label>
          <TextField
            id="Username"
            name="username"
            onChange={handleChange}
            value={formData.username}
            hiddenLabel={!formData.username}
            required
          />
          <Label classname="label" htmlFor="Email">
            Email
          </Label>
          <TextField
            id="Email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            required
          />
          <Label classname="label" htmlFor="Age">
            Age
          </Label>
          <TextField
            id="Age"
            name="age"
            onChange={handleChange}
            value={formData.age}
            required
            type={Number}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            margin: "10px",
          }}
        >
          <Label classname="label" htmlFor="Location">
            Location
          </Label>
          <TextField
            id="Location"
            name="location"
            onChange={handleChange}
            value={formData.location}
            required
          />
          <Label classname="label" htmlFor="Weight">
            Weight
          </Label>
          <TextField
            id="Weight"
            name="weight"
            onChange={handleChange}
            value={formData.weight}
            required
          />
          <Label classname="label" htmlFor="Height">
            Height
          </Label>
          <TextField
            id="Height"
            name="height"
            onChange={handleChange}
            value={formData.height}
            required
            InputProps={{
              inputProps: {
                pattern: "[0-9]*", // Restrict input to numeric values
              },
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            margin: "10px",
          }}
        >
          <Label classname="label" htmlFor="Goals">
            Nutritional Goals:
          </Label>
          <TextareaAutosize
            id="goals"
            name="goals"
            onChange={handleChange}
            value={formData.goals}
            style={{ height: "200px" }}
          />
        </div>
        <div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "8px" }}
            onClick={handleSubmit}
          >
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default withAuthenticationRequired(Profile, {
  onRedirecting: () => <div>Loading...</div>,
});
