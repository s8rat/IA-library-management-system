import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Membership } from "../../types/membership";

interface DeleteMemberShipProps {
  membership: Membership;
  onDelete: () => void;
  className?: string;
}

const DeleteMemberShip: React.FC<DeleteMemberShipProps> = ({
  membership,
  onDelete,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onDelete}
      className={`text-red-600 hover:text-red-800 ${className}`}
      title={`Delete ${membership.membershipType} membership plan`}
    >
      <FontAwesomeIcon icon={faTrash} />
    </button>
  );
};

export default DeleteMemberShip;
