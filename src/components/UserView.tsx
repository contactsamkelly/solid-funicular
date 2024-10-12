/* eslint-disable @typescript-eslint/no-explicit-any */
import { Delete, ExpandMore, PersonAddAlt } from "@mui/icons-material";
import Close from "@mui/icons-material/Close";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  Typography,
  Avatar,
  IconButton,
  Grid2,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ListItemAvatar,
  ListItemButton,
  InputAdornment,
  FormControl,
  OutlinedInput,
  CircularProgress,
  Autocomplete,
  TextField,
  AutocompleteInputChangeReason,
  Box,
} from "@mui/material";
import { ChangeEvent, useEffect, useRef, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export function UserView({ open, userData, closeHandler }: any) {
  const [reloadPage, setReloadPage] = useState(false);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [friendsOfUser, setFriendsOfUser] = useState<any>([]);
  const [addFriendInput, setAddFriendInput] = useState("");
  const [friendSearchOptions, setFriendSearchOptions] = useState<any>([]);
  const previousController = useRef<AbortController>();
  useEffect(() => {
    async function retrieveFriendsOfUser() {
      if (userData) {
        setIsLoadingFriends(true);
        const friendsResult = await fetch(`/api/users/${userData.id}/friends`);
        const friendsJson = await friendsResult.json();
        setFriendsOfUser(friendsJson);
        setIsLoadingFriends(false);
      } else {
        console.log("There is no user data to fetch friends for...");
        userData;
      }
    }
    retrieveFriendsOfUser();
  }, [userData, reloadPage]);

  const endFriendship = async (friend: any) => {
    try {
      await fetch(`/api/friends/${friend.friendship.id}`, { method: "DELETE" });
      setReloadPage(!reloadPage);
    } catch (e) {
      console.log("Got an error removing friendship");
    }
  };

  const addFriendById = async (id: string) => {
    const body = JSON.stringify({ id });
    try {
      const result = await fetch(`/api/users/${userData.id}/friends`, {
        method: "POST",
        body,
      });
      console.log("Result of adding friend by ID", result);
      setReloadPage(!reloadPage);
    } catch (e) {
      console.log("User could not be added for whatever reason", e);
    }
  };

  const addFriendByUsername = async () => {
    const body = JSON.stringify({ username: addFriendInput });
    await fetch(`/api/users/${userData.id}/friends`, {
      method: "POST",
      body,
    });
    setReloadPage(!reloadPage);
  };

  const handleFriendInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddFriendInput(e.target.value);
  };

  const searchForFriends = async (searchTerm: string) => {
    if (previousController.current) {
      previousController.current.abort();
    }
    const controller = new AbortController();
    const signal = controller.signal;
    previousController.current = controller;

    try {
      const matchedFriendsResult = await fetch(
        `/api/users?query=${searchTerm}&excludeUser=${userData.id}`,
        {
          signal,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const json = (await matchedFriendsResult.json()) as any;
      console.log("Got matched users", json);
      const updatedOptions = json.usersResult;
      setFriendSearchOptions(updatedOptions);
    } catch (e) {
      //
    }
  };

  const onFriendSearchInputChange = (
    event: React.SyntheticEvent,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => {
    console.log("event", event);
    console.log("value", value);
    console.log("reason", reason);
    if (value) {
      searchForFriends(value);
    } else {
      setFriendSearchOptions([]);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        fullWidth
        maxWidth="md"
        disableEscapeKeyDown={false}
        onClose={closeHandler}
      >
        <DialogTitle>
          {userData ? (
            <>
              <Typography
                variant="h5"
                sx={{ pl: "4.5rem", pt: ".15rem", pr: "2rem" }}
              >
                {userData.name}
              </Typography>
              <Typography variant="subtitle1" sx={{ pl: "4.5rem" }}>
                @{userData.username}
              </Typography>
            </>
          ) : (
            <></>
          )}
        </DialogTitle>
        {userData ? (
          <>
            <Avatar
              src={userData.avatarurl}
              sx={{
                backgroundColor: "#000",
                width: "4rem",
                height: "4rem",
                position: "absolute",
                left: 8,
                top: 8,
              }}
            />
          </>
        ) : (
          <></>
        )}

        <IconButton
          aria-label="close"
          onClick={closeHandler}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <Close />
        </IconButton>
        <DialogContent dividers>
          <DialogContentText>
            {userData ? (
              <>
                <Accordion defaultExpanded>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="details-content"
                    id="details-header"
                  >
                    <Typography>User Details</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid2 container spacing={2}>
                      <Grid2 size={6}>
                        <List>
                          <ListItem>
                            <ListItemText
                              primary={userData.email}
                              secondary={userData.location}
                            />
                          </ListItem>
                        </List>
                      </Grid2>

                      <Grid2 size={6} textAlign="right" justifyItems="flex-end">
                        <List>
                          <ListItem>
                            <ListItemText
                              primary="Created 5 years ago"
                              secondary="Last active 2 weeks ago"
                            />
                          </ListItem>
                        </List>
                      </Grid2>
                    </Grid2>
                    <Grid2 container spacing={2}>
                      <Grid2 size={12} sx={{ p: "1rem" }}>
                        <Typography variant="body1">{userData.bio}</Typography>
                      </Grid2>
                    </Grid2>
                  </AccordionDetails>
                </Accordion>

                <Accordion disabled={isLoadingFriends}>
                  <AccordionSummary
                    expandIcon={
                      isLoadingFriends ? <CircularProgress /> : <ExpandMore />
                    }
                    aria-controls="friends-content"
                    id="friends-header"
                  >
                    <Typography>
                      Friends (
                      {friendsOfUser ? <>{friendsOfUser.length}</> : "0"})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Autocomplete
                      options={friendSearchOptions}
                      getOptionLabel={(option: any) => {
                        return "@" + option.username;
                      }}
                      onChange={(_e: any, value: any) =>
                        addFriendById(value.id)
                      }
                      onInputChange={onFriendSearchInputChange}
                      renderInput={(params) => <TextField {...params} />}
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      renderOption={(_props, option) => (
                        <ListItem {..._props}>
                          <ListItemText
                            primary={option.name}
                            secondary={option.username}
                          />
                        </ListItem>
                      )}
                    />
                    <Box sx={{ display: "none" }}>
                      <Grid2 container>
                        <Grid2 size={10}>
                          <FormControl
                            fullWidth
                            sx={{ m: 0, p: 0 }}
                            variant="outlined"
                          >
                            <OutlinedInput
                              value={addFriendInput}
                              onChange={handleFriendInputChange}
                              id="search-username"
                              startAdornment={
                                <InputAdornment position="start">
                                  @
                                </InputAdornment>
                              }
                            />
                          </FormControl>
                        </Grid2>
                        <Grid2
                          size={2}
                          alignItems="stretch"
                          style={{ display: "flex" }}
                        >
                          <Button
                            variant="contained"
                            title="Add User"
                            endIcon={<PersonAddAlt />}
                            onClick={addFriendByUsername}
                          >
                            Add User
                          </Button>
                        </Grid2>
                      </Grid2>
                    </Box>
                    <List>
                      {friendsOfUser && friendsOfUser.length > 0 ? (
                        <>
                          {friendsOfUser.map((friend: any) => {
                            return (
                              <ListItem
                                disablePadding
                                secondaryAction={
                                  <IconButton
                                    color="error"
                                    onClick={() => endFriendship(friend)}
                                  >
                                    <Delete />
                                  </IconButton>
                                }
                              >
                                <ListItemButton>
                                  <ListItemAvatar>
                                    <Avatar src={friend.avatarurl} />
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={friend.name}
                                    secondary={friend.username}
                                  />
                                </ListItemButton>
                              </ListItem>
                            );
                          })}
                        </>
                      ) : (
                        <></>
                      )}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </>
            ) : (
              <>No Data</>
            )}
          </DialogContentText>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={closeHandler}>Cancel</Button>
          
        </DialogActions> */}
      </Dialog>
    </>
  );
}
