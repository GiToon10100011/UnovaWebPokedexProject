# 🎮 Unova Web Pokedex Project

![Pokedex Main Image](/Bootup.jpg)

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

## ✨ 주요 기능

### 1. 포켓몬 목록 및 검색

- 전체 포켓몬 목록 표시 (1~9세대)
- 이름 기반 포켓몬 검색 기능
- 부트업 애니메이션 (포켓몬 게임 스타일)

### 2. 포켓몬 상세 정보

- 포켓몬 기본 정보 (타입, 능력치, 신체 정보 등)
- 다양한 폼과 메가진화 정보
- 능력치 그래프 시각화

### 3. 진화 체인 시각화

- 복잡한 진화 체인 데이터 처리 및 시각화
- 진화 조건 표시
- 다양한 진화 경로 지원 (분기 진화, 메가진화 등)

```typescript
// src/utils/evolutionChainParser.ts - 재귀적 진화 체인 데이터 처리
interface EvolutionNode {
  species: {
    name: string;
    url: string;
  };
  evolution_details: EvolutionDetail[];
  evolves_to: EvolutionNode[];
}

interface EvolutionDetail {
  min_level?: number;
  item?: {
    name: string;
  };
  trigger?: {
    name: string;
  };
  // 기타 진화 조건들...
}

interface ProcessedEvolution {
  name: string;
  id: number;
  image: string;
  evolvesTo: ProcessedEvolution[];
  evolutionDetails: {
    trigger: string;
    level?: number;
    item?: string;
    condition?: string;
  }[];
}

// 재귀적 구조의 진화 체인 데이터를 처리하는 함수
export const processEvolutionChain = async (
  chain: EvolutionNode
): Promise<ProcessedEvolution> => {
  // 포켓몬 ID 추출 (URL에서)
  const speciesUrl = chain.species.url;
  const id = parseInt(
    speciesUrl.split("/").filter(Boolean).pop() || "0"
  );
  
  // 포켓몬 이미지 URL 생성
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  
  // 진화 조건 처리
  const evolutionDetails = chain.evolution_details.map(detail => {
    const trigger = detail.trigger?.name || "unknown";
    const level = detail.min_level;
    const item = detail.item?.name;
    
    // 진화 조건 텍스트 생성
    let condition = "";
    if (trigger === "level-up" && level) {
      condition = `레벨 ${level}에 진화`;
    } else if (trigger === "use-item" && item) {
      condition = `${formatItemName(item)} 사용 시 진화`;
    } else if (trigger === "trade") {
      condition = "교환 시 진화";
    }
    // 기타 조건들 처리...
    
    return { trigger, level, item, condition };
  });
  
  // 재귀적으로 다음 진화 단계 처리
  const evolvesTo = await Promise.all(
    chain.evolves_to.map(nextChain => processEvolutionChain(nextChain))
  );
  
  return {
    name: chain.species.name,
    id,
    image: imageUrl,
    evolvesTo,
    evolutionDetails,
  };
};

// 아이템 이름 포맷팅 함수
const formatItemName = (name: string): string => {
  // 아이템 이름 한글화 또는 포맷팅 로직
  const itemMap: Record<string, string> = {
    "fire-stone": "불의돌",
    "water-stone": "물의돌",
    "thunder-stone": "천둥의돌",
    // 기타 아이템들...
  };
  
  return itemMap[name] || name.replace(/-/g, " ");
};
```

### 4. Redux를 활용한 상태 관리

- 포켓몬 데이터 캐싱 및 관리
- 즐겨찾기 상태 관리
- 비동기 데이터 로딩 처리

