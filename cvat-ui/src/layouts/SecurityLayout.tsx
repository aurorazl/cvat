import React from 'react';
import PageLoading from 'PageLoading';
import { stringify } from 'querystring';
import { Redirect } from 'react-router';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { USER_LOGIN_URL } from 'utils/const';
import LoginPage from 'exception/401';
import { loginWithTokenAsync } from 'actions/auth-actions';
import { CombinedState } from 'reducers/interfaces';

interface SecurityLayoutProps extends RouteComponentProps {
  fetching?: boolean;
  user?: any;
  // onLogin: (token: string) => void;
  onLogin: (token: string) => Promise<void>;
}

interface SecurityLayoutState {
  isReady: boolean;
}

interface StateToProps {
  fetching: boolean;
  user: any;
}

interface DispatchToProps {
  onLogin: typeof loginWithTokenAsync;
}

function mapStateToProps(state: CombinedState): StateToProps {
  return {
    fetching: state.auth.fetching,
    user: state.auth.user,
  };
}

const mapDispatchToProps: DispatchToProps = {
  onLogin: loginWithTokenAsync,
};

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  processAuth = (token: string) => {
    const { location, history, onLogin } = this.props;

    const queryString = stringify({
      redirect: window.location.href,
    });

    onLogin(token).then(user=>{

    }).catch(error =>{
      localStorage.removeItem('token');
      window.location.href = USER_LOGIN_URL + '?' + queryString;
    });
  }

  componentDidMount() {
    // console.log('---componentDidMount---')

    const { location, history, onLogin } = this.props;

    const queryString = stringify({
      redirect: window.location.href,
    });

    if (!localStorage.token) {
      // if (process.env.NODE_ENV !== 'development') {
      if (!(location && /\?token=/.test(location.search))) {
        window.location.href = USER_LOGIN_URL + '?' + queryString;
      }
    }


    let token = localStorage.getItem('token');

    if(token){
      this.setState({
        isReady: true,
      });
      this.processAuth(token);
    }

    if (!token && location && location.search) {
      if(/\?token=/.test(location.search)){
        token = location.search.replace(/\?token=/, '');
        localStorage.setItem('token', token);

        this.setState({
          isReady: true,
        });
        this.processAuth(token);
      }
    }
  }

  render() {
    // console.log('---render---')
    const { isReady } = this.state;
    const { location, history, fetching, user, onLogin } = this.props;

    // 已经登录
    const isLogin = user && user.id;
    if (isLogin) {
      return <Redirect push to='/tasks' />
    }

    // 有token，但未登录
    let token = localStorage.getItem('token');
    if (!!token) {
      return <PageLoading />
    }
    // 从登录页面返回，qs中带token字符串
    if (!token && location && location.search && /\?token=/.test(location.search)) {
      return <PageLoading />
    }

    if(isReady) {
      return <PageLoading />
    }

    return <LoginPage />;
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SecurityLayout));
