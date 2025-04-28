import Button from "./Button";

interface IViewBoardCard {
  name: string;
}

const ViewBoardCard = ({ name }: IViewBoardCard) => (
  <div className="flex items-center justify-between bg-gray-50 rounded-lg border shadow-sm px-6 py-4">
    <span className="text-gray-700 font-medium">{name}</span>
    <div className="flex gap-2">
      <Button
        name="Edit"
        style="px-4 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition"
      />
      <Button
        name="Delete"
        style="px-4 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
      />
    </div>
  </div>
);

export default ViewBoardCard;
