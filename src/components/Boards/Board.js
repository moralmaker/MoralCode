import React, { useState, useEffect } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import Badge from '@material-ui/core/Badge';

import Store from "../../services/Store";
const api = new Store();


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
  const data = props.data

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
 
  const getOnBoard = async (uid, bid,) => {
    try {
      const xx = await api.post('getOnBoard', {
        _id :  bid ,
        uid: uid
      });
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~", xx);
      return xx;
    } catch {
      throw new Error("api error - getOnBoard ");
    }
  };


  return data ? (
    <div>
      <h1>{data.board.name}</h1>
      {list(data.commandments)}
      <IconButton  color="primary"  onClick={() => {}}>Get On Board</IconButton>
    </div>
  ) : <span/>
}


export default Board;
