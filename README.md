# 🎮 Unova Web Pokedex Project

![Pokedex Main Image](https://unovapokedexwebmastered.web.app/Bootup.jpg)

## 📋 프로젝트 정보

- **개발 기간**: 2024.12 ~ 2024.01
- **개발자**: 전진우
- **배포 주소**: [https://unovapokedexwebmastered.web.app](https://unovapokedexwebmastered.web.app)

## 🎯 프로젝트 소개

### 목적 및 용도

이 프로젝트는 포켓몬 시리즈의 포켓몬 도감(Pokedex)을 웹 애플리케이션으로 구현한 것입니다. 특히 포켓몬 블랙 & 화이트 게임의 5세대 하나(Unova) 지방 스타일을 모티브로 디자인되었습니다. 사용자들은 모든 세대의 포켓몬을 검색하고, 상세 정보를 확인하며, 진화 체인을 시각화하고, 즐겨찾기에 추가할 수 있습니다.

### 기술 스택

#### 프론트엔드
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Styled Components](https://img.shields.io/badge/Styled_Components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)

#### 백엔드 및 배포
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![PokeAPI](https://img.shields.io/badge/PokeAPI-EF5350?style=for-the-badge&logo=pokemon&logoColor=white)

#### 기타 도구
![Motion](https://img.shields.io/badge/Motion-000000?style=for-the-badge&logo=framer&logoColor=white)
![ApexCharts](https://img.shields.io/badge/ApexCharts-00E396?style=for-the-badge&logo=chart.js&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

## 🔍 주요 구현 내용

### Redux 상태 관리

Redux를 사용하여 포켓몬 데이터와 사용자 상호작용을 관리합니다.

```typescript
// src/redux/reducers/userReducer.ts
interface IUserState {
  selectedPokemon: string;
  bootup: boolean;
  menuMode: string;
  favoritePokemonList: string[];
  isSearch: boolean;
}

let initialState: IUserState = {
  selectedPokemon: "",
  bootup: false,
  menuMode: "",
  favoritePokemonList: [],
  isSearch: false,
};

const userReducer = (state = initialState, action: IUserAction) => {
  const { type, payload } = action;
  switch (type) {
    case "BOOTUP_FINISH":
      return { ...state, bootup: payload.bootup };
    case "SELECT":
      return { ...state, selectedPokemon: payload.name };
    case "SEARCH_MODE":
      return { ...state, isSearch: payload.isSearch };
    case "SLOT_MENU":
      return { ...state, menuMode: payload.mode };
    case "ADD_FAVORITES":
      return {
        ...state,
        favoritePokemonList: [...state.favoritePokemonList, payload.name],
      };
    case "REMOVE_FAVORITES":
      return {
        ...state,
        favoritePokemonList: state.favoritePokemonList.filter(
          (pokemon) => pokemon !== payload.name
        ),
      };
    default:
      return state;
  }
};
```

### 진화 체인 구현 

포켓몬의 진화 체인을 시각화하고 진화 조건을 표시합니다.

```typescript
// 진화 트리거 정보 포맷팅 함수
const formatTriggerDesc = (trigger: IResolvedEvoChain) => {
  if (!trigger) return "Unknown";
  
  switch (trigger.trigger_name) {
    case "level-up":
      return `Level ${trigger.min_level || "?"}`;
    case "use-item":
      return `Use ${trigger.item_name || "?"}`;
    case "trade":
      return "Trade";
    case "shed":
      return "Level up (special)";
    default:
      return trigger.trigger_name?.replace("-", " ") || "Unknown";
  }
};

// 진화 체인 컴포넌트 렌더링
<PreEvolutionBox onClick={() => navigate(`/pokemon/${preEvolutionPokemon.name}`)}>
  <EvolutionTrigger>
    <FaChevronLeft color="#737373" size={40} />
    <TriggerContent>
      <span>Evolves By: </span>
      <span>
        {formatTriggerDesc(findPokemonTriggerOrder()?.preEvolutionTrigger)}
      </span>
    </TriggerContent>
  </EvolutionTrigger>
  <Sprite src={preEvolutionPokemon?.sprites.front_default} data-sound-effect />
  <span>{preEvolutionPokemon && preEvolutionPokemon.name}</span>
</PreEvolutionBox>
```

### 부트업 시퀀스 구현

애플리케이션 시작 시 포켓몬 데이터를 로드하고 부트업 애니메이션을 표시합니다.

```typescript
// src/components/Bootup.tsx
const Bootup = ({
  isLoading,
  progress,
}: {
  isLoading: boolean;
  progress: number;
}) => {
  const dispatch = useAppDispatch();
  const [isPreboot, setIsPreboot] = useState(true);

  useEffect(() => {
    !isLoading && setIsPreboot(false);
  }, [isLoading]);

  const bootupCompleted = () => {
    dispatch({
      type: "BOOTUP_FINISH",
      payload: {
        bootup: true,
      },
    });
  };

  return (
    <Container
      $preBoot={isPreboot}
      exit={{ scale: 1.2, opacity: 0, transition: { duration: 0.6 } }}
      onAnimationEnd={bootupCompleted}
    >
      {isPreboot && (
        <>
          <Rotation $preBoot={isPreboot} exit={{ backgroundSize: "cover" }} />
          <LoadingText>Loading... {Math.round(progress)}%</LoadingText>
        </>
      )}
    </Container>
  );
};
```

### 즐겨찾기 기능 구현

사용자가 포켓몬을 즐겨찾기에 추가하고 관리할 수 있습니다.

```typescript
// src/components/Footer.tsx
const handleFavorites = () => {
  if (isFavorites)
    dispatch({ type: "REMOVE_FAVORITES", payload: { name: currentPokemon } });
  else dispatch({ type: "ADD_FAVORITES", payload: { name: currentPokemon } });
};

// 즐겨찾기 버튼 렌더링
<FavControls data-sound-effect onClick={handleFavorites}>
  <FavContainer>
    {isFavorites && <MdCatchingPokemon color={"#EE5054"} size={60} />}
  </FavContainer>
  {currentPokemon
    ? `Add ${
        currentPokemon[0].toUpperCase() + currentPokemon.substring(1)
      } to Favorites`
    : "Hover over a pokemon"}
</FavControls>
```

## 🔄 API 통신

Axios를 사용하여 PokeAPI와 통신합니다.

```typescript
// src/redux/api.ts
export const pokeAPI = axios.create({
  baseURL: "https://pokeapi.co/api/v2/",
  headers: {
    "Content-Type": "application/json",
  },
});

// 포켓몬 데이터 가져오기
const getPokemonData = () => {
  return async (dispatch: Dispatch) => {
    try {
      const allPokemonApi = pokeAPI.get("pokemon/?limit=1302");
      const allPokemonData = await allPokemonApi.then(
        (response) => response.data
      );
      const allPokemon = allPokemonData.results.map(
        (pokemon: pokemonData) => pokemon.name
      );
      dispatch({
        type: "GET_DATA_SUCCESS",
        payload: { allPokemon },
      });
    } catch (error) {
      console.error(error);
    }
  };
};
```

## 🔊 사운드 효과

클릭 효과와 포켓몬 울음소리를 재생할 수 있습니다.

```typescript
// 클릭 사운드 효과
useEffect(() => {
  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const soundElement = target.closest("[data-sound-effect]");

    if (soundElement && clickEffect.current) {
      clickEffect.current.currentTime = 0;
      clickEffect.current.play();
    }
  };

  document.addEventListener("click", handleClick);
  return () => document.removeEventListener("click", handleClick);
}, []);

// 포켓몬 울음소리 재생
<CriesBox>
  {cries?.map((cry) => (
    <div key={cry}>
      <audio
        src={pokemonData?.cries[cry]}
        ref={audioRefs[cry]}
      ></audio>
      <GiSpeaker
        size={100}
        onClick={() => audioRefs[cry].current?.play()}
      />
      <span>{cry}</span>
    </div>
  ))}
</CriesBox>
```

## 📊 통계 차트

ApexCharts를 사용하여 포켓몬 스탯을 시각화합니다.

```typescript
// src/components/StatChart.tsx
const chartOptions: ApexOptions = {
  chart: {
    toolbar: {
      show: false,
    },
    background: "transparent",
  },
  xaxis: {
    categories: stats.map((stat) => stat.stat.name),
    labels: {
      style: {
        colors: "#000",
        fontSize: "12px",
      },
      formatter: (value) => {
        if (value === "special-attack") {
          return "sp.atk";
        }
        if (value === "special-defense") {
          return "sp.def";
        }
        return value;
      },
    },
  },
  // ...
};

<Chart
  options={chartOptions}
  series={series}
  type="radar"
  width={250}
  height={250}
/>
```

### 즐겨찾기 시스템

- 포켓몬 즐겨찾기 추가/제거
- 즐겨찾기 목록 관리
- 로컬 스토리지를 활용한 데이터 유지

### 게임 스타일 UI/UX

- 포켓몬 블랙 & 화이트 스타일의 인터페이스
- 사운드 이펙트 및 애니메이션
- 반응형 디자인

## 🚀 프로젝트 설치 및 사용 방법

```bash
# 저장소 클론
git clone https://github.com/GiToon10100011/UnovaWebPokedexProject.git

# 의존성 설치
cd UnovaWebPokedexProject
npm install

# 개발 서버 실행
npm run dev

# 빌드 및 배포
npm run build
npm run deploy
```

## 📁 프로젝트 구조

```
UnovaWebPokedexProject/
├── public/                # 정적 파일 (이미지, 사운드 등)
│   ├── assets/            # 포켓몬 타입 아이콘, 메가스톤 이미지 등
│   ├── Bootup.jpg         # 부트업 화면 이미지
│   └── favicon.ico        # 사이트 아이콘
├── src/
│   ├── api/               # API 호출 함수
│   │   └── pokemonApi.ts  # PokeAPI 연동 함수
│   ├── components/        # 재사용 가능한 컴포넌트
│   │   ├── Bootup.tsx     # 부트업 애니메이션 컴포넌트
│   │   ├── EvolutionChain.tsx # 진화 체인 컴포넌트
│   │   ├── FavoriteList.tsx # 즐겨찾기 목록 컴포넌트
│   │   ├── Footer.tsx     # 푸터 컴포넌트
│   │   ├── Header.tsx     # 헤더 컴포넌트
│   │   ├── PokemonItem.tsx # 포켓몬 아이템 컴포넌트
│   │   ├── StatsChart.tsx # 능력치 차트 컴포넌트
│   │   └── Search.tsx     # 검색 컴포넌트
│   ├── pages/             # 페이지 컴포넌트
│   │   ├── Detail.tsx     # 포켓몬 상세 페이지
│   │   ├── Favorites.tsx  # 즐겨찾기 페이지
│   │   └── Home.tsx       # 홈 페이지
│   ├── redux/             # Redux 상태 관리
│   │   ├── slices/        # Redux 슬라이스
│   │   │   └── pokemonSlice.ts # 포켓몬 관련 상태 슬라이스
│   │   └── store.ts       # Redux 스토어
│   ├── theme/             # 스타일 테마
│   ├── utils/             # 유틸리티 함수
│   │   └── evolutionChainParser.ts # 진화 체인 파서
│   ├── App.tsx            # 앱 컴포넌트
│   ├── Router.tsx         # 라우터 설정
│   └── main.tsx           # 앱 진입점
├── .firebaserc            # Firebase 프로젝트 설정
├── firebase.json          # Firebase 호스팅 설정
├── package.json           # 프로젝트 의존성 및 스크립트
└── tsconfig.json          # TypeScript 설정
```

## 💡 배운 점

### 기술적 측면

- **복잡한 API 데이터 처리**: PokeAPI의 재귀적 구조를 가진 진화 체인 데이터를 효율적으로 처리하는 방법을 익혔습니다.
- **TypeScript와 React 통합**: 타입 안전성을 갖춘 React 애플리케이션 개발 방법을 익혔습니다.
- **Redux를 활용한 상태 관리**: Redux Toolkit을 사용하여 복잡한 애플리케이션 상태를 효율적으로 관리하는 방법을 배웠습니다.
- **재귀적 컴포넌트 설계**: 복잡한 데이터 구조를 시각화하기 위한 재귀적 컴포넌트 설계 방법을 학습했습니다.

### 디자인 측면

- **게임 UI 재현**: 포켓몬 게임의 UI/UX를 웹에서 재현하는 방법을 연구했습니다.
- **반응형 디자인**: 다양한 화면 크기에 대응하는 반응형 레이아웃 설계 방법을 익혔습니다.
- **사용자 경험 향상**: 사운드 효과와 애니메이션을 통한 사용자 경험 향상 방법을 학습했습니다.

### 프로젝트 관리 측면

- **Vite 빌드 시스템**: 빠른 개발 환경과 최적화된 빌드를 위한 Vite 활용법을 익혔습니다.
- **Firebase 배포**: 정적 웹 애플리케이션을 Firebase Hosting에 배포하는 방법을 배웠습니다.
- **버전 관리**: Git을 활용한 효율적인 코드 관리 및 변경 추적 방법을 학습했습니다.

## 📝 향후 개선 사항

- 포켓몬 비교 기능 구현
- 다크 모드 지원
- 다국어 지원 (한국어, 일본어, 중국어 등)
- 모바일 앱 버전 개발 (React Native)

## 🔗 관련 링크

- [PokeAPI 공식 문서](https://pokeapi.co/docs/v2)
- [React 공식 문서](https://reactjs.org/)
- [Firebase 호스팅 문서](https://firebase.google.com/docs/hosting)

---

© 2024 GiToon10100011. 포켓몬과 관련된 모든 콘텐츠의 저작권은 Nintendo, Game Freak, Creatures Inc.에 있습니다.
