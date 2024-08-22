import React from "react";
import * as Updates from "expo-updates";

const useEasUpdate = () => {
  const onFetchUpdateAsync = async () => {
    if (process.env.NODE_ENV !== "development") {
      try {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        alert(`Error fetching latest Expo update: ${error}`);
      }
    }
  };
  return {
    onFetchUpdateAsync,
  };
};

export default useEasUpdate;