```typescript
// src/redux/slices/pokemonSlice.ts - Redux 상태 관리
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchPokemonList, fetchPokemonDetails, fetchEvolutionChain } from '../../api/pokemonApi';

interface PokemonState {
  list: Pokemon[];
  currentPokemon: PokemonDetail | null;
  evolutionChain: ProcessedEvolution | null;
  favorites: number[];
  loading: boolean;
  error: string | null;
}

const initialState: PokemonState = {
  list: [],
  currentPokemon: null,
  evolutionChain: null,
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
  loading: false,
  error: null,
};

// 포켓몬 목록 불러오기 (비동기 액션)
export const fetchPokemonListAsync = createAsyncThunk(
  'pokemon/fetchList',
  async (limit: number = 151) => {
    const response = await fetchPokemonList(limit);
    return response;
  }
);

// 포켓몬 상세 정보 불러오기 (비동기 액션)
export const fetchPokemonDetailsAsync = createAsyncThunk(
  'pokemon/fetchDetails',
  async (id: number) => {
    const details = await fetchPokemonDetails(id);
    return details;
  }
);

// 진화 체인 불러오기 (비동기 액션)
export const fetchEvolutionChainAsync = createAsyncThunk(
  'pokemon/fetchEvolutionChain',
  async (url: string) => {
    const chain = await fetchEvolutionChain(url);
    const processedChain = await processEvolutionChain(chain.chain);
    return processedChain;
  }
);

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    // 즐겨찾기 토글 액션
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const pokemonId = action.payload;
      const index = state.favorites.indexOf(pokemonId);
      
      if (index === -1) {
        state.favorites.push(pokemonId);
      } else {
        state.favorites.splice(index, 1);
      }
      
      // 로컬 스토리지에 즐겨찾기 저장
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    
    // 상태 초기화 액션
    clearCurrentPokemon: (state) => {
      state.currentPokemon = null;
      state.evolutionChain = null;
    },
  },
  extraReducers: (builder) => {
    // 포켓몬 목록 로딩 상태 처리
    builder.addCase(fetchPokemonListAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPokemonListAsync.fulfilled, (state, action) => {
      state.list = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchPokemonListAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || '포켓몬 목록을 불러오는데 실패했습니다.';
    });
    
    // 포켓몬 상세 정보 로딩 상태 처리
    builder.addCase(fetchPokemonDetailsAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPokemonDetailsAsync.fulfilled, (state, action) => {
      state.currentPokemon = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchPokemonDetailsAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || '포켓몬 상세 정보를 불러오는데 실패했습니다.';
    });
    
    // 진화 체인 로딩 상태 처리
    builder.addCase(fetchEvolutionChainAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchEvolutionChainAsync.fulfilled, (state, action) => {
      state.evolutionChain = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchEvolutionChainAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || '진화 체인을 불러오는데 실패했습니다.';
    });
  },
});

export const { toggleFavorite, clearCurrentPokemon } = pokemonSlice.actions;
export default pokemonSlice.reducer;
```

### 5. 진화 체인 컴포넌트 구현

- 재귀적 컴포넌트 구조로 복잡한 진화 체인 시각화
- 애니메이션 효과로 진화 과정 표현
- 반응형 레이아웃 지원

```tsx
// src/components/EvolutionChain.tsx - 진화 체인 시각화 컴포넌트
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ProcessedEvolution } from '../utils/evolutionChainParser';

interface EvolutionChainProps {
  evolution: ProcessedEvolution;
  isRoot?: boolean;
}

const EvolutionChain: React.FC<EvolutionChainProps> = ({ 
  evolution, 
  isRoot = true 
}) => {
  // 진화 체인이 없는 경우 처리
  if (!evolution) return null;
  
  // 다음 진화가 없는 경우 (마지막 진화 단계)
  if (evolution.evolvesTo.length === 0) {
    return (
      <EvolutionItem
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PokemonImage src={evolution.image} alt={evolution.name} />
        <PokemonName to={`/pokemon/${evolution.id}`}>
          {formatPokemonName(evolution.name)}
        </PokemonName>
      </EvolutionItem>
    );
  }
  
  // 다음 진화가 있는 경우 (중간 진화 단계)
  return (
    <EvolutionContainer isRoot={isRoot}>
      {/* 현재 포켓몬 */}
      <EvolutionItem
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PokemonImage src={evolution.image} alt={evolution.name} />
        <PokemonName to={`/pokemon/${evolution.id}`}>
          {formatPokemonName(evolution.name)}
        </PokemonName>
      </EvolutionItem>
      
      {/* 진화 화살표 및 조건 */}
      {evolution.evolvesTo.map((nextEvolution, index) => (
        <EvolutionBranch key={index}>
          <EvolutionArrow>
            <ArrowIcon>→</ArrowIcon>
            {nextEvolution.evolutionDetails.map((detail, i) => (
              <EvolutionCondition key={i}>
                {detail.condition || '???'}
              </EvolutionCondition>
            ))}
          </EvolutionArrow>
          
          {/* 재귀적으로 다음 진화 렌더링 */}
          <EvolutionChain 
            evolution={nextEvolution} 
            isRoot={false} 
          />
        </EvolutionBranch>
      ))}
    </EvolutionContainer>
  );
};

// 포켓몬 이름 포맷팅 함수
const formatPokemonName = (name: string): string => {
  // 첫 글자만 대문자로 변환하고 하이픈을 공백으로 대체
  return name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

export default EvolutionChain;
```

### 6. 즐겨찾기 시스템

- 포켓몬 즐겨찾기 추가/제거
- 즐겨찾기 목록 관리
- 로컬 스토리지를 활용한 데이터 유지

### 7. 게임 스타일 UI/UX

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
- **비동기 데이터 처리**: createAsyncThunk를 활용한 비동기 데이터 로딩 및 상태 관리 방법을 익혔습니다.

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
