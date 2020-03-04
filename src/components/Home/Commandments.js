import React, { useState, useEffect } from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import Store from "../../services/Store";
const api = new Store();

const SupportCommandment = async (cid, uid, sign) => {
  console.log("66666666",cid,uid,sign)
  try {
    const xx = await api.post("support", {
      _id :  cid ,
      sign: sign,
      uid: uid
    });
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~", xx);
    return xx;
  } catch {
    throw new Error("api error - Commandment Support");
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



function Commandments(props) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();
  const [dense, setDense] = React.useState(false);
  const [refresh, setRefresh] = useState(1);    
 

  const list = (data, dense, uid) => {
    if (!data || !data[0]) return null;
    return (
      <List dense={dense}>
        {data.map(x => (
          <ListItem key={x._id}>
            <span>{x.support}</span>
            <IconButton aria-label="add" color="primary"  onClick={ async () => {
                await SupportCommandment(x._id, uid, 'p') 
                setIsLoading(true)
                setRefresh(refresh + 1)
              }
            }>
              <AddIcon />
            </IconButton>
            <IconButton aria-label="delete" color="primary"  onClick={ async () => {
                await SupportCommandment(x._id, uid, 'n') 
                setIsLoading(true)
                setRefresh(refresh + 1)  
                console.log('RERER',refresh)              
              }
            }>
              <DeleteIcon />
            </IconButton>            
            <ListItemText
              primary={x.text}
              secondary={x.author ? x.author : null}
            />
          </ListItem>
        ))}
      </List>
    );
  };  

  useEffect(() => {
    fetch(`https://moralcode.xyz/_db/moral/moral/com?active=false&uid=${props.uid}`, {
      method: "GET",
      headers: new Headers({})
    })
      .then(res => res.json())
      .then(response => {
        console.log("DDDData:",response)
        setData(response);
        setIsLoading(false);
      })
      .catch(error =>{
         console.log("in the f catch ",error)
         setTimeout(() => {
          setIsLoading(false);
         }, 500);
      });
  }, [refresh]);
  return (
    <div>
        <IconButton aria-label="add" color="primary" onClick={() => setRefresh(2)}> <h1> Commandments </h1></IconButton>

      {data.commandments && (
      <div className={classes.demo}>{list(data.commandments, dense, props.uid)}</div>
      )}
      <Backdrop className={classes.backdrop} open={isLoading} >
        <CircularProgress color="inherit" />
      </Backdrop>      
    </div>
  );
}

export default Commandments;
