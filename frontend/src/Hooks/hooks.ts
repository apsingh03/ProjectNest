import type { RootState, AppDispatch } from "../Redux/Store";

import * as ReactRedux from "react-redux";

export const useAppDispatch: () => AppDispatch = ReactRedux.useDispatch;
export const useAppSelector: ReactRedux.TypedUseSelectorHook<RootState> =
  ReactRedux.useSelector;
