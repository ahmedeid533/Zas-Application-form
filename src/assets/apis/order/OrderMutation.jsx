import { useMutation } from "@tanstack/react-query";
import { SaveIndividualOrder, SaveIndividualOrderItems } from "./OrderApi";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useNavigate } from "react-router-dom";

function orderMutation({onClose}) {
  const {  setQuatationData } = useAuthStore();
const {cart,clearCart}=useCartStore();
const navigate =useNavigate();
const CreateIndividualMutation = useMutation({
    mutatuionKey: ["IndividualHeader"],
    mutationFn: (data) => SaveIndividualOrder(data),
    onSuccess: (response) => {
			
      setQuatationData(response);
      console.log("response",response);
      
SaveIndividuaItemslMutation.mutate(cart.map((item) => ({
    orderDetailsId: 0,
    orderDetailsHeaderId: response?.at(0)?.header?.orderHeaderId||0,
    orderDetailsItemId: item.FoodMenuItemId,
    orderDetailsName: item.FoodMenuItemName,
    orderDetailsPcking: "Standard Packing",
    orderDetailsQty: item.quantity,
    orderDetailsPackingId: 1,
    orderDetailsCurrencyPrice: item.FoodMenuItemPrice,
    OrderDetailsUnitName:item?.FoodMenuItemUnitName,
    OrderDetailsUnitId:item?.FoodMenuItemUnitId,
    orderDetailsMigerment: item?.FoodMenuItemMigerment,

})));
    },
    onMutate: () => {
      toast.loading("Creating  Order", { id: 1 });
    },
    onError: () => {
      toast.error("Failed to Create Order", { id: 1 });
      onClose()
    },
  });

  const SaveIndividuaItemslMutation = useMutation({
    mutatuionKey: ["IndividualHeader"],
    mutationFn: (data) => SaveIndividualOrderItems(data),
    onSuccess: (response) => {
			toast.success("Order Created Successfully", { id: 1 });
      clearCart();
      onClose();
      navigate("/")
      
    },
    onMutate: () => {
      toast.loading("Creating Individual Order", { id: 1 });
    },
    onError: () => {
      toast.error("Failed to Create Order", { id: 1 });
      onClose()
    },
  });

    return { CreateIndividualMutation,SaveIndividuaItemslMutation };
}
export default orderMutation;