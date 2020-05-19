import React, { useState, useEffect } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { makeStyles } from "@material-ui/core/styles";
import Badge from '@material-ui/core/Badge';

import Store from "../../services/Store";
const api = new Store();

const gob = async (boardId, uid ,back) => {
  try {
    const xx = await api.post('gob', {
      boardId :  boardId ,
      uid: uid
    });
    console.log("xx:",xx)
    back()
    return xx;
  } catch {
    throw new Error("api error - GetOnBoard");
  }
};

const useStyles = makeStyles(theme => ({

  root: {
    flexGrow: 20,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.black
  },
  title: {
    margin: theme.spacing(1, 1, 1)
  },
  board : {
    fontFamily: "Times New Roman"
  }
}));

const Board = (props) => {
  const data = props.geoboards

  const list = (data, dense) => {
        
    if (!data) return null;
    return (
      <List dense={dense}>
        {data.map(x => (
          <ListItem key={x._id}>
            <Badge  color='primary' anchorOrigin={{vertical: 'bottom', horizontal: 'left' }} badgeContent={x.cnt} max={10000}>               
              <ListItemText
                primary={x.text}
                secondary={x.author ? x.author : null}
              />
            </Badge> 
          </ListItem>
        ))}
      </List>
    );
  };
 
  console.log("propsss   ",props)
  return data ? (
    <div>
      <h1>{data.board.name}</h1>
      {list(data.commandments)}
      <IconButton  color="primary"  onClick={() => gob(data.board._id, props.uid ,props.back)}>Get On Board</IconButton>

      <IconButton  color="primary" style={{ position: 'absolute',  bottom: 0,  left: 0 }} onClick={props.back}>< ArrowBackIosIcon/></IconButton>      
    </div>
  ) : <span/>
}


export default Board;
