import React from 'react'
import { useRouteError } from 'react-router-dom'

const ErrorPage = () => {
    const error = useRouteError();
    console.log(error);
  return (
    <>
        <h1>Oops! This is error page</h1>
        {error && (
            <h4>{error.data}</h4>
        )}
    </>
  )
}

export default ErrorPage