import React from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Button from '../components/Button';
import StyledCard from '../components/StyledCard';
import RocketCard from '../components/RocketCard';

import falcon1 from '../images/falcon1.jpg';
import falcon9 from '../images/falcon9.jpg';
import falconheavy from '../images/falconheavy.jpg';
import starship from '../images/starship.jpg';

import { selectRocket } from '../redux/actions/rocket';
import { selectLaunches } from '../redux/actions/launches';

const useStyles = makeStyles({
  container: {
    padding: '50px',
    paddingTop: '30px',
    backgroundColor: 'rgb(225, 225, 225)'
  },
  title: {
    paddingBottom: '30px'
  },
  missionTitle: {
    paddingTop: '30px',
    paddingBottom: '30px',
  },
  card: {
    padding: '10px'
  },
  row: {
    paddingBottom: '20px'
  },
  textField: {
    backgroundColor: 'white'
  }
});

const HomePage = ({ rocket, launches, selectRocket, selectLaunches }) => {

  const classes = useStyles();

  useEffect(() => {
    selectLaunches(rocket.rocketId);
  }, [rocket]);

  return (
    <React.Fragment>
      <div className={classes.container}>
        <Grid container direction="row">
          <Grid className={classes.title} item align="left" xs={12} sm={12} md={8} lg={8} xl={8}>
            <h1>SpaceX Rockets</h1>
          </Grid>
          <Grid className={classes.title} item align="center" xs={12} sm={12} md={4} lg={4} xl={4}>
            <TextField className={classes.textField} placeholder="Search Missions..." type="search" variant="outlined" fullWidth />
          </Grid>
          <Grid className={classes.card} item align="center" xs={12} sm={6} md={3} lg={3} xl={3}>
            <RocketCard rocketId="falcon1" rocketName="Falcon 1" image={falcon1} onCardClick={selectRocket} getLaunches={selectLaunches} />
          </Grid>
          <Grid className={classes.card} item align="center" xs={12} sm={6} md={3} lg={3} xl={3}>
            <RocketCard rocketId="falcon9" rocketName="Falcon 9" image={falcon9} onCardClick={selectRocket} getLaunches={selectLaunches} />
          </Grid>
          <Grid className={classes.card} item align="center" xs={12} sm={6} md={3} lg={3} xl={3}>
            <RocketCard rocketId="falconheavy" rocketName="Falcon Heavy" image={falconheavy} onCardClick={selectRocket} getLaunches={selectLaunches} />
          </Grid>
          <Grid className={classes.card} item align="center" xs={12} sm={6} md={3} lg={3} xl={3}>
            <RocketCard rocketId="bfr" rocketName="Starship" image={starship} onCardClick={selectRocket} getLaunches={selectLaunches} />
          </Grid>
          <Grid className={classes.missionTitle} item align="left" xs={12} sm={12} md={12} lg={12} xl={12}>
            <h1>{rocket.rocketName} Missions</h1>
          </Grid>
          {launches.map(launch => {
            return (
              <Grid className={classes.row} item align="left" xs={12} sm={12} md={12} lg={12} xl={12}>
                <StyledCard rocketName={launch.rocket.rocket_name} type={launch.rocket.rocket_type} details={launch.details} location={launch.launch_site.site_name_long} launchDate={(new Date(launch.launch_date_utc)).toLocaleDateString()} />
              </Grid>
              )
            })
          }
        </Grid>
        </div>
    </React.Fragment>
  )
}

const mapStateToProp = (state) => {
  const { rocket, launches } = state;
  return {
    rocket: rocket.rocket,
    launches: launches.launches,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    selectRocket: (rocketId, rocketName) => {
      dispatch(selectRocket(rocketId, rocketName))
    },
    selectLaunches: rocketId => {
      dispatch(selectLaunches(rocketId))
    },
  }
}

export default connect(mapStateToProp, mapDispatchToProps)(HomePage);
