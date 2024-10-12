import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  TextField,
  DialogActions,
  Grid2,
  Typography,
} from "@mui/material";
import { postUser } from "../services/users";
import { ChangeEvent, useRef, useState } from "react";
import { faker } from "@faker-js/faker";
import { AutoAwesome } from "@mui/icons-material";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function UserAddForm({ open, closeHandler }: any) {
  const emptyFormValues = {
    email: "",
    username: "",
    name: "",
    location: "",
    bio: "",
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputData, setInputData] = useState(emptyFormValues);
  const formRef = useRef<HTMLFormElement>();

  const autoGenerateUser = () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const full = `${firstName} ${lastName}`;

    setInputData({
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      username: faker.internet.userName({ firstName, lastName }).toLowerCase(),
      name: full,
      location: faker.location.city() + ", " + faker.location.state(),
      bio: faker.person.bio(),
    });
  };
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputData({
      ...inputData,
      [name]: value,
    });
  };
  return (
    <Dialog
      open={open}
      onClose={closeHandler}
      PaperProps={{
        id: "add-user-form",
        component: "form",
        ref: formRef,
        onReset: async () => {},
        onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
          setIsSubmitting(true);
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          const email = formJson.email;
          console.log(email);
          try {
            const postResult = await postUser(formJson);
            const postJson = await postResult.json();
            if (postJson) {
              console.log(
                "Successfully created a user... can we trigger reload?"
              );
            }
          } catch (e) {
            console.log("Got error posting...", e);
          }
          setIsSubmitting(false);
          closeHandler(true);
        },
      }}
    >
      <DialogTitle>Add New User</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Grid2 container spacing={2}>
            <Grid2 size={9}>
              <Typography>
                Fill out this form to create a new user. Or you can autogenerate
                a new user with placeholder content.
              </Typography>
            </Grid2>
            <Grid2 size={3}>
              <Button
                type="button"
                onClick={autoGenerateUser}
                variant="contained"
                startIcon={<AutoAwesome />}
              >
                Generate
              </Button>
            </Grid2>
          </Grid2>
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          label="Email Address"
          type="email"
          fullWidth
          variant="outlined"
          value={inputData.email}
          onChange={handleInputChange}
        />
        <TextField
          required
          margin="dense"
          id="username"
          name="username"
          label="Username"
          type="text"
          fullWidth
          variant="outlined"
          value={inputData.username}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          id="name"
          name="name"
          label="Name"
          type="text"
          fullWidth
          variant="outlined"
          value={inputData.name}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          id="location"
          name="location"
          label="Location"
          type="text"
          fullWidth
          variant="outlined"
          value={inputData.location}
          onChange={handleInputChange}
        />
        <TextField
          multiline
          minRows="3"
          margin="dense"
          id="bio"
          name="bio"
          label="Bio"
          type="text"
          fullWidth
          variant="outlined"
          value={inputData.bio}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeHandler} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
