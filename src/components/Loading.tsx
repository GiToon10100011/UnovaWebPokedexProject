import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingSpinner = styled.div`
  &.loader {
    width: 64px;
    height: 128px;
    background: radial-gradient(
        farthest-side at bottom,
        #f10c49 80%,
        #000 90%,
        #0000 95%
      ),
      radial-gradient(farthest-side at top, #fff 80%, #000 90%, #0000 100%);
    background-size: 100% 25%;
    background-repeat: no-repeat;
    animation: l15 2s infinite;
  }
  @keyframes l15 {
    0% {
      background-position: 0 40%, 0 75%;
    }
    50% {
      background-position: 0 20%, 0 75%;
    }
    100% {
      background-position: 0 40%, 0 75%;
      rotate: 360deg;
    }
  }
`;

const Loading = () => {
  return (
    <Container>
      <LoadingSpinner className="loader" />
    </Container>
  );
};

export default Loading;
