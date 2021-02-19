import Box from "@material-ui/core/Box";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { ReactNode } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      display: 'inline-flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      '& > *': {
        marginRight: theme.spacing(1),
      },
    },
  }),
);

interface Props {
  children: ReactNode
}

export default function AlignIcon({ children }: Props) {
  const classes = useStyles();

  return (
    <Box className={classes.box}>
      {children}
    </Box>
  )
}
