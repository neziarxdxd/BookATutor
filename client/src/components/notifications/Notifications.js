

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ProgressSpinner from '../common/ProgressSpinner';

import { connect } from 'react-redux';
import { getMessages } from '../../redux/actions/messageActions';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import {
  CardActions,
  CardContent,
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  IconButton
} from '@material-ui/core';

import PerfectScrollbar from 'react-perfect-scrollbar';
import uuid from 'uuid/v1';


import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {},
    content: {
      padding: 0
    },
    inner: {
      minWidth: 1050
    },
    nameContainer: {
      display: 'flex',
      alignItems: 'center'
    },
    avatar: {
      marginRight: 10
    },
    actions: {
      justifyContent: 'flex-end'
    },
    card: {
      minWidth: 300,
      margin: 100
    },
    marginBottom20: {
        marginBottom: 20,
    },
    purpleHeader: {
        margin: 10,
        color: '#fff',
        backgroundColor: '#1E1656',
     },
     purpleText: {
         color: '#1E1656'
     },
     media: {
        objectFit: 'cover',
     },
     success: {
         backgroundColor: '#EEAF30'
     },
     message: {
       display: 'flex',
       alignItems: 'center',
     }
});


class Notifications extends Component {
  state = {
    rowsPerPage: 10,
    selectedUsers: [],
    page: 0,
  }

  componentDidMount() {
    console.log(this.props.auth.user.id)
    this.props.getMessages(this.props.auth.user.id)
  }

  render() {
      const { classes } = this.props;
      const { user } = this.props.auth;
      const { messages, loading } = this.props.message;
      const { rowsPerPage, selectedUsers, page } = this.state;

      let notificationContent;

      if (user.isTutor) {
        if (messages === null || loading) {
          notificationContent = <ProgressSpinner />
        } else {
           notificationContent = Object.keys(messages).length > 0 ? (
            <Card>
              <CardContent className={classes.content}>
                <PerfectScrollbar>
                  <div className={classes.inner}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Meetup Address/Online site</TableCell>
                          <TableCell>Phone</TableCell>
                          <TableCell>Meeting Time</TableCell>
                          <TableCell>Duration (in hours)</TableCell>
                          <TableCell>Subject to teach</TableCell>
                          <TableCell>Accept or Reject</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {messages.map(user => (
                          <TableRow
                            className={classes.tableRow}
                            hover
                            key={user.id}
                            selected={selectedUsers.indexOf(user._id) !== -1}
                          >
                            <TableCell>
                              <div className={classes.nameContainer}>
                                <Avatar
                                  className="purpleAvatar"
                                  src={user.avatarUrl}
                                >
                                  {user.userdetails[0].firstname.charAt(0) + user.userdetails[0].lastname.charAt(0)} 
                                </Avatar>
                                <Typography variant="body1">{user.userdetails[0].firstname + " " + user.userdetails[0].lastname}</Typography>
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              {user.meetup}
                            </TableCell>
                            <TableCell>{user.phone}</TableCell>
                            <TableCell>
                              {user.time}
                            </TableCell>
                            <TableCell>
                              {user.duration}
                            </TableCell>
                            <TableCell>
                              {user.subjects}
                            </TableCell>
                            <TableCell>
                              <Tooltip title="Accept Student">
                                <span><IconButton>
                                    <CheckCircleIcon />
                                </IconButton></span>
                              </Tooltip>
                              <Tooltip title="Decline Student">
                                <span><IconButton>
                                    <CancelIcon />
                                </IconButton></span>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </PerfectScrollbar>
              </CardContent>
            </Card> ) : (
              <Grid item xs={12}>
                  <div className="padding20">
                      <Typography align="center" className="colorBlue"><WarningIcon id="warning"/> </Typography>
                      <Typography variant="h4" align="center" gutterBottom>No notifications found.</Typography>
                      <Typography variant="subtitle1" align="center">Check later for possible tutor appointments.</Typography>
                  </div>
              </Grid>
            )
        }
      }
        return (
            <React.Fragment>
              <div className="padding20">
                  <Typography variant="h4" component="h1" align="center" className="editHeading">
                      Notifications
                  </Typography>
                  <br/>
              </div>
              {notificationContent}
              
            </React.Fragment>
        );
    }
}

Notifications.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth,
    studentprofile: state.studentprofile,
    message: state.message
});

export default connect(mapStateToProps, { getMessages })(withStyles(styles)(Notifications));

