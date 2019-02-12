import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// redux import
import { connect } from 'react-redux';

// MUI imports
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import MailIcon from '@material-ui/icons/Email';
import CalendarIcon from '@material-ui/icons/EventAvailable';
import InfoIcon from '@material-ui/icons/Info';

const styles = theme => ({
    card: {
      minWidth: 100,
    }
});

const ProfileItem = props => {
    const { profile, auth } = props;

    const classesCard = profile.courses !== undefined ? (
        <React.Fragment>
            {profile.courses.slice(0, 5).map((myClass, index) => (
                <Chip className="chip" key={index} label={`${myClass.courseId} ${myClass.courseNumber}`} />
            ))}
        </React.Fragment>

    ) : (
        <p>No classes listed</p>
    )

    // Create initials and short version of name for use on card
    const firstname = profile.user.firstname;
    const lastname = profile.user.lastname;
    const initials =  (firstname && lastname) ? firstname.charAt(0) + lastname.charAt(0) : '';
    const shortname = (firstname && lastname) ? firstname + " " + lastname.charAt(0) + '.' : '';

    const majors = profile.major.join(", ");
    const minors = (profile.minor.length > 0) ? profile.minor.join(", ") : "";
    const headerText = profile.type === "Paid" ?
        <span>{shortname}<span className="tag">Requesting Compensation</span></span>
        : <span>{shortname}</span>;
    const subheaderText = (minors.length > 0) ? majors + " (" + minors + ")" : majors;
    const typeText = profile.type === "Paid" ? "Requesting Compensation" : "Volunteer";

    return (
    <React.Fragment>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
                <CardHeader
                  className="cardHeader"
                  avatar={
                    <Avatar className="purpleAvatar">
                      {initials}
                    </Avatar>
                  }
                  title={headerText}
                  subheader={subheaderText}
                />
                <CardContent>
                    <div className="spaceBelow">
                        {classesCard}
                    </div>
                    <Grid container wrap="nowrap" spacing={16}>
                        <Grid item>
                            <MailIcon className="icon"/>
                        </Grid>
                        <Grid item xs>

                            <Typography><a style={{ color: '#838383', textDecorationLine: 'none'}} href={`mailto:${profile.user.email}`}>{profile.user.email}</a></Typography>
                        </Grid>
                    </Grid>
                    {profile.bio &&
                    <Grid container wrap="nowrap" spacing={16}>
                          <Grid item>
                              <InfoIcon className="icon"/>
                          </Grid>
                          <Grid item xs>
                            <Typography>{profile.bio}</Typography>
                          </Grid>
                    </Grid>}
                    {profile.availability &&
                    <Grid container wrap="nowrap" spacing={16}>
                          <Grid item>
                              <CalendarIcon className="icon"/>
                          </Grid>
                          <Grid item xs>
                            <Typography>{profile.availability}</Typography>
                          </Grid>
                    </Grid>}
                </CardContent>
                <CardActions>
                <Button component={Link}
                    size="small"
                    color="inherit"
                    to={`/profile/${profile.handle}`}
                >
                    View Profile
                </Button>
                {auth.isAuthenticated && profile.user._id === auth.user.id &&
                <Button component={Link}
                    size="small"
                    to={`/edit-profile`}
                    className="colorPurple"
                >
                    Edit Profile
                </Button>
                }
                </CardActions>
            </Card>
        </Grid>
    </React.Fragment>
  );
}

ProfileItem.propTypes = {
    profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(withStyles(styles)(ProfileItem));
