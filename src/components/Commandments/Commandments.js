import React, { useState, useEffect } from "react";

import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import GOBIcon from "@material-ui/icons/DeviceHub";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Badge from '@material-ui/core/Badge';
import InfiniteScroll from "react-infinite-scroll-component";

import InputCommandment from "../Home/InputCommandment";
import Store from "../../services/Store";
const api = new Store();



const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 20,
   },
  demo: {
    backgroundColor: theme.palette.background.black
  },
  p2:{
    margin: '0.5%',
  },   
  title: {
    margin: theme.spacing(1, 1, 1)
  },
  commandment : {
    fontFamily: "Times New Roman"
  }
}));

const Commandment =(props) => {
  const [type, setType] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [support, setSupport] = useState(props.support);
  const [supported, setSupported] = useState(!!props.supported);  
  const [unsupport, setUnsupport] = useState(props.unsupport);   
  const [unsupported, setUnsupported] = useState(!!props.supported);    
    const classes = useStyles();
  
  const SupportCommandment = async (cid, uid, edgeName) => {
    try {
      const xx = await api.post(edgeName, {
        _id :  cid ,
        uid: uid
      });
      return xx;
    } catch {
      throw new Error("api error - Commandment Support");
    }
  };

  const GOB = async (cid, uid) => {
    try {
      const xx = await api.post('addec', {
        cid: cid,
        uid: uid
      });
      return xx;
    } catch {
      throw new Error("api error - GetOnBoard");
    }
  };  

  useEffect(() => {
      if(type === 'gob') GOB(props._id, props.uid)
      if(type !== '' && type !== 'gob') {
        SupportCommandment(props._id, props.uid, type) 
      }
    },[refresh])

  return (

    <Grid item xs='auto'  key={props._id} className={classes.p2} >
     <Paper className={classes.paper} >

     <ListItemText className={classes.commandment}
              primary={props.text}
              secondary={props.author ? props.author : null}
              className={classes.p2}
            />

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
            <IconButton  color={supported ? "secondary" : "primary"}  onClick={ async () => {
                setType('gob')
                setRefresh(refresh +1)
            }}>
              <GOBIcon/>           
            </IconButton>  

     </Paper>
  </Grid>
  )
}


const  Commandments = (props) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();
  const [dense, setDense] = React.useState(false);
  const [refresh, setRefresh] = useState(1);    
  const [index, setIndex] = useState(0);
  const [more, setMore] = useState(true); 
  const [newc, setNewc] = React.useState("");
  
 
  const getCommandments = () => setIndex(index +30)    

  const list = (data, uid) => {
    if (!data || !data[0]) return null;
    return (
      <Grid container spacing={1} >
        {data.map(x => <Commandment  key={x._id} {...x} uid={uid}/>
        )}
      </Grid>
    );
  };  

  useEffect(() => {
    fetch(`https://moralcode.xyz/_db/moral/moral/com?uid=${props.uid}&offset=${index}&count=30&orderby=support&text=${newc}`, {
      method: "GET",
      headers: new Headers({})
    })
      .then(res => res.json())
      .then(response => {
        response = response.commandments
        console.log("DDDData:",response)
        if((response.length || 0) < 30) setMore(false)
        const commandments = index === 0  ? response : [...data, ...response]
        setData(commandments);
        setIsLoading(false);
      })
      .catch(error =>{
         console.log("in the f catch ",error)
         setTimeout(() => {
          setIsLoading(false);
         }, 500);
      });
  }, [refresh, index, newc]);
  return (
    <div>
        <IconButton aria-label="add" color="primary" onClick={() => setRefresh(2)}> <h3> Commandments </h3></IconButton>
        <InputCommandment setNewc={setNewc} newc={newc} uid={props.uid} />
      {data && (
        <div className={classes.demo}>
          <InfiniteScroll
          dataLength={data.length || 0}
          next={getCommandments }
          hasMore={more}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b></b>
            </p>
          }
        >
         {list(data, props.uid)}
        </InfiniteScroll>

        </div>
      )}
      <Backdrop className={classes.backdrop} open={isLoading} >
        <CircularProgress color="inherit" />
      </Backdrop>      
    </div>
  );
}

Commandments.propTypes = {
  user: PropTypes.object
};

export default Commandments;
