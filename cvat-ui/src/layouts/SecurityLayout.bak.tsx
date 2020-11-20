import React from 'react';
import { ConfigProvider, message } from 'antd';
import PageLoading from 'PageLoading';
// import { Redirect, connect, ConnectProps } from 'umi';
import { stringify } from 'querystring';
import { Redirect, Route, Switch } from 'react-router';
import { connect } from 'react-redux';
// import { ConnectState } from '@/models/connect';
// import { CurrentUser } from '@/models/user';
import { USER_LOGIN_URL } from 'utils/const';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  collectAuthInfo = () => {
    let token = '';
    let error = '';
    const { location, history } = this.props;
    if (location && location.query && location.query.token) {
      token = location.query.token;
    }
    if (token) {
      localStorage.token = token;
      let redirectPath = location?.pathname;
      const routerBase = window.routerBase;
      if (routerBase.includes(redirectPath) || redirectPath?.includes(routerBase)) {
        history && history.push('/');
      } else {
        history && history.push(location.pathname);
      }
    }
    if (location && location.query && location.query.error) {
      error = location.query.error;
    }
    if (error) {
      message.error(error);
      let redirectPath = location?.pathname;
      const routerBase = window.routerBase;
      if (routerBase.includes(redirectPath) || redirectPath?.includes(routerBase)) {
        history && history.push('/');
      } else {
        history && history.push(location.pathname);
      }
    }
  };

  componentDidMount() {
    if (!localStorage.token) {
      const queryString = stringify({
        redirect: window.location.href,
      });
      if (process.env.NODE_ENV !== 'development') {
        window.location.href = USER_LOGIN_URL + '?' + queryString;
      }
    }    
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
    this.setState({
      isReady: true,
    });
    this.collectAuthInfo();
  }

  render() {
    // const { isReady } = this.state;
    // const { children, loading, currentUser } = this.props;
    // // You can replace it to your authentication rule (such as check token exists)
    // // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    // const isLogin = currentUser && currentUser.userid;
    // const queryString = stringify({
    //   redirect: window.location.href,
    // });

    // if ((!isLogin && loading) || !isReady) {
    //   return <PageLoading />;
    // }
    // if (!isLogin && window.location.pathname !== '/user/login') {
    //   return <Redirect to={`/user/login?${queryString}`} />;
    // }
    // return children;

    const { isReady } = this.state;
    const { children, loading } = this.props;
    const token = localStorage.token;
    if (loading || !isReady) {
      return <PageLoading />;
    }
    // const getLanguage = () => {
    //   const lang = getLocale();
    //   if (lang === 'en-US') {
    //     return enUS;
    //   } else if (lang === 'zh-CN') {
    //     return zhCN;
    //   }
    // };
    if (!token) {
      return (
        // <LoginPage />
        <PageLoading />
      );
    }

    // return <ConfigProvider locale={getLanguage()}>{children}</ConfigProvider>;
       
    return children;
  }
}

// export default connect(({ user, loading }: ConnectState) => ({
//   currentUser: user.currentUser,
//   loading: loading.models.user,
// }))(SecurityLayout);

export default connect(({ user }) => ({
  user,
}))(SecurityLayout);
