import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { useAppDispatch } from "../redux/hooks";

const preBoot = keyframes`
  0% {
    rotate: 0deg;
  }
  50% {
    rotate: 720deg;
  }
  100% {
    rotate: 720deg;
  }
`;

const booting = keyframes`
  from{
    background-position: center bottom;
  }
  50%{
    background-position: center top;
  }

  100%{
    background-position: center top;
  }
`;

const Container = styled(motion.section)<{ $preBoot: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: ${({ $preBoot }) =>
    $preBoot ? "#f73921" : "url('/Bootup.jpg') center bottom/cover no-repeat"};
  z-index: 3;
  ${({ $preBoot }) =>
    !$preBoot &&
    css`
      animation: ${booting} linear 3s both;
      animation-delay: 0.6s;
    `};
`;

const Rotation = styled(motion.div)<{ $preBoot: boolean }>`
  position: fixed;
  left: 50%;
  width: 90%;
  height: 100vh;
  background: url("/Bootup.jpg") center bottom/120% no-repeat;
  animation: ${preBoot} 2.4s infinite;
  transform: translateX(-50%) rotate(0deg);
  transform-origin: left;
`;

const LoadingText = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  color: white;
  font-size: 60px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 1.4px;
`;

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

export default React.memo(Bootup);
