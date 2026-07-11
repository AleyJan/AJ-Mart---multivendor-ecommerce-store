import axios from "axios";
import { server } from "../../server";

// create event (newForm is FormData with images + fields + dates)
export const createEvent = (newForm) => async (dispatch) => {
  try {
    dispatch({ type: "eventCreateRequest" });

    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const { data } = await axios.post(`${server}/event/create-event`, newForm, {
      ...config,
      withCredentials: true,
    });

    dispatch({ type: "eventCreateSuccess", payload: data.event });
  } catch (error) {
    dispatch({
      type: "eventCreateFail",
      payload: error.response?.data?.message,
    });
  }
};

// get all events of a shop
export const getAllEventsShop = (id) => async (dispatch) => {
  try {
    dispatch({ type: "getAlleventsShopRequest" });

    const { data } = await axios.get(`${server}/event/get-all-events-shop/${id}`);

    dispatch({ type: "getAlleventsShopSuccess", payload: data.events });
  } catch (error) {
    dispatch({
      type: "getAlleventsShopFail",
      payload: error.response?.data?.message,
    });
  }
};

// get ALL events (whole catalogue)
export const getAllEvents = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllEventsRequest" });

    const { data } = await axios.get(`${server}/event/get-all-events`);

    dispatch({ type: "getAllEventsSuccess", payload: data.events });
  } catch (error) {
    dispatch({
      type: "getAllEventsFail",
      payload: error.response?.data?.message,
    });
  }
};

// delete event of a shop
export const deleteEvent = (id) => async (dispatch) => {
  try {
    dispatch({ type: "deleteeventRequest" });

    const { data } = await axios.delete(
      `${server}/event/delete-shop-event/${id}`,
      { withCredentials: true }
    );

    dispatch({ type: "deleteeventSuccess", payload: data.message });
  } catch (error) {
    dispatch({
      type: "deleteeventFail",
      payload: error.response?.data?.message,
    });
  }
};
