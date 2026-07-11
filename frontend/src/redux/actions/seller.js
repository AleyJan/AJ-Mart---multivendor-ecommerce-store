import axios from "axios";
import { server } from "../../server";

// Load the currently logged-in seller (relies on the seller_token cookie)
export const loadSeller = () => async (dispatch) => {
  try {
    dispatch({ type: "LoadSellerRequest" });

    const { data } = await axios.get(`${server}/shop/getSeller`, {
      withCredentials: true,
    });

    dispatch({ type: "LoadSellerSuccess", payload: data.seller });
  } catch (error) {
    dispatch({
      type: "LoadSellerFail",
      payload: error.response?.data?.message,
    });
  }
};
