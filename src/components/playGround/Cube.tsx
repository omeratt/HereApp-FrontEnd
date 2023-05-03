import {StyleSheet, Text, View} from 'react-native';
import React, {Ref, Suspense} from 'react';
import {Canvas, useFrame, useLoader} from '@react-three/fiber/native';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry';
import Scene from '../../assets/3d/Scene';
import {BufferGeometry, Material, Mesh, Vector3} from 'three';
import constants from '../../assets/constants';
import {RoundedBox} from '@react-three/drei/native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  RotateInDownRight,
  ZoomIn,
  ZoomInRotate,
  runOnJS,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {extend} from '@react-three/fiber/native';
import * as THREE from 'three';
const Cube = (props: any) => {
  const startX = useSharedValue(100);
  const startY = useSharedValue(100);
  const sharedX = useSharedValue(100);
  const sharedY = useSharedValue(100);
  const touchDown = useSharedValue(false);
  const setThreeRender = props.setThreeRender;
  const spin = React.useCallback(() => {
    setTimeout(() => {
      touchDown.value = false;
    }, 1000);
  }, []);
  const gesture = React.useMemo(
    () =>
      Gesture.Pan()
        .onStart(() => {
          startX.value = sharedX.value;
          startY.value = sharedY.value;
        })
        .onUpdate(e => {
          sharedX.value = startX.value + e.translationY / 50;
          sharedY.value = startY.value + e.translationX / 50;
        })
        .onTouchesUp(e => {
          touchDown.value = true;
          runOnJS(spin)();
        }),
    [sharedX, sharedY],
  );

  const MyCube = (props: any) => {
    const myMesh = React.useRef<Mesh>();
    useFrame(({clock}) => {
      if (myMesh.current) {
        if (touchDown.value) {
          myMesh.current.rotation.y += 0.1;
        } else {
          myMesh.current.rotation.x = sharedX.value;
          myMesh.current.rotation.y = sharedY.value;
        }
        // myMesh.current.rotation.z = sharedX.value;
        // myMesh.current.scale()
        sharedX.value = myMesh.current.rotation.x;
        sharedY.value = myMesh.current.rotation.y;
        if (clock.elapsedTime < 1.1) {
          myMesh.current.scale.x = clock.elapsedTime;
          myMesh.current.scale.y = clock.elapsedTime;
          myMesh.current.scale.z = clock.elapsedTime;
          myMesh.current.rotation.x += clock.elapsedTime / 25;
          myMesh.current.rotation.y += clock.elapsedTime / 30;
          myMesh.current.rotation.z += clock.elapsedTime / 35;
        }
        if (clock.elapsedTime > 0.9 && clock.elapsedTime < 1) {
          setThreeRender(true);
        }
        // sharedX.value = myMesh.current.rotation.x;
        // sharedY.value = myMesh.current.rotation.y;
      }
    });

    React.useEffect(() => console.log(myMesh.current?.animations), []);
    return (
      <mesh ref={myMesh} position={new Vector3(0, 0, 1.5)} {...props}>
        <mesh scale={[props.size, props.size, props.size]}>
          <boxGeometry />
          <meshToonMaterial color={constants.colors.BGC} />
        </mesh>
        <mesh scale={[props.size, props.size, props.size]}>
          <boxGeometry />
          <meshPhongMaterial
            color={constants.colors.OFF_WHITE}
            wireframe={true}
            wireframeLinewidth={1}
          />
        </mesh>
      </mesh>
    );
  };
  // const [active, setActive] = React.useState(false);
  // React.useEffect(() => {
  //   setTimeout(() => {
  //     setActive(true);
  //   }, 100);
  // }, []);

  return (
    <GestureDetector gesture={gesture}>
      <View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: constants.colors.BGC,
        }}>
        {/* {active && ( */}
        <Canvas>
          <ambientLight intensity={1} color={constants.colors.OFF_WHITE} />
          <directionalLight
            color={constants.colors.OFF_WHITE}
            // position={[0, 0, 0]}
          />
          <pointLight position={[10, 0, 10]} />
          <MyCube size={1.9} />
        </Canvas>
        {/* )} */}
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({});
export default React.memo(Cube);
