export interface Auth {
}

export interface Login{
  email: string,
  password: string,
}
export interface Token{
  access_token:string,
  type: string
}
