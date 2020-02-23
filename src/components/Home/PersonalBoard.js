import React, { useState, useEffect } from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";

import InputCommandment from "./InputCommandment";

import Store from "../../services/Store";
const api = new Store();

const addCommandment = async (commandment, boardid, uid) => {
  try {
    const xx = await api.post("addc", {
      commandment :  commandment ,
      boardid: boardid,
      uid: uid
    });
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~", xx);
    return xx;
  } catch {
    throw new Error("api error - new commandment");
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 20,
    maxWidth: 752
  },
  demo: {
    backgroundColor: theme.palette.background.black
  },
  title: {
    margin: theme.spacing(1, 1, 1)
  }
}));

const list = (data, dense) => {
  if (!data) return null;
  return (
    <List dense={dense}>
      {data.map(x => (
        <ListItem key={x.commandment.id}>
          <IconButton aria-label="delete" color="primary">
            <DeleteIcon />
          </IconButton>
          <ListItemText
            primary={x.commandment.text}
            secondary={x.commandment.author ? x.commandment.author : null}
          />
        </ListItem>
      ))}
    </List>
  );
};

function PersonalBoard(props) {
  console.log("UId:", `http://moralcode.xyz/api/personal?id=${props.uid}`);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();
  const [dense, setDense] = React.useState(false);
  const [newc, setNewc] = React.useState("");

  useEffect(() => {
    fetch(`http://moralcode.xyz/api/personal?id=${props.uid}`, {
      method: "GET",
      headers: new Headers({})
    })
      .then(res => res.json())
      .then(response => {
        console.log("resp", response);
        setData(response);
        setIsLoading(false);
      })
      .catch(error => console.log(error));
  }, [props.uid]);

  return (
    <div>
      {isLoading && <p>Wait I'm Loading comments for you</p>}
      {data.data && data.data[0] && (
        <IconButton aria-label="add" color="primary" onClick={async () => {
          const xxx = await addCommandment(newc, data.data[0].board.id, props.uid)
        }}>
          <AddIcon />
          <h1> {data.data[0].board.name} </h1>
        </IconButton>
      )}
      <InputCommandment setNewc={setNewc} newc={newc} />
      <div className={classes.demo}>{list(data.data, dense)}</div>
    </div>
  );
}

export default PersonalBoard;
/*        <InputCommandment setNewc={setNewc}/>*/
