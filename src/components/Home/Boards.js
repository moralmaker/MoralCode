import React, { useState, useEffect } from "react";

import List from "@material-ui/core/List";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Badge from '@material-ui/core/Badge';

import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import "./boards.css";
import {usePosition} from  "../../services/GeoHook";

import Board from "./Board";
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

const  Boards = (props) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();
  const [dense, setDense] = React.useState(false);
  const [refresh, setRefresh] = useState(1);    
  const [index, setIndex] = useState(0);
  const [more, setMore] = useState(true);   

  const {latitude, longitude, error} = usePosition();  

  const getboards = () => setIndex(index +10)    

  const list = (data, dense, uid) => {
    if (!data || !data[0]) return null;
    return (
      <List dense={dense}>
        {data.map(x => <board  {...x} uid={uid}/>
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
        response = response.boards
        console.log("DDDData:",response)
        if((response.length || 0) < 10) setMore(false)
        const boards = index === 0  ? response : [...data, ...response]
        setData(boards);
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
        <link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
  integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
  crossorigin=""
/>
        <IconButton aria-label="add" color="primary" onClick={() => setRefresh(2)}> <h3> boards </h3></IconButton>

   
      {data && (
        <div className={classes.demo}>
            {console.log("~~~~",index,more,data.length)}
            {latitude && <Map center={[latitude, longitude]} zoom={12}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
            </Map>}

         {list(data, dense, props.uid)}


        </div>
      )}
      <Backdrop className={classes.backdrop} open={isLoading} >
        <CircularProgress color="inherit" />
      </Backdrop>      
    </div>
  );
}

export default Boards;
