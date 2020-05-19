import React, { useState, useEffect } from "react";

import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Badge from "@material-ui/core/Badge";
import Drawer from "@material-ui/core/Drawer";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import AddIconCircle from '@material-ui/icons/AddCircleOutline'
import AccountCircle from '@material-ui/icons/AccountCircle';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import { Map, Circle, Popup, Tooltip, TileLayer } from "react-leaflet";
import "./boards.css";
import { usePosition } from "../../services/GeoHook";

import EmptyState from "../EmptyState";

import Board from "./Board";
import Store from "../../services/Store";
const api = new Store();

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 20,
    //maxWidth: 752
  },
  form: {
    "& > *": {
      margin: theme.spacing(1),
      width: 200
    }
  },
  p2:{
    margin: '2%'
  } , 
  demo: {
    //backgroundColor: theme.palette.background.black
  },
  title: {
    margin: theme.spacing(1, 1, 1)
  },
  board: {
    fontFamily: "Times New Roman"
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },  
  list: {
    width: 250
  },
  fullList: {
    width: "auto"
  },
  input: {
    marginTop: 50,
    display: "block"
  },
  bbox: {
    maxWidth: 345,
  },  
}));

const Boards = props => {
  const [geoboards, setGeoBoards] = useState([]);
  const [userboards, setUserBoards] = useState([]);  
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();
  const [refresh, setRefresh] = useState(1);
  const [index, setIndex] = useState(0);
  const [newBoardName, setNewBoardName] = useState("");
  const [radius, setRadius] = useState(20);
  const [colorMulti, setColorMulti] = useState(1);
  const [newBoardDrawer, setNewBoardDrawer] = useState(false);
  const [showBoardDrawer, setShowBoardDrawer] = useState(false);  
  const [showBoardIndex, setShowBoardIndex] = useState(0);    
  const [showUserBoards, setShowUserBoards] = useState(false);     
  const { latitude, longitude, error } = usePosition(false);
  

  const NewBoard = async () => {
    try {
      const xx = await api.post("addb", {
        name: newBoardName,
        latitude,
        longitude,
        radius,
        uid
      });
      if (xx) setRefresh(refresh);
    } catch {
      throw new Error("api error - add new board");
    }
  };

  const offBoard = async (board_id) => {
    try {
      const xx = await api.post("removeb", {
        board_id,
        uid
      });
      setRefresh(refresh +1)
      if (userboards === []) setShowUserBoards(!showUserBoards);      
    } catch {
      throw new Error("api error - add new board");
    }
  };  

  const toggleNewBoard = () => event => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setNewBoardDrawer(!newBoardDrawer);
  };

  const toggleShowBoard = (index) => event => {
    //get the board index
    setShowBoardIndex(index)//get the board index
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setShowBoardDrawer(!showBoardDrawer);
  };

  const toggleShowUserBoards = (index) => event => {
    //get the board index
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setShowUserBoards(!showUserBoards);
    setRefresh(refresh +1)
  };  

  const showBoard = () => {

    return  (<Board geoboards={geoboards[showBoardIndex]} uid={props.uid} back={() => {
      setShowBoardDrawer(false)
      setRefresh(refresh +1)
    }  }/>)
  }


  const getNewBoard = () => (
    <div className={classes.form} role="presentation">
      <TextField
        className={classes.input}
        id="inputName"
        label="Name"
        onChange={e => setNewBoardName(e.target.value)}
      />
      <TextField
        className={classes.input}
        type="number"
        id="inputRadius"
        label="Radius"
        onChange={e => setRadius(e.target.value)}
      />
      <IconButton
        aria-label="add"
        className={classes.input}
        color="primary"
        onClick={NewBoard}
      >
        {" "}
        New Borad{" "}
      </IconButton>
    </div>
  );


  const userBoardsView  = () => (
    <div className={classes.p2}>
      <Grid container spacing={3} xl={12} >
      <IconButton aria-label="add" color="primary" onClick={toggleShowUserBoards()}>
        {" "}
        < ArrowBackIosIcon/> 
      </IconButton>             
      {userboards.map(x=>x.board).map(x => {
        return (  
        <Grid item   className={classes.paper}>
          <Badge  color='secondary' anchorOrigin={{vertical: 'top', horizontal: 'left' }} badgeContent={x.members} max={10000}>
            <Paper className={classes.paper}>
              <Typography gutterBottom variant="h5" component="h2">
               {x.name}
              </Typography> 
              <Button size="small" onClick={() => offBoard(x._id)} color="primary">
                GetOffBoard
              </Button>                        
            </Paper>
          </Badge>  
        </Grid>
         )
      })}
      </Grid>

    </div> 
  )


  useEffect(() => {
    const link = `https://moralcode.xyz/_db/moral/moral/geoBoards?latitude=${latitude}&longitude=${longitude}&uid=${
      props.uid
    }&redius=${2000}`;
    console.log("_____    ", link);

    latitude &&
      fetch(link, {
        method: "GET",
        headers: new Headers({})
      })
        .then(res => res.json())
        .then(response => {
          const gb = response.geoBoards;
          const ub = response.userBoards;
          console.log("DDDGeoBoards:", response);
          const geoBoards = index === 0 ? gb : [...geoboards, ...gb];
          const scoreArray = geoBoards.map(x => x !== null ? x.score : 0)
          const maxScore = Math.max(...scoreArray)
          //const minScore = Math.min(...scoreArray)

          geoBoards.forEach((x,i) => x.index = i)

          setColorMulti(255 / maxScore)  
          setUserBoards(ub)                            
          setGeoBoards(geoBoards);
          setIsLoading(false);

        })
        .catch(error => {
          console.log("in the f catch ", error);
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        });
  }, [refresh, index, latitude]);

  const { uid } = props;

  return uid ? (
    <div>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
        integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
        crossOrigin=""
      />
      <IconButton aria-label="add" color="primary" onClick={toggleNewBoard()}>
        {" "}
        <AddIconCircle/>
      </IconButton>

      <IconButton aria-label="add" color="primary" onClick={toggleShowUserBoards()}>
        {" "}
        <AccountCircle/>
      </IconButton>      
     
      {geoboards && (
        <div className={classes.demo}>
          {latitude && (
            <Map center={[latitude, longitude]} zoom={16}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {geoboards.map(x => {
                  console.log("-", x);
                  return (
                    <Circle
                      key={x.board._key}
                      color={x.onboard[0] ? 'red' : `rgb(0, ${255 - Math.floor(x.score * colorMulti)}, 255)`}
                      //color={x.onboard[0] ? 'blue' : `rgb(255,255,0)`}
                      center={x.board.location.coordinates}
                      radius={parseInt(x.board.radius)}
                      onClick={toggleShowBoard(x.index)}
                    > </Circle>
                  );
                })}
              <Circle center={[latitude, longitude]} radius={100} fillColor='red' ></Circle>
            </Map>
          )}    



        </div>
      )}
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Drawer anchor="left" open={newBoardDrawer} onClose={toggleNewBoard()}>
        {getNewBoard()}
      </Drawer>
      <Drawer anchor="right" open={showBoardDrawer} onClose={toggleShowBoard()}>
        {showBoard()}
      </Drawer>   
      <Drawer anchor="bottom" open={showUserBoards} onClose={toggleShowUserBoards()}>
        {userBoardsView()}
      </Drawer>           
    </div>
  ) : (
    <EmptyState
      title={process.env.REACT_APP_TITLE}
      description={process.env.REACT_APP_DESCRIPTION}
    />
  );
};

export default Boards;
//  {list(geoboards, dense, props.uid)}
