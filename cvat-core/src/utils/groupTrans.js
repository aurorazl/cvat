// 将用户系统的permissionList转换成CVAT对应的group
const groupTrans = (permissionList) => {
    if (permissionList.includes('ANNOTATIONS_ADMIN')) {
        return ['admin'];
    }
    if (permissionList.includes('ANNOTATIONS_USER')) {
        return ['user'];
    }
    if (permissionList.includes('ANNOTATIONS_ANNOTATOR')) {
        return ['annotator'];
    }
    if (permissionList.includes('ANNOTATIONS_OBSERVER')) {
        return ['observer'];
    }
}

module.exports = {
    groupTrans,
};