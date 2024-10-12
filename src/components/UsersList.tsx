/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChevronRightRounded,
  Delete,
  Error,
  PersonAdd,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid2,
  IconButton,
  Paper,
  // List,
  // ListItem,
  // ListItemAvatar,
  // ListItemButton,
  // ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { UserAddForm } from "./UserAddForm";
import { fetchUsers } from "../services/users";
import { UserView } from "./UserView";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export function UserListItem({ id, user }: { id: any; user: any }) {
//   const data = {
//     id: id,
//     username: "Fake username",
//     email: "fakemeail@email.com",
//     name: "fakename",
//     avatarurl: "https://cdn.quasar.dev/img/boy-avatar.png",
//     ...user,
//   };
//   return (
//     <>
//       <ListItem
//         disablePadding
//         alignItems="flex-start"
//         sx={{ textAlign: "left" }}
//         secondaryAction={
//           <IconButton color="error">
//             <Delete />
//           </IconButton>
//         }
//       >
//         <ListItemButton>
//           <ListItemAvatar>
//             <Avatar src={data.avatarurl} />
//           </ListItemAvatar>
//           {/* <ListItemText secondary={data.id} /> */}
//           <ListItemText primary={data.name} secondary={"@" + data.username} />
//           <ListItemText primary={data.email} />
//           <ListItemText primary="Location" />
//         </ListItemButton>
//       </ListItem>
//     </>
//   );
// }

export default function UsersList() {
  const [usersList, setUsersList] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [friendCount, setFriendCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [viewIsOpen, setViewIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirmationIsOpen, setDeleteConfirmationIsOpen] =
    useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = (refreshUserList: boolean) => {
    setOpen(false);
    if (refreshUserList) {
      setShouldRefresh(!shouldRefresh);
    }
  };
  const handleSelectUser = (event: any, data: any) => {
    console.log("event was", event);
    // console.log("Currently selected user is.... ", selectedUser);
    console.log("Selected a user row... ", data);
    setSelectedUser(data);
    console.log("Should be opening the view thing");
    setViewIsOpen(true);
  };

  const deleteRow = (event: any, userData: any) => {
    event.preventDefault();
    event.stopPropagation();
    console.log("EVENT!", event);
    console.log("Gonna try to delete userData", userData);
    setDeleteConfirmationIsOpen(true);
    setUserToDelete(userData);
  };

  const confirmDeleteRow = async () => {
    console.log("USER TO DELETE:", userToDelete);
    if (userToDelete) {
      console.log("Confirmed deleting the user...", userToDelete);
      try {
        const deleteResult = await fetch(`/api/users/${userToDelete.id}`, {
          method: "DELETE",
        });
        console.log("RESULT OF DELETING USER...", deleteResult);
        if (deleteResult) {
          console.log("Refreshing after delete");
          setShouldRefresh(!shouldRefresh);
        }
      } catch (e) {
        console.log("Error deleting user...", e);
      }
      setUserToDelete(null);
      setDeleteConfirmationIsOpen(false);
    }
  };

  useEffect(() => {
    async function retrieveUsers() {
      setIsLoading(true);
      try {
        const usersListResponse = await fetchUsers();
        const json = (await usersListResponse.json()) as any;
        const usersResult = json.usersResult as [];
        const totalUsers = json.totalUsers;
        const totalFriends = json.totalFriends;
        setUsersList(usersResult);
        setUserCount(totalUsers);
        setFriendCount(totalFriends);
      } catch (e) {
        console.log("Error retrieving users list", e);
      }
      setIsLoading(false);
    }
    retrieveUsers();
  }, [shouldRefresh]);

  return (
    <>
      <Grid2
        container
        spacing={2}
        justifyContent="space-evenly"
        alignItems="center"
      >
        <Grid2 size={4}>
          <Card>
            <CardHeader
              title="Total User Count"
              sx={{ background: "lightBlue", color: "black" }}
            />
            <CardContent>
              {userCount ? (
                <>
                  <Typography variant="h3">
                    {userCount.toLocaleString()}
                  </Typography>
                  <Typography variant="h6">unique users</Typography>
                </>
              ) : (
                <CircularProgress />
              )}
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={4}>
          <Card>
            <CardHeader
              title="Average Friends"
              sx={{ background: "pink", color: "black" }}
            />
            <CardContent>
              {friendCount && userCount ? (
                <>
                  <Typography variant="h3">
                    {(friendCount / userCount).toLocaleString()}
                  </Typography>
                  <Typography variant="h6">per user</Typography>
                </>
              ) : (
                <CircularProgress />
              )}
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
      <Card variant="outlined" sx={{ mt: "1rem", mb: "1rem" }}>
        <CardHeader
          title="Users"
          sx={{ textAlign: "left", background: "#202020" }}
          action={
            <IconButton color="success" onClick={handleClickOpen}>
              <PersonAdd sx={{ fontSize: "2rem" }} />
            </IconButton>
          }
        />
        <CardContent>
          {isLoading ? (
            <>
              <div>
                <CircularProgress />
              </div>
            </>
          ) : (
            <>
              {usersList && usersList.length > 0 ? (
                <>
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        {usersList.map((userData: any) => {
                          return (
                            <TableRow
                              key={userData.id}
                              hover
                              onClick={(event) =>
                                handleSelectUser(event, userData)
                              }
                              sx={{ cursor: "pointer" }}
                            >
                              <TableCell component="th" scope="row">
                                <Avatar src={userData.avatarurl} />
                              </TableCell>
                              <TableCell>{userData.id}</TableCell>
                              <TableCell>
                                <div>{userData.name}</div>
                                <Typography variant="caption">
                                  @{userData.username}
                                </Typography>
                              </TableCell>
                              <TableCell>{userData.email}</TableCell>
                              <TableCell>{userData.location}</TableCell>
                              <TableCell align="right">
                                <IconButton
                                  color="error"
                                  onClick={(e) => deleteRow(e, userData)}
                                >
                                  <Delete />
                                </IconButton>

                                <IconButton color="info">
                                  <ChevronRightRounded />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              ) : (
                <Paper sx={{ padding: "1rem" }}>
                  <div>
                    <Error fontSize="large" color="error" />
                  </div>
                  <div>
                    <Typography variant="h6">
                      There was an error loading the data.
                    </Typography>
                  </div>
                </Paper>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <UserAddForm open={open} closeHandler={handleClose} />
      <UserView
        userData={selectedUser}
        open={viewIsOpen}
        closeHandler={() => {
          setSelectedUser(null);
          setViewIsOpen(false);
        }}
      />
      <Dialog open={deleteConfirmationIsOpen}>
        <DialogTitle>Confirm Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="body1">
              This action is permanent and cannot be undone.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            onClick={() => {
              setUserToDelete(null);
              setDeleteConfirmationIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={confirmDeleteRow}
          >
            DELETE USER
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
