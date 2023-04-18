import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { Cookies } from "react-cookie";
import * as jwt from "jsonwebtoken";

const cookies = new Cookies();
export const setCookie = (name: string, value: string, option?: any) => {
  return cookies.set(name, value);
};

export const getCookie = (name: string) => {
  return cookies.get(name);
};

const accessToken = getCookie("accessToken");
const refreshToken = getCookie("refreshToken");

//!서버주소 따로 공통으로 뺴주기
export const customAxios: AxiosInstance = axios.create({
  baseURL: `${"http://localhost:8000"}`, // 기본 서버 주소 입력
  headers: {
    "Content-Type": "application/json",
    // accessToken: cookies.get("accessToken"),
  },
});

//!interceptor(request)
//!요청보내기 직전에 가로채서 실행
//!axios요청 보낼때 accesstoken넣어주기
const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
  /* 토큰이 있을 경우 헤더에 삽입한다. 없을 경우 빈 문자열을 넣는다(null은 안됨) */
  /*!!은 데이터를 boolean타입으로 형변환을 시켜준다*/
  config.headers = {
    Authorization: !!accessToken ? `Bearer ${accessToken}` : "",
  };
  return config;
};
const onErrorRequest = (err: AxiosError | Error): Promise<AxiosError> => {
  return Promise.reject(err);
};

customAxios.interceptors.request.use(onRequest, onErrorRequest);

//!interceptor(response)
//!서버에서 응답이 돌아온 직후에 낚아채서 실행
//!accessToken만료시 refreshToken 요청하기
const onResponse = (res: AxiosResponse): AxiosResponse => {
  return res;
};
/* http response가 catch로 넘어가기 전에 호출되는 함수이다.*/
const onErrorResponse = async (err: AxiosError | Error) => {
  const _err = err as unknown as AxiosError; // err 객체의 타입은 unknown이므로 타입 단언을 해줌
  const { response } = _err; // err 객체에서 response 를 구조 분해 할당
  const originalConfig = _err?.config; // 기존의 요청 정보를 저장한다.
  console.log("response");
  if (response && response.status === 419) {
    // refresh token이 쿠키에서 삭제 또는 만료 되었을 경우
    if (!!refreshToken === false) {
      console.log("리프레시 토큰 쿠키 삭제 또는 만료됨 ");
      //로그인여부 상태값변경
    } else {
      try {
        // 만료된 access token과 refresh token을 이용해 리프레시api에 갱신 요청
        const data = await customAxios.post(
          `/refresh`,
          {}, // 백엔드에서 빈 객체 body를 받을 수 있도록 수정 요청
          {
            headers: {
              Refresh: `Bearer ${refreshToken}`,
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (data) {
          // 응답값이 있을 경우 새로 발급 받은 토큰을 저장한다.
          await setCookie("newToken", accessToken); // 토큰을 쿠키에 저장 비동기 함수
          return await customAxios.request(originalConfig);
        }
      } catch (err) {
        // 리프레시 토큰 만료. 로그아웃 처리
        const _err = err as unknown as AxiosError;
        console.log(_err?.config?.data);
      }
    }
  }
};
//요청을 보내기 직전에 가로채서 실행
customAxios.interceptors.response.use(onResponse, onErrorResponse);
