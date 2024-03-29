import { Html } from "@react-three/drei";
import { Canvas, useThree  } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import Image from 'next/image'
import styles from './Loader.module.css';


const Loader = ({setIsLoading}) => {
  const { size } = useThree();
  const screenRef = useRef();

  useEffect(() => {
   
    return () => {
      console.log("unmount")
     setIsLoading(false)
    }; // Clean up on component unmount
  }, []);


  return (
   <></>
  );
};

export default Loader;
