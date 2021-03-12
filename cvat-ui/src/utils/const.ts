import { isDev } from 'utils/enviroment';

// export const USER_DASHBOARD_PATH = '/custom-user-dashboard';
export const USER_DASHBOARD_PATH = isDev() ? `${process.env.REACT_APP_API_URL}/custom-user-dashboard` : '/custom-user-dashboard';
export const USER_DASHBOARD_BACKEND = '/custom-user-dashboard-backend';
export const USER_LOGIN_URL = USER_DASHBOARD_PATH + '/user/login';