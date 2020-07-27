import React from 'react';
import { connect } from 'react-redux';
import { Card, CardActionArea, CardMedia, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { selectRocket } from '../redux/actions/rocket';
import { selectLaunches } from '../redux/actions/launches';

const useStyles = makeStyles({
    card: {
        height: '200px',
        width: '300px',
    },
    cardContent: {
        padding: '10px',
        backgroundColor: 'rgb(0, 0, 0, 0.9)',
        color: 'white'
    },

});

const RocketCard = ({ rocketId, rocketName, image, onCardClick, getLaunches }) => {

    const classes = useStyles();

    return (
        <React.Fragment>
            <Card onClick={() => { onCardClick(rocketId, rocketName) }}>
                <CardActionArea>
                    <CardMedia component="img" alt={rocketName} image={image} title={rocketName} />
                    <CardContent className={classes.cardContent}>
                        {rocketName}
                    </CardContent>
                </CardActionArea>
            </Card>
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

export default connect(mapStateToProp, mapDispatchToProps)(RocketCard);