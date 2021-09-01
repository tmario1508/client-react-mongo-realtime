import React from "react";
import { Grid } from "@material-ui/core";
import ThoughtCard from "./ThoughtCard";

const ThoughtList = (props) => {
  return props.thoughts.map((thought, index) => {
    return (
      <Grid item>
        <ThoughtCard
          codigo={thought.codigo}
          estatus={thought.estatus}
          total={thought.total}
          key={index}
        />
      </Grid>
    );
  });
};

export default ThoughtList;
