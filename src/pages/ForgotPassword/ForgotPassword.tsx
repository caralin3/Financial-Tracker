import * as React from 'react';
import { ForgotPasswordForm, Header } from '../../components';

export interface ForgotPasswordPageProps {}

export const ForgotPasswordPage: React.SFC<ForgotPasswordPageProps> = (props) => (
  <div className="forgotPassword">
    <Header />
    <div>
      <ForgotPasswordForm />
    </div>
  </div>
)
