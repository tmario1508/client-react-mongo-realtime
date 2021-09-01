import React, { Component } from "react";
import {
  Grid,
  Typography,
  Button,
  withStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import PropTypes from "prop-types";
import io from "socket.io-client";
import axios from "axios";
import URLs from "./URLs";
import styles from "./styles";
import ThoughtList from "./components/ThoughtList";

class App extends Component {
  state = {
    showAddDialog: false,
    thoughts: [],
    codigo: "",
    estatus: "",
    codigoError: false,
    estatusError: false,
    codigoErrorMsg: "",
    estatusErrorMsg: "",
  };

  componentDidMount = async () => {
    //socket.io connection
    const socket = io(`${URLs.socketURL}/socket`);

    socket.on("newPedido", (thought) => {
      this.setState({ thoughts: [...this.state.thoughts, thought] });
    });

    socket.on("deletedPedido", (codigo) => {
      const updatedThoughts = this.state.thoughts.filter((thought) => {
        return thought.codigo !== codigo;
      });

      this.setState({ thoughts: updatedThoughts });
    });

    socket.on("pedidoCleared", () => {
      this.setState({ thoughts: [] });
    });

    await this.fetchThoughts();
  };

  fetchThoughts = async () => {
    try {
      // <---- Cambio de ruta ---->
      const response = await axios.get(`${URLs.baseURL}/wall/getPedido`);

      if (response.data.success) {
        console.log(response.data.message);
        this.setState({ thoughts: response.data.message });
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log("Error with fetching thoughts: ", error);
      alert(
        "Error with fetching thought. Please check the console for more info."
      );
    }
  };

  toggleAddDialog = () => {
    this.setState({ showAddDialog: !this.state.showAddDialog }, () => {
      //if form closed, clear the text fields
      if (!this.state.showAddDialog) {
        this.setState({ codigo: "", total: "", estatus: "" });
      }
    });
  };

  handleChange = (event) => {
    let value = event.target.value;
    let property = event.target.codigo;

    switch (property) {
      case "codigo":
        if (value.length > 20) {
          value = value.substr(0, 20);
        }
        this.setState({ [property]: value });
        break;

      case "estatus":
        if (value.length > 100) {
          value = value.substr(0, 100);
        }
        this.setState({ [property]: value });
        break;

      default:
        break;
    }
  };

  handleInputValidation = () => {
    let valid = true;

    const inputs = [
      {
        codigo: "codigo",
        whitespaceMsg: "*Please enter a codigo.",
      },
      {
        estatus: "estatus",
        whitespaceMsg: "*Please enter estatus.",
      },
    ];

    for (let input of inputs) {
      const value = this.state[input.codigo];

      if (!value.replace(/\s/g, "").length) {
        this.setState({
          [input.codigo + "ErrorMsg"]: input.whitespaceMsg,
          [input.codigo + "Error"]: true,
        });
        valid = false;
        continue;
      } else {
        this.setState({
          [input.codigo + "ErrorMsg"]: "",
          [input.codigo + "Error"]: false,
        });
      }
    }

    return valid;
  };

  addThought = async () => {
    if (this.handleInputValidation()) {
      try {
        const response = await axios.post(
          `${URLs.baseURL}/wall/addPedido`,
          {
            codigo: this.state.codigo,
            estatus: this.state.estatus,
          }
        );

        if (response.data.success) {
          this.toggleAddDialog();
          alert(response.data.message);
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.log("Error with adding thought: ", error);
        alert(
          "Error with adding thought. Please check the console for more info."
        );
      }
    }
  };

  render() {
    const classes = this.props.classes;

    return (
      <React.Fragment>
        {/*add item dialog*/}
        <Dialog open={this.state.showAddDialog} onClose={this.toggleAddDialog}>
          <DialogTitle>
            <span style={{ fontWeight: "bold" }}>Add a Thought</span>
          </DialogTitle>
          <DialogContent>
            <Grid
              container
              justify="flex-start"
              alignItems="flex-start"
              spacing={2}
            >
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Codigo"
                  size="small"
                  name="codigo"
                  value={this.state.codigo}
                  onChange={this.handleChange}
                  error={this.state.codigoError}
                  helperText={this.state.codigoErrorMsg}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  variant="outlined"
                  label="Estatus"
                  size="small"
                  name="estatus"
                  value={this.state.estatus}
                  onChange={this.handleChange}
                  error={this.state.estatusError}
                  helperText={this.state.estatusErrorMsg}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              variant="contained"
              onClick={this.toggleAddDialog}
              className={classes.redButton}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={this.addThought}
              className={classes.greenButton}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        {/*top bar*/}
        <Grid
          container
          spacing={2}
          direction="row"
          justify="space-between"
          alignItems="center"
          style={{
            backgroundColor: "#E94057",
          }}
        >
          <Grid item>
            <Typography variant="h3" className={classes.codigo}>
              Pedidos
            </Typography>
          </Grid>
          <Grid item>
            <Button
              size="small"
              variant="contained"
              className={classes.button}
              onClick={this.toggleAddDialog}
            >
              Add Pedido
            </Button>
          </Grid>
        </Grid>
        {/*thought cards*/}
        <br />
        <Grid
          container
          spacing={2}
          direction="row"
          justify="center"
          alignItems="center"
        >
          <ThoughtList thoughts={this.state.thoughts} />
        </Grid>
      </React.Fragment>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
