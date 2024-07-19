import type { LatAndLng } from 'common/types/travelSpots';
import type { Map } from 'mapbox-gl';
import * as mapboxgl from 'mapbox-gl';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const createCustomLayer = (
  mapRef: React.MutableRefObject<Map | null>,
  currentLocation: LatAndLng,
  modelPath: string,
) => {
  const camera = new THREE.Camera();
  const scene = new THREE.Scene();
  const clock = new THREE.Clock();
  let mixer: THREE.AnimationMixer;
  let model: THREE.Object3D;

  let modelOrigin: mapboxgl.LngLatLike = [currentLocation.longitude, currentLocation.latitude];
  let modelAltitude = 0;
  const modelRotate = [Math.PI / 2, 0, 0];

  const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
    modelOrigin,
    modelAltitude,
  );

  const modelTransform = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: modelRotate[0],
    rotateY: modelRotate[1],
    rotateZ: modelRotate[2],
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
  };

  let renderer: THREE.WebGLRenderer;

  const customLayer = {
    id: '3d-model',
    type: 'custom',
    renderingMode: '3d',
    onAdd: (map: Map, gl: WebGLRenderingContext) => {
      const directionalLight = new THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(0, -70, 100).normalize();
      scene.add(directionalLight);

      const directionalLight2 = new THREE.DirectionalLight(0xffffff);
      directionalLight2.position.set(0, 70, 100).normalize();
      scene.add(directionalLight2);

      const loader = new GLTFLoader();
      loader.load(modelPath, (gltf) => {
        gltf.scene.scale.set(5000, 5000, 5000);
        scene.add(gltf.scene);
        model = gltf.scene;
        mixer = new THREE.AnimationMixer(gltf.scene);
      });

      mapRef.current = map;

      renderer = new THREE.WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl,
        antialias: true,
      });

      renderer.autoClear = false;
    },
    render: (_gl: WebGLRenderingContext, matrix: number[] | ArrayLike<number>) => {
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);

      const rotationX = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(1, 0, 0),
        modelTransform.rotateX,
      );
      const rotationY = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 1, 0),
        modelTransform.rotateY,
      );
      const rotationZ = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 0, 1),
        modelTransform.rotateZ,
      );

      const m = new THREE.Matrix4().fromArray(matrix);
      const l = new THREE.Matrix4()
        .makeTranslation(
          modelTransform.translateX,
          modelTransform.translateY,
          modelTransform.translateZ,
        )
        .scale(new THREE.Vector3(modelTransform.scale, -modelTransform.scale, modelTransform.scale))
        .multiply(rotationX)
        .multiply(rotationY)
        .multiply(rotationZ);

      camera.projectionMatrix = m.multiply(l);
      renderer.resetState();
      renderer.render(scene, camera);
      mapRef.current?.triggerRepaint();
    },
    updateLngLat: ({
      latLng,
      altitude,
      bearing,
    }: {
      latLng?: mapboxgl.LngLatLike;
      altitude?: number;
      bearing?: number;
    }) => {
      if (latLng) {
        modelOrigin = latLng;
      }
      if (altitude) {
        modelAltitude = altitude;
      }
      const updateMercator = mapboxgl.MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude);
      modelTransform.translateX = updateMercator.x;
      modelTransform.translateY = updateMercator.y;
      modelTransform.translateZ = updateMercator.z;

      if (bearing !== undefined) {
        modelTransform.rotateY = THREE.MathUtils.degToRad(bearing);
      }
    },
    updateCamera: (latLng: mapboxgl.LngLatLike) => {
      mapRef.current?.easeTo({
        center: latLng,
        duration: 1000,
      });
    },
    updateScale: (scale: number) => {
      modelTransform.scale = scale;
      model.scale.set(scale, scale, scale);
      modelTransform.scale = scale;
    },
  };

  return customLayer;
};
