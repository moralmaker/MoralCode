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
  console.log("66666666",commandment, boardid, uid)
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

const removeCommandment = async (commandmentId, boardId, uid) => {
  try {
    console.log("___", commandmentId, boardId, uid)
    const xx = await api.post("removec", {
      _from :  commandmentId ,
      _to : boardId,
      uid: uid
    });
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~", xx);
    return xx;
  } catch {
    throw new Error("remove commandment failed");
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



function PersonalBoard(props) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();
  const [dense, setDense] = React.useState(false);
  const [newc, setNewc] = React.useState("");


  const list = (data, dense, uid) => {
    if (!data || !data[0].commandment) return null;
    return (
      <List dense={dense}>
        {data.map(x => (
          <ListItem key={x.commandment.id}>
            <IconButton aria-label="delete" color="primary"  onClick={ async () => {
                await removeCommandment(x.commandment.id, x.board.id, uid) 
                setIsLoading(true)
              }
            }>
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

  useEffect(() => {
    fetch(`http://moralcode.xyz/_db/moral/moral/personal?uid=${props.uid}`, {
      method: "GET",
      headers: new Headers({})
    })
      .then(res => res.json())
      .then(response => {
        console.log("resp", response);
        setData(response);
        setIsLoading(false);
      })
      .catch(error =>{
         console.log("in the f catch ",error)
         setTimeout(() => {
          setIsLoading(false);
         }, 500);
      });
  }, [isLoading]);

  return (
    <div>
      {isLoading && <p>Wait I'm Loading comments for you</p>}
      {data.data && data.data[0] && (
        <IconButton aria-label="add" color="primary" onClick={async () => {
          const xxx = await addCommandment(newc, data.data[0].board.id, props.uid)
          console.log("____",this)
          setIsLoading(true)
        }}>
          <AddIcon />
          <h1> {data.data[0].board.name} </h1>
        </IconButton>
      )}
      <InputCommandment setNewc={setNewc} newc={newc} uid={props.uid} />
      <div className={classes.demo}>{list(data.data, dense, props.uid)}</div>
    </div>
  );
}

export default PersonalBoard;
/*        <InputCommandment setNewc={setNewc}/>*/
