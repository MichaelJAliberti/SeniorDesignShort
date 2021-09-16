import * as React from "react";
import { ReactNode } from "react";
import { SwitchProps } from "react-native";
export interface DialogSwitchProps extends SwitchProps {
    label?: ReactNode;
}
declare const DialogSwitch: React.FC<DialogSwitchProps>;
export default DialogSwitch;
