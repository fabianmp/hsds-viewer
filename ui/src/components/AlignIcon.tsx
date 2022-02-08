import { SxProps } from "@mui/material";
import Box from "@mui/material/Box";
import { ReactNode } from "react";

const sx = {
  box: {
    display: "inline-flex",
    alignItems: "center",
    flexWrap: "wrap",
    "& > *:not(:last-child)": {
      marginRight: 1,
    },
  },
} as const;

interface Props {
  children: ReactNode;
  sx?: SxProps;
}

export default function AlignIcon({ children, sx: overrideSx }: Props) {
  return <Box sx={{ ...sx.box, ...overrideSx }}>{children}</Box>;
}
