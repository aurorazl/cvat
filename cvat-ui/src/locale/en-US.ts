import actionsMenu from './en-US/components/actions-menu';
import annotationPage from './en-US/components/annotation-page';
import changePasswordModal from './en-US/components/change-password-modal';
import createTaskPage from './en-US/components/create-task-page';
import cvatApp from './en-US/components/cvat-app';
import fileManager from './en-US/components/file-manager';
import globalErrorBoundary from './en-US/components/global-error-boundary';
import header from './en-US/components/header';
import labelsEditor from './en-US/components/labels-editor';
import loginPage from './en-US/components/login-page';
import modelRunnerModal from './en-US/components/model-runner-modal';
import modelsPage from './en-US/components/models-page';
import registerPage from './en-US/components/register-page';
import resetPasswordConfirmPage from './en-US/components/reset-password-confirm-page';
import shortcutsDialog from './en-US/components/shortcuts-dialog';
import resetPasswordPage from './en-US/components/reset-password-page';
import taskPage from './en-US/components/task-page';
import tasksPage from './en-US/components/tasks-page';
import cvatStore from './en-US/utils/cvat-store';
import gitUtils from './en-US/utils/git-utils';
import validationPatterns from './en-US/utils/validation-patterns';
import reducersUtils from './en-US/reducers/index';

export default {
  actionsMenu,
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
}