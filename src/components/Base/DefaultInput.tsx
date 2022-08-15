import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SVG from 'react-inlinesvg';
import iconPass from '../../assets/icons/icon-pass.svg';
import Spinner from './Spinner';

interface IDefaultInput {
  value?: string | number;
  name: string;
  label: string;
  required: boolean;
  withoutSpaces: boolean;
  onChange: (
    name: string,
    withoutSpaces: boolean,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  error?: string;
  placeholder: string;
  type: string;
  autoComplete?: string;
  containerClassName?: string;
  inputClassName?: string;
  showIcon?: boolean;
  loading?: boolean;
  errorInfo?: string;
  disabled?: boolean;
}

const DefaultInput: React.FC<IDefaultInput> = ({
  value,
  name,
  label = '',
  required = false,
  withoutSpaces = false,
  onChange,
  error,
  placeholder = '...',
  type = 'text',
  autoComplete = 'off',
  containerClassName,
  inputClassName,
  showIcon = true,
  loading = false,
  disabled,
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
          readOnly={disabled}
          disabled={disabled}
          type={passwordShown ? 'text' : type}
          placeholder={placeholder}
          name={name}
          value={value}
          autoComplete={autoComplete}
          onChange={(event) => onChange(name, withoutSpaces, event)}
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
