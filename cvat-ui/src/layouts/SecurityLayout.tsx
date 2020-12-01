import React from 'react';
import { ConfigProvider, message } from 'antd';
import PageLoading from 'PageLoading';
// import { Redirect, connect, ConnectProps } from 'umi';
import { stringify } from 'querystring';
import { Redirect, Route, Switch } from 'react-router';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
// import { ConnectState } from '@/models/connect';
// import { CurrentUser } from '@/models/user';
import { USER_LOGIN_URL } from 'utils/const';
import LoginPage from 'exception/401';
import { loginWithTokenAsync } from 'actions/auth-actions';

// interface SecurityLayoutProps {
interface SecurityLayoutProps extends RouteComponentProps {
  loading?: boolean;
  currentUser?: any;
  onLogin: (token: string) => void;
}

interface SecurityLayoutState {
  isReady: boolean;
}

// interface StateToProps {
//   isReady: boolean;
// }

// interface DispatchToProps {
//   switchShortcutsDialog(): void;
// }

interface DispatchToProps {
  onLogin: typeof loginWithTokenAsync;
}

// function mapStateToProps(state: CombinedState): StateToProps {
//   const {
//       shortcuts: { visibleShortcutsHelp: visible },
//   } = state;

//   return {
//       visible,
//   };
// }

// function mapDispatchToProps(dispatch: any): DispatchToProps {
//   return {
//       switchShortcutsDialog(): void {
//           dispatch(shortcutsActions.switchShortcutsDialog());
//       },
//   };
// }

const mapDispatchToProps: DispatchToProps = {
  onLogin: loginWithTokenAsync,
};

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  collectAuthInfo = () => {
    let token = '';
    let error = '';
    const { location, history } = this.props;

    if (location && location.search && (/\?token=/.test(location.search))) {
      token = location.search.replace(/\?token=/, '');
    }
    // if (location && location.query && location.query.token) {
    //   token = location.query.token;
    // }
    if (token) {
      // localStorage.token = token;
      let redirectPath = location?.pathname;
      // const routerBase = window.routerBase;
      // if (routerBase.includes(redirectPath) || redirectPath?.includes(routerBase)) {
      //   history && history.push('/');
      // } else {
      //   history && history.push(location.pathname);
      // }
      history && history.push(location.pathname);
    }
    // if (location && location.query && location.query.error) {
    //   error = location.query.error;
    // }
    // if (error) {
    //   message.error(error);
    //   let redirectPath = location?.pathname;
    //   const routerBase = window.routerBase;
    //   if (routerBase.includes(redirectPath) || redirectPath?.includes(routerBase)) {
    //     history && history.push('/');
    //   } else {
    //     history && history.push(location.pathname);
    //   }
    // }
  };

  componentDidMount() {
    debugger
    if (!localStorage.token) {
      const queryString = stringify({
        redirect: window.location.href,
      });
      // if (process.env.NODE_ENV !== 'development') {
        window.location.href = USER_LOGIN_URL + '?' + queryString;
      // }
    }

    const { location, history, onLogin } = this.props;

    let token = localStorage.getItem('token');

    if(token){
      onLogin(token);
    }

    this.setState({
      isReady: true,
    });
    // console.log(666, this.props.location, this.props.history)
    if (!token && location && location.search) {
      // console.log(888, location.search)
      if(/\?token=/.test(location.search)){
        token = location.search.replace(/\?token=/, '');
        // console.log(777,token);
        localStorage.setItem('token', token);

        onLogin(token);
      }
    }
    // const { dispatch } = this.props;
    // if (dispatch) {
    //   dispatch({
    //     type: 'user/fetchCurrent',
    //   });
    // }
  }

  render() {
    debugger
    const { isReady } = this.state;
    const { location, history, onLogin } = this.props;
    const { children, loading, currentUser } = this.props;
    // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    // const isLogin = currentUser && currentUser.userid;
    const isLogin = !!localStorage.getItem('token');

    const queryString = stringify({
      redirect: window.location.href,
    });

    if (!isLogin && !isReady) {
      // return <PageLoading />;
      // return <LoginPage />;
      return <Redirect to={`${USER_LOGIN_URL}?${queryString}`} />;
    }
    // if (!isLogin && window.location.pathname !== '/auth/login') {
    //   // return <Redirect to={`${USER_LOGIN_URL}?${queryString}`} />;
    //   return <LoginPage />
    // }
    return children;
    // history && history.push(location.pathname);
    return <PageLoading />;
    // this.collectAuthInfo();

    // return <Redirect push to='/tasks' />
  }
}

export default withRouter(connect(null, mapDispatchToProps)(SecurityLayout));
