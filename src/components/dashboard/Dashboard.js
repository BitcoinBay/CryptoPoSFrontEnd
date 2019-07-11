import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { Link } from "react-router-dom";
import axios from "axios";

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import { grey } from "@material-ui/core/colors";

import injectSheet, { jss } from 'react-jss';

const styles = {
  marginless_row: {
    marginBottom: "0"
  },
  page_header: {
    margin: "0",
    fontFamily: "Poppins",
    fontSize: "32px",
    fontWeight: "900"
  },
  unfocusable_button: {
    '&:focus': {
      background: "#ffffff"
    }
  },
  settings_menu_button: {
    fontFamily: "Poppins, sans-serif",
    fontSize: "18px",
    textTransform: "none",
    textAlign: "left",
    margin: "54px 0 0 0",
    padding: "0",
    '&:hover': {
      background: "#ffffff",
      border: "none"
    }
  },
  settings_menu_icon: {
    verticalAlign: "middle",
    marginRight: "10px"
  },
  add_pos_button: {
    fontSize: "18px",
    fontFamily: "Poppins, sans-serif",
    color: "#0082cc",
  },
  add_pos_icon: {
    fontSize: "20px",
    verticalAlign: "middle",
    marginRight: "5px",
    color: "#909090",
    fontWeight: "bold"
  },
  pos_card: {
    borderBottom: "1px solid #e0e0e0",
    padding: "15px",
  },
  first_pos: {
    borderTop: "1px solid #e0e0e0",
    marginTop: "10px"
  },
  pos_id_heading: {
    color: "#808080",
    margin: "0",
    width: "125px"
  },
  pos_link: {
    padding: "0",
    fontSize: "20px",
    color: "#1499F9",
    fontFamily: "Poppins, sans-serif",
    fontWeight: "bold",
    lineHeight: "1.5",
    textTransform: "none",
    height: "30px",
    '&:hover': {
      background: "#ffffff"
    }
  },
  delete_pos_icon: {
    display: "inline",
    color: "#A0A0A0"
  },
  user_info: {
    background: "#00A3FF",
    display: "grid"
  },
  user_avatar: {
    margin: "25px 20px 30px 20px",
    background: "#ffffff !important",
    color: grey[900] + "!important",
    padding: "30px",
    fontSize: "1.7em !important",
    boxShadow: "0 1px 2px 0 #303030"
  },
  user_name_chip: {
    background: "#ffffff !important",
    margin: "0 15px 25px 15px",
    fontSize: "1.1em !important",
    border: "none !important",
    borderRadius: "16px",
    boxShadow: "0 1px 2px 0 #303030",
    display: "flex",
    padding: "5px 10px",
  },
  user_name: {
    marginBottom: "0",
    flexGrow: "1",
    textAlign: "center"
  },
  drop_down_icon: {
    flexGrow: "0"
  }
};

class Dashboard extends Component {

  constructor() {
    super();

    this.state = {
      user_pos_systems: [],
      left: false
    };
  }

  componentDidMount() {
    const user_data = {
      user_id: this.props.auth.user.id
    };

    axios.post("/api/get-all-user-pos", user_data)
      .then((res) => {
        console.log("Logging: ", res);
        if (res.data) {
          this.setState({ user_pos_systems: res.data });
        }
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  }

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  toggleDrawer = () => {
    if (this.state.left) {
      this.setState({ left: false });
    } else {
      this.setState({ left: true });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="container">
        {/* <div className="row">
          <div className="landing-copy col s12 center-align">
            <button
              style={{
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem",
                margin: '14px'
              }}
              onClick={this.onLogoutClick}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col s6 offset-s3">
            <hr/>
          </div>
        </div> */}

        <Drawer open={this.state.left} onClose={this.toggleDrawer}>
          <div className={classes.user_info}>
            <Avatar className={classes.user_avatar}>
              {this.props.auth.user.name.substring(0,1)}
            </Avatar>
            <div className={classes.user_name_chip}>
              <p className={classes.user_name}>{this.props.auth.user.name}</p>
                <i className={"material-icons " + classes.drop_down_icon}>
                  expand_more
                </i>
            </div>
          </div>

          <List>
            <ListItem button>
              <ListItemIcon><i className="material-icons">dashboard</i></ListItemIcon>
              <ListItemText>Master Dashboard</ListItemText>
            </ListItem>
            <ListItem button>
              <ListItemIcon><i className="material-icons">shopping_cart</i></ListItemIcon>
              <ListItemText>Global Transaction History</ListItemText>
            </ListItem>
          </List>
          <Divider></Divider>
          <List>
            <ListItem button>
              <ListItemIcon><i className="material-icons">settings_power</i></ListItemIcon>
              <ListItemText onClick={this.onLogoutClick}>Logout</ListItemText>
            </ListItem>
          </List>
        </Drawer>

        <div className={ "row " + classes.marginless_row }>
          <div className="col s8 offset-s2">
            <button className={ "btn btn-flat " + classes.settings_menu_button + " " + classes.unfocusable_button } onClick={this.toggleDrawer}>
              <i className= { "material-icons " + classes.settings_menu_icon }>
                menu
              </i>
              settings
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col s8 offset-s2">
            <h2 className={ classes.page_header }>Master</h2>
            <h2 className={ classes.page_header }>Dashboard</h2>
          </div>
        </div>

        <div className="row">
          <div className="col s8 offset-s2">
            <Link
              to = "/create-pos"
              className={ classes.add_pos_button }
            >
              <i className={ "material-icons " + classes.add_pos_icon }>
                add
              </i>
              add new PoS
            </Link>
          </div>
        </div>

        <div className="row">
          <div className="col s8 offset-s2">
            {
              this.state.user_pos_systems.map((pos, i) =>
                <div className={ classes.pos_card + (i === 0 ? " " + classes.first_pos : "") } key={i}>
                  <div>
                    <p className={ classes.pos_id_heading }>ID: ...{pos._id.substring(17)}</p>
                    <p className={ classes.delete_pos_icon + " right"}><i className="material-icons">delete</i></p>
                    <Link to={{ pathname: "/pos-dashboard/", search: '?p=' + pos._id }}
                        className={"btn btn-flat " + classes.pos_link }
                        >
                      {pos.name}
                    </Link>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    );
  }

}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(injectSheet(styles)(Dashboard));
