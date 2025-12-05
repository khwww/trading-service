# Stockdodo - 실시간 주식 정보 플랫폼

국내/해외 주식의 실시간 시세와 차트를 제공하는 웹 애플리케이션입니다.

## 프로젝트 개요

주식을 처음 접하는 초보자도 실제 증권사처럼 구성된 UI를 통해 실시간 시세 변화, 등락률, 거래대금·거래량·랭킹 지표 등을 한눈에 확인하며 쉽고 안전하게 주식 시장의 흐름을 익힐 수 있는 서비스입니다.

## 프로젝트 목적

- 국내·해외 주식의 실시간 시세와 시장 변동성을 직관적으로 학습
- 거래대금/거래량/급상승/급하락 등 핵심 지표 중심의 종목 탐색 경험 제공
- 실제 증권사 앱과 유사한 화면 구성으로 시장 구조와 정보 해석 능력 향상
- 실시간 체결가(WebSocket), 호가/랭킹(REST API) 데이터 기반으로 진짜 시장처럼 움직이는 환경 제공

## 주요 기능

### 메인 페이지

- **시장 지수/환율 현황**: 다우존스, 나스닥, S&P 500, 달러/원 환율 실시간 조회
- **주식 랭킹**: 거래대금, 거래량, 등락률 기준 국내/해외 주식 랭킹
- **실시간 가격 업데이트**: 국내 주식 WebSocket 연동 실시간 시세

<img src="https://github.com/user-attachments/assets/dde3d9c7-48cd-4e7a-aecf-b8557addada9" width="800" />


### 상세 페이지

- **종목 헤더**: 종목명, 현재가, 등락률 등 종목 정보 표시 (국내: WebSocket 실시간 반영)
- **주식 차트**: 일별 시세 차트 (30초마다 자동 갱신)
- **일별 시세**: 날짜별 종가, 등락률, 거래량 조회 (국내: 당일 데이터 WebSocket 실시간 반영)+
- **실시간 체결**: 국내 주식의 경우 WebSocket으로 실시간 체결 정보 확인 가능

<img src="https://github.com/user-attachments/assets/96d493ef-09b6-4ccd-a5a3-be3a5c3e399c" width="800" />

  

### 사이드바

**관심 종목**: 로그인 시 하트 아이콘으로 관심 종목 등록/해제

<img src="https://github.com/user-attachments/assets/8aae1596-e8cd-4505-a727-c0884bd2ec7d" width="700" />

**최근 조회**: 최근 본 종목 목록 조회/해제

<img src="https://github.com/user-attachments/assets/6aff066f-41a4-4b10-afaf-fc6a9dde1c7e" width="700" />

**실시간 패널**: 실시간 시세 확인

<img src="https://github.com/user-attachments/assets/b46e6bde-f716-4116-9329-264b23a96e0f" width="700" />


## 기술 스택

| 구분      | 기술                     |
| --------- | ------------------------ |
| Framework | Next.js 16 (App Router)  |
| Language  | TypeScript               |
| UI        | React 19, Tailwind CSS 4 |
| 상태 관리 | TanStack React Query     |
| 차트      | Recharts                 |
| 아이콘    | Lucide React             |
| 인증      | Jose (JWT)               |

## 프로젝트 구조

```
├── app/
│   ├── api/
│   │   ├── _kis/          # KIS API 공통 클라이언트
│   │   ├── auth/          # 인증 API (로그인, 로그아웃, 콜백)
│   │   └── kis/           # 한국투자증권 API
│   │       ├── approval/  # WebSocket 인증키
│   │       ├── market/    # 시장 지수/환율
│   │       ├── ranking/   # 주식 랭킹 (국내/해외)
│   │       ├── stock/     # 주식 시세 (현재가/일별/해외)
│   │       └── token/     # API 토큰
│   └── stocks/[id]/       # 주식 상세 페이지
├── components/
│   ├── common/            # 공통 컴포넌트 (헤더, 인증)
│   ├── detail/            # 상세 페이지 (차트, 시세, 헤더)
│   ├── layout/            # 레이아웃 래퍼
│   ├── main/              # 메인 페이지 (랭킹, 필터, 테이블)
│   └── side-bar/          # 사이드바 (관심종목, 실시간, 최근조회)
├── hooks/                 # Custom Hooks (시세조회, 실시간, 관심종목)
├── lib/
│   └── kis/               # WebSocket 클라이언트 및 실시간 매니저
└── services/              # API 클라이언트 (주식, 랭킹, 시장지수)
```

## 시작하기

### 환경 변수 설정

`.env` 파일을 생성하고 다음 변수를 설정하세요:

```
# 한국투자증권 API
KIS_APP_KEY=your_app_key
KIS_APP_SECRET=your_app_secret
KIS_BASE_URL=https://openapi.koreainvestment.com:9443

# WebSocket (국내 주식 실시간 시세)
NEXT_PUBLIC_KIS_WS_URL=ws://ops.koreainvestment.com:21000

# 인증
KAKAO_REST_API_KEY
KAKAO_REDIRECT_URI
```

> 참고: 한국투자증권 API 키는 한국투자증권 Open API에서 발급받을 수 있습니다.

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

```

## API 연동

### 한국투자증권 Open API

| 기능                | API       | 비고       |
| ------------------- | --------- | ---------- |
| 국내 주식 현재가    | REST API  | 30초 폴링  |
| 국내 주식 일별 시세 | REST API  | -          |
| 해외 주식 현재가    | REST API  | -          |
| 해외 주식 일별 시세 | REST API  | -          |
| 시장 지수/환율      | REST API  | -          |
| 국내 실시간 시세    | WebSocket | ws:// 전용 |
