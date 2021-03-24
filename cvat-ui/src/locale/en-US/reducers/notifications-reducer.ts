import consts from 'consts';

export default {
    'Could not check authorization on the server': 'Could not check authorization on the server',
    'Could not login on the server': 'Could not login on the server',
    'Could not logout from the server': 'Could not logout from the server',
    'Could not register on the server': 'Could not register on the server',
    'To use your account, you need to confirm the email address.': 'To use your account, you need to confirm the email address.',
    'We have sent an email with a confirmation link to ${action.payload.user.email}.': 'We have sent an email with a confirmation link to ${action.payload.user.email}.',
    'New password has been saved.': 'New password has been saved.',
    'Could not change password': 'Could not change password',
    'Check your email for a link to reset your password.': 'Check your email for a link to reset your password.',
    'If it doesn’t appear within a few minutes, check your spam folder.': 'If it doesn’t appear within a few minutes, check your spam folder.',
    'Could not reset password on the server.': 'Could not reset password on the server.',
    'Password has been reset with the new password.': 'Password has been reset with the new password.',
    'Could not set new password on the server.': 'Could not set new password on the server.',
    'Could not check available auth actions': 'Could not check available auth actions',
    'Could not export dataset for the <a href="/tasks/${taskID}" target="_blank">task ${taskID}</a>': `Could not export dataset for the <a href="${consts.BASENAME}/tasks/{{taskID}}" target="_blank">task {{taskID}}</a>`,
    'Could not fetch tasks': 'Could not fetch tasks',
    'Could not upload annotation for the <a href="/tasks/${taskID}" target="_blank">task ${taskID}</a>': `Could not upload annotation for the <a href="${consts.BASENAME}/tasks/{{taskID}}" target="_blank">task {{taskID}}</a>`,
    'Annotations have been loaded to the <a href="/tasks/${taskID}" target="_blank">task ${taskID}</a>': `Annotations have been loaded to the <a href="${consts.BASENAME}/tasks/{{taskID}}" target="_blank">task {{taskID}}</a>`,
    'Could not update <a href="/tasks/${taskID}" target="_blank">task ${taskID}</a>': `Could not update <a href="${consts.BASENAME}/tasks/{{taskID}}" target="_blank">task {{taskID}}</a>`,
    'Could not dump annotations for the <a href="/tasks/${taskID}" target="_blank">task ${taskID}</a>': `Could not dump annotations for the <a href="${consts.BASENAME}/tasks/{{taskID}}" target="_blank">task {{taskID}}</a>`,
    'Could not delete the <a href="/tasks/${taskID}" target="_blank">task ${taskID}</a>': `Could not delete the <a href="${consts.BASENAME}/tasks/{{taskID}}" target="_blank">task {{taskID}}</a>`,
    'Could not create the task': 'Could not create the task',
    'Could not get formats from the server': 'Could not get formats from the server',
    'Could not get users from the server': 'Could not get users from the server',
    'Could not get info about the server': 'Could not get info about the server',
    'Could not load share data from the server': 'Could not load share data from the server',
    'Automatic annotation finished for the <a href="/tasks/${taskID}" target="_blank">task ${taskID}</a>': `Automatic annotation finished for the <a href="${consts.BASENAME}/tasks/{{taskID}}" target="_blank">task {{taskID}}</a>`,
    'Could not fetch models meta information': 'Could not fetch models meta information',
    'Fetching inference status for the <a href="/tasks/${taskID}" target="_blank">task ${taskID}</a>': `Fetching inference status for the <a href="${consts.BASENAME}/tasks/{{taskID}}" target="_blank">task {{taskID}}</a>`,
    'Could not get models from the server': 'Could not get models from the server',
    'Could not infer model for the <a href="/tasks/${taskID}" target="_blank">task ${taskID}</a>': `Could not infer model for the <a href="${consts.BASENAME}/tasks/{{taskID}}" target="_blank">task {{taskID}}</a>`,
    'Could not cancel model inference for the <a href="/tasks/${taskID}" target="_blank">task ${taskID}</a>': `Could not cancel model inference for the <a href="${consts.BASENAME}/tasks/{{taskID}}" target="_blank">task {{taskID}}</a>`,
    'Error during fetching a job': 'Error during fetching a job',
    'Could not receive frame ${action.payload.number}': 'Could not receive frame ${action.payload.number}',
    'Could not save annotations': 'Could not save annotations',
    'Could not update annotations': 'Could not update annotations',
    'Could not create annotations': 'Could not create annotations',
    'Could not merge annotations': 'Could not merge annotations',
    'Could not group annotations': 'Could not group annotations',
    'Could not split the track': 'Could not split the track',
    'Could not remove the object': 'Could not remove the object',
    'Could not propagate the object': 'Could not propagate the object',
    'Could not collect annotations statistics': 'Could not collect annotations statistics',
    'Could not save the job on the server': 'Could not save the job on the server',
    'Could not upload annotations for the <a href="/tasks/${taskID}/jobs/${jobID}" target="_blank">job ${taskID}</a>': `Could not upload annotations for the <a href="${consts.BASENAME}/tasks/{{taskID}}/jobs/{{jobID}}" target="_blank">job {{taskID}}</a>`,
    'Could not remove annotations': 'Could not remove annotations',
    'Could not fetch annotations': 'Could not fetch annotations',
    'Could not redo': 'Could not redo',
    'Could not undo': 'Could not undo',
    'Could not execute search annotations': 'Could not execute search annotations',
    'Could not send logs to the server': 'Could not send logs to the server',
    'Could not reset the state': 'Could not reset the state',
    'Could not get user agreements from the server': 'Could not get user agreements from the server',
  }