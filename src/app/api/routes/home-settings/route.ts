import { 
  getHomeSettings, 
  updateHomeSettings, 
  resetHomeSettings 
} from "@/app/api/controllers/homeSettingController";

export const GET = getHomeSettings;
export const PUT = updateHomeSettings;
export const DELETE = resetHomeSettings;
