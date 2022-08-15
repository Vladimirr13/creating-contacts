export const handleValidName = (name: string): string => {
  if (name === '') {
    return 'Не может быть пустым';
  } else {
    return '';
  }
};

export const handleValidEmail = (email: string): string => {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  if (email === '') {
    return 'Не может быть пустым';
  } else if (!regexEmail.test(email)) {
    return 'Неверный формат электронной почты';
  } else {
    return '';
  }
};
export const handleValidPhone = (phone: string, maxPhoneLength: number): string => {
  if (phone === '') {
    return 'Не может быть пустым';
  } else if (phone.length < maxPhoneLength) {
    return `телефон должен состоять из ${maxPhoneLength} цифр`;
  } else {
    return '';
  }
};
export const handleValidPassword = (password: string, maxPassLength: number): string => {
  if (password === '') {
    return 'Не может быть пустым';
  } else if (password.length < maxPassLength) {
    return `Пароль должен содержать минимум ${maxPassLength} символов`;
  } else {
    return '';
  }
};
export const handleValidConfirmPassword = (
  confirmPassword: string | undefined,
  currentPass: string,
): string => {
  if (confirmPassword === '') {
    return 'Не может быть пустым';
  } else if (confirmPassword !== currentPass) {
    return 'Пароли должны совпадать';
  } else {
    return '';
  }
};
