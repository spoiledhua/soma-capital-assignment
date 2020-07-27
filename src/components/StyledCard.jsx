import React from 'react';
import { Paper, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    content: {
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingTop: '6px',
        paddingBottom: '6px',
    },
    top: {
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingTop: '12px',
        paddingBottom: '6px',
    },
    end: {
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingTop: '6px',
        paddingBottom: '12px',
    },
    header: {
        marginTop: '0px',
        marginBottom: '0px',
    },
    paper: {
        borderRadius: '8px'
    }
});

const StyledCard = ({ rocketName, type, details, location, launchDate }) => {

    const classes = useStyles();

    return (
        <React.Fragment>
            <Paper className={classes.paper} elevation={5}>
                <Grid>
                    <Grid className={classes.top} item><h3 className={classes.header}>Rocket Name: {rocketName}</h3></Grid>
                    <Grid className={classes.content} item><Typography color="textSecondary"><strong>Type: </strong>{type}</Typography></Grid>
                    <Grid className={classes.content} item><strong>Details: </strong>{details}</Grid>
                    <Grid className={classes.content} item><strong>Location: </strong>{location}</Grid>
                    <Grid className={classes.end} item><strong>Launch Date: </strong>{launchDate}</Grid>
                </Grid>
            </Paper>
        </React.Fragment>
    )
}

export default StyledCard;
