import Button from "./ui/Button"

interface ButtonsAreaProps {
  textButton1?: string;
  textButton2?: string;
}

const SaveCancelButtonsArea = (props: ButtonsAreaProps) => {
  return (
    <div className="flex justify-end items-center gap-4 mt-8 pt-6 border-t border-gray-200">
        <Button type="button" variant="secondary">
            {props.textButton1}
        </Button>
        <Button type="submit" variant="primary">
            {props.textButton2}
        </Button>
            </div>
  )
}

export default SaveCancelButtonsArea