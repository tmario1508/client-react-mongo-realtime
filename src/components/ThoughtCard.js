import React from "react";
import {
  withStyles,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Button,
  Select,
  MenuItem,
  CardMedia,
} from "@material-ui/core";
import PropTypes from "prop-types";
import styles from "../styles";

const ThoughtCard = (props) => {
  const classes = props.classes;

  //const classes = useStyles();
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Card className={classes.card}>
      <CardHeader
        title={props.codigo}
        titleTypographyProps={{ variant: "h5" }}
        className={classes.cardHeader}
      />
      <CardMedia
        className={classes.media}
        image="https://assets.dominos.com.mx/dev/webOptimized/especialidad/PES/PES.png"
        title="Test"
      />
      <CardContent className={classes.cardContent}>
        <Typography variant="body1">Total: ${props.total}</Typography>
        <Typography variant="body1">{props.estatus}</Typography>
        <Button variant="contained" color="primary">Actualizar Estatus</Button>
        
      </CardContent>
    </Card>
  );
};

ThoughtCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ThoughtCard);
