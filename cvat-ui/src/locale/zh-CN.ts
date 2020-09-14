import controlsSidebar from './zh-CN/components/ns/controls-side-bar';
import objectsSidebar from './zh-CN/components/ns/objects-side-bar';
import actionsMenu from './zh-CN/components/actions-menu';
import annotationPage from './zh-CN/components/annotation-page';
import changePasswordModal from './zh-CN/components/change-password-modal';
import createTaskPage from './zh-CN/components/create-task-page';
import cvatApp from './zh-CN/components/cvat-app';
import fileManager from './zh-CN/components/file-manager';
import globalErrorBoundary from './zh-CN/components/global-error-boundary';
import header from './zh-CN/components/header';
import labelsEditor from './zh-CN/components/labels-editor';
import loginPage from './zh-CN/components/login-page';
import modelRunnerModal from './zh-CN/components/model-runner-modal';
import modelsPage from './zh-CN/components/models-page';
import registerPage from './zh-CN/components/register-page';
import resetPasswordConfirmPage from './zh-CN/components/reset-password-confirm-page';
import shortcutsDialog from './zh-CN/components/shortcuts-dialog';
import resetPasswordPage from './zh-CN/components/reset-password-page';
import taskPage from './zh-CN/components/task-page';
import tasksPage from './zh-CN/components/tasks-page';
import cvatStore from './zh-CN/utils/cvat-store';
import gitUtils from './zh-CN/utils/git-utils';
import validationPatterns from './zh-CN/utils/validation-patterns';
import reducersUtils from './zh-CN/reducers/index';
import notificationsReducers from './zh-CN/reducers/notifications-reducer';

export default {
  controlsSidebar,
  objectsSidebar,
  ...actionsMenu,
  ...annotationPage,
  ...changePasswordModal,
  ...createTaskPage,
  ...cvatApp,
  ...fileManager,
  ...globalErrorBoundary,
  ...header,
  ...labelsEditor,
  ...loginPage,
  ...modelRunnerModal,
  ...modelsPage,
  ...registerPage,
  ...resetPasswordConfirmPage,
  ...shortcutsDialog,
  ...resetPasswordPage,
  ...taskPage,
  ...tasksPage,
  ...cvatStore,
  ...gitUtils,
  ...validationPatterns,
  ...reducersUtils,
  ...notificationsReducers,
}