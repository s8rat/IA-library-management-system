interface IViewBoardCard {
  name: string;
}

const ViewBoardCard = ({ name }: IViewBoardCard) => {
  return (
    <div>
      <div className="flex flex-col items-center justify-start w-full min-h-screen py-10">
        <div className="w-11/12 max-w-5xl bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{name}</h1>
          <div className="flex flex-col gap-4"></div>
        </div>
      </div>
    </div>
  );
};

export default ViewBoardCard;
