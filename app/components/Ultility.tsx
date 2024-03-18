import useSignIn from "react-auth-kit/hooks/useSignIn";

export function FormattedPrice(price: any, currency: any) {
  return (price / 1).toLocaleString('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function FormattedDate(date: any) {
  return new Date(date).toDateString()
}

export function SaveToken(signIn: any, data: any, payload: any) {
  return signIn({
    auth: {
      token: data.access,
      type: 'Bearer'
    },
    refresh: data.refresh,
    userState: {
      id: data.user.id,
      email: data.user.email,
      first_name: data.user.first_name,
      last_name: data.user.last_name,
      phone: data.user.phone,
      role: payload.role
    }
  })
}