interface IButton {
  name: string;
  style: string;
  onclick?: () => void;
}

const Button = ({ name, style, onclick }: IButton) => {
  return (
    <button className={`${style}`} onClick={onclick}>
      {name}
    </button>
  );
};

export default Button;
