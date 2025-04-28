import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SidebarItem {
  icon: IconDefinition;
  label: string;
  active?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
}

const Sidebar = ({ items }: SidebarProps) => (
  <aside className="w-64 bg-white border-r border-violet-400 flex flex-col py-8 px-4">
    {items.map((item) => (
      <div
        key={item.label}
        className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg cursor-pointer ${
          item.active
            ? "bg-green-50 text-green-700 font-semibold border-l-4 border-green-500"
            : "text-gray-500 hover:bg-gray-100"
        }`}
      >
        <FontAwesomeIcon icon={item.icon} className="text-xl" />
        <span>{item.label}</span>
      </div>
    ))}
  </aside>
);

export default Sidebar;
