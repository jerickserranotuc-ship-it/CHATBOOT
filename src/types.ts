export interface Env {
  AI: Ai;
  ASSETS: {fetch(request:Request):Promise<Response>};
}
