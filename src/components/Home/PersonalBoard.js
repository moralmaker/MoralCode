import React, { useState, useEffect } from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIconCircle from '@material-ui/icons/AddCircleOutline'

import FadeIn from 'react-fade-in'
import Joyride from 'react-joyride';

import InputCommandment from "./InputCommandment";

import Store from "../../services/Store";
const api = new Store();


const tourSteps = [
  {
    content: (<div>Let's start seting up your moral code.<br/> You can set up to 5 moral <b>Commandments</b> on your Board<br/>
    <h2>pick Wisley</h2></div>) ,
    placement: 'center',
    target: 'body',
    disableBeacon: true,
    disableOverlay: true
  },
  {
    content: <div>You can pick a <b>commandment</b> from the existing <b>commandment</b>s or you can enter your own fresh <b>commandment</b>.<br/>
    <i>Click</i> on the commandments box and start typing., while you type we might suggest some <b>commandment</b>s for you to pick</div>,

    placement: 'right',
    target: '.input_com',
    disableBeacon: true,
    disableOverlay: true,
    title: 'Moral Input', 
    styles: {
      options: {
        width: 300,
      },
    },       
  },
  {
    content: <div>After you made up your mind and choose your precious <b>commandment</b> press this button to set it as one of the <b>commandment</b>s that make up your <i>Moral Code</i></div>,
    placement: 'bottom',
    styles: {
      options: {
        width: 300,
      },
    },
    target: '.add_com',
    title: 'Our projects',
    disableBeacon: true,
    disableOverlay: true,
    spotlightClicks: true
  },  

]

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
  const { open, close, isOpen } = props.tour
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();
  const [dense, setDense] = React.useState(false);
  const [newc, setNewc] = React.useState("");
  const [stepIndex, setStepIndex] = React.useState(0); 
  const [tourClick, setTourClick] = React.useState(false);     
  const [run, setRun] = React.useState(true);  

  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;
    const finishedStatuses = ['finished', 'skipped'];

    if (finishedStatuses.includes(status)) {
      setRun(true)
      close()
    }
    console.groupCollapsed(type);
    console.log(data);
    console.groupEnd();
  };

  const handleClickOpen = () => {
    console.log("brr")
      setTourClick(!tourClick)
      setStepIndex(stepIndex === 0 ? 1 : stepIndex)
  
  };  

  
  const list = (data, dense, uid) => {
    if (!data || !data[0] || !data[0].commandment) return null;
    return (
      <List dense={dense}>
        <FadeIn delay={500} transitionDuration={1000}>
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
        </FadeIn>
      </List>
    );
  };  

  useEffect(() => {
    fetch(`https://moralcode.xyz/_db/moral/moral/personal?uid=${props.uid}`, {
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
        <Joyride
          callback={handleJoyrideCallback}
          continuous={true}
         // getHelpers={this.getHelpers}
          run={run && props.tour.isOpen}
          scrollToFirstStep={true}
          showProgress={false}
          showSkipButton={true}
          steps={tourSteps}
          styles={{
            options: {
              zIndex: 10000,
            },
          }}
        />
      {isLoading && <p>Wait I'm Loading comments for you</p>}
      {data.data && data.data[0] && (
        <IconButton  aria-label="add" color="primary" onClick={async () => {
          await addCommandment(newc, data.data[0].board.id, props.uid)
          setIsLoading(true)
        }}>
          <AddIconCircle className="add_com" />
        </IconButton>
      )}
      <div className="input_com" onClick={handleClickOpen}><InputCommandment  setNewc={setNewc} newc={newc} uid={props.uid} /></div>
      <div className={classes.demo}>{list(data.data, dense, props.uid)}</div>
      <Backdrop className={classes.backdrop} open={isLoading} >
        <CircularProgress color="inherit" />
      </Backdrop>       
    </div>
  );
}

export default PersonalBoard;
/*        <InputCommandment setNewc={setNewc}/>*/
