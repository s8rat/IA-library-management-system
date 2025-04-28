interface IButton {
  name: string;
  color: string;
  onclick?: () => void;
}

const Button = ({ name, color, onclick }: IButton) => {
  return (
    <button
      className={`px-4 py-2 text-sm text-white ${color} rounded hover:bg-red-600`}
      onClick={onclick}
    >
      {name}
    </button>
  );
};

export default Button;
