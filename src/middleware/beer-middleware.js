import {
    BEERS_BY_NAME,
    BEER_RANDOM,
    setBeers,
    TOGGLE_FAVOURITE,
    deleteFavourite,
    addFavourite
} from "../actions/beer-actions";
import { apiRequest, API_ERROR, API_SUCCESS } from "../actions/api-actions";
import { setLoader, setNotification } from "../actions/ui-actions";
import { saveToLocalStorage } from "../actions/data-actions";

export const beerMiddleware = ({ getState }) => next => action => {
    next(action);
    const byNameUrl = "https://api.punkapi.com/v2/beers?beer_name=";
    const byIdsUrl = "https://api.punkapi.com/v2/beers?ids=";
    const getRandomIds = noOfIds =>
        new Array(Number(noOfIds))
            .fill(0)
            .map(n => n + Math.floor(Math.random() * 234 + 1))
            .reduce((acc, number) => {
                acc = `${acc}${number}${"|"}`;
                return acc;
            }, "");
    const { feature } = action.meta || "";
    const { payload, type } = action;
    if (type.includes("FETCH")) {
        let url;
        if (type.includes(BEERS_BY_NAME)) {
            url = `${byNameUrl}${payload.replace(" ", "_")}`;
        }
        if (type.includes(BEER_RANDOM)) {
            url = `${byIdsUrl}${getRandomIds(payload)}`;
        }
        next(apiRequest({}, "GET", url, feature));
        next(setLoader(true, feature));
    }
    if (type.includes(API_SUCCESS)) {
        payload.length === 0 &&
            next(setNotification("No results for this search"), feature);
        next(setBeers(payload, feature));
        next(setLoader(false, feature));
    }
    if (type.includes(API_ERROR)) {
        next(setNotification(payload.message, feature));
        next(setLoader(false, feature));
    }
    if (type.includes(TOGGLE_FAVOURITE)) {
        if (Object.keys(getState().beers.favouriteBeers).includes(payload)) {
            next(deleteFavourite(payload));
            next(setNotification("Favourite removed", "FAVOURITE"));
        } else {
            next(
                addFavourite({
                    [payload]: getState().beers.searchedBeers[payload]
                })
            );
            next(setNotification("Favourite saved", "FAVOURITE"));
        }
        next(saveToLocalStorage("favouriteBeers", "FAVOURITE"));
    }
};

export default beerMiddleware;
