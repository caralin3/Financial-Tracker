// import * as React from 'react';
// import { Link, withRouter } from 'react-router-dom';
// import { auth } from '../firebase';
// import * as routes from '../routes/pages';
// import { User } from '../utility/types';
// import { Dispatch } from 'redux';
// import { setCurrentUser, SetCurrentUserAction } from 'src/reducers';

// const SignUpComponent: React.SFC = ({history}: any) => (
//   <div>
//     <h1>Sign Up</h1>
//     <SignUpForm history={history} />
//   </div>
// )

// export const SignUpPage = withRouter(SignUpComponent);

// interface StateMappedProps {}

// interface DispatchMappedProps {
//   dispatch: Dispatch<SetCurrentUserAction>
// }

// interface SignUpMergedProps extends
//   StateMappedProps,
//   DispatchMappedProps,
//   SignUpFormProps {}

// interface SignUpFormProps {
//   history: any
// }

// interface SignUpFormState {
//   email: string,
//   error: any,
//   passwordOne: string,
//   passwordTwo: string,
//   username: string
// }

// class SignUpForm extends React.Component<SignUpMergedProps, SignUpFormState> {
//   public readonly state: SignUpFormState = {
//     email: '',
//     error: null,
//     passwordOne: '',
//     passwordTwo: '',
//     username: ''
//   }

//   public render() {
//     const { email, error, passwordOne, passwordTwo, username } = this.state;
//     const isInvalid =
//       passwordOne !== passwordTwo ||
//       passwordOne === '' ||
//       email === '' ||
//       username === '';
//     return (
//       <form onSubmit={this.onSubmit}>
//         <input
//           value={username}
//           onChange={(e) => this.onChange(e, 'username')}
//           type='text'
//           placeholder='Full Name' 
//         />
//         <input
//           value={email}
//           onChange={(e) => this.onChange(e, 'email')}
//           type='text'
//           placeholder='Email Address' 
//         />
//         <input
//           value={passwordOne}
//           onChange={(e) => this.onChange(e, 'passwordOne')}
//           type='password'
//           placeholder='Password' 
//         />
//         <input
//           value={passwordTwo}
//           onChange={(e) => this.onChange(e, 'passwordTwo')}
//           type='password'
//           placeholder='Confirm Password' 
//         />
//         <button type='submit' disabled={isInvalid}>Sign Up</button>

//         {error && <p>{error.message}</p>}
//       </form>
//     )
//   }

//   private byPropKey = (propertyName: string, value: any): object => {
//     return {[propertyName]: value}
//   }

//   private onChange = (event: React.ChangeEvent<HTMLInputElement>, propertyName: string) => {
//     this.setState(this.byPropKey(propertyName, event.target.value));
//   }

//   private onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     const { email, passwordOne } = this.state;
//     auth.doCreateUserWithEmailAndPassword(email, passwordOne)
//     .then((user: any) => {
//       const currentUser: User = {
//         email: email,
//         firstName: '',
//         id: user.user.uid,
//         lastName: '',
//       };
//       this.props.dispatch(setCurrentUser(currentUser));
//       // TODO: Create a user in your own accessible Firebase Database too
//     }).then(() => {
//       this.setState({
//         email: '',
//         error: null,
//         passwordOne: '',
//         passwordTwo: '',
//         username: ''
//       });
//       this.props.history.push(routes.DASHBOARD);
//     })
//     .catch((error: any) => {
//       this.setState(this.byPropKey('error', error));
//     });
//     event.preventDefault();
//   }
// }



// export const SignUpLink: React.SFC = () => (
//   <p> Don't have an account? {' '} <Link to={routes.SIGN_UP}>Sign Up</Link></p>
// )
