import axios from "axios";

const ORDER_BASE_URL = "http://localhost:8080/administrator/orders";

class ShopOderService {

    createNewShopOders(siteUser, shoppingCartItems, address, payment){
        let dto = {
            siteUser: siteUser,
            shoppingCartItems: [...shoppingCartItems],
            address: address,
            payment: payment
        }
        return axios.post(ORDER_BASE_URL +"/createNewShopOrder", dto);
    }

    getAllShopOrders(){
        return axios.get(ORDER_BASE_URL+"/getAllShopOrders");

    }

    getShopOrderByOrderStatus(id){
        return axios.get(ORDER_BASE_URL+"/getShopOrders/status/" + id);

    }

    getShopOrderById(id){
        return axios.get(ORDER_BASE_URL+"/getShopOrder/"+id);
    }

    getAllShopOrdersByUserId(id){
        return axios.get(ORDER_BASE_URL+"/getAllShopOrdersByUserId/"+id);
    }

    getShopOrderInDateTime(dateTime){
        return axios.post(ORDER_BASE_URL+"/getShopOrder/dateTime", dateTime);
    }

    getTodayShopOrder(){
        return axios.get(ORDER_BASE_URL+"/todayShopOrders");
    }

    getTodayEarning(){
        return axios.get(ORDER_BASE_URL+"/todayEarning");
    }

    getAllOrderStatus(){
        return axios.get(ORDER_BASE_URL+"/getAllOrderStatus");
    }

    updateShopOrderStatus(orderId, statusId){
        return axios.get(ORDER_BASE_URL+ "/quickUpdate/"+orderId+"/"+statusId);
    }

    deleteShopOrder(id){
        return axios.get(ORDER_BASE_URL+"/quickDeleteOrder/"+id)
    }

    getTopTenProductItems(month, year){
        return axios.get(ORDER_BASE_URL+"/topTenProductItems/"+month+"/"+year);
    }
}

export default new ShopOderService();