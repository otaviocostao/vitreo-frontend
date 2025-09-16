import { NavLink } from "react-router-dom";
import Button from "./ui/Button"

interface ButtonsAreaProps {
  textButton1?: string;
  textButton2?: string;
  cancelButtonPath?: string;
}

const SaveCancelButtonsArea = (props: ButtonsAreaProps) => {
  return (
    <div className="flex justify-end items-center gap-4 py-3">
        <NavLink to={{ pathname: props.cancelButtonPath}}>
          <Button type="button" variant="secondary">
              {props.textButton1}
          </Button>
        </NavLink>
        <Button type="submit" variant="primary">
            {props.textButton2}
        </Button>
            </div>
  )
}

export default SaveCancelButtonsArea