import {domain} from "@/app/actions/getRoomById";
import {create} from 'zustand';
import {Result} from "@/app/type";

interface FeaturesStore {
  features: any[]
  fetchFeatures: () => void
}

export const useFeatures = create<FeaturesStore>((set) => ({
  features: [],
  fetchFeatures: async () => {
    const res = await fetch(`${domain}api/feature/`);
    const data: Result = await res.json();
    set({features: data.results});
  },
}));

