// 转换获取用户列表结果
// http://192.168.1.203:8080/api/v1/users?page_size=all
const usersListTrans = (response) => {
    let arr = response.data.list.map(user => ({
        id: user.id,
        username: user.userName,
        email: user.email,
        is_staff: true,
        is_superuser: true,
        is_active: true,
        groups: ['admin'],
    }));

    return arr;
}

// 转换获取用户信息
// http://192.168.1.203:8080/api/v1/users/1
const userTrans = (response) => {
    return {
        id: response.data.user.id,
        username: response.data.user.userName,
        email: response.data.user.email,
        is_staff: true,
        is_superuser: true,
        is_active: true,
        groups: ['admin'],
    };
}

module.exports = {
    usersListTrans,
    userTrans,
};