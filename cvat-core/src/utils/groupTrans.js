// 将用户系统的permissionList转换成CVAT对应的group
const groupTrans = (permissionList) => {
    let groups = [];

    if (permissionList.includes('ANNOTATIONS_ADMIN')) {
        groups.push('admin');
    }
    if (permissionList.includes('ANNOTATIONS_USER')) {
        groups.push('user');
    }
    if (permissionList.includes('ANNOTATIONS_ANNOTATOR')) {
        groups.push('annotator');
    }
    if (permissionList.includes('ANNOTATIONS_OBSERVER')) {
        groups.push('observer');
    }

    return groups;
}

module.exports = {
    groupTrans,
};