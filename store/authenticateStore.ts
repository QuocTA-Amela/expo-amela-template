import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";

type IAuthenticateStoreState = {
  accessToken?: string;
  refreshToken?: string;
  setAccessToken: (accessToken?: string) => void;
  setRefreshToken: (refreshToken?: string) => void;
};

// Define the store
const authenticateStore = create<
  IAuthenticateStoreState,
  [["zustand/persist", IAuthenticateStoreState]]
>(
  persist(
    (set) => ({
      accessToken: undefined,
      refreshToken: undefined,
      setAccessToken: (newAccessToken) =>
        set((state) => ({ accessToken: newAccessToken })),
      setRefreshToken: (newRefreshToken: any) =>
        set((state) => ({ refreshToken: newRefreshToken })),
    }),
    {
      name: "authenticate-store-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: (state) => {
        console.log("Hydration authenticate-store-storage starts", state);
        return (finishedState, error) => {
          if (error) {
            console.log("Hydration authenticate-store-storage ERROR", error);
          } else {
            console.log(
              "Hydration authenticate-store-storage finished",
              finishedState
            );
          }
        };
      },
    }
  )
);

export default authenticateStore;
