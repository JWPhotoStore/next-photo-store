import { useDeleteCartItemMutation } from "../store/apiSlice";
import { TailSpin } from "react-loader-spinner";
import { CgClose } from "react-icons/cg";
import { useSession } from "next-auth/react";
import { deleteCartItemToLocalStorage } from "@/util/cart-item-utils";

export default function DeleteCartItem({
  itemToDelete,
}: {
  itemToDelete: string;
}) {
  const [deleteCartItem, { isLoading }] = useDeleteCartItemMutation();
  const { status } = useSession();

  const handleDelete = async (name: string) => {
    try {
      if (status === "unauthenticated") deleteCartItemToLocalStorage(name);
      if (status === "authenticated") await deleteCartItem(name).unwrap();
    } catch (err) {
      console.error("Failed to delete cart item: ", err);
    }
  };

  return (
    <>
      {isLoading ? (
        <TailSpin height="1em" width="1em" color="grey" />
      ) : (
        <CgClose onClick={() => handleDelete(itemToDelete)} />
      )}
    </>
  );
}
