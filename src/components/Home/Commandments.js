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
import Badge from '@material-ui/core/Badge';
import InfiniteScroll from "react-infinite-scroll-component";

import Store from "../../services/Store";
const api = new Store();


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

const Commandment =(props) => {
  const [type, setType] = useState('');
  const [support, setSupport] = useState(props.support);
  const [supported, setSupported] = useState(props.supported);  
  const [unsupport, setUnsupport] = useState(props.unsupport);   
  const [unsupported, setUnsupported] = useState(props.supported);    
  
  const SupportCommandment = async (cid, uid, edgeName) => {
    console.log("66666666",cid,uid,edgeName)
    try {
      const xx = await api.post(edgeName, {
        _id :  cid ,
        uid: uid
      });
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~", xx);
      return xx;
    } catch {
      throw new Error("api error - Commandment Support");
    }
  };

  useEffect(() => {
      if(type !== '') {
        const xxx = async () => await SupportCommandment(props._id, props.uid, type) 
      }
    },[support, unsupport])

  return (
    <ListItem key={props._id}>          
            <IconButton  color={supported ? "secondary" : "primary"}  onClick={() => {
                setType('support')
                setSupported(!supported)
                setSupport(support + (supported === true ? -1 : 1 ))
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
              }
            }><Badge  badgeContent={unsupport} max={10000}>
                <DeleteIcon />
              </Badge>
            </IconButton>            
            <ListItemText
              primary={props.text}
              secondary={props.author ? props.author : null}
            />
          </ListItem>
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
 
  const getCommandments = () => setIndex(index +10)    

  const list = (data, dense, uid) => {
    if (!data || !data[0]) return null;
    return (
      <List dense={dense}>
        {data.map(x => <Commandment  {...x} uid={uid}/>
        )}
      </List>
    );
  };  

  useEffect(() => {
    fetch(`https://moralcode.xyz/_db/moral/moral/com?active=false&uid=${props.uid}&offset=${index}&count=10&orderby=support`, {
      method: "GET",
      headers: new Headers({})
    })
      .then(res => res.json())
      .then(response => {
        response = response.commandments
        console.log("DDDData:",response)
        if((response.length || 0) < 10) setMore(false)
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
  }, [refresh, index]);
  return (
    <div>
        <IconButton aria-label="add" color="primary" onClick={() => setRefresh(2)}> <h1> Commandments </h1></IconButton>

      {data && (
        <div className={classes.demo}>
            {console.log("~~~~",index,more,data.length)}
          <InfiniteScroll
          dataLength={data.length || 0}
          next={getCommandments }
          hasMore={more}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
         {list(data, dense, props.uid)}
        </InfiniteScroll>

        </div>
      )}
      <Backdrop className={classes.backdrop} open={isLoading} >
        <CircularProgress color="inherit" />
      </Backdrop>      
    </div>
  );
}

export default Commandments;
