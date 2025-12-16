import axiosInstance from "../axios";

export function SaveIndividualOrder(data) {
  return axiosInstance
    .post(`/api/SalesList/SaveIndividualOrderOnLine`, data)
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}
export function SaveIndividualOrderItems(data) {
  return axiosInstance
    .post(`/api/SalesList/SaveOrderDeatilsOnLine`, data)
    .then((response) => {
      console.log(response);
      
      return response.data;
    })
    .catch((error) => {
      //console.log(error);
      throw error;
    });
}

// orderHeaderAddPercent: 0
// orderHeaderCurrencyID: 1
// orderHeaderCurrencyName: "EGP"
// orderHeaderCutomerId: 24
// orderHeaderDeliveryDateTime: "2025-12-11T13:04:56.405"
// orderHeaderDiscountPercent: 0
// orderHeaderEmailAddress: "Test"
// orderHeaderHasTransportaion: false
// orderHeaderId: 0
// orderHeaderMobileNumber: "test"
// orderHeaderOrderdByNotes: ""
// orderHeaderPriceListId: 0
// orderHeaderRemarks: null
// orderHeaderTransportationPercent: 0.05
// orderHeaderWhatsAppNumber: ""