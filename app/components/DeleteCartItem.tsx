import { useDeleteCartItemMutation } from "../store/apiSlice";
import { CgClose } from "react-icons/cg";
import { MoonLoader } from "react-spinners";

export default function DeleteCartItem({
  itemToDelete,
}: {
  itemToDelete: string;
}) {
  const [deleteCartItem, { isLoading }] = useDeleteCartItemMutation();

  const handleDelete = async (name: string) => {
    try {
      await deleteCartItem(name).unwrap();
    } catch (err) {
      console.error("Failed to delete cart item: ", err);
    }
  };

  return (
    <>
      {isLoading ? (
        <MoonLoader size="15" color="grey" />
      ) : (
        <CgClose onClick={() => handleDelete(itemToDelete)} />
      )}
    </>
  );
}
