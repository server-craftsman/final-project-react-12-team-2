import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { ResponseSuccess } from "../../app/interface";
import { Setting } from "../../models/api/responsive/admin/setting.response.model";

export const SettingService = {
  getSetting() {
    return BaseService.get<ResponseSuccess<Setting>>({
      url: API.ADMIN.GET_SETTING
    });
  }
};
