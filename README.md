# Fig Diff

<p align='center'>
  <img width="128" style='center' alt="logo" src="https://github.com/user-attachments/assets/87900551-f73d-4f88-9a37-c3ff57a58f7f">
</p>

FigDiff는 피그마 디자인 파일과 내가 보고있는 웹 화면을 웹에서 한눈에 비교하여 볼 수 있는 크롬 익스텐션 입니다.

# 목차

- [🛠️ 기술스택](#%F0%9F%9B%A0%EF%B8%8F-%EA%B8%B0%EC%88%A0%EC%8A%A4%ED%83%9D)
  - [Environment](#environment)
  - [Config](#config)
  - [Development](#development)
- [🙋‍♂️ 프로젝트 소개](#%F0%9F%99%8B%E2%80%8D%E2%99%82%EF%B8%8F-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%86%8C%EA%B0%9C)
- [💪 동기](#%F0%9F%92%AA-%EB%8F%99%EA%B8%B0)
- [🕹️ 사용법 및 기능](#%F0%9F%95%B9%EF%B8%8F-%EC%82%AC%EC%9A%A9%EB%B2%95-%EB%B0%8F-%EA%B8%B0%EB%8A%A5)
- [🔍 기술 검증](#%F0%9F%94%8D-%EA%B8%B0%EC%88%A0-%EA%B2%80%EC%A6%9D)
  - [웹과 피그마를 어떻게 비교할 수 있을까?](#%EC%9B%B9%EA%B3%BC-%ED%94%BC%EA%B7%B8%EB%A7%88%EB%A5%BC-%EC%96%B4%EB%96%BB%EA%B2%8C-%EB%B9%84%EA%B5%90%ED%95%A0-%EC%88%98-%EC%9E%88%EC%9D%84%EA%B9%8C)
    - [1. Figma JSON vs HTML(DOM)](#1-figma-json-vs-htmldom)
      - [문제점](#%EB%AC%B8%EC%A0%9C%EC%A0%90)
    - [2. 피그마 JSON → HTML 변환 후 DOM 에서 비교하기](#2-%ED%94%BC%EA%B7%B8%EB%A7%88-json-%E2%86%92-html-%EB%B3%80%ED%99%98-%ED%9B%84-dom-%EC%97%90%EC%84%9C-%EB%B9%84%EA%B5%90%ED%95%98%EA%B8%B0)
      - [문제점](#%EB%AC%B8%EC%A0%9C%EC%A0%90-1)
    - [3. HTML 과 피그마 파일 모두 ‘이미지’로 변환 후 대조하기 (Pixel Diffing)](#3-html-%EA%B3%BC-%ED%94%BC%EA%B7%B8%EB%A7%88-%ED%8C%8C%EC%9D%BC-%EB%AA%A8%EB%91%90-%EC%9D%B4%EB%AF%B8%EC%A7%80%EB%A1%9C-%EB%B3%80%ED%99%98-%ED%9B%84-%EB%8C%80%EC%A1%B0%ED%95%98%EA%B8%B0-pixel-diffing)
      - [실제 피그마 파일 VS 웹 페이지 이미지 Diffing 예시](#%EC%8B%A4%EC%A0%9C-%ED%94%BC%EA%B7%B8%EB%A7%88-%ED%8C%8C%EC%9D%BC-vs-%EC%9B%B9-%ED%8E%98%EC%9D%B4%EC%A7%80-%EC%9D%B4%EB%AF%B8%EC%A7%80-diffing-%EC%98%88%EC%8B%9C)
      - [Figma JSON 의 absoluteBoundingBox 속성](#figma-json-%EC%9D%98-absoluteboundingbox-%EC%86%8D%EC%84%B1)
    - [결론: 이미지로 비교하여 차이나는 지점을 찾는것이 현실적](#%EA%B2%B0%EB%A1%A0-%EC%9D%B4%EB%AF%B8%EC%A7%80%EB%A1%9C-%EB%B9%84%EA%B5%90%ED%95%98%EC%97%AC-%EC%B0%A8%EC%9D%B4%EB%82%98%EB%8A%94-%EC%A7%80%EC%A0%90%EC%9D%84-%EC%B0%BE%EB%8A%94%EA%B2%83%EC%9D%B4-%ED%98%84%EC%8B%A4%EC%A0%81)
- [🏔️ 챌린지](#%F0%9F%8F%94%EF%B8%8F-%EC%B1%8C%EB%A6%B0%EC%A7%80)
  - [1. 일반적으로 두개의 이미지는 어떻게 디핑이 이루어질까?](#1-%EC%9D%BC%EB%B0%98%EC%A0%81%EC%9C%BC%EB%A1%9C-%EB%91%90%EA%B0%9C%EC%9D%98-%EC%9D%B4%EB%AF%B8%EC%A7%80%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%EB%94%94%ED%95%91%EC%9D%B4-%EC%9D%B4%EB%A3%A8%EC%96%B4%EC%A7%88%EA%B9%8C)
  - [2. 이미지 디핑 로직 최적화는 어떻게 할까?](#2-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%94%94%ED%95%91-%EB%A1%9C%EC%A7%81-%EC%B5%9C%EC%A0%81%ED%99%94%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%ED%95%A0%EA%B9%8C)
    - [무거운 연산의 디핑 로직](#%EB%AC%B4%EA%B1%B0%EC%9A%B4-%EC%97%B0%EC%82%B0%EC%9D%98-%EB%94%94%ED%95%91-%EB%A1%9C%EC%A7%81)
    - [Node.js 의 기본 실행 구조](#nodejs-%EC%9D%98-%EA%B8%B0%EB%B3%B8-%EC%8B%A4%ED%96%89-%EA%B5%AC%EC%A1%B0)
    - [Worker Threads 의 도입](#worker-threads-%EC%9D%98-%EB%8F%84%EC%9E%85)
    - [Single Thread vs Worker Threads 특징 비교](#single-thread-vs-worker-threads-%ED%8A%B9%EC%A7%95-%EB%B9%84%EA%B5%90)
    - [Worker Threads 를 사용해보자.](#worker-threads-%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%B4%EB%B3%B4%EC%9E%90)
    - [블록 평균 색상 계산](#%EB%B8%94%EB%A1%9D-%ED%8F%89%EA%B7%A0-%EC%83%89%EC%83%81-%EA%B3%84%EC%82%B0)
    - [픽셀 간 색상 차이 계산](#%ED%94%BD%EC%85%80-%EA%B0%84-%EC%83%89%EC%83%81-%EC%B0%A8%EC%9D%B4-%EA%B3%84%EC%82%B0)
    - [Worker Threads 적용 결과](#worker-threads-%EC%A0%81%EC%9A%A9-%EA%B2%B0%EA%B3%BC)
  - [3. 모든 유저들의 뷰포트 크기는 다르다](#3-%EB%AA%A8%EB%93%A0-%EC%9C%A0%EC%A0%80%EB%93%A4%EC%9D%98-%EB%B7%B0%ED%8F%AC%ED%8A%B8-%ED%81%AC%EA%B8%B0%EB%8A%94-%EB%8B%A4%EB%A5%B4%EB%8B%A4)
    - [뷰포트가 다르면 어떤 문제가 발생하나?](#%EB%B7%B0%ED%8F%AC%ED%8A%B8%EA%B0%80-%EB%8B%A4%EB%A5%B4%EB%A9%B4-%EC%96%B4%EB%96%A4-%EB%AC%B8%EC%A0%9C%EA%B0%80-%EB%B0%9C%EC%83%9D%ED%95%98%EB%82%98)
    - [뷰포트를 피그마 파일과 동일하게 맞추자](#%EB%B7%B0%ED%8F%AC%ED%8A%B8%EB%A5%BC-%ED%94%BC%EA%B7%B8%EB%A7%88-%ED%8C%8C%EC%9D%BC%EA%B3%BC-%EB%8F%99%EC%9D%BC%ED%95%98%EA%B2%8C-%EB%A7%9E%EC%B6%94%EC%9E%90)
    - [iframe을 통해 가상의 뷰포트 만들기](#iframe%EC%9D%84-%ED%86%B5%ED%95%B4-%EA%B0%80%EC%83%81%EC%9D%98-%EB%B7%B0%ED%8F%AC%ED%8A%B8-%EB%A7%8C%EB%93%A4%EA%B8%B0)
  - [4. Base64 vs URL.createObjectURL](#4-base64-vs-urlcreateobjecturl)
- [⏰ 프로젝트 타임라인](#%E2%8F%B0-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%ED%83%80%EC%9E%84%EB%9D%BC%EC%9D%B8)

# 🛠️ 기술스택

## Environment

<img src="https://img.shields.io/badge/vscode-1572B6?style=for-the-badge&logo=visualstudio&logoColor=white"> <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"> <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">

## Config

<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"> <img src="https://img.shields.io/badge/npm-e84118?style=for-the-badge&logo=npm&logoColor=white">

## Development

<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"> <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/google chrome-4285F4?style=for-the-badge&logo=googlechrome&logoColor=black"> <img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white"> <img src="https://img.shields.io/badge/puppeteer-40B5A4?style=for-the-badge&logo=puppeteer&logoColor=white"> <img src="https://img.shields.io/badge/sharp-99CC00?style=for-the-badge&logo=sharp&logoColor=white">

<br />

# 🙋‍♂️ 프로젝트 소개

Fig Diff는 바닐라코딩 부트캠프 수료 후, 4명의 동기들이 함께 취업 준비를 하며 학습한 Typescript를 실제로 적용해보기 3주간 위해 진행한 사이드 프로젝트 입니다. 가장 적합한 사용성을 고려하여 Chrome Exteinsion을 활용했으며, 완성 이후 크롬 익스텐션을 배포하여 유저 피드백을 토대로 꾸준히 유지보수를 진행 할 예정입니다.

# 💪 동기

저희는 모두 프로젝트를 기획하는 단계에서 Figma 라는 디자인 툴을 활용하여 만들고자 하는 서비스의 Mock Up을 먼저 만들고, 이를 토대로 웹을 만들어 왔습니다. 이는 실제로 현업에서 디자이너 들과의 협업 과정과 유사한 방식이라고 알고 있습니다. 하지만, 눈에 보이는 것을 코드로 구현하는 과정에서, 디자인 파일과 실제 웹 요소들 간의 크기, 위치, 색깔 등 눈대중으로 완벽하게 구현하는 것은 매우 어렵고 불확실한 경우가 자주 발생 했습니다. 이에 착안하여 피그마 파일을 토대로 웹을 만든 뒤, 이를 시각적으로 비교해 볼 수 있다면 좋지 않을까? 라는 생각에서 시작하여 프로젝트를 진행하게 되었습니다.

# 🕹️ 사용법 및 기능

1. 비교하고자 하는 웹 페이지에 접속 합니다.
2. FigDiff 익스텐션을 실행 합니다.
3. Figma 로그인을 합니다.
4. 로그인 후, URL 입력창에 지금 보고있는 페이지와 비교 할 피그마 파일의 Frame 주소를 삽입합니다.

https://github.com/user-attachments/assets/d12cfc0b-1395-4e69-a26b-450e0225235f

5. 비교 완료 후 결과가 표시 됩니다.
   - 크롬익스텐션에 웹 사이트와 피그마 디자인의 다른 부분이 빨간색으로 표시 됩니다.
   - 좌측 상단에 웹 및 새로 생성된 피그마 요소에 대한 투명도를 조절할 수 있는 기능이 존재합니다.
   - 드래그를 할 수 있어 해당 기능의 위치를 움직일 수 있습니다.
   - 위 슬라이더는 웹 투명도를 조절 합니다.
   - 아래 슬라이더는 새로 생성된 피그마 요소들의 투명도를 조절 합니다.

https://github.com/user-attachments/assets/d800533e-e9fb-43ad-bda6-8fc8a678e832

6. 비교 완료 후 저장 버튼을 누릅니다.
   - 저장 버튼을 누르면 저장 성공시 저장 성공이라고 나옵니다.
   - Web에서 저장된 결과를 URL 단위로 히스토리 내역을 확인해 볼 수 있습니다.

https://github.com/user-attachments/assets/baf5d73e-7c6e-4fab-8b6a-147f9c74edde

# 🔍 기술 검증

## 웹과 피그마를 어떻게 비교할 수 있을까?

### 1. Figma JSON vs HTML(DOM)

1.1 HTML 을 피그마 파일화 하자.

우선, 저희는 [Figma REST API](https://www.figma.com/developers/api) 를 통해 Figma 파일을 JSON 데이터화 하여 가져올 수 있다는 점에 착안하여, 만약 웹 HTML을 Figma 파일화 할 수 있다면, 기존 피그마 파일과 새로 생긴 피그마 파일 모두 API를 통해 JSON 데이터화 한 뒤 1대1 비교가 가능 할 것이라고 생각했습니다.

- HTML → Figma 파일화 예시(Figma to Design - plugin)

https://github.com/user-attachments/assets/342f1e67-cf49-40de-9336-ac851921b0c4

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img width="400" src="https://github.com/user-attachments/assets/645a152c-d7e9-4357-9911-c033c923a162" alt="Web to Figma">
        <p>실제 웹에서 HTML을 Figma 파일화 한 것</p>
      </td>
      <td align="center">
        <img width="400" src="https://github.com/user-attachments/assets/ed8d31f8-acc9-4ac4-87aa-6b926cdbff41" alt="Figma Mockup">
        <p>Figma로 만든 목업 디자인 파일</p>
      </td>
    </tr>
  </table>
</div>

**두 프레임의 Figma JSON 데이터 비교**

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img width="400" src="https://github.com/user-attachments/assets/c47fa334-ad63-4c81-88c5-5fc37fa58d71" alt="Web to Figma Json">
      <p>실제 웹에서 HTML을 Figma 파일화 한 것</p>
      </td>
      <td align="center">
        <img width="400" src="https://github.com/user-attachments/assets/694f2e33-6374-4a49-8eba-8d7cd7a09048" alt="Figma Json">
      <p>Figma로 만든 목업 디자인 파일</p>
      </td>
    </tr>
  </table>
</div>

두 개의 Figma 파일을 diffing 하는데 있어서 Figma API 를 통해 JSON 데이터 형식을 받아보았고, 각 요소의 Id값을 이용해서 실제 돔의 요소와 Figma 목업의 요소를 매핑시키는 작업을 했습니다.

### 문제점

1. HTML을 프로그래밍적으로 Figma 파일화 할 수 있는지에 대해 조사했을 때, Figma에서 제공하는 REST API는 이미 존재하는 Figma 파일에서 정보를 얻어오는 GET요청 관련 API만 존재하기에 새로운 파일을 프로그래밍적으로 생성할 수 없다는 결론에 도달했습니다.

2. Figma REST API 외에 Figma 플러그인 API(피그마 플러그인 제작시 사용하는 API)를 사용하면 존재하는 Figma 파일에 대한 조작이 가능하긴 하지만,
   저희가 만들고자하는 서비스의 핵심 기능인 ‘비교’를 하기 위한 플러그인이 아니라 ‘HTML 의 Figma 파일화’ 만을 위한 플러그인을 따로 만드는것은 시간적으로 비효율적이고 기술적으로는 오버 엔지니어링이라고 판단했습니다.

### 2. 피그마 JSON → HTML 변환 후 DOM 에서 비교하기

방법 1.1과 유사하지만, HTML의 피그마 파일화 가 아닌, 피그마 파일의 HTML화 하는 방법이기에 방향이 반대입니다. 피그마 파일의 JSON 데이터를 토대로 HTML을 만들어서 실제로 비교해 보았습니다.

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img width="400" src="https://github.com/user-attachments/assets/c463f4ae-3cd3-4b24-a001-d3d8d960b0de" alt="Figma">
      <p>Figma</p>
      </td>
      <td align="center">
        <img width="400" src="https://github.com/user-attachments/assets/400134e1-cb90-4d64-97d7-bd7da3d9c8ad" alt="Figma Json to HTML">
      <p>Figma JSON → HTML</p>
      </td>
    </tr>
  </table>
</div>

### 문제점

- 결국 이 방식 또한, 피그마 JSON과 웹의 각 요소들이 어떠한 기준으로 맵핑 되어야 하는지에 대한 문제가 발생하였습니다.
- 이를 해결하기 위해, 다단계 검증 로직을 구현해 보았습니다.
  위치 속성 외에 브라우저 상 차이를 보여줄 수 있는 속성으로는
  1. 태그의 유형: **`button`**, **`img`**, **`div`** 등 비교
  2. 텍스트 내용: **`characters`** 혹은 **`textContext`** 비교
  3. 계층 구조 파악: 동일한 **부모-자식 계층** 을 가지고 있는지 등을 파악
     위 3가지의 속성을 추가로 파악하는 로직을 작성한다면,
     예를 들어 위치 속성이 크게 차이가 나는 요소라 할지라도 추가적인 검증 단계를 거쳐
  4. 버튼 태그가 맞는지,
  5. 다음으로 요소 내 텍스트의 내용이 일치하는지,
  6. 마지막으로 동일한 부모-자식 관계를 갖고 있는 요소가 갖고 있는지에 대한 확인이 가능해집니다.

위 방안은 개발자가 웹을 만들 때, MOCKUP과 최대한 동일하게 만들것이라고 ‘가정’하고 생각한 방법입니다.

또한 위처럼 **다단계 검증 방식**은 하나의 검증 단계에서 실패하더라도 다른 속성을 통해 추가 검증을 할 수 있어 유연하게 요소를 매칭할 수 있습니다.

이는 위치가 변경되거나 스타일이 조금 바뀌어도 다른 속성을 통해 매칭이 가능하게 합니다.

하지만 정확도의 문제는 여전히 존재합니다.

예를 들어 위치 속성이 전혀 다른 두 요소를 (실제로는 같은 요소일 경우) 다단계 검증을 거쳐 스타일, 태그 종류, 텍스트 내용 등을 통해 검사하더라도 어느 정도의 오차 범위를 사전에 지정해 놓고 판별을 실시할 것이기에 오탐지의 문제가 여전히 존재할 것이라고 생각합니다.

### 3. HTML 과 피그마 파일 모두 ‘이미지’로 변환 후 대조하기 (Pixel Diffing)

JSON 데이터, 트리 구조 분석 등 데이터적인 접근법에서 벗어나서, 웹과 피그마 파일을 각각 이미지 형식으로 변환한 뒤, 어릴 적 그림 그리기 연습을 할 때 반투명 종이 뒤에 내가 그리고자 하는 그림을 두고 덧대보듯이, 두개의 이미지를 겹쳐서 차이나는 지점에 대한 좌표를 알 수 있다면, 이를 토대로 어떤 요소가 차이가 나는 요소인지 파악할 수 있을 것 이라고 생각했습니다.

**예시**

<img width="1204" alt="PixelMatch example" src="https://github.com/user-attachments/assets/c8e18cbf-1794-4676-b415-a8a354c23e67">

- HTML의 이미지화
  - 웹 화면은 puppeteer, html2canvas등 다양한 방식을 통해 스크린샷을 찍을 수 있습니다. 이 외에도 크롬익스텐션 API를 활용해서도 스크린샷을 찍을 수 있습니다.
- 피그마 파일의 이미지화
  - 피그마 REST API 는 공식적으로 피그마 파일을 PNG 형식으로 export 하는 것을 지원합니다.

### 실제 피그마 파일 VS 웹 페이지 이미지 Diffing 예시

![annotatedImage](https://github.com/user-attachments/assets/9e601e4a-609d-4fc3-a4cc-4ec97a7e19aa)

- 웹과 피그마 파일의 차이가 나는 지점을 빨간색 픽셀로 칠하여 표현해 본 예시 사진

### Figma JSON 의 absoluteBoundingBox 속성

<img width="698" alt="%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-07-22_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_3 45 37" src="https://github.com/user-attachments/assets/90da98d2-dac5-4076-8808-940a31490ab8">

Figma JSON은 각 요소를 구성하고 있는 다양한 속성들이 존재합니다. 이 중, 이미지 끼리 Diffing 해서 나온 좌표를 피그마에서 찾기 위한 속성으로 absoluteBoundingBox 속성을 찾게 되었습니다. 이미지 Diffing 결과를 활용하여 차이가나는 요소를 찾는 로직의 흐름은 다음과 같습니다.

1. 이미지를 Diffing 해서 차이가 나는 픽셀의 좌표를 알아낸다
2. 차이가 나는 좌표를 Figma JSON 에서 찾는다.
3. 일치하는 요소가 있다면 해당 요소는 웹과 피그마 파일에서 차이가 존재하는 요소!

### 결론: 이미지로 비교하여 차이나는 지점을 찾는것이 현실적

Figma JSON, HTML, DOM 은 결국 서로 다른 데이터 형식이고, 각 요소가 어떤 요소의 맵핑 되는지 검증하는 단계는 결국 다양한 ‘가정’들을 모아 정확도를 최대한 올리는 형식이었습니다. 이는 결국 다양한 edge case 에 대한 대응을 불가능하게 하고, 서비스의 범용성을 매우 낮추는 결과에 수렴했습니다.

반면에 이미지 형식으로 비교하는 방법은, Figma JSON 과 웹 DOM 요소간의 맵핑이 필요 없이, 그저 차이나는 픽셀이 Figma JSON에 존재한다면 해당 요소에 대한 정보를 보내주면 됩니다. 이는 위 방법에서 존재했던 대부분의 불확실성에 대해 해결할 수 있는 방법입니다. 따라서 저희는 **이미지로 변환 후 픽셀끼리의 비교를 하여 좌표를 구하는 방식**으로 프로젝트를 진행하게 되었습니다.

# 🏔️ 챌린지

### 1. 일반적으로 두개의 이미지는 어떻게 디핑이 이루어질까?

![Diffing Pixel](https://github.com/user-attachments/assets/c98a82c5-1dde-4c19-bde4-8355bf15c503)

두 이미지를 1x1 픽셀을 기준으로 RGBA값을 비교하여 값이 다를 경우 다른 부분으로 인식하여 해당 픽셀의 좌표를 얻는것이 일반적인 픽셀 디핑 방법입니다.

하지만 두 이미지 파일의 화질이 다를 경우, 같은 크기, 폰트, 색상, 위치 등이 같아도 다르다고 인식하는 오류가 생겨 일반적인 픽셀 디핑 방법을 사용할 수 없었습니다.

- figma image랑 웹 페이지 스크린샷 이미지랑 다른점이 뭘까?
  - 색상 프로파일: Figma 이미지는 sRGB 색상 프로파일을 포함하지만, 웹 페이지 스크린샷 이미지는 색상 프로파일이 없었습니다.
    위의 차이점을 해결하기 위해 Sharp 라이브러리를 사용하여 두 이미지의 특성을 통일화 했습니다. 이미지 특성을 통일화한 후, 두 이미지를 비교하여 다른 부분의 좌표를 얻고자 했습니다. 두 이미지의 특성이 동일해졌으므로, 실제로 다른 부분의 좌표만 얻을 수 있을 것으로 예상했지만 두 이미지 간의 차이를 제대로 감지하지 못했습니다.
- 문제 원인 분석

  - **이미지 리사이징 및 변환 중 품질 저하**: 이미지 리사이징 및 변환 과정에서 미세한 품질 저하가 발생하여 비교 결과에 영향을 미쳤을 수 있습니다.
  - **픽셀 비교 방법의 한계**: 픽셀 비교 방법 자체가 미세한 차이를 감지하지 못하거나, 불필요한 차이까지 감지할 수 있습니다.

- 두 이미지의 화질 차이로 인한 diffing 오류는 어떻게 해결할까?
  - **블록 단위 비교**: 1x1 픽셀 단위로 비교하는 대신, 5x5 블록 단위로 비교했습니다. 5x5 블록 내의 RGBA 값의 평균을 계산하여, 이 평균값을 각 블록의 대표 값으로 사용했습니다. 5x5 블록 단위로 비교하면 미세한 화질 차이가 평균화되어, 실제로 중요한 차이만 감지할 수 있습니다. 이렇게 하면 화질 차이로 인한 오류를 줄이고, 비교 정확도를 높일 수 있었습니다.
  - **허용 오차 설정**: 픽셀 비교 시, 각 픽셀의 RGBA 값 차이에 대해 허용 오차를 설정했습니다. 이는 미세한 차이로 인해 불필요한 차이가 감지되는 것을 방지하기 위함입니다. 웹 페이지 스크린샷과 Figma 이미지 간의 작은 차이를 무시하고, 실질적으로 중요한 차이만 감지하기 위해 허용 오차를 설정했습니다.
- 유클리드 거리를 사용하여 RGBA값을 비교한 이유는 뭘까?

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img width="400" src="https://github.com/user-attachments/assets/93e44db9-d1c7-4cee-93b2-cc5e8526fb31" alt="Manhatten">
      <p>맨해튼 거리</p>
      </td>
      <td align="center">
        <img width="400" src="https://github.com/user-attachments/assets/befa447a-a2e4-404e-bc35-1a168d36b8aa" alt="Euclid">
      <p>유클리드 거리</p>
      </td>
    </tr>
  </table>
</div>

맨해튼 거리는 축을 따라 이동하므로, 두 색상 간의 실제 거리보다는 축을 따라 이동한 거리를 반영하게 됩니다. 즉 실제 색상 차이보다 더 크게 반영된다는 것을 뜻합니다.
유클리드 거리는 직선 거리를 계산하므로, 두 색상 값 사이의 실제 차이를 더 정확하게 반영합니다.
이는 색상 값의 차이가 여러 차원에 걸쳐 있을 때, 맨해튼 거리가 유클리드 거리보다 덜 정확할 수 있음을 의미합니다.

### 2. 이미지 디핑 로직 최적화는 어떻게 할까?

### **무거운 연산의 디핑 로직**

---

서비스 개발 과정에서, 저희가 주로 사용한 피그마 파일의 해상도는 피그마에서 제공하는 기본 데스크탑 프레임 사이즈인 **`1440 x 1024`** 였습니다**.** 이를 픽셀수로 환산하면 무려 147만개의 픽셀 수가 나오게 됩니다.

기본적으로 제공하는 데스크탑 프레임 사이즈에서도 꽤 무거운 작업을 수행하게 되는데, 만약 **피그마 파일의 해상도가 커진다면**, Diffing 해야 할 픽셀 수 또한 증가하게 됩니다. 따라서, 다양한 케이스에 대응하여 서비스의 범용성을 높이기 위해 Diffing 알고리즘의 효율성, 즉 **시간복잡도를 줄여 알고리즘을 최적화** 하는 것이 중요하다고 판단 하였습니다

저희 서비스에서는 Figma 이미지 파일의 픽셀 크기를 **`1440 x 1024`** 사이즈로 설정하였습니다. 이후, Figma 이미지와 브라우저 스크린샷 이미지 간의 시각적 차이를 비교하기 위해 모든 픽셀을 순회하며 차이점을 탐지합니다. 이 과정은 기본적인 비교 작업으로 시작하여 최소 140만 이상의 픽셀을 순회하는 무거운 연산을 필요로 합니다.

서비스의 목적이 단순 픽셀 비교에 그치지 않고 차이점을 시각적으로 표시하는 작업까지 이어지므로, 시간 효율성을 높이기 위해 디핑 알고리즘을 최적화하는 것이 중요하다고 판단했습니다.

### **Node.js 의 기본 실행 구조**

---

JavaScript 의 런타임 환경인 **Node.js** 의 가장 큰 특징 중 하나는 **싱글 스레드**로 작동하면서 **비동기 I/O 처리**를 지원한다는 점입니다.

- **싱글 스레드 및 이벤트 루프**
  Node.js는 기본적으로 하나의 메인 스레드에서 실행됩니다. 이 메인 스레드는 이벤트 루프를 사용하여 모든 비동기 작업을 처리합니다. 이벤트 루프의 주된 역할은 실행할 작업이 있는지 지속적으로 확인하고, 실행 가능한 작업이 있으면 순차적으로 처리하는 것입니다. 이는 파일 I/O, 네트워크 요청 등 외부 리소스와의 비동기 통신에서 효율적입니다.
- **이벤트 루프의 장점**
  이러한 구조 덕분에 Node.js는 다수의 동시 I/O 작업을 효과적으로 처리할 수 있습니다. 각 I/O 작업이 완료되는 대로 콜백 함수나 프로미스 해결을 통해 결과를 반환하며, 이 과정에서 메인 스레드가 차단되지 않아 빠른 응답 시간과 높은 처리량을 유지할 수 있습니다.
- **이벤트 루프의 한계**
  그러나 이와 같은 싱글 스레드 모델은 CPU 집약적인 작업에는 적합하지 않습니다. 복잡한 계산이나 이미지 처리와 같은 작업이 이벤트 루프 내에서 실행되면 해당 작업이 완료될 때까지 다른 모든 작업이 대기해야 합니다. 이는 애플리케이션의 전체적인 반응 속도를 늦추고 사용자 경험을 저하시킬 수 있습니다.

### **Worker Threads 의 도입**

---

이러한 문제를 해결하기 위해 Node.js 의 **Worker Threads** 모듈을 도입했습니다.

**Worker Threads** 를 사용하면, 복잡한 계산이나 데이터 처리 작업을 별도의 스레드에서 실행할 수 있으므로, 메인 스레드와는 독립적으로 작업을 처리할 수 있습니다. 이를 통해 CPU 집약적인 작업을 처리하면서도 메인 이벤트 루프가 차단되지 않도록 하여 전체적인 성능과 반응성을 향상시킬 수 있습니다.

- **Worker Thread 의 주요 특징**

  - **1. CPU 집약적인 작업의 분리와 동시 실행**
    - **Worker Threads**는 복잡한 계산, 이미지 및 비디오 처리, 데이터 분석과 같은 CPU 집약적인 작업을 메인 스레드와 별도로 실행할 수 있게 해줍니다. 이를 통해 메인 이벤트 루프가 차단되는 것을 방지하고, 애플리케이션의 전반적인 반응성과 성능을 향상시킬 수 있습니다.
    - 예를 들어, 이미지 비교 및 차이점 분석과 같은 작업을 Worker 스레드에서 처리함으로써, UI의 응답성을 저해하지 않고 복잡한 데이터 처리 작업을 수행할 수 있습니다.

- **2. 향상된 병렬 처리**

  - 여러 Worker Threads를 사용하여 병렬 처리를 구현함으로써, 멀티코어 CPU의 성능을 최대한 활용할 수 있습니다. 각 스레드는 독립적인 작업을 수행하며, 전체적인 작업 처리 시간을 단축시키는데 기여합니다.
  - 이는 작업의 부하를 분산시키고, 더 많은 작업을 동시에 처리할 수 있게 하여 데이터 처리량을 크게 증가시킵니다.

- **3. 안전한 메모리 공유와 효율적인 데이터 교환**
  - **Worker Threads**는 `SharedArrayBuffer`를 사용하여 메모리를 안전하게 공유할 수 있습니다. 이를 통해 다른 스레드 간에 메모리를 직접 접근하면서도 데이터 일관성을 유지할 수 있습니다.
  - 데이터 교환 시 `postMessage` 메서드를 활용하여 데이터를 전송하고, `onmessage` 이벤트를 통해 데이터를 수신할 수 있습니다. 이 메커니즘은 데이터를 안전하게 주고받으면서도 높은 처리 속도를 유지할 수 있도록 돕습니다.

결과적으로 **Worker Threads** 의 도입은 Node.js 애플리케이션의 성능을 크게 향상시킬 수 있는 중요한 전략입니다. 특히, 복잡하고 계산 집약적인 작업을 처리할 때 메인 이벤트 루프의 차단을 방지하고, 전체 시스템의 효율성을 높일 수 있습니다.

### **Single Thread vs Worker Threads 특징 비교**

---

![Single Thread vs Worker Threads](https://github.com/user-attachments/assets/55a59282-f5ae-4359-beae-59e5adb64c57)

<table>
  <tr>
    <th>기준</th>
    <th>싱글 스레드</th>
    <th>멀티 스레드</th>
  </tr>
  <tr>
    <td>동작 방식</td>
    <td>한 번에 하나의 작업만 처리 가능</td>
    <td>동시에 여러 작업을 병렬로 처리 가능</td>
  </tr>
  <tr>
    <td>이벤트 루프</td>
    <td>모든 I/O 작업을 이벤트 루프를 통해</td>
    <td>메인 이벤트 루프는 비동기 I/O 작업을 처리, CPU 집약적 작업은 별도 스레드에서 처리
    </td>
  </tr>
  <tr>
    <td>CPU 사용</td>
    <td>CPU 집약적 작업에 취약,이벤트 루프 차단 가능성 존재</td>
    <td>CPU 집약적 작업을 별도 스레드로 분리, 메인 이벤트 루프 차단 방지</td>
  </tr>
  <tr>
    <td>병렬 처리 능력</td>
    <td>제한적, I/O 작업 최적화</td>
    <td>복수의 Worker Threads를 사용하여병렬 처리 능력 향상</td>
  </tr>
  <tr>
    <td>응답성</td>
    <td>무거운 계산이나 작업 시 시스템 전체의 응답성 저하 가능</td>
    <td>무거운 작업을 별도 스레드에서 처리하여 전체 시스템 응답성 유지</td>
  </tr>
</table>

### **Worker Threads 를 사용해보자.**

---

프로젝트에서 **Worker Threads** 를 사용한 결정은 이미지 파일 간의 차이를 효율적으로 찾아내기 위한 무거운 연산을 처리하기 위함이었습니다.

프로세스의 구조를 자세히 설명하자면, 이 프로젝트에서 사용한 디핑 로직은 두 이미지 간의 픽셀 단위 차이를 찾아내는 작업을 포함합니다. 이를 위해 두 이미지의 각 픽셀 색상 값을 분석하고, 평균을 내어 비교하는 방식을 사용합니다. 이는 간단히 설명되지만, 실제로는 수백만 번의 연산을 요구하는 매우 CPU 집약적인 작업입니다.

### **블록 평균 색상 계산**

```jsx
for (let y = start; y < end && y < buffer.length / 4 / width; y += blockSize) {
  for (let x = 0; x < width; x += blockSize) {
    let rSum = 0,
      gSum = 0,
      bSum = 0,
      aSum = 0;
    let count = 0;

    for (let dy = 0; dy < blockSize && y + dy < end; dy++) {
      for (let dx = 0; dx < blockSize && x + dx < width; dx++) {
        const px = x + dx;
        const py = y + dy;
        const idx = (py * width + px) * 4;
        rSum += buffer[idx];
        gSum += buffer[idx + 1];
        bSum += buffer[idx + 2];
        aSum += buffer[idx + 3];
        count++;
      }
    }

    if (count > 0) {
      averages.push(rSum / count, gSum / count, bSum / count, aSum / count);
    }
  }
}
```

- 각 이미지는 1440 x 1024 픽셀, 총 1,474,560개의 픽셀을 갖습니다.
- 작업은 이를 5 x 5 블록으로 나누어 각 블록의 평균 색상을 계산합니다.
- 각 블록당 25개의 픽셀을 처리해야 하며, 전체적으로 58,752개의 블록을 처리합니다. 이는 총 1,468,800번의 연산을 필요로 합니다.

### **픽셀 간 색상 차이 계산**

```jsx
for (let i = 0; i < figmaAverages.length; i += 4) {
  const r1 = figmaAverages[i];
  const g1 = figmaAverages[i + 1];
  const b1 = figmaAverages[i + 2];
  const a1 = figmaAverages[i + 3];

  const r2 = screenShotAverages[i];
  const g2 = screenShotAverages[i + 1];
  const b2 = screenShotAverages[i + 2];
  const a2 = screenShotAverages[i + 3];

  const diff = Math.sqrt(
    Math.pow(r2 - r1, 2) +
      Math.pow(g2 - g1, 2) +
      Math.pow(b2 - b1, 2) +
      Math.pow(a2 - a1, 2),
  );

  if (diff > threshold) {
    const blockIndex = i / 4;
    const blockX = blockIndex % (width / blockSize);
    const blockY = Math.floor(blockIndex / (width / blockSize));
    const x = blockX * blockSize;
    const y = blockY * blockSize;
    diffPixels.push({ x, y });
  }
}
```

- 각 블록의 평균 색상을 기반으로 두 이미지 간의 차이를 계산합니다.
- 블록 당 4개의 값(RGBA)을 비교하여 총 **236,160개의** 값이 연산됩니다. 실제 비교 연산은 약 **59,040회** 수행되어야 합니다.

이러한 무거운 연산을 싱글 스레드에서 처리할 경우 **Node.js** 의 이벤트 루프가 차단될 수 있습니다. 이는 웹 서버의 반응 시간을 증가시키고 전체적인 사용자 경험을 저하시킬 수 있습니다. 따라서, 병렬 처리를 가능하게 하는 **Worker Threads** 를 도입했습니다.

### **Worker Threads 적용 결과**

![Worker Threads result](https://github.com/user-attachments/assets/6f1e1389-e5cc-4106-8d73-bc4c123db962)

단일 스레드로 이미지 디핑을 수행한 결과 약 19초가 소요됐고, 워커 스레드를 사용한 결과 약 3배 단축된 8초의 시간이 소요됐습니다. 즉 이미지가 클수록, 또는 연산이 복잡할수록 처리 시간이 기하급수적으로 늘어날 수 있음을 확인했습니다.

이러한 효과적인 시간 단축은 서비스의 전반적인 효율성과 생산성을 크게 향상시키는 데 중요한 역할을 했습니다. **Worker Threads** 를 사용함으로써 단일 스레드에서 겪는 성능 병목 현상을 효과적으로 해결할 수 있었으며, 병렬 처리를 통한 리소스 최적화는 더욱 복잡하고 데이터 집약적인 작업에도 견딜 수 있는 강인한 시스템 구조를 가능하게 했습니다.

특히, 이미지 처리와 같이 반복적이고 계산 집약적인 작업을 빠르게 처리할 수 있어, 사용자 경험을 개선하고 실시간으로 피드백을 제공할 수 있는 반응형 시스템을 구축할 수 있었습니다. 결과적으로, 시간은 크게 절약되고, 처리할 수 있는 작업의 양도 상당히 증가했습니다.

이러한 성능 향상은 비단 처리 속도의 증가뿐만 아니라, 프로젝트의 확장성과 유지 보수성에도 긍정적인 영향을 미칠 수 있을 것이라 생각합니다. 복잡한 이미지 처리 로직을 여러 **Worker Threads** 에 분산시킴으로써, 각 스레드는 더 작고 관리하기 쉬운 작업 단위를 처리하게 되어 전체 시스템의 안정성과 유연성이 증가했습니다.

결론적으로, **Worker Threads** 의 도입은 단순히 시간을 단축하는 것을 넘어, 프로젝트의 성능을 극대화하고, 더 나아가 시스템의 안정성과 확장성을 보장하는 중요한 전략이 되었습니다. 이는 기술적인 성공뿐만 아니라, 더 나은 서비스를 제공함으로써 사용자 경험을 향상시키는 데에 결정적인 역할을 하게 되었습니다.

### 3. 모든 유저들의 뷰포트 크기는 다르다

---

이미지 Diffing은 두개의 이미지가 같은 너비와 높이를 가져야 가능합니다. 따라서, 웹의 스크린샷을 찍을 때, puppeteer를 활용하여 뷰포트를 피그마 파일과 동일한 크기로 설정 후 스크린샷을 찍습니다. 하지만, 결과적으로 차이가 난다고 추려낸 요소들을 유저가 보는 화면에 띄워주기 전에 고려해야할 점이 하나 남아있습니다. **바로 모든 유저들의 뷰포트 크기는 다르다**는 것입니다.

### 뷰포트가 다르면 어떤 문제가 발생하나?

저희 서비스의 시나리오는 다음과 같습니다.

- 차이나는 요소들을 각각 PNG 파일화 하여 해당 요소의 ‘피그마’ 에서의 좌표값을 함께 보내줍니다.
- DOM에 이미지 태그를 삽입할 때 css 속성 중 **position: absolute**를 활용하여 절대적인 위치에 해당 이미지를 삽입합니다.

하지만, 이 이미지 요소를 삽입할 좌표값은, 피그마 파일내에서의, 즉 피그마 파일의 해상도 내에서의 좌표값이기 때문에 실제 웹에 그대로 대입한다면, 웹의 뷰포트 크기는 피그마 파일의 해상도와 다르기 때문에 정확한 위치가 아닐 것 입니다.

<img width="1470" alt="Change viewport example" src="https://github.com/user-attachments/assets/8b985a28-b7e3-4c81-9c79-57ca2ece1f0d">

- 피그마 요소의 좌표값이 실제 뷰포트에 어떻게 대응되는지에 대한 예시

### 뷰포트를 피그마 파일과 동일하게 맞추자

결국, 피그마 파일과 뷰포트의 크기가 다른것이 문제이기에, 뷰포트를 피그마 파일과 똑같은 사이즈로 조절한다면, 피그마 파일내에서의 절대 좌표대로 이미지를 삽입하면 됩니다. 뷰포트를 조정하는 방법들은 다음 방법들을 시도 해 봤습니다.

**`chrome.windows.update`**

크롬 익스텐션 에서 제공하는 API 입니다. 이를 활용하면 실제 유저의 뷰포트를 조작할 수 있습니다. 하지만 이 방식은 유저의 뷰포트가 자동으로 조작되기 때문에 사용자 경험측면에서 부정적인 영향을 끼치고, 기술적으로는 유저의 디스플레이 크기보다 큰 사이즈를 설정한다면, 최대 뷰포트 크기는 유저의 디스플레이 크기로 제한되기 때문에 적절하지 않은 방법이었습니다.

**크롬 개발자 도구를 이용한 방법**

크롬 개발자 도구를 활용하면 다양한 뷰포트 크기를 유저가 직접 입력하여 확인 할 수 있습니다. 이를 프로그래밍적으로 자동화 하려 했으나, 이를 지원하는 api는 존재하지 않았기에, 유저가 뷰포트 설정을 하게끔 유도하는 방법이 필요했습니다. 따라서, 사용자 경험을 크게 해치는 방식이라 생각하여 해당 방식은 보류 하게 되었습니다.

<img width="1470" alt="Chrome dev tool example" src="https://github.com/user-attachments/assets/f80bf2ba-af25-46a3-a3e3-7852df3b0082">

### iframe을 통해 가상의 뷰포트 만들기

결국 최선은, 유저의 뷰포트 크기와 상관 없이 가상의 뷰포트를 띄워줄 수 있다면, 유저의 브라우저 크기를 조작하지 않고, 유저가 수동으로 뷰포트 크기 조작을 하지 않아도 되고, 피그마 요소의 절대 좌표 또한 활용 가능 할 것이라고 생각했습니다. 해당 기능의 구현 흐름은 다음과 같습니다.

- 기존 DOM 요소를 모두 지워서 HTML을 백지화 한다.
- iframe 을 삽입하고, 그 해상도를 피그마 파일과 동일하게 한다.
- 요소들을 이미지 태그화 하여 절대 좌표에 삽입한다.

이를 통해 구현한 화면은 다음과 같습니다.

<img width="1470" alt="iframe example" src="https://github.com/user-attachments/assets/1c847829-8c54-4236-aa5b-7c313fcd97b7">

이 방법을 통해 단점들을 개선한 결과를 도출 해 냈지만, iframe이 고질적으로 가지는 문제점이 있기에 결국 최선의 방법은 **유저가 보는 뷰포트의 크기에 맞게, 피그마 요소의 절대 좌표를 수정하는것**이 가장 사용자 친화적인 방법임은 명확합니다. 해당 작업은 반응형 웹에서의 요소들의 좌표가 어떤식으로 조정 되는지에 대한 조사가 필요했으며, 현재 개발 진행 중 입니다.

### 4. Base64 vs URL.createObjectURL

**Base64 인코딩**: 이미지 파일을 base64 문자열로 변환합니다. 이 과정에서 이미지의 바이너리 데이터를 ASCII 문자로 변환하여 문자열을 생성합니다. 따라서 이미지 파일을 인코딩하는 과정에서 시간이 소모 됩니다. 또한 인코딩된 데이터는 원본 이미지보다 약 33% 더 큰 크기를 차지하게 되는데, 데이터가 ASCII 문자로 변환되면서 추가적인 데이터가 필요하게 되기 때문입니다. 그렇기 때문에 base64로 인코딩된 데이터는 HTML 문서 내에 포함되어 브라우저 메모리 사용량이 증가하게 됩니다.

`URL.createObjectURL`: 이미지 파일을 직접 사용하여 `Blob` 또는 `File` 객체를 생성하고, 이를 참조하는 URL을 생성합니다. 이미지 파일을 base64로 변환할 필요가 없으므로 인코딩 과정에서 걸리는 시간이 없어 객체 URL을 생성하는 것이 매우 빠릅니다. 또한 원본 이미지 파일의 크기를 그대로 유지하기 때문에 추가적인 데이터가 필요하지 않고, 이미지 데이터를 브라우저의 메모리 내에서 직접 참조하므로 base64 인코딩 방식보다 메모리 사용량이 적습니다.

- 요약

  - **Base64 인코딩**: 이미지 파일을 문자열로 변환하고, 파일 크기가 증가하며, 변환 과정에 시간이 걸리고, HTML 문서 내에 데이터가 포함되어 메모리 사용량이 증가합니다.
  - **`URL.createObjectURL`**: 파일을 직접 참조하며, 인코딩 과정이 없고, 원본 크기를 유지하며, 메모리 사용량이 적고, 성능이 더 우수하지만, 사용 후 명시적으로 해제해야 합니다.
    저희는 웹 페이지에 1회성으로 이미지를 사용하여 렌더링 하였기 때문에 인코딩 과정이 없고, 성능과 메모리 사용 측면에서 유리한 **`URL.createObjectURL`**을 사용하는 것이 더 효율적이라고 판단하였습니다.

  </br>

# ⏰ 프로젝트 타임라인

**기획 및 목업 제작 (2024.07.01 ~ 2024.07.07)**

- 🗓️ [칸반 태스크](https://www.notion.so/FigDiff-cd08255c47ba43f5bccb6f4579f0d3fa?pvs=21)
- 🖼️ [피그마 목업](https://www.notion.so/Figma-Mockup-757ffaf01fc841f5acd0e976d17e52b8?pvs=21)

**기능 구현 (2024.07.08 ~ 2024.07.21)**

- 크롬 익스텐션 설정
- Figma 이미지 파일 기준 브라우저 뷰포트 사이즈 일치화
- Figma 이미지 파일 ↔ 브라우저 스크린샷 이미지 파일 디핑 알고리즘
- 디핑 알고리즘 최적화(속도 개선)
- 디핑 결과 요소 간 차이점 시각화

**배포 및 리팩토링 (2024.07.22 ~)**
