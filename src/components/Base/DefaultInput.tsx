import React, { InputHTMLAttributes, useState } from 'react';
import PropTypes from 'prop-types';
import SVG from 'react-inlinesvg';
import iconPass from '../../assets/icons/icon-pass.svg';
import Spinner from './Spinner';

interface IDefaultInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  type: string;
  containerClassName?: string;
  inputClassName?: string;
  showIcon?: boolean;
  loading?: boolean;
  errorInfo?: string;
}

const DefaultInput: React.FC<IDefaultInputProps> = ({
  label = '',
  required = false,
  error,
  type = 'text',
  containerClassName,
  inputClassName,
  showIcon = true,
  loading = false,
  disabled,
  ...props
}) => {
  const [passwordShown, setPasswordShown] = useState<boolean>(false);

  const showPass = (): void => {
    setPasswordShown(!passwordShown);
  };
  const isTypePass = type === 'password';
  return (
    <div className={`default-input ${containerClassName || ''}`}>
      <label className="label">
        {label}
        {required && '*'}
      </label>
      <div className="default-input__input-wrapper">
        <input
          {...props}
          readOnly={disabled}
          disabled={disabled}
          type={passwordShown ? 'text' : type}
          className={`input
                 ${error ? 'no-valid-input' : ''} ${inputClassName || ''}`}
        />
        {showIcon && error && !disabled && (
          <div>
            <div
              className={`default-input__control-icon ${
                isTypePass ? 'default-input__control-icon-pass' : ''
              }  ${error ? 'no-valid-input' : 'valid-input'}`}
            >
              {loading ? <Spinner center={false} /> : <div className="icon" />}
            </div>
          </div>
        )}
        {isTypePass && (
          <span className="default-input__pass-icon" onClick={showPass}>
            <SVG src={iconPass} width={18} />
          </span>
        )}
      </div>
      {error && <div className="default-input__error-text">{error}</div>}
    </div>
  );
};

DefaultInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DefaultInput;
