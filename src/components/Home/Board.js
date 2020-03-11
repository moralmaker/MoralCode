import React, { useState, useEffect } from "react";

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
  const [type, setType] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [support, setSupport] = useState(props.support);
  const [supported, setSupported] = useState(!!props.supported);  
  const [unsupport, setUnsupport] = useState(props.unsupport);   
  const [unsupported, setUnsupported] = useState(!!props.supported);    
  const classes = useStyles();

 
  const Supportboard = async (cid, uid, edgeName) => {
    console.log("66666666",cid,uid,edgeName)
    try {
      const xx = await api.post(edgeName, {
        _id :  cid ,
        uid: uid
      });
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~", xx);
      return xx;
    } catch {
      throw new Error("api error - board Support");
    }
  };

  useEffect(() => {
    
      if(type !== '') {
        console.log("iuyfuiyrseuisyrkw,refresh", refresh, type)
        Supportboard(props._id, props.uid, type) 
      }
    },[refresh])

  return (
    <ListItem key={props._id}>          
            <IconButton  color={supported ? "secondary" : "primary"}  onClick={() => {
                setType('support')
                setSupported(!supported)
                setSupport(support + (supported === true ? -1 : 1 ))
                setRefresh(refresh +1)
              }
            }>
                <Badge  badgeContent={support} max={10000}>
                    <AddIcon />
                </Badge>    
            </IconButton>
            <IconButton aria-label="delete" color={unsupported ? "secondary" : "primary"}  onClick={ async () => {
                setType('unsupport')
                setUnsupported(!unsupported)
                setUnsupport(unsupport + (unsupported === true ? -1 : 1 ))   
                setRefresh(refresh +1)         
              }
            }><Badge  badgeContent={unsupport} max={10000}>
                <DeleteIcon />
              </Badge>
            </IconButton>            
            <ListItemText className={classes.board}
              primary={props.text}
              secondary={props.author ? props.author : null}
            />
          </ListItem>
  )
}


export default Board;
