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
import LoginPage from 'exception/401';

interface SecurityLayoutProps {
// interface SecurityLayoutProps extends ConnectProps {
  loading?: boolean;
  currentUser?: any;
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

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    // const { dispatch } = this.props;
    // if (dispatch) {
    //   dispatch({
    //     type: 'user/fetchCurrent',
    //   });
    // }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser } = this.props;
    // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    const isLogin = currentUser && currentUser.userid;
    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }
    if (!isLogin && window.location.pathname !== '/user/login') {
      // return <Redirect to={`${USER_LOGIN_URL}?${queryString}`} />;
      return <LoginPage />
    }
    return children;
  }
}

export default connect()(SecurityLayout);
