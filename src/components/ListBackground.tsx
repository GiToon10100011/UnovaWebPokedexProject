import styled from "styled-components";
import { motion } from "motion/react";
import { useAppSelector } from "../redux/hooks";
import { useEffect, useState } from "react";

const Container = styled(motion.div)`
  position: absolute;
  top: 50%;
  right: 0;
  /* transform: translateY(-50%); */
  z-index: -1;
  width: 45%;
  height: 70%;
  opacity: 0.8;
  background: radial-gradient(
      circle at center,
      rgb(140, 140, 140) 2px,
      transparent 2px
    )
    rgb(188, 188, 188);
  background-size: 4px 4px;
  border-top: 2px solid ${({ theme }) => theme.colors.brightPoint};
  border-bottom: 2px solid ${({ theme }) => theme.colors.brightPoint};
`;

const ListBackground = () => {
  const isBootupCompleted = useAppSelector((state) => state.userReducer.bootup);

  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      if (isBootupCompleted) setStartAnimation(true);
    }, 350);

    return () => clearTimeout(animationTimeout);
  }, [isBootupCompleted]);

  return (
    <>
      <Container
        initial={{ opacity: 0, x: 500, y: "-50%" }}
        animate={startAnimation ? { opacity: 1, x: 0, y: "-50%" } : undefined}
        transition={{ type: "tween", duration: 0.3 }}
      />
    </>
  );
};

export default ListBackground;
