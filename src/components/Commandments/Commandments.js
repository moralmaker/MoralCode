import React, { useState, useEffect } from "react";

import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import IconButton from "@material-ui/core/IconButton";
import LoveIcon from "@material-ui/icons/Favorite";
import HateIcon from "@material-ui/icons/NotInterested";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import InfiniteScroll from "react-infinite-scroll-component";

import Joyride from 'react-joyride';
import FadeIn from 'react-fade-in'
import InputCommandment from "../Home/InputCommandment";
import Store from "../../services/Store";
const api = new Store();


const tourSteps = [
  {
    content: (<div>You are welcome to browes all the Commandments that had ever been entered.<br/> 
     <h2>Browse them all</h2></div>) ,
    placement: 'center',
    target: 'body',
    disableBeacon: true,
    disableOverlay: true
  },
  {
    content: <div><i>ok, ok,</i> if you dont have the time to browes them all just now you can use this filter to search for specific ones.</div>,
    placement: 'right',
    target: '.input_com',
    disableBeacon: true,
    disableOverlay: true,
    title: 'Filter',     
  },
  {
    content: <div> Show your <i>LOVE</i>. loved commandments are more visiable<br/>This is the most loved commandment.</div>,
    target: '.love_com',
    disableBeacon: true,
    disableOverlay: true,
    title: 'Love',       
  },
  {
    content: <div>some of these commandments are just appalling. <br/>if reading it makes you angry your are most welcome to <i>HATE</i> it</div>,
    target: '.hate_com',
    disableBeacon: true,
    disableOverlay: true,
    title: 'Hate',       
  },    
  {
    content: <div>if you think - "Hey, this is a perfectly good commadment, i want it to be on my board" click here.<br/>
    if you have less then five commandments on your board this one will join in.</div>,
    placement: 'bottom',
    target: '.add_com',
    title: 'Add it',
    disableBeacon: true,
    disableOverlay: true,
    spotlightClicks: true
  },  

]


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 20,
   },
  demo: {
    fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
    fontSize : "15" ,    
    backgroundColor: theme.palette.background.black
  },
  p2:{
    margin: '0.5%',
    flexGrow: 20,    
    initialLetter: 2
  }, 
  p3:{
    position: 'reltive',
    left: 20
  },    
  title: {
    margin: theme.spacing(1, 1, 1)
  },
  commandment : {  
    fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
    fontSize : "15" ,
    initialLetter: 2
  },   
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
     <Card className={classes.root}>
      <CardHeader
        style={{fontFamily: 'Palatino Linotype'}}
        avatar={
          <Avatar aria-label="commandment" size="220%" variant="square" className={classes.avatar}>
            {props.text.charAt(0)}
          </Avatar>
        }

        title={props.text}
        subheader={props.author}
      />  
        <CardActions disableSpacing>

        <IconButton className="love_com" color={supported ? "secondary" : "primary"}  onClick={() => {
                setType('support')
                setSupported(!supported)
                setSupport(support + (supported === true ? -1 : 1 ))
                setRefresh(refresh +1)
              }
            }>
                <Badge  badgeContent={support} max={10000}>
                    <LoveIcon />
                </Badge>    
            </IconButton>
            <IconButton className="hate_com" aria-label="delete" color={unsupported ? "secondary" : "primary"}  onClick={ async () => {
                setType('unsupport')
                setUnsupported(!unsupported)
                setUnsupport(unsupport + (unsupported === true ? -1 : 1 ))   
                setRefresh(refresh +1)         
              }
            }><Badge  badgeContent={unsupport} max={10000}>
                <HateIcon />
              </Badge>
            </IconButton>
            <IconButton className="add_com" color="primary"  onClick={ async () => {
                setType('gob')
                setRefresh(refresh +1)
            }}>
              <AddIcon/>           
            </IconButton>  

        </CardActions>      
      </Card>     
     </Paper>
  </Grid>
  )
}


const  Commandments = (props) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();
  const [refresh, setRefresh] = useState(1);    
  const [index, setIndex] = useState(0);
  const [more, setMore] = useState(true); 
  const [newc, setNewc] = React.useState("");

  const { open, close, isOpen } = props.tour
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


  const getCommandments = () => setIndex(index +30)    

  const list = (data, uid) => {
    if (!data || !data[0]) return null;
    return (
      <FadeIn delay={500} transitionDuration={1000}>
      <Grid container spacing={1} >

          {data.map(x => <Commandment  key={x._id} {...x} uid={uid}/>
          )}
        
      </Grid>
      </FadeIn>
    );
  };  

  useEffect(() => {
    fetch(`https://moralcode.xyz/_db/moral/moral/com?uid=${props.uid}&offset=${index}&count=30&orderby=support&text=${newc}`, {
      method: "GET",
      headers: new Headers({})
    })
      .then(res => res.json())
      .then(response => {
        const old_ids = data.map(x => x._id) //  help filter the doublle fetched data
        const resl = response.commandments && response.commandments.length // check if there is more data to fetch
        response = response.commandments.map(x => old_ids.includes(x._id) ? 0 : x).filter(x => x)
        console.log("DDDData:",response, resl)
        if((resl || 0) < 30) setMore(false)
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
        <div className="input_com"   style={{marginTop: 18}}>
          <InputCommandment  setNewc={setNewc} newc={newc} uid={props.uid} showes={false}/>
        </div>
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
