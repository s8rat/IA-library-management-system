import React from "react";
import { Membership } from "../../types/membership";

interface EditMemberShipDialogProps {
  open: boolean;
  membership: Membership;
  setMembership: (m: Membership) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editError: string | null;
}

const EditMemberShipDialog: React.FC<EditMemberShipDialogProps> = ({
  open,
  membership,
  setMembership,
  onClose,
  onSubmit,
  editError,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
        <button
          className="absolute top-3 right-3 bg-transparent text-black hover:text-red-600 text-xl"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          &times;
        </button>
        <h2 className="font-bold text-2xl mb-6 text-center text-blue-900 tracking-wide">
          Edit Membership Plan
        </h2>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Membership Type */}
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={membership.membershipType}
                onChange={(e) =>
                  setMembership({
                    ...membership,
                    membershipType: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
            {/* Borrow Limit */}
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Borrow Limit <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={membership.borrowLimit}
                onChange={(e) =>
                  setMembership({
                    ...membership,
                    borrowLimit: Number(e.target.value),
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
                min={1}
              />
            </div>
            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Duration (days) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={membership.durationInDays}
                onChange={(e) =>
                  setMembership({
                    ...membership,
                    durationInDays: Number(e.target.value),
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
                min={1}
              />
            </div>
            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Price
              </label>
              <input
                type="number"
                value={membership.price ?? ""}
                onChange={(e) =>
                  setMembership({
                    ...membership,
                    price: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                min={0}
              />
            </div>
            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Description
              </label>
              <input
                type="text"
                value={membership.description ?? ""}
                onChange={(e) =>
                  setMembership({
                    ...membership,
                    description: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            {/* Family Plan */}
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Family Plan
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={membership.isFamilyPlan}
                  onChange={(e) =>
                    setMembership({
                      ...membership,
                      isFamilyPlan: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <span>Is Family Plan?</span>
              </div>
            </div>
            {/* Max Family Members */}
            {membership.isFamilyPlan && (
              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-1">
                  Max Family Members
                </label>
                <input
                  type="number"
                  value={membership.maxFamilyMembers ?? ""}
                  onChange={(e) =>
                    setMembership({
                      ...membership,
                      maxFamilyMembers: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  min={1}
                />
              </div>
            )}
            {/* Requires Approval */}
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Requires Approval
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={membership.requiresApproval}
                  onChange={(e) =>
                    setMembership({
                      ...membership,
                      requiresApproval: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <span>Requires Approval?</span>
              </div>
            </div>
          </div>
          {editError && (
            <div className="text-red-600 text-center text-sm mt-2">
              {editError}
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMemberShipDialog;
