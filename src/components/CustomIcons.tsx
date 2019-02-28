import * as React from "react";
import { theme } from "src/appearance";

export const DoubleLeftChevronIcon: React.SFC = () => (
  <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
    <path
      fill={theme.palette.common.white}
      d="M18.41,7.41L17,6L11,12L17,18L18.41,16.59L13.83,12L18.41,7.41M12.41,7.41L11,6L5,12L11,18L12.41,16.59L7.83,12L12.41,7.41Z"
    />
  </svg>
);

export const DoubleRightChevronIcon: React.SFC = () => (
  <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
    <path
      fill={theme.palette.common.white}
      d="M5.59,7.41L7,6L13,12L7,18L5.59,16.59L10.17,12L5.59,7.41M11.59,7.41L13,6L19,12L13,18L11.59,16.59L16.17,12L11.59,7.41Z"
    />
  </svg>
);
