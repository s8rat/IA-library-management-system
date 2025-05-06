interface IButton {
  name: string;
  style: string;
  onclick?: () => void;
  type?: "button" | "submit" | "reset";
}

const Button = ({ name, style, onclick, type = "button" }: IButton) => {
  return (
    <button className={`${style}`} onClick={onclick} type={type}>
      {name}
    </button>
  );
};

export default Button;
