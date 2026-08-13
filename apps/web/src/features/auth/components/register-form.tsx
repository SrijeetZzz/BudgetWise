'use client';

import { useState } from 'react';

import type { RegisterSchema } from '../schemas/register.schema';
import { RegisterOtpForm } from './register-otp-form';
import { RegisterDetailsForm } from './register-details-form';

export function RegisterForm() {
  const [step, setStep] = useState<1 | 2>(1);

  const [registrationData, setRegistrationData] =
    useState<RegisterSchema | null>(null);

  const handleOtpSent = (data: RegisterSchema) => {
    setRegistrationData(data);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  if (step === 2 && registrationData) {
    return (
      <RegisterOtpForm
        registrationData={registrationData}
        onBack={handleBack}
      />
    );
  }

  return (
    <RegisterDetailsForm
      onOtpSent={handleOtpSent}
    />
  );
}