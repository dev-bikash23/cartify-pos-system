import { DEFAULT_ADDRESS } from "@/lib/defaultAddress";

// Transform store data for form initialization

export const getInitialValues = (storeData) => {
  if(!storeData) {
   return {
     brand: "",
    description: "",
    storeType: "",
    contact: {
      address: DEFAULT_ADDRESS,
      phone: "",
      email: "",
      latitude: "",
      longitude: "",
    },
   };

  }
  return {
    brand: storeData.brand || "",
    description: storeData.description || "",
    storeType: storeData.storeType || "",
    contact: {
      address: storeData.contact?.address || DEFAULT_ADDRESS,
      phone: storeData.contact?.phone || "",
      email: storeData.contact?.email || "",
      latitude: storeData.contact?.latitude ?? "",
      longitude: storeData.contact?.longitude ?? "",
    },
  };
};